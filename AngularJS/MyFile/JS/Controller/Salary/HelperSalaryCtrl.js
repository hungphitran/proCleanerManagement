function ShowHelperSalaryListCtrl($filter,$scope,$http,$location, $rootScope){
    $('#dataSection').hide();
    $scope.helperList = {};
    $scope.helperListOriginal ={};
    $scope.helperSalaryDetail={};
    $scope.print = false;
    $scope.salaryTitle = "Bảng lương nhân viên từ đầu tháng đến nay";

    $scope.searchText = "";
    $scope.typeSearch = " CMND ";
    var today = new Date();
    $scope.listMonth = [1,2,3,4,5,6,7,8,9,10,11,12];
    $scope.chooseTimeInfo = {
        month:today.getMonth(),
        year:today.getFullYear()
    }

    $scope.showMonth = false;
    $scope.chooseMonth = false;
    $scope.chooseTimeRange = "Đầu tháng đến nay";
    $scope.typeOfTime = ["Đầu tháng đến nay" , "Xem theo tháng"];

    $scope.tieuchiSearch = [" CMND "," Họ Tên "," Điện Thoại "];

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
        endDate.setTime(endDate.getTime() + 24*60*60*1000);
        if($scope.chooseMonth == true){
            if($scope.chooseTimeInfo.year<2015
                ||$scope.chooseTimeInfo.year>startDate.getFullYear()
                ||($scope.chooseTimeInfo.year==startDate.getFullYear() && $scope.chooseTimeInfo.month>=startDate.getMonth()+1)){
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
     $scope.loadData = function(startDate,endDate){
        $('#dataSection').hide();
        $('#loadDataSection').fadeIn(500);
        $http.post('/api/helper/listHelperSalary',{startDate:startDate,endDate:endDate})
            .success(function(data) {
                console.log(data);
                $scope.helperListOriginal = data;

                for (var i = 0; i < $scope.helperListOriginal.length; i++) {
                    $scope.helperListOriginal[i].ngaysinh = new Date($scope.helperListOriginal[i].ngaysinh);
                    $scope.helperListOriginal[i].hinhanh = "public/images/ngv/"+$scope.helperListOriginal[i].hinhanh;
                    
                    $scope.helperListOriginal[i].ngaylamviec = new Date($scope.helperListOriginal[i].ngaylamviec);
                    for(var j=0;j<$scope.helperListOriginal[i].listWorkTime.length;j++){
                        $scope.helperListOriginal[i].listWorkTime[j].giobatdau = new Date($scope.helperListOriginal[i].listWorkTime[j].giobatdau );
                        $scope.helperListOriginal[i].listWorkTime[j].gioketthuc = new Date($scope.helperListOriginal[i].listWorkTime[j].gioketthuc );
                        
                    }
                    
                    for (var h = 0; h < $scope.helperListOriginal[i].listWorkTime.length; h++) {

                    for (var k = h+1; k < $scope.helperListOriginal[i].listWorkTime.length; k++) {
                        if($scope.helperListOriginal[i].listWorkTime[h].giobatdau.getTime() > $scope.helperListOriginal[i].listWorkTime[k].giobatdau.getTime() ){
                            var temp = $scope.helperListOriginal[i].listWorkTime[h];
                            $scope.helperListOriginal[i].listWorkTime[h] = $scope.helperListOriginal[i].listWorkTime[k];
                           $scope.helperListOriginal[i].listWorkTime[k] = temp;
                        }
                    };
                };
                    
                };  
                $scope.helperList = $scope.helperListOriginal;

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
    $(document).ready(function(){
        $scope.showSalary();
    });


    $scope.paymentSalary = function(helperSalary){
        $http.post('/api/helper/paymentSalary',{
                startDate:helperSalary.startDate,
                endDate:helperSalary.endDate,
                cmnd:helperSalary.cmnd,
                trangthai:"Đã thanh toán"})
            .success(function(data){
                console.log(data);
                if(data.success == false){
                    alert("Thanh toán lương thất bại, vui lòng thử lại");
                }else{
                    helperSalary.trangthai = "Đã thanh toán";
                }
            })
            .error(function(data){
                alert("Thanh toán lương thất bại, vui lòng thử lại")
            });
    }


    $scope.search = function(newValue){
        var tempResult = [];
        switch($scope.typeSearch){
        case " CMND ":
            for(var i=0;i<$scope.helperListOriginal.length;i++)
            {
                if(($scope.helperListOriginal[i].cmnd+"").indexOf(newValue)>-1)
                {
                    tempResult.push($scope.helperListOriginal[i]);  
                }
            }
            $scope.helperList = tempResult;
            break;
        case " Điện Thoại ":
            for(var i=0;i<$scope.helperListOriginal.length;i++)
            {
                if(($scope.helperListOriginal[i].sodt+"").indexOf(newValue)>-1)
                {
                    tempResult.push($scope.helperListOriginal[i]);  
                }
            }
            $scope.helperList = tempResult;
            break;
        case " Họ Tên ":
            for(var i=0;i<$scope.helperListOriginal.length;i++)
            {
                if($scope.helperListOriginal[i].hoten.indexOf(newValue)>-1)
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

    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }
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

    
   

        $scope.showDetailSalary = function(helper){
            $scope.helperSalaryDetail = helper;
            $('#showSalaryDetailModal').modal('show');
        }
        function daysInThisMonth(month, year) {

        return new Date(year, month, 0).getDate();
    }

    $scope.printSalaryOfAllHelper = function(){



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
                { text: 'Số Giờ Làm',alignment: 'center', style: 'tableHeader' },
                { text: 'Lương Thực Tế',alignment: 'center', style: 'tableHeader' }]);

        for (var i = 0; i < $scope.helperListOriginal.length; i++) {
            var dataTemp = [
                {text:$scope.helperListOriginal[i].cmnd+"" ,alignment: 'center',margin: [0, 10, 0, 10]},
                {text:$scope.helperListOriginal[i].hoten+"" ,alignment: 'center',margin: [0, 10, 0, 10]},
                {text:$scope.helperListOriginal[i].sodt+"" ,alignment: 'center',margin: [0, 10, 0, 10]},
                {text:$scope.helperListOriginal[i].workTimeTotal+"" ,alignment: 'center',margin: [0, 10, 0, 10]},
                {text:$scope.helperListOriginal[i].salary.format()+"" ,alignment: 'center',margin: [0, 10, 0, 10]}]
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

    $scope.printHelperSalaryBill = function(){

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
        var helperInfo = {
            text:[
                '\n\tHọ và tên người giúp việc :     '+$scope.helperSalaryDetail.hoten+'\n',
                '\n\tSố chứng minh nhân dân :     '+$scope.helperSalaryDetail.cmnd+'\n',
                '\n\tNgày sinh :    '+$scope.helperSalaryDetail.ngaysinh.getUTCDate()+' / '+($scope.helperSalaryDetail.ngaysinh.getMonth()+1)+' / '+$scope.helperSalaryDetail.ngaysinh.getFullYear()+'\n',
                '\n\tSố điện thoại :     '+$scope.helperSalaryDetail.sodt+'\n',
                '\n\tĐịa chỉ :     '+$scope.helperSalaryDetail.quequan+'\n',
                '\n\tLương cố định :     '+$scope.helperSalaryDetail.luongcodinh.format()+' VNĐ\n',
                '\n\tMức lương theo giờ :     '+$scope.helperSalaryDetail.mucluongtheogio.format()+' VNĐ\n',
                '\n\tNgày bắt đầu làm việc :     '+$scope.helperSalaryDetail.ngaylamviec.getUTCDate()+' / '+($scope.helperSalaryDetail.ngaylamviec.getMonth()+1)+' / '+$scope.helperSalaryDetail.ngaylamviec.getFullYear()+'\n',
                '\n\tSố lượng giờ làm :     '+$scope.helperSalaryDetail.workTimeTotal+' giờ\n',
                '\n\tLương thực tế :     '+$scope.helperSalaryDetail.salary.format()+' VNĐ\n',
                '\n\tChi tiết giờ làm việc của người giúp việc: \n\n'
            ],
            alignment: '20'
        }
        var offDateDetailBody = [];
        offDateDetailBody.push([
            { text: 'Giờ Bắt Đầu',alignment: 'center', style: 'tableHeader' },
            { text: 'Giờ Kết Thúc',alignment: 'center', style: 'tableHeader' },
            { text: 'Ngày Làm',alignment: 'center', style: 'tableHeader' }]);
        
        for (var i = 0; i < $scope.helperSalaryDetail.listWorkTime.length; i++) {
            var dataTemp = [
                    {text:$scope.helperSalaryDetail.listWorkTime[i].giobatdau.getUTCHours()+' : '+$scope.helperSalaryDetail.listWorkTime[i].giobatdau.getUTCMinutes() ,alignment: 'center',},
                    {text:$scope.helperSalaryDetail.listWorkTime[i].gioketthuc.getUTCHours()+' : '+$scope.helperSalaryDetail.listWorkTime[i].gioketthuc.getUTCMinutes() ,alignment: 'center',},
                    {text:$scope.helperSalaryDetail.listWorkTime[i].giobatdau.getUTCDate()+' / '+($scope.helperSalaryDetail.listWorkTime[i].giobatdau.getUTCMonth()+1)+' / '+$scope.helperSalaryDetail.listWorkTime[i].giobatdau.getUTCFullYear() ,alignment: 'center',}]
            
            offDateDetailBody.push(dataTemp);
        };
        var offDateDetailInfo = {
            table: {
                        widths: [ 170,170, 170],
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
        billContent.push(helperInfo);
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
};