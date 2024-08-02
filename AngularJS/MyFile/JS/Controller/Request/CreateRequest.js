function CreateRequestCtrl($scope, $rootScope, $http,$location,dateFilter,$rootScope) {

	$('#dataSection').hide();
	$scope.wrong = [false,false,false,false,false,false,false];
	$scope.today = new Date();
	$scope.today.setUTCHours(0);
	$scope.today.setUTCMinutes(0);
	$scope.today.setUTCSeconds(0);

	$scope.newRequest = {
		ngaydatyeucau : $scope.today,
	    ngaybatdau : null,
	    ngayketthuc : null,
	    chiphi : "",
	    nhanvienxuly : "",
	    sdtkhachhang : "",
	    hoten :"",
	    loaiyeucau : "Ngắn hạn",
	    loaidichvu : [],
	    trangthai : "",
	    diachi : "",
	    quan : "",
	    giobatdau :360,
	    gioketthuc :360,
        giachuan:0,
        sogiongoaigio:0,
        chiphingoaigio:0,
        phingoaigio:0,
        phithoathuan:0


	};
	$scope.listService = [];
	$scope.serviceTemp = {
		giachuan : 0,
		phuphi : "Không",
        phingoaigio:0
	};

	$scope.costTemp = {
		chiphi : 0,
		phuphi : "Không",
		chiphingoaigio :0,
        sogiongoaigio:0
	}

	$scope.nganhan = true;

	$scope.listDistrict = [];

	$scope.timeOption = ["360","390","420","450","480","510","540","570","600","630",
                         "660","690","720","750","780","810","840","870","900","930",
                         "960","990","1020","1050","1080","1110","1140","1170","1200"];


    $scope.initDatePicker = function(){

        $( "#datePickerNgayBatDau" ).datepicker({
          onSelect: function(dateText) {

            $scope.wrong[4] = false;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            var ngaybatdauTemp = new Date($(this).datepicker( 'getDate' ));
            $scope.newRequest.ngaybatdau = dateFilter(ngaybatdauTemp, 'yyyy-MM-dd');
            if(ngaybatdauTemp < $scope.today){
                $scope.wrong[4] = true;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
                return;
            }
            
            $scope.checkCost();
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
          } 
        });

        $( "#datePickerNgayBatDauTuNgay" ).datepicker({
          onSelect: function(dateText) {
            $scope.wrong[4] = false;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            var ngaybatdauTemp = new Date($(this).datepicker( 'getDate' ));
            $scope.newRequest.ngaybatdau = dateFilter(ngaybatdauTemp, 'yyyy-MM-dd');

            if(($scope.newRequest.ngayketthuc!=null 
                && ngaybatdauTemp >= $scope.newRequest.ngayketthuc)
                || ngaybatdauTemp < $scope.today){
                $scope.wrong[4] = true;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
                return;
            }
            $scope.checkCost();
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
          } 
        });

        $( "#datePickerNgayBatDauDenNgay" ).datepicker({
          onSelect: function(dateText) {
            $scope.wrong[4] = false;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            var ngayketthucTemp = new Date($(this).datepicker( 'getDate' ));
            $scope.newRequest.ngayketthuc = dateFilter(ngayketthucTemp, 'yyyy-MM-dd');

            if(($scope.newRequest.ngaybatdau!=null 
                && ngayketthucTemp <= $scope.newRequest.ngaybatdau)
                || ngayketthucTemp < $scope.today){
                $scope.wrong[4] = true;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
                return;
            }
            $scope.checkCost();
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
          } 
        });

    }

    $(document).ready(function(){
        $scope.initDatePicker();    
    });

    $scope.testChange = function(){
        alert("tt");
    }

	$http.get('/api/request/getDataForCreateRequest')
        .success(function(data) {
        	console.log(data);
            if(data.success === false){
            	alert("Error");
            }
            for (var i = 0; i < data.listDistrict.length; i++) {
            	$scope.listDistrict.push(data.listDistrict[i].tenquan);
            };
            $scope.newRequest.quan = $scope.listDistrict[0];
            $scope.listService = data.listService;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
            $scope.showDefault();
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.showDefault = function(){
        $('#loadDataSection').hide();
        $('#dataSection').fadeIn(500);
    }


    $scope.chooseService = function(name){
        var idx = $scope.newRequest.loaidichvu.indexOf(name);
        if (idx > -1) {
          $scope.newRequest.loaidichvu.splice(idx, 1);
          $scope.checkService();
        }
        else {
          $scope.newRequest.loaidichvu.push(name);
          $scope.checkService();
        }
        console.log($scope.newRequest.loaidichvu);
    }

    $scope.checkService = function(){

    	$scope.serviceTemp.giachuan = 0;
		$scope.serviceTemp.phuphi = "Không";
        $scope.serviceTemp.phingoaigio =0;

    	for (var i = 0; i < $scope.newRequest.loaidichvu.length; i++) {
    		for (var  j= 0; j < $scope.listService.length; j++) {
    			if($scope.newRequest.loaidichvu[i] == $scope.listService[j].tentieuchi){
    				if($scope.serviceTemp.giachuan<$scope.listService[j].giachuan){
    					$scope.serviceTemp.giachuan = $scope.listService[j].giachuan;
    				}
    				if($scope.listService[j].phuphi == "Có"){
    					$scope.serviceTemp.phuphi = $scope.listService[j].phuphi;
    				}
                    if($scope.serviceTemp.phingoaigio<$scope.listService[j].phingoaigiokh){
                        $scope.serviceTemp.phingoaigio = $scope.listService[j].phingoaigiokh;
                    }
    			}
    		};
    	};
    	$scope.checkCost();

    }

    $scope.checkCost =function(){
        if($scope.wrong[4]==true){
            $scope.costTemp = {
                    chiphi : 0,
                    phuphi : "Không",
                    chiphingoaigio :0,
                    sogiongoaigio:0
                }
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
                return;
        }
    	var giacobanTemp = $scope.serviceTemp.giachuan*(($scope.newRequest.gioketthuc-$scope.newRequest.giobatdau)/60);
    	var ngoaigiodau = 0;
        if((480 - $scope.newRequest.giobatdau ) > 0 ){
            ngoaigiodau = (480 - $scope.newRequest.giobatdau )/60;
        }
        if((480 - $scope.newRequest.gioketthuc ) > 0 ){
            ngoaigiodau -= (480 - $scope.newRequest.gioketthuc )/60;
        }
        var ngoaigiocuoi = 0;
        if(($scope.newRequest.gioketthuc - 1080) > 0 ){
            ngoaigiocuoi = ($scope.newRequest.gioketthuc - 1080)/60;
        }
        if(($scope.newRequest.giobatdau - 1080) > 0 ){
            ngoaigiocuoi -= ($scope.newRequest.giobatdau - 1080)/60;
        }
        $scope.costTemp.sogiongoaigio = ngoaigiodau + ngoaigiocuoi;
        $scope.costTemp.chiphingoaigio = ($scope.costTemp.sogiongoaigio * $scope.serviceTemp.giachuan * $scope.serviceTemp.phingoaigio)/100;

        if($scope.nganhan == false){
            if($scope.newRequest.ngaybatdau == null || $scope.newRequest.ngayketthuc == null){
                $scope.costTemp = {
                    chiphi : 0,
                    phuphi : "Không",
                    chiphingoaigio :0,
                    sogiongoaigio:0
                }
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
                return;
            }
    		var ngaybatdauTemp = new Date($scope.newRequest.ngaybatdau);
        	var ngayketthucTemp = new Date($scope.newRequest.ngayketthuc);
            var songay = ((ngayketthucTemp.getTime()-ngaybatdauTemp.getTime())/(60*1000*60*24))+1;
    		giacobanTemp = giacobanTemp*(songay);
            $scope.costTemp.sogiongoaigio = $scope.costTemp.sogiongoaigio*(songay);
            $scope.costTemp.chiphingoaigio = $scope.costTemp.chiphingoaigio*(songay);

    	}
		$scope.costTemp.chiphi = giacobanTemp;
		$scope.costTemp.phuphi = $scope.serviceTemp.phuphi;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
	}

	$scope.$watch('nganhan', function (newValue,oldValue)
    {
    	$scope.checkCost();
    });


    $scope.$watch("newRequest.giobatdau",
        function handleGioBD( newValue, oldValue ) {

            if(newValue<=$scope.newRequest.gioketthuc-120 && ($scope.newRequest.gioketthuc - newValue)%60 == 0){
            	$scope.wrong[5] = false;
	    		$scope.newRequest.giobatdau = newValue;
	    		$scope.checkService();
	    	}else{
	    		$scope.wrong[5] = true;
	    	}
        }
    );

    $scope.$watch("newRequest.gioketthuc",
        function handleGioKT( newValue, oldValue ) {

            if($scope.newRequest.giobatdau<=newValue-120 && (newValue - $scope.newRequest.giobatdau)%60 == 0){
            	$scope.wrong[5] = false;
	    		$scope.newRequest.gioketthuc = newValue;
	    		$scope.checkService();

	    	}else{
	    		$scope.wrong[5] = true;
	    	}
        }
    );

    $scope.$watch("newRequest.loaiyeucau",
        function handleloaiyeucau( newValue, oldValue ) {
            if(newValue=="Ngắn hạn"){
            	$scope.nganhan = true;

	    	}else{
	    		$scope.nganhan = false;

	    	}
	    	$scope.newRequest.loaiyeucau = newValue;
        }
    );


	$scope.createRequest = function(){

		console.log($scope.serviceTemp);
        console.log($scope.costTemp);
		var error = false;
        for(var i=0;i<7;i++)
        {
            $scope.wrong[i] = false;
        }
        if($scope.newRequest.sdtkhachhang==undefined||$scope.newRequest.sdtkhachhang=="")
        {
           $scope.wrong[0] = true;
           error = true;
        }
        if($scope.newRequest.hoten==undefined || $scope.newRequest.hoten=="")
        {
           $scope.wrong[1] = true;
           error = true;
        }
        if($scope.newRequest.diachi==undefined || $scope.newRequest.diachi=="")
        {
           $scope.wrong[2] = true;
           error = true;
        }
        if($scope.newRequest.loaidichvu==undefined || $scope.newRequest.loaidichvu.length==0 ||$scope.newRequest.loaidichvu=="")
        {
           $scope.wrong[3] = true;
           error = true;
        }
        ///alert($scope.newRequest.ngaybatdau);
        ////////// not done yet
        $scope.newRequest.ngaybatdau = new Date($scope.newRequest.ngaybatdau);
        $scope.newRequest.ngayketthuc = new Date($scope.newRequest.ngayketthuc);
	    if($scope.newRequest.ngaybatdau==null || $scope.newRequest.ngaybatdau <= $scope.today)
	    {
	       $scope.wrong[4] = true;
	       error = true;
	    }
	    if($scope.nganhan==false 
	    	&& ($scope.newRequest.ngaybatdau.getUTCDate() >= $scope.newRequest.ngayketthuc.getUTCDate())
	    	&& ($scope.newRequest.ngaybatdau.getUTCMonth() == $scope.newRequest.ngayketthuc.getUTCMonth())
	    	&& ($scope.newRequest.ngaybatdau.getUTCFullYear() == $scope.newRequest.ngayketthuc.getUTCFullYear()))
	    {
	       $scope.wrong[4] = true;
	       error = true;
	    }
	    ///alert($scope.newRequest.gioketthuc+"  "+$scope.newRequest.giobatdau);
        ////////// not done yet
        if($scope.newRequest.giobatdau==undefined 
        	|| $scope.newRequest.gioketthuc==undefined
        	||$scope.newRequest.giobatdau>$scope.newRequest.gioketthuc-120)
        {
           $scope.wrong[5] = true;
           error = true;
        }
        if(error == true)
        {
           $scope.wrong[6] = true;
           return;
        }
        for(var i=1;i<7;i++)
        {
           $scope.wrong[i] = false;
        }

        //////
        $scope.newRequest.ngaydatyeucau = new Date();
        $scope.newRequest.ngaydatyeucau.setHours(7);
        $scope.newRequest.ngaydatyeucau.setSeconds(0);
        $scope.newRequest.ngaydatyeucau.setMinutes(0);
        $scope.newRequest.ngaydatyeucau.setMilliseconds(0);
        if($scope.nganhan==true){
        	$scope.newRequest.ngayketthuc = $scope.newRequest.ngaybatdau;
        }
        if($scope.costTemp.phuphi!="Không"){
        	$scope.newRequest.trangthai = "Chờ thỏa thuận";
        } else{
        	$scope.newRequest.trangthai = "Chưa tiến hành";
        }
        $scope.newRequest.chiphi = $scope.costTemp.chiphi;
        $scope.newRequest.chiphingoaigio = $scope.costTemp.chiphingoaigio;
        $scope.newRequest.sogiongoaigio = $scope.costTemp.sogiongoaigio;
        $scope.newRequest.phingoaigio = $scope.serviceTemp.phingoaigio;
        $scope.newRequest.giachuan = $scope.serviceTemp.giachuan;
        $http.post('api/request/createRequest',$scope.newRequest)
        .success(function(data){
        	if(data.success==false){
        		alert("Thêm yêu cầu thất bại, vui lòng thử lại");
        	}else{
        		alert("Tạo đơn hàng thành công");
        		$scope.newRequest = {
    				ngaydatyeucau : $scope.today,
                    ngaybatdau : null,
                    ngayketthuc : null,
                    chiphi : "",
                    nhanvienxuly : "",
                    sdtkhachhang : "",
                    hoten :"",
                    loaiyeucau : "Ngắn hạn",
                    loaidichvu : [],
                    trangthai : "",
                    diachi : "",
                    quan : "",
                    giobatdau :360,
                    gioketthuc :360,
                    giachuan:0,
                    sogiongoaigio:0,
                    chiphingoaigio:0,
                    phithoathuan:0
				};
				$scope.serviceTemp = {
                    giachuan : 0,
                    phuphi : "Không",
                    phingoaigio:0
                };
                $scope.costTemp = {
                    chiphi : 0,
                    phuphi : "Không",
                    chiphingoaigio :0,
                    sogiongoaigio:0
                };
        	}
        })
        .error(function(data){
        	alert("Error! Thêm yêu cầu thất bại, vui lòng thử lại");
        	console.log(data);
        });
	}

	$scope.cancelCreateRequest = function(){
		$location.path("/Home");
	}

}