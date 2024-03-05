const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const bookRoutes = require('./routes/book');
const errorController = require('./controllers/error');

mongoose
	.connect(
		`mongodb+srv://michaeldragomir1:${process.env.MONGO_ATLAS_PW}@erewhoncasestudy.w1h7vkw.mongodb.net/`
	)
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((error) => {
		console.error('Error connecting to MongoDB:', error);
	});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/books', bookRoutes);

app.use(errorController.get404);

app.use(errorController.get500);

module.exports = app;
