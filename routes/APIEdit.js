const CustomerTemp = require('../Models/Customer');
const CustomerModel = CustomerTemp.Customer;

module.exports.editAllThing = async (req, res) => {
  const customers = await CustomerModel.find();

  for (var i = 0; i < customers.length; i++) {
    CustomerModel.updateOne(
      {_id: customers[i]._id},
      {sdt: "0" + customers[i].sdt + ""});
  }

	// stuff.find(function(err, _helpers) {
 //      if (err){
 //          res.send(err);
 //          return;
 //      }
 //      for (var i = 0; i < _helpers.length; i++) {
 //        stuff.update({
 //          _id:_helpers[i]._id},
 //          {cmnd:_helpers[i].cmnd+"", sodt:"0"+_helpers[i].sodt},
 //           function (err, _details) {
 //          });
        
 //      };

 //  });


	// StaffSalary.find(function(err, _helpers) {
 //      if (err){
 //          res.send(err);
 //          return;
 //      }
 //      for (var i = 0; i < _helpers.length; i++) {
 //        StaffSalary.update({
 //          _id:_helpers[i]._id},
 //          {cmnd:_helpers[i].cmnd+"", sodt:"0"+_helpers[i].sodt},
 //           function (err, _details) {
 //          });
        
 //      };

 //  });



	// RequestModel.find(function(err, data) {
 //      if (err){
 //          res.send(err);
 //          return;
 //      }
 //      for (var i = 0; i < data.length; i++) {
 //        RequestModel.update({
 //          _id:data[i]._id},
 //          {nhanvienxuly:data[i].nhanvienxuly+"", sdtkhachhang:"0"+data[i].sdtkhachhang, nhanvienttcmnd:data[i].nhanvienttcmnd+""},
 //           function (err, _details) {
 //          });
        
 //      };

 //  });


	// offDateStuff.find(function(err, data) {
 //      if (err){
 //          res.send(err);
 //          return;
 //      }
 //      for (var i = 0; i < data.length; i++) {
 //        data[i].cmnd = data[i].cmnd+"";
 //        offDateStuff.update({
 //          _id:data[i]._id},
 //          {cmnd:data[i].cmnd+""},
 //           function (err, _details) {
 //          });
        
 //      };

 //  });


 //  helper.find(function(err, _helpers) {
 //      if (err){
 //          res.send(err);
 //          return;
 //      }
 //      for (var i = 0; i < _helpers.length; i++) {
 //        _helpers[i].cmnd = _helpers[i].cmnd+"";
 //        helper.update({
 //          _id:_helpers[i]._id},
 //          {cmnd:_helpers[i].cmnd+"", sodt:"0"+_helpers[i].sodt},
 //           function (err, _details) {
 //          });
        
 //      };

 //  });

 //  helperBusyDate.find(function(err, _helpers) {
 //      if (err){
 //          res.send(err);
 //          return;
 //      }
 //      for (var i = 0; i < _helpers.length; i++) {
 //        _helpers[i].cmnd = _helpers[i].cmnd+"";
 //        helperBusyDate.update({
 //          _id:_helpers[i]._id},
 //          {cmnd:_helpers[i].cmnd+""},
 //           function (err, _details) {
 //          });
        
 //      };

 //  });	
 //  Account.find(function(err, data) {
 //      if (err){
 //          res.send(err);
 //          return;
 //      }
 //      for (var i = 0; i < data.length; i++) {
 //        data[i].cmnd = data[i].cmnd+"";
 //        Account.update({
 //          _id:data[i]._id},
 //          {cmnd:data[i].cmnd+""},
 //           function (err, _details) {
 //          });
        
 //      };

 //  });

 //  HelperSalary.find(function(err, data) {
 //      if (err){
 //          res.send(err);
 //          return;
 //      }
 //      for (var i = 0; i < data.length; i++) {
 //        data[i].cmnd = data[i].cmnd+"";
 //        HelperSalary.update({
 //          _id:data[i]._id},
 //          {cmnd:data[i].cmnd+"",sodt:"0"+_helpers[i].sodt},
 //           function (err, _details) {
 //          });
        
 //      };

 //  });	




}