var db = require('../Database/MongoDBDriver');
var HelperBusyDateSchema = new db.Schema({
	cmnd : String,
	ngay : Date,
	giobd : Number,
	giokt : Number
});
module.exports.HelperBusyDate = db.mongoose.model('ngvban', HelperBusyDateSchema);