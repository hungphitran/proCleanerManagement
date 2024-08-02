
var database = require('../Database/MongoDBDriver');

var HelperSchema = new database.Schema({
    cmnd : String,
    hoten : String,
    ngaylamviec:Date,
    ngaysinh : Date,
    sodt : String,
    quequan : String,
    diachi : {
        phuong : String,
        quan : String
    },
    sotruong :[],
    sonamkinhnghiem : Number,
    motakinhnghiem : String,
    hinhanh : String,
    giaykhamsuckhoe : [],
    luongcodinh : Number,
    mucluongtheogio : Number,
    danhgia :String,
    gioitinh:String,
    tinhtranghonnhan: String,
    dantoc : String,
    trinhdohocvan: String,
    chieucao :Number,
    cannang : Number,
    thongtincon:[]
});

module.exports.Helper = database.mongoose.model('nguoigiupviec', HelperSchema);
