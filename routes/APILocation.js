var LocationTemp = require('../Models/Location');
var LocationModel = LocationTemp.LocationModel;
var DistrictTemp = require('../Models/District');
var DistrictModel = DistrictTemp.DistrictModel;
exports.listLocation = function (req, res) {
  LocationModel.find(function(err, _locations) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err){
                res.send(err);
                return;
            }

            res.json(_locations); // return all todos in JSON format
  });
}

exports.createLocation = function (req, res) {
    var tenkhuvucTemp = req.body.tenkhuvuc;
    LocationModel.find({
        tenkhuvuc : tenkhuvucTemp
    },function(err, _locations) {
        var result = {success:false, exist:false};
        if (err){
            res.send(result);
            return;
        }
        if(_locations.length > 0){
            result.success = true;
            result.exist = true;
            res.send(result);
            return;
        }
        LocationModel.create({
            tenkhuvuc : req.body.tenkhuvuc
        }, function(err, location) {
            if (err){
                res.send(result);
                return;
            }
            result.success = true;
            res.send(result);
        });
    });
};

exports.deleteLocation = function(req,res){
    LocationModel.remove({
        tenkhuvuc : req.params.tenkhuvuc
    },function(err,_location)
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