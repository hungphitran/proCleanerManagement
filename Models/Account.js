var db = require('../Database/MongoDBDriver');
var AccountSchema = new db.Schema({
	cmnd : Number,
	hoten : String,
	username:String,
	password : String,
	quyen : []
});
module.exports.Account = db.mongoose.model('taikhoan', AccountSchema);