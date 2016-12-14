app.controller("logoutController", ['$scope', '$http','$cookies', '$location', function($scope, $http, $cookies, $location){
        $cookies.remove('token');
        $scope.token = "";
        $location.path('/login');
        $scope.error.reason = "You are logged out.";
        $scope.error.exist = true;
    }]);