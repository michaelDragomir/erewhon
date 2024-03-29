const Book = require('../models/book');
const mongoose = require('mongoose');

exports.getAllBooks = async (req, res, next) => {
	const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
	const itemsPerPage = parseInt(req.query.pageSize) || 5; // Default to 5 items per page
	try {
		const allBooks = await Book.find()
			.select('title author publicationYear _id')
			.skip((page - 1) * itemsPerPage);
		// .limit(itemsPerPage);

		res.status(200).json(allBooks);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

exports.getBookStats = async (req, res, next) => {
	try {
		const bookStats = await Book.find();
		const response = {
			totalBookCount: bookStats.length,
			// returns an object with earliert/latest year.
			books: bookStats.reduce((acc, obj) => {
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
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

exports.getBookById = async (req, res, next) => {
	try {
		const id = req.params.bookId;
		const book = await Book.findById(id).select(
			'title author publicationYear _id'
		);

		if (book) {
			res.status(200).json(book);
		} else {
			res.status(404).json({ message: 'book not found' });
		}
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

exports.getBookByQuery = async (req, res, next) => {
	const { q } = req.query;
	try {
		// this aggregation pipeline is handled by mongo.  Checks against the database that match the specified conditions.
		const bookPipeline = [
			{
				$match: {
					$or: [
						{ title: { $regex: q, $options: 'i' } },
						{ author: { $regex: q, $options: 'i' } },
					],
				},
			},
		];

		const items = await Book.aggregate(bookPipeline);
		res.status(200).json({ items });
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

exports.postAddBook = async (req, res, next) => {
	console.log('REQ.BODY', req.body);
	try {
		const book = new Book({
			_id: new mongoose.Types.ObjectId(),
			title: req.body.title,
			author: req.body.author,
			publicationYear: req.body.publicationYear,
		});

		await book.save();

		res.status(201).json({
			message: 'Created book successfully',
			createBook: book,
		});
	} catch (error) {
		res.status(500).json({
			error: error,
		});
	}
};

// the assgnment called for using PUT to make parial updates. Patch would be more ideal for partial updates.
exports.putBookUpdateById = async (req, res, next) => {
	try {
		const id = req.params.bookId;
		const bookFields = req.body;
		const currentBook = await Book.findById(id);

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

exports.deleteBookById = async (req, res, next) => {
	try {
		const id = req.params.bookId;
		const book = await Book.deleteOne({ _id: id });

		if (book) {
			res.status(200).json({
				message: 'Book deleted successfully',
			});
		} else {
			res.status(404).json({ message: 'book not found.  Nothing to delete' });
		}
	} catch (error) {
		res.status(500).json({ error: error });
	}
};
