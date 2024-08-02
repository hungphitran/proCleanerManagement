app.service('customerService', function() {
    var customer;
    
    return {
        setCustomer: function(value) {
            customer = value;
        },
        getCustomer: function() {
            return customer;
        }
    }
});

function customerListCtrl($filter,$scope,$http,$location, $rootScope,customerService){
    $scope.timeTemp = new Date().getTime();
    $('#dataSection').hide();
    $scope.customerList = {};
    $scope.customerListOriginal ={};
    $scope.page ='list';
    $scope.searchText = "";
    $scope.typeSearch = "all";
    $scope.customerToDelete = null;

    $scope.tieuchiSearch = [" Tất Cả ","Số Điện Thoại","Họ Tên","Địa Chỉ"];


    $scope.search = function(newValue){
        var tempResult = [];
        switch($scope.typeSearch){
        case " Tất Cả ":
            for(var i=0;i<$scope.customerListOriginal.length;i++)
            {
                if($scope.customerListOriginal[i].hoten.toUpperCase().indexOf(newValue.toUpperCase())>-1 
                    ||($scope.customerListOriginal[i].sdt+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||($scope.customerListOriginal[i].diachi+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.customerListOriginal[i]);  
                }
            }
            $scope.customerList = tempResult;
            break;
        case "Số Điện Thoại":
            for(var i=0;i<$scope.customerListOriginal.length;i++)
            {
                if(($scope.customerListOriginal[i].sdt+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.customerListOriginal[i]);  
                }
            }
            $scope.customerList = tempResult;
            break;

        case "Họ Tên":
            for(var i=0;i<$scope.customerListOriginal.length;i++)
            {
                if($scope.customerListOriginal[i].hoten.toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.customerListOriginal[i]);  
                }
            }
            $scope.customerList = tempResult;
            break;

        case "Địa Chỉ":
            for(var i=0;i<$scope.customerListOriginal.length;i++)
            {
                if(($scope.customerListOriginal[i].diachi+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.customerListOriginal[i]);  
                }
            }
            $scope.customerList = tempResult;
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

    $http.get('/api/customer/list')
        .success(function(data) {
            console.log(data);
            $scope.customerListOriginal = data;
            $scope.customerList = $scope.customerListOriginal;
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

    $scope.showListRequest = function(customer){
        customerService.setCustomer(customer);
        $location.path("/List-Request-By-Customer");
    }
};


function listRequestByCustomerCtrl($filter,$scope,$http,$location, $rootScope,customerService, doneRequestDetailService){
    $scope.timeTemp = new Date().getTime();
    $scope.customer  = customerService.getCustomer();
    $('#dataSection').hide();

    $scope.infoToLoadData = {
        sdtkhachhang:$scope.customer.sdt,
        timeRange:null
    }

    $scope.requestList = [
        ];
            
    $scope.requestListOriginal =[];
    $scope.timePicker = null;
    $scope.timeRange = {
            startDate:"",
            endDate:""
    };
    $scope.timeRangeShow = {
            startDate:"",
            endDate:""
    };

    $scope.searchText = "";
    $scope.typeSearch = "all";
    $scope.tieuchiSearch = [" Tất Cả "," Mã Số ","Ngày Yêu Cầu", "Loại Yêu cầu", "Chi Phí"];

    $scope.initTimeRangeLoadRequest = function(startDate, endDate){
        $scope.timePicker = $("#timeRangeLoadRequest").daterangepicker({
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
        $("#timeRangeLoadRequest").daterangepicker("setRange",defaultTimeRange);
    }
    $scope.checkToLoadRequest = function(){
        var jsonObj = JSON.parse($('#timeRangeLoadRequest').val());
        var startDateTemp = new Date(jsonObj.start);
        var endDateTemp = new Date(jsonObj.end);
        if($scope.timeRangeShow.startDate.getTime() == startDateTemp.getTime() 
            && $scope.timeRangeShow.endDate.getTime() == endDateTemp.getTime()){
            return;

        }
        $scope.timeRange.startDate = new Date(startDateTemp);
        $scope.timeRange.endDate = new Date(endDateTemp);
        $scope.loadRequestData();
    }

    $scope.loadRequestData = function(){

        $('#dataSection').hide();
        $('#loadDataSection').fadeIn(500);
        $scope.requestListOriginal = [];
        $scope.requestList = [];
        
        $scope.timeRange.startDate.setHours(7);
        $scope.timeRange.endDate.setHours(7);
        $scope.timeRangeShow.startDate = new Date($scope.timeRange.startDate);
        $scope.timeRangeShow.endDate = new Date($scope.timeRange.endDate);
        
        $scope.timeRange.endDate.setTime($scope.timeRange.endDate.getTime()+ 24*60*60*1000);
        $scope.infoToLoadData = {
            sdtkhachhang:$scope.customer.sdt,
            timeRange:$scope.timeRange
        }
        $http.post('/api/customer/listRequestByCustomer',$scope.infoToLoadData)
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
                    $scope.requestListOriginal[i].id=$scope.requestListOriginal[i]._id;
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
        console.log(newValue);
        switch($scope.typeSearch){
            case " Tất Cả ":
                for(var i=0;i<$scope.requestListOriginal.length;i++)
                {
                    if(($scope.requestListOriginal[i].id+"").toUpperCase().indexOf(newValue.toUpperCase())>-1 
                        ||($scope.requestListOriginal[i].loaiyeucau+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                        ||($scope.requestListOriginal[i].chiphi+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                        ||($scope.requestListOriginal[i].ngaydatyeucau.getUTCDate()+"/"+
                    $scope.requestListOriginal[i].ngaydatyeucau.getUTCMonth()+"/"
                    +$scope.requestListOriginal[i].ngaydatyeucau.getUTCFullYear()).toUpperCase().indexOf(newValue.toUpperCase())>-1)
                    {
                        console.log(newValue);
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
            console.log(newValue);
            if(typeof newValue == 'undefined')
                return;
            if($scope.searchText=="")
                return;
            $scope.search($scope.searchText);
            
        }
    );
    $scope.editRequest = function(request){
        doneRequestDetailService.setRequest(request);
        $location.path('/Show-Done-Request-Detail');
    };    

    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }

    $(document).ready(function(){
        
        $scope.timeRange.startDate = new Date();
        $scope.timeRange.startDate.setHours(0);
        $scope.timeRange.startDate.setMinutes(0);
        $scope.timeRange.startDate.setSeconds(0);
        $scope.timeRange.startDate.setMilliseconds(0);
        $scope.timeRange.endDate = new Date($scope.timeRange.startDate);
        $scope.timeRange.startDate.setTime($scope.timeRange.startDate.getTime() - 2*(24*60*60*1000));

        $scope.initTimeRangeLoadRequest($scope.timeRange.startDate, $scope.timeRange.endDate);
        $scope.loadRequestData();

    });
};