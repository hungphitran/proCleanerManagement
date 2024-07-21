const StuffTemp = require('../Models/Stuff');
const stuff = StuffTemp.Stuff;
const fs = require('fs');
const StuffBusyTemp = require('../Models/OffDateStuff');
const offDateStuff = StuffBusyTemp.OffDateStuff;
const StaffSalaryTemp = require('../Models/StaffSalary');
const StaffSalary = StaffSalaryTemp.StaffSalary;
const AccountTemp = require('../Models/Account');
const Account = AccountTemp.Account;


function getFileType(url)
{
    var position = url.lastIndexOf('.');
    return url.substring(position,url.length);
}

module.exports.uploadAvatar = function (req, res) {
  try{
    var oldName = req.files.image.name;
    var path = req.body.path;
    var fileName = req.body.fileName;
    path  = path;
    if (!fs.existsSync(path)){
      fs.mkdirSync(path);
      console.log("create folder");
    }
    ins = fs.createReadStream(req.files.image.path).pipe(fs.createWriteStream(path+fileName));
    console.log("done");
    res.end();
 }catch(err){
  console.log(err);
   res.send(err);
 }
}

module.exports.listStuff = async (req, res) => {
  console.log("new url "+req.url);

  const findStuff = await stuff.find();
  res.json(findStuff); // return all todos in JSON format
}

module.exports.createStuff = async (req, res) => {
  await stuff.create({
          cmnd : req.body.cmnd,
          hoten : req.body.hoten,
          ngaysinh : req.body.ngaysinh,
          ngaylamviec:req.body.ngaylamviec,
          quequan : req.body.quequan,
          hinhanh : req.body.hinhanh,
          sodt : req.body.sodt,
          luong : req.body.luong,
          quyenhethong : req.body.quyenhethong,
          email : req.body.email,
          function() {
            console.log("created");
          }
      })
      .catch((err, _stuff) => {
        var result ={success:false};
          if (!err){
            result.success = true;
          }
        res.send(result); 
      });
};

module.exports.deleteStuff = async (req, res) => {
  await stuff.remove({_id: req.body._id});

  const findStuffs = await stuff.find();
  if (fs.existsSync("public/images/nhanvien/"+req.body.cmnd)) {
    deleteFolderRecursive("public/images/nhanvien/"+req.body.cmnd);
  }

  await Account.remove({cmnd: req.body.cmnd});

  res.send(findStuffs);
}

module.exports.findStuff = async (req, res) => {
  const findStuff = await stuff.find({cmnd: req.params.cmnd});
  res.json(findStuff);
}

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

module.exports.editStuff = async (req, res) => {
  const updateStuff = await stuff.update(
    {cmnd : req.body.cmnd},
    {
      hoten : req.body.hoten,
      ngaysinh : req.body.ngaysinh,
      sodt :  req.body.sodt,
      quequan : req.body.quequan,
      hinhanh : req.body.hinhanh,
      luong : req.body.luong,
      email : req.body.email
    }
  );
  let result = {success:false};
  if (updateStuff){
    result.success = true;
  }
  res.send(result);
}

module.exports.paymentSalary = async (req, res) => {
  const updateStaffSalary = await StaffSalary.update(
    {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      cmnd: req.body.cmnd
    },
    {trangthai: req.body.trangthai}
  );

  let result = {success:false};
  if (updateStaffSalary) {
      result.success = true;
  }
  res.send(result);
}

module.exports.listSalary = async (req, res) => {
  const startDate = new Date(req.body.startDate)
  const endDate = new Date(req.body.endDate);
  
  const findStaffSalary = await StaffSalary.find(
    {
      startDate:req.body.startDate,
      endDate:req.body.endDate
    }
  );

  if (!findStaffSalary) {
    res.send({success:false});
  }
  console.log(findStaffSalary);
  if (findStaffSalary.length == 0) {
    calculateNewSalary(req, res, startDate, endDate);
  }
  else {
    res.send(findStaffSalary);
  }
}

async function calculateNewSalary(req, res, startDate, endDate){
  let result = {success:false};
  let newStaffs = [];

  const findStuff = await stuff.find();
  if (!findStuff) {
    res.send(result);
  }

  const findOffDayStuff = await offDateStuff.find({ngay : {$lt:endDate, $gte:startDate}});
  if (!findOffDayStuff) {
    res.send(result);
  }

  let totalWorkDateInMonth =  getWorkDate(startDate, 1, daysInThisMonth(startDate.getMonth()+1,startDate.getFullYear())+1);
  let workDateInThisTimeRange = totalWorkDateInMonth;

  if (startDate.getMonth() == endDate.getMonth()){
    let dateTemp = new Date(endDate);
    dateTemp.setDate(dateTemp.getDate());
    workDateInThisTimeRange = getWorkDate(startDate,startDate.getDate(),dateTemp.getDate());
  }

  for(let i=0;i<findStuff.length;i++){
      let staffTemp = {};
      staffTemp.startDate = startDate;
      staffTemp.endDate = endDate;
      staffTemp._id = findStuff[i]._id;
      staffTemp.cmnd =findStuff[i].cmnd;
      staffTemp.email =findStuff[i].email;
      staffTemp.hinhanh =findStuff[i].hinhanh;
      staffTemp.hoten =findStuff[i].hoten;
      staffTemp.luong =findStuff[i].luong;
      staffTemp.ngaysinh =findStuff[i].ngaysinh;
      staffTemp.ngaylamviec =findStuff[i].ngaylamviec;
      staffTemp.quequan =findStuff[i].quequan;
      staffTemp.sodt =findStuff[i].sodt;
      staffTemp.batdaulamviec = false;
      staffTemp.workDateInThisTimeRange = workDateInThisTimeRange;
      staffTemp.totalWorkDateInMonth = totalWorkDateInMonth;
      staffTemp.dateOffBeforeWork = -1;
      //staffTemp.workDateInThisTimeRange = workDateInThisTimeRange;
      staffTemp.workDate = 0;
      staffTemp.listOffDate = [];
      staffTemp.salary = 0;
      staffTemp.offDate = 0;
      staffTemp.trangthai = "Chưa thanh toán";
      for(let j=0;j<findOffDayStuff.length;j++){
        if(staffTemp.cmnd==findOffDayStuff[j].cmnd){

          staffTemp.listOffDate.push(findOffDayStuff[j]);
          if(findOffDayStuff[j].loai=="Cả Ngày"){
            staffTemp.offDate += 1;
          }else{
            staffTemp.offDate += 0.5;
          }
          findOffDayStuff.splice(j,1);
          j--;

        }
      }
      staffTemp.salary = (staffTemp.luong/totalWorkDateInMonth)*workDateInThisTimeRange-(staffTemp.luong/totalWorkDateInMonth)*staffTemp.offDate;

      let ngaylamviec = new Date(staffTemp.ngaylamviec);
      if(ngaylamviec>=startDate && ngaylamviec<endDate){
          let dateOffCountTemp = 0; // vi tinh luong tu ngay lam viec
          if(ngaylamviec>startDate)
            dateOffCountTemp = getWorkDate(ngaylamviec,1,ngaylamviec.getDate());

          staffTemp.salary = staffTemp.salary-((staffTemp.luong/totalWorkDateInMonth)*dateOffCountTemp);
          staffTemp.batdaulamviec = true;
          staffTemp.dateOffBeforeWork = dateOffCountTemp;
      }else{
        if(ngaylamviec>=endDate){
          staffTemp.salary = 0;
          staffTemp.batdaulamviec = true;
        }
      }
      staffTemp.salary = staffTemp.salary-(staffTemp.salary%1000);
      newStaffs.push(staffTemp);
  }
  if(startDate.getMonth() == endDate.getMonth()-1){
      storeStaffSalaryToDB(newStaffs);
    }
  res.send(newStaffs);
}

// sai thi sua sau
async function storeStaffSalaryToDB(newStaffs){
    for (var i = 0; i < newStaffs.length; i++) {
      await StaffSalary.create({
        startDate :newStaffs[i].startDate,
        endDate:newStaffs[i].endDate,
        cmnd :newStaffs[i].cmnd,
        hoten : newStaffs[i].hoten,
        ngaylamviec:newStaffs[i].ngaylamviec,
        ngaysinh : newStaffs[i].ngaysinh,
        sodt : newStaffs[i].sodt,
        quequan : newStaffs[i].quequan,
        hinhanh :newStaffs[i].hinhanh,
        luong :newStaffs[i].luong,
        batdaulamviec :newStaffs[i].batdaulamviec,
        listOffDate :newStaffs[i].listOffDate,
        workDate :newStaffs[i].workDate,
        offDate :newStaffs[i].offDate,
        workDateInThisTimeRange :newStaffs[i].workDateInThisTimeRange,
        totalWorkDateInMonth :newStaffs[i].totalWorkDateInMonth,
        salary :newStaffs[i].salary,
        trangthai:newStaffs[i].trangthai
      })
      .catch(function(err, _staffSalary){
        if(err){
          console.log(err);
        }
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