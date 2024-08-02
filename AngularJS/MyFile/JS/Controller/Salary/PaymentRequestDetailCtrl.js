function PaymentRequestDetailCtrl($scope,$http,PaymentRequestDetailService, $rootScope, $location){
    
    $('#dataSection').hide();
    $scope.request = PaymentRequestDetailService.getRequest();
    $scope.request.paymentType ="Nhân viên thu";
    $scope.listDetail = [];
    $scope.stuffInfo = {};
    $scope.requestDetail = {};
    $scope.helper = {};
    $scope.listPaymentType =["Nhân viên thu","Khách hàng chuyển khoản"];
    $scope.request.loaidichvuToShow = "";
    $http.get('api/requestDetail/findByYeuCau/'+$scope.request._id)
    .success(function(data) {
        if(data.length == 0)
        {
            $scope.showDefault();
            return;
        }
        console.log(data);
        $scope.listDetail = data;
        for (var i = 0; i < $scope.listDetail.length; i++) {
            $scope.listDetail[i].giobatdau = new Date($scope.listDetail[i].giobatdau);
            $scope.listDetail[i].gioketthuc = new Date($scope.listDetail[i].gioketthuc);
            $scope.listDetail[i].id = $scope.listDetail[i]._id;
        };
        for (var i = 0; i < $scope.listDetail.length; i++) {

            for (var j = i+1; j < $scope.listDetail.length; j++) {
                if($scope.listDetail[i].giobatdau.getTime() > $scope.listDetail[j].giobatdau.getTime() ){
                    var temp = $scope.listDetail[i];
                    $scope.listDetail[i] = $scope.listDetail[j];
                    $scope.listDetail[j] = temp;
                }
            };
        };

        $scope.request.loaidichvuToShow = $scope.request.loaidichvu[0];
        for (var i = 1; i < $scope.request.loaidichvu.length; i++) {
            $scope.request.loaidichvuToShow = $scope.request.loaidichvuToShow+ ' - '+$scope.request.loaidichvu[i];
        };

        $scope.showDefault();
    })
    .error(function(data) {
        alert('error');
        return;
    });

    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }

    $scope.printBill = function(){  
        $scope.createPdf();
    }
    $scope.showRequestDetail = function(requestDetail){
        $scope.requestDetail = requestDetail;
        $('#dataRequestDetail').hide();
        $('#loadDataRequestDetail').show();
        $('#showRequestDetail').modal('show');

        var star = $scope.convertNhanXet(requestDetail.nhanxet);
        $('.rating-value').val(star);
        SetRatingStar();

        $http.get('api/helper/find/'+$scope.requestDetail.nguoigiupviec)
        .success(function(data) {
            if(data.length == 0)
            {
                alert('error');
                return;
            }
            $scope.helper = data[0];
            $scope.helper.ngaysinh = new Date($scope.helper.ngaysinh);
            
            $('#loadDataRequestDetail').hide();
            $('#dataRequestDetail').fadeIn(500);

        })
        .error(function(data) {
            alert('loi');
            return;
        });

    }

    

    // star rating
    var $star_rating = $('.star-rating .fa');

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
        case "Rất kém":
            return "1";
            break;
        case "Kém":
            return "2";
            break;
        case "Trung bình":
            return "3";
            break;
        case "Tốt":
            return "4";
            break;
        case "Rất tốt":
            return "5";
            break;
      }
    }


    $scope.paymentConfirm = function(){
        $http.post('/api/request/payment',{
            _id:$scope.request._id,
            trangthai:"Đã thanh toán",
            hinhthuctt:$scope.request.paymentType})
        .success(function(data){
            console.log(data);
            if(data.success == true){
                $scope.request.trangthai = "Đã thanh toán";
                $('#confirmPayment').modal('hide');
            }else{
                alert("Xác nhận thanh toán thất bại, vui lòng thử lại");
                return;
            }
        })
        .error(function(data){
            alert("Xác nhận thanh toán thất bại, vui lòng thử lại");
            return;
        });
    }

    $scope.payment = function(){
        $('#confirmPayment').modal('show');
    }



    $scope.createPdf = function(){


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
                '\nHÓA ĐƠN DỊCH VỤ'
            ],
            fontSize: 28,
            bold: true,
            alignment: 'center'
        }
        var paymentDate = {
            text:[
                '\nTP.Hồ Chí Minh, ngày ... tháng ... năm ....\n\n'
            ],
            fontSize: 10,
            alignment: 'right'
        }
        var loaidichvu = $scope.request.loaidichvu[0];
        for (var i = 1; i < $scope.request.loaidichvu.length; i++) {
            loaidichvu = loaidichvu+ ' - '+$scope.request.loaidichvu[i];
        };
        var tongsogiolam = $scope.request.chiphi/$scope.request.giachuan;
        var tongchiphi = $scope.request.chiphingoaigio+$scope.request.chiphi+$scope.request.phithoathuan;
        var customerInfo ={};
        if($scope.request.phithoathuan>0){
                customerInfo = {
                    text:[
                        '\nHọ và tên khách hàng :     '+$scope.request.hoten+'\n',
                        '\nSố điện thoại :     '+$scope.request.sdtkhachhang+'\n',
                        '\nĐịa chỉ :     '+$scope.request.diachi+' - '+$scope.request.quan+'\n',
                        '\nNgày đặt yêu cầu :    '+$scope.request.ngaydatyeucau.getUTCDate()+' / '+($scope.request.ngaydatyeucau.getMonth()+1)+' / '+$scope.request.ngaydatyeucau.getFullYear()+'                                     Loại yêu cầu : '+$scope.request.loaiyeucau+'\n',
                        '\nLoại dịch vụ :     '+loaidichvu+'\n',
                        '\nChi phí cơ bản :     '+$scope.request.chiphi.format()+' VNĐ    ( '+tongsogiolam+' Giờ  -  '+$scope.request.giachuan.format()+' VNĐ / 1 Giờ )'+'\n',
                        '\nChi phí ngoài giờ :     '+$scope.request.chiphingoaigio.format()+' VNĐ    ( '+$scope.request.sogiongoaigio+' Giờ  -  '+$scope.request.phingoaigio+' % Giá chuẩn )'+'\n',
                        '\nChi phí thỏa thuận :     '+$scope.request.phithoathuan.format()+' VNĐ    '+'\n',
                        '\nTổng chi phí :     '+tongchiphi.format()+' VNĐ\n',
                        '\n\nChi tiết thời gian làm việc của đơn hàng\n\n',
                    ],
                    alignment: '20'
                }
        }else{
                customerInfo = {
                    text:[
                        '\nHọ và tên khách hàng :     '+$scope.request.hoten+'\n',
                        '\nSố điện thoại :     '+$scope.request.sdtkhachhang+'\n',
                        '\nĐịa chỉ :     '+$scope.request.diachi+' - '+$scope.request.quan+'\n',
                        '\nNgày đặt yêu cầu :    '+$scope.request.ngaydatyeucau.getUTCDate()+' / '+($scope.request.ngaydatyeucau.getMonth()+1)+' / '+$scope.request.ngaydatyeucau.getFullYear()+'                                     Loại yêu cầu : '+$scope.request.loaiyeucau+'\n',
                        '\nLoại dịch vụ :     '+loaidichvu+'\n',
                        '\nChi phí cơ bản :     '+$scope.request.chiphi.format()+' VNĐ    ( '+tongsogiolam+' Giờ  -  '+$scope.request.giachuan.format()+' VNĐ / 1 Giờ )'+'\n',
                        '\nChi phí ngoài giờ :     '+$scope.request.chiphingoaigio.format()+' VNĐ    ( '+$scope.request.sogiongoaigio+' Giờ  -  '+$scope.request.phingoaigio+' % Giá chuẩn )'+'\n',
                        '\nTổng chi phí :     '+tongchiphi.format()+' VNĐ\n',
                        '\n\nChi tiết thời gian làm việc của đơn hàng\n\n',
                    ],
                    alignment: '20'
                }
        }
        


        var requestDetailBody = [];
        requestDetailBody.push([{ text: 'Giờ Bắt Đầu',alignment: 'center', style: 'tableHeader' }, { text: 'Giờ Kết Thúc',alignment: 'center', style: 'tableHeader' }, { text: 'Ngày Làm',alignment: 'center', style: 'tableHeader' }]);
        for (var i = 0; i < $scope.listDetail.length; i++) {
            var dataTemp = [{text:$scope.listDetail[i].giobatdau.getUTCHours()+' : '+$scope.listDetail[i].giobatdau.getUTCMinutes() ,alignment: 'center',},{text:$scope.listDetail[i].gioketthuc.getUTCHours()+' : '+$scope.listDetail[i].gioketthuc.getUTCMinutes() ,alignment: 'center',},{text:$scope.listDetail[i].giobatdau.getUTCDate()+' / '+($scope.listDetail[i].giobatdau.getUTCMonth()+1)+' / '+$scope.listDetail[i].giobatdau.getUTCFullYear() ,alignment: 'center',}]
            requestDetailBody.push(dataTemp);
        };
        var requestDetailInfo = {
            table: {
                        widths: [ 170, 170, 170 ],
                        headerRows: 1,
                        alignment: 'center',
                        body: requestDetailBody
                }
        }

        var timeInfo = {
            text:[
                '\n\n...... Ngày : ... tháng : ... năm : ....                                             ...... Ngày : ... tháng : ... năm : ....\n',
            ],
        }
        var validateInfo = {
            text:[
                '\n             Khách hàng :                                                                         Nhân viên thu :',
                
            ],
            margin: [60, 0]
        }
        

        billContent.push(companyInfo);
        billContent.push(billName);
        billContent.push(paymentDate);
        billContent.push(customerInfo);
        billContent.push(requestDetailInfo);
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