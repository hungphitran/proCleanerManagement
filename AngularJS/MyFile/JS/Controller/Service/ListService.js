function ShowCostCtrl($scope, $rootScope, $http,$location) {
	$('#dataSection').hide();
	$(".editService").attr('disabled','disabled');
	$scope.serviceList = {};
    $scope.serviceListOriginal ={};
    $scope.searchText = "";
    $scope.typeSearch = "all";
    $scope.service = {};
    $scope.serviceDetail = {};
    $scope.newService = {
        tentieuchi:"",
        giachuan:0,
        phuphi:"Không",
        phingoaigiokh:0,
        phingoaigiongv:0,
        diengiai:""
    };

    $scope.tieuchiSearch = [" Tất Cả "," Dịch Vụ ", "Giá Cơ Bản"," Phụ Phí","Phí Ngoài Giờ KH","Phí Ngoài Giờ NGV"];

    $http.get('/api/service/list')
        .success(function(data) {
            $scope.serviceListOriginal = data;

            $scope.serviceList = $scope.serviceListOriginal;

            $scope.searchText="";
            $scope.showDefault();
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }
    $scope.addService = function(){
        $('#addServiceModal').modal('show');
    }
    $scope.saveNewService = function(){
        
        if($scope.newService.tentieuchi == undefined || $scope.newService.tentieuchi == ""){
            alert("Tên dịch vụ sai, vui lòng kiểm tra lại");
            return;
        }
        if($scope.newService.giachuan == undefined || $scope.newService.giachuan <= 0){
            alert("Giá cơ bản sai, vui lòng kiểm tra lại");
            return;
        }
        if($scope.newService.phuphi == undefined
            || ( $scope.newService.phuphi != "Không" && $scope.newService.phuphi != "Có")){
            alert("Phụ phí sai, vui lòng kiểm tra lại");
            return;
        }
        if($scope.newService.phingoaigiokh == undefined || $scope.newService.phingoaigiokh < 0 || $scope.newService.phingoaigiokh > 100){
            alert("Phí ngoài giờ khách hàng sai, vui lòng kiểm tra lại");
            return;
        }
        if($scope.newService.phingoaigiongv == undefined || $scope.newService.phingoaigiongv < 0 || $scope.newService.phingoaigiongv > 100){
            alert("Phí ngoài giờ người giúp việc sai, vui lòng kiểm tra lại");
            return;
        }
        if($scope.newService.phingoaigiongv > $scope.newService.phingoaigiokh){
            alert("Phí ngoài giờ người giúp việc không được lớn hơn khách hàng");
            return;
        }

        $http.post('/api/service/create',$scope.newService)
            .success(function(data) {
                if(data.success == false){
                    alert("Lỗi xảy ra, vui lòng thử lại");
                }else{
                    alert("Tạo dịch vụ mới thành công");
                    console.log(data);
                    $scope.serviceListOriginal.push(data);
                    $scope.serviceList = $scope.serviceListOriginal;
                    $scope.newService = {
                        tentieuchi:"",
                        giachuan:0,
                        phuphi:"Không",
                        phingoaigiokh:0,
                        phingoaigiongv:0,
                        diengiai:""
                    };
                }
            })
            .error(function(data) {
                alert("Error! Lỗi xảy ra, vui lòng thử lại");
            });
    }

    $scope.deleteService = function(service){
        $http.delete('api/service/delete/' + service._id)
            .success(function(data){
                if(data == null || data == undefined || data.success == false){
                    alert('Lỗi xảy ra, xóa thất bại. Vui lòng thử lại');
                    return;
                }
                alert("Xóa thành công");
                for (var i = 0; i < $scope.serviceList.length; i++) {
                    if($scope.serviceList[i]._id == service._id){
                        $scope.serviceList.splice(i,1);
                        break;
                    }
                };
                for (var i = 0; i < $scope.serviceListOriginal.length; i++) {
                    if($scope.serviceListOriginal[i]._id == service._id){
                        $scope.serviceListOriginal.splice(i,1);
                        $('#confirmDeleteModal').modal('hide');
                        return;
                    }
                };
            })
            .error(function(data){
                alert("Xóa thất bại, vui lòng thử lại");
                return;
            });
    }

    $scope.search = function(newValue){
        var tempResult = [];
        if($scope.serviceListOriginal == undefined){
        	return;
        }
        switch($scope.typeSearch){
        case " Tất Cả ":
            for(var i=0;i<$scope.serviceListOriginal.length;i++)
            {
                if(($scope.serviceListOriginal[i].tentieuchi+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||($scope.serviceListOriginal[i].giachuan+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||($scope.serviceListOriginal[i].phuphi+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||($scope.serviceListOriginal[i].phingoaigiokh+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||($scope.serviceListOriginal[i].phingoaigiongv+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.serviceListOriginal[i]);  
                }
            }
            $scope.serviceList = tempResult;
            break;
        case " Dịch Vụ ":
            for(var i=0;i<$scope.serviceListOriginal.length;i++)
            {
                if(($scope.serviceListOriginal[i].tentieuchi+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.serviceListOriginal[i]);  
                }
            }
            $scope.serviceList = tempResult;
            break;
        case "Giá Cơ Bản":
            for(var i=0;i<$scope.serviceListOriginal.length;i++)
            {
                if(($scope.serviceListOriginal[i].giachuan+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.serviceListOriginal[i]);  
                }
            }
            $scope.serviceList = tempResult;
            break;
        case "Phụ Phí":
            for(var i=0;i<$scope.serviceListOriginal.length;i++)
            {
                if(($scope.serviceListOriginal[i].phuphi+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.serviceListOriginal[i]);  
                }
            }
            $scope.serviceList = tempResult;
            break;
        case "Phí Ngoài Giờ KH":
            for(var i=0;i<$scope.serviceListOriginal.length;i++)
            {
                if(($scope.serviceListOriginal[i].phingoaigiokh+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.serviceListOriginal[i]);  
                }
            }
            $scope.serviceList = tempResult;
            break;
        case "Phí Ngoài Giờ NGV":
            for(var i=0;i<$scope.serviceListOriginal.length;i++)
            {
                if(($scope.serviceListOriginal[i].phingoaigiongv+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.serviceListOriginal[i]);  
                }
            }
            $scope.serviceList = tempResult;
            break;
        }
	}

    $scope.$watch("searchText",
        function handleSearchTextChange( newValue, oldValue ) {

            if(typeof newValue == 'undefined')
                return;
            $scope.search(newValue);
        });
    $scope.$watch("typeSearch",
        function handleTypeSearchChange( newValue, oldValue ) {
            console.log(newValue);
            if(typeof newValue == 'undefined')
                return;
            if($scope.searchText=="")
                return;
            $scope.search($scope.searchText);
            
        });

    $scope.editSericeCost = function(service){
    	$scope.service = service;
    	$scope.copyService(service,$scope.serviceDetail);
    	$('#editServiceModal').modal('show');
    }

    $scope.copyService = function(src,des){
    	des._id =src._id;
    	des.tentieuchi =src.tentieuchi;
	  	des.giachuan=src.giachuan;
	  	des.phuphi=src.phuphi;
	  	des.phingoaigiongv=src.phingoaigiongv;
	  	des.phingoaigiokh=src.phingoaigiokh;
	  	des.diengiai =src.diengiai ;
    }

    $scope.saveEditService = function(){
    	if($('#btnSaveEditService').text() == "Chỉnh Sửa"){
    		$(".editService").removeAttr('disabled');
    		$(".editService").removeClass('myTransparentInput');
    		$('#btnSaveEditService').text("Lưu Lại");
    	}else{

            if($scope.serviceDetail.tentieuchi == undefined || $scope.serviceDetail.tentieuchi == ""){
                alert("Tên dịch vụ sai, vui lòng kiểm tra lại");
                return;
            }
            if($scope.serviceDetail.giachuan == undefined || $scope.serviceDetail.giachuan <= 0){
                alert("Giá cơ bản sai, vui lòng kiểm tra lại");
                return;
            }
            if($scope.serviceDetail.phuphi == undefined 
                || ( $scope.serviceDetail.phuphi != "Không" && $scope.serviceDetail.phuphi != "Có")){
                alert("Phụ phí sai, vui lòng kiểm tra lại");
                return;
            }
            if($scope.serviceDetail.phingoaigiokh == undefined || $scope.serviceDetail.phingoaigiokh < 0 || $scope.serviceDetail.phingoaigiokh > 100){
                alert("Phí ngoài giờ khách hàng sai, vui lòng kiểm tra lại");
                return;
            }
            if($scope.serviceDetail.phingoaigiongv == undefined || $scope.serviceDetail.phingoaigiongv < 0 || $scope.serviceDetail.phingoaigiongv > 100){
                alert("Phí ngoài giờ người giúp việc sai, vui lòng kiểm tra lại");
                return;
            }
            if($scope.serviceDetail.phingoaigiongv > $scope.serviceDetail.phingoaigiokh){
                alert("Phí ngoài giờ người giúp việc không được lớn hơn khách hàng");
                return;
            }

    		$http.post('/api/service/update',$scope.serviceDetail)
    			.success(function(data){
    				if(data.success==true){
    					$(".editService").attr('disabled','disabled');
    					$(".editService").addClass('myTransparentInput');
    					$('#btnSaveEditService').text("Chỉnh Sửa");
    					$scope.copyService($scope.serviceDetail,$scope.service);
                        $('#editServiceModal').modal('hide');
    					return;
    				}
    				alert("Lỗi xảy ra, vui lòng thử lại");
    			})
    			.error(function(error){
    				alert("Error! Lỗi xảy ra, vui lòng thử lại");
    				console.log(error)
    			});

    		
    	}
    }
}