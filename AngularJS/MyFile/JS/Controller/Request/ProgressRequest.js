function progressRequestCtrl($scope,$http,$location,progressRequestDetailService,$rootScope){

    $('#dataSection').hide();
    $scope.requestList = [
    ];
            
    $scope.requestListOriginal =[];//$scope.requestList;
    $scope.page ='list';

    $scope.searchText = "";
    $scope.typeSearch = "all";

    $scope.tieuchiSearch = [" Tất Cả "," Mã Số ","Ngày Yêu Cầu", "Số ĐT Khách Hàng", "Loại Yêu cầu","Trạng Thái", "Chi Phí"];

    $scope.timePicker = null;
    $scope.timeRange = {
            startDate:"",
            endDate:""
    };
    $scope.timeRangeShow = {
            startDate:"",
            endDate:""
    };

    $scope.initTimeRangeLoadProgressRequest = function(startDate, endDate){
        $scope.timePicker = $("#timeRangeLoadProgressRequest").daterangepicker({
            datepickerOptions : {
                numberOfMonths : 2
            },
            presetRanges:[
            {
                text:"30 Ngày Qua",
                dateStart:function(){return moment().subtract("days",29)},
                dateEnd:function(){return moment()}
            },
            {
                text:"14 Ngày Qua",
                dateStart:function(){return moment().subtract("days",13)},
                dateEnd:function(){return moment()}
            },
            {
                text:"7 Ngày Qua",
                dateStart:function(){return moment().subtract("days",6)},
                dateEnd:function(){return moment()}
            },
            {
                text:"Ngày Hôm Qua",
                dateStart:function(){return moment().subtract("days",1)},
                dateEnd:function(){return moment().subtract("days",1)}
            },
            {
                text:"Ngày Hôm Nay",
                dateStart:function(){return moment()},
                dateEnd:function(){return moment()}
            },
            {
                text:"Tháng Này",
                dateStart:function(){return moment().startOf("month")},
                dateEnd:function(){return moment()}
            },
            {
                text:"Tháng Trước",
                dateStart:function(){return moment().subtract("month",1).startOf("month")},
                dateEnd:function(){return moment().subtract("month",1).endOf("month")}
            },
            {
                text:"Tất Cả",
                dateStart:function(){return moment().subtract("year",30).startOf("year")},
                dateEnd:function(){return moment()}
            }
            ],
            dateFormat :"dd/mm/yy"

        });
        var defaultTimeRange = [];
        defaultTimeRange['start']=new Date(startDate);
        defaultTimeRange['end'] = new Date(endDate);
        $("#timeRangeLoadProgressRequest").daterangepicker("setRange",defaultTimeRange);
    }

    $scope.checkToLoadProgressRequest = function(){
        var jsonObj = JSON.parse($('#timeRangeLoadProgressRequest').val());
        var startDateTemp = new Date(jsonObj.start);
        var endDateTemp = new Date(jsonObj.end);
        if($scope.timeRangeShow.startDate.getTime() == startDateTemp.getTime() 
            && $scope.timeRangeShow.endDate.getTime() == endDateTemp.getTime()){
            return;

        }
        $scope.timeRange.startDate = new Date(startDateTemp);
        $scope.timeRange.endDate = new Date(endDateTemp);
        $scope.loadProgressRequestData();
    }

    $scope.loadProgressRequestData = function(){

        $('#dataSection').hide();
        $('#loadDataSection').fadeIn(500);
        $scope.requestListOriginal = [];
        $scope.requestList = [];
        
        $scope.timeRange.startDate.setHours(7);
        $scope.timeRange.endDate.setHours(7);
        $scope.timeRangeShow.startDate = new Date($scope.timeRange.startDate);
        $scope.timeRangeShow.endDate = new Date($scope.timeRange.endDate);
        $scope.timeRange.endDate.setTime($scope.timeRange.endDate.getTime()+ 24*60*60*1000);
        
        $http.post('/api/request/list/notdone',$scope.timeRange)
        .success(function(data) {
            try{
                if(data.success==false){
                    alert("Lỗi trong quá trình tải danh sách yêu cầu, vui lòng thử lại");
                    return;
                }
            }
            catch(err){
            }
            if(data.length!=0){
                $scope.requestListOriginal = data;
                for (var i = 0; i < $scope.requestListOriginal.length; i++) {
                    $scope.requestListOriginal[i].ngaydatyeucau = new Date($scope.requestListOriginal[i].ngaydatyeucau);
                };
                for (var i = 0; i < $scope.requestListOriginal.length; i++) {
                    for (var j = i+1; j < $scope.requestListOriginal.length; j++) {
                        if($scope.requestListOriginal[i].ngaydatyeucau.getTime() > $scope.requestListOriginal[j].ngaydatyeucau.getTime() ){
                            var temp = $scope.requestListOriginal[i];
                            $scope.requestListOriginal[i] = $scope.requestListOriginal[j];
                            $scope.requestListOriginal[j] = temp;
                        }
                    };
                };
                $scope.requestList = $scope.requestListOriginal;
            }else{
                $scope.requestListOriginal=[];
            }
            
            $scope.searchText = "";
            $('#loadDataSection').hide();
            $('#dataSection').fadeIn(500);
        })
        .error(function(data) {
            alert("Lỗi trong quá trình tải danh sách yêu cầu, vui lòng thử lại");
        });
    }

    $scope.search = function(newValue){
        var tempResult = [];
        switch($scope.typeSearch){
            case " Tất Cả ":
                for(var i=0;i<$scope.requestListOriginal.length;i++)
                {
                    if(($scope.requestListOriginal[i].id+"").toUpperCase().indexOf(newValue.toUpperCase())>-1 
                        ||($scope.requestListOriginal[i].sdtkhachhang+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                        ||($scope.requestListOriginal[i].loaiyeucau+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                        ||($scope.requestListOriginal[i].chiphi+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                        ||$scope.requestListOriginal[i].trangthai.toUpperCase().indexOf(newValue.toUpperCase())>-1
                        ||($scope.requestListOriginal[i].ngaydatyeucau.getUTCDate()+"/"+
                    $scope.requestListOriginal[i].ngaydatyeucau.getUTCMonth()+"/"
                    +$scope.requestListOriginal[i].ngaydatyeucau.getUTCFullYear()).toUpperCase().indexOf(newValue.toUpperCase())>-1)
                    {
                        tempResult.push($scope.requestListOriginal[i]);  
                    }
                }
                $scope.requestList = tempResult;
                break;
            case " Mã Số ":
                for(var i=0;i<$scope.requestListOriginal.length;i++)
                {
                    if(($scope.requestListOriginal[i].id+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                    {
                        tempResult.push($scope.requestListOriginal[i]);  
                    }
                }
                $scope.requestList = tempResult;
                break;
            case "Số ĐT Khách Hàng":
                for(var i=0;i<$scope.requestListOriginal.length;i++)
                {
                    if(($scope.requestListOriginal[i].sdtkhachhang+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                    {
                        tempResult.push($scope.requestListOriginal[i]);  
                    }
                }
                $scope.requestList = tempResult;
                break;
            case "Loại Yêu cầu":
                for(var i=0;i<$scope.requestListOriginal.length;i++)
                {
                    if(($scope.requestListOriginal[i].loaiyeucau+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                    {
                        tempResult.push($scope.requestListOriginal[i]);  
                    }
                }
                $scope.requestList = tempResult;
                break;
            case "Chi Phí":
                for(var i=0;i<$scope.requestListOriginal.length;i++)
                {
                    if(($scope.requestListOriginal[i].chiphi+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                    {
                        tempResult.push($scope.requestListOriginal[i]);  
                    }
                }
                $scope.requestList = tempResult;
                break;
            case "Trạng Thái":
                for(var i=0;i<$scope.requestListOriginal.length;i++)
                {
                    if($scope.requestListOriginal[i].trangthai.toUpperCase().indexOf(newValue.toUpperCase())>-1)
                    {
                        tempResult.push($scope.requestListOriginal[i]);  
                    }
                }
                $scope.requestList = tempResult;
                break;
            case "Ngày Yêu Cầu":
                for(var i=0;i<$scope.requestListOriginal.length;i++)
                {
                    if(($scope.requestListOriginal[i].ngaydatyeucau.getUTCDate()+"/"+
                    $scope.requestListOriginal[i].ngaydatyeucau.getUTCMonth()+"/"
                    +$scope.requestListOriginal[i].ngaydatyeucau.getUTCFullYear()).toUpperCase().indexOf(newValue.toUpperCase())>-1)
                    {
                        tempResult.push($scope.requestListOriginal[i]);  
                    }
                }
                $scope.requestList = tempResult;
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


    $scope.editRequest = function(request){
        
        progressRequestDetailService.setRequest(request);
        $location.path('/Show-Progress-Request-Detail');
    }
    $scope.deleteRequest = function(request){
        
        $http.delete('/api/request/delete/' + request._id)
            .success(function(result){
                console.log(result);
                    if(result.error == true){
                        alert("Lỗi xảy ra.Xóa thất bại, vui lòng thử lại");
                        return;
                        }
                        if(result.emptyDone == false){
                            alert("Tồn tại chi tiết đơn hàng đã hoàn thành, Không thể xóa đơn hàng này");
                            return;
                        }

                        for (var i = 0; i < $scope.requestListOriginal.length; i++) {
                            if($scope.requestListOriginal[i]._id == request._id){
                                $scope.requestListOriginal.splice(i,1);
                                break;
                            }
                        };
                        for (var i = 0; i < $scope.requestList.length; i++) {
                            if($scope.requestList[i]._id == request._id){
                                $scope.requestList.splice(i,1);
                                break;
                            }
                        };
                        alert("Xóa thành công.");
                })
            .error(function(data){
                alert("Xóa thất bại, vui lòng thử lại");
                return;
            });
    }

    $(document).ready(function(){
        
        $scope.timeRange.startDate = new Date();
        $scope.timeRange.startDate.setHours(0);
        $scope.timeRange.startDate.setMinutes(0);
        $scope.timeRange.startDate.setSeconds(0);
        $scope.timeRange.startDate.setMilliseconds(0);
        $scope.timeRange.endDate = new Date($scope.timeRange.startDate);
        $scope.timeRange.startDate.setTime($scope.timeRange.startDate.getTime() - 2*(24*60*60*1000));

        $scope.initTimeRangeLoadProgressRequest($scope.timeRange.startDate, $scope.timeRange.endDate);
        $scope.loadProgressRequestData();

    });

};