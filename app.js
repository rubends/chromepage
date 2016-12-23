var app = angular.module('chromePage', ['ngRoute', 'ngCookies']);

(function() {
    
    
    app.config(function($routeProvider, $locationProvider) {
    	$routeProvider
    	.when("/", {
			templateUrl : "templates/home.html"
		})
		.when("/register", {
			templateUrl : "templates/register.html",
			controller : "registerController"
		})
		.when("/login", {
			templateUrl : "templates/login.html",
			controller : "loginController"
		})
		.when("/settings", {
			templateUrl: "templates/settings.html",
			controller : "settingsController",
            resolve: {
                settings: ['settingsService', function(settingsService){
                    return settingsService.get();
                }]
            }
		})
        .when("/logout", {
            templateUrl: "templates/dashboard.html",
            controller : "logoutController"
        })
        .when("/dashboard", {
            templateUrl : "templates/dashboard.html",
            controller : "dashboardController",
            resolve: {
                settings: ['settingsService', function(settingsService){
                    return settingsService.get();
                }],
                // user: ['getUserService', function(getUserService){
                //     return getUserService.getUser();
                // }]
            }
        })
		.otherwise({
	        templateUrl : "templates/home.html"
	    });
	});

    app.controller("chromePageCtrl", ['$scope', '$http', '$cookies', '$location', 'getUserService', '$rootScope', function($scope, $http, $cookies, $location, getUserService, $rootScope){
        $scope.user = {loggedIn: false};
        $scope.error = {exist: false};

        $scope.$watch(function() { return $cookies.get('token'); }, function() {
            if ($cookies.get('token')) {
                $scope.token = $cookies.get('token');
                getUserService.getUser().success(function(data){
                    $scope.user = data;
                    $scope.user.loggedIn = true;
                    console.log("get user from cookie");
                }).error(function(data){
                    $location.path('/login');
                    $scope.error.reason = "You have to be loggedin";
                    $scope.error.exist = true;
                });
            }
            else {
                $scope.user = [];
                $scope.user.loggedIn = false;
            }
        });

    }]);
    
})();

