'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ["ngResource","ngRoute"]).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
    .when("/Dashboard", {
        templateUrl:"/Dashboard",
        controller: "DashboardCtrl" })
    // request control
        .when("/Show-Waiting-Request-List", {
        templateUrl:"/WaitingRequest",
        controller: "waitingRequestCtrl" })

        .when("/Show-Request-Infomation-List", {
        templateUrl:"/ListRequest",
        controller: "progressRequestCtrl" })

        .when("/Show-Progress-Request-Detail", {
        templateUrl:"/ProgressRequestDetail",
        controller: "progressRequestDetailCtrl" })

        .when("/History-Request", {
        templateUrl:"/HistoryRequest",
        controller: "doneRequestCtrl" })

        .when("/Show-Done-Request-Detail", {
        templateUrl:"/DoneRequestDetail",
        controller: "doneRequestDetailCtrl" })

        .when("/Create-New-Request", {
        templateUrl:"/CreateRequest",
        controller: "CreateRequestCtrl" })

        .when("/Payment-Request", {
        templateUrl:"/PaymentRequest",
        controller: "PaymentRequestCtrl" })

        .when("/Payment-Request-Detail", {
        templateUrl:"/PaymentRequestDetail",
        controller: "PaymentRequestDetailCtrl" })

    // helper control
      .when("/Show-Helper-Infomation-List", {
        templateUrl:"/ListHelper",
        controller: "helperListCtrl" })

      .when("/Edit-Helper", {
        templateUrl:"/EditHelper",
        controller: "helperEditCtrl" })

      .when("/Add-New-Helper", {
        templateUrl:"/AddHelper",
        controller: "addNewHelperCtrl" })

      .when("/Show-Helpers-Busy-List", {
        templateUrl:"/HelperBusyList",
        controller: "helperBusyListCtrl" })

      .when("/Show-Helper-Busy-Date-Detail", {
        templateUrl:"/HelperBusyDateDetail",
        controller: "showHelperBusyDateDetailCtrl" })

      .when("/Show-Helper-Salary", {
        templateUrl:"/HelperSalary",
        controller: "ShowHelperSalaryListCtrl" })

    // stuff control
      .when("/Show-Stuff-Infomation-List", {
        templateUrl:"/ListStuff",
        controller: "stuffListCtrl" })

      .when("/Add-New-Stuff", {
        templateUrl:"/AddStuff",
        controller: "addNewStuffCtrl" })

      .when("/Edit-Stuff", {
        templateUrl:"/EditStuff",
        controller: "stuffEditCtrl" })

      .when("/Show-Off-Stuff-List", {
        templateUrl:"/StuffOff",
        controller: "stuffOffListCtrl" })

      .when("/Show-Stuff-Off-Detail", {
        templateUrl:"/StuffOffDetail",
        controller: "stuffOffDetailCtrl" })

      .when("/Show-Staff-Salary", {
        templateUrl:"/StaffSalary",
        controller: "staffSalaryListCtrl" })

    // location control
      .when("/Add-New-Location", {
        templateUrl:"/AddLocation",
        controller: "LocationCtrl" })

      .when("/Add-New-District", {
        templateUrl:"/AddDistrict",
        controller: "DistrictCtrl" })

      .when("/Add-New-Ward", {
        templateUrl:"/AddWard",
        controller: "WardCtrl" })

      .when("/Show-List-Location", {
        templateUrl:"/ListLocation",
        controller: "ShowLocationControl" })

      // customer
      .when("/Show-List-Customer", {
        templateUrl:"/ListCustomer",
        controller: "customerListCtrl" })

      .when("/List-Customer-To-Show-Request", {
        templateUrl:"/ListCustomerToShowRequest",
        controller: "customerListCtrl" })
      .when("/List-Request-By-Customer", {
        templateUrl:"/ListRequestByCustomer",
        controller: "listRequestByCustomerCtrl" })


      /// System

      .when("/Create-New-Account", {
        templateUrl:"/CreateNewAccount",
        controller: "createNewAccountCtrl" })

      .when("/Login", {
        templateUrl:"/Views/System/Login.html"
        })
      .when("/Manage-Account", {
        templateUrl:"/ManageAccount",
        controller: "EditRoleCtrl" })
      .when("/Edit-Role", {
        templateUrl:"/EditRole",
        controller: "EditRoleCtrl" })
      .when("/Show-Cost", {
        templateUrl:"/ShowCost",
        controller: "ShowCostCtrl" })
      
      .when("/Home", {})
      .otherwise({ redirectTo: "/Login" });
  }]);
app.directive(
    'dateInput',
    function(dateFilter) {
        return {
            require: 'ngModel',
            template: '<input type="date"></input>',
            replace: true,
            link: function(scope, elm, attrs, ngModelCtrl) {
                ngModelCtrl.$formatters.unshift(function (modelValue) {
                    return dateFilter(modelValue, 'yyyy-MM-dd');
                });

                ngModelCtrl.$parsers.unshift(function(viewValue) {
                    return new Date(viewValue);
                });
            },
        };
});

app.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;


            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });


            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber));
                return plainNumber;
            });
        }
    };
}]);



function mainController($scope, $rootScope, $http,$location,$route, $templateCache) {
    $rootScope.wrong = [false,false,false,false];

    $rootScope.changePassword = false;

    if (!sessionStorage.getItem('loginOK')) {
        sessionStorage.setItem("loginOK", false);
    }
    $rootScope.loginOK = sessionStorage.getItem("loginOK");

    if (!sessionStorage.getItem('stuff')) {
        sessionStorage.setItem("stuff", JSON.stringify(null));
    }
    $rootScope.stuff = JSON.parse(sessionStorage.getItem("stuff"));

    $rootScope.account ;
    $rootScope.stuff;
    $rootScope.startPath = "/Home"
    

    $rootScope.changePasswordAccount = {
        username:"",
        currentPassword:"",
        password:"",
        rePassword:""
    }
    $rootScope.logout = function(){
        
        $http.post('/api/account/logout',{})
        .success(function(data){
            sessionStorage.setItem("loginOK", false);
            $rootScope.loginOK = sessionStorage.getItem("loginOK");

            $rootScope.account =null;

            sessionStorage.setItem("stuff", JSON.stringify(null));
            $rootScope.stuff = JSON.parse(sessionStorage.getItem("stuff"));

            // $rootScope.stuff = null;
            $templateCache.remove("/Dashboard");
            $templateCache.remove("/Create-New-Account");

            $location.path("/Login");
        })
        .error(function(data){
            return;
        });
        
    }

    $rootScope.manageAccount = function(){
        $location.path("/Manage-Account");
    }

    $rootScope.changePass = function(){
        $rootScope.changePassword=true;
        $rootScope.wrong = [false,false,false,false];
        $rootScope.changePasswordAccount.username = $rootScope.account.username;
    }

    $rootScope.closeChangePassword = function(){
        $rootScope.changePassword= false;
        
    }

    $rootScope.changePaswordConfirm = function(){
        $rootScope.wrong = [false,false,false,false];
        if($rootScope.changePasswordAccount.currentPassword!=$rootScope.account.password){
            $scope.wrong[0] = true;
            return;
        }
        if($rootScope.changePasswordAccount.password.indexOf(" ")>-1 || $rootScope.changePasswordAccount.password.length < 6){
            $scope.wrong[1] = true;
            return;
        }
        if($rootScope.changePasswordAccount.password!=$rootScope.changePasswordAccount.rePassword){
            $scope.wrong[2] = true;
            return;
        }
        
        $http.post('/api/account/changePassword',$rootScope.changePasswordAccount)
            .success(function(data) {
                if(data.success==true){
                    $rootScope.account.password = $rootScope.changePasswordAccount.password;
                    $rootScope.changePasswordAccount = {
                        username:"",
                        currentPassword:"",
                        password:"",
                        rePassword:""
                    }
                    $rootScope.changePassword= false;
                }
                else{
                    $rootScope.wrong[3] = false;
                }
            })
            .error(function(data) {
                $rootScope.wrong[3] = false;
        });


    }

    $rootScope.loginInfo={
        username:"",
        password:""
    }
    $rootScope.loginFail = false;
    $rootScope.success = false;

    $rootScope.login = function(){
        if (!sessionStorage.getItem('loginOK')) {
            sessionStorage.setItem("loginOK", false);
        }
        $rootScope.loginOK = sessionStorage.getItem("loginOK");

        if (!sessionStorage.getItem('stuff')) {
            sessionStorage.setItem("stuff", JSON.stringify(null));
        }
        $rootScope.stuff = JSON.parse(sessionStorage.getItem("stuff"));
        console.log("1: " + $rootScope.stuff)

        $rootScope.account  = null;
        $rootScope.loginFail = false;

        if($rootScope.loginInfo.username==""||$rootScope.loginInfo.password==""){
            $rootScope.loginFail = true;
            return;
        }
        if($rootScope.loginInfo.username.indexOf(" ")>-1||$rootScope.loginInfo.password.indexOf(" ")>-1){
            $rootScope.loginFail = true;
            return;
        }
        if($rootScope.loginInfo.password.length<6){
            $rootScope.loginFail = true;
            return;
        }
        $http.post('api/account/login',$rootScope.loginInfo)
        .success(function(data){
            console.log(data);
            if(data.success == false)
            {
                $rootScope.loginFail = true;
                return;
            }

            sessionStorage.setItem("stuff", JSON.stringify(data.stuff));
            $rootScope.stuff = JSON.parse(sessionStorage.getItem("stuff"));
            console.log("2: " + $rootScope.stuff.hinhanh)

            sessionStorage.setItem("loginOK", true);
            $rootScope.loginOK = sessionStorage.getItem("loginOK");

            $rootScope.loginFail = false;
            $rootScope.loginSuccess = true;
            $rootScope.account  = data.account;
            

            if($location.path() == data.startURL) {
                $templateCache.remove(data.templateURL);
                $route.reload();
            }else{
                $location.path(data.startURL);
            }
        })
        .error(function(data){
            $scope.loginFail = true;
            return;
        });
    }

    $rootScope.timeOption = ["06 : 00","06 : 30","07 : 00","07 : 30","08 : 00","08 : 30","09 : 00","09 : 30","10 : 00","10 : 30",
                         "11 : 00","11 : 30","12 : 00","12 : 30","13 : 00","13 : 30","14 : 00","14 : 30","15 : 00","15 : 30",
                         "16 : 00","16 : 30","17 : 00","17 : 30","18 : 00","18 : 30","19 : 00","19 : 30","20 : 00"];



    $rootScope.changeValueToTime = function(value){
        switch(value){
            case 360:
                return "06 : 00" ;
            case 390:
                return "06 : 30" ;
            case 420:
                return "07 : 00" ;
            case 450:
                return "07 : 30" ;
            case 480:
                return "08 : 00" ;
            case 510:
                return "08 : 30" ;
            case 540:
                return "09 : 00" ;
            case 570:
                return "09 : 30" ;
            case 600:
                return "10 : 00" ;
            case  630:
                return "10 : 30";
            case  660:
                return "11 : 00";
            case  690:
                return "11 : 30";
            case  720:
                return "12 : 00";
            case 750:
                return "12 : 30" ;
            case 780:
                return  "13 : 00";
            case  810:
                return "13 : 30";
            case  840:
                return "14 : 00";
            case 870:
                return "14 : 30" ;
            case 900:
                return "15 : 00" ;
            case 930:
                return "15 : 30" ;
            case  960:
                return "16 : 00";
            case 990:
                return "16 : 30" ;
            case 1020:
                return "17 : 00" ;
            case 1050:
                return  "17 : 30";
            case  1080:
                return "18 : 00";
            case 1110:
                return "18 : 30" ;
            case 1140:
                return  "19 : 00";
            case 1170:
                return "19 : 30" ;
            case  1200  :
                return"20 : 00";
        }
    }

    $rootScope.changeTimeToValue = function(time){
        switch(time){
            case "06 : 00" :
                return 360;
            case "06 : 30" :
                return 390;
            case "07 : 00" :
                return 420;
            case "07 : 30" :
                return 450;
            case "08 : 00" :
                return 480;
            case "08 : 30" :
                return 510;
            case "09 : 00" :
                return 540;
            case "09 : 30" :
                return 570;
            case "10 : 00" :
                return 600;
            case "10 : 30" :
                return 630;
            case "11 : 00" :
                return 660;
            case "11 : 30" :
                return 690;
            case "12 : 00" :
                return 720;
            case "12 : 30" :
                return 750;
            case "13 : 00" :
                return 780;
            case "13 : 30" :
                return 810;
            case "14 : 00" :
                return 840;
            case "14 : 30" :
                return 870;
            case "15 : 00" :
                return 900;
            case "15 : 30" :
                return 930;
            case "16 : 00" :
                return 960;
            case "16 : 30" :
                return 990;
            case "17 : 00" :
                return 1020;
            case "17 : 30" :
                return 1050;
            case "18 : 00" :
                return 1080;
            case "18 : 30" :
                return 1110;
            case "19 : 00" :
                return 1140;
            case "19 : 30" :
                return 1170;
            case "20 : 00" :
                return 1200;
        }
    }

};