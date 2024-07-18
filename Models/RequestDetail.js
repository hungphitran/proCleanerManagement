
var database = require('../Database/MongoDBDriver');

var RequestDetailSchema = new database.Schema({
    idyeucau : String,
	giobatdau : Date,
	gioketthuc : Date,
	nguoigiupviec :String,
	nhanxet : String,
	matdo :String,
	hudo : String,
	lienlac : String,
	trangthai :String,
	sogiongoaigio:Number,
    phingoaigio:Number,
    chiphingoaigio:Number
});

module.exports.RequestDetailModel = database.mongoose.model('chitietyeucau', RequestDetailSchema);
