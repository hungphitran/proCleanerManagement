var RequestTemp = require('../Models/Request');
var RequestModel = RequestTemp.RequestModel;
var TieuChiTemp = require('../Models/TieuChi');
var TieuChiModel = TieuChiTemp.TieuChiModel;

exports.listNewRequestByDistrictInTimeRange = function (req, res) {

  var startDate = req.body.startDate;
  var endDate = new Date(req.body.endDate);
  endDate.setTime(endDate.getTime()+24*60*60*1000);
  RequestModel.find({
    ngaydatyeucau : {$gte:startDate,$lt:endDate}
      
  }, function (err, _requests) {
  	console.log(_requests.length+" district");
    if (err){
        res.send({success:false});
        return;
    }
  	var result = [];
  	var totalInfo = {
		totalCost:0,
		totalRequest:_requests.length
	}
    for (var i = 0; i < _requests.length; i++) {
    	var j = 0;
    	for (j = 0; j < result.length; j++) {
    		if(_requests[i].quan == result[j].quan){
    			break;
    		}
    	};

    	if(j == result.length){
    		var newDistrict = {
    			quan:_requests[i].quan,
    			cost:0,
    			request:0
    		}
    		result.push(newDistrict);
    	}
    	result[j].cost += _requests[i].chiphi + _requests[i].phithoathuan+_requests[i].chiphingoaigio;
    	result[j].request += 1;

    	totalInfo.totalCost += result[j].cost;

    };
    result.push(totalInfo);
	
    res.send(result);

  });

}

exports.loadServiceDataInRequest = function (req, res) {

	var startDate = req.body.startDate;
	var endDate = req.body.endDate;
	var endDate = new Date(req.body.endDate);
  	endDate.setTime(endDate.getTime()+24*60*60*1000);
	RequestModel.find({
	ngaydatyeucau : {$gte:startDate,$lt:endDate}
	  
	}, function (err, _requests) {
		console.log(_requests.length+" service");
	if (err){
	    res.send({success:false});
	    return;
	}
		var result = [];
		var totalInfo = {
		totalRequest:_requests.length
	}

	for (var i = 0; i < _requests.length; i++) {
		for (var t = 0; t < _requests[i].loaidichvu.length; t++) {
		
	    	var j = 0;
	    	for (j = 0; j < result.length; j++) {
	    		if(_requests[i].loaidichvu[t] == result[j].loaidichvu){
	    			break;
	    		}
	    	};

	    	if(j == result.length){
	    		var newService = {
	    			loaidichvu:_requests[i].loaidichvu[t],
	    			request:0
	    		}
	    		result.push(newService);
	    	}
	    	result[j].request += 1;
	    	
	    };	
	};
	result.push(totalInfo);
	res.send(result);
	});

}