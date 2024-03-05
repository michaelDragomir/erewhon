const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Book = require('../../models/book');
const booksRouter = require('../../controllers/books');
const { mockRequest, mockResponse } = require('jest-mock-req-res');
const {
	postAddBook,
	deleteBookById,
	putBookUpdateById,
	getBookByQuery,
	getBookStats,
} = require('../../controllers/books');

jest.mock('../../models/Book'); // Mock the Book model

describe('GET /books', () => {
	it('responds with a list of books', async () => {
		// Mock the data returned by the Book model
		const mockedBooks = [
			{
				title: 'Book 1',
				author: 'Author 1',
				publicationYear: 2020,
				_id: 'mockedId1',
			},
			{
				title: 'Book 2',
				author: 'Author 2',
				publicationYear: 2021,
				_id: 'mockedId2',
			},
		];

		// Set up the mock to return the data
		jest.spyOn(booksRouter, 'find').mockResolvedValueOnce(mockedBooks);

		// Use supertest to make a request to your route
		const response = await request(app).use('/books', booksRouter).get('/');

		// Assertions
		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockedBooks);
	});
});

describe('GET /books/:bookId', () => {
	it('responds with a book when it exists', async () => {
		// Mock data for an existing book
		const mockedBook = {
			_id: 'mockedId',
			title: 'Mocked Book',
			author: 'Mocked Author',
			publicationYear: 2022,
		};

		// Set up the mock to return the data
		Book.findById.mockResolvedValueOnce(mockedBook);

		// Use supertest to make a request to your route
		const response = await request(app)
			.use('/books/:bookId', booksRouter)
			.get('/mockedId');

		// Assertions
		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockedBook);
	});
});

describe('POST /books', () => {
	it('should create a new book and return a response', async () => {
		// Mock request and response objects
		const req = mockRequest({
			body: {
				title: 'Test Book',
				author: 'Test Author',
				publicationYear: 2022,
			},
		});
		const res = mockResponse();

		// Mock the behavior of the Book model and mongoose.Types.ObjectId
		Book.mockImplementationOnce(() => ({
			_id: 'mockedObjectId',
			title: req.body.title,
			author: req.body.author,
			publicationYear: req.body.publicationYear,
			save: jest.fn(), // Mock the save method
		}));
		mongoose.Types.ObjectId.mockReturnValue('mockedObjectId');

		// Call the route handler
		await postAddBook(req, res);

		// Assertions
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Created book successfully',
			createBook: {
				_id: 'mockedObjectId',
				title: 'Test Book',
				author: 'Test Author',
				publicationYear: 2022,
			},
		});
		expect(Book).toHaveBeenCalledWith({
			_id: 'mockedObjectId',
			title: 'Test Book',
			author: 'Test Author',
			publicationYear: 2022,
		});
		expect(mongoose.Types.ObjectId).toHaveBeenCalled();
		expect(Book.prototype.save).toHaveBeenCalled();
	});
});

describe('deleteBookById', () => {
	it('should delete a book and return a success message', async () => {
		// Mock request and response objects
		const req = mockRequest({
			params: {
				bookId: 'mockedBookId',
			},
		});
		const res = mockResponse();

		// Mock the behavior of the Book model
		Book.deleteOne.mockResolvedValue({ n: 1 }); // Mock a successful deletion

		// Call the route handler
		await deleteBookById(req, res);

		// Assertions
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Book deleted successfully',
		});
		expect(Book.deleteOne).toHaveBeenCalledWith({ _id: 'mockedBookId' });
	});
});

describe('putBookUpdateById', () => {
	it('should update an existing book and return a 200 status code', async () => {
		// Mock request and response objects
		const req = mockRequest({
			params: {
				bookId: 'mockedBookId',
			},
			body: {
				title: 'Updated Title',
				author: 'Updated Author',
				publicationYear: 2022,
			},
		});
		const res = mockResponse();

		// Mock the behavior of the Book model
		const existingBook = {
			_id: 'mockedBookId',
			title: 'Old Title',
			author: 'Old Author',
			publicationYear: 2020,
			save: jest.fn(), // Mock the save method
		};
		Book.findById.mockResolvedValueOnce(existingBook);

		// Call the route handler
		await putBookUpdateById(req, res);

		// Assertions
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'book has been updated',
		});
		expect(Book.findById).toHaveBeenCalledWith('mockedBookId');
		expect(existingBook.save).toHaveBeenCalled();
		expect(existingBook.title).toBe('Updated Title');
		expect(existingBook.author).toBe('Updated Author');
		expect(existingBook.publicationYear).toBe(2022);
	});
});

describe('getBookByQuery', () => {
	it('should respond with books matching the query', async () => {
		const req = mockRequest({
			query: {
				q: 'MockedQuery',
			},
		});
		const res = mockResponse();

		// Mock the behavior of the Book model
		Book.aggregate.mockResolvedValueOnce([
			{ title: 'Mocked Book 1', author: 'Mocked Author 1' },
			{ title: 'Mocked Book 2', author: 'Mocked Author 2' },
		]);

		// Call the route handler
		await getBookByQuery(req, res);

		// Assertions
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			items: [
				{ title: 'Mocked Book 1', author: 'Mocked Author 1' },
				{ title: 'Mocked Book 2', author: 'Mocked Author 2' },
			],
		});
		expect(Book.aggregate).toHaveBeenCalledWith([
			{
				$match: {
					$or: [
						{ title: { $regex: 'MockedQuery', $options: 'i' } },
						{ author: { $regex: 'MockedQuery', $options: 'i' } },
					],
				},
			},
		]);
	});
});

describe('getBookStats', () => {
	it('should return book statistics', async () => {
		const req = mockRequest();
		const res = mockResponse();

		const mockedBooks = [
			{ publicationYear: 2000 },
			{ publicationYear: 2010 },
			{ publicationYear: 1995 },
		];

		// Mock the behavior of the Book model
		Book.find.mockResolvedValueOnce(mockedBooks);

		await getBookStats(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			totalBookCount: 3,
			books: {
				earliestPublishingYear: 1995,
				latestPublishingYear: 2010,
			},
		});
	});
});
