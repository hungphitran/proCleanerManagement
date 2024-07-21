const WardTemp = require('../Models/Ward');
const WardModel = WardTemp.WardModel;

module.exports.listWard = async (req, res) => {
    const findWard = await WardModel.find();
    res.json(findWard); // return all todos in JSON format
}

module.exports.createWard = async (req, res) => {
    const tenquanTemp = req.body.quan;
    const tenphuongTemp = req.body.tenphuong;

    const findWard = await WardModel.find(
        {
            tenphuong: tenphuongTemp,
            quan: tenquanTemp
        }
    );
    let result = {success:false, exist:false};
    if (!findWard) {
        res.send(result);
    }
    if(findWard.length > 0){
        result.success = true;
        result.exist = true;
        res.send(result);
    }

    const createWard = await WardModel.create(
        {
            tenphuong: tenphuongTemp,
            quan: tenquanTemp
        }
    );
    if (!createWard) {
        res.send(result);
    }
    result.success = true;
    res.send(result);
}

module.exports.deleteWard = async (req, res) => {
    const removeWard = await WardModel.deleteOne({_id : req.params._id});
    
    let result = {success:false};
    if (!removeWard) {
        res.send(result);
    }
    result.success = true;
    res.send(result);
}