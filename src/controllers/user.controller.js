// src/controllers/user.controller.js
const User = require('../models/user.model');

exports.getAllUsers = async (req, res) => {
    try {
        // Exclude sensitive information like password
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching users', 
            error: error.message 
        });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        // Find user by ID from authentication middleware
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching user profile', 
            error: error.message 
        });
    }
};

exports.updateUserProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email'];
    
    // Validate update fields
    const isValidOperation = updates.every(update => 
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Apply updates
        updates.forEach(update => {
            user[update] = req.body[update];
        });

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({ 
            message: 'Error updating profile', 
            error: error.message 
        });
    }
};

exports.deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            message: 'User account deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting user profile', 
            error: error.message 
        });
    }
};