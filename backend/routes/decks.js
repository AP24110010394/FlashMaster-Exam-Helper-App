const express = require('express');
const router = express.Router();
const deckController = require('../controllers/deckController');
const authMiddleware = require('../middleware/auth');

// Get all decks for user
router.get('/', authMiddleware.authenticate, deckController.getUserDecks);

// Create deck
router.post('/', authMiddleware.authenticate, deckController.createDeck);

// Get deck details
router.get('/:deckId', authMiddleware.authenticate, deckController.getDeckDetails);

// Update deck
router.put('/:deckId', authMiddleware.authenticate, deckController.updateDeck);

// Delete deck
router.delete('/:deckId', authMiddleware.authenticate, deckController.deleteDeck);

module.exports = router;
