const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const authMiddleware = require('../middleware/authMiddleware');
const StudyMaterial = require('../models/StudyMaterial');

// Multer: store in memory (for parsing), max 10MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'), false);
    }
  }
});

// POST /api/materials/upload
router.post('/upload', authMiddleware, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: 'File too large. Maximum size is 100MB.' });
      }
      return res.status(400).json({ msg: err.message });
    } else if (err) {
      return res.status(400).json({ msg: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    let extractedText = '';

    if (req.file.mimetype === 'application/pdf') {
      try {
        const data = await pdfParse(req.file.buffer);
        if (!data || !data.text || data.text.trim().length === 0) {
           extractedText = 'The PDF appears to be empty or contains only scanned images (unrecognized text). Only text-based PDFs are supported for AI generation.';
        } else {
           extractedText = data.text;
        }
      } catch (pdfErr) {
        console.error('PDF parse error:', pdfErr.message);
        extractedText = 'Could not extract text from this PDF file.';
      }
    } else if (req.file.mimetype === 'text/plain') {
      extractedText = req.file.buffer.toString('utf-8');
    } else {
      extractedText = 'File type not supported for text extraction.';
    }

    const material = new StudyMaterial({
      user: req.user.id,
      filename: req.file.originalname,
      type: req.file.mimetype,
      extractedText,
      fileSize: req.file.size
    });

    await material.save();
    res.json(material);
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ msg: 'Server error processing file' });
  }
});

// GET /api/materials
router.get('/', authMiddleware, async (req, res) => {
  try {
    const materials = await StudyMaterial.find({ user: req.user.id })
      .select('-extractedText')
      .sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/materials/:id — get single material with full text
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const material = await StudyMaterial.findOne({ _id: req.params.id, user: req.user.id });
    if (!material) return res.status(404).json({ msg: 'Material not found' });
    res.json(material);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/materials/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const material = await StudyMaterial.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!material) return res.status(404).json({ msg: 'Material not found' });
    res.json({ msg: 'Material deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
