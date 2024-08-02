function ShowLocationControl($scope,$http,$rootScope,$location){

    $('#dataSection').hide();
    
    var loadDataCount = 0;
    $scope.locationList = [];
    $scope.districtList = [];
    $scope.wardList = [];
    $scope.wardListOriginal = [];
    $scope.choose = "Tất cả";
    $scope.districtName=[];
    $scope.titleDelete = "";
    $scope.typeDelete = "location"; // district, ward
    $scope.objectDelete = null;

    $http.get('/api/location/list')
        .success(function(data) {
            $scope.locationList = data;
            loadDataCount++;
            finishLoadData();
        })
        .error(function(data) {
            //alert('Lỗi khi tải dữ liệu KHU VỰC');
        });

    $http.get('/api/district/list')
        .success(function(data) {
            $scope.districtList = data;
            var districtNameTemp = [];
            districtNameTemp.push("Tất cả");
            for (var i = 0; i < data.length; i++) { 
                districtNameTemp.push(data[i].tenquan);
                console.log(data.tenquan);
            }
            $scope.districtName = districtNameTemp;
            loadDataCount++;
            finishLoadData();
        })
        .error(function(data) {
            //alert('Lỗi khi tải dữ liệu QUẬN');
        });

    $http.get('/api/ward/list')
        .success(function(data) {
            $scope.wardList = data;
            $scope.wardListOriginal = data;
            loadDataCount++;
            finishLoadData();
        })
        .error(function(data) {
            //alert('Lỗi khi tải dữ liệu PHƯỜNG');
        });

    function finishLoadData(){
        if(loadDataCount==3){
            $scope.showDefault();
            loadDataCount=0;
        }
    }

    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }

    $scope.$watch("choose",
        function handleChooseChange( newValue, oldValue ) {
            if(typeof newValue == 'undefined')
                return;
            var wardListTemp = [];
            for(var i=0;i<$scope.wardListOriginal.length;i++)
            {
                if($scope.wardListOriginal[i].quan==newValue)
                {
                    wardListTemp.push($scope.wardListOriginal[i]);    
                }
            }
            $scope.wardList = wardListTemp;
        }
    );

    $scope.deleteLocation = function(location){
        $('#confirmDeleteModal').modal('show');
        $scope.titleDelete = "Khu vực "+location.tenkhuvuc;
        $scope.typeDelete = "location";
        $scope.objectDelete = location;
    }
    $scope.deleteDistrict = function(district){
        $('#confirmDeleteModal').modal('show');
        $scope.titleDelete = district.tenquan;
        $scope.typeDelete = "district";
        $scope.objectDelete = district;
        
    }
    $scope.editDitrict = function(district){
        $('#confirmDeleteModal').modal('show');
        $scope.titleDelete = "Khu vực "+district.tenkhuvuc;
        $scope.typeDelete = "location";
        
    }
    $scope.deleteWard = function(ward){
        $('#confirmDeleteModal').modal('show');
        $scope.titleDelete = ward.tenphuong;
        $scope.typeDelete = "ward";
        $scope.objectDelete = ward;
    }
    $scope.editWard = function(ward){
        $('#confirmDeleteModal').modal('show');
        $scope.titleDelete = "Khu vực "+ward.tenkhuvuc;
        $scope.typeDelete = "location";
    }

    $scope.confirmDelete = function(){
        if($scope.objectDelete == null){
            return;
        }
        switch($scope.typeDelete){
            case "location" :
                $http.delete('api/location/delete/' + $scope.objectDelete.tenkhuvuc)
                .success(function(data){
                    if(data == null || data == undefined || data.success == false){
                        alert('Lỗi xảy ra, xóa thất bại. Vui lòng thử lại');
                        return;
                    }
                    alert("Xóa thành công");
                    for (var i = 0; i < $scope.locationList.length; i++) {
                        if($scope.locationList[i]._id == $scope.objectDelete._id){
                            for (var j = 0; j < $scope.districtList.length; j++) {
                                if($scope.wardListOriginal[j].khuvuc == $scope.objectDelete.tenkhuvuc){
                                    $scope.districtList.splice(j,1);
                                }
                            };
                            $scope.locationList.splice(i,1);
                            $('#confirmDeleteModal').modal('hide');
                            return;
                        }
                    };
                })
                .error(function(data){
                    alert("Xóa thất bại, vui lòng thử lại");
                    return;
                });
                break;
            case "district" :
                $http.delete('api/district/delete/' + $scope.objectDelete.tenquan)
                .success(function(data){
                    if(data == null || data == undefined || data.success == false){
                        alert('Lỗi xảy ra, xóa thất bại. Vui lòng thử lại');
                        return;
                    }
                    alert("Xóa thành công");
                    for (var i = 0; i < $scope.districtList.length; i++) {
                        if($scope.districtList[i]._id == $scope.objectDelete._id){
                            for (var j = 0; j < $scope.wardListOriginal.length; j++) {
                                if($scope.wardListOriginal[j].quan == $scope.objectDelete.tenquan){
                                    $scope.wardListOriginal.splice(j,1);
                                    $scope.wardList.splice(j,1);
                                }
                            };
                            $scope.districtList.splice(i,1);
                            $('#confirmDeleteModal').modal('hide');
                            return;
                        }
                    };
                })
                .error(function(data){
                    alert("Xóa thất bại, vui lòng thử lại");
                    return;
                });
                break;
            case "ward" :
                $http.delete('api/ward/delete/' + $scope.objectDelete._id)
                .success(function(data){
                    if(data == null || data == undefined || data.success == false){
                        alert('Lỗi xảy ra, xóa thất bại. Vui lòng thử lại');
                        return;
                    }
                    alert("Xóa thành công");
                    for (var i = 0; i < $scope.wardListOriginal.length; i++) {
                        if($scope.wardListOriginal[i]._id == $scope.objectDelete._id){
                            $scope.wardListOriginal.splice(i,1);
                            $scope.wardList.splice(i,1);
                            $('#confirmDeleteModal').modal('hide');
                            return;
                        }
                    };
                })
                .error(function(data){
                    alert("Xóa thất bại, vui lòng thử lại");
                    return;
                });
                break;
        }
    }

};


function WardCtrl($scope,$http, $location, $rootScope){
    $('#dataSection').hide();
    
    $scope.formData = { tenphuong :"" };
    var districtName = [];
    
    $scope.districts=[];

    $http.get('/api/district/list')
        .success(function(data) {
            districtName = [];
            for (var i = 0; i < data.length; i++) { 
                districtName.push(data[i].tenquan);
                console.log(data.tenquan);
            }
            $scope.formData.quan = data[0].tenquan;
            console.log(districtName.length);
            $scope.districts = districtName;
            $scope.showDefault();
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }

    $scope.addWard = function(){
        
        if($scope.formData.tenphuong == ""){
            alert('Dữ liệu không được để trống, vui lòng kiểm tra lại');
            return;
        }
        $http.post('api/ward/addWard',$scope.formData)
        .success(function(data){
            
            if(data == null || data == undefined || data.success == false){
                alert('Lỗi xảy ra, thêm thất bại. Vui lòng thử lại');
                return;
            }
            if(data.exist == true){
                alert('Dữ liệu đã tồn tại, vui lòng kiểm tra lại');
                return;
            }
            alert('Thêm thành công');
            $scope.formData.tenphuong = '';

        })
        .error(function(data){
            alert('Lỗi xảy ra, thêm thất bại. Vui lòng thử lại');
            console.log(data);
        });
    };
};

function DistrictCtrl($scope,$http, $location, $rootScope){

    $('#dataSection').hide();
    $scope.page ='newHelperPage';
    $scope.formData = { tenquan:""};
    var locationName = [];
    $scope.locations=[];

    $http.get('/api/location/list')
        .success(function(data) {
            locationName = [];
            for (var i = 0; i < data.length; i++) { 
                locationName.push(data[i].tenkhuvuc);
                console.log(data.tenkhuvuc);
            }
            $scope.formData.khuvuc = data[0].tenkhuvuc;
            console.log(locationName.length);
            $scope.locations = locationName;
            $scope.showDefault();
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }

    $scope.addDistrict = function(){

        if($scope.formData.tenquan == ""){
            alert('Dữ liệu không được để trống, vui lòng kiểm tra lại');
            return;
        }
        $http.post('api/district/addDistrict',$scope.formData)
        .success(function(data){
            if(data == null || data == undefined || data.success == false){
                alert('Lỗi xảy ra, thêm thất bại. Vui lòng thử lại');
                return;
            }
            if(data.exist == true){
                alert('Dữ liệu đã tồn tại, vui lòng kiểm tra lại');
                return;
            }
            alert('Thêm thành công');
            $scope.formData.tenquan = '';
        })
        .error(function(data){
            alert('Lỗi xảy ra, thêm thất bại. Vui lòng thử lại');
        });
    };
};

function LocationCtrl($scope,$http, $location, $rootScope){

    $('#dataSection').hide();
    $(document).ready(function() {
        $('#dataSection').fadeIn(500);
    });
    $scope.page ='newHelperPage';
    $scope.formData = {
        tenkhuvuc : ""
    };
    $scope.addLocation = function(){
        if($scope.formData.tenkhuvuc == ""){
            alert('Dữ liệu không được để trống, vui lòng kiểm tra lại');
            return;
        }
        $http.post('api/location/addLocation',$scope.formData)
        .success(function(data){
            if(data == null || data == undefined || data.success == false){
                alert('Lỗi xảy ra, thêm thất bại. Vui lòng thử lại');
                return;
            }
            if(data.exist == true){
                alert('Dữ liệu đã tồn tại, vui lòng kiểm tra lại');
                return;
            }
            alert('Thêm thành công');
            $scope.formData.tenkhuvuc = '';
        })
        .error(function(data){
            alert('Lỗi xảy ra, thêm thất bại. Vui lòng thử lại');
        });
    };


};