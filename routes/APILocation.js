const LocationTemp = require('../Models/Location');
const LocationModel = LocationTemp.LocationModel;
const DistrictTemp = require('../Models/District');
const DistrictModel = DistrictTemp.DistrictModel;
module.exports.listLocation = async (req, res) => {
  const locations = await LocationModel.find();

  if (!locations) {
    res.send(err);
    return;
  }
  res.json(locations);
}



module.exports.createLocation = async (req, res) => {
    const tenkhuvucTemp = req.body.tenkhuvuc;
    const result = {success: true, exist: false};

    try {
        const locations = await LocationModel.find({tenkhuvuc: tenkhuvucTemp});
        if(locations.length > 0) {
            result.success = true;
            result.exist = true;
            return res.send(result);
        }
    
        const newLocation = new LocationModel({
            tenkhuvuc: req.body.tenkhuvuc
        })

        await newLocation.save();
        result.success = true;
        res.send(result);
    } catch (error) {
        res.send(result);
    }
};

// deleteOne: xóa một địa điểm duy nhất từ cơ sở dữ liệu đó là tenkhuvuc.
// deleteCount: đếm số địa điểm đã bị xóa
// 2 cái này lấy từ thư viện ORM  => npm install mongoose
module.exports.deleteLocation = async (req,res) => {
    const tenkhuvuc = req.params.tenkhuvuc;
    await LocationModel.deleteOne({tenkhuvuc: tenkhuvuc});
    res.send({success: true});
};