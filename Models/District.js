var database = require('../Database/MongoDBDriver');
var DistrictSchema = new database.Schema({
  tenquan : String,
  khuvuc : String
});
module.exports.DistrictModel = database.mongoose.model('quan', DistrictSchema);