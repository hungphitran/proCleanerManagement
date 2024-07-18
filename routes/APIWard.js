var WardTemp = require('../Models/Ward');
var WardModel = WardTemp.WardModel;

exports.listWard = function (req, res) {
  WardModel.find(function(err, _wards) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err){
                res.send(err);
                return;
            }

            res.json(_wards); // return all todos in JSON format
  });
}

exports.createWard = function (req, res) {
    var tenquanTemp = req.body.quan;
    var tenphuongTemp = req.body.tenphuong;
    WardModel.find({
        tenphuong : tenphuongTemp,
        quan : tenquanTemp
    },function(err, _wards) {
        console.log(err);
        console.log(_wards);
        var result = {success:false, exist:false};
        if (err){
            res.send(result);
            return;
        }
        if(_wards.length > 0){
            result.success = true;
            result.exist = true;
            res.send(result);
            return;
        }
        WardModel.create({
            tenphuong : tenphuongTemp,
            quan : tenquanTemp
        }, function(err, ward) {
            console.log(err);
            console.log(ward);
            if (err){
                res.send(result);
                return;
            }
            result.success = true;
            res.send(result);
        });
    });



};

exports.deleteWard = function(req,res){
    WardModel.remove({
        _id : req.params._id
    },function(err,_ward)
        {
            var result = {success:false};
            if(err){
                res.send(result);
                return;
            }
            result.success = true;
            res.send(result);
        });
};