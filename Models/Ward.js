var database = require('../Database/MongoDBDriver');
var WardSchema = new database.Schema({
  tenphuong : String,
  //1 khu vực có nhiều quận
  quan : String,
});
module.exports.WardModel = database.mongoose.model('phuong', WardSchema);