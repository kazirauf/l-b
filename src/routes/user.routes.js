// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware, authorizeRoles } = require('../middleware/auth.middleware');

// GET all users (admin only)
router.get('/', 
    authMiddleware, 
    authorizeRoles('admin'), 
    userController.getAllUsers
);

// GET user profile (authenticated users)
router.get('/profile', 
    authMiddleware, 
    userController.getUserProfile
);

// UPDATE user profile
router.put('/profile', 
    authMiddleware, 
    userController.updateUserProfile
);

// DELETE user account
router.delete('/profile', 
    authMiddleware, 
    userController.deleteUserProfile
);

module.exports = router;