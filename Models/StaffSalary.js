
var database = require('../Database/MongoDBDriver');

var StaffSalarySchema = new database.Schema({
    startDate :Date,
    endDate:Date,
    cmnd :String,
    hoten : String,
    ngaylamviec:Date,
    ngaysinh : Date,
    sodt : String,
    quequan : String,
    hinhanh :String,
    luong :Number,
    batdaulamviec :Boolean,
    listOffDate :[],
    workDate :Number,
    offDate :Number,
    workDateInThisTimeRange :Number,
    totalWorkDateInMonth :Number,
    salary :Number,
    trangthai:String
});

module.exports.StaffSalary = database.mongoose.model('luongnhanvien', StaffSalarySchema);