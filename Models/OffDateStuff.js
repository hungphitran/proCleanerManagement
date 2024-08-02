var db = require('../Database/MongoDBDriver');
var OffDateStuffSchema = new db.Schema({
	cmnd : String,
	ngay : Date,
	loai : String
});
module.exports.OffDateStuff = db.mongoose.model('lichnghinv', OffDateStuffSchema);