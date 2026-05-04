const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyMaterial'
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'unrated'],
    default: 'unrated'
  },
  nextReviewDate: {
    type: Date,
    default: Date.now
  },
  timesReviewed: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Flashcard', flashcardSchema);
