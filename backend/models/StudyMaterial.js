const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
