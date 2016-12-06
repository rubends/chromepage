var app = angular.module('chromePage', ['ngRoute', 'ngCookies']);

(function() {
    
    
    app.config(function($routeProvider, $locationProvider) {
    	$routeProvider
    	.when("/", {
			templateUrl : "templates/dashboard.html",
			controller : "dashboardController",
            resolve: {
                settings: ['settingsService', function(settingsService){
                    return settingsService.get();
                }]
            }
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
		.otherwise({
	        templateUrl : "templates/dashboard.html",
	        controller : "dashboardController",
            resolve: {
                settings: ['settingsService', function(settingsService){
                    return settingsService.get();
                }]
            }
	    });
	});

    app.controller("chromePageCtrl", ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location){
        $scope.user = {loggedIn: false};
        $scope.error = {exist: false};
        // $scope.todos = [];
        // $scope.weather = [];
        $scope.token = "not set";
        // $scope.settings = [];

        if ($cookies.get('token')) {
            $scope.token = $cookies.get('token');
            $scope.getUser = function(){
                var sUrl = "http://chromepage.local/backend/web/api/user";
                var oConfig = {
                    url: sUrl,
                    method: "GET",
                    params: {callback: "JSON_CALLBACK"},
                    headers: {Authorization: 'Bearer ' + $scope.token}
                };
                $http(oConfig).success(function(data){
                    $scope.user.name = data.name;
                    $scope.user.email = data.email;
                    $scope.user.loggedIn = true;
                    $scope.user.backgroundColor = data.background_color;
                    console.log(data);
                    $scope.user.widgetColor = data.widget_color;
                }).error(function(data){
                    $scope.error.exist = true;
                    if (data.code == "401") 
                    {
                        $location.path('/login');
                        $scope.error.reason = "You have to be loggedin";
                    }
                });
            }
            $scope.getUser();
            
        }
        else
        {
            $scope.error.exist = true;
            $location.path('/login');
            $scope.error.reason = "You have to be loggedin";
        }

    }]);
    
})();

