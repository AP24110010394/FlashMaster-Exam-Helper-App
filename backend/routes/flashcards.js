const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');
const authMiddleware = require('../middleware/auth');

// Get all flashcards for a deck
router.get('/deck/:deckId', authMiddleware.authenticate, flashcardController.getCardsByDeck);

// Create flashcard
router.post('/', authMiddleware.authenticate, flashcardController.createCard);

// Update flashcard
router.put('/:cardId', authMiddleware.authenticate, flashcardController.updateCard);

// Delete flashcard
router.delete('/:cardId', authMiddleware.authenticate, flashcardController.deleteCard);

module.exports = router;
