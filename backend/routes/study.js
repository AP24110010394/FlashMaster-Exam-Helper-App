const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');
const authMiddleware = require('../middleware/auth');

// Start study session
router.post('/session', authMiddleware.authenticate, studyController.startSession);

// Record card review
router.post('/review', authMiddleware.authenticate, studyController.recordReview);

// Get study statistics
router.get('/stats', authMiddleware.authenticate, studyController.getStats);

module.exports = router;
