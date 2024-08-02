function DashboardCtrl($filter,$scope,$http,$location, $rootScope){
    
    Number.prototype.format = function(n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    };

    // dashboard by month range

    $scope.initDashboardByMonthChooser = function(startDate, endDate){

            $("#dashboardByMonthRangeFromChooser").datepicker({ 
           changeMonth: true,
           changeYear: true,
           showButtonPanel: true,
           dateFormat: 'MM yy',
           showDate:null,            
           onClose: function(dateText, inst) { 
               var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
               var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();             
               $(this).datepicker('setDate', new Date(year, month, 1));
           },
           beforeShow : function(input, inst) {
                $('#ui-datepicker-div').addClass('hideDate');
                $(".ui-datepicker-title .ui-datepicker-month").addClass('test');

           //     if ((datestr = $(this).val()).length > 0) {
           //         year = datestr.substring(datestr.length-4, datestr.length);
           //         month = jQuery.inArray(datestr.substring(0, datestr.length-5), $(this).datepicker('option', 'monthNames'));
           //         $(this).datepicker('option', 'defaultDate', new Date(year, month, 1));
           //         $(this).datepicker('setDate', new Date(year, month, 1));    
           //     }
           //     var other = this.id == "from" ? "#to" : "#from";
           //     var option = this.id == "from" ? "maxDate" : "minDate";        
           //     if ((selectedDate = $(other).val()).length > 0) {
           //         year = selectedDate.substring(selectedDate.length-4, selectedDate.length);
           //         month = jQuery.inArray(selectedDate.substring(0, selectedDate.length-5), $(this).datepicker('option', 'monthNames'));
           //         $(this).datepicker( "option", option, new Date(year, month, 1));
           //     }
           },
           afterShow:function(input, inst) {
                $(".ui-datepicker-title .ui-datepicker-month").addClass('test');
            }
       });

        $scope.timePicker = $("#dashboardByMonthRangeFromChooser").daterangepicker({
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
            }
            ],
            dateFormat :"mm/yy",
            setDate:null

        });
        var defaultTimeRange = [];
        defaultTimeRange['start']=startDate;
        defaultTimeRange['end'] = endDate;
        //$("#dashboardByMonthRangeFromChooser").daterangepicker("setRange",defaultTimeRange);
    }




    // column chart with service

    $scope.loadingDataColumnChartWithService = true;
    $scope.noDataForColumnChartWithService = false;
    $scope.serviceData = [];
    $scope.columnChartWithServiceTimeRange = [];
    $scope.serviceDataTotal;
    $scope.columnChartWithServiceData = {
        startDate:"",
        endDate:"",
        title:"",
        subTitle:"",
        xAxis:"",
        yAxis:"",
        format:"",
        headerFormat:"",
        pointFormat:"",
        name:"",
        series:[]
    }

    $scope.initTimeRangeChartByServiceChooser = function(startDate, endDate){
        $scope.timePicker = $("#timeRangeChartByServiceChooser").daterangepicker({
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
            }
            ],
            dateFormat :"dd/mm/yy"

        });
        var defaultTimeRange = [];
        defaultTimeRange['start']=startDate;
        defaultTimeRange['end'] = endDate;
        $("#timeRangeChartByServiceChooser").daterangepicker("setRange",defaultTimeRange);
    }

    $scope.loadColumnChartWithServiceData  = function(){
        $scope.columnChartWithServiceData.startDate = new Date($scope.columnChartWithServiceTimeRange['start']);
        $scope.columnChartWithServiceData.endDate = new Date($scope.columnChartWithServiceTimeRange['end']);
        $scope.columnChartWithServiceData.endDate.setTime($scope.columnChartWithServiceData.endDate.getTime() + (24*60*60*1000));
        $scope.columnChartWithServiceData.startDate.setUTCHours(0);
        $scope.columnChartWithServiceData.endDate.setUTCHours(0);
        $http.post('/api/dashboard/loadServiceData',{startDate:$scope.columnChartWithServiceData.startDate, endDate:$scope.columnChartWithServiceData.endDate})
            .success( function (data){
                if(data.success == false){
                    alert("Lỗi trong việc tải dữ liệu");
                    return;
                }
                $scope.serviceData = [];
                $scope.serviceDataTotal = data[data.length-1];
                $scope.serviceData = data;
                $scope.serviceData.splice(data.length-1, 1);
                $scope.parseDataToServiceColumnChartSeriesData();
            })
            .error( function (err){
                console.log(err);
            });
    }

    $scope.parseDataToColumnServiceChartElement = function(name, data, drilldown){
        return {
                name: name,
                y: data,
                drilldown: drilldown
            }
    }

    $scope.parseDataToServiceColumnChartSeriesData = function(){
        if($scope.serviceData.length == 0){
            $scope.noDataForColumnChartWithService = true;
            $scope.loadingDataColumnChartWithService = false;
            $('#columnChartWithServiceOuter').hide();
            return;
        }
        $scope.serviceData.sort(function (a, b) {
            if (a.request > b.request) {
                return 1;
            }
            if (a.request < b.request) {
                return -1;
            }
            return 0;
        });
        var seriesTemp = [];
        for (var i = 0; i < $scope.serviceData.length; i++) {
            seriesTemp.push($scope.parseDataToColumnServiceChartElement($scope.serviceData[i].loaidichvu, $scope.serviceData[i].request, $scope.serviceData[i].quan));
        };
        $scope.columnChartWithServiceData.series = seriesTemp;

        $scope.columnChartWithServiceData.title = "Số lượng đơn hàng sử dụng các dịch vụ";
        if($scope.columnChartWithServiceTimeRange['start'].getTime() == $scope.columnChartWithServiceTimeRange['end'].getTime()){
            $scope.columnChartWithServiceData.subtitle = "Ngày "+$scope.columnChartWithServiceTimeRange['start'].getDate()+"/"+($scope.columnChartWithServiceTimeRange['start'].getMonth()+1)+"/"+$scope.columnChartWithServiceTimeRange['start'].getFullYear();
        }else{
            $scope.columnChartWithServiceData.subtitle = "Thời gian từ ngày "+$scope.columnChartWithServiceTimeRange['start'].getDate()+"/"+($scope.columnChartWithServiceTimeRange['start'].getMonth()+1)+"/"+$scope.columnChartWithServiceTimeRange['start'].getFullYear()+
            " đến ngày "+$scope.columnChartWithServiceTimeRange['end'].getDate()+"/"+($scope.columnChartWithServiceTimeRange['end'].getMonth()+1)+"/"+$scope.columnChartWithServiceTimeRange['end'].getFullYear();
        }
        $scope.columnChartWithServiceData.xAxis = 'category';
        $scope.columnChartWithServiceData.yAxis = "Số lượng đơn hàng sử dụng dịch vụ";
        $scope.columnChartWithServiceData.format = '{point.y} đơn hàng';
        $scope.columnChartWithServiceData.headerFormat = '<span style="font-size:11px">Loại dịch vụ :</span><br>';
        $scope.columnChartWithServiceData.pointFormat = '<span style="color:{point.color} ">{point.name}: </span><b>{point.y} đơn hàng</b> trong tổng số '+$scope.serviceDataTotal.totalRequest+'  đơn hàng<br/>';
        $scope.columnChartWithServiceData.name = "Số lượng đơn hàng";

        $scope.noDataForColumnChartWithService = false;
        $scope.loadingDataColumnChartWithService = false;
        $('#columnChartWithServiceOuter').fadeIn(500);
        $scope.initColumnChartWithService();
    }

    $scope.initColumnChartWithService = function(){
        $('#columnChartWithService').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: $scope.columnChartWithServiceData.title
            },
            subtitle: {
                text: $scope.columnChartWithServiceData.subtitle
            },
            xAxis: {
                type: $scope.columnChartWithServiceData.xAxis
            },
            yAxis: {
                title: {
                    text: $scope.columnChartWithServiceData.yAxis
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: $scope.columnChartWithServiceData.format
                    }
                }
            },

            tooltip: {
                headerFormat: $scope.columnChartWithServiceData.headerFormat,
                pointFormat: $scope.columnChartWithServiceData.pointFormat
            },

            series: [{
                name: $scope.columnChartWithServiceData.name,
                colorByPoint: true,
                data: $scope.columnChartWithServiceData.series
            }]
        });
    }




    /// pie chart with district 

    $scope.typeByDistrictList = ["Số lượng đơn hàng","Doanh thu"];
    $scope.dashboardTypeByDistrict ="Số lượng đơn hàng";
    $scope.loadingDataPieChartWithDistrict = true;
    $scope.noDataForPieChartWithDistrict = false;
    $scope.pieChartWithDistrictTimeRange = [];
    $scope.districtData = [];
    $scope.districtDataTotal;
    $scope.pieChartWithDistrictData = {
        startDate:"",
        endDate:"",
        title:"",
        subTitle:"",
        format:"",
        headerFormat:"",
        pointFormat:"",
        name:"",
        series:[]
    }
    $scope.initTimeRangeChartByDistrictChooser = function(startDate, endDate){
        $scope.timePicker = $("#timeRangeChartByDistrictChooser").daterangepicker({
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
                dateEnd:function(){return moment()}
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
            }
            ],
            dateFormat :"dd/mm/yy"

        });
        var defaultTimeRange = [];
        defaultTimeRange['start']=startDate;
        defaultTimeRange['end'] = endDate;
        $("#timeRangeChartByDistrictChooser").daterangepicker("setRange",defaultTimeRange);
    }
    
    $scope.$watch('dashboardTypeByDistrict',
        function handleDashboardTypeByDistrictChange(newValue, oldValue){

            if(newValue != oldValue && oldValue != undefined && oldValue != ""){
                if(newValue === "Số lượng đơn hàng"){
                    $scope.parseDataToDistrictPieChartSeriesDataByRequest();
                }else{
                    $scope.parseDataToDistrictPieChartSeriesDataByCost();
                }
                
            }

        });
    $scope.parseDataToPieChartElement = function(name, data,cost,totalCost, drilldown){
        return {
                name: name,
                y: data,
                cost:cost,
                totalCost:totalCost,
                drilldown: drilldown
            }
    }

    $scope.loadPieChartWithDistrictData  = function(){
        $scope.pieChartWithDistrictData.startDate = new Date($scope.pieChartWithDistrictTimeRange['start']);
        $scope.pieChartWithDistrictData.endDate = new Date($scope.pieChartWithDistrictTimeRange['end']);
        $scope.pieChartWithDistrictData.endDate.setTime($scope.pieChartWithDistrictData.endDate.getTime() + (24*60*60*1000));
        $scope.pieChartWithDistrictData.startDate.setUTCHours(0);
        $scope.pieChartWithDistrictData.endDate.setUTCHours(0);
        $http.post('/api/dashboard/newRequestByDistrict',{startDate:$scope.pieChartWithDistrictData.startDate, endDate:$scope.pieChartWithDistrictData.endDate})
            .success( function (data){
                if(data.success == false){
                    alert("Lỗi trong việc tải dữ liệu");
                    return;
                }
                $scope.districtData = [];
                $scope.districtDataTotal = data[data.length-1];
                $scope.districtData = data;
                $scope.districtData.splice(data.length-1, 1);
                if($scope.dashboardTypeByDistrict === "Số lượng đơn hàng"){
                    $scope.parseDataToDistrictPieChartSeriesDataByRequest();
                }else{
                    $scope.parseDataToDistrictPieChartSeriesDataByCost();
                }
            })
            .error( function (err){
                console.log(err);
            });
    }

    $scope.parseDataToDistrictPieChartSeriesDataByRequest = function(){
        if($scope.districtData.length == 0){
            $scope.noDataForPieChartWithDistrict = true;
            $scope.loadingDataPieChartWithDistrict = false;
            $('#pieChartWithDistrictOuter').hide();
            return;
        }
        $scope.districtData.sort(function (a, b) {
            if (a.request > b.request) {
                return 1;
            }
            if (a.request < b.request) {
                return -1;
            }
            return 0;
        });
        var seriesTemp = [];
        for (var i = 0; i < $scope.districtData.length; i++) {
            seriesTemp.push($scope.parseDataToPieChartElement($scope.districtData[i].quan, $scope.districtData[i].request, "","", $scope.districtData[i].quan));
        };
        $scope.pieChartWithDistrictData.series = seriesTemp;

        $scope.pieChartWithDistrictData.title = "Số lượng đơn hàng tính theo quận";
        if($scope.pieChartWithDistrictTimeRange['start'].getTime() == $scope.pieChartWithDistrictTimeRange['end'].getTime()){
            $scope.pieChartWithDistrictData.subtitle = "Ngày "+$scope.pieChartWithDistrictTimeRange['start'].getDate()+"/"+($scope.pieChartWithDistrictData.startDate.getMonth()+1)+"/"+$scope.pieChartWithDistrictTimeRange['start'].getFullYear();
        }else{
            $scope.pieChartWithDistrictData.subtitle = "Thời gian từ ngày "+$scope.pieChartWithDistrictTimeRange['start'].getDate()+"/"+($scope.pieChartWithDistrictTimeRange['start'].getMonth()+1)+"/"+$scope.pieChartWithDistrictTimeRange['start'].getFullYear()+
            " đến ngày "+$scope.pieChartWithDistrictTimeRange['end'].getDate()+"/"+($scope.pieChartWithDistrictTimeRange['end'].getMonth()+1)+"/"+$scope.pieChartWithDistrictTimeRange['end'].getFullYear();
        }
        $scope.pieChartWithDistrictData.format = '{point.name}: {point.y} đơn hàng';
        $scope.pieChartWithDistrictData.headerFormat = '<span style="font-size:11px">{series.name}</span><br>';
        $scope.pieChartWithDistrictData.pointFormat = '<span style="color:{point.color}">{point.name}</span>: <b>{point.y} đơn hàng</b> trong tổng số '+$scope.districtDataTotal.totalRequest+'  đơn hàng<br/>';
        $scope.pieChartWithDistrictData.name = "Số lượng đơn hàng";
        $scope.loadingDataPieChartWithDistrict = false;
        $scope.noDataForPieChartWithDistrict = false;
        $('#pieChartWithDistrictOuter').fadeIn(500);
        $scope.initPieChartWithDistrict();
    }

    $scope.parseDataToDistrictPieChartSeriesDataByCost = function(){
        if($scope.districtData.length == 0){
            $scope.noDataForPieChartWithDistrict = true;
            $scope.loadingDataPieChartWithDistrict = false;
            $('#pieChartWithDistrictOuter').hide();
            return;
        }
        $scope.districtData.sort(function (a, b) {
            if (a.chiphi > b.chiphi) {
                return 1;
            }
            if (a.chiphi < b.chiphi) {
                return -1;
            }
            return 0;
        });
        var seriesTemp = [];
        console.log($scope.districtDataTotal.totalCost);
        for (var i = 0; i < $scope.districtData.length; i++) {
            seriesTemp.push($scope.parseDataToPieChartElement($scope.districtData[i].quan, $scope.districtData[i].cost, $scope.districtData[i].cost.format(),$scope.districtDataTotal.totalCost.format(), $scope.districtData[i].quan));
        };
        $scope.pieChartWithDistrictData.series = seriesTemp;

        $scope.pieChartWithDistrictData.title = "Tổng chi phí của các đơn hàng tính theo quận";
        if($scope.pieChartWithDistrictTimeRange['start'].getTime() == $scope.pieChartWithDistrictTimeRange['end'].getTime()){
            $scope.pieChartWithDistrictData.subtitle = "Ngày "+$scope.pieChartWithDistrictTimeRange['start'].getDate()+"/"+($scope.pieChartWithDistrictTimeRange['start'].getMonth()+1)+"/"+$scope.pieChartWithDistrictTimeRange['start'].getFullYear();
        }else{
            $scope.pieChartWithDistrictData.subtitle = "Thời gian từ ngày "+$scope.pieChartWithDistrictTimeRange['start'].getDate()+"/"+($scope.pieChartWithDistrictTimeRange['start'].getMonth()+1)+"/"+$scope.pieChartWithDistrictTimeRange['start'].getFullYear()+
            " đến ngày "+$scope.pieChartWithDistrictTimeRange['end'].getDate()+"/"+($scope.pieChartWithDistrictTimeRange['end'].getMonth()+1)+"/"+$scope.pieChartWithDistrictTimeRange['end'].getFullYear();
        }
        $scope.pieChartWithDistrictData.format = '{point.name}: {point.cost} VNĐ';
        $scope.pieChartWithDistrictData.headerFormat = '<span style="font-size:11px">{series.name}</span><br>';
        $scope.pieChartWithDistrictData.pointFormat = '<span style="color:{point.color}">{point.name}</span>: <b>{point.cost} VNĐ</b> trong tổng số {point.totalCost} VNĐ<br/>';
        $scope.pieChartWithDistrictData.name = "Tổng chi phí";
        $scope.loadingDataPieChartWithDistrict = false;
        $scope.noDataForPieChartWithDistrict = false;
        $('#pieChartWithDistrictOuter').fadeIn(500);
        $scope.initPieChartWithDistrict();
    }

    $scope.initPieChartWithDistrict = function(){
        $('#pieChartWithDistrict').highcharts({
        chart: {
            type: 'pie'
        },
        title: {
            text: $scope.pieChartWithDistrictData.title
        },
        subtitle: {
            text: $scope.pieChartWithDistrictData.subtitle
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: $scope.pieChartWithDistrictData.format
                }
            }
        },

        tooltip: {
            headerFormat: $scope.pieChartWithDistrictData.headerFormat,
            pointFormat: $scope.pieChartWithDistrictData.pointFormat
        },
        series: [{
                name: $scope.pieChartWithDistrictData.name,
                colorByPoint: true,
                data:$scope.pieChartWithDistrictData.series
            }]
        });
    }


    $scope.loadData = function(type){
        switch(type){
            case "PieChartWithDistrict":

                
                var jsonObj = JSON.parse($('#timeRangeChartByDistrictChooser').val());
                var startDateTemp = new Date(jsonObj.start);
                var endDateTemp = new Date(jsonObj.end);
                startDateTemp.setHours(0);
                endDateTemp.setHours(0);
                if($scope.pieChartWithDistrictTimeRange['start'].getTime() == startDateTemp.getTime() 
                    && $scope.pieChartWithDistrictTimeRange['end'].getTime() == endDateTemp.getTime()){
                    return;
                }
                $scope.pieChartWithDistrictTimeRange['start'] = new Date(startDateTemp);
                $scope.pieChartWithDistrictTimeRange['end'] = new Date(endDateTemp);
                if(startDateTemp.getTime() == endDateTemp.getTime()){
                    endDateTemp.setTime(endDateTemp.getTime() + (24*60*60*1000));
                }
                
                $scope.loadingDataPieChartWithDistrict = true;
                $scope.noDataForPieChartWithDistrict = false;
                $('#pieChartWithDistrictOuter').hide();
                $scope.loadPieChartWithDistrictData();
                break;

            case "ColumnChartWithService":

                
                var jsonObj = JSON.parse($('#timeRangeChartByServiceChooser').val());
                var startDateTemp = new Date(jsonObj.start);
                var endDateTemp = new Date(jsonObj.end);
                startDateTemp.setHours(0);
                endDateTemp.setHours(0);
                if($scope.columnChartWithServiceTimeRange['start'].getTime() == startDateTemp.getTime() 
                    && $scope.columnChartWithServiceTimeRange['end'].getTime() == endDateTemp.getTime()){
                    return;
                }
                $scope.columnChartWithServiceTimeRange['start'] = new Date(startDateTemp);
                $scope.columnChartWithServiceTimeRange['end'] = new Date(endDateTemp);
                if(startDateTemp.getTime() == endDateTemp.getTime()){
                    endDateTemp.setTime(endDateTemp.getTime() + (24*60*60*1000));
                }
                
                $scope.loadingDataColumnChartWithService = true;
                $scope.noDataForColumnChartWithService = false;
                $('#columnChartWithServiceOuter').hide();
                $scope.loadColumnChartWithServiceData();
                break;

        }
    }

    $(document).ready(function(){
        
        var startDate = new Date();
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        var endDate = new Date(startDate);
        startDate.setTime(startDate.getTime() - 6*(24*60*60*1000));

        $scope.pieChartWithDistrictTimeRange  = [];
        $scope.pieChartWithDistrictTimeRange['start'] = new Date(startDate);
        $scope.pieChartWithDistrictTimeRange['end'] = new Date(endDate);
        $scope.initTimeRangeChartByDistrictChooser(startDate, endDate);
        $scope.loadPieChartWithDistrictData();

        $scope.columnChartWithServiceTimeRange  = [];
        $scope.columnChartWithServiceTimeRange['start'] = new Date(startDate);
        $scope.columnChartWithServiceTimeRange['end'] = new Date(endDate);
        $scope.initTimeRangeChartByServiceChooser(startDate, endDate);
        $scope.loadColumnChartWithServiceData();

        $scope.initDashboardByMonthChooser(startDate,endDate);

    });



}