var TieuChiTemp = require('../Models/TieuChi');
var TieuChiModel = TieuChiTemp.TieuChiModel;

exports.listService = function (req, res) {
  TieuChiModel.find(function(err, _tieuchis) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err){
                res.send(err);
                return;
            }

            res.json(_tieuchis); 
  });
}

exports.listName = function (req, res) {
  TieuChiModel.find(function(err, _tieuchis) {
    var result = []
        if (err){
            res.send(result);
            return;
        }
        for (var i = 0; i < _tieuchis.length; i++) {
            result.push(_tieuchis[i].tentieuchi);
        }
        console.log(result);
        res.json(result); 
  });
}

exports.updateService = function(req,res){
  var idDetail = req.body._id;
  TieuChiModel.update({
      _id : idDetail
  },{
    giachuan : req.body.giachuan,
    phuphi: req.body.phuphi,
    phingoaigiongv: req.body.phingoaigiongv,
    phingoaigiokh: req.body.phingoaigiokh,
    diengiai :req.body.diengiai
    }, function (err, _details) {
    var result ={success:false};
    if (!err){
        result.success = true;
    }
    res.send(result);
  });
}



exports.createService = function (req, res) {

  TieuChiModel.create({
        tentieuchi :  req.body.tentieuchi,
        giachuan: req.body.giachuan,
        phuphi: req.body.phuphi,
        phingoaigiongv: req.body.phingoaigiongv,
        phingoaigiokh: req.body.phingoaigiokh,
        diengiai :req.body.diengiai
    }, function(err, tieuchi) {

        if (err){
            res.send({success:false});
            return;
        }
        res.send(tieuchi);
    });
};




exports.deleteService = function(req,res){
    TieuChiModel.remove({
        _id : req.params._id
    },function(err,_tieuchi)
        {
            var result = {success:false};
            if(!err){
                result.success = true;
                
            }
            res.send(result);
        });
};