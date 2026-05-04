const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Progress = require('../models/Progress');
const Flashcard = require('../models/Flashcard');
const StudyPlan = require('../models/StudyPlan');

// GET /api/progress
router.get('/', authMiddleware, async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.user.id });
    
    if (!progress) {
      progress = new Progress({ user: req.user.id });
      await progress.save();
    }

    // Calculate dynamic completion percentage based on study plan
    const plan = await StudyPlan.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (plan && plan.topics.length > 0) {
      const completedTopics = plan.topics.filter(t => t.completed).length;
      progress.completionPercentage = Math.round((completedTopics / plan.topics.length) * 100);
      await progress.save();
    }

    // Determine weak topics from Flashcards
    const hardCards = await Flashcard.find({ user: req.user.id, difficulty: 'hard' }).populate('material');
    // Group by material metadata or simply show generic count for now
    const weakTopics = [...new Set(hardCards.map(c => c.material ? c.material.filename : 'General'))];
    progress.weakTopics = weakTopics;
    await progress.save();

    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
