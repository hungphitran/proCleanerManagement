var RequestTemp = require('../Models/Request');
var RequestModel = RequestTemp.RequestModel;
var DistrictTemp = require('../Models/District');
var DistrictModel = DistrictTemp.DistrictModel;
var TieuChiTemp = require('../Models/TieuChi');
var TieuChiModel = TieuChiTemp.TieuChiModel;
var RequestDetailTemp = require('../Models/RequestDetail');
var RequestDetailModel = RequestDetailTemp.RequestDetailModel;
var workPlanRoute = require('./APIWorkPlan');
var customerRoute = require('./APICustomer');
var requestDetailRoute = require('./APIRequestDetail');
exports.listRequestNotDone = function (req, res) {

  var cmndNV = req.session.cmnd;
  var result = [];
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;


   RequestModel.find({
        ngaydatyeucau:{$gte:startDate,$lt:endDate},
         $or:[
          {trangthai : "Chưa tiến hành"},
          {trangthai:"Đang tiến hành"}],
      nhanvienxuly:cmndNV
  }, function (err, _requests1) {

      if (err){
            result = [];  
            res.send(result);
            return;
        }
       result = _requests1; 
       RequestModel.find({
          ngaydatyeucau:{$gte:startDate,$lt:endDate},
            $and:[
              {$or:[{trangthai : "Chưa tiến hành"},{trangthai:"Đang tiến hành"}]},
              {$or:[{nhanvienxuly:""},{nhanvienxuly:null}]}
              ]

        }, function (err, _requests2) {
            if (err){
                result = [];  
                res.send(result);
                return;
            }
            for (var i = 0; i < _requests2.length; i++) {
                result.push(_requests2[i]);
            };
            res.json(result);
        });

  });


}


exports.listRequestDone = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  RequestModel.find({
      ngaydatyeucau:{$gte:startDate,$lt:endDate},
      trangthai : "Đã hoàn thành"
  }, function (err, _requests) {
    if (err){
        res.send(err);
        return;
    }
    res.json(_requests);
  });

}
exports.listRequestDoneAndPayment = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  RequestModel.find({
    ngaydatyeucau:{$gte:startDate,$lt:endDate},
    $or:[
      {trangthai : "Đã hoàn thành"},
      {trangthai : "Đã thanh toán"}
    ]
      
  }, function (err, _requests) {
    if (err){
        res.send(err);
        return;
    }
    res.json(_requests);
  });

}

exports.listRequestWaiting= function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  RequestModel.find({
      trangthai : "Chờ thỏa thuận",
      ngaydatyeucau:{$gte:startDate,$lt:endDate}
  }, function (err, _requests) {
    if(err){
      var result ={success:false};
      res.send(result);
      return;
    }
    res.json(_requests);
  });

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

exports.deleteRequest = function(req,res){
    // tim xem co ton tai chi tiet yeu cau khong
    RequestDetailModel.find({
      idyeucau:req.params._id,
      trangthai:"Hoàn thành"
    },function(err, _requestDetails){
      var result = {error:false, emptyDone: true, success:false};
        if(err){
          result.error = true;
          res.send(result);
          return;
        }
        if(_requestDetails.length>0){
          result.emptyDone = false;
          res.send(result);
          return;
        }
        // lay danh sach chi tiet yeu cau
        RequestDetailModel.find({
          idyeucau:req.params._id
        },function(err, _requestDetailsOK){
          if(err){
            result.error = true;
            res.send(result);
            return;
          }
          // xoa lich lam viec neu co
          for (var i = 0; i < _requestDetailsOK.length; i++) {
            if(_requestDetailsOK[i].trangthai == "Đã giao"){
              workPlanRoute.deleteWorkPlanByID(_requestDetailsOK[i]._id);
            }
          };

          RequestDetailModel.remove({
              idyeucau:req.params._id
            },function(err, _requestDetails){
              if(err){
                result.error = true;
                res.send(result);
                return;
              }

              RequestModel.remove({
                  _id : req.params._id
              },function(err,_requests){
                      if(err){
                          result.error = true;
                          res.send(result);
                          return;
                      }
                      result.success = true;
                      res.send(result);
                      return;
                  });
            });
        });

    });

    
};
exports.findRequest = function(req,res){
  RequestModel.find({
      _id : req.params._id
  }, function (err, _request) {
    if (err){
        res.send(err);
        return;
    }
    res.json(_request);
  });
}

exports.updateStatus = function(req,res){
  var idRequest = req.body._id;
  RequestModel.update({
      _id : idRequest
  },{trangthai : req.body.trangthai}, function (err, _details) {
    var result ={success:false};
    if (!err){
        result.success = true;
    }
    res.send(result);
  });
}

exports.updateThoaThuan = function(req,res){
  var idRequest = req.body._id;
  RequestModel.update({
      _id : idRequest
  },{trangthai : req.body.trangthai,phithoathuan : req.body.phithoathuan}, function (err, _details) {
    
    if (err){
        var result ={success:false};
        res.send(result);
        return;
    }
    
    RequestModel.find({
          trangthai : "Chờ thỏa thuận"
      }, function (err, _requests) {
        if(err){
          var result ={success:false};
          res.send(result);
          return;
        }
        res.json(_requests);
      });
  });
}




exports.getDataForCreateRequest = function(req, res){

    var resultData = {};

    DistrictModel.find(function(errDistrict, _districts) {
        if (errDistrict){
            var result ={success:false};
            res.send(result);
            return;
        }
        resultData.listDistrict = _districts;
        TieuChiModel.find(function(errTieuChi, _tieuchis) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (errTieuChi){
                var result ={success:false};
                res.send(result);
                return;
            }
            resultData.listService = _tieuchis;
            res.json(resultData); 
        });
  });
}

exports.createRequest = function(req, res){
  RequestModel.create({
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

        }, function(err, request) {
            var result ={success:false};
            if (!err){
              var ngaybd = new Date(request.ngaybatdau);
              var ngaykt = new Date(request.ngayketthuc);
              var numberOfDate = ((ngaykt.getTime()-ngaybd.getTime())/(60*1000*60*24))+1;
              var sogiongoaigioOfEachDetail = request.sogiongoaigio/numberOfDate;
              var chiphingoaigioOfEachDetail = request.chiphingoaigio/numberOfDate;
              for(var i = 0;i<numberOfDate;i++){


                  var giobd = new Date(request.ngaybatdau);
                      giobd.setDate(giobd.getDate()+i);
                      giobd.setHours((req.body.giobatdau - (req.body.giobatdau%60))/60);
                      giobd.setMinutes((req.body.giobatdau%60));
                      giobd.setTime(giobd.getTime() + 7*60*60*1000);
                      giobd.setSeconds(0);
                      giobd.setMilliseconds(0);
                      
                  var giokt = new Date(request.ngaybatdau);
                      giokt.setDate(giokt.getDate()+i);
                      giokt.setHours((req.body.gioketthuc - (req.body.gioketthuc%60))/60);
                      giokt.setMinutes((req.body.gioketthuc%60));
                      giokt.setTime(giokt.getTime() + 7*60*60*1000);
                      giokt.setSeconds(0);
                      giokt.setMilliseconds(0);
                      
                  var createRequestDetail = requestDetailRoute.createRequestDetail(request._id,giobd,giokt,request.giachuan, sogiongoaigioOfEachDetail,request.phingoaigio, chiphingoaigioOfEachDetail );
              
              }
              customerRoute.createCustomer(req.body.hoten,req.body.sdtkhachhang, req.body.diachi);
              result.success  = true;
              res.send(result);
              return;

            }
            res.send(result);
        });
}


exports.payment = function(req, res){

    var idRequest = req.body._id;
    RequestModel.update({
        _id : idRequest
    },{
      trangthai : req.body.trangthai,
      nhanvienttcmnd: req.session.cmnd,
      nhanvientthoten: req.session.hoten,
      hinhthuctt: req.body.hinhthuctt
    }, function (err, _details) {
      var result ={success:false};
      if (!err){
          result.success = true;
      }
      res.send(result);
    });
}

exports.updateCost = function(id, numberOfRequestDetail){
  console.log(id);
  console.log("red "+numberOfRequestDetail);
  RequestModel.find({
        _id : id
    }, function (err, request) {
      var newCost = request.chiphi - (request.chiphi/numberOfRequestDetail);
      console.log("new cost "+newCost);
      if(err){
        return;
      }
      RequestModel.update({
          _id : id
      },{chiphi : newCost}, function (err, _details) {
        console.log(err);
        if (err){
            return;
        }

    });
    });
    


}
