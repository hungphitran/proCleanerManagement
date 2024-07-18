var StuffTemp = require('../Models/Stuff');
var stuff = StuffTemp.Stuff;
var fs = require('fs');
var StuffBusyTemp = require('../Models/OffDateStuff');
var offDateStuff = StuffBusyTemp.OffDateStuff;
var StaffSalaryTemp = require('../Models/StaffSalary');
var StaffSalary = StaffSalaryTemp.StaffSalary;
var AccountTemp = require('../Models/Account');
var Account = AccountTemp.Account;

function getFileType(url)
{
    var position = url.lastIndexOf('.');
    return url.substring(position,url.length);
}
exports.uploadAvatar = function (req, res) {

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

exports.listStuff = function (req, res) {
  console.log("new url "+req.url);
  stuff.find(function(err, _stuffs) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err){
                res.send(err);
                return;
            }
            res.json(_stuffs); // return all todos in JSON format
  });
}

exports.createStuff = function (req, res) {
  stuff.create({
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

exports.deleteStuff = function(req,res){
    stuff.remove({
        _id : req.body._id
    },function(err,_stuff)
        {
            if(err){
                res.send(err);
                return;
            }
            stuff.find(function(err, _stuffs){
                if(err){
                    res.send(err);
                    return;
                }
                if (fs.existsSync("public/images/nhanvien/"+req.body.cmnd)){
                  deleteFolderRecursive("public/images/nhanvien/"+req.body.cmnd);
                }
                Account.remove({
                    cmnd : req.body.cmnd
                }, function (err, _account) {
                  console.log(err);
                  console.log(_account);
                  res.send(_stuffs);
            
                });
            });
        });
};

exports.findStuff = function(req,res){
  stuff.find({
      cmnd : req.params.cmnd
  }, function (err, _stuff) {
    if (err){
        res.send(err);
        return;
    }
    res.json(_stuff);
  });
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

exports.editStuff = function(req,res){
  stuff.update({
      cmnd : req.body.cmnd
  },{
      hoten : req.body.hoten,
      ngaysinh : req.body.ngaysinh,
      sodt :  req.body.sodt,
      quequan : req.body.quequan,
      hinhanh : req.body.hinhanh,
      luong : req.body.luong,
      email : req.body.email,
    }, function (err, _details) {
    var result ={success:false};
    if (!err){
        result.success = true;
    }
    res.send(result);
  });
}


exports.paymentSalary = function(req, res){
  StaffSalary.update({
      startDate:req.body.startDate,
      endDate:req.body.endDate,
      cmnd:req.body.cmnd
  },{
      trangthai:req.body.trangthai
    }, function (err, _helperSalary) {
    var result ={success:false};
    if (!err){
        result.success = true;
    }
    res.send(result);
  });
}


exports.listSalary = function (req, res) {
  var startDate = new Date(req.body.startDate)
  var endDate = new Date(req.body.endDate);
  
    StaffSalary.find({
            startDate:req.body.startDate,
            endDate:req.body.endDate
        },function(err,_staffSalary){
      if(err){
          var result ={success:false};
          res.send(result);
          return;
      }
      console.log(_staffSalary);
      if(_staffSalary.length==0){
          calculateNewSalary(req, res,startDate,endDate);
      }else{
        res.send(_staffSalary);
      }
  });
}

function calculateNewSalary(req, res,startDate,endDate){

    stuff.find(function(err, _staffs) {
        
        if (err){
            var result ={success:false};
            res.send(result);
            return;
        }
        var newStaffs = [];
        offDateStuff.find({
            ngay : {$lt:endDate, $gte:startDate}
        }, function (err, _offDates) {
          if (err){
              var result ={success:false};
              res.send(result);
              return;
          }
          var totalWorkDateInMonth =  getWorkDate(startDate,1,daysInThisMonth(startDate.getMonth()+1,startDate.getFullYear())+1);
          var workDateInThisTimeRange = totalWorkDateInMonth;
          if(startDate.getMonth() == endDate.getMonth()){
            var dateTemp = new Date(endDate);
            dateTemp.setDate(dateTemp.getDate());
            workDateInThisTimeRange = getWorkDate(startDate,startDate.getDate(),dateTemp.getDate());
          }

          for(var i=0;i<_staffs.length;i++){
              var staffTemp = {};
              staffTemp.startDate =startDate;
              staffTemp.endDate = endDate;
              staffTemp._id = _staffs[i]._id;
              staffTemp.cmnd =_staffs[i].cmnd;
              staffTemp.email =_staffs[i].email;
              staffTemp.hinhanh =_staffs[i].hinhanh;
              staffTemp.hoten =_staffs[i].hoten;
              staffTemp.luong =_staffs[i].luong;
              staffTemp.ngaysinh =_staffs[i].ngaysinh;
              staffTemp.ngaylamviec =_staffs[i].ngaylamviec;
              staffTemp.quequan =_staffs[i].quequan;
              staffTemp.sodt =_staffs[i].sodt;
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
              for(var j=0;j<_offDates.length;j++){
                if(staffTemp.cmnd==_offDates[j].cmnd){

                  staffTemp.listOffDate.push(_offDates[j]);
                  if(_offDates[j].loai=="Cả Ngày"){
                    staffTemp.offDate += 1;
                  }else{
                    staffTemp.offDate += 0.5;
                  }
                  _offDates.splice(j,1);
                  j--;

                }
              }
              staffTemp.salary = (staffTemp.luong/totalWorkDateInMonth)*workDateInThisTimeRange-(staffTemp.luong/totalWorkDateInMonth)*staffTemp.offDate;

              var ngaylamviec = new Date(staffTemp.ngaylamviec);
              if(ngaylamviec>=startDate && ngaylamviec<endDate){
                  var dateOffCountTemp = 0; // vi tinh luong tu ngay lam viec
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
        });
  });

  }
function storeStaffSalaryToDB(newStaffs){
    for (var i = 0; i < newStaffs.length; i++) {
      StaffSalary.create({
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
      }, function(err, _staffSalary){
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