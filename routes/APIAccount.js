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

  const accounts = await Account.find()

  // staffs.forEach(staff => {
  //   const hasAccount = Account.find()
    
  //   // if (!hasAccount) {//
  //   //   resultList.push({ cmnd: staff.cmnd, hoten: staff.hoten });
  //   // }
  // });

  let i,j;
      for (j = 0; j < staffs.length; j++){
           for (i = 0; i < accounts.length; i++) {
            if(staffs[j].cmnd == accounts[i].cmnd){
                break;
            }
          };
          if(i==accounts.length){
              resultList.push({"cmnd":staffs[j].cmnd, "hoten":staffs[j].hoten});
          }
        };
        res.send(resultList);

  // res.send(resultList);
}

module.exports.logout = (req, res) => {
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

module.exports.changePassword = async (req, res) => {
  const username = req.body.username;
  const newPassword = req.body.password;
  let result = { success: false };

  const isChangePassDone = await Account.update({ username: username }, { password: newPassword });
  if (!isChangePassDone) {
    result.success = true;
  }

  res.send(result);
}

module.exports.changeRole = async (req, res) => {
  const username = req.body.username;
  const newRole = req.body.quyen;
  let result = { success: false };

  const isChangeRoleDone = await Account.update({ username: username }, { quyen: newRole });
  if (!isChangeRoleDone) {
    result.success = true;
  }

  res.send(result);
}

module.exports.updateDone = async (req, res) => {
  const id = req.body.id;
  let result = { success: false }; 

  const isUpdateDone = await Account.update(
    { _id: id }, 
    { matdo : req.body.matdo, 
      hudo : req.body.hudo, 
      lienlac :req.body.lienlac, 
      trangthai : req.body.trangthai, 
      nhanxet : req.body.nhanxet
    });
  
  if (!isUpdateDone) {
    result.success = true;
  }

  res.send(result);
}

module.exports.deleteAccount = async (req, res) => {
  const username = req.params.username;
  let result = { success: false };

  const isDeleted = await Account.remove({ username: username });
  if (!isDeleted) {
    result.success = true;
  }

  res.send(result);
}
