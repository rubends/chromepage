app.controller("logoutController", ['$scope', '$http','$cookies', '$location', function($scope, $http, $cookies, $location){
        $cookies.remove('token');
        $scope.token = "";
        $scope.user = [];
        $scope.user.loggedIn = false;
        $location.path('/login');
    }]);