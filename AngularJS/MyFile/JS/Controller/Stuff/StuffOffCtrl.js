

function stuffOffListCtrl($scope,$http,$location,editStuffService,$rootScope){

    $('#dataSection').hide();
    $scope.stuffList = {};
    $scope.stuffListOriginal ={};
    $scope.page ='list';

    $scope.searchText = "";
    $scope.typeSearch = "all";

    $scope.tieuchiSearch = [" Tất Cả "," CMND "," Họ Tên "," Điện Thoại "," Quê Quán "];


    $http.get('/api/stuff/list')
        .success(function(data) {
            $scope.stuffListOriginal = data;

            for (var i = 0; i < $scope.stuffListOriginal.length; i++) {
                $scope.stuffListOriginal[i].ngaysinh = new Date($scope.stuffListOriginal[i].ngaysinh);
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


    $scope.showOffDetails = function(stuff){
        editStuffService.setStuff(stuff);
        $location.path('/Show-Stuff-Off-Detail');
    }
};
function stuffOffDetailCtrl($scope,$http,$location,editStuffService,$rootScope){

    $('#dataSection').hide();
    $scope.stuff = editStuffService.getStuff();
    $scope.weekList = [];
    $scope.dateForDetails;
    $scope.newOffDay = {};
    $scope.offDay={};
    $scope.option = "Lưu lại";

    init();

    function init(){
        var today = new Date();

        var todayInWeek = today.getDay();
        
        var todayInMonth = today.getDate()-1;
        var dayNumberOfThisMonth = daysInThisMonth(today.getMonth()+1, today.getUTCFullYear());

        var thisMonth = today.getMonth();
        var todayTime = today.getTime();

        todayTime = todayTime - (todayInMonth * 24 * 60 * 60 * 1000);
        today.setTime(todayTime);


        var startDayOfThisMonthInWeek = today.getDay();

        todayTime = todayTime - (startDayOfThisMonthInWeek * 24 * 60 * 60 * 1000);
        today.setTime(todayTime);
        var startDayInMonth = today.getDate();

        var dayNumberOfCalendar = dayNumberOfThisMonth  + startDayOfThisMonthInWeek;
        var weekNumber  = dayNumberOfCalendar/7;

        // set default date
        for(var i=0;i<weekNumber;i++){
            var week = { name : i+"",
                         dateList : []};
            
            for(var j=0;j<7 && (i*7+j)<dayNumberOfCalendar;j++){
                today.setTime(todayTime + ((i*7+j) * 24 * 60 * 60 * 1000)); 
                var dayOfThisDate = new Date(today);
                var date = { value : today.getDate(), classType : "normalDate",classTypeTemp : "normalDate" , icon:"" , day : dayOfThisDate, offDay : []};
                week.dateList.push(date); 
            }
            $scope.weekList.push(week);
        }

        for (var i = 0; i < todayInMonth+startDayOfThisMonthInWeek; i++) {
            var week = (i-(i%7))/7;
            var day = i%7;
            $scope.weekList[week].dateList[day].classType="passedDate";
            $scope.weekList[week].dateList[day].classTypeTemp = "passedDate";
        };

        $http.get('/api/stuff/offDate/'+$scope.stuff.cmnd)
        .success(function(data) {
            if(data==='object'||data.length==undefined){
                alert("Lỗi trong việc tải dữ liệu");
                return;
            }
            for(var i= 0;i<data.length;i++){

                var offDate = new Date(data[i].ngay);
                // difference month
                if(offDate.getUTCMonth() != thisMonth ){
                    continue;
                }
                // difference year
                if(offDate.getUTCFullYear()!= today.getUTCFullYear()){
                    continue;
                }
                 var numberOfDateBusyTemp = (offDate.getUTCDate()+startDayOfThisMonthInWeek);
                // if(offDate.getUTCMonth()==maxMonth){
                //     numberOfDateBusyTemp = (busyDate.getUTCDate()+dayNumberOfThisMonth - startDayInMonth)
                // }

                // // if is 31 th day in month
                // if(numberOfDateBusyTemp>=dayNumberOfCalendar){
                //     continue;
                // }
                var week = (numberOfDateBusyTemp-(numberOfDateBusyTemp%7))/7;
                if((numberOfDateBusyTemp%7)==0){
                    week-=1;
                }
                var day = offDate.getDay();
                console.log("week "+week +"  "+offDate.getUTCDate()+"   "+numberOfDateBusyTemp +"  "+startDayOfThisMonthInWeek);

                $scope.weekList[week].dateList[day].classType="busyDate";
                $scope.weekList[week].dateList[day].icon="fa fa-times fa-2x";
                if($scope.weekList[week].dateList[day].offDay.length>0){
                    $scope.weekList[week].dateList[day].offDay.splice(0,1);
                    $scope.weekList[week].dateList[day].offDay[0]=data[i];  
                }else{
                    $scope.weekList[week].dateList[day].offDay.push(data[i]);  
                }
                 
            }
            $scope.showDefault();
        })
        .error(function(data) {
            console.log('Error: ' + data);
            $scope.showError();
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

    $scope.showDetailOffDay = function(date){
        if(date.classType=="passedDate"){
            return;
        }

        $scope.dateForDetails = date;
        $scope.newOffDay.ngay = $scope.dateForDetails.day;
        $scope.newOffDay.cmnd = $scope.stuff.cmnd;
        $scope.newOffDay.loai = "Cả Ngày";
        $('#showOffDayDetailModal').modal('show');
    }

    function daysInThisMonth(month, year) {

        return new Date(year, month, 0).getDate();
    }

    $scope.saveNewOffTime = function(){
        
        // if($scope.option=="Chọn"){
        //     $scope.option="Lưu lại";
        //     $("#typeComboBox").removeAttr('disabled');
        //     return;
        // }

        $scope.newOffDay.ngay.setHours(7);
        $scope.newOffDay.ngay.setMinutes(0);
        $scope.newOffDay.ngay.setSeconds(0);

        $http.post('api/stuff/addOffDate',$scope.newOffDay)
        .success(function(data){
            console.log(data);
            
            if(data==undefined || data.cmnd == undefined){
                alert('Có lỗi xảy ra, vui lòng thử lại');
                return;
            }
            $scope.dateForDetails.classType="busyDate";
            $scope.dateForDetails.icon="fa fa-times fa-2x";
            if($scope.dateForDetails.offDay.length>0){
                    $scope.dateForDetails.offDay.splice(0,1);
                    $scope.dateForDetails.offDay[0]=data;  
            }else{
                $scope.dateForDetails.offDay.push(data);  
            }
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        })
        .error(function(data){
            alert('Có lỗi xảy ra, vui lòng thử lại');
            console.log(data);
        });

    }

    $scope.deleteOffDay = function(offDate){


        $http.delete('/api/stuff/deleteOffDate/' + offDate._id)
            
            .success(function(data){
                console.log(data);
                 if(data.success != undefined && data.success != false){
                    $scope.dateForDetails.offDay.splice(0,1);
                    $scope.dateForDetails.classType=$scope.dateForDetails.classTypeTemp;
                    $scope.dateForDetails.icon="";
                 }
                 else{
                    alert("Xóa lịch nghỉ của nhân viên thất bại");
                 }
             })
            .error(function(data){
                alert("Xóa lịch nghỉ của nhân viên thất bại");
            });
    }

};