var HelperTemp = require('../Models/Helper');
var helper = HelperTemp.Helper;
var WorkPlanTemp = require('../Models/WorkPlan');
var WorkPlanModel = WorkPlanTemp.WorkPlan;
var RequestDetailTemp = require('../Models/RequestDetail');
var RequestDetailModel = RequestDetailTemp.RequestDetailModel;

var HelperBusyDateTemp = require('../Models/HelperBusyDate');
var helperBusyDate = HelperBusyDateTemp.HelperBusyDate;

var HelperSalaryTemp = require('../Models/HelperSalary');
var HelperSalary = HelperSalaryTemp.HelperSalary;

var DistrictTemp = require('../Models/District');
var DistrictModel = DistrictTemp.DistrictModel;

var fs = require('fs');

function getFileType(url)
{
    var position = url.lastIndexOf('.');
    return url.substring(position,url.length);
}

exports.listHelper = function (req, res) {
  helper.find(function(err, _helpers) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err){
                res.send(err);
                return;
            }
            res.json(_helpers); // return all todos in JSON format
  });
}

exports.uploadImage = function (req, res) {


  try{
   var oldName = req.files.image.name;
   var newName = req.body.fileName;
   var parentPath = "public/images/ngv/"+req.body.parentPath;
   var path = "public/images/ngv/"+req.body.path;
   if (!fs.existsSync(parentPath)){
    fs.mkdirSync(parentPath);
    }
   if (!fs.existsSync(path)){
    fs.mkdirSync(path);
    }
   ins = fs.createReadStream(req.files.image.path).pipe(fs.createWriteStream(path+newName));
   res.end();
 }catch(err){
   res.send(err);
 }
}
exports.createHelper = function (req, res) {
  helper.create({
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

        }, function(err, _helper) {
            if (err){
                res.send(err);
                return;
            }
            res.end();
        });
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

exports.deleteHelper = function(req,res){
    helper.remove({
        _id : req.body._id
    },function(err,_helper)
        {
            if(err){
                var result ={success:false};
                res.send(result);
                return;
            }
            if (fs.existsSync("public/images/ngv/"+req.body.cmnd)){
              deleteFolderRecursive("public/images/ngv/"+req.body.cmnd);
            }

            helper.find(function(err, _helpers){
                if(err){
                    res.send(err);
                    return;
                }
                res.send(_helpers);
            });
        });
};
exports.findHelper = function(req,res){

  helper.find({
      cmnd : req.params.cmnd
  }, function (err, _helper) {
    if (err){
        res.send(err);
        return;
    }
    res.json(_helper);
  });
}

exports.editHelper = function(req,res){

  console.log("cmnd "+req.body.cmnd);
  console.log(req.body.sotruong);
  helper.update({
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
    }, function (err, _details) {
      console.log(err);
      console.log(_details);
    var result ={success:false};
    if (!err){
        result.success = true;
    }
    res.send(result);
  });
}

exports.findFreeHelper = function(req, res){

    var ngayLamSearch = req.body.ngaylam;
    var giobdSearch = req.body.giobd;
    var gioktSearch = req.body.giokt;
    var nguoigiupviec = req.body.nguoigiupviec;
    var listHelper = [];
    var quan = req.body.quan;
    var sotruong = req.body.sotruong;

    

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
            if(err ){
              listHelper = [];
              res.send(listHelper);
              return;
            }
            
            DistrictModel.find({
              tenquan:quan
            },function(err, _district){
                DistrictModel.find({
                  khuvuc:_district[0].khuvuc
                },function(err, _districtList){
                  
                  var listDistrictName  = [];
          
                  for (var i = 0; i < _districtList.length; i++) {
                    listDistrictName.push(_districtList[i].tenquan);
                  };
                  console.log(listDistrictName);    
                    helper.find({
                      sotruong:{ $in:sotruong},
                      "diachi.quan":{$in: listDistrictName }
                    },function(err, _helpers) {
                      if (err){
                          listHelper = [];
                          res.send(listHelper);
                          return;
                      }

                      for(var i =0; i<_helpers.length;i++){
                          if((existInWorkPlanArray(_helpers[i].cmnd,_workPlans) == true 
                            || existInBusyDateArray(_helpers[i].cmnd,_busyDates) == true) && _helpers[i].cmnd != nguoigiupviec){
                            _helpers.splice(i,1);
                            i--;
                          }
                      }

                      var result = new Array(sotruong.length+1);

                      for (var i = 0; i < sotruong.length+1; i++) {
                        result[i] = [];
                      };
                      console.log("result "+result);
                      for(var i =0; i<_helpers.length;i++){
                        console.log(checkNumberService(_helpers[i].sotruong, sotruong));
                          result[checkNumberService(_helpers[i].sotruong, sotruong)].push(_helpers[i]);
                      }

                      for (var i = 0; i < sotruong.length+1; i++) {
                        arrangByDistrict(result[i],quan);
                        console.log(i+"  "+result[i].length);
                      };
                      
                      var lastResult = [];
                      for (var i = sotruong.length; i >= 0; i--) {
                        lastResult = lastResult.concat(result[i]);
                      };
                      console.log(lastResult.length);
                      res.send(lastResult);
                      return;
                    });

                });

            });

          });
      });
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

exports.paymentSalary = function(req, res){
  HelperSalary.update({
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


exports.listHelperSalary = function (req, res) {
  var startDate = new Date(req.body.startDate);
  var endDate = new Date(req.body.endDate);
  HelperSalary.find({
            startDate:req.body.startDate,
            endDate:req.body.endDate
        },function(err,_helperSalary){
      if(err){
          var result ={success:false};
          res.send(result);
          return;
      }
      if(_helperSalary.length==0){
          calculateNewSalary(req, res,startDate,endDate);
      }else{
        res.send(_helperSalary);
      }
  });
  
}

function calculateNewSalary(req, res,startDate,endDate){
  helper.find(function(err, _helpers) {
        
        if (err){
            var result ={success:false};
            res.send(result);
            return;
        }
        var newHelpers = [];
        RequestDetailModel.find({
            trangthai:"Hoàn thành",
            giobatdau : {$lt:endDate, $gte:startDate}
            
        }, function (err, _workTimes) {
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
           for(var i=0;i<_helpers.length;i++){
               var helperTemp = {};
               helperTemp.startDate = startDate;
               helperTemp.endDate = endDate;
               helperTemp._id = _helpers[i]._id;
               helperTemp.cmnd =_helpers[i].cmnd;
          //     helperTemp.email =_helpers[i].email;
               helperTemp.hinhanh =_helpers[i].hinhanh;
               helperTemp.hoten =_helpers[i].hoten;
               helperTemp.luongcodinh =_helpers[i].luongcodinh;
               helperTemp.mucluongtheogio =_helpers[i].mucluongtheogio;
               helperTemp.ngaysinh =_helpers[i].ngaysinh;
               helperTemp.ngaylamviec =_helpers[i].ngaylamviec;
               helperTemp.quequan =_helpers[i].quequan;
               helperTemp.sodt =_helpers[i].sodt;
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
               for(var j=0;j<_workTimes.length;j++){
                 if(helperTemp.cmnd==_workTimes[j].nguoigiupviec){

                   helperTemp.listWorkTime.push(_workTimes[j]);
                   var startTime  = new Date(_workTimes[j].giobatdau);
                   var endTime = new Date(_workTimes[j].gioketthuc);
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
                    _workTimes[j].giobatdau = new Date(_workTimes[j].giobatdau);
                    _workTimes[j].gioketthuc = new Date(_workTimes[j].gioketthuc);
                    
                    var sogiongoaigio = _workTimes[j].sogiongoaigio;

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
        });
  });
}

function storeHelperSalaryToDB(newHelpers){
    for (var i = 0; i < newHelpers.length; i++) {
      HelperSalary.create({
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
      }, function(err, _helperSalary){
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

