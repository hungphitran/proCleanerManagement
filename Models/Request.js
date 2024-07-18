
var database = require('../Database/MongoDBDriver');

var RequestSchema = new database.Schema({
    ngaydatyeucau : Date,
    ngaybatdau : Date,
    ngayketthuc : Date,
    chiphi : Number,
    nhanvienxuly : String,
    sdtkhachhang : String,
    hoten :String,
    loaiyeucau : String,
    loaidichvu : [],
    trangthai : String,
    diachi : String,
    quan: String,
    hinhthuctt : String,
    nhanvienttcmnd : String,
    nhanvientthoten : String,

    // them moi
    giachuan:Number,
    sogiongoaigio:Number,
    phingoaigio:Number,
    chiphingoaigio:Number,
    phithoathuan:Number,
    noidat:String

});

module.exports.RequestModel = database.mongoose.model('yeucau', RequestSchema);
