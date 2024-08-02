const RequestTemp = require('../Models/Request');
const RequestModel = RequestTemp.RequestModel;

module.exports.listNewRequestByDistrictInTimeRange = async (req, res) => {
	const startDate = req.body.startDate;
	const endDate = req.body.endDate;
	const endDateWithTime = new Date(endDate);
	endDateWithTime.setTime(endDateWithTime.getTime() + 24 * 60 * 60 * 1000);
  
	const requests = await RequestModel.find(
	{
		ngaydatyeucau: { $gte: startDate, $lt: endDateWithTime }
	});
	console.log(requests.length+" district");

	if (!requests) {
		res.send({ success: false });
	}

  	const result = [];
  	let totalInfo = {
		totalCost: 0,
		totalRequest: requests.length
	}

    for (let i = 0; i < requests.length; i++) {
    	let j = 0;
    	for (j = 0; j < result.length; j++) {
    		if(requests[i].quan == result[j].quan) {
    			break;
    		}
    	};

    	if(j == result.length) {
    		const newDistrict = {
    			quan: requests[i].quan,
    			cost: 0,
    			request: 0
    		};
    		result.push(newDistrict);
    	}
    	result[j].cost += requests[i].chiphi + requests[i].phithoathuan + requests[i].chiphingoaigio;
    	result[j].request += 1;

    	totalInfo.totalCost += result[j].cost;
    };
    result.push(totalInfo);
	
    res.send(result);
}

module.exports.loadServiceDataInRequest = async (req, res) => {
	const startDate = req.body.startDate;
	const endDate = req.body.endDate;
    const endDateWithTime = new Date(endDate);
    endDateWithTime.setTime(endDateWithTime.getTime() + 24 * 60 * 60 * 1000);

	const requests = await RequestModel.find(
	{
		ngaydatyeucau: { $gte: startDate, $lt: endDateWithTime }
	});
	console.log(requests.length + " service");

	if (!requests){
	    res.send({ success:false });
	}

	const result = [];
	let totalInfo = {
		totalRequest: requests.length
	};

	for (let i = 0; i < requests.length; i++) {
		for (let t = 0; t < requests[i].loaidichvu.length; t++) {
	    	let j = 0;
	    	for (j = 0; j < result.length; j++) {
	    		if (requests[i].loaidichvu[t] == result[j].loaidichvu) {
	    			break;
	    		}
	    	};

	    	if (j == result.length) {
	    		const newService = {
	    			loaidichvu: requests[i].loaidichvu[t],
	    			request: 0
	    		}
	    		result.push(newService);
	    	}
	    	result[j].request += 1;
	    };	
	};
	result.push(totalInfo);

	res.send(result);
}