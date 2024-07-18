
app.service('editHelperService', function() {
    var helper;
    
    return {
        setHelper: function(value) {
            helper = value;
        },
        getHelper: function() {
            return helper;
        }
    }
});

function addNewHelperCtrl($scope,$http,$location, $rootScope){
    $('#dataSection').hide();
    
    var listGKSKImageFile = [];
    var avatar = null;
    var loadDataDistrictAndWardCount = 0;
    $scope.wrong = [false,false,false,false,false,false,false,false,false,false,false,false,false];

    $scope.page ='newHelperPage';
    $scope.gkskList =[];
    $scope.sourceGKSKList =[];
    $scope.formData = {
        cmnd:"",
        hoten:"",
        diachi : {
        phuong : "",
        quan : ""
        },
        hinhanh: "avatar.jpg",
        giaykhamsuckhoe :[],
        sotruong :[],
        danhgia : "",
        luongcodinh :0,
        mucluongtheogio :0,
        dantoc :"Kinh",
        gioitinh:"Nam",
        trinhdohocvan:"Đại học",
        tinhtranghonnhan:"Độc thân",
        motakinhnghiem:"",
        soluongcon:0,
        thongtincon:[]

    };

    $scope.tieuchiList =[];
    
    $scope.wards=[];
    var allWard = [];
    $scope.districts=[];
    
    
    $http.get('/api/district/list')
        .success(function(data) {
            var districtName = [];
            for (var i = 0; i < data.length; i++) { 
                districtName.push(data[i].tenquan);
            }
            $scope.districts = districtName;
            loadDataDistrictAndWardCount++;
            finishLoadDataDistrictAndWard();
            })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    
    $http.get('/api/ward/list')
        .success(function(data) {
            allWard = [];
            for (var i = 0; i < data.length; i++) { 
                allWard.push(data[i]);
            }
            loadDataDistrictAndWardCount++;
            finishLoadDataDistrictAndWard();
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $http.get('/api/service/listName')
        .success(function(data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) { 
                $scope.tieuchiList.push(data[i]);
            }
            loadDataDistrictAndWardCount++;
            finishLoadDataDistrictAndWard();
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    function finishLoadDataDistrictAndWard(){
        if(loadDataDistrictAndWardCount==3){
            $scope.showDefault();
            loadDataDistrictAndWardCount=0;
        }
    }

    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }

    $scope.$watch("formData.diachi.quan",
        function handleDistrictChange( newValue, oldValue ) {
            if(typeof newValue == 'undefined')
                return;
            var tempWardName = [];
            for(var i=0;i<allWard.length;i++)
            {
                if(allWard[i].quan==newValue)
                {
                    tempWardName.push(allWard[i].tenphuong);    
                }
            }
            $scope.wards = tempWardName;
            $scope.formData.diachi.phuong = tempWardName[0];
        }
    );
        

    $scope.chooseSoTruong = function(name){
        var idx = $scope.formData.sotruong.indexOf(name);
        if (idx > -1) {
          $scope.formData.sotruong.splice(idx, 1);
        }
        else {
          $scope.formData.sotruong.push(name);
        }
    }

    $scope.$watch("formData.soluongcon",
        function soluongconChange(newValue, oldValue){
            if(newValue > 0){
                $scope.formData.thongtincon = [];
                for (var i = 0; i < newValue; i++) {
                    $scope.formData.thongtincon.push({tuoi:0});
                };
            }else{
                $scope.formData.thongtincon = [];
            }
        });

    $scope.addHelper = function(){
        var error = false;
        for(var i=0;i<13;i++)
        {
            $scope.wrong[i] = false;
        }
        if($scope.formData.hoten==undefined || $scope.formData.hoten=="")
        {
           $scope.wrong[0] = true;
           error = true;
        }

        if($scope.formData.cmnd==undefined || $scope.formData.cmnd == "")
        {
           $scope.wrong[1] = true;
           error = true;
        }
        if($scope.formData.dantoc==undefined || $scope.formData.dantoc=="")
        {
           $scope.wrong[2] = true;
           error = true;
        }

        if($scope.formData.ngaysinh==undefined)
        {
           $scope.wrong[3] = true;
           error = true;
        }

        if($scope.formData.tinhtranghonnhan=="Đã có gia đình"){
            if($scope.formData.soluongcon >=0 ){
                for (var i = 0; i < $scope.formData.thongtincon.length; i++) {
                    if(!($scope.formData.thongtincon[i].tuoi >=0 )){
                        $scope.wrong[4] = true;
                        error = true;
                        break;
                    }
                };
            }else{
                $scope.wrong[4] = true;
                error = true;
            }
        }
        if($scope.formData.chieucao==undefined 
            || $scope.formData.chieucao<=0 
            ||$scope.formData.chieucao=="")
        {
           $scope.wrong[5] = true;
           error = true;
        }

        if($scope.formData.cannang==undefined 
            || $scope.formData.cannang<=0 
            ||$scope.formData.cannang=="")
        {
           $scope.wrong[6] = true;
           error = true;
        }

        if($scope.formData.sodt==undefined || $scope.formData.sodt<0 ||$scope.formData.sodt=="")
        {
           $scope.wrong[7] = true;
           error = true;
        }

        if($scope.formData.diachi==undefined || $scope.formData.diachi.quan=="" ||$scope.formData.diachi.phuong == "")
        {
           $scope.wrong[8] = true;
           error = true;
        }

        if($scope.formData.sonamkinhnghiem==undefined || $scope.formData.sonamkinhnghiem==0 ||$scope.formData.sonamkinhnghiem=="")
        {
           $scope.wrong[9] = true;
           error = true;
        }
        if($scope.formData.sotruong==undefined || $scope.formData.sotruong.length==0)
        {
           $scope.wrong[10] = true;
           error = true;
        }
        if($scope.formData.luongcodinh==0 && $scope.formData.mucluongtheogio==0)
        {
           $scope.wrong[11] = true;
           error = true;
        }
        if(error == true)
        {
           $scope.wrong[12] = true;
           return;
        }
        for(var i=0;i<13;i++)
        {
           $scope.wrong[i] = false;
        }
        if(avatar != null){
            // upload avatar
            var fileType = getFileType(avatar.name);
            var newName = "/avatar"+fileType;
            var parentPath = $scope.formData.cmnd;
            var pathAvatar = $scope.formData.cmnd;
            $scope.uploadImageFile(newName,pathAvatar,avatar,parentPath);
            $scope.formData.hinhanh = pathAvatar+newName+"";
        }

        //upload gksk
        for(var i = 0;i<listGKSKImageFile.length;i++)
        {
            var fileType = getFileType(listGKSKImageFile[i].name);
            var newName = "/gksk-"+i+fileType;
            var parentPath = $scope.formData.cmnd;
            var path = $scope.formData.cmnd+"/gksk";
            $scope.uploadImageFile(newName,path,listGKSKImageFile[i],parentPath);
            $scope.formData.giaykhamsuckhoe.push(path+newName);
        }

        
        
        $scope.formData.ngaylamviec = new Date();
        $scope.formData.ngaylamviec.setHours(7);
        $scope.formData.ngaylamviec.setMinutes(0);
        $scope.formData.ngaylamviec.setSeconds(0);
        $scope.formData.ngaylamviec.setMilliseconds(0);
        $http.post('api/helper/addHelper',$scope.formData)
        .success(function(data){
            if(data.code == 11000)
            {
                $scope.wrong[1] = true;
                $scope.wrong[12] = true;
                return;
            }
            alert('Thêm thành công');
            $scope.formData = {
                diachi : {
                    phuong : "",
                    quan : ""
                    },
                hinhanh: "avatar.jpg",
                giaykhamsuckhoe :[],
                sotruong :[],
                danhgia : "",
                luongcodinh :0,
                mucluongtheogio :0,
                dantoc :"Kinh",
                gioitinh:"Nam",
                trinhdohocvan:"Đại học",
                tinhtranghonnhan:"Độc thân",
                soluongcon:0,
                motakinhnghiem:""
            };
            listGKSKImageFile = [];
            avatar = null;
            $scope.gkskList =[];
            $scope.sourceGKSKList =[];
            $('#avatar').attr('src', "img/avatar.jpg");
        })
        .error(function(data){
            alert('Lỗi xảy ra, thêm thất bại');
            console.log(data);
        });
    };
       
    $scope.cancelAddHelper = function(){

        $location.path('/Show-Helper-Infomation-List');
    };
    function getFileType(url){
            var position = url.lastIndexOf('.');
            return url.substring(position,url.length);
        }

    $scope.uploadImageFile = function(newName,path,file,parentPath){
        var imageFormData = new FormData();
        imageFormData.append("fileName",newName);
        imageFormData.append("path",path);
        imageFormData.append("parentPath",parentPath);
        imageFormData.append("image",file);
        $http.post('api/helper/upload/image', imageFormData, {
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

    $scope.showFancyBox = function(name){
        var index = $scope.gkskList.indexOf(name);
        $.fancybox([
            { href : $scope.sourceGKSKList[index],
                title : name
             }
        ]);
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
            $scope.formData.hinhanh = input.files[0];
            console.log($scope.formData.hinhanh.name);
            console.log(input.files[0].name);
            avatar = input.files[0];
        };



    $scope.fileGKSKChanged = function(input) {
            for(var i = 0;i<input.files.length;i++){
                var index = $scope.gkskList.indexOf(input.files[i].name);
                if(index==-1){
                    
                     var reader = new FileReader();
                    reader.onloadend = (function(file) {
                      return function(evt) {
                        $scope.createListItem(evt, file)
                      };
                    })(input.files[i]);
                    reader.readAsDataURL(input.files[i]);
                    listGKSKImageFile.push(input.files[i]);
                }
                
            }
            
        };
        $scope.createListItem = function (evt, file) {
            $scope.sourceGKSKList.push(evt.target.result);
            $scope.gkskList.push(file.name);
            $scope.$apply();
        }
    $scope.removeGKSK = function(name){
        console.log(name);
        var index = $scope.gkskList.indexOf(name);
        $scope.gkskList.splice(index,1);
        listGKSKImageFile.splice(index,1);
    }
    $scope.moveUpGKSK = function(name){
        var index = $scope.gkskList.indexOf(name);
        if(index==0)
            return;
        $scope.gkskList[index] = $scope.gkskList[index-1];
        $scope.gkskList[index - 1] = name;

        var temp = $scope.sourceGKSKList[index];
        $scope.sourceGKSKList[index] = $scope.sourceGKSKList[index-1];
        $scope.sourceGKSKList[index - 1] = temp;
    }
    $scope.moveDownGKSK = function(name){
        var index = $scope.gkskList.indexOf(name);
        if(index==$scope.gkskList.length-1)
            return;
        
        $scope.gkskList[index] = $scope.gkskList[index+1];
        $scope.gkskList[index+1] = name;

        var temp = $scope.sourceGKSKList[index];
        $scope.sourceGKSKList[index] = $scope.sourceGKSKList[index+1];
        $scope.sourceGKSKList[index + 1] = temp;
    }
};

function helperListCtrl($filter,$scope,$http,$location,editHelperService, $rootScope){
    $scope.timeTemp = new Date().getTime();
    $('#dataSection').hide();
    $scope.helperList = {};
    $scope.helperListOriginal ={};
    $scope.page ='list';
    $scope.searchText = "";
    $scope.typeSearch = "all";
    $scope.helperToDelete = null;

    $scope.tieuchiSearch = [" Tất Cả "," CMND "," Quận "," Họ Tên "," Điện Thoại "," Quê Quán "];


    $scope.search = function(newValue){
        var tempResult = [];
        switch($scope.typeSearch){
        case " Tất Cả ":
            for(var i=0;i<$scope.helperListOriginal.length;i++)
            {
                if($scope.helperListOriginal[i].hoten.toUpperCase().indexOf(newValue.toUpperCase())>-1 
                    ||($scope.helperListOriginal[i].cmnd+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||($scope.helperListOriginal[i].sodt+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||$scope.helperListOriginal[i].quequan.toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||($scope.helperListOriginal[i].diachi.quan.toUpperCase().indexOf(newValue.toUpperCase())>-1))
                {
                    tempResult.push($scope.helperListOriginal[i]);  
                }
            }
            $scope.helperList = tempResult;
            break;
        case " CMND ":
            for(var i=0;i<$scope.helperListOriginal.length;i++)
            {
                if(($scope.helperListOriginal[i].cmnd+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.helperListOriginal[i]);  
                }
            }
            $scope.helperList = tempResult;
            break;

        case " Quận ":
            for(var i=0;i<$scope.helperListOriginal.length;i++)
            {
                if($scope.helperListOriginal[i].diachi.quan.toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.helperListOriginal[i]);  
                }
            }
            $scope.helperList = tempResult;
            break;

        case " Điện Thoại ":
            for(var i=0;i<$scope.helperListOriginal.length;i++)
            {
                if(($scope.helperListOriginal[i].sodt+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.helperListOriginal[i]);  
                }
            }
            $scope.helperList = tempResult;
            break;
        case " Họ Tên ":
            for(var i=0;i<$scope.helperListOriginal.length;i++)
            {
                if($scope.helperListOriginal[i].hoten.toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.helperListOriginal[i]);  
                }
            }
            $scope.helperList = tempResult;
            break;
        case " Quê Quán ":
            for(var i=0;i<$scope.helperListOriginal.length;i++)
            {
                if($scope.helperListOriginal[i].quequan.toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.helperListOriginal[i]);  
                }
            }
            $scope.helperList = tempResult;
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

    $http.get('/api/helper/list')
        .success(function(data) {
            console.log(data);
            $scope.helperListOriginal = data;
            for (var i = 0; i < $scope.helperListOriginal.length; i++) {
                $scope.helperListOriginal[i].ngaysinh = new Date($scope.helperListOriginal[i].ngaysinh);
                $scope.helperListOriginal[i].ngaylamviec = new Date($scope.helperListOriginal[i].ngaylamviec);
                $scope.helperListOriginal[i].hinhanh = $scope.helperListOriginal[i].hinhanh;
                for (var j = 0; j < $scope.helperListOriginal[i].giaykhamsuckhoe.length; j++) {
                    $scope.helperListOriginal[i].giaykhamsuckhoe[j] = $scope.helperListOriginal[i].giaykhamsuckhoe[j];
                };
            };
            $scope.helperList = $scope.helperListOriginal;
            $scope.searchText = "";
            $scope.showDefault();
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }

    $scope.deleteHelper = function(delHelper){
        if($rootScope.loginOK == false || $rootScope.account==undefined){
            $location.path("/Login");
            return;
        }
        if($rootScope.account.quyen.indexOf("Quản lý") == -1 
        && $rootScope.account.quyen.indexOf("Nhân Viên Xử Lý") == -1 ){
        alert("Bạn không có quyền vào chức năng này");
        $location.path("/Home");
        return;
    }
        $scope.helperToDelete = delHelper;
        $('#confirmDeleteModal').modal('show');
        
    };

    $scope.confirmDelete = function(){


        if($scope.helperToDelete == null || $scope.helperToDelete == undefined){
            alert("Xóa người giúp việc thất bại, vui lòng thử lại");
            return;
        }
        $http.post('api/helper/delete',$scope.helperToDelete)
            .success(function(data){
                try{
                    if(data.success==false){
                        alert("Xóa người giúp việc thất bại, vui lòng thử lại");
                        return;
                    }
                }
                catch(err){
                }

                    $scope.helperListOriginal = data;
                    for (var i = 0; i < $scope.helperListOriginal.length; i++) {
                        $scope.helperListOriginal[i].ngaysinh = new Date($scope.helperListOriginal[i].ngaysinh);
                        $scope.helperListOriginal[i].ngaylamviec = new Date($scope.helperListOriginal[i].ngaylamviec);
                        $scope.helperListOriginal[i].hinhanh = $scope.helperListOriginal[i].hinhanh;
                        for (var j = 0; j < $scope.helperListOriginal[i].giaykhamsuckhoe.length; j++) {
                            $scope.helperListOriginal[i].giaykhamsuckhoe[j] = $scope.helperListOriginal[i].giaykhamsuckhoe[j];
                        };
                    };
                    $scope.helperList = $scope.helperListOriginal;
                    $scope.searchText = "";
                    $('#confirmDeleteModal').modal('hide');
                })
            .error(function(data){
                alert("Xóa người giúp việc thất bại, vui lòng thử lại");
                return;
            });
    }

    $scope.editHelper = function(helper){
        editHelperService.setHelper(helper);
        $location.path('/Edit-Helper');
    }
};
function helperEditCtrl($scope,$http,$location,editHelperService,dateFilter,$rootScope){

    $('#dataSection').hide();
    $scope.wrong = [false,false,false,false,false,false,false,false,false,false,false,false,false];
    $scope.newGKSK = false;
    $scope.newAvatar = false;
    $scope.wards=[];
    var allWard = [];
    $scope.districts=[];
    var loadDataCount =0;
    var listGKSKImageFile = [];
    var avatar;
    $scope.date = new Date();
    $scope.initThongTinCon = true;
    $scope.formData = editHelperService.getHelper();
    $scope.formData.soluongcon = $scope.formData.thongtincon.length;
    $scope.sourceGKSKList =$scope.formData.giaykhamsuckhoe;
    $scope.gkskList =$scope.formData.giaykhamsuckhoe;
    $scope.tieuchiList = [];

    $http.get('/api/service/listName')
        .success(function(data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) { 
                $scope.tieuchiList.push(data[i]);
            }
            loadDataCount++;
            finishLoadDataDistrictAndWard();
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    $http.get('/api/district/list')
        .success(function(data) {
            var districtName = [];
            for (var i = 0; i < data.length; i++) { 
                districtName.push(data[i].tenquan);
            }
            $scope.districts = districtName;
            loadDataCount++;
            finishLoadDataDistrictAndWard();
            })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    
    $http.get('/api/ward/list')
        .success(function(data) {
            allWard = [];
            for (var i = 0; i < data.length; i++) { 
                allWard.push(data[i]);
            }
            loadDataCount++;
            finishLoadDataDistrictAndWard();
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    function finishLoadDataDistrictAndWard(){
        if(loadDataCount==3){
            $scope.showDefault();
            loadDataCount=0;
        }
    }

    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }

    $scope.$watch("formData.diachi.quan",
        function handleDistrictChange( newValue, oldValue ) {
            if(typeof newValue == 'undefined')
                return;
            var tempWardName = [];
            for(var i=0;i<allWard.length;i++)
            {
                if(allWard[i].quan==newValue)
                {
                    tempWardName.push(allWard[i].tenphuong);    
                }
            }
            $scope.wards = tempWardName;
            $scope.formData.diachi.phuong = tempWardName[0];
        }
    );

    $scope.$watch("formData.soluongcon",
        function soluongconChange(newValue, oldValue){
            if($scope.initThongTinCon == true){
                $scope.initThongTinCon= false;
                return;
            }
            if(newValue > 0){

                $scope.formData.thongtincon = [];
                for (var i = 0; i < newValue; i++) {
                    $scope.formData.thongtincon.push({tuoi:i});
                };
            }else{
                $scope.formData.thongtincon = [];
            }
        });
    
    // $scope.$watch('date', function (date)
    // {
    //     $scope.formData.ngaysinh = dateFilter($scope.date, 'yyyy-MM-dd');
    // });
    
    $scope.$watch('formData.ngaysinh', function (dateString)
    {
        $scope.formData.ngaysinh = dateFilter(new Date($scope.formData.ngaysinh), 'yyyy-MM-dd');
    });



    $scope.chooseSoTruong = function(name){
        var idx = $scope.formData.sotruong.indexOf(name);
        if (idx > -1) {
          $scope.formData.sotruong.splice(idx, 1);
        }
        else {
          $scope.formData.sotruong.push(name);
        }
    }

    $scope.showFancyBox = function(name){
        var index = $scope.gkskList.indexOf(name);
        $.fancybox([
            { href : $scope.sourceGKSKList[index],
                title : name
             }
        ]);
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
            $scope.newAvatar=true;
        };



    $scope.fileGKSKChanged = function(input) {
            if($scope.newGKSK==false && input.files.length>0){
                $scope.newGKSK = true;
                $scope.sourceGKSKList = [];
                $scope.gkskList = [];
            }
            console.log(input.files.length);
            for(var i = 0;i<input.files.length;i++){
                var index = $scope.gkskList.indexOf(input.files[i].name);
                if(index==-1){
                     var reader = new FileReader();
                    reader.onloadend = (function(file) {
                      return function(evt) {
                        $scope.createListItem(evt, file)
                      };
                    })(input.files[i]);
                    reader.readAsDataURL(input.files[i]);
                    listGKSKImageFile.push(input.files[i]);
                }
                
            }
            
        };
        $scope.createListItem = function (evt, file) {
            $scope.sourceGKSKList.push(evt.target.result);
            $scope.gkskList.push(file.name);
            $scope.$apply();
        }
    $scope.removeGKSK = function(name){
        console.log(name);
        var index = $scope.gkskList.indexOf(name);
        $scope.gkskList.splice(index,1);
        listGKSKImageFile.splice(index,1);
    }
    $scope.moveUpGKSK = function(name){
        var index = $scope.gkskList.indexOf(name);
        if(index==0)
            return;
        $scope.gkskList[index] = $scope.gkskList[index-1];
        $scope.gkskList[index - 1] = name;

        var temp = $scope.sourceGKSKList[index];
        $scope.sourceGKSKList[index] = $scope.sourceGKSKList[index-1];
        $scope.sourceGKSKList[index - 1] = temp;
    }
    $scope.moveDownGKSK = function(name){
        var index = $scope.gkskList.indexOf(name);
        if(index==$scope.gkskList.length-1)
            return;
        
        $scope.gkskList[index] = $scope.gkskList[index+1];
        $scope.gkskList[index+1] = name;

        var temp = $scope.sourceGKSKList[index];
        $scope.sourceGKSKList[index] = $scope.sourceGKSKList[index+1];
        $scope.sourceGKSKList[index + 1] = temp;
    }

    $scope.saveEditHelper = function(){
        var error = false;
        for(var i=0;i<13;i++)
        {
            $scope.wrong[i] = false;
        }
        if($scope.formData.hoten==undefined || $scope.formData.hoten=="")
        {
           $scope.wrong[0] = true;
           error = true;
        }

        if($scope.formData.cmnd==undefined || $scope.formData.cmnd=="")
        {
           $scope.wrong[1] = true;
           error = true;
        }
        if($scope.formData.dantoc==undefined || $scope.formData.dantoc=="")
        {
           $scope.wrong[2] = true;
           error = true;
        }

        if($scope.formData.ngaysinh==undefined)
        {
           $scope.wrong[3] = true;
           error = true;
        }

        if($scope.formData.tinhtranghonnhan=="Đã có gia đình"){
            if($scope.formData.soluongcon >=0 ){
                for (var i = 0; i < $scope.formData.thongtincon.length; i++) {
                    if(!($scope.formData.thongtincon[i].tuoi >=0 )){
                        $scope.wrong[4] = true;
                        error = true;
                        break;
                    }
                };
            }else{
                $scope.wrong[4] = true;
                error = true;
            }
        }
        if($scope.formData.chieucao==undefined 
            || $scope.formData.chieucao<=0 
            ||$scope.formData.chieucao=="")
        {
           $scope.wrong[5] = true;
           error = true;
        }

        if($scope.formData.cannang==undefined 
            || $scope.formData.cannang<=0 
            ||$scope.formData.cannang=="")
        {
           $scope.wrong[6] = true;
           error = true;
        }

        if($scope.formData.sodt==undefined || $scope.formData.sodt<0 ||$scope.formData.sodt=="")
        {
           $scope.wrong[7] = true;
           error = true;
        }

        if($scope.formData.diachi==undefined || $scope.formData.diachi.quan=="" ||$scope.formData.diachi.phuong == "")
        {
           $scope.wrong[8] = true;
           error = true;
        }

        if($scope.formData.sonamkinhnghiem==undefined || $scope.formData.sonamkinhnghiem==0 ||$scope.formData.sonamkinhnghiem=="")
        {
           $scope.wrong[9] = true;
           error = true;
        }
        if($scope.formData.sotruong==undefined || $scope.formData.sotruong.length==0)
        {
           $scope.wrong[10] = true;
           error = true;
        }
        if($scope.formData.luongcodinh==0 && $scope.formData.mucluongtheogio==0)
        {
           $scope.wrong[11] = true;
           error = true;
        }
        if(error == true)
        {
           $scope.wrong[12] = true;
           return;
        }
        for(var i=0;i<13;i++)
        {
           $scope.wrong[i] = false;
        }
        if($scope.newGKSK==true){
            $scope.formData.giaykhamsuckhoe=[];
            //upload gksk
            for(var i = 0;i<listGKSKImageFile.length;i++)
            {
                var fileType = getFileType(listGKSKImageFile[i].name);
                var newName = "/gksk-"+i+fileType;
                var path = $scope.formData.cmnd+"/gksk";
                var parentPath = $scope.formData.cmnd;
                $scope.uploadImageFile(newName,path,listGKSKImageFile[i],parentPath);
                $scope.formData.giaykhamsuckhoe.push(path+newName);
            }
        }
        if($scope.newAvatar==true){
            // upload avatar
            var fileType = getFileType(avatar.name);
            var newName = "/avatar"+fileType;
            var pathAvatar = $scope.formData.cmnd;
            var parentPath = $scope.formData.cmnd;
            $scope.uploadImageFile(newName,pathAvatar,avatar,parentPath);
            $scope.formData.hinhanh = pathAvatar+newName;
        }
        $http.post('api/helper/editHelper',$scope.formData)
        .success(function(data){
            console.log("edit fail "+data);
            if(data.success != undefined && data.success != false){
                alert("Sửa thông tin người giúp việc thành công");
                $location.path('/Show-Helper-Infomation-List');
             }
             else{
                alert("Sửa thông tin người giúp việc thất bại");
             }
        })
        .error(function(data){
            console.log("edit fail "+data);
            alert("Sửa thông tin người giúp việc thất bại");
            console.log(data);
        });
    }

    $scope.cancelEditHelper = function(){
        $location.path('/Show-Helper-Infomation-List');
    };
    function getFileType(url){
            var position = url.lastIndexOf('.');
            return url.substring(position,url.length);
        }
    $scope.uploadImageFile = function(newName,path,file,parentPath){
        var imageFormData = new FormData();
        imageFormData.append("fileName",newName);
        imageFormData.append("path",path);
        imageFormData.append("parentPath",parentPath);
        imageFormData.append("image",file);
        $http.post('api/helper/upload/image', imageFormData, {
                withCredentials: true,
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
        }).success(function(data) {
            console.log(data);
        })
        .error(function(data) {
            alert("upload file "+fileName+" lên server bị lỗi");
        });
    }    
};