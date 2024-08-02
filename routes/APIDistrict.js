const DistrictTemp = require('../Models/District');
const DistrictModel = DistrictTemp.DistrictModel;
const WardTemp = require('../Models/Ward');
const WardModel = WardTemp.WardModel;


module.exports.listDistrict = async (req, res) => {
    const records = await DistrictModel.find();

    res.json(records);
}

module.exports.createDistrict = async (req, res) => {
    const tenquanTemp = req.body.tenquan;
    const khuvucTemp = req.body.khuvuc;
    let result = {
        success: false,
        exist: false
    };

    const districtRecords = await DistrictModel.find({ tenquan: tenquanTemp });
    if (!districtRecords) {
        // res.send(result);
        res.status(500).json(req.body)
    }
    if (districtRecords.length > 0) {
        result.success = true;
        result.exist = true;
        res.send(result);
    }

    const newDistrict = await DistrictModel.create({ 
        tenquan: tenquanTemp,
        khuvuc: khuvucTemp
    });
    if (!newDistrict) {
        res.send(result);
    }

    result.success = true;
    res.send(result);
};

module.exports.deleteDistrict = async (req, res) => {
    const tenquan = req.params.tenquan;

    const isDeletedDistrict = await DistrictModel.deleteOne({ tenquan: tenquan });
    if (!isDeletedDistrict) {
        res.send({ success: false });
    }

    const isDeletedWard = await WardModel.deleteMany({ quan: tenquan });
    if (!isDeletedWard) {
        res.send({ success: false });
    }

    res.send({ success: true });
};