const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examDate: {
    type: Date,
    required: true
  },
  subjects: [{
    type: String
  }],
  topics: [{
    name: String,
    dateAssigned: Date,
    completed: { type: Boolean, default: false }
  }],
  dailyStudyHours: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
