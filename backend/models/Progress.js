const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalFlashcardsReviewed: {
    type: Number,
    default: 0
  },
  weakTopics: [{ type: String }],
  completionPercentage: {
    type: Number,
    default: 0
  },
  streakDays: {
    type: Number,
    default: 0
  },
  lastReviewDate: {
    type: Date,
    default: null
  },
  totalStudyMinutes: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
