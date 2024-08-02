const HelperTemp = require('../Models/Helper');
const helper = HelperTemp.Helper;
const WorkPlanTemp = require('../Models/WorkPlan');
const WorkPlanModel = WorkPlanTemp.WorkPlan;
const RequestDetailTemp = require('../Models/RequestDetail');
const RequestDetailModel = RequestDetailTemp.RequestDetailModel;

const HelperBusyDateTemp = require('../Models/HelperBusyDate');
const helperBusyDate = HelperBusyDateTemp.HelperBusyDate;

const HelperSalaryTemp = require('../Models/HelperSalary');
const HelperSalary = HelperSalaryTemp.HelperSalary;

const DistrictTemp = require('../Models/District');
const DistrictModel = DistrictTemp.DistrictModel;

const fs = require('fs');
const { LEGAL_TLS_SOCKET_OPTIONS } = require('mongodb');

function getFileType(url)
{
    var position = url.lastIndexOf('.');
    return url.substring(position,url.length);
}

module.exports.listHelper = async (req, res) => {
  const records = await helper.find();

  res.json(records);
}

module.exports.uploadImage = async (req, res) => {
  try{
    const oldName = req.files.image.name;
    const newName = req.body.fileName;
    const parentPath = "public/images/ngv/" + req.body.parentPath;
    const path = "public/images/ngv/"+ req.body.path;

    if (!fs.existsSync(parentPath)) {
      fs.mkdirSync(parentPath);
    }
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    ins = fs.createReadStream(req.files.image.path).pipe(fs.createWriteStream(path + newName));
    res.end();
  } catch(err){
    res.send(err);
  }
}

module.exports.createHelper = async (req, res) => {
  await helper.create({
            cmnd : req.body.cmnd,
            hoten : req.body.hoten,
            ngaysinh : req.body.ngaysinh,
            quequan : req.body.quequan,
            sonamkinhnghiem : req.body.sonamkinhnghiem,
            motakinhnghiem : req.body.motakinhnghiem,
            hinhanh : req.body.hinhanh,
            giaykhamsuckhoe : req.body.giaykhamsuckhoe,
            sodt : req.body.sodt,
            luongcodinh : req.body.luongcodinh,
            mucluongtheogio : req.body.mucluongtheogio,
            diachi : req.body.diachi,
            sotruong : req.body.sotruong,
            danhgia : req.body.danhgia,
            ngaylamviec: req.body.ngaylamviec,
            gioitinh : req.body.gioitinh,
            tinhtranghonnhan : req.body.tinhtranghonnhan,
            dantoc : req.body.dantoc,
            trinhdohocvan : req.body.trinhdohocvan,
            chieucao : req.body.chieucao,
            cannang : req.body.cannang,
            thongtincon : req.body.thongtincon
        });

  res.end();
};

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports.deleteHelper = async (req, res) => {
  const id = req.body._id;

  const isDeleted = await helper.delete({ _id: id });
  if (!isDeleted) {
    res.send({ success: false });
  }

  if (fs.existsSync("public/images/ngv/" + req.body.cmnd)){
    deleteFolderRecursive("public/images/ngv/" + req.body.cmnd);
  }

  const helperRecords = helper.find();
  res.send(helperRecords);
};

module.exports.findHelper = async (req,res) => {
  const helperFind = await helper.find({
    cmnd : req.params.cmnd
  });

  res.json(helperFind);
}

module.exports.editHelper = async (req, res) => {
  console.log("cmnd "+req.body.cmnd);
  console.log(req.body.sotruong);

  const editHelper = await helper.update({
      cmnd : req.body.cmnd
  },{
      hoten : req.body.hoten,
      ngaysinh : req.body.ngaysinh,
      quequan : req.body.quequan,
      sonamkinhnghiem : req.body.sonamkinhnghiem,
      motakinhnghiem : req.body.motakinhnghiem,
      hinhanh : req.body.hinhanh,
      giaykhamsuckhoe : req.body.giaykhamsuckhoe,
      sodt : req.body.sodt,
      luongcodinh : req.body.luongcodinh,
      mucluongtheogio : req.body.mucluongtheogio,
      diachi : req.body.diachi,
      sotruong : req.body.sotruong,
      danhgia : req.body.danhgia,
      gioitinh : req.body.gioitinh,
      tinhtranghonnhan : req.body.tinhtranghonnhan,
      dantoc : req.body.dantoc,
      trinhdohocvan : req.body.trinhdohocvan,
      chieucao : req.body.chieucao,
      cannang : req.body.cannang,
      thongtincon : req.body.thongtincon
    });
  if (!editHelper) {
    res.send({ success: false });
  }
  res.send({ success: true });
}

module.exports.findFreeHelper = async (req, res) => {
  const ngayLamSearch = req.body.ngaylam;
  const giobdSearch = req.body.giobd;
  const gioktSearch = req.body.giokt;
  const nguoigiupviec = req.body.nguoigiupviec;
  let listHelper = [];
  const quan = req.body.quan;
  const sotruong = req.body.sotruong;

  const findHelperBusyDate = await helperBusyDate.find({
    ngay: ngayLamSearch,
    $or:[
      {giobd : { $gte: giobdSearch, $lt: gioktSearch }},
      {giokt : { $gt: giobdSearch, $lte: gioktSearch }},
      {
        giobd : { $lte: giobdSearch },
        giokt : { $gte: gioktSearch }
      },
    ]
  });

  const findWorkPlan = await WorkPlanModel.find({
    ngaylam:ngayLamSearch,
    $or:[
      {giobatdau : { $gte: giobdSearch, $lt: gioktSearch }},
      {gioketthuc : { $gt: giobdSearch, $lte: gioktSearch }},
      {
        giobatdau : { $lte: giobdSearch },
        gioketthuc : { $gte: gioktSearch }
      },
    ]
  }); 

  if (!findWorkPlan) {
    res.send(listHelper);
  }

  const findDistrict = await DistrictModel.find({ tenquan: quan });
  const findDistrictList = await DistrictModel.find({ khuvuc: findDistrict[0].khuvuc });
  let listDistrictName  = [];

  for (let i = 0; i < findDistrictList.length; i++) {
    listDistrictName.push(findDistrictList[i].tenquan);
  };
  console.log(listDistrictName); 

  const findHelper = await helper.find({
    sotruong: { $in: sotruong },
    "diachi.quan":{ $in: listDistrictName }
  });
  if (!findHelper) {
    res.send(listHelper);
  }

  for (let i = 0; i < findHelper.length; i++) {
    if ((existInWorkPlanArray(findHelper[i].cmnd, findWorkPlan) == true || existInBusyDateArray(findHelper[i].cmnd, findHelperBusyDate) == true) 
    && findHelper[i].cmnd != nguoigiupviec) {
      findHelper.splice(i, 1);
      i--;
    }
  }

  let result = new Array(sotruong.length + 1);

  for (let i = 0; i < sotruong.length + 1; i++) {
    result[i] = [];
  }

  console.log("result " + result);

  for(let i = 0; i < findHelper.length; i++){
    console.log(checkNumberService(findHelper[i].sotruong, sotruong));
    result[checkNumberService(findHelper[i].sotruong, sotruong)].push(findHelper[i]);
  }

  for (let i = 0; i < sotruong.length+1; i++) {
    arrangByDistrict(result[i], quan);
    console.log(i + "  " + result[i].length);
  };
  
  let lastResult = [];
  for (let i = sotruong.length; i >= 0; i--) {
    lastResult = lastResult.concat(result[i]);
  };
  console.log(lastResult.length);

  res.send(lastResult);
}

function arrangByDistrict(arr, district){
    for (var i = 0; i < arr.length; i++) {
        if(arr[i].diachi.quan == district){
          var helperTemp = arr[i];
          arr.splice(i,1);
          arr.unshift(helperTemp);
        }
    };
}

function checkNumberService(sotruong, dichvu){
  var count = 0;
  for (var i = 0; i < dichvu.length; i++) {
    if(sotruong.indexOf(dichvu[i]) != -1){
      count++;
    }
  };
  return count;
}

function existInWorkPlanArray(cmnd, arr){
    for (var i = 0; i < arr.length; i++) {

      if(arr[i].nguoigiupviec == cmnd){
        return true;
      }
    };
    return false;
}

function existInBusyDateArray(cmnd, arr){
    for (var i = 0; i < arr.length; i++) {
      
      if(arr[i].cmnd == cmnd){
        return true;
      }
    };
    return false;
}

module.exports.paymentSalary = async (req, res) => {
  const helperSalary = await HelperSalary.update(
  {
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    cmnd: req.body.cmnd
  },
  {
    trangthai:req.body.trangthai
  });

  let result = { success: false };
  if (helperSalary){
      result.success = true;
  }
  res.send(result);
}

module.exports.listHelperSalary = async (req, res) => {
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);

  const findHelperSalary = await HelperSalary.find({
    startDate:req.body.startDate,
    endDate:req.body.endDate
  });

  if (!findHelperSalary){
    let result = { success: false };
    res.send(result);
  }
  if (findHelperSalary.length == 0){
      calculateNewSalary(req, res, startDate, endDate);
  } else {
    res.send(findHelperSalary);
  }
}

async function calculateNewSalary(req, res, startDate, endDate) {
  const findHelper = await helper.find();
  if (!findHelper){
    res.send({ success: false });
  }

  let newHelpers = [];
  const findRequestDetail = RequestDetailModel.find({
      trangthai:"Hoàn thành",
      giobatdau : {$lt:endDate, $gte:startDate}
  });
  if (!findRequestDetail){
    res.send({ success: false });
  }

  var totalWorkDateInMonth =  getWorkDate(startDate,1,daysInThisMonth(startDate.getMonth()+1,startDate.getFullYear())+1);
  var workDateInThisTimeRange = totalWorkDateInMonth;
  if(startDate.getMonth() == endDate.getMonth()){
    var dateTemp = new Date(endDate);
    dateTemp.setDate(dateTemp.getDate());
    workDateInThisTimeRange = getWorkDate(startDate,startDate.getDate(),dateTemp.getDate());
  }
    for(var i=0;i<findHelper.length;i++){
        var helperTemp = {};
        helperTemp.startDate = startDate;
        helperTemp.endDate = endDate;
        helperTemp._id = findHelper[i]._id;
        helperTemp.cmnd =findHelper[i].cmnd;
  //     helperTemp.email =findHelper[i].email;
        helperTemp.hinhanh =findHelper[i].hinhanh;
        helperTemp.hoten =findHelper[i].hoten;
        helperTemp.luongcodinh =findHelper[i].luongcodinh;
        helperTemp.mucluongtheogio =findHelper[i].mucluongtheogio;
        helperTemp.ngaysinh =findHelper[i].ngaysinh;
        helperTemp.ngaylamviec =findHelper[i].ngaylamviec;
        helperTemp.quequan =findHelper[i].quequan;
        helperTemp.sodt =findHelper[i].sodt;
        helperTemp.batdaulamviec = false;
        helperTemp.dateOffBeforeWork = -1;
        helperTemp.listWorkTime = [];
        helperTemp.salary = 0;
        helperTemp.workTimeInside = 0;
        helperTemp.workTimeOutside = 0;
        helperTemp.workTimeTotal = 0;
        helperTemp.workDateInThisTimeRange = workDateInThisTimeRange;
        helperTemp.totalWorkDateInMonth = totalWorkDateInMonth;

        helperTemp.salary = (helperTemp.luongcodinh/totalWorkDateInMonth)*workDateInThisTimeRange;
        helperTemp.trangthai = "Chưa thanh toán";
        for(var j=0;j<findRequestDetail.length;j++){
          if(helperTemp.cmnd==findRequestDetail[j].nguoigiupviec){

            helperTemp.listWorkTime.push(findRequestDetail[j]);
            var startTime  = new Date(findRequestDetail[j].giobatdau);
            var endTime = new Date(findRequestDetail[j].gioketthuc);
            var workTimeTotalTemp = endTime.getUTCHours() - startTime.getUTCHours();
            helperTemp.workTimeTotal += endTime.getUTCHours() - startTime.getUTCHours();
            if(endTime.getUTCMinutes() - startTime.getUTCMinutes() > 0){
                helperTemp.workTimeTotal+=0.5;
            }else{
              if(endTime.getUTCMinutes() - startTime.getUTCMinutes() < 0){
                helperTemp.workTimeTotal-=0.5;
              }
            }
            helperTemp.salary = helperTemp.salary + helperTemp.mucluongtheogio * workTimeTotalTemp;
            findRequestDetail[j].giobatdau = new Date(findRequestDetail[j].giobatdau);
            findRequestDetail[j].gioketthuc = new Date(findRequestDetail[j].gioketthuc);
            
            var sogiongoaigio = findRequestDetail[j].sogiongoaigio;

            helperTemp.salary = helperTemp.salary + (sogiongoaigio * helperTemp.mucluongtheogio * 0.1);
          }
            
      }
      if(helperTemp.luongcodinh>0){
          var ngaylamviec = new Date(helperTemp.ngaylamviec);
          if(ngaylamviec>=startDate && ngaylamviec<endDate){
              var dateOffCountTemp = 0; // vi tinh luong tu ngay lam viec
              if(ngaylamviec>startDate)
                dateOffCountTemp = getWorkDate(ngaylamviec,1,ngaylamviec.getDate());

              helperTemp.salary = helperTemp.salary-((helperTemp.luongcodinh/totalWorkDateInMonth)*dateOffCountTemp);
              helperTemp.batdaulamviec = true;
              helperTemp.dateOffBeforeWork = dateOffCountTemp;
          }else{
            if(ngaylamviec>endDate){
              helperTemp.salary = 0;
              helperTemp.batdaulamviec = true;
            }
          }
      }
      
    helperTemp.salary = helperTemp.salary-(helperTemp.salary%1000);
    newHelpers.push(helperTemp);
  }
    if(startDate.getMonth() == endDate.getMonth()-1){
      storeHelperSalaryToDB(newHelpers);
    }
    
    res.send(newHelpers);
}

async function storeHelperSalaryToDB(newHelpers){
    for (var i = 0; i < newHelpers.length; i++) {
      await HelperSalary.create({
        startDate : newHelpers[i].startDate,
        endDate:newHelpers[i].endDate,
        cmnd :newHelpers[i].cmnd,
        hoten : newHelpers[i].hoten,
        ngaylamviec:newHelpers[i].ngaylamviec,
        ngaysinh : newHelpers[i].ngaysinh,
        sodt : newHelpers[i].sodt,
        quequan : newHelpers[i].quequan,
        hinhanh :newHelpers[i].hinhanh,
        luongcodinh :newHelpers[i].luongcodinh,
        mucluongtheogio :newHelpers[i].mucluongtheogio,
        batdaulamviec :newHelpers[i].batdaulamviec,
        listWorkTime :newHelpers[i].listWorkTime,
        workTimeInside :newHelpers[i].workTimeInside,
        workTimeOutside :newHelpers[i].workTimeOutside,
        workTimeTotal :newHelpers[i].workTimeTotal,
        workDateInThisTimeRange :newHelpers[i].workDateInThisTimeRange,
        totalWorkDateInMonth :newHelpers[i].totalWorkDateInMonth,
        salary :newHelpers[i].salary,
        trangthai:newHelpers[i].trangthai,
        dateOffBeforeWork :newHelpers[i].dateOffBeforeWork
      })
    };
}

function getWorkDate(dateTemp,start,end){
    var date = new Date(dateTemp);
    var count =0;
    for(var i=start;i<end;i++){
      date.setDate(i);
      if(date.getDay() >0 && date.getDay()<6){
          count++;
      }
    }
    return count;
}

function daysInThisMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

