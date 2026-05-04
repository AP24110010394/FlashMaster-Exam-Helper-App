const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Flashcard = require('../models/Flashcard');
const StudyMaterial = require('../models/StudyMaterial');
const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper to generate flashcards
const generateCards = async (text) => {
  // Mock data if no real Gemini API key is provided
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return [
      { question: "(Mock) What is the main topic of this document?", answer: "This is a placeholder flashcard because no valid API key was found in .env.", difficulty: "unrated" },
      { question: "(Mock) How many characters were extracted?", answer: `${text?.length || 0} characters were extracted from your file.`, difficulty: "unrated" },
      { question: "(Mock) What should you do to get real AI flashcards?", answer: "Add a real Gemini API key to your backend .env file.", difficulty: "unrated" }
    ];
  }

  const prompt = `Generate an array of flashcards from the following text. 
Limit answers to 1-2 lines. Remove duplicates.
Text: ${text.substring(0, 30000)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING }
            },
            required: ["question", "answer"]
          }
        }
      }
    });

    let generatedCards = JSON.parse(response.text);
    
    // Ensure it's an array
    if (!Array.isArray(generatedCards)) {
      if (generatedCards.flashcards && Array.isArray(generatedCards.flashcards)) {
        generatedCards = generatedCards.flashcards;
      } else if (generatedCards.cards && Array.isArray(generatedCards.cards)) {
        generatedCards = generatedCards.cards;
      } else {
        const potentialArray = Object.values(generatedCards).find(Array.isArray);
        generatedCards = potentialArray || [];
      }
    }

    // Double check properties
    return generatedCards.map(card => ({
      question: card.question || card.q || 'Question not generated',
      answer: card.answer || card.a || 'Answer not generated',
      difficulty: card.difficulty || 'unrated'
    })).filter(card => card.question && card.answer);
  } catch (e) {
    console.error('AI Generation Failed, using mock fallback:', e.message);
    return [
      { question: "(Mock Fallback) Key concepts from your material?", answer: "The AI was busy or quota was reached, but I've extracted the main points: " + text.substring(0, 100).replace(/\n/g, ' ') + "...", difficulty: "unrated" },
      { question: "(Mock Fallback) Important definition?", answer: "This is a placeholder answer based on your file content.", difficulty: "unrated" }
    ];
  }
};

// POST /api/flashcards/generate
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { materialId } = req.body;
    const material = await StudyMaterial.findOne({ _id: materialId, user: req.user.id });
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }

    const generatedCards = await generateCards(material.extractedText);
    
    const savedCards = [];
    for (const card of generatedCards) {
      const newCard = new Flashcard({
        user: req.user.id,
        material: material._id,
        question: card.question,
        answer: card.answer,
        difficulty: 'unrated'
      });
      await newCard.save();
      savedCards.push(newCard);
    }
    
    res.json(savedCards);
  } catch (err) {
    console.error('API Error during generation:', err);
    res.status(500).json({ msg: err.message || 'Server error during generation' });
  }
});

// GET /api/flashcards
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cards = await Flashcard.find({ user: req.user.id }).sort({ nextReviewDate: 1 });
    res.json(cards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/flashcards/:id — Spaced Repetition + Streak Tracking
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { difficulty } = req.body;
    const card = await Flashcard.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!card) return res.status(404).json({ msg: 'Card not found' });

    let nextReviewDate = new Date();
    if (difficulty === 'easy') {
      nextReviewDate.setDate(nextReviewDate.getDate() + 3);
    } else if (difficulty === 'medium') {
      nextReviewDate.setDate(nextReviewDate.getDate() + 1);
    } else {
      nextReviewDate.setDate(nextReviewDate.getDate() + 0);
    }

    card.difficulty = difficulty;
    card.nextReviewDate = nextReviewDate;
    card.timesReviewed += 1;
    
    await card.save();

    // Update progress + streak
    const Progress = require('../models/Progress');
    let userProgress = await Progress.findOne({ user: req.user.id });
    if (!userProgress) {
      userProgress = new Progress({ user: req.user.id });
    }
    userProgress.totalFlashcardsReviewed += 1;

    // Streak logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (userProgress.lastReviewDate) {
      const last = new Date(userProgress.lastReviewDate);
      last.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        // Same day — keep streak
      } else if (diffDays === 1) {
        // Consecutive day — increment streak
        userProgress.streakDays = (userProgress.streakDays || 0) + 1;
        userProgress.lastReviewDate = new Date();
      } else {
        // Streak broken
        userProgress.streakDays = 1;
        userProgress.lastReviewDate = new Date();
      }
    } else {
      userProgress.streakDays = 1;
      userProgress.lastReviewDate = new Date();
    }

    await userProgress.save();

    res.json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/flashcards/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const card = await Flashcard.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!card) return res.status(404).json({ msg: 'Card not found' });
    res.json({ msg: 'Flashcard deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/flashcards/log-time — log Pomodoro study time
router.post('/log-time', authMiddleware, async (req, res) => {
  try {
    const { minutes } = req.body;
    if (!minutes || minutes <= 0) return res.status(400).json({ msg: 'Invalid minutes' });

    const Progress = require('../models/Progress');
    let userProgress = await Progress.findOne({ user: req.user.id });
    if (!userProgress) {
      userProgress = new Progress({ user: req.user.id });
    }
    userProgress.totalStudyMinutes = (userProgress.totalStudyMinutes || 0) + minutes;
    await userProgress.save();
    res.json({ totalStudyMinutes: userProgress.totalStudyMinutes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
