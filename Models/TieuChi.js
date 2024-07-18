var database = require('../Database/MongoDBDriver');
var TieuChiSchema = new database.Schema({
  tentieuchi :  String,
  giachuan: Number,
  phuphi: String,
  phingoaigiongv: Number,
  phingoaigiokh: Number,
  diengiai :String
});
module.exports.TieuChiModel = database.mongoose.model('tieuchi', TieuChiSchema);