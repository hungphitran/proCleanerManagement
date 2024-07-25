const RequestTemp = require('../Models/Request');
const RequestModel = RequestTemp.RequestModel;
const DistrictTemp = require('../Models/District');
const DistrictModel = DistrictTemp.DistrictModel;
const TieuChiTemp = require('../Models/TieuChi');
const TieuChiModel = TieuChiTemp.TieuChiModel;
const RequestDetailTemp = require('../Models/RequestDetail');
const RequestDetailModel = RequestDetailTemp.RequestDetailModel;
const workPlanRoute = require('./APIWorkPlan');
const customerRoute = require('./APICustomer');
const requestDetailRoute = require('./APIRequestDetail');


module.exports.listRequestNotDone = async (req, res) => {
  const cmndNV = req.session.cmnd;
  let result = [];
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const findRequest1 = await RequestModel.find({
    ngaydatyeucau: {$gte:startDate, $lt:endDate},
    $or: [
      {trangthai: "Chưa tiến hành"},
      {trangthai: "Đang tiến hành"}],
    nhanvienxuly: cmndNV
  });
  if (!findRequest1){
    result = [];  
    res.send(result);
  }

  result = findRequest1; 

  const findRequest2 = await RequestModel.find({
    ngaydatyeucau: {$gte: startDate, $lt: endDate},
    $and: [
      {$or: [{trangthai : "Chưa tiến hành"}, {trangthai: "Đang tiến hành"}]},
      {$or: [{nhanvienxuly: ""}, {nhanvienxuly: null}]}]
  });
  if (!findRequest2){
    result = [];  
    res.send(result);
  }
  
  for (let i = 0; i < findRequest2.length; i++) {
    result.push(findRequest2[i]);
  }
  res.json(result);
}


module.exports.listRequestDone = async (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const findRequest = await RequestModel.find({
    ngaydatyeucau: {$gte: startDate, $lt: endDate},
    trangthai: "Đã hoàn thành"
  });

  res.json(findRequest);
}


module.exports.listRequestDoneAndPayment = async (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const findRequest = await RequestModel.find({
    ngaydatyeucau: {$gte:startDate, $lt:endDate},
    $or: [
      {trangthai: "Đã hoàn thành"},
      {trangthai: "Đã thanh toán"}]   
  });
  res.json(findRequest);

}

module.exports.listRequestWaiting = async (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const findRequest = await RequestModel.find({
      trangthai: "Chờ thỏa thuận",
      ngaydatyeucau: {$gte:startDate, $lt:endDate}
  });
  if (!findRequest) {
    res.send({success:false});
  }
  res.json(findRequest);
}

// exports.createRequest = function (req, res) {

//   RequestModel.create({

//         id :  req.body.id,
//         ngaydatyeucau : req.body.ngaydatyeucau,
//         ngaybatdau : req.body.ngaybatdau,
//         ngayketthuc : req.body.ngayketthuc,
//         chiphi : req.body.chiphi,
//         khunggio : req.body.khunggio,

//         nhanvienxuly : req.body.nhanvienxuly,
//         sdtkhachhang : req.body.sdtkhachhang,
//         loaiyeucau : req.body.loaiyeucau,
//         trangthai : req.body.trangthai

//         }, function(err, request) {
//             if (err){
//                 res.send(err);
//                 return;
//             }
//             res.end();
//         });
// };

module.exports.deleteRequest = async (req, res) => {
  // tim xem co ton tai chi tiet yeu cau khong
  const id = req.params._id;
  let result = {
    error: false, 
    emptyDone: true, 
    success: false
  };

  const findRequestDetails = await RequestDetailModel.find({
    idyeucau: id,
    trangthai: "Hoàn thành"
  });
  if(!findRequestDetails) {
    result.error = true;
    res.send(result);
  }
  if(findRequestDetails.length > 0) {
    result.emptyDone = false;
    res.send(result);
  }

  const findRequestDetailsOK = await RequestDetailModel.find({idyeucau: id});
  if(!findRequestDetailsOK) {
    result.error = true;
    res.send(result);
  }
  // xoa lich lam viec neu co
  for (let i = 0; i < findRequestDetailsOK.length; i++) {
    if (findRequestDetailsOK[i].trangthai == "Đã giao") {
      workPlanRoute.deleteWorkPlanByID(findRequestDetailsOK[i]._id);
    }
  }

  const removeRequestDetails = await RequestDetailModel.delete({idyeucau: id});
  if(!removeRequestDetails) {
    result.error = true;
    res.send(result);
  }

  const removeRequest = await RequestModel.delete({_id : id});
  if(!removeRequest) {
    result.error = true;
    res.send(result);
  }

  result.success = true;
  res.send(result);
};

module.exports.findRequest = async (req, res) => {
  const findRequest = await RequestModel.find({
      _id : req.params._id
  });

  res.json(findRequest);
}

module.exports.updateStatus = async (req, res) => {
  const idRequest = req.body._id;

  const updateRequest = await RequestModel.update(
    {_id: idRequest},
    {trangthai : req.body.trangthai}
  );
 
  let result = {success: false};
  if (updateRequest) {
      result.success = true;
  }
  res.send(result);
}

module.exports.updateThoaThuan = async (req, res) => {
  const idRequest = req.body._id;

  const update = await RequestModel.update(
    {_id : idRequest},
    {trangthai: req.body.trangthai,
      phithoathuan : req.body.phithoathuan
    }
  );
  if (!update) {
    res.send({success: false});
  }

  const findRequest = await RequestModel.find({trangthai : "Chờ thỏa thuận"});
  if (!findRequest) {
    res.send({success: false});
  }
  
  res.json(findRequest);
}

module.exports.getDataForCreateRequest = async (req, res) => {
  let resultData = {};

  const findDistrict = await DistrictModel.find();
  if (!findDistrict) { 
    res.send({success:false});
  }
  resultData.listDistrict = findDistrict;

  const findTieuChi = await TieuChiModel.find();
  if (!findTieuChi) { 
    res.send({success:false});
  }

  resultData.listService = findTieuChi;
  res.json(resultData); 
}

module.exports.createRequest = async (req, res) => {
  const createRequest = await RequestModel.create({
    ngaydatyeucau : req.body.ngaydatyeucau,
    ngaybatdau : req.body.ngaybatdau,
    ngayketthuc : req.body.ngayketthuc,
    chiphi : req.body.chiphi,
    nhanvienxuly : "",
    sdtkhachhang : req.body.sdtkhachhang,
    hoten :req.body.hoten,
    loaiyeucau : req.body.loaiyeucau,
    loaidichvu : req.body.loaidichvu,
    trangthai : req.body.trangthai,
    diachi : req.body.diachi,
    quan: req.body.quan,
    hinhthuctt : "",
    nhanvienttcmnd : "",
    nhanvientthoten : "",

    // them moi
    giachuan:req.body.giachuan,
    sogiongoaigio:req.body.sogiongoaigio,
    phingoaigio:req.body.phingoaigio,
    chiphingoaigio:req.body.chiphingoaigio,
    phithoathuan:0,
    noidat:"web_quanly"
  });

  let result = {success:false};
  if (createRequest) {
    const ngaybd = new Date(request.ngaybatdau);
    const ngaykt = new Date(request.ngayketthuc);
    const numberOfDate = ((ngaykt.getTime() - ngaybd.getTime()) / (60*1000*60*24)) + 1;
    const sogiongoaigioOfEachDetail = request.sogiongoaigio / numberOfDate;
    const chiphingoaigioOfEachDetail = request.chiphingoaigio / numberOfDate;

    for(let i = 0; i < numberOfDate; i++) {
        let giobd = new Date(request.ngaybatdau);
            giobd.setDate(giobd.getDate()+i);
            giobd.setHours((req.body.giobatdau - (req.body.giobatdau%60))/60);
            giobd.setMinutes((req.body.giobatdau%60));
            giobd.setTime(giobd.getTime() + 7*60*60*1000);
            giobd.setSeconds(0);
            giobd.setMilliseconds(0);
            
        let giokt = new Date(request.ngaybatdau);
            giokt.setDate(giokt.getDate()+i);
            giokt.setHours((req.body.gioketthuc - (req.body.gioketthuc%60))/60);
            giokt.setMinutes((req.body.gioketthuc%60));
            giokt.setTime(giokt.getTime() + 7*60*60*1000);
            giokt.setSeconds(0);
            giokt.setMilliseconds(0);
            
        const createRequestDetail = requestDetailRoute.createRequestDetail(request._id,giobd,giokt,request.giachuan, sogiongoaigioOfEachDetail,request.phingoaigio, chiphingoaigioOfEachDetail );
    }

    customerRoute.createCustomer(req.body.hoten, req.body.sdtkhachhang, req.body.diachi);
    result.success  = true;
  }

  res.send(result);
}

module.exports.payment = async (req, res) => {
  const idRequest = req.body._id;
  
  const updateRequest = await RequestModel.update(
    {_id : idRequest},
    {
      trangthai : req.body.trangthai,
      nhanvienttcmnd: req.session.cmnd,
      nhanvientthoten: req.session.hoten,
      hinhthuctt: req.body.hinhthuctt
    }
  );

  let result = {success: false};
  if (updateRequest){
    result.success = true;
  }
  res.send(result);
}

module.exports.updateCost = async (id, numberOfRequestDetail) =>{
  console.log(id);
  console.log("red "+numberOfRequestDetail);

  const findRequest = await RequestModel.find({_id : id});
  let newCost = request.chiphi - (request.chiphi / numberOfRequestDetail);
  console.log("new cost "+ newCost);
  if (!findRequest) {
    return;
  }

  const updateRequest = await RequestModel.update(
    {_id : id},
    {chiphi : newCost}
  );
  if (!updateRequest) {
    return;
  }
}
