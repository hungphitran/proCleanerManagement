const RequestDetailTemp = require('../Models/RequestDetail');
const RequestDetailModel = RequestDetailTemp.RequestDetailModel;
const requestRoute = require('./APIRequest');
const RequestTemp = require('../Models/Request');
const RequestModel = RequestTemp.RequestModel;
const WorkPlanTemp = require('../Models/WorkPlan');
const WorkPlanModel = WorkPlanTemp.WorkPlan;
const HelperBusyDateTemp = require('../Models/HelperBusyDate');
const helperBusyDate = HelperBusyDateTemp.HelperBusyDate;


module.exports.findRequestDetailByYeuCau = async (req, res) => {
	const findRequestDetail = await RequestDetailModel.find({idyeucau : req.params.idyeucau});
	res.json(findRequestDetail);
}

module.exports.updateRequestDetailNGV = async (req, res) => {
	console.log(req.body);

	let result = {success:false, busy:false};
	const idDetail = req.body._id;
	const idyeucau = req.body.idyeucau;
	const nhanvienXL = req.body.nhanvienxuly;
	const nguoigiupviec = req.body.nguoigiupviec;
	const giobdSearch = req.body.lichlamviec.giobatdau;
	const gioktSearch = req.body.lichlamviec.gioketthuc;
	const ngayLamSearch = req.body.lichlamviec.ngaylam;

	const findHelperBusy = await helperBusyDate.find(
		{
			ngay: ngayLamSearch,
			$or: [
				{giobd: {$gte:giobdSearch, $lt:gioktSearch}},
				{giokt: {$gt:giobdSearch, $lte:gioktSearch}},
				{
					giobd: { $lte:giobdSearch},
					giokt: {$gte:gioktSearch}
				}
			]
	  	}
	);

	const findWorkPlan = await WorkPlanModel.find(
		{
			ngaylam: ngayLamSearch,
			$or: [
				{giobatdau: {$gte:giobdSearch, $lt:gioktSearch}},
				{gioketthuc: {$gt:giobdSearch, $lte:gioktSearch}},
				{
					giobatdau: { $lte:giobdSearch},
					gioketthuc: {$gte:gioktSearch}
				}
			]
		}
	);
	if (!findWorkPlan) {
		result.success = false;
		res.send(result);
	}
	for (let i = 0; i < findHelperBusy.length; i++) {
		if (findHelperBusy[i].cmnd == nguoigiupviec) {
			result.success = false;
			result.busy = true;
			res.send(result);
		}
	}
	for (let i = 0; i < findWorkPlan.length; i++) {
		if (findWorkPlan[i].cmnd == nguoigiupviec) {
			result.success = false;
			result.busy = true;
			res.send(result);
		}
	}

	const findWorkPlanDetail = await WorkPlanModel.find({idchitietyc : idDetail});
	if (!findWorkPlanDetail){
		res.send(result);
	}
	if (findWorkPlanDetail.length == 0) {
		const createWorkPlan = await WorkPlanModel.create(
			{
				idchitietyc : idDetail,
				nguoigiupviec : req.body.lichlamviec.nguoigiupviec,
				ngaylam : req.body.lichlamviec.ngaylam,
				giobatdau : req.body.lichlamviec.giobatdau,
				gioketthuc : req.body.lichlamviec.gioketthuc+60,
				khachhang : req.body.lichlamviec.khachhang,
			}
		);
		if (!createWorkPlan) {
			result.success = false;
			res.send(result);
		}
		updateDetailRequestInfo(res, req, idDetail, nguoigiupviec, req.body.trangthai, nhanvienXL, idyeucau);
	}
	else {
		const updateWorkPlan = await WorkPlanModel.update(
			{idchitietyc: idDetail},
			{nguoigiupviec: req.body.nguoigiupviec}
		);
		if (!updateWorkPlan){
			result.success = false;
			res.send(result);
		}
		updateDetailRequestInfo(res, req,idDetail, nguoigiupviec, req.body.trangthai, nhanvienXL,idyeucau);
	}
}

async function updateDetailRequestInfo (res, req,idDetail, ngvTemp, trangthaiTemp, nhanvienXL, idyeucau) {
	let result = {success:false, busy:false};

	const updateRequestDetail = await RequestDetailModel.update(
		{_id : idDetail},
		{
			nguoigiupviec: ngvTemp, 
			trangthai: trangthaiTemp
		}
	);
	if (!updateRequestDetail){
		result.success = false;
		res.send(result);
	}
	if (nhanvienXL == "" || nhanvienXL == null || nhanvienXL ==0) {
		const nvXL = req.session.cmnd;

		const updateRequest = await RequestModel.update(
			{_id : idyeucau},
			{nhanvienxuly : nvXL}
		);
		if (!updateRequest){
			result.success = false;
			res.send(result);
		}
		result.success = true;
		res.send(result);
	}
	else {
		result.success = true;
		res.send(result);
	}
}

module.exports.updateGiaoViec = async (req, res) => {
	const idDetail = req.body._id;
	const nhanvienXL = req.body.nhanvienxuly;
	const idyeucau = req.body.idyeucau;
	let result = {success:false};

	const updateRequestDetail = await RequestDetailModel.update(
		{_id: idDetail},
		{trangthai: "Đã giao"}
	);

	if (updateRequestDetail) {
		result.success = true;
		result.nhanvienxuly = req.session.cmnd;
		console.log("nhan vien xu ly la "+ req.session.cmnd);

		if (nhanvienXL == "" || nhanvienXL == null || nhanvienXL ==0) {
			console.log("update  nhan vien xu ly");
			const nvXL = req.session.cmnd;
			await RequestModel.update(
				{_id : idyeucau},
				{nhanvienxuly : nvXL}
			);
		}
	}

	res.send(result);
}

module.exports.updateRequestDetailTime = async (req, res) => {
	const idYC = req.body.idYC;
    const idChiTietYC = req.body.idChiTietYC;
    const giobatdau = req.body.giobatdau;
    const gioketthuc = req.body.gioketthuc;
    const chiphicobanRequest = req.body.chiphicobanRequest;
	const chiphingoaigioRequest = req.body.chiphingoaigioRequest;
	const sogiongoaigioRequest = req.body.sogiongoaigioRequest
	const chiphingoaigioTemp = req.body.chiphingoaigio;
	const sogiongoaigioTemp = req.body.sogiongoaigio;
	let result = {success:true};

	const updateRequestDetail = await RequestDetailModel.update(
		{_id : idChiTietYC},
		{
			giobatdau: req.body.giobatdau,
			gioketthuc: req.body.gioketthuc,
			sogiongoaigio: sogiongoaigioTemp,
			chiphingoaigio: chiphingoaigioTemp
		}
	);
	if (!updateRequestDetail) {
		result.success = false;
	}

	const updateRequest = await RequestModel.update(
		{_id : idYC},
		{
			chiphi: chiphicobanRequest,
			chiphingoaigio: chiphingoaigioRequest,
			sogiongoaigio: sogiongoaigioRequest
		}
	);
	if (!updateRequest) {
		result.success = false;
	}
	
	res.send(result);
}

module.exports.updateDone = async (req, res) => {
	const idDetail = req.body.id;
	let result = {success: false};

	const updateRequestDetail = await RequestDetailModel.update(
		{_id : idDetail},
		{
			matdo: req.body.matdo, 
			hudo: req.body.hudo, 
			lienlac:req.body.lienlac, 
			trangthai: req.body.trangthai, 
			nhanxet: req.body.nhanxet
		}
	);
	if (updateRequestDetail) {
	    result.success = true;
	}
	res.send(result);
}

module.exports.createRequestDetail = async (idyc, giobd, giokt, giachuan, sogiongoaigioTemp, phingoaigioTemp, chiphingoaigioTemp) => {
	console.log("create detail "+idyc+"  "+giobd+"  "+giokt+"  "+giachuan+" "+sogiongoaigioTemp+"  "+phingoaigioTemp+"  "+chiphingoaigioTemp);

	const createRequestDetail = await RequestDetailModel.create(
		{
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
		}
	);
	if (createRequestDetail) {
		return true;
	}
	return false;
}

module.exports.deleteRequestDetail = async (req, res) => {
	const idYC = req.body.idYC;
    const idChiTietYC = req.body.idChiTietYC;
    const chiphicobanRequest = req.body.chiphicobanRequest;
	const chiphingoaigioRequest = req.body.chiphingoaigioRequest;
	const sogiongoaigioRequest = req.body.sogiongoaigioRequest
	const phithoathuanRequest = req.body.phithoathuanRequest;
	let result = {success: true,empty: false};

	const removeRequestDetail = await RequestDetailModel.remove({_id : idChiTietYC});
	if (!removeRequestDetail) {
		result.success = false;
	}

	if (chiphicobanRequest == 0) {
		const removeRequest = await RequestModel.remove({_id : idYC});
		if (!removeRequest) {
			result.success = false;
		}
		result.empty = true;
		res.send(result);
	}
	else {
		const updateRequest = await RequestModel.update(
			{_id : idYC},
			{
				chiphi : chiphicobanRequest,
				chiphingoaigio : chiphingoaigioRequest,
				sogiongoaigio:sogiongoaigioRequest,
				phithoathuan:phithoathuanRequest
			}
		);
		if (!updateRequest) {
			result.success = false;
		}
		res.send(result);	
	}
}
