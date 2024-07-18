var database = require('../Database/MongoDBDriver');

var CustomerSchema = new database.Schema({
	hoten:String,
	email:String,
	sdt:String,
	diachi:String,
	matkhau:String
});

module.exports.Customer = database.mongoose.model('khachhang', CustomerSchema);