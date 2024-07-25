require("dotenv").config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var session = require('express-session');
var RedisStore = require('connect-redis').default;

var morgan = require('morgan');
var methodOverride = require('method-override');
var readFileRoute = require('./routes/ReadFile');
var helperRoute = require('./routes/APIHelper');
var stuffRoute = require('./routes/APIStuff');
var locationRoute = require('./routes/APILocation');
var districtRoute = require('./routes/APIDistrict');
var wardRoute = require('./routes/APIWard');
var requestRoute = require('./routes/APIRequest');
var requestDetailRoute = require('./routes/APIRequestDetail');
var workPlanRoute = require('./routes/APIWorkPlan');
var busyDateRoute =  require('./routes/APIBusyDate');
var offDateRoute =  require('./routes/APIOffDateStuff');
var accountRoute =  require('./routes/APIAccount');
var serviceRoute =  require('./routes/APITieuChi');
var dashboardRoute =  require('./routes/APIDashboard.js');
var validate = require('./MyMiddleware/Validate.js');
var app = express();
var editRoute =  require('./routes/APIEdit.js');
var customerRoute =  require('./routes/APICustomer.js');
var router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat',
  resave : false,
  saveUninitialized : true
}));


app.use(function(req, res, next){
  req.url = validate.checkURL(req);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

    router.get('/api/test',helperRoute.findFreeHelper);
    router.get('/api/changeTypeOfCMND',editRoute.editAllThing);

// route call dashboard api
    router.post('/api/dashboard/newRequestByDistrict',dashboardRoute.listNewRequestByDistrictInTimeRange);
    router.post('/api/dashboard/loadServiceData',dashboardRoute.loadServiceDataInRequest);
// routes call helper api
    router.get('/api/helper/list',helperRoute.listHelper);

    router.get('/api/helper/find/:cmnd',helperRoute.findHelper);


    router.post('/api/helper/delete', helperRoute.deleteHelper);

    router.post('/api/helper/addHelper', helperRoute.createHelper);
    router.post('/api/helper/editHelper', helperRoute.editHelper);

    router.post('/api/helper/upload/image',multipartMiddleware, helperRoute.uploadImage);
    router.post('/api/helper/findFreeHelper',helperRoute.findFreeHelper);
    router.post('/api/helper/listHelperSalary',helperRoute.listHelperSalary);
    
    router.post('/api/helper/paymentSalary',helperRoute.paymentSalary);

// route for busy time
    router.get('/api/helper/busyDate/:cmnd',busyDateRoute.findBusyDate);
    router.post('/api/helper/addBusyTime', busyDateRoute.checkExistsWorkPlan);
    router.post('/api/helper/addBusyTimeAndDeleteExistsWorkPlan', busyDateRoute.addBusyTime);

    router.delete('/api/helper/deleteBusyTime/:_id', busyDateRoute.deleteBusyTime);
    

// routes call stuff api
    router.get('/api/stuff/list',stuffRoute.listStuff);
    
    router.get('/api/stuff/find/:cmnd',stuffRoute.findStuff);
    
    router.post('/api/stuff/delete', stuffRoute.deleteStuff);

    router.post('/api/stuff/addStuff', stuffRoute.createStuff);

    router.post('/api/stuff/upload/image',multipartMiddleware, stuffRoute.uploadAvatar);
   
    router.post('/api/stuff/editStuff', stuffRoute.editStuff);


    router.get('/api/stuff/offDate/:cmnd',offDateRoute.findOffDate);
    router.post('/api/stuff/addOffDate',offDateRoute.addOffDate);
    router.delete('/api/stuff/deleteOffDate/:_id', offDateRoute.deleteOffDate);

    router.post('/api/staff/listSalary', stuffRoute.listSalary); 
    router.post('/api/staff/paymentSalary', stuffRoute.paymentSalary); 

// routes call request api
    router.post('/api/request/list/notdone',requestRoute.listRequestNotDone);
    router.post('/api/request/list/done',requestRoute.listRequestDone);
    router.post('/api/request/list/doneAndPayment',requestRoute.listRequestDoneAndPayment);
    router.post('/api/request/list/waiting',requestRoute.listRequestWaiting);

    router.get('/api/request/find/:id',requestRoute.findRequest);
    router.post('/api/request/updateStatus', requestRoute.updateStatus);
    router.post('/api/request/updateThoaThuan', requestRoute.updateThoaThuan);

    router.get('/api/request/getDataForCreateRequest', requestRoute.getDataForCreateRequest);
    router.post('/api/request/createRequest',requestRoute.createRequest);
    router.post('/api/request/payment',requestRoute.payment);
    router.delete('/api/request/delete/:_id',requestRoute.deleteRequest);
// routes call request detail
    router.get('/api/requestDetail/findByYeuCau/:idyeucau',requestDetailRoute.findRequestDetailByYeuCau);
    router.post('/api/requestDetail/updateNGV', requestDetailRoute.updateRequestDetailNGV);
    router.post('/api/requestDetail/updateTime', requestDetailRoute.updateRequestDetailTime);
    router.post('/api/requestDetail/updateDone', requestDetailRoute.updateDone);
    router.post('/api/requestDetail/updateGiaoViec', requestDetailRoute.updateGiaoViec);
    router.post('/api/requestDetail/delete',requestDetailRoute.deleteRequestDetail);

    

// route call lich lam viec
    router.post('/api/workPlan/updateNGV', workPlanRoute.updateWorkPlanNGV);

    router.post('/api/workPlan/updateTime', workPlanRoute.updateWorkPlanTime);
    router.delete('/api/workPlan/delete/:idchitietyc', workPlanRoute.deleteWorkPlan);
    router.get('/api/workPlan/findByNGV/:cmnd', workPlanRoute.findByNGV);
    router.get('/api/workPlan/findByNGVFromToday/:cmnd', workPlanRoute.findByNGVFromToday);

// routes call location / district api 
    router.post('/api/location/addLocation', locationRoute.createLocation);    
    router.get('/api/location/list', locationRoute.listLocation);
    router.delete('/api/location/delete/:tenkhuvuc', locationRoute.deleteLocation);    
    
    router.post('/api/district/addDistrict', districtRoute.createDistrict);    
    router.get('/api/district/list', districtRoute.listDistrict);
    router.delete('/api/district/delete/:tenquan', districtRoute.deleteDistrict);       
    
    router.post('/api/ward/addWard', wardRoute.createWard);    
    router.get('/api/ward/list', wardRoute.listWard);
    router.delete('/api/ward/delete/:_id', wardRoute.deleteWard);    
 


// route for account
    router.get('/api/account/findUsername/:username', accountRoute.findUsername);
    router.post('/api/account/addAccount', accountRoute.addAccount);
    router.post('/api/account/login', accountRoute.login);
    router.post('/api/account/logout', accountRoute.logout);
    router.post('/api/account/changePassword', accountRoute.changePassword);

    router.post('/api/account/changeRole', accountRoute.changeRole);
    router.get('/api/account/findStuffHaveNotAccount', accountRoute.findStuffHaveNotAccount);
    router.get('/api/account/list', accountRoute.listAccount);    
    router.delete('/api/account/delete/:username', accountRoute.deleteAccount);

// route for service

    router.get('/api/service/list', serviceRoute.listService);
    router.get('/api/service/listName', serviceRoute.listName);
    router.post('/api/service/update', serviceRoute.updateService);
    router.post('/api/service/create', serviceRoute.createService);
    router.delete('/api/service/delete/:_id', serviceRoute.deleteService);     

// route for customer
    router.get('/api/customer/list', customerRoute.listCustomer);
    router.post('/api/customer/listRequestByCustomer', customerRoute.listRequestByCustomer);
// route for saraly
    

    // Routes read files

    router.get('/public/images/*', readFileRoute.readAvatar);
    router.get('*', readFileRoute.readFile);

app.use(router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err

    });
    console.log(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
