const HelperBusyTemp = require('../Models/HelperBusyDate');
const helperBusyDate = HelperBusyTemp.HelperBusyDate;
const WorkPlanTemp = require('../Models/WorkPlan');
const WorkPlanModel = WorkPlanTemp.WorkPlan;
const fs = require('fs');
const RequestDetailTemp = require('../Models/RequestDetail');
const RequestDetailModel = RequestDetailTemp.RequestDetailModel;

module.exports.findBusyDate = async (req, res) => {
  const today = new Date();
  today.setHours(7);
  today.setSeconds(0);
  today.setMinutes(0);
  today.setMilliseconds(0);

  const record = await helperBusyDate.find(
  { 
    cmnd: req.params.cmnd, 
    ngay: { $gte: today } 
  });

  res.json(record);
}

module.exports.checkExistsWorkPlan = async (req, res) => {
  const cmnd = req.body.cmnd;
  const giobd = req.body.giobd;
  const giokt = req.body.giokt;
  const ngay = req.body.ngay;
  let result = { success:false };

  const workPlans = await WorkPlanModel.find(
    {
      nguoigiupviec: cmnd,
      ngaylam: ngay,
      $or: [
        { giobatdau: { $gte: giobd, $lt: giokt } },
        { gioketthuc: { $gt: giobd, $lte: giokt } },
        { giobatdau: { $lte: giobd }, gioketthuc: { $gte: giokt } },
      ],
  });

  if (workPlans.length === 0) {
    req.body.listCTYC = [];
    addBusyTime2(req, res);
  } else {
    result.listCTYC = [];
    for (let i = 0; i < workPlans.length; i++) {
      result.listCTYC.push(workPlans[i].idchitietyc);
    };
    result.success = true;
    result.existsWorkPlan = true;
    result.listWorkPlan = workPlans;

    res.send(result); 
  }
}

function addBusyTime2(req, res) {
  console.log("add");
  console.log(req.body.listCTYC);
  let listCTYC = req.body.listCTYC;

  for (let i = 0; i < listCTYC.length; i++) {
    removeWorkPlanOfNGV(listCTYC[i]);
  };

  const item = helperBusyDate.create(
  {
    cmnd : req.body.cmnd,
    giobd : req.body.giobd,
    giokt : req.body.giokt,
    ngay : req.body.ngay
  });

  let result = { 
    success: true,
    existsWorkPlan : false,
    busyTime : item 
  };

  res.send(result);
};

module.exports.addBusyTime = async (req, res) => {
  console.log("add");
  console.log(req.body.listCTYC);
  let listCTYC = req.body.listCTYC;

  for (let i = 0; i < listCTYC.length; i++) {
    removeWorkPlanOfNGV(listCTYC[i]);
  };

  const item = await helperBusyDate.create(
  {
    cmnd : req.body.cmnd,
    giobd : req.body.giobd,
    giokt : req.body.giokt,
    ngay : req.body.ngay
  });

  let result = { 
    success: true,
    existsWorkPlan : false,
    busyTime : item 
  };

  res.send(result);
};

// Nếu lỗi thì sửa sau
function removeWorkPlanOfNGV(idCTYC) {
  RequestDetailModel.update({
    _id: idCTYC
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

module.exports.deleteBusyTime = async (req, res) => {
  const id = req.params._id;

  const isDone = await helperBusyDate.remove({ _id: id });
  if (!isDone) {
    res.send({ success: false }); 
  } else {
    res.send({ success: true }); 
  }
};
