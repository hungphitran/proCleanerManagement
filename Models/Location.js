var database = require('../Database/MongoDBDriver');
var LocationSchema = new database.Schema({
  tenkhuvuc : String
});
module.exports.LocationModel = database.mongoose.model('khuvuc', LocationSchema);