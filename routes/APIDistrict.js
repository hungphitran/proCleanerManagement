var DistrictTemp = require('../Models/District');
var DistrictModel = DistrictTemp.DistrictModel;
var WardTemp = require('../Models/Ward');
var WardModel = WardTemp.WardModel;
exports.listDistrict = function (req, res) {
  DistrictModel.find(function(err, _districts) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err){
                res.send(err);
                return;
            }

            res.json(_districts); // return all todos in JSON format
  });
}

exports.createDistrict = function (req, res) {
    var tenquanTemp = req.body.tenquan;
    var khuvucTemp = req.body.khuvuc;
    DistrictModel.find({
        tenquan : tenquanTemp
        
    },function(err, _districts) {
        var result = {success:false, exist:false};
        if (err){
            res.send(result);
            return;
        }
        if(_districts.length > 0){
            result.success = true;
            result.exist = true;
            res.send(result);
            return;
        }
        DistrictModel.create({
            tenquan : req.body.tenquan,
            khuvuc : khuvucTemp
        }, function(err, district) {
            if (err){
                res.send(result);
                return;
            }
            result.success = true;
            res.send(result);
        });
    });

};

exports.deleteDistrict = function(req,res){


    DistrictModel.remove({
        tenquan : req.params.tenquan
    },function(err,_location)
    {
        var result = {success:false};
        if(err){
            res.send(result);
            return;
        }
        WardModel.remove({
            quan : req.params.tenquan
        },function(err,_ward)
            {
                if(err){
                    res.send(result);
                    return;
                }
                result.success = true;
                res.send(result);
            });
    });

};