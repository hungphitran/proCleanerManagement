app.service('editStuffService', function() {
    var stuff;
    
    return {
        setStuff: function(value) {
            stuff = value;
        },
        getStuff: function() {
            return stuff;
        }
    }
});

function addNewStuffCtrl($scope,$http,$rootScope,$location){

    $('#dataSection').hide();
    $(document).ready(function() {
        $('#dataSection').fadeIn(500);
    });
    $scope.wrong = [false,false,false,false,false];

    $scope.formData = {};
    var avatar;
    $scope.stuffAvatar="";


    $scope.addStuff = function(){

    var error = false;
    for(var i=1;i<5;i++)
    {
        $scope.wrong[i] = false;
    }
    if($scope.formData.cmnd==undefined || $scope.formData.cmnd == "")
    {
       $scope.wrong[0] = true;
       error = true;
    }
    if($scope.formData.hoten==undefined || $scope.formData.hoten=="")
    {
       $scope.wrong[1] = true;
       error = true;
    }
    if($scope.formData.ngaysinh==undefined)
    {
       $scope.wrong[2] = true;
       error = true;
    }
    if($scope.formData.luong==undefined || $scope.formData.luong==0 )
    {
       $scope.wrong[3] = true;
       error = true;
    }
    if(error == true)
    {
       $scope.wrong[4] = true;
       return;
    }
    for(var i=1;i<5;i++)
    {
        $scope.wrong[i] = false;
    }
        if(avatar==undefined){
            $scope.formData.hinhanh = "public/images/nhanvien/avatar.jpg"
        }else{
            var fileType = getFileType(avatar.name);
            var newName = "/avatar"+fileType;
            var path = "public/images/nhanvien/"+$scope.formData.cmnd;
            $scope.uploadImageFile(path,newName,avatar);
            $scope.formData.hinhanh = path+newName;
        }
        $scope.formData.ngaylamviec = new Date();
        $scope.formData.ngaylamviec.setHours(7);
        $scope.formData.ngaylamviec.setMinutes(0);
        $scope.formData.ngaylamviec.setSeconds(0);
        $scope.formData.ngaylamviec.setMilliseconds(0);
        $http.post('api/stuff/addStuff',$scope.formData)
        .success(function(data){
            if(data.code == 11000)
            {
                $scope.wrong[0] = true;
                $scope.wrong[5] = true;
                return;
            }
            if(data.success != undefined && data.success != false){
                
                alert('Thêm nhân viên thành công');
                $scope.formData = {};
                avatar = null;
                $('#avatar').attr('src', "img/avatar.jpg");
                return;
            }
            alert('Thêm nhân viên thất bại, vui lòng thử lại');
        })
        .error(function(data){
            alert('Thêm nhân viên thất bại, vui lòng thử lại');
            console.log(data);
        });
    };

    $scope.uploadImageFile = function(path,fileName,file){
        var imageFormData = new FormData();
        imageFormData.append("path",path);
        imageFormData.append("fileName",fileName);
        imageFormData.append("image",file);
        $http.post('api/stuff/upload/image', imageFormData, {
                withCredentials: true,
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
        }).success(function(data) {
            console.log(data);
        })
        .error(function(data) {
            alert("upload file "+fileName+" error");
        });
    }

    $scope.fileAvatarChanged = function(input) {
        // define reader
        var reader = new FileReader();

        // A handler for the load event (just defining it, not executing it right now)
        reader.onload = function(e) {
          $('#avatar')
                .attr('src', e.target.result)
            };
            reader.readAsDataURL(input.files[0]);
            avatar = input.files[0];
    };

    $scope.cancelAddStuff = function(){
        $location.path('Show-Stuff-Infomation-List');
    
    }

    function getFileType(url){
        var position = url.lastIndexOf('.');
        return url.substring(position,url.length);
    }

};

function stuffListCtrl($scope,$http,$location,editStuffService,$rootScope){
    $scope.timeTemp = new Date().getTime();
    $('#dataSection').hide();
    $scope.stuffList = {};
    $scope.stuffListOriginal ={};

    $scope.searchText = "";
    $scope.typeSearch = "all";

    $scope.tieuchiSearch = [" Tất Cả "," CMND "," Họ Tên "," Điện Thoại "," Quê Quán "];


    $http.get('/api/stuff/list')
        .success(function(data) {
            $scope.stuffListOriginal = data;

            for (var i = 0; i < $scope.stuffListOriginal.length; i++) {
                $scope.stuffListOriginal[i].ngaysinh = new Date($scope.stuffListOriginal[i].ngaysinh);
                $scope.stuffListOriginal[i].ngaylamviec = new Date($scope.stuffListOriginal[i].ngaylamviec);
            };
            $scope.stuffList = $scope.stuffListOriginal;

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
        
    $scope.search = function(newValue){
        var tempResult = [];
        switch($scope.typeSearch){
        case " Tất Cả ":
            for(var i=0;i<$scope.stuffListOriginal.length;i++)
            {
                if($scope.stuffListOriginal[i].hoten.toUpperCase().indexOf(newValue.toUpperCase())>-1 
                    ||($scope.stuffListOriginal[i].cmnd+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||($scope.stuffListOriginal[i].sodt+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||$scope.stuffListOriginal[i].quequan.toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.stuffListOriginal[i]);  
                }
            }
            $scope.stuffList = tempResult;
            break;
        case " CMND ":
            for(var i=0;i<$scope.stuffListOriginal.length;i++)
            {
                if(($scope.stuffListOriginal[i].cmnd+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.stuffListOriginal[i]);  
                }
            }
            $scope.stuffList = tempResult;
            break;
        case " Điện Thoại ":
            for(var i=0;i<$scope.stuffListOriginal.length;i++)
            {
                if(($scope.stuffListOriginal[i].sodt+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.stuffListOriginal[i]);  
                }
            }
            $scope.stuffList = tempResult;
            break;
        case " Họ Tên ":
            for(var i=0;i<$scope.stuffListOriginal.length;i++)
            {
                if($scope.stuffListOriginal[i].hoten.toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.stuffListOriginal[i]);  
                }
            }
            $scope.stuffList = tempResult;
            break;
        case " Quê Quán ":
            for(var i=0;i<$scope.stuffListOriginal.length;i++)
            {
                if($scope.stuffListOriginal[i].quequan.toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.stuffListOriginal[i]);  
                }
            }
            $scope.stuffList = tempResult;
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
            console.log(newValue);
            if(typeof newValue == 'undefined')
                return;
            if($scope.searchText=="")
                return;
            $scope.search($scope.searchText);
            
        }
    );


    $scope.deleteStuff = function(stuffTemp){
        $http.post('api/stuff/delete', stuffTemp)
            .success(function(data){
                $scope.stuffListOriginal = data;

                for (var i = 0; i < $scope.stuffListOriginal.length; i++) {
                    $scope.stuffListOriginal[i].ngaysinh = new Date($scope.stuffListOriginal[i].ngaysinh);
                    $scope.stuffListOriginal[i].ngaylamviec = new Date($scope.stuffListOriginal[i].ngaylamviec);
                };
                $scope.stuffList = $scope.stuffListOriginal;
                    $scope.searchText="";
            })
            .error(function(data){
                console.log('delete error - '+data);
            });
    };

    $scope.editStuff = function(stuff){
        editStuffService.setStuff(stuff);
        $location.path('/Edit-Stuff');
    }
};
function stuffEditCtrl($scope,$http,$location,editStuffService, dateFilter ,$rootScope){

    $scope.formData = editStuffService.getStuff();
    $scope.formData.quyenhethong = 3;
    $scope.wrong = [false,false,false,false,false];
    $scope.newAvatar = false;
    var avatar;
    $scope.date = new Date();

    $scope.$watch('formData.ngaysinh', function (dateString)
    {
        $scope.formData.ngaysinh = dateFilter(new Date($scope.formData.ngaysinh), 'yyyy-MM-dd');
       
    });

    $scope.fileAvatarChanged = function(input) {
        // define reader
        var reader = new FileReader();
        // A handler for the load event (just defining it, not executing it right now)
        reader.onload = function(e) {
          $('#avatar')
                .attr('src', e.target.result)
            };
            reader.readAsDataURL(input.files[0]);
            avatar = input.files[0];
            $scope.newAvatar=true;
        };

    $scope.cancelEditHelper = function(){
        $location.path('/Show-Stuff-Infomation-List');
    };  
    function getFileType(url){
            var position = url.lastIndexOf('.');
            return url.substring(position,url.length);
        } 

    $scope.uploadImageFile = function(path,fileName,file){
        var imageFormData = new FormData();
        imageFormData.append("path",path);
        imageFormData.append("fileName",fileName);
        imageFormData.append("image",file);
        $http.post('api/stuff/upload/image', imageFormData, {
                withCredentials: true,
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
        }).success(function(data) {
            console.log(data);
        })
        .error(function(data) {
            alert("upload file "+fileName+" error");
        });
    }     
    $scope.saveEdit = function(){
        var error = false;
        for(var i=1;i<5;i++)
        {
            $scope.wrong[i] = false;
        }
        if($scope.formData.cmnd==undefined || $scope.formData.cmnd == "")
        {
           $scope.wrong[0] = true;
           error = true;
        }
        if($scope.formData.hoten==undefined || $scope.formData.hoten=="")
        {
           $scope.wrong[1] = true;
           error = true;
        }
        if($scope.formData.ngaysinh==undefined)
        {
           $scope.wrong[2] = true;
           error = true;
        }
        if($scope.formData.luong==undefined || $scope.formData.luong==0 )
        {
           $scope.wrong[3] = true;
           error = true;
        }
        if(error == true)
        {
           $scope.wrong[4] = true;
           return;
        }
        for(var i=1;i<5;i++)
        {
            $scope.wrong[i] = false;
        }
        if($scope.newAvatar==true){
            // upload avatar
            var fileType = getFileType(avatar.name);
            var newName = "/avatar"+fileType;
            var path = "public/images/nhanvien/"+$scope.formData.cmnd;
            $scope.uploadImageFile(path,newName,avatar);
            $scope.formData.hinhanh = path+newName;
        }
        $http.post('/api/stuff/editStuff',$scope.formData)
        .success(function(data){
            console.log("edit fail "+data);
            if(data.success != undefined && data.success != false){
                alert("Sửa thông tin nhân viên thành công");
                $location.path('/Show-Stuff-Infomation-List');
             }
             else{
                alert("Sửa thông tin nhân viên thất bại");
             }
        })
        .error(function(data){
            console.log("edit fail "+data);
            alert("Sửa thông tin nhân viên thất bại");
            console.log(data);
        });
    }
};