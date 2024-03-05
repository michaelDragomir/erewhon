const mongoose = require('mongoose');

const stringValidator = (value) => {
	if (typeof value !== 'string') {
		throw new Error('Must be a string');
	}
};

const numberValidator = (value) => {
	if (typeof value !== 'number') {
		throw new Error('Must be a number');
	}
};

const bookSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: {
		type: String,
		required: [true, 'A title is required.'],
		validate: [stringValidator],
	},
	author: {
		type: String,
		required: [true, 'An Author is required.'],
		validate: [stringValidator],
	},
	publicationYear: {
		type: Number,
		required: [true, 'A year is required.'],
		validate: [numberValidator],
	},
});

module.exports = mongoose.model('Book', bookSchema);
