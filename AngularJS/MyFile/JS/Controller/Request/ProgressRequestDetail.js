function progressRequestDetailCtrl($scope,$http,progressRequestDetailService, $rootScope,$location){
    

    $('#dataSection').hide();
    $('#dataNGVGiaoViec').hide();
    $scope.request = progressRequestDetailService.getRequest();

    $scope.request.id = $scope.request._id;
    var id = $scope.request._id;
    $scope.listDetail = [];
    $scope.requestDetailEdit = {};
    $scope.requestDetailEdit.lienlac = "Có";
    $scope.nhanvienxuly;
    $scope.helperCMND;
    $scope.helper;
    $scope.requestDetailChange = null;
    $scope.thaydoibatdau = 0;
    $scope.thaydoiketthuc =0;
    $scope.giobatdaumoi = Date;
    $scope.gioketthucmoi =Date;



    var index = -1;
    // star rating
    var $star_rating = $('.star-rating .fa');

    $star_rating.on('click', function() {
        $star_rating.siblings('input.rating-value').val($(this).data('rating'));
        var rateValue = $(".rating-value").val();
        $scope.convertNhanXet(rateValue);   
      
      return SetRatingStar();
    });

    var loadDataCount = 0;

    // Load all request details by request id
    $http.get('api/requestDetail/findByYeuCau/'+id)
        .success(function(data) {
            if(data.length == 0)
            {
                alert("Lỗi xảy ra trong qúa trình tải thông tin của của các chi tiết yêu cầu");
                return;
            }
            var dataTemp  = data;
            for (var i = 0; i < dataTemp.length; i++) {
                dataTemp[i].giobatdau = new Date(dataTemp[i].giobatdau);
                dataTemp[i].gioketthuc = new Date(dataTemp[i].gioketthuc);
                dataTemp[i].id = dataTemp[i]._id;
            };
            for (var i = 0; i < dataTemp.length; i++) {

                for (var j = i+1; j < dataTemp.length; j++) {
                    if(dataTemp[i].giobatdau.getTime() > dataTemp[j].giobatdau.getTime() ){
                        var temp = dataTemp[i];
                        dataTemp[i] = dataTemp[j];
                        dataTemp[j] = temp;
                    }
                };
            };

            $scope.listDetail = dataTemp;
            
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
             }
            $scope.showDefault();
            for (var i = 0; i < $scope.listDetail.length; i++) {
                $scope.findFreeHelper($scope.listDetail[i]);
            };
        })
        .error(function(data) {
            alert('error');
            return;
        });

   


    $scope.showDefault = function(){
        if ( jQuery.isReady ) {  
           
            $('#loadDataNGVGiaoViec').hide();
            $('#dataNGVGiaoViec').fadeIn(500);
            $('#loadDataSection').hide();
            $('#dataSection').fadeIn(500);
        };
    }

    $scope.findFreeHelper = function(requestDetailTemp){

        var ngaylam = new Date(requestDetailTemp.giobatdau);
            ngaylam.setHours(7);
            ngaylam.setMinutes(0);
            var giobd = requestDetailTemp.giobatdau.getUTCHours()*60+requestDetailTemp.giobatdau.getMinutes();
            var giokt = requestDetailTemp.gioketthuc.getUTCHours()*60+requestDetailTemp.gioketthuc.getMinutes() + 60;


         // load all helper
        $http.post('/api/helper/findFreeHelper',{
            giobd:giobd,
            giokt:giokt,
            ngaylam:ngaylam,
            nguoigiupviec : requestDetailTemp.nguoigiupviec,
            quan:$scope.request.quan,
            sotruong:$scope.request.loaidichvu
            })
            .success(function(data) {
                requestDetailTemp.listHelper = data;
                console.log(data);
                var today = new Date();
                $scope.helperCMND = undefined;
                requestDetailTemp.listHelperCMND = [];
                for (var i = 0; i < requestDetailTemp.listHelper.length; i++) {
                    
                    requestDetailTemp.listHelperCMND.push(requestDetailTemp.listHelper[i].cmnd);
                    requestDetailTemp.listHelper[i].ngaysinh = new Date(requestDetailTemp.listHelper[i].ngaysinh);
                    requestDetailTemp.listHelper[i].tuoi = today.getUTCFullYear() -requestDetailTemp.listHelper[i].ngaysinh.getUTCFullYear(); 
                
                };
                
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }


    $scope.$watch("helperCMND",
        function handleHelperCMNDChange( newValue, oldValue ) {
            if(typeof newValue == 'undefined' || $scope.requestDetailEdit.listHelperCMND == undefined)
                return;
            
            for(var i=0;i<$scope.requestDetailEdit.listHelperCMND.length;i++)
            {
                if($scope.requestDetailEdit.listHelperCMND[i]==newValue)
                {
                    $scope.helper = $scope.requestDetailEdit.listHelper[i];
                    break; 
                }
            }
        }
    );

    
    $scope.change = function(){
        $("#cmndComboBox").removeAttr('disabled');
    }

    $scope.hoanThanh = function(requestDetail){
        $scope.requestDetailEdit = requestDetail;
        $scope.requestDetailEdit.matdo = "Không";
        $scope.requestDetailEdit.hudo = "Không";
        $scope.requestDetailEdit.nhanxet="Trung bình";
        $(".rating-value").val("3");
        SetRatingStar();
        
        for(var i=0;i<$scope.requestDetailEdit.listHelper.length;i++)
            {
                if($scope.requestDetailEdit.listHelper[i].cmnd==requestDetail.nguoigiupviec)
                {
                    $scope.helper = $scope.requestDetailEdit.listHelper[i];
                    break; 
                }
            }
        $('#danhGiaModal').modal('show');
    }

    $scope.deleteWorkPlan = function(idchitietyc){
        $http.delete('api/workPlan/delete/' + idchitietyc)
            .success(function(data){
                 if(data.success != undefined && data.success != false){
                    // alert("Xóa lịch làm viêc ok");
                 }
                 else{
                    alert("Xóa lịch làm viêc thất bại");
                 }
             })
            .error(function(data){
                alert("Xóa lịch làm viêc thất bại");
            });
    }

    $scope.saveHoanThanh = function(){
        if($scope.requestDetailEdit.lienlac=="Không")
        {
            $scope.requestDetailEdit.trangthai = "Chưa liên hệ";


            $http.post('api/requestDetail/updateDone',$scope.requestDetailEdit)
            .success(function(data){
                if(data.success != undefined && data.success != false)
                {   
                    //$scope.deleteWorkPlan($scope.requestDetailEdit._id);
                    $('#danhGiaModal').modal('hide');
                    // $('#btGiaoViec'+$scope.requestDetailEdit._id).hide();
                    // $('#btThayDoi'+$scope.listDetail[i]._id).hide();
                    $scope.requestDetailEdit = null;
                }
                else
                {
                    alert('Cập nhập trang thái thất bại');
                    $scope.requestDetailEdit.trangthai = "Đã giao";
                    return;
                }
                
            })
            .error(function(data){
                alert('Cập nhập trang thái thất bại');
                $scope.requestDetailEdit.trangthai = "Đã giao";
                return;
            });

            
            return;
        }
        // neu lien lac duoc
        $scope.requestDetailEdit.trangthai = "Hoàn thành";
        $http.post('api/requestDetail/updateDone',$scope.requestDetailEdit)
            .success(function(data){
                if(data.success != undefined && data.success != false)
                {   
                    //$scope.deleteWorkPlan($scope.requestDetailEdit._id);
                    var requestData = null;
                    if($scope.checkDone()==true){
                        requestData = {
                        _id : $scope.request._id,
                        trangthai : "Đã hoàn thành"}
                    }
                    else{
                        if($scope.request.trangthai=="Chưa tiến hành"){
                            requestData = {
                            _id : $scope.request._id,
                            trangthai : "Đang tiến hành"}
                        }
                    }
                    if(requestData!=null){
                        $http.post('api/request/updateStatus',requestData)
                            .success(function(data){
                                if(data.success != undefined && data.success != false){
                                    $scope.request.trangthai = requestData.trangthai;
                                }
                                else{
                                    alert('Cập nhập trang thái của đơn hàng thất bại');
                                }

                            })
                            .error(function(data){
                                alert('Cập nhập trang thái của đơn hàng thất bại');
                                return;
                            });
                    }
                    $('#danhGiaModal').modal('hide');
                    $scope.requestDetailEdit = null;
                }
                else
                {
                    alert('Cập nhập trang thái thất bại');
                    $scope.requestDetailEdit.trangthai = "Đã giao";
                    return;
                }
                
            })
            .error(function(data){
                alert('Cập nhập trang thái thất bại');
                $scope.requestDetailEdit.trangthai = "Đã giao";
                return;
            });
    }

    $scope.checkDone = function(){
        for(var i = 0;i<$scope.listDetail.length;i++){
            if($scope.listDetail[i].trangthai!="Hoàn thành")
                return false;
        }
        return true;
    }
    


    $scope.$watch("requestDetailEdit.lienlac",
        function handleLienLacChange( newValue, oldValue ) {
            if(typeof newValue == 'undefined')
                return;
            if(newValue=="Không"){

                $scope.requestDetailEdit.matdo = "Không";
                $scope.requestDetailEdit.hudo = "Không";
                $('.rating-value').val("3");
                $scope.convertNhanXet("3");
                SetRatingStar();
                $star_rating.unbind("click");
                document.getElementById('btSaveHoanThanh').innerHTML= "Lưu";
                $(".khonglienlacduoc").attr('disabled','disabled');
            }
            else{
                $star_rating.on('click', function() {
                    $star_rating.siblings('input.rating-value').val($(this).data('rating'));
                    var rateValue = $(".rating-value").val();
                    $scope.convertNhanXet(rateValue);   
                  
                  return SetRatingStar();
                });
                document.getElementById('btSaveHoanThanh').innerHTML= "Hoàn thành";
                $(".khonglienlacduoc").removeAttr('disabled');
            }
        });

    

    var SetRatingStar = function() {
      return $star_rating.each(function() {
        if (parseInt($star_rating.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
          return $(this).removeClass('fa-star-o').addClass('fa-star');
        } else {
          return $(this).removeClass('fa-star').addClass('fa-star-o');
        }
      });
    };

    $scope.convertNhanXet = function(rateValue){
        switch(rateValue){
        case "1":
            $scope.requestDetailEdit.nhanxet="Rất kém";
            break;
        case "2":
            $scope.requestDetailEdit.nhanxet="Kém";
            break;
        case "3":
            $scope.requestDetailEdit.nhanxet="Trung bình";
            break;
        case "4":
            $scope.requestDetailEdit.nhanxet="Tốt";
            break;
        case "5":
            $scope.requestDetailEdit.nhanxet="Rất tốt";
            break;
      }
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
        $scope.$apply();
     }
    }

    //giao viec
    $scope.giaoViec = function(requestDetail){
        if(requestDetail.listHelper == undefined){
            return;
        }
        $scope.requestDetailEdit = requestDetail;
        $scope.helperCMND = $scope.requestDetailEdit.nguoigiupviec;
        $scope.helper = null;
        if($scope.helperCMND!=undefined && $scope.helperCMND!=""){
            for (var i = 0; i < $scope.requestDetailEdit.listHelper.length; i++) {
                if($scope.helperCMND == $scope.requestDetailEdit.listHelper[i].cmnd){

                    $scope.helper = $scope.requestDetailEdit.listHelper[i];
                    break;
                }
            };
        }
        $("#cmndComboBox").attr('disabled','disabled');
        $('#giaoViecModal').modal('show');
    }

    $scope.saveGiaoViec = function(requestDetail){

        // da giao va ngv trung

        if($scope.requestDetailEdit.nguoigiupviec == $scope.helperCMND && $scope.requestDetailEdit.trangthai=="Đã giao"){
            $('#giaoViecModal').modal('hide');
            $scope.requestDetailEdit = null;
            return;
        }

        // trang thai == chua giao && co ngv => doi trang thai sang da giao

        if($scope.requestDetailEdit.nguoigiupviec == $scope.helperCMND && $scope.requestDetailEdit.trangthai=="Chưa giao"){
            var dataToUpdate = {
                _id:$scope.requestDetailEdit._id,
                nhanvienxuly:$scope.request.nhanvienxuly,
                idyeucau:$scope.request._id
            }
             $http.post('api/requestDetail/updateGiaoViec',dataToUpdate)
                .success(function(data){
                    if(data.success != true || data.success == undefined){
                         alert("Cập nhập trạng thái của chi tiết yêu cầu thất bại");
                         return;
                    }
                    $scope.request.nhanvienxuly = data.nhanvienxuly;
                    $scope.requestDetailEdit.trangthai = "Đã giao";
                    $('#giaoViecModal').modal('hide');
                    $scope.requestDetailEdit = null;

                    return;
                })
                .error(function(data){
                    alert("Cập nhập trạng thái của chi tiết yêu cầu thất bại");
                    return;
                });
            return;
        }


        

        // trang thai == chua giao && chua co ngv => tao workflan, update ngv trong chi tiet yeu cau

        // trang thai == da giao, ngv khac => doi ngv trong wf, chi tiet yeu cau


        
        $scope.requestDetailEdit.giobatdau.setSeconds(0);
        var ngaylam = new Date($scope.requestDetailEdit.giobatdau);
            ngaylam.setMinutes(0);
            ngaylam.setHours(7);
        var lichlamviec = {
            idchitietyc : $scope.requestDetailEdit._id,
            nguoigiupviec : $scope.helperCMND,
            ngaylam : ngaylam,
            giobatdau : $scope.requestDetailEdit.giobatdau.getUTCHours()*60+$scope.requestDetailEdit.giobatdau.getUTCMinutes(),
            gioketthuc : $scope.requestDetailEdit.gioketthuc.getUTCHours()*60+$scope.requestDetailEdit.gioketthuc.getUTCMinutes(),
            khachhang : $scope.request.sdtkhachhang
        }

        var dataToSend = {
            _id:$scope.requestDetailEdit._id,
            nguoigiupviec:$scope.helperCMND,
            trangthai:"Đã giao",
            idyeucau:$scope.requestDetailEdit.idyeucau,
            nhanvienxuly:$scope.request.nhanvienxuly,
            lichlamviec:lichlamviec
        }
        $http.post('api/requestDetail/updateNGV',dataToSend)
            .success(function(data){
                if(data.success != undefined && data.busy == true){
                    alert("Người giúp việc này đã bận, vui lòng chọn lại");
                    return;
                }
                if(data.success != undefined && data.success != false)
                {
                    $scope.requestDetailEdit.trangthai = "Đã giao";
                    $scope.requestDetailEdit.nguoigiupviec  = $scope.helperCMND;
                    $scope.request.nhanvienxuly = dataToSend.nhanvienxuly;
                    $("#cmndComboBox").attr('disabled','disabled');
                    $('#giaoViecModal').modal('hide');
                    $scope.requestDetailEdit = null;
                    
                }else{
                    alert("Cập nhập trạng thái của chi tiết yêu cầu thất bại");
                } 
                
            })
            .error(function(data){
                alert("Cập nhập trạng thái của chi tiết yêu cầu thất bại");
                return;
            });
    }


    $scope.newTimeWrong = false;
    $scope.newOutSideTime = 0;
    $scope.newOutSideCost = 0;
    $scope.newBaseCost = 0;
    $scope.oldBaseCost = 0;
    $scope.$watch("thaydoibatdau",
        function handleThayDoiGioBatDauChange( newValue, oldValue ) {
            if($scope.requestDetailChange!= undefined && $scope.requestDetailChange!= null&& newValue != null){
                var timeValue = $rootScope.changeTimeToValue(newValue);
                var hour = (timeValue-(timeValue%60))/60;
                var minutes = timeValue - hour*60;
                $scope.giobatdaumoi.setUTCHours(hour);
                $scope.giobatdaumoi.setMinutes(minutes);

                $scope.checkNewTime();
                $scope.checkOutTime();
            }
        });

    $scope.$watch("thaydoiketthuc",
        function handleThayDoiGioKetThucChange( newValue, oldValue ) {
            if($scope.requestDetailChange!= undefined && $scope.requestDetailChange!= null&& newValue != null){
                var timeValue = $rootScope.changeTimeToValue(newValue);
                var hour = (timeValue-(timeValue%60))/60;
                var minutes = timeValue - hour*60;
                $scope.gioketthucmoi.setUTCHours(hour);
                $scope.gioketthucmoi.setMinutes(minutes);

                $scope.checkNewTime();
                $scope.checkOutTime();
            }
        });

    $scope.checkNewTime = function(){
        var newTimeRange = ($scope.gioketthucmoi.getTime() - $scope.giobatdaumoi.getTime())/(60*60*1000);
        $scope.newTimeWrong = false;
        if(newTimeRange < 2){
            $scope.newTimeWrong = true;
            return;
        }
        if(newTimeRange%1 != 0){
            $scope.newTimeWrong = true;
            return;
        }
        $scope.newBaseCost  = (($scope.gioketthucmoi.getTime()- $scope.giobatdaumoi.getTime())/(60*60*1000) )* $scope.request.giachuan;
    }

    $scope.checkOutTime = function(){
        var newStart = $rootScope.changeTimeToValue($scope.thaydoibatdau);
        var newEnd = $rootScope.changeTimeToValue($scope.thaydoiketthuc);
        var ngoaigiodau = 0;
        var ngoaigiocuoi = 0;

        if((480 - newStart ) > 0 ){
            ngoaigiodau = (480 - newStart )/60;
        }
        
        if((newEnd - 1080) > 0 ){
            ngoaigiocuoi = (newEnd - 1080)/60;
        }
        $scope.newOutSideTime = ngoaigiodau + ngoaigiocuoi;
        $scope.newOutSideCost = ($scope.newOutSideTime * $scope.request.giachuan * $scope.request.phingoaigio)/100;

    }


    $scope.thayDoi = function(detailChoose){
        $scope.requestDetailChange = detailChoose;
        $scope.giobatdaumoi = new Date($scope.requestDetailChange.giobatdau);
        $scope.gioketthucmoi = new Date($scope.requestDetailChange.gioketthuc);
        var giobdTemp = $scope.giobatdaumoi.getUTCHours()*60 + $scope.giobatdaumoi.getMinutes();
        var gioktTemp = $scope.gioketthucmoi.getUTCHours()*60 + $scope.gioketthucmoi.getMinutes();
        $scope.thaydoiketthuc = $rootScope.changeValueToTime(gioktTemp);
        $scope.thaydoibatdau = $rootScope.changeValueToTime(giobdTemp);
        $scope.oldBaseCost = (($scope.requestDetailChange.gioketthuc.getTime()- $scope.requestDetailChange.giobatdau.getTime())/(60*60*1000) )* $scope.request.giachuan;
        $('#thayDoiModal').modal('show');
    }
    
    $scope.saveThayDoi = function(){
        if($scope.requestDetailChange == null || $scope.requestDetailChange == undefined || $scope.newTimeWrong == true){
            return;
        }
        var batdau = $scope.giobatdaumoi.getUTCHours()*60+$scope.giobatdaumoi.getUTCMinutes();
        var ketthuc = $scope.gioketthucmoi.getUTCHours()*60+$scope.gioketthucmoi.getUTCMinutes();

        if((batdau==$scope.requestDetailChange.giobatdau.getUTCHours()*60+$scope.requestDetailChange.giobatdau.getUTCMinutes()) && 
            (ketthuc==$scope.requestDetailChange.gioketthuc.getUTCHours()*60+$scope.requestDetailChange.gioketthuc.getUTCMinutes())){
            $('#thayDoiModal').modal('hide');
            $scope.requestDetailChange = null;
            return;
        }

        var lichlamviec = {
                idchitietyc : $scope.requestDetailChange._id,
                giobatdau : batdau,
                gioketthuc : ketthuc
            }
        $http.post('api/workPlan/updateTime',lichlamviec)
        .success(function(data){
            if(data.success != undefined && data.success != false){

            }else{
                alert("Cập nhập thời gian vào lịch làm việc thất bại");
            }
            
        })
        .error(function(data){
            alert('Cập nhập thời gian vào lịch làm việc thất bại');
            return;
        });

        var dataToUpdate = {
            idYC:$scope.request._id,
            idChiTietYC:$scope.requestDetailChange._id,
            giobatdau:$scope.giobatdaumoi,
            gioketthuc:$scope.gioketthucmoi,
            chiphicobanRequest:$scope.request.chiphi + $scope.newBaseCost-$scope.oldBaseCost,
            chiphingoaigioRequest:$scope.request.chiphingoaigio + $scope.newOutSideCost - $scope.requestDetailChange.chiphingoaigio,
            sogiongoaigioRequest:$scope.request.sogiongoaigio +$scope.newOutSideTime - $scope.requestDetailChange.sogiongoaigio,
                
            chiphingoaigio:$scope.newOutSideCost,
            sogiongoaigio:$scope.newOutSideTime
        }

        $http.post('api/requestDetail/updateTime',dataToUpdate)
            .success(function(data){
                if(data.success != undefined && data.success != false)
                {   
                    $scope.requestDetailChange.giobatdau =new Date(dataToUpdate.giobatdau);
                    $scope.requestDetailChange.gioketthuc = new Date(dataToUpdate.gioketthuc);
                    $scope.requestDetailChange.chiphingoaigio = dataToUpdate.chiphingoaigio;
                    $scope.requestDetailChange.sogiongoaigio = dataToUpdate.sogiongoaigio;
                    $scope.request.chiphi = dataToUpdate.chiphicobanRequest;
                    $scope.request.chiphingoaigio = dataToUpdate.chiphingoaigioRequest;
                    $scope.request.sogiongoaigio = dataToUpdate.sogiongoaigioRequest;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                     }
                    $('#thayDoiModal').modal('hide');
                }else{
                    alert("Cập nhập thời gian của chi tiết yêu cầu thất bại");
                } 
                
            })
            .error(function(data){
                alert("Cập nhập thời gian của chi tiết yêu cầu thất bại");
                return;
            });
    }

    $scope.deleteRequestDetail = function(requestDetail){
        
        $http.get('api/requestDetail/findByYeuCau/'+$scope.request._id)
        .success(function(data) {
            if(data.length == 0)
            {
                alert("Lỗi xảy ra trong qúa trình tải thông tin của của các chi tiết yêu cầu");
                return;
            }
            $scope.request.soluongchitietYC = data.length;

            $scope.deleteConfirm(requestDetail);
        })
        .error(function(data) {
           alert("Error!Lỗi xảy ra trong qúa trình tải thông tin của của các chi tiết yêu cầu");
            return;
        });

    }

    $scope.deleteConfirm =function(requestDetail){

        $scope.deleteWorkPlan(requestDetail._id);
        var chiphiOfDetail = ((requestDetail.gioketthuc.getTime()- requestDetail.giobatdau.getTime())/(60*60*1000) )* $scope.request.giachuan;
        console.log("chi phi of details "+chiphiOfDetail);
        var phithoathuan = $scope.request.phithoathuan - $scope.request.phithoathuan/$scope.request.soluongchitietYC;
        phithoathuan = phithoathuan - phithoathuan%1000;
        var dataToUpdate = {
            idYC:$scope.request._id,
            idChiTietYC:requestDetail._id,
            chiphicobanRequest:$scope.request.chiphi - chiphiOfDetail,
            chiphingoaigioRequest:$scope.request.chiphingoaigio - requestDetail.chiphingoaigio,
            sogiongoaigioRequest:$scope.request.sogiongoaigio - requestDetail.sogiongoaigio,
            phithoathuanRequest:phithoathuan
        }
        $http.post('/api/requestDetail/delete',dataToUpdate)
            .success(function(result){
                console.log(result);
                    if(result.success == false || result.success == undefined){
                        alert("Lỗi xảy ra.Xóa thất bại, vui lòng thử lại");
                        return;
                    }
                    alert("Xóa thành công.");
                    if(result.empty == false){
                        $scope.request.chiphi = dataToUpdate.chiphicobanRequest;
                        $scope.request.chiphingoaigio = dataToUpdate.chiphingoaigioRequest;
                        $scope.request.sogiongoaigio = dataToUpdate.sogiongoaigioRequest;
                        $scope.request.phithoathuan = dataToUpdate.phithoathuanRequest;

                        for (var i = 0; i < $scope.listDetail.length; i++) {
                            if($scope.listDetail[i]._id == requestDetail._id){
                                $scope.listDetail.splice(i,1);
                                break;
                            }
                        };
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    }else{
                        $location.path("/Show-Request-Infomation-List");
                    }
                    
                    
                })
            .error(function(data){
                alert("Xóa thất bại, vui lòng thử lại");
                return;
            });
    }
};