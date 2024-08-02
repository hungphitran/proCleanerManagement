function createNewAccountCtrl($scope, $http,$location,$rootScope) {
	$('#dataSection').hide();
	$scope.wrong = [false, false, false, false ,false,false];
    $scope.roleList = ["Quản lý", "Nhân Viên Xử Lý", "Nhân Viên Kế Toán"];
	$scope.formData = {
			cmnd : "",
			hoten :"",
			username:"",
			password:"",
			rePassword:"",
			quyen: []
	};
	$scope.stuffCMNDList = [];
	$scope.stuffNameList = [];
	$scope.stuffName = "";

	loadData();

    $scope.chooseRole = function(name){
        var idx = $scope.formData.quyen.indexOf(name);
        if (idx > -1) {
          $scope.formData.quyen.splice(idx, 1);
        }
        else {
          $scope.formData.quyen.push(name);
        }
    }

	function loadData(){
		$('#dataSection').hide();
	    $http.get('/api/account/findStuffHaveNotAccount')
	        .success(function(data) {
	        	if(data.err == true){
	        		alert("Lỗi xảy ra trong quá trình tải dữ liệu, F5 để thử lại");
	        	}
	        	for(var i=0;i<data.length;i++){
	        		$scope.stuffCMNDList.push(data[i].cmnd);
	        		$scope.stuffNameList.push(data[i].hoten);
	        	}
	            $scope.formData.cmnd = $scope.stuffCMNDList[0];
	            $scope.stuffName = $scope.stuffNameList[0];
	            $scope.showDefault();
	        })
	        .error(function(data) {
	            alert("Lỗi xảy ra trong quá trình tải dữ liệu, F5 để thử lại");
	        });
    }

    $scope.$watch("formData.cmnd",
        function handleCMNDChange( newValue, oldValue ) {
            if(typeof newValue == 'undefined')
                return;
            for(var i=0;i<$scope.stuffCMNDList.length;i++)
            {
                if($scope.stuffCMNDList[i]==newValue)
                {
                    $scope.stuffName = $scope.stuffNameList[i];
                    $scope.formData.hoten=$scope.stuffNameList[i];
                    break; 
                }
            }
        }
    );


    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }




	$scope.checkUsername = function(event){

		if($scope.formData.username==""||$scope.formData.username==undefined || $scope.formData.username.indexOf(" ")>-1){
			$scope.wrong[0] = false;
	        $scope.wrong[3] = false;
			return;
		}
		var username = $scope.formData.username;
		$http.get('/api/account/findUsername/'+	username)
	        .success(function(data) {
	            if((data== undefined || data.exist == true) && username==$scope.formData.username) {
	            	$scope.wrong[0] = true;
	            	$scope.wrong[3] = false;
	            	return;
	            }
	            if(data.exist==false && username==$scope.formData.username ){
	            	$scope.wrong[0] = false;
	            	$scope.wrong[3] = true;
	            }
	        })
	        .error(function(data) {
	    });
	}

	$scope.createAccount = function(){
		$scope.wrong[1] = false;
		$scope.wrong[2] = false;
        $scope.wrong[4] = false;
        $scope.wrong[5] = false;
         if($scope.stuffCMNDList.length == 0){
            $scope.wrong[5] = true;
            return;
        }
        if($scope.formData.quyen.length == 0){
            $scope.wrong[4] = true;
            return;
        }
        
		if($scope.formData.password.indexOf(" ")>-1 || $scope.formData.password.length < 6){
			$scope.wrong[1] = true;
			return;
		}
		if($scope.formData.password!=$scope.formData.rePassword){
			$scope.wrong[2] = true;
			return;
		}
		$scope.wrong[1] = false;
		$scope.wrong[2] = false;	
        $scope.wrong[4] = false;
        $scope.wrong[5] = false;
		var username = $scope.formData.username;
        for (var i = 0; i < $scope.formData.quyen.length; i++) {
            if($scope.formData.quyen[i] == "Quản lý"){
                $scope.formData.quyen = [];
                $scope.formData.quyen.push("Quản lý");
                break;
            }
        };
		$http.get('/api/account/findUsername/'+	username)
	        .success(function(data) {
	            if((data== undefined || data.exist == true) && username==$scope.formData.username) {
	            	$scope.wrong[0] = true;
	            	$scope.wrong[3] = false;
	            	return;
	            }
	            if(data.exist==false && username==$scope.formData.username ){
	            	
	            	$http.post('/api/account/addAccount/',$scope.formData)
			        .success(function(data) {
			            if(data.success == undefined || data.success == false){
			            	alert("Lỗi xảy ra, vui lòng thử lại");
			            }else{
			            	alert("tạo tài khoản thành công");
			            	$scope.wrong = [false, false, false, false,false,false];
			            	$scope.stuffCMNDList = [];
							$scope.stuffNameList = [];
							$scope.stuffName = "";
							$scope.formData = {
								cmnd : "",
								hoten:"",
								username:"",
								password:"",
								rePassword:"",
								quyen: ""
							};
							loadData();
			            }
			        })
			        .error(function(data) {
			        	alert("Lỗi xảy ra, vui lòng thử lại");
			    });



	            }
	        })
	        .error(function(data) {
	    });
	}
};

function EditRoleCtrl($rootScope,$scope, $http,$location) {
	$('#dataSection').hide();
	$scope.accountList = {};
    $scope.accountListOriginal ={};
    $scope.wrong = [false];
    $scope.searchText = "";
    $scope.typeSearch = "all";
    $scope.accountDetail = {};
    $scope.newRole = [];
    $scope.roleList = ["Quản lý", "Nhân Viên Xử Lý", "Nhân Viên Kế Toán"];
    $scope.tieuchiSearch = [" Tất Cả "," Tài Khoản ", "CMND "," Nhân Viên ","Quyền Hệ Thống"];
    $scope.titleDelete = "";
    $scope.rootAccount = $rootScope.account;
    $scope.objectDelete = null;
    $scope.chooseNewRole = false;

    $http.get('/api/account/list')
        .success(function(data) {
            $scope.accountListOriginal = data;

            $scope.accountList = $scope.accountListOriginal;

            $scope.searchText="";
            $scope.showDefault();
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.deleteAccount = function(account){
        $scope.titleDelete = "tài khoản "+account.username+ " của nhân viên "+account.hoten;
        $scope.objectDelete = account;
        $('#confirmDeleteModal').modal("show");

    }

    $scope.chooseRole = function(name){
        var idx = $scope.newRole.indexOf(name);
        if (idx > -1) {
          $scope.newRole.splice(idx, 1);
        }
        else {
          $scope.newRole.push(name);
        }
        if($scope.newRole.length != $scope.accountDetail.quyen.length){
            $scope.chooseNewRole = true;
            return;
        }
        for (var i = 0; i < $scope.newRole.length; i++) {
            var ok =false;
            for (var j = 0; j < $scope.accountDetail.quyen.length; j++) {
                if($scope.newRole[i] == $scope.accountDetail.quyen[j]){
                    ok =true;
                    break;
                }
            };
            if(ok == false){
                $scope.chooseNewRole = true;
                return;
            }
            
        };
        $scope.chooseNewRole = false;
    }

    $scope.confirmDeleteAccount = function(){
        if($scope.objectDelete == null){
            return;
        }
        $http.delete('api/account/delete/' + $scope.objectDelete.username)
            .success(function(data){
                if(data.success == false){
                    alert("Xóa không thành công, vui lòng thử lại");
                    return;
                }
                alert("Xóa tài khoản thành công ");
                for (var i = 0; i < $scope.accountList.length; i++) {
                    if($scope.accountList[i].username == $scope.objectDelete.username){
                        $scope.accountList.splice(i,1);
                        break
                    }
                };
                for (var i = 0; i < $scope.accountListOriginal.length; i++) {
                    if($scope.accountListOriginal[i].username == $scope.objectDelete.username){
                        $scope.accountListOriginal.splice(i,1);
                        break;
                    }
                };
                $('#confirmDeleteModal').modal("hide");

            })
            .error(function(data){
                    alert("Xóa không thành công, vui lòng thử lại");
            });
    }

    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }

    $scope.search = function(newValue){
        var tempResult = [];
        if($scope.accountListOriginal == undefined){
        	return;
        }
        switch($scope.typeSearch){
        case " Tất Cả ":
            for(var i=0;i<$scope.accountListOriginal.length;i++)
            {
                if($scope.accountListOriginal[i].hoten.toUpperCase().indexOf(newValue.toUpperCase())>-1 
                    ||($scope.accountListOriginal[i].cmnd+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||$scope.accountListOriginal[i].account.toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||$scope.accountListOriginal[i].quyen.toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.accountListOriginal[i]);  
                }
            }
            $scope.accountList = tempResult;
            break;
        case " CMND ":
            for(var i=0;i<$scope.accountListOriginal.length;i++)
            {
                if(($scope.accountListOriginal[i].cmnd+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.accountListOriginal[i]);  
                }
            }
            $scope.accountList = tempResult;
            break;
        case " Tài Khoản ":
            for(var i=0;i<$scope.accountListOriginal.length;i++)
            {
                if(($scope.accountListOriginal[i].account+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.accountListOriginal[i]);  
                }
            }
            $scope.accountList = tempResult;
            break;
        case " Nhân Viên ":
            for(var i=0;i<$scope.accountListOriginal.length;i++)
            {
                if($scope.accountListOriginal[i].hoten.toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.accountListOriginal[i]);  
                }
            }
            $scope.accountList = tempResult;
            break;
        case "Quyền Hệ Thống":
            for(var i=0;i<$scope.accountListOriginal.length;i++)
            {
                if($scope.accountListOriginal[i].quyen.toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.accountListOriginal[i]);  
                }
            }
            $scope.accountList = tempResult;
            break;
        }
    }

    $scope.$watch("searchText",
        function handleSearchTextChange( newValue, oldValue ) {

            if(typeof newValue == 'undefined')
                return;
            $scope.search(newValue);
        }
    );
    $scope.$watch("typeSearch",
        function handleTypeSearchChange( newValue, oldValue ) {
            if(typeof newValue == 'undefined')
                return;
            if($scope.searchText=="")
                return;
            $scope.search($scope.searchText);
            
        }
    );

    $scope.showAccountDetail = function(acc){
    	$scope.accountDetail = acc;
        $scope.newRole = [];
        for (var i = 0; i < $scope.accountDetail.quyen.length; i++) {
            $scope.newRole.push($scope.accountDetail.quyen[i]);
        };
    	$('#accountDetailModal').modal('show');
    }

    $scope.changeRole = function(){
    	
        if($scope.chooseNewRole == false){
            return;
        }
        $scope.wrong[0] = false;
        if($scope.newRole.length == 0){
            $scope.wrong[0] = true;
            return;
        }
    	var tempRole = $scope.accountDetail.quyen;
    	$scope.accountDetail.quyen = $scope.newRole;
        for (var i = 0; i < $scope.accountDetail.quyen.length; i++) {
            if($scope.accountDetail.quyen[i] == "Quản lý"){
                $scope.accountDetail.quyen = [];
                $scope.accountDetail.quyen.push("Quản lý");
                break;
            }
        };
    	$http.post('/api/account/changeRole',$scope.accountDetail)
            .success(function(data) {
                if(data.success==true){
                    $scope.chooseNewRole = false;
                    $("#accountDetailModal").modal("hide");
		    		return;
                }
                else{ 
                	$scope.accountDetail.quyen = tempRole;
                	alert("Lỗi xảy ra, vui lòng thử lại");
    				return;
                }
            })
            .error(function(data) {
                alert("Lỗi xảy ra, vui lòng thử lại");
        });
    }

}
