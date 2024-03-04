const Book = require('../models/book');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

exports.getBooks = (req, res, next) => {
	Book.find()
		.limit(10)
		.select('title author publicationYear _id')
		.exec()
		.then((result) => {
			console.log(result);
			res.status(200).json(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};

exports.getBookStats = (req, res, next) => {
	Book.find()
		.exec()
		.then((result) => {
			const response = {
				totalBookCount: result.length,
				books: result.reduce((acc, obj) => {
					acc.earliestPublishingYear =
						acc.earliestPublishingYear === undefined
							? obj.publicationYear
							: Math.min(acc.earliestPublishingYear, obj.publicationYear);

					acc.latestPublishingYear =
						acc.latestPublishingYear === undefined
							? obj.publicationYear
							: Math.max(acc.latestPublishingYear, obj.publicationYear);

					return acc;
				}, {}),
			};
			res.status(200).json(response);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};

exports.getBookById = (req, res, next) => {
	const id = req.params.bookId;
	Book.findById(id)
		.exec()
		.then((book) => {
			console.log('from database', book);
			if (book) {
				res.status(200).json(book);
			} else {
				res.status(404).json({ message: 'item not found' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};

exports.getBookByQuery = async (req, res, next) => {
	const { q } = req.query;
	console.log(q, '!!!!!!');
	// try {
    // book.find()
    // book.match()

	if (title) {
		searchCriteria.title = title;
	}
	if (author) {
		searchCriteria.author = author;
	}
  //get all the books check if author or book title..

	// Use the search criteria to find matching items
	const foundItems = await Item.find(searchCriteria);
	res.json(foundItems);
	obj.title = title;
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

exports.postAddBook = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const book = new Book({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		author: req.body.author,
		publicationYear: req.body.publicationYear,
	});
	book
		.save()
		.then((result) => {
			res.status(201).json({
				message: 'Created book successfully',
				createBook: result,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
};

exports.putBookUpdateById = async (req, res, next) => {
	try {
		const id = req.params.bookId;
		const bookFields = req.body;
		const currentBook = await Book.findById(id);
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		if (!currentBook) {
			res.status(404).json({ message: 'item not found' });
		}

		const updatedBook = Object.assign(currentBook, bookFields);
		await updatedBook.save();

		res.status(200).json({ message: 'book has been updated' });
	} catch (error) {
		console.log('Error:', error);
		res.status(500).json({ error: error });
	}
};

exports.deleteBookById = (req, res, next) => {
	const id = req.params.bookId;
	Book.deleteOne({ _id: id })
		.exec()
		.then((result) => {
			console.log(result);
			res.status(200).json({
				message: 'Product deleted successfully',
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};
