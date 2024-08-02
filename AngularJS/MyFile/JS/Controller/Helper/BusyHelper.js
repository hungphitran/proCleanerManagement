
app.service('helperBusyDateService', function() {
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

function helperBusyListCtrl($filter,$scope,$http,$location,helperBusyDateService, $rootScope){
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
            
            $scope.helperListOriginal = data;
            for (var i = 0; i < $scope.helperListOriginal.length; i++) {
                $scope.helperListOriginal[i].ngaysinh = new Date($scope.helperListOriginal[i].ngaysinh);
                $scope.helperListOriginal[i].hinhanh = "public/images/ngv/"+$scope.helperListOriginal[i].hinhanh;
                for (var j = 0; j < $scope.helperListOriginal[i].giaykhamsuckhoe.length; j++) {
                    $scope.helperListOriginal[i].giaykhamsuckhoe[j] = "public/images/ngv/"+$scope.helperListOriginal[i].giaykhamsuckhoe[j];
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

    $scope.showDetailHelperBusyDate = function(helper){
        helperBusyDateService.setHelper(helper);
        $location.path('/Show-Helper-Busy-Date-Detail');
    }
};



function showHelperBusyDateDetailCtrl($scope,$http,$location,helperBusyDateService,dateFilter, $rootScope){

    $('#dataSection').hide();

    

    
    $scope.giobdTemp = "06 : 00";
    $scope.gioktTemp = "06 : 00";
    $scope.NewBusyTime = {giobd:360, giokt:480, cmnd:0,};
	$scope.helper = helperBusyDateService.getHelper();
	$scope.weekList = [];
    $scope.dateForDetails;

    $scope.$watch("giobdTemp",
        function handleTypeGiobdTempChange( newValue, oldValue ) {
            var valueTemp  = $rootScope.changeTimeToValue(newValue);
            console.log(valueTemp);
            if(valueTemp != $scope.NewBusyTime.giobd){
                $scope.NewBusyTime.giobd = valueTemp;
            } 
        }
    );
    $scope.$watch("gioktTemp",
        function handleTypeGioktTempChange( newValue, oldValue ) {
            var valueTemp  = $rootScope.changeTimeToValue(newValue);
            console.log(valueTemp);
            if(valueTemp != $scope.NewBusyTime.giokt){
                $scope.NewBusyTime.giokt = valueTemp;
            }
        }
    );
    $scope.$watch("NewBusyTime.giobd",
        function handleTypeNewBusyTimeGiobdTempChange( newValue, oldValue ) {
            var valueTemp  = $rootScope.changeValueToTime(newValue);
            console.log(valueTemp);
            if(valueTemp != $scope.giobdTemp){
                $scope.giobdTemp = valueTemp;
            } 
        }
    );
    $scope.$watch("NewBusyTime.giokt",
        function handleTypeNewBusyTimeGioktTempChange( newValue, oldValue ) {
            var valueTemp  = $rootScope.changeValueToTime(newValue);
            console.log(valueTemp);
            if(valueTemp != $scope.gioktTemp){
                $scope.gioktTemp = valueTemp;
            }
        }
    );

    

    init();

    function init(){
        var todayOrigin = new Date();
        var today = new Date();
        var todayInWeek = today.getDay();
        var dayNumberOfThisMonth = daysInThisMonth(today.getUTCMonth()+1, today.getUTCFullYear());

        var minMonth = today.getUTCMonth();
        var maxMonth = minMonth; 
        var minYear =  today.getUTCFullYear();
        var maxYear = minYear; 
        if(dayNumberOfThisMonth - today.getDate() < 30){
            var temp = new Date();
            temp.setUTCMonth(minMonth+1);
            maxMonth = temp.getUTCMonth();
            maxYear = temp.getUTCFullYear();
        }

        var todayTime = today.getTime();
        todayTime = todayTime - (todayInWeek * 24 * 60 * 60 * 1000);
        today.setTime(todayTime);
        var startDayInMonth = today.getDate();


        var dayNumberOfCalendar = 30+todayInWeek;
        var weekNumber  = dayNumberOfCalendar/7;

        // set default date
        for(var i=0;i<weekNumber;i++){
            var week = { name : i+"",
                         dateList : []};
            
            for(var j=0;j<7 && (i*7+j)<dayNumberOfCalendar;j++){
                today.setTime(todayTime + ((i*7+j) * 24 * 60 * 60 * 1000)); 
                var dayOfThisDate = new Date(today);

                var date = { 
                        value : today.getDate(),
                        classType : "normalDate", icon:"" ,
                        day : dayOfThisDate,
                        busyTime : [], workTime : []};

                week.dateList.push(date); 
            }
            $scope.weekList.push(week);
        }

        for (var i = 0; i < todayInWeek; i++) {
            $scope.weekList[0].dateList[i].classType="passedDate";
        };

        $http.get('/api/helper/busyDate/'+$scope.helper.cmnd)
        .success(function(data) {
            if(data==='object'||data.length==undefined){
                alert("Lỗi trong việc tải dữ liệu");
                return;
            }
            for(var i= 0;i<data.length;i++){

                var busyDate = new Date(data[i].ngay);
                // difference month
                if(busyDate.getUTCMonth() != minMonth && busyDate.getUTCMonth() != maxMonth){
                    continue;
                }
                // difference year
                if(busyDate.getUTCFullYear() != minYear && busyDate.getUTCFullYear() != maxYear){
                    continue;
                }

                var numberOfDateBusyTemp = (busyDate.getUTCDate()-startDayInMonth);
                if(busyDate.getUTCMonth()==maxMonth){
                    numberOfDateBusyTemp = (busyDate.getUTCDate()+dayNumberOfThisMonth - startDayInMonth)
                }

                // if is 31 th day in month
                if(numberOfDateBusyTemp>=dayNumberOfCalendar){
                    continue;
                }
                var week = (numberOfDateBusyTemp-(numberOfDateBusyTemp%7))/7;
                var day = busyDate.getDay();

                $scope.weekList[week].dateList[day].classType="busyDate";
                $scope.weekList[week].dateList[day].icon="fa fa-times fa-2x";
                $scope.weekList[week].dateList[day].busyTime.push(data[i]);   
            }


            $http.get('/api/workPlan/findByNGVFromToday/'+$scope.helper.cmnd)
            .success(function(data) {
                if(data==='object'||data.length==undefined){
                    alert("Lỗi trong việc tải dữ liệu");
                    return;
                }
                for(var i= 0;i<data.length;i++){
                    var busyDate = new Date(data[i].ngaylam);
                    // difference month
                    if(busyDate.getUTCMonth() != minMonth && busyDate.getUTCMonth() != maxMonth){
                        continue;
                    }
                    if(busyDate.getUTCFullYear() != minYear && busyDate.getUTCFullYear() != maxYear){
                        continue;
                    }

                    var numberOfDateBusyTemp = (busyDate.getUTCDate()-startDayInMonth);
                    if(busyDate.getUTCMonth()==maxMonth){
                        numberOfDateBusyTemp = (busyDate.getUTCDate()+dayNumberOfThisMonth - startDayInMonth)
                    }

                    // if is 31 th day in month
                    if(numberOfDateBusyTemp>=dayNumberOfCalendar){
                        continue;
                    }
                    var week = (numberOfDateBusyTemp-(numberOfDateBusyTemp%7))/7;
                    var day = busyDate.getDay();

                    $scope.weekList[week].dateList[day].classType="busyDate";
                    $scope.weekList[week].dateList[day].icon="fa fa-times fa-2x";
                    data[i].ngaylam = new Date(data[i].ngaylam);
                    $scope.weekList[week].dateList[day].workTime.push(data[i]);   
                }

                $scope.showDefault();

                })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });
}
    
    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }
    $scope.showError = function(){
        $('#loadDataSection').hide();
        $('#dataSection').hide();
    }

    $scope.showDetailBusyTime = function(date){
        if(date.classType=="passedDate"){
            return;
        }

        $scope.dateForDetails = date;
        $scope.NewBusyTime.ngay = $scope.dateForDetails.day;
        $scope.NewBusyTime.cmnd = $scope.helper.cmnd;
        $('#showBusyTimeDetailModal').modal('show');
    }

	function daysInThisMonth(month, year) {

    	return new Date(year, month, 0).getDate();
	}

    $scope.existsWorkPlanData = {
        listWorkPlan:[],
        cmnd:"",
        giobd:"",
        giokt:"",
        ngay:""
    };
    $scope.confirmDeleteExistsWorkPlan = false;
    $('#showBusyTimeDetailModal').on('hidden.bs.modal', function () {
        $scope.confirmDeleteExistsWorkPlan = false;    
        console.log("hidden");  
    })
    $scope.saveNewBusyTime = function(){

        $scope.NewBusyTime.ngay.setHours(7);
        $scope.NewBusyTime.ngay.setMinutes(0);
        $scope.NewBusyTime.ngay.setSeconds(0);
        $scope.NewBusyTime.ngay.setMilliseconds(0);

        if($scope.NewBusyTime.giobd >= $scope.NewBusyTime.giokt){
            alert("Khung giờ sai, vui lòng kiểm tra lại");
            return;
        }

        $http.post('api/helper/addBusyTime',$scope.NewBusyTime)
        .success(function(data){
            if(data==undefined || data.success == false){
                alert('Lỗi xảy ra, thêm khung giờ bận thất bại');
                return;
            }
            if(data.existsWorkPlan == false){
                alert('Thêm thành công');
                $scope.dateForDetails.classType="busyDate";
                $scope.dateForDetails.icon="fa fa-times fa-2x";
                $scope.dateForDetails.busyTime.push(data.busyTime);
                $scope.NewBusyTime.giobd = 360;
                $scope.NewBusyTime.giokt = 360;
            }else{
                $scope.existsWorkPlanData.listWorkPlan = data.listWorkPlan;
                for (var i = 0; i < $scope.existsWorkPlanData.listWorkPlan.length; i++) {
                    $scope.existsWorkPlanData.listWorkPlan[i].ngaylam = new Date($scope.existsWorkPlanData.listWorkPlan[i].ngaylam);
                };
                $scope.existsWorkPlanData.cmnd = $scope.NewBusyTime.cmnd;
                $scope.existsWorkPlanData.ngay = $scope.NewBusyTime.ngay;
                $scope.existsWorkPlanData.giobd = $scope.NewBusyTime.giobd;
                $scope.existsWorkPlanData.giokt = $scope.NewBusyTime.giokt;
                $scope.confirmDeleteExistsWorkPlan = true;


            }
            
        })
        .error(function(data){
            alert('ERROR!Lỗi xảy ra, thêm khung giờ bận thất bại');
            console.log(data);
        });

    }

    $scope.confirmDeleteExistsWorkPlanOK = function(){
        var dataToSend = {
            listCTYC:[],
            cmnd:$scope.existsWorkPlanData.cmnd,
            giobd:$scope.existsWorkPlanData.giobd,
            giokt:$scope.existsWorkPlanData.giokt,
            ngay:$scope.existsWorkPlanData.ngay
        }
        for (var i = 0; i < $scope.existsWorkPlanData.listWorkPlan.length; i++) {
            dataToSend.listCTYC.push($scope.existsWorkPlanData.listWorkPlan[i].idchitietyc);
        };

        $http.post('api/helper/addBusyTimeAndDeleteExistsWorkPlan',dataToSend)
        .success(function(data){
            if(data==undefined || data.success == false){
                alert('Lỗi xảy ra, thêm khung giờ bận thất bại');
                return;
            }

            for (var i = 0; i < $scope.dateForDetails.workTime.length; i++) {

                for (var j = 0; j < dataToSend.listCTYC.length; j++) {
                    if($scope.dateForDetails.workTime[i].idchitietyc == dataToSend.listCTYC[j]){
                        $scope.dateForDetails.workTime.splice(i,1);
                        i--;
                        break;
                    }
                };

               
            };
            $scope.dateForDetails.busyTime.push(data.busyTime);
            $scope.confirmDeleteExistsWorkPlan = false;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
             }

            alert("Xóa và thêm khung giờ bận thành công");
            
        })
        .error(function(data){
            alert('ERROR!Lỗi xảy ra, thêm khung giờ bận thất bại');
            console.log(data);
        });

    }


    $scope.deleteBusyTime = function(busyTime){
        $http.delete('/api/helper/deleteBusyTime/' + busyTime._id)
            .success(function(data){
                console.log(data);
                 if(data.success != undefined && data.success != false){
                    alert("Xóa thời gian bận thành công");
                    for (var i = 0; i < $scope.dateForDetails.busyTime.length; i++) {
                        console.log(busyTime._id +"  "+ $scope.dateForDetails.busyTime[i]._id)
                        if($scope.dateForDetails.busyTime[i]._id == busyTime._id){
                            $scope.dateForDetails.busyTime.splice(i,1);
                            if($scope.dateForDetails.busyTime.length==0 && $scope.dateForDetails.workTime.length==0){
                                $scope.dateForDetails.classType="normalDate";
                                $scope.dateForDetails.icon="";
                            }
                            return;
                        }
                    };
                    
                 }
                 else{
                    alert("Xóa thời gian bận thất bại");
                 }
             })
            .error(function(data){
                alert("Xóa thời gian bận thất bại");
            });
    }

}