var RequestDetailTemp = require('../Models/RequestDetail');
var RequestDetailModel = RequestDetailTemp.RequestDetailModel;
var requestRoute = require('./APIRequest');
var RequestTemp = require('../Models/Request');
var RequestModel = RequestTemp.RequestModel;
var WorkPlanTemp = require('../Models/WorkPlan');
var WorkPlanModel = WorkPlanTemp.WorkPlan;
var HelperBusyDateTemp = require('../Models/HelperBusyDate');
var helperBusyDate = HelperBusyDateTemp.HelperBusyDate;


exports.findRequestDetailByYeuCau = function(req,res){
  RequestDetailModel.find({
      idyeucau : req.params.idyeucau
  }, function (err, _details) {
    if (err){
        res.send(err);
        return;
    }
    res.json(_details);
  });
}
exports.updateRequestDetailNGV = function(req,res){

	console.log(req.body);
	var idDetail = req.body._id;
	var idyeucau = req.body.idyeucau;
	var nhanvienXL = req.body.nhanvienxuly;
	var result ={success:false, busy:false};
	var nguoigiupviec = req.body.nguoigiupviec;
	var giobdSearch = req.body.lichlamviec.giobatdau;
	var gioktSearch = req.body.lichlamviec.gioketthuc;
	var ngayLamSearch = req.body.lichlamviec.ngaylam;
	helperBusyDate.find({
      ngay:ngayLamSearch,
      $or:[
        {giobd : {$gte:giobdSearch, $lt:gioktSearch}},
        {giokt : {$gt:giobdSearch, $lte:gioktSearch}},
        {
          giobd : { $lte:giobdSearch},
          giokt : {$gte:gioktSearch}
        },
      ]
    },
      function(err, _busyDates){

        WorkPlanModel.find({
            ngaylam:ngayLamSearch,
            $or:[
              {giobatdau : {$gte:giobdSearch, $lt:gioktSearch}},
              {gioketthuc : {$gt:giobdSearch, $lte:gioktSearch}},
              {
                giobatdau : { $lte:giobdSearch},
                gioketthuc : {$gte:gioktSearch}
              },
            ]
        }, function (err, _workPlans) {
            if (err){
              result.success = false;
              res.send(result);
              return;
          }
    		
            for (var i = 0; i < _busyDates.length; i++) {
            	if(_busyDates[i].cmnd == nguoigiupviec){
            		result.success = false;
            		result.busy = true;
            		res.send(result);
            		return;
            	}
            };
            for (var i = 0; i < _workPlans.length; i++) {
            	if(_workPlans[i].cmnd == nguoigiupviec){
            		result.success = false;
            		result.busy = true;
            		res.send(result);
            		return;
            	}
            };

            WorkPlanModel.find({
			      idchitietyc : idDetail
			  }, function (err, _workPlans) {
			    if (err){
			        res.send(result);
			        return;
			    }
			    if(_workPlans.length==0){

			        	WorkPlanModel.create({
			            idchitietyc : idDetail,
			            nguoigiupviec : req.body.lichlamviec.nguoigiupviec,
			            ngaylam : req.body.lichlamviec.ngaylam,
			            giobatdau : req.body.lichlamviec.giobatdau,
			            gioketthuc : req.body.lichlamviec.gioketthuc+60,
			            khachhang : req.body.lichlamviec.khachhang,
			        },function (err, _details) {
			          if (err){
			              result.success = false;
			              res.send(result);
			              return;
			          }
			          updateDetailRequestInfo(res, req,idDetail, nguoigiupviec, req.body.trangthai, nhanvienXL, idyeucau);
			        });

			    }else{
			        WorkPlanModel.update({
			            idchitietyc : idDetail
			        },{nguoigiupviec : req.body.nguoigiupviec}, function (err, _details) {
			          if (err){
			              result.success = false;
			              res.send(result);
			              return;
			          }
			          updateDetailRequestInfo(res, req,idDetail, nguoigiupviec, req.body.trangthai, nhanvienXL,idyeucau);
			        });
			    }
			  });
	});

    });
	
}

function updateDetailRequestInfo (res, req,idDetail,ngvTemp, trangthaiTemp,nhanvienXL,idyeucau){
	var result ={success:false, busy:false};
	RequestDetailModel.update({
	  		_id : idDetail
		},{nguoigiupviec : ngvTemp, trangthai : trangthaiTemp}, function (err, _details) {

		if (err){
			result.success = false;
			res.send(result);
			return;
		}

		if(nhanvienXL == "" || nhanvienXL == null || nhanvienXL ==0){
			var nvXL = req.session.cmnd;
			RequestModel.update({
	        	_id : idyeucau
		    	},{nhanvienxuly : nvXL}, function (err, _request) {
		    		
				if (err){
					result.success = false;
					res.send(result);
					return;
				}
				result.success = true;
				res.send(result);
	   		});
		}else{
			result.success = true;
			res.send(result);
		}

	});
}

exports.updateGiaoViec = function(req,res){
	var idDetail = req.body._id;
	var nhanvienXL = req.body.nhanvienxuly;
	var idyeucau = req.body.idyeucau;
	RequestDetailModel.update({
  		_id : idDetail
	},{trangthai : "Đã giao"}, function (err, _details) {
		var result = {success:false};
		if(!err){
			result.success = true;
			result.nhanvienxuly = req.session.cmnd;
			console.log("nhan vien xu ly la "+ req.session.cmnd);
			if(nhanvienXL == "" || nhanvienXL == null || nhanvienXL ==0){
				console.log("update  nhan vien xu ly")
				var nvXL = req.session.cmnd;
				RequestModel.update({
		        	_id : idyeucau
			    	},{nhanvienxuly : nvXL}, function (err, _request) {
		   		});
			}
		}

		res.send(result);
	});

}
exports.updateRequestDetailTime = function(req,res){
	var idYC = req.body.idYC;
    var idChiTietYC = req.body.idChiTietYC;
    var giobatdau = req.body.giobatdau;
    var gioketthuc = req.body.gioketthuc;
    var chiphicobanRequest = req.body.chiphicobanRequest;
	var chiphingoaigioRequest = req.body.chiphingoaigioRequest;
	var sogiongoaigioRequest = req.body.sogiongoaigioRequest
	var chiphingoaigioTemp = req.body.chiphingoaigio;
	var sogiongoaigioTemp = req.body.sogiongoaigio;


	RequestDetailModel.update({
	  _id : idChiTietYC
	},{
		giobatdau : req.body.giobatdau,
		gioketthuc : req.body.gioketthuc,
		sogiongoaigio:sogiongoaigioTemp,
		chiphingoaigio:chiphingoaigioTemp
		}, function (err, _details) {
			var result ={success:true};
			if (err){
			    result.success = false;
			}

			RequestModel.update({
			  _id : idYC
			},{
				chiphi : chiphicobanRequest,
				chiphingoaigio : chiphingoaigioRequest,
				sogiongoaigio:sogiongoaigioRequest
			}, function (err, _details) {

			if (err){
			    result.success = false;
			}
			
			res.send(result);
		});


	});
}
exports.updateDone = function(req,res){
	var idDetail = req.body.id;
	RequestDetailModel.update({
	  _id : idDetail
	},{matdo : req.body.matdo, hudo : req.body.hudo, lienlac :req.body.lienlac, trangthai : req.body.trangthai, nhanxet : req.body.nhanxet}, function (err, _details) {
	var result ={success:false};
	if (!err){
	    result.success = true;
	}
	res.send(result);
	});
}

exports.createRequestDetail = function(idyc,giobd,giokt, giachuan, sogiongoaigioTemp, phingoaigioTemp, chiphingoaigioTemp){


	console.log("create detail "+idyc+"  "+giobd+"  "+giokt+"  "+giachuan+" "+sogiongoaigioTemp+"  "+phingoaigioTemp+"  "+chiphingoaigioTemp);
    RequestDetailModel.create({
				idyeucau : idyc,
				giobatdau : giobd,
				gioketthuc : giokt,
				nguoigiupviec :"",
				nhanxet : "Trung bình",
				matdo :"Không",
				hudo : "Không",
				lienlac : "Có",
				trangthai :"Chưa giao",
				sogiongoaigio:sogiongoaigioTemp,
				phingoaigio:phingoaigioTemp,
				chiphingoaigio:chiphingoaigioTemp

        }, function(err, request) {
            console.log(err);
            console.log(request);
            if (!err){
              return true;
            }
            return false;
        });
}

exports.deleteRequestDetail = function(req,res){

	var idYC = req.body.idYC;
    var idChiTietYC = req.body.idChiTietYC;
    var chiphicobanRequest = req.body.chiphicobanRequest;
	var chiphingoaigioRequest = req.body.chiphingoaigioRequest;
	var sogiongoaigioRequest = req.body.sogiongoaigioRequest
	var phithoathuanRequest = req.body.phithoathuanRequest;

	RequestDetailModel.remove({
	  _id : idChiTietYC
	}, function (err, _details) {
			var result ={success:true,empty:false};
			if (err){
			    result.success = false;
			}

			if(chiphicobanRequest == 0){
				RequestModel.remove({
				  _id : idYC
				},function (err, _details) {

				if (err){
				    result.success = false;
				}
				result.empty = true;
				res.send(result);
				});
			}else{
				RequestModel.update({
				  _id : idYC
				},{
					chiphi : chiphicobanRequest,
					chiphingoaigio : chiphingoaigioRequest,
					sogiongoaigio:sogiongoaigioRequest,
					phithoathuan:phithoathuanRequest
				}, function (err, _details) {

				if (err){
				    result.success = false;
				}
				
				res.send(result);
				});
			}

	});

	
}
