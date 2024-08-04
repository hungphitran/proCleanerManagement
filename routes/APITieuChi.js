const TieuChiTemp = require('../Models/TieuChi');
const TieuChiModel = TieuChiTemp.TieuChiModel;


module.exports.listService = async (req, res) => {
    const findTieuChi = await TieuChiModel.find();
    res.json(findTieuChi); 
}

module.exports.listName = async (req, res) => {
    const findTieuChi = await TieuChiModel.find();
    let result = [];

    if (!findTieuChi) {
        res.send(result);
    }
    for (let i = 0; i < findTieuChi.length; i++) {
        result.push(findTieuChi[i].tentieuchi);
    }
    console.log(result);
    res.json(result); 
}

module.exports.updateService = async (req, res) => {
    const idDetail = req.body._id;

    const updateTieuChi = await TieuChiModel.updateOne(
        {_id : idDetail},
        {
            giachuan : req.body.giachuan,
            phuphi: req.body.phuphi,
            phingoaigiongv: req.body.phingoaigiongv,
            phingoaigiokh: req.body.phingoaigiokh,
            diengiai :req.body.diengiai
        }
    );
    
    let result = {success: false};
    if (updateTieuChi) {
        result.success = true;
    }
    res.send(result);
}

module.exports.createService = async (req, res) => {
    const createTieuChi = await TieuChiModel.create(
        {
            tentieuchi :  req.body.tentieuchi,
            giachuan: req.body.giachuan,
            phuphi: req.body.phuphi,
            phingoaigiongv: req.body.phingoaigiongv,
            phingoaigiokh: req.body.phingoaigiokh,
            diengiai :req.body.diengiai
        }
    );
    if (!createTieuChi) {
        res.send({success: false});
    }
    res.send(createTieuChi);
};

module.exports.deleteService = async (req, res) => {
    const removeTieuChi = await TieuChiModel.deleteOne({_id : req.params._id});
    let result = {success: false};
    if (removeTieuChi) {
        result.success = true;
    }
    res.send(result);
};