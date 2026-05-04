const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Note = require('../models/Note');

// GET /api/notes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/notes
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, material, color } = req.body;
    if (!title || !content) {
      return res.status(400).json({ msg: 'Title and content are required' });
    }
    const note = new Note({
      user: req.user.id,
      title,
      content,
      material: material || null,
      color: color || 'purple'
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/notes/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content, color } = req.body;
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ msg: 'Note not found' });

    if (title) note.title = title;
    if (content) note.content = content;
    if (color) note.color = color;
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/notes/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    res.json({ msg: 'Note deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
