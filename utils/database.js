const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
	MongoClient.connect(
		'mongodb+srv://michaeldragomir1:dYQW1OQR9xeqECIX@erewhoncasestudy.w1h7vkw.mongodb.net/'
	)
		.then((client) => {
			console.log('CONNECTED');
			_db = client.db();
			cb();
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
};

const getDb = () => {
	if (_db) {
		return _db;
	}
	throw 'No database found.';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
