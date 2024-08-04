const CustomerTemp = require('../Models/Customer');
const CustomerModel = CustomerTemp.Customer;
const RequestTemp = require('../Models/Request');
const RequestModel = RequestTemp.RequestModel;


module.exports.createCustomer = async (hotenTemp, sdtTemp, diachiTemp) => {
	console.log("create customer " + sdtTemp + "  " + hotenTemp);

	const existingCustomer = await CustomerModel.find({ sdt: sdtTemp });
	if (existingCustomer.length == 0) {
		await CustomerModel.create({
			hoten:hotenTemp,
			sdt:sdtTemp,
			diachi:diachiTemp,
			matkhau:"kocomatkhau",
			email:"kocoemail"
		})
	} else {
		await CustomerModel.updateOne(
			{ sdt:sdtTemp },
			{ 
				hoten:hotenTemp, 
				diachi:diachiTemp 
			})
	}
}

module.exports.listCustomer = async (req, res) => {
	const listCustomer = await CustomerModel.find();
	
	if (!listCustomer) {
		res.send({ error: true });
		return;
	}

	res.json(listCustomer);
}

module.exports.listRequestByCustomer = async (req, res) => {
	const startDate = req.body.timeRange.startDate;
	const endDate = req.body.timeRange.endDate;
	const sdtkhachhangTemp = req.body.sdtkhachhang;

	let find = {
		ngaydatyeucau: { $gte: startDate, $lt: endDate },
		sdtkhachhang : sdtkhachhangTemp
	};

	const records = await RequestModel.find(find);

	res.json(records);
}