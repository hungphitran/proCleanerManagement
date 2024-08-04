const WorkPlanTemp = require('../Models/WorkPlan');
const WorkPlanModel = WorkPlanTemp.WorkPlan;


module.exports.updateWorkPlanNGV = async (req, res) => {
  const idDetail = req.body.idchitietyc;
  let result = {success: false};

  const findWorkPlan = await WorkPlanModel.find({idchitietyc: idDetail});
  if (!findWorkPlan) {
    res.send(result);
  }

  if (findWorkPlan.length == 0) {
    const createWorkPlan = await WorkPlanModel.create(
      {
        idchitietyc : req.body.idchitietyc,
        nguoigiupviec : req.body.nguoigiupviec,
        ngaylam : req.body.ngaylam,
        giobatdau : req.body.giobatdau,
        gioketthuc : req.body.gioketthuc+60,
        khachhang : req.body.khachhang,
      }
    );
    if (createWorkPlan){
      result.success = true;
    }
    res.send(result);
  }
  else {
    const updateWorkPlan = await WorkPlanModel.updateOne(
      {idchitietyc: idDetail},
      {nguoigiupviec: req.body.nguoigiupviec}
    );
    if (updateWorkPlan) {
      result.success = true;
    }
    res.send(result);
  }
}

module.exports.updateWorkPlanTime = async (req, res) => {
  const idDetail = req.body.idchitietyc;
  let result ={success:false};

  const findWorkPlan = await WorkPlanModel.find({idchitietyc : idDetail});
  if (!findWorkPlan) {
    res.send(result);
  }
  
  if (findWorkPlan.length == 0) {
    if (findWorkPlan) {
      result.success = true;
    }
    res.send(result);
  }
  else {
    const updateWorkPlan = await WorkPlanModel.updateOne(
      {idchitietyc: idDetail},
      {
        giobatdau: req.body.giobatdau, 
        gioketthuc : req.body.gioketthuc+60
      }
    );
    if (updateWorkPlan) {
      result.success = true;
    }
    res.send(result);
 }
}

module.exports.deleteWorkPlan = async (req, res) => {
  const removeWorkPlan = await WorkPlanModel.deleteOne({idchitietyc: req.params.idchitietyc});

  let result = {success:false};
  if (removeWorkPlan) {
    result.success = true;
  }
  res.send(result); 
};

module.exports.deleteWorkPlanByID = async (req, res) => {
  const removeWorkPlan = await WorkPlanModel.deleteOne({idchitietyc: id});
  
  if (!removeWorkPlan) {
    deleteWorkPlanByID(id);
  }
};

module.exports.findByNGV = async (req, res) => {
  console.log("find lich lam viec");

  const findWorkPlan = await WorkPlanModel.find({nguoigiupviec: req.params.cmnd});
  res.json(findWorkPlan);
}

module.exports.findByNGVFromToday = async (req, res) => {
  let today = new Date();
  today.setHours(7);
  today.setSeconds(0);
  today.setMinutes(0);
  today.setMilliseconds(0);
  console.log(today);

  const findWorkPlan = await WorkPlanModel.find(
    {
      nguoigiupviec: req.params.cmnd,
      ngaylam: {$gte:today}
    }
  );
  
  res.json(findWorkPlan);
}