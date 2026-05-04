const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware.authenticate, authController.logout);
router.get('/profile', authMiddleware.authenticate, authController.getProfile);
router.put('/profile', authMiddleware.authenticate, authController.updateProfile);

module.exports = router;
