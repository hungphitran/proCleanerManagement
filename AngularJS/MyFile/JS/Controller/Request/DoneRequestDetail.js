function doneRequestDetailCtrl($scope,$http,doneRequestDetailService, $rootScope){
    
    $('#dataSection').hide();
    $scope.request = doneRequestDetailService.getRequest();
    $scope.listDetail = [];
    $scope.stuffInfo = {};
    $scope.requestDetail = {};
    $scope.helper = {};

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

    $scope.showStuffDetail = function(cmnd){
        $('#dataStuffInfo').hide();
        $('#showStuffDetail').modal('show');
        $http.get('api/stuff/find/'+cmnd)
        .success(function(data) {
            if(data.length == 0)
            {
                alert('error');
                return;
            }
            $scope.stuffInfo = data[0];
            $scope.stuffInfo.ngaysinh = new Date($scope.stuffInfo.ngaysinh);
            
            $('#loadDataStuffInfo').hide();
            $('#dataStuffInfo').fadeIn(500);

        })
        .error(function(data) {
            alert('loi');
            return;
        });
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


};