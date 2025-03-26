// src/controllers/book.controller.js
const Book = require('../models/book.model');

exports.createBook = async (req, res) => {
    try {
        const bookData = {
            ...req.body,
            createdBy: req.user._id
        };

        const book = new Book(bookData);
        await book.save();

        res.status(201).json({
            message: 'Book created successfully',
            book
        });
    } catch (error) {
        res.status(400).json({ 
            message: 'Error creating book', 
            error: error.message 
        });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        // Optional filtering and pagination
        const { 
            search, 
            genre, 
            page = 1, 
            limit = 10 
        } = req.query;

        const queryConditions = {};

        if (search) {
            queryConditions.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        if (genre) {
            queryConditions.genre = genre;
        }

        const books = await Book.find(queryConditions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('createdBy', 'username email');

        const total = await Book.countDocuments(queryConditions);

        res.json({
            books,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching books', 
            error: error.message 
        });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('createdBy', 'username email');

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching book', 
            error: error.message 
        });
    }
};

exports.updateBook = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        'title', 'author', 'isbn', 
        'genre', 'publishYear', 
        'totalCopies', 'availableCopies'
    ];
    
    const isValidOperation = updates.every(update => 
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Prevent users from changing book's creator
        updates.forEach(update => {
            book[update] = req.body[update];
        });

        await book.save();

        res.json({
            message: 'Book updated successfully',
            book
        });
    } catch (error) {
        res.status(400).json({ 
            message: 'Error updating book', 
            error: error.message 
        });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ 
            message: 'Book deleted successfully',
            book 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting book', 
            error: error.message 
        });
    }
};