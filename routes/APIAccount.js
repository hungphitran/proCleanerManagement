const AccountTemp = require('../Models/Account.js');
const Account = AccountTemp.Account;
const StaffTemp = require('../Models/Stuff.js');
const Staff = StaffTemp.Stuff;
const validate = require('../MyMiddleware/Validate.js')

module.exports.listAccount = async (req, res) => {
  const accounts = await Account.find(find);

  if (!accounts) {
    res.send(err);
    return;
  }

  res.json(accounts);
}


module.exports.findUsername = async (req, res) => {
  let find = {
    username: req.params.username
  };
  let result = { exist: true };
  const record = await Account.find(find);

  if (!record) {
    result.exist = true;
  } 
  else {
    if (record == null) {
      result.exist = false;
    }
    else {
      if (record.length == 0){
        result.exist = false;
      }
    }
  }

  res.send(result);
}

module.exports.addAccount = async (req, res) => {
  const newAccount = new Account({
    cmnd: req.body.cmnd,
    username: req.body.username,
    password: req.body.password,
    quyen: req.body.quyen,
    hoten: req.body.hoten
  });
  let result = { success: false };
  const isSave = await Account.save(newAccount);

  if (!isSave) {
    result.success = true;
  }

  res.send(result); 
};


exports.findStuffHaveNotAccount = function(req,res){
  var result ={err:true};
  var resultList = [];
  stuff.find(function(err, _stuffs) {
    
    if (err){
        res.send(result);
    }

    Account.find(function(err, _accounts) {
      if (err){
          res.send(result);
      }
      var i,j;
      for (j = 0; j < _stuffs.length; j++){
           for (i = 0; i < _accounts.length; i++) {
            if(_stuffs[j].cmnd == _accounts[i].cmnd){
                break;
            }
          };
          if(i==_accounts.length){
              resultList.push({"cmnd":_stuffs[j].cmnd, "hoten":_stuffs[j].hoten});
          }
      };
      res.send(resultList);
    });
 
  });
}


exports.logout = function(req,res){
    console.log("logout");
    req.session.username = "";
    req.session.password = "";
    req.session.role = "";
    req.session.cmnd = "";
    req.session.hoten = "";
    req.session.loginStatus = false;
    console.log(req.session.role);
    res.send({});
}

module.exports.login = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    // Find the account
    const account = await Account.find(
    { 
      username: username, 
      password: password
    });
    if (!account) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Find the staff
    const staff = await Staff.find({ cmnd: account.cmnd });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    // Create session data
    req.session.username = account.username;
    req.session.password = account.password;
    req.session.role = account.quyen;
    req.session.cmnd = account.cmnd;
    req.session.hoten = account.hoten;
    req.session.loginStatus = true;

    // Send success response
    res.send({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// exports.login = function(req,res){

//   Account.find({
//       username : req.body.username,
//       password : req.body.password
//   }, function (err, _account) {
//     var result ={success:false};
//     if (err){
//         result.success = false;
//         res.send(result);
//         return;
//     }else{
//       if(_account==null){
//         result.success = false;
//         res.send(result);
//         return;
//       }else{
//         if(_account.length==0){
//           result.success = false;
//           res.send(result);
//           return;
//         }else{

//           stuff.find({
//             cmnd:_account[0].cmnd
//           },
//           function (err, stuffList){
//             if(err || stuffList.length == 0){
//               result.success = false;
//               res.send(result);
//               return;
//             }else{
//               req.session.username = _account[0].username;
//               req.session.password = _account[0].password;
//               req.session.role = _account[0].quyen;
//               req.session.cmnd = _account[0].cmnd;
//               req.session.hoten = _account[0].hoten;
//               req.session.loginStatus = true;
//               console.log(req.session.role);
//               ///// not done yet
//               result={
//                 success:true,
//                 stuff:stuffList[0],
//                 startURL:validate.startURL,
//                 templateURL:validate.templateURL,
//                 account:_account[0]
//               };
//               res.send(result);
//               return;
//             }
            

//           });
          
//         }
//       }
//     }
    
//   });

// }

exports.changePassword = function(req,res){
  Account.update({
      username : req.body.username
  },{password : req.body.password}, function (err, _account) {
    var result ={success:false};
    if (!err){
        result.success = true;
    }
    res.send(result);
  });
}

exports.changeRole = function(req,res){
  Account.update({
      username : req.body.username
  },{quyen : req.body.quyen}, function (err, _account) {
    var result ={success:false};
    if (!err){
        result.success = true;
    }
    res.send(result);
  });
}


exports.updateDone = function(req,res){
  var idDetail = req.body.id;
  Account.update({
      id : idDetail
  },{matdo : req.body.matdo, hudo : req.body.hudo, lienlac :req.body.lienlac, trangthai : req.body.trangthai, nhanxet : req.body.nhanxet}, function (err, _details) {
    var result ={success:false};
    if (!err){
        result.success = true;
    }
    res.send(result);
  });
}
exports.deleteAccount = function(req,res){
  Account.remove({
        username : req.params.username
    }, function (err, _account) {
      var result = {success:false};
      if(!err){
        result.success = true;
      }
      res.send(result);

    });
}
