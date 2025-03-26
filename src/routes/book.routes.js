// src/routes/book.routes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { authMiddleware, authorizeRoles } = require('../middleware/auth.middleware');

// CREATE a new book (librarian and admin)
router.post('/', 
    authMiddleware, 
    authorizeRoles('librarian', 'admin'), 
    bookController.createBook
);

// GET all books (all authenticated users)
router.get('/', 
    authMiddleware, 
    bookController.getAllBooks
);

// GET a specific book by ID
router.get('/:id', 
    authMiddleware, 
    bookController.getBookById
);

// UPDATE a book (librarian and admin)
router.put('/:id', 
    authMiddleware, 
    authorizeRoles('librarian', 'admin'), 
    bookController.updateBook
);

// DELETE a book (librarian and admin)
router.delete('/:id', 
    authMiddleware, 
    authorizeRoles('librarian', 'admin'), 
    bookController.deleteBook
);

module.exports = router;