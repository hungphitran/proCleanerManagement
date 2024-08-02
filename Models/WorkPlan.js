var database = require('../Database/MongoDBDriver');

var WorkPlanSchema = new database.Schema({
	idchitietyc : String,
 	nguoigiupviec : String,
 	ngaylam : Date,
 	giobatdau : Number,
 	gioketthuc : Number
});

module.exports.WorkPlan = database.mongoose.model('lichlamviec', WorkPlanSchema);
