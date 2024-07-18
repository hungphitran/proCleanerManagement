var HelperBusyTemp = require('../Models/HelperBusyDate');
var helperBusyDate = HelperBusyTemp.HelperBusyDate;
var WorkPlanTemp = require('../Models/WorkPlan');
var WorkPlanModel = WorkPlanTemp.WorkPlan;
var fs = require('fs');
var RequestDetailTemp = require('../Models/RequestDetail');
var RequestDetailModel = RequestDetailTemp.RequestDetailModel;

exports.findBusyDate = function (req, res) {
  var today = new Date();
  today.setHours(7);
  today.setSeconds(0);
  today.setMinutes(0);
  today.setMilliseconds(0);
  helperBusyDate.find({
      cmnd : req.params.cmnd,
      ngay : {$gte:today}
  }, function (err, _busyDates) {
    if (err){
        res.send(err);
        return;
    }
    res.json(_busyDates);
  });
}

exports.checkExistsWorkPlan = function(req, res){
    var cmndTemp = req.body.cmnd;
    var giobdTemp = req.body.giobd;
    var gioktTemp = req.body.giokt;
    var ngayTemp = req.body.ngay;

    WorkPlanModel.find({
        nguoigiupviec : req.body.cmnd,
        ngaylam:ngayTemp,
        $or:[
              {giobatdau : {$gte:giobdTemp, $lt:gioktTemp}},
              {gioketthuc : {$gt:giobdTemp, $lte:gioktTemp}},
              {
                giobatdau : { $lte:giobdTemp},
                gioketthuc : {$gte:gioktTemp}
              },
            ]

    }, function (err, _workPlans) {
      var result = {success:false};
      if (err){
          res.send(result);
          return;
      }
      if(_workPlans.length == 0){
        req.body.listCTYC = [];
        
        addBusyTime2(req, res);
      }else{
          result.listCTYC = [];
          for (var i = 0; i < _workPlans.length; i++) {
            result.listCTYC.push(_workPlans[i].idchitietyc);
          };
          result.success = true;
          result.existsWorkPlan = true;
          result.listWorkPlan = _workPlans;
          res.send(result); 
          return;
      }

    });


}

function addBusyTime2(req, res) {
  console.log("add");
  console.log(req.body.listCTYC);
  var listCTYC = req.body.listCTYC;
  for (var i = 0; i < listCTYC.length; i++) {
    removeWorkPlanOfNGV(listCTYC[i]);
  };

  helperBusyDate.create({
            cmnd : req.body.cmnd,
            giobd : req.body.giobd,
            giokt : req.body.giokt,
            ngay : req.body.ngay
        }, function(err, _busyTime) {
          var result = {success:false};
          if (err){
              res.send(err);
              return;
          }
          result.success = true;
          result.existsWorkPlan = false;
          result.busyTime = _busyTime;
          
          res.send(result); 
          return;
        });
};

exports.addBusyTime = function(req, res) {
  console.log("add");
  console.log(req.body.listCTYC);
  var listCTYC = req.body.listCTYC;
  for (var i = 0; i < listCTYC.length; i++) {
    removeWorkPlanOfNGV(listCTYC[i]);
  };

  helperBusyDate.create({
            cmnd : req.body.cmnd,
            giobd : req.body.giobd,
            giokt : req.body.giokt,
            ngay : req.body.ngay
        }, function(err, _busyTime) {
          var result = {success:false};
          if (err){
              res.send(err);
              return;
          }
          result.success = true;
          result.existsWorkPlan = false;
          result.busyTime = _busyTime;
          
          res.send(result); 
          return;
        });
};

function removeWorkPlanOfNGV(idCTYC){
  RequestDetailModel.update({
    _id:idCTYC
  },{
    nguoigiupviec:"", 
    trangthai:"Chưa giao"
  },function(err,_RQDetails){
    if(!err){
      WorkPlanModel.remove({
        idchitietyc:idCTYC
      }, function(err, wp){

      })
    }
  });
}


exports.deleteBusyTime = function(req,res){
    helperBusyDate.remove({
        _id : req.params._id
    },function(err,_workp){
        var result ={success:false};
         if (!err){
            result.success = true;
          }
        res.send(result); 
      });
};
