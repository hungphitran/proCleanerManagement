var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports.mongoose = mongoose;
module.exports.Schema = Schema;
var username = "phong168"
var password = "omachi11";
var address = '@ds035693.mongolab.com:35693/myhelper';

// var username = "admin";
// var password = "admin";
// var address = '@ds035723.mongolab.com:35723/demo';

// Connect to mongo
function connect() {
	console.log('aaaamongoDB_driver - connect to db');
	var url = process.env.MONGO_URL;
	mongoose.connect(url);
}
function disconnect() {mongoose.disconnect()}
module.exports.connect = connect();
