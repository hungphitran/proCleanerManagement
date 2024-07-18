function PaymentRequestCtrl($scope,$location,$http,PaymentRequestDetailService,$rootScope){

    $('#dataSection').hide();
    $scope.requestHistoryList = [
    ];
            
    $scope.requestHistoryListOriginal =[];//$scope.requestList;
    $scope.page ='list';

    $scope.searchText = "";
    $scope.typeSearch = "Số ĐT Khách Hàng";

    $scope.tieuchiSearch = ["Số ĐT Khách Hàng","Họ Tên Khách Hàng","Ngày Yêu Cầu","Loại Yêu cầu","Quận", "Chi Phí"];

    $scope.timePicker = null;
    $scope.timeRange = {
            startDate:"",
            endDate:""
    };
    $scope.timeRangeShow = {
            startDate:"",
            endDate:""
    };

    $scope.initTimeRangeLoadPaymentRequest = function(startDate, endDate){
        $scope.timePicker = $("#timeRangeLoadPaymentRequest").daterangepicker({
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
        $("#timeRangeLoadPaymentRequest").daterangepicker("setRange",defaultTimeRange);
    }

    $scope.checkToLoadPaymentRequest = function(){
        var jsonObj = JSON.parse($('#timeRangeLoadPaymentRequest').val());
        var startDateTemp = new Date(jsonObj.start);
        var endDateTemp = new Date(jsonObj.end);
        if($scope.timeRangeShow.startDate.getTime() == startDateTemp.getTime() 
            && $scope.timeRangeShow.endDate.getTime() == endDateTemp.getTime()){
            return;

        }
        $scope.timeRange.startDate = new Date(startDateTemp);
        $scope.timeRange.endDate = new Date(endDateTemp);
        $scope.loadPaymentRequestData();
    }

    $scope.loadPaymentRequestData = function(){

        $('#dataSection').hide();
        $('#loadDataSection').fadeIn(500);
        $scope.requestHistoryListOriginal = [];
        $scope.requestHistoryList = [];
        
        $scope.timeRange.startDate.setHours(7);
        $scope.timeRange.endDate.setHours(7);
        $scope.timeRangeShow.startDate = new Date($scope.timeRange.startDate);
        $scope.timeRangeShow.endDate = new Date($scope.timeRange.endDate);
        
        $scope.timeRange.endDate.setTime($scope.timeRange.endDate.getTime()+ 24*60*60*1000);
        console.log($scope.timeRange);
        $http.post('/api/request/list/done',$scope.timeRange)
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
                $scope.requestHistoryListOriginal = data;
                for (var i = 0; i < $scope.requestHistoryListOriginal.length; i++) {
                    $scope.requestHistoryListOriginal[i].ngaydatyeucau = new Date($scope.requestHistoryListOriginal[i].ngaydatyeucau);
                    $scope.requestHistoryListOriginal[i].id=$scope.requestHistoryListOriginal[i]._id;
                };

                for (var i = 0; i < $scope.requestHistoryListOriginal.length; i++) {
                    for (var j = i+1; j < $scope.requestHistoryListOriginal.length; j++) {
                        if($scope.requestHistoryListOriginal[i].ngaydatyeucau.getTime() > $scope.requestHistoryListOriginal[j].ngaydatyeucau.getTime() ){
                            var temp = $scope.requestHistoryListOriginal[i];
                            $scope.requestHistoryListOriginal[i] = $scope.requestHistoryListOriginal[j];
                            $scope.requestHistoryListOriginal[j] = temp;
                        }
                    };
                };

                $scope.requestHistoryList = $scope.requestHistoryListOriginal;
            }else{
                $scope.requestHistoryListOriginal=[];
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
        console.log(newValue);
        switch($scope.typeSearch){
            
            case "Quận":
                for(var i=0;i<$scope.requestHistoryListOriginal.length;i++)
                {
                    if(($scope.requestHistoryListOriginal[i].quan+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                    {
                        tempResult.push($scope.requestHistoryListOriginal[i]);  
                    }
                }
                $scope.requestHistoryList = tempResult;
                break;
            case "Họ Tên Khách Hàng":
                for(var i=0;i<$scope.requestHistoryListOriginal.length;i++)
                {
                    if(($scope.requestHistoryListOriginal[i].hoten+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                    {
                        tempResult.push($scope.requestHistoryListOriginal[i]);  
                    }
                }
                $scope.requestHistoryList = tempResult;
                break;
            case "Số ĐT Khách Hàng":
                for(var i=0;i<$scope.requestHistoryListOriginal.length;i++)
                {
                    if(($scope.requestHistoryListOriginal[i].sdtkhachhang+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                    {
                        tempResult.push($scope.requestHistoryListOriginal[i]);  
                    }
                }
                $scope.requestHistoryList = tempResult;
                break;
            case "Loại Yêu cầu":
                for(var i=0;i<$scope.requestHistoryListOriginal.length;i++)
                {
                    if(($scope.requestHistoryListOriginal[i].loaiyeucau+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                    {
                        tempResult.push($scope.requestHistoryListOriginal[i]);  
                    }
                }
                $scope.requestHistoryList = tempResult;
                break;
            case "Chi Phí":
                for(var i=0;i<$scope.requestHistoryListOriginal.length;i++)
                {
                    if(($scope.requestHistoryListOriginal[i].chiphi+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                    {
                        tempResult.push($scope.requestHistoryListOriginal[i]);  
                    }
                }
                $scope.requestHistoryList = tempResult;
                break;
            
            case "Ngày Yêu Cầu":
                for(var i=0;i<$scope.requestHistoryListOriginal.length;i++)
                {
                    if(($scope.requestHistoryListOriginal[i].ngaydatyeucau.getUTCDate()+"/"+
                    $scope.requestHistoryListOriginal[i].ngaydatyeucau.getUTCMonth()+"/"
                    +$scope.requestHistoryListOriginal[i].ngaydatyeucau.getUTCFullYear()).toUpperCase().indexOf(newValue.toUpperCase())>-1)
                    {
                        tempResult.push($scope.requestHistoryListOriginal[i]);  
                    }
                }
                $scope.requestHistoryList = tempResult;
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

    $scope.editRequest = function(request){

        PaymentRequestDetailService.setRequest(request);
        $location.path('/Payment-Request-Detail');
    };  

    $(document).ready(function(){
        
        $scope.timeRange.startDate = new Date();
        $scope.timeRange.startDate.setHours(0);
        $scope.timeRange.startDate.setMinutes(0);
        $scope.timeRange.startDate.setSeconds(0);
        $scope.timeRange.startDate.setMilliseconds(0);
        $scope.timeRange.endDate = new Date($scope.timeRange.startDate);
        $scope.timeRange.startDate.setTime($scope.timeRange.startDate.getTime() - 2*(24*60*60*1000));

        $scope.initTimeRangeLoadPaymentRequest($scope.timeRange.startDate, $scope.timeRange.endDate);
        $scope.loadPaymentRequestData();

    });
};