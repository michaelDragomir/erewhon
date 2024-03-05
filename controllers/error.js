exports.get404 = (req, res, next) => {
	const error = new Error(
		'Welcome but if you see this, you hit a snag. check your routes, There are instructions in the README file located in the project folder on how to interact with this server. 🚀'
	);
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
