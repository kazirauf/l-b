const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// User Registration Route
router.post('/register', authController.register);

// User Login Route
router.post('/login', authController.login);

// Logout Route (optional - typically handled client-side by removing token)
router.post('/logout', authMiddleware, (req, res) => {
    // Could be used for additional logout logic like blacklisting tokens
    res.json({ message: 'Logged out successfully' });
});

// Password Reset Request Route (placeholder for future implementation)
router.post('/forgot-password', (req, res) => {
    res.status(501).json({ 
        message: 'Password reset functionality not yet implemented' 
    });
});

module.exports = router;