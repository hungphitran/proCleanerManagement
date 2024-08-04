const AccountTemp = require('../Models/Account.js');
const Account = AccountTemp.Account;
const StaffTemp = require('../Models/Stuff.js');
const Staff = StaffTemp.Stuff;
const validate = require('../MyMiddleware/Validate.js')

module.exports.listAccount = async (req, res) => {
  const accounts = await Account.find();

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
  const isSave = await newAccount.save();
  if (isSave) {
    result.success = true;
  }

  res.send(result); 
}

module.exports.findStuffHaveNotAccount = async (req, res) => {
  const result = { err: true };
  const resultList = [];

  const staffs = await Staff.find();
  if (!staffs) {
    res.send(result);
  }

  const accounts = await Account.find();
  if (!accounts) {
    res.send(result);
  }

  let i,j;
  for (j = 0; j < staffs.length; j++){
    for (i = 0; i < accounts.length; i++) {
      if(staffs[j].cmnd == accounts[i].cmnd){
        break;
      }
    }
    if(i==accounts.length) {
      resultList.push({"cmnd":staffs[j].cmnd, "hoten":staffs[j].hoten});
    }
  }
  res.send(resultList);
}

module.exports.logout = async (req, res) => {
    console.log("logout");
    req.session.destroy();
    console.log("Logout -> session: " + req.session);
    res.send({});
}

module.exports.login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let result = {success: false};

  const account = await Account.find(
    {
      username: username,
      password: password
    }
  );
  
  if (!account) {
    result.success = false;
    res.send(result);
  }
  else {
    if (account == null) {
      result.success = false;
      res.send(result);
    }
    else {
      if (account.length == 0) {
        result.success = false;
        res.send(result);
      }
      else {
        const staffs = await Staff.find({cmnd: account[0].cmnd});

        if (!staffs || staffs.length == 0) {
          result.success = false;
          res.send(result);
        }
        else {
          req.session.username = account[0].username;
          req.session.password = account[0].password;
          req.session.role = account[0].quyen;
          req.session.cmnd = account[0].cmnd;
          req.session.hoten = account[0].hoten;
          req.session.loginStatus = true;
          console.log(req.session);
          ///// not done yet
          result = {
            success: true,
            stuff: staffs[0],
            startURL: validate.startURL,
            templateURL: validate.templateURL,
            account: account[0]
          };

          // Send success response
          res.send(result);
        }
      }
    }
  }
}

module.exports.changePassword = async (req, res) => {
  const username = req.body.username;
  const newPassword = req.body.password;
  let result = { success: false };

  const isChangePassDone = await Account.updateOne(
    { username: username }, 
    { password: newPassword }
  );
  if (isChangePassDone) {
    result.success = true;
  }

  res.send(result);
}

module.exports.changeRole = async (req, res) => {
  const username = req.body.username;
  const newRole = req.body.quyen;
  let result = { success: false };

  const isChangeRoleDone = await Account.updateOne(
    { username: username }, 
    { quyen: newRole }
  );
  if (isChangeRoleDone) {
    result.success = true;
  }

  res.send(result);
}

module.exports.updateDone = async (req, res) => {
  const id = req.body.id;
  let result = { success: false }; 

  const isUpdateDone = await Account.updateOne(
    { _id: id }, 
    { matdo : req.body.matdo, 
      hudo : req.body.hudo, 
      lienlac :req.body.lienlac, 
      trangthai : req.body.trangthai, 
      nhanxet : req.body.nhanxet
    });
  
  if (isUpdateDone) {
    result.success = true;
  }

  res.send(result);
}

module.exports.deleteAccount = async (req, res) => {
  const username = req.params.username;
  let result = { success: false };

  const isDeleted = await Account.deleteOne({ username: username });
  if (isDeleted) {
    result.success = true;
  }

  res.send(result);
}
