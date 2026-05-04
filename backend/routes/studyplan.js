const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const StudyPlan = require('../models/StudyPlan');
const StudyMaterial = require('../models/StudyMaterial');
const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/studyplan
// Create a new study plan
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { examDate, subjects, topics, dailyStudyHours } = req.body;

    if (!examDate || !subjects || !topics || !dailyStudyHours) {
      return res.status(400).json({ msg: 'Please provide all required fields: examDate, subjects, topics, and dailyStudyHours' });
    }

    // Distribute topics across the days remaining until examDate
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);

    if (exam < today) {
      return res.status(400).json({ msg: 'Exam date cannot be in the past' });
    }

    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    // Basic distribution logic MVP
    const distributedTopics = [];
    if (topics && topics.length > 0) {
      const daysCount = diffDays > 0 ? diffDays : 1;
      const topicsPerDay = Math.ceil(topics.length / daysCount);
      
      let dayCounter = 0;
      topics.forEach((topicName, index) => {
        let assignedDate = new Date();
        assignedDate.setDate(assignedDate.getDate() + dayCounter);
        
        distributedTopics.push({
          name: topicName,
          dateAssigned: assignedDate,
          completed: false
        });

        if ((index + 1) % topicsPerDay === 0) {
          dayCounter++;
        }
      });
    }

    const newPlan = new StudyPlan({
      user: req.user.id,
      examDate,
      subjects,
      topics: distributedTopics,
      dailyStudyHours
    });

    await newPlan.save();
    console.log(`Study plan created for user ${req.user.id}`);
    res.json(newPlan);
  } catch (err) {
    console.error('Study Plan Creation Error:', err.message);
    res.status(500).json({ msg: 'Server error while creating study plan' });
  }
});

// POST /api/studyplan/generate
// Generate topics using AI from material text
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { materialId, examDate, dailyStudyHours } = req.body;

    if (!materialId || !examDate || !dailyStudyHours) {
      return res.status(400).json({ msg: 'Please provide materialId, examDate, and dailyStudyHours' });
    }

    const material = await StudyMaterial.findOne({ _id: materialId, user: req.user.id });
    if (!material) return res.status(404).json({ msg: 'Material not found' });

    // AI Topic Extraction
    let topics = [];
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      topics = ['Topic 1 (Mock)', 'Topic 2 (Mock)', 'Topic 3 (Mock)'];
    } else {
        const prompt = `Analyze this text and extract a list of 6-10 logical study topics/headings.
        Text: ${material.extractedText.substring(0, 30000)}`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseJsonSchema: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            });
            topics = JSON.parse(response.text);
        } catch (e) {
            console.error('Study Plan AI Generation Failed, using mock fallback:', e.message);
            topics = ['Core Concepts Overviews', 'Detailed Chapter Analysis', 'Formula and Theory Review', 'Practice Problems Set', 'Final Revision and Mock Test'];
        }
    }

    // Reuse distribution logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
    const distributedTopics = [];
    const daysCount = diffDays > 0 ? diffDays : 1;
    const topicsPerDay = Math.ceil(topics.length / daysCount);
    
    let dayCounter = 0;
    topics.forEach((topicName, index) => {
      let assignedDate = new Date(today);
      assignedDate.setDate(assignedDate.getDate() + dayCounter);
      distributedTopics.push({ name: topicName, dateAssigned: assignedDate, completed: false });
      if ((index + 1) % topicsPerDay === 0) dayCounter++;
    });

    const newPlan = new StudyPlan({
      user: req.user.id,
      examDate,
      subjects: [material.filename],
      topics: distributedTopics,
      dailyStudyHours
    });

    await newPlan.save();
    res.json(newPlan);
  } catch (err) {
    console.error('AI Study Plan Error:', err);
    res.status(500).json({ msg: 'AI generation failed: ' + err.message });
  }
});

// GET /api/studyplan
router.get('/', authMiddleware, async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(plan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/studyplan/:planId/topic/:topicId/toggle
router.put('/:planId/topic/:topicId/toggle', authMiddleware, async (req, res) => {
    try {
      const plan = await StudyPlan.findOne({ _id: req.params.planId, user: req.user.id });
      if (!plan) return res.status(404).json({ msg: 'Plan not found' });
  
      const topic = plan.topics.id(req.params.topicId);
      if (!topic) return res.status(404).json({ msg: 'Topic not found' });
      
      topic.completed = !topic.completed;
      await plan.save();
  
      res.json(plan);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
