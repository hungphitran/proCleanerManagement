
var database = require('../Database/MongoDBDriver');

var StuffSchema = new database.Schema({
    cmnd : String,
    hoten : String,
    ngaysinh : Date,
    ngaylamviec:Date,
    sodt :  String,
    quequan : String,
    hinhanh : String,
    luong : Number,
    quyenhethong : Number,
    email : String,
});

module.exports.Stuff = database.mongoose.model('nhanvien', StuffSchema);
