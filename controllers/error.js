exports.get200 = (req, res, next) => {
	res
		.status(200)
		.json(
			'Welcome to this API.  There are instructions in the README file located in the project folder on how to interact with this server. 🚀 '
		);
	next(error);
};

exports.get404 = (req, res, next) => {
	const error = new Error('Houston, we have a problem');
	error.status = 200;
	next(error);
};

exports.get500 = (error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
};
