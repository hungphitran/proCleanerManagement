
var database = require('../Database/MongoDBDriver');

var HelperSalarySchema = new database.Schema({
    startDate :Date,
    endDate:Date,
    cmnd :String,
    hoten : String,
    ngaylamviec:Date,
    ngaysinh : Date,
    sodt : Number,
    quequan : String,
    hinhanh :String,
    luongcodinh :Number,
    mucluongtheogio :Number,
    batdaulamviec :Boolean,
    listWorkTime :[],
    workTimeInside :Number,
    workTimeOutside :Number,
    workTimeTotal :Number,
    workDateInThisTimeRange :Number,
    totalWorkDateInMonth :Number,
    salary :Number,
    dateOffBeforeWork:Number,
    trangthai:String
});

module.exports.HelperSalary = database.mongoose.model('luongngv', HelperSalarySchema);