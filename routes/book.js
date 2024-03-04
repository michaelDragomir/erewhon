const express = require('express');
const booksController = require('../controllers/books');

const router = express.Router();
router.get('/search', booksController.getBookByQuery);
router.get('/', booksController.getBooks);
router.get('/stats', booksController.getBookStats);
router.get('/:bookId', booksController.getBookById);
router.post('/', booksController.postAddBook);
router.put('/:bookId', booksController.putBookUpdateById);
router.delete('/:bookId', booksController.deleteBookById);

module.exports = router;
