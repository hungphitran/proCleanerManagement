var CustomerTemp = require('../Models/Customer');
var CustomerModel = CustomerTemp.Customer;
var RequestTemp = require('../Models/Request');
var RequestModel = RequestTemp.RequestModel;
exports.createCustomer = function(hotenTemp, sdtTemp, diachiTemp){
	console.log("create customer "+sdtTemp+"  "+hotenTemp);

	CustomerModel.find({
		sdt:sdtTemp
    }, function(err, _customer) {
    	if(!err){

    		if(_customer.length == 0){
    			CustomerModel.create({
			        hoten:hotenTemp,
					sdt:sdtTemp,
					diachi:diachiTemp,
					matkhau:"kocomatkhau",
					email:"kocoemail"
		        }, function(err, customer) {

		        });
    		}else{
    			CustomerModel.update({
			        sdt:sdtTemp
		        },{
		        	hoten:hotenTemp,
					diachi:diachiTemp
		        }, function(err, customer) {

		        });
    		}

    	}
    });

	
}
exports.listCustomer = function (req, res) {
  CustomerModel.find(function(err, _helpers) {
            if (err){
                res.send({error:true});
                return;
            }
            res.json(_helpers); // return all todos in JSON format
  });
}

exports.listRequestByCustomer = function (req, res) {
  var startDate = req.body.timeRange.startDate;
  var endDate = req.body.timeRange.endDate;
  var sdtkhachhangTemp = req.body.sdtkhachhang
  RequestModel.find({
      ngaydatyeucau:{$gte:startDate,$lt:endDate},
      sdtkhachhang : sdtkhachhangTemp
  }, function (err, _requests) {
    if (err){
        res.send(err);
        return;
    }
    res.json(_requests);
  });
}