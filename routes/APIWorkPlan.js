var WorkPlanTemp = require('../Models/WorkPlan');
var WorkPlanModel = WorkPlanTemp.WorkPlan;


exports.updateWorkPlanNGV = function(req,res){
  var idDetail = req.body.idchitietyc;
  var result ={success:false};

  WorkPlanModel.find({
      idchitietyc : idDetail
  }, function (err, _workPlans) {
    if (err){
        res.send(result);
        return;
    }
    if(_workPlans.length==0){

        WorkPlanModel.create({
            idchitietyc : req.body.idchitietyc,
            nguoigiupviec : req.body.nguoigiupviec,
            ngaylam : req.body.ngaylam,
            giobatdau : req.body.giobatdau,
            gioketthuc : req.body.gioketthuc+60,
            khachhang : req.body.khachhang,
        },function (err, _details) {
          if (!err){
              result.success = true;
          }
          res.send(result);
        });

    }else{
        WorkPlanModel.update({
            idchitietyc : idDetail
        },{nguoigiupviec : req.body.nguoigiupviec}, function (err, _details) {
          if (!err){
              result.success = true;
          }
          res.send(result);
        });
    }
  });
}

exports.updateWorkPlanTime = function(req,res){

  var idDetail = req.body.idchitietyc;
  var result ={success:false};

  WorkPlanModel.find({
      idchitietyc : idDetail
  }, function (err, _workPlans) {
    if (err){
        res.send(result);
        return;
    }
    if(_workPlans.length==0){

       var result ={success:false};
          if (!err){
              result.success = true;
          }
          res.send(result);

    }else{
        WorkPlanModel.update({
            idchitietyc : idDetail
        },{giobatdau : req.body.giobatdau, gioketthuc : req.body.gioketthuc+60}, function (err, _details) {
          var result ={success:false};
          if (!err){
              result.success = true;
          }
          res.send(result);
        });
    }
  });
}

exports.deleteWorkPlan = function(req,res){
    WorkPlanModel.remove({
        idchitietyc : req.params.idchitietyc
    },function(err,_workp){
        var result ={success:false};
         if (!err){
            result.success = true;
          }
        res.send(result); 
      });
};

exports.deleteWorkPlanByID = function(id){
    WorkPlanModel.remove({
        idchitietyc : id
    },function(err,_workp){
         if (err){
            deleteWorkPlanByID(id);
          }
      });
};

exports.findByNGV = function(req,res){
  console.log("find lich lam viec");

  WorkPlanModel.find({
      nguoigiupviec : req.params.cmnd
  }, function (err, _workPlans) {
    if (err){
        res.send(err);
        return;
    }
    res.json(_workPlans);
  });
}
exports.findByNGVFromToday = function(req,res){
  var today = new Date();
  today.setHours(7);
  today.setSeconds(0);
  today.setMinutes(0);
  today.setMilliseconds(0);
  console.log(today);
  WorkPlanModel.find({
      nguoigiupviec : req.params.cmnd,
      ngaylam:{$gte:today}
  }, function (err, _workPlans) {
    if (err){
        res.send(err);
        return;
    }
    res.json(_workPlans);
  });
}