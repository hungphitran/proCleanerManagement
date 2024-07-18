var StuffBusyTemp = require('../Models/OffDateStuff');
var offDateStuff = StuffBusyTemp.OffDateStuff;

var fs = require('fs');


exports.findOffDate = function (req, res) {
  offDateStuff.find({
      cmnd : req.params.cmnd
  }, function (err, _offDates) {
    if (err){
        res.send(err);
        return;
    }
    res.json(_offDates);
  });
}



exports.addOffDate = function (req, res) {
  offDateStuff.find({
      cmnd : req.body.cmnd,
      ngay : req.body.ngay
  }, function (err, _offDates) {
    if (err){
        res.send(err);
        return;
    }
    if(_offDates.length==0){
        offDateStuff.create({
            cmnd : req.body.cmnd,
            ngay : req.body.ngay,
            loai : req.body.loai
        }, function(err, _offDate) {
            if (err){
                res.send(err);
                return;
            }
            res.json(_offDate);
        });

    }else{
        offDateStuff.update({
            cmnd : req.body.cmnd,
            ngay : req.body.ngay
        },{ loai : req.body.loai }, function(err, _offDate) {
            if (err){
                res.send(err);
                return;
            }
            _offDates[0].loai = req.body.loai;
            res.json(_offDates[0]);
        });

    }

  });

  
};

exports.deleteOffDate = function(req,res){
    offDateStuff.remove({
        _id : req.params._id
    },function(err,_offDate){
        var result ={success:false};
         if (!err){
            result.success = true;
          }
        res.send(result); 
      });
};

exports.findOffDateForComputeSalary = function (cmndTemp) {
  offDateStuff.find({
      cmnd : cmndTemp
  }, function (err, _offDates) {
    if (err){
        res.send(err);
        return;
    }
    res.json(_offDates);
  });
}
