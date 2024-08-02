function staffSalaryListCtrl($scope,$http,$location,editStuffService, $rootScope){

    $('#dataSection').hide();
    var today = new Date();
    $scope.staffList = {};
    $scope.staffListOriginal ={};
    $scope.page ='list';
    $scope.print = false;
    $scope.salaryTitle = "Bảng lương nhân viên từ đầu tháng đến nay";

    $scope.searchText = "";
    $scope.typeSearch = "all";
    $scope.staffSalaryDetail={};

    $scope.listMonth = [1,2,3,4,5,6,7,8,9,10,11,12];
    $scope.chooseTimeInfo = {
        month:today.getMonth(),
        year:today.getFullYear()
    }

    $scope.showMonth = false;
    $scope.chooseMonth = false;
    $scope.chooseTimeRange = "Đầu tháng đến nay";
    $scope.typeOfTime = ["Đầu tháng đến nay" , "Xem theo tháng"];

    $scope.tieuchiSearch = [" Tất Cả "," CMND "," Họ Tên "," Điện Thoại ","Lương Cơ Bản","Số Ngày Nghỉ","Lương Thực Tế"];

    $scope.loadData = function(startDate,endDate){
        $('#dataSection').hide();
        $('#loadDataSection').fadeIn(500);
        $http.post('/api/staff/listSalary',{startDate:startDate,endDate:endDate})
        .success(function(data) {
            console.log(data);
            $scope.staffListOriginal = data;

            for (var i = 0; i < $scope.staffListOriginal.length; i++) {
                $scope.staffListOriginal[i].ngaysinh = new Date($scope.staffListOriginal[i].ngaysinh);
                $scope.staffListOriginal[i].ngaylamviec = new Date($scope.staffListOriginal[i].ngaylamviec);
                for(var j=0;j<$scope.staffListOriginal[i].listOffDate.length;j++){
                    $scope.staffListOriginal[i].listOffDate[j].ngay = new Date($scope.staffListOriginal[i].listOffDate[j].ngay );
                }

                for (var h = 0; h < $scope.staffListOriginal[i].listOffDate.length; h++) {

                    for (var k = h+1; k < $scope.staffListOriginal[i].listOffDate.length; k++) {
                        if($scope.staffListOriginal[i].listOffDate[h].ngay.getTime() > $scope.staffListOriginal[i].listOffDate[k].ngay.getTime() ){
                            var temp = $scope.staffListOriginal[i].listOffDate[h];
                            $scope.staffListOriginal[i].listOffDate[h] = $scope.staffListOriginal[i].listOffDate[k];
                            $scope.staffListOriginal[i].listOffDate[k] = temp;
                        }
                    };
                };
            };
            $scope.staffList = $scope.staffListOriginal;

            $scope.searchText="";
            if($scope.showMonth == true){
                $scope.print = true;
                $scope.salaryTitle = "Bảng lương nhân viên tháng "+$scope.chooseTimeInfo.month+" năm "+$scope.chooseTimeInfo.year;
            }else{
                $scope.salaryTitle = "Bảng lương nhân viên từ đầu tháng đến nay";
            }
            
            $scope.showDefault();
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    }

    $scope.showSalary = function(){
        $scope.print = false;
        var startDate = new Date();
        var endDate = new Date();
        startDate.setDate(1);
        startDate.setHours(7);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);

        endDate.setHours(7);
        endDate.setMinutes(0);
        endDate.setSeconds(0);
        endDate.setMilliseconds(0);
        if($scope.chooseMonth == true){
            if($scope.chooseTimeInfo.year<2015
                ||$scope.chooseTimeInfo.year>startDate.getFullYear()
                ||($scope.chooseTimeInfo.year==startDate.getFullYear() && $scope.chooseTimeInfo.month>startDate.getMonth())){
                alert("Không có dữ liệu trong khoảng thời gian này");
                return;
            }
            
            startDate.setMonth($scope.chooseTimeInfo.month-1);
            startDate.setFullYear($scope.chooseTimeInfo.year);

            endDate.setFullYear($scope.chooseTimeInfo.year);
            endDate.setMonth($scope.chooseTimeInfo.month-1);
            endDate.setDate(daysInThisMonth($scope.chooseTimeInfo.month, $scope.chooseTimeInfo.year)+1);
            $scope.showMonth = true;

        }
        //console.log(endDate);
        //console.log(daysInThisMonth($scope.chooseTimeInfo.month, $scope.chooseTimeInfo.year));
        $scope.loadData(startDate,endDate);

    }
    $(document).ready(function(){
        $scope.showSalary();
    });
    

    $scope.paymentSalary = function(staffSalary){
        alert("Xác nhận thanh toán lương");
        $http.post('/api/staff/paymentSalary',{
                startDate:staffSalary.startDate,
                endDate:staffSalary.endDate,
                cmnd:staffSalary.cmnd,
                trangthai:"Đã thanh toán"})
            .success(function(data){
                console.log(data);
                if(data.success == false){
                    alert("Thanh toán lương thất bại, vui lòng thử lại");
                }else{
                    staffSalary.trangthai = "Đã thanh toán";
                }
            })
            .error(function(data){
                alert("Thanh toán lương thất bại, vui lòng thử lại")
            });
    }

    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }
        
    $scope.search = function(newValue){
        var tempResult = [];
        switch($scope.typeSearch){
        case " Tất Cả ":
            for(var i=0;i<$scope.staffListOriginal.length;i++)
            {
                if($scope.staffListOriginal[i].hoten.toUpperCase().indexOf(newValue.toUpperCase())>-1 
                    ||($scope.staffListOriginal[i].cmnd+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||($scope.staffListOriginal[i].sodt+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||($scope.staffListOriginal[i].quequan.toUpperCase().indexOf(newValue.toUpperCase()))>-1
                    ||($scope.staffListOriginal[i].luong+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||($scope.staffListOriginal[i].offDate+"").toUpperCase().indexOf(newValue.toUpperCase())>-1
                    ||($scope.staffListOriginal[i].salary+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.staffListOriginal[i]);  
                }
            }
            $scope.staffList = tempResult;
            break;
        case " CMND ":
            for(var i=0;i<$scope.staffListOriginal.length;i++)
            {
                if(($scope.staffListOriginal[i].cmnd+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.staffListOriginal[i]);  
                }
            }
            $scope.staffList = tempResult;
            break;
        case " Điện Thoại ":
            for(var i=0;i<$scope.staffListOriginal.length;i++)
            {
                if(($scope.staffListOriginal[i].sodt+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.staffListOriginal[i]);  
                }
            }
            $scope.staffList = tempResult;
            break;
        case " Họ Tên ":
            for(var i=0;i<$scope.staffListOriginal.length;i++)
            {
                if($scope.staffListOriginal[i].hoten.toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.staffListOriginal[i]);  
                }
            }
            $scope.staffList = tempResult;
            break;
        case "Lương Cơ Bản":
            for(var i=0;i<$scope.staffListOriginal.length;i++)
            {
                if(($scope.staffListOriginal[i].luong+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.staffListOriginal[i]);  
                }
            }
            $scope.staffList = tempResult;
            break;

        case "Số Ngày Nghỉ":
            for(var i=0;i<$scope.staffListOriginal.length;i++)
            {
                if(($scope.staffListOriginal[i].offDate+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.staffListOriginal[i]);  
                }
            }
            $scope.staffList = tempResult;
            break;
        case "Lương Thực Tế":
            for(var i=0;i<$scope.staffListOriginal.length;i++)
            {
                if(($scope.staffListOriginal[i].salary+"").toUpperCase().indexOf(newValue.toUpperCase())>-1)
                {
                    tempResult.push($scope.staffListOriginal[i]);  
                }
            }
            $scope.staffList = tempResult;
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

    $scope.$watch("chooseTimeRange",
        function handleChooseTimeRangeChange(newValue, oldValue){
            if($scope.chooseMonth == true && newValue=="Đầu tháng đến nay"){
                $scope.chooseMonth = false;
                if($scope.showMonth == true){

                    $scope.showSalary();
                    $scope.showMonth = false;
                }
                
            }
            if($scope.chooseMonth == false &&newValue=="Xem theo tháng"){
                $scope.chooseMonth = true;
            }
    });

    $scope.printSalaryOfAllStaff = function(){



        var billContent = [];

        var companyInfo = {
            text:[
                '\n\tCông ty CP Thương mại và Dịch vụ Giúp Việc 3T\n',
                '\tĐịa chỉ : 216 Nguyễn Thị Minh Khai, Q.3, TP.HCM\n',
                '\tSố điện thoại : 08 3930 5057 - 08 3930 5058\n',
                '\tMã số Thuế : 0313545474\n'
            ],
            alignment: 'justify'
        }
        var billName = {
            text:[
                '\nPHIẾU LƯƠNG NHÂN VIÊN \nTHÁNG '+$scope.chooseTimeInfo.month+'/'+$scope.chooseTimeInfo.year
            ],
            fontSize: 28,
            bold: true,
            alignment: 'center'
        }
        var printDate = {
            text:[
                '\nTP.Hồ Chí Minh, ngày ... tháng ... năm ......\n\n'
            ],
            fontSize: 10,
            alignment: 'right'
        }
        var salaryTableBody = [];
        salaryTableBody.push([
                { text: 'CMND',alignment: 'center', style: 'tableHeader' },
                { text: 'Họ Tên',alignment: 'center', style: 'tableHeader' },
                { text: 'Điện Thoại',alignment: 'center', style: 'tableHeader' },
                { text: 'Lương Cơ Bản',alignment: 'center', style: 'tableHeader' },
                { text: 'Số Ngày Nghỉ',alignment: 'center', style: 'tableHeader' },
                { text: 'Lương Thực Tế',alignment: 'center', style: 'tableHeader' }]);

        for (var i = 0; i < $scope.staffListOriginal.length; i++) {
            var dataTemp = [
                {text:$scope.staffListOriginal[i].cmnd+"" ,alignment: 'center',margin: [0, 10, 0, 10]},
                {text:$scope.staffListOriginal[i].hoten+"" ,alignment: 'center',margin: [0, 10, 0, 10]},
                {text:$scope.staffListOriginal[i].sodt+"" ,alignment: 'center',margin: [0, 10, 0, 10]},
                {text:$scope.staffListOriginal[i].luong.format()+"" ,alignment: 'center',margin: [0, 10, 0, 10]},
                {text:$scope.staffListOriginal[i].offDate+"" ,alignment: 'center',margin: [0, 10, 0, 10]},
                {text:$scope.staffListOriginal[i].salary.format()+"" ,alignment: 'center',margin: [0, 10, 0, 10]}]
            salaryTableBody.push(dataTemp);
        };
        var requestDetailInfo = {
            table: {
                        //widths: [ //, 170, 170 ],
                        headerRows: 1,
                        alignment: 'center',
                        body: salaryTableBody
                }
        }

        billContent.push(companyInfo);
        billContent.push(billName);
        billContent.push(printDate);
        billContent.push(requestDetailInfo);
        var docDefinition = {
            content:billContent
        }

        pdfMake.createPdf(docDefinition).open();
    }

    $scope.printStaffSalaryBill = function(){

        var billContent = [];

        var companyInfo = {
            text:[
                '\n\tCông ty CP Thương mại và Dịch vụ Giúp Việc 3T\n',
                '\tĐịa chỉ : 216 Nguyễn Thị Minh Khai, Q.3, TP.HCM\n',
                '\tSố điện thoại : 08 3930 5057 - 08 3930 5058\n',
                '\tMã số Thuế : 0313545474\n'
            ],
            alignment: 'justify'
        }
        var billName = {
            text:[
                '\nPHIẾU LƯƠNG NHÂN VIÊN \nTHÁNG '+$scope.chooseTimeInfo.month+'/'+$scope.chooseTimeInfo.year
            ],
            fontSize: 28,
            bold: true,
            alignment: 'center'
        }
        var printDate = {
            text:[
                '\nTP.Hồ Chí Minh, ngày ... tháng ... năm ....'
            ],
            fontSize: 10,
            alignment: 'right'
        }
        var staffInfo = {
            text:[
                '\n\tHọ và tên nhân viên :     '+$scope.staffSalaryDetail.hoten+'\n',
                '\n\tSố chứng minh nhân dân :     '+$scope.staffSalaryDetail.cmnd+'\n',
                '\n\tNgày sinh :    '+$scope.staffSalaryDetail.ngaysinh.getUTCDate()+' / '+($scope.staffSalaryDetail.ngaysinh.getMonth()+1)+' / '+$scope.staffSalaryDetail.ngaysinh.getFullYear()+'\n',
                '\n\tSố điện thoại :     '+$scope.staffSalaryDetail.sodt+'\n',
                '\n\tĐịa chỉ :     '+$scope.staffSalaryDetail.quequan+'\n',
                '\n\tLương cơ bản :     '+$scope.staffSalaryDetail.luong.format()+' VNĐ\n',
                '\n\tNgày bắt đầu làm việc :     '+$scope.staffSalaryDetail.ngaylamviec.getUTCDate()+' / '+($scope.staffSalaryDetail.ngaylamviec.getMonth()+1)+' / '+$scope.staffSalaryDetail.ngaylamviec.getFullYear()+'\n',
                '\n\tSố lượng ngày nghỉ :     '+$scope.staffSalaryDetail.offDate+' ngày\n',
                '\n\tLương thực tế :     '+$scope.staffSalaryDetail.salary.format()+' VNĐ\n',
                '\n\tChi tiết ngày nghỉ của nhân viên: \n\n'
            ],
            alignment: '20'
        }
        var offDateDetailBody = [];
        offDateDetailBody.push([
                {text: 'Ngày Nghỉ',alignment: 'center', style: 'tableHeader' },
                { text: 'Loại Nghỉ',alignment: 'center', style: 'tableHeader' }]);

        for (var i = 0; i < $scope.staffSalaryDetail.listOffDate.length; i++) {
            var dataTemp = [
                    {text:$scope.staffSalaryDetail.listOffDate[i].ngay.getUTCDate()+' / '+($scope.staffSalaryDetail.listOffDate[i].ngay.getMonth()+1)+' / '+$scope.staffSalaryDetail.listOffDate[i].ngay.getFullYear() ,alignment: 'center',margin: [0, 10, 0, 10]},
                    {text:$scope.staffSalaryDetail.listOffDate[i].loai,alignment: 'center',margin: [0, 10, 0, 10]}]
            
            offDateDetailBody.push(dataTemp);
        };
        var offDateDetailInfo = {
            table: {
                        widths: [ 250, 250],
                        headerRows: 1,
                        alignment: 'center',
                        body: offDateDetailBody
                }
        }

        var timeInfo = {
            text:[
                '\n\n...... Ngày : ... tháng : ... năm : ....                                             ...... Ngày : ... tháng : ... năm : ....\n',
            ],
        }
        var validateInfo = {
            text:[
                '\n             Nhân Viên :                                                                         Nhân viên thu :',
                
            ],
            margin: [60, 0]
        }
        

        billContent.push(companyInfo);
        billContent.push(billName);
        billContent.push(printDate);
        billContent.push(staffInfo);
        billContent.push(offDateDetailInfo);
        billContent.push(timeInfo);
        billContent.push(validateInfo);
        var docDefinition = {
            content:billContent
        }

        pdfMake.createPdf(docDefinition).open();

    }


    Number.prototype.format = function(n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    };


    $scope.showDetailSalary = function(staff){
        $scope.staffSalaryDetail = staff;
        $('#showSalaryDetailModal').modal('show');
    }
    function daysInThisMonth(month, year) {

        return new Date(year, month, 0).getDate();
    }

};