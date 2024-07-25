exports.templateURL = "";
exports.startURL  = "/Home"
exports.checkURL = function(req){
	var currentURL = req.url;
	switch(req.url){


		// customer

		case "/ListCustomer" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-List-Customer";
			currentURL = check(req, "/Views/Customer/ListCustomer.html",[0,1,2,3]);
			break;
		case "/ListCustomerToShowRequest" :
			exports.templateURL = req.url;
			exports.startURL = "/List-Customer-To-Show-Request";
			currentURL = check(req, "/Views/Customer/ListCustomerToShowRequest.html",[0,1,2,3]);
			break;	
		case "/ListRequestByCustomer" :
			exports.templateURL = req.url;
			exports.startURL = "/List-Request-By-Customer";
			currentURL = check(req, "/Views/Customer/ListRequestByCustomer.html",[0,1,2,3]);
			break;		


		// end customer

		case "/Dashboard" :
			exports.templateURL = req.url;
			exports.startURL = "/Dashboard";
			currentURL = check(req, "/Views/Dashboard/Dashboard.html",[0,1]);
			break;
		//start url
		case "/WaitingRequest" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-Waiting-Request-List";
			currentURL = check(req, "/Views/Request/WaitingRequest.html",[0,1,2]);
			break;
		case "/ListRequest" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-Request-Infomation-List";
			currentURL = check(req, "/Views/Request/ListRequest.html",[0,1,2]);
			break;
		case "/ProgressRequestDetail" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-Progress-Request-Detail";
			currentURL = check(req, "/Views/Request/ProgressRequestDetail.html",[0,1,2]);
			break;
		case "/HistoryRequest" :
			exports.templateURL = req.url;
			exports.startURL = "/History-Request";
			currentURL = check(req, "/Views/Request/HistoryRequest.html",[0,1,2,3]);
			break;

		case "/DoneRequestDetail" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-Done-Request-Detail";
			currentURL = check(req, "/Views/Request/DoneRequestDetail.html",[0,1,2,3]);
			break;
		case "/CreateRequest" :
			exports.templateURL = req.url;
			exports.startURL = "/Create-New-Request";
			currentURL = check(req, "/Views/Request/CreateRequest.html",[0,1,2]);
			break;

		case "/PaymentRequest" :
			exports.templateURL = req.url;
			exports.startURL = "/Payment-Request";
			currentURL = check(req, "/Views/Salary/PaymentRequest.html",[0,1,3]);
			break;

		case "/PaymentRequestDetail" :
			exports.templateURL = req.url;
			exports.startURL = "/Payment-Request-Detail";
			currentURL = check(req, "/Views/Salary/PaymentRequestDetail.html",[0,1,3]);
			break;

		// end request url
		// helper url
		case "/ListHelper" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-Helper-Infomation-List";
			currentURL = check(req, "/Views/Helper/ListHelper.html",[0,1,2,3]);
			break;

		case "/EditHelper" :
			exports.templateURL = req.url;
			exports.startURL = "/Edit-Helper";
			currentURL = check(req, "/Views/Helper/EditHelper.html",[0,1,2]);
			break;

		case "/AddHelper" :
			exports.templateURL = req.url;
			exports.startURL = "/Add-New-Helper";
			currentURL = check(req, "/Views/Helper/AddHelper.html",[0,1,2]);
			break;

		case "/HelperBusyList" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-Helpers-Busy-List";
			currentURL = check(req, "/Views/Helper/HelperBusyList.html",[0,1,2,3]);
			break;

		case "/HelperBusyDateDetail" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-Helper-Busy-Date-Detail";
			currentURL = check(req, "/Views/Helper/HelperBusyDateDetail.html",[0,1,2,3]);
			break;

		case "/HelperSalary" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-Helper-Salary";
			currentURL = check(req, "/Views/Salary/HelperSalary.html",[0,1,3]);
			break;
		// end helper url

		// stuff url
		case "/ListStuff" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-Stuff-Infomation-List";
			currentURL = check(req, "/Views/Stuff/ListStuff.html",[0,1,2,3]);
			break;

		case "/AddStuff" :
			exports.templateURL = req.url;
			exports.startURL = "/Add-New-Stuff";
			currentURL = check(req, "/Views/Stuff/AddStuff.html",[0,1,2]);
			break;
		case "/EditStuff" :
			exports.templateURL = req.url;
			exports.startURL = "/Edit-Stuff";
			currentURL = check(req, "/Views/Stuff/EditStuff.html",[0,1,2]);
			break;

		case "/StuffOff" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-Off-Stuff-List";
			currentURL = check(req, "/Views/Stuff/StuffOff.html",[0,1,2,3]);
			break;
		case "/StuffOffDetail" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-Stuff-Off-Detail";
			currentURL = check(req, "/Views/Stuff/StuffOffDetail.html",[0,1,2,3]);
			break;
		case "/StaffSalary" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-Staff-Salary";
			currentURL = check(req, "/Views/Salary/StaffSalary.html",[0,1,3]);
			break;
		// end stuff url

		// location url
		case "/AddLocation" :
			exports.templateURL = req.url;
			exports.startURL = "/Add-New-Location";
			currentURL = check(req, "/Views/Location/AddLocation.html",[0,1,2]);
			break;
		case "/AddDistrict" :
			exports.templateURL = req.url;
			exports.startURL = "/Add-New-District";
			currentURL = check(req, "/Views/Location/AddDistrict.html",[0,1,2]);
			break;
		case "/AddWard" :
			exports.templateURL = req.url;
			exports.startURL = "/Add-New-Ward";
			currentURL = check(req, "/Views/Location/AddWard.html",[0,1,2]);
			break;
		case "/ListLocation" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-List-Location";
			currentURL = check(req, "/Views/Location/ListLocation.html",[0,1,2,3]);
			break;
		// end location
		// start system
		case "/CreateNewAccount" :
			exports.templateURL = req.url;
			exports.startURL = "/Create-New-Account";
			console.log("here");
			currentURL = check(req, "/Views/System/CreateNewAccount.html",[0,1]);
			console.log("here2");
			break;
		case "/ManageAccount" :
			exports.templateURL = req.url;
			exports.startURL = "/Manage-Account";
			currentURL = check(req, "/Views/System/ManageAccount.html",[0,1,2,3]);
			break;
		case "/EditRole" :
			exports.templateURL = req.url;
			exports.startURL = "/Edit-Role";
			currentURL = check(req, "/Views/System/EditRole.html",[0,1]);
			break;
		case "/ShowCost" :
			exports.templateURL = req.url;
			exports.startURL = "/Show-Cost";
			currentURL = check(req, "/Views/System/ShowCost.html",[0,1,2,3]);
			break;

	}

	return currentURL;

}

function check(req, url,role){
	console.log("Check -> role: "+req.session.role);
	console.log("Check -> role: "+req.session.username);
	var currentURL = req.url;
	if(checkAuthen(req) == true){
		if(checkRole(role,req) == false){
			currentURL = "/Views/WrongRole.html";
		}else{
			currentURL = url;
		}
	}else{
		currentURL = "/Views/System/Login.html";
	}
	return currentURL;
}

function checkAuthen(req){
	if(req.session.loginStatus == true){
		return true;
	} 
	return false;
}

function checkRole(listRole,req){
	for(var i=0; i<listRole.length;i++){
		switch(listRole[i]){
			case 0:
				if(checkAdmin(req) == true){
					return true;
				}
				break;
			case 1:
				if(checkQuanLy(req) == true){
					return true;
				}
				break;
			case 2:
				if(checkXuly(req) == true){
					return true;
				}
				break;
			case 3:
				if(checkKeToan(req) == true){
					return true;
				}
				break;
		}
	}
	return false;
}
function checkAdmin(req){
	if(req.session.role.indexOf("Admin") == -1){
		return false;
	}
	return true;
}
function checkQuanLy(req){
	if(req.session.role.indexOf("Quản lý") == -1){
		return false;
	}
	return true;
}
function checkXuly(req){
	if(req.session.role.indexOf("Nhân Viên Xử Lý") == -1){
		return false;
	}
	return true;
}
function checkKeToan(req){
	if(req.session.role.indexOf("Nhân Viên Kế Toán") == -1){
		return false;
	}
	return true;
}