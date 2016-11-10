(function() {
    var app = angular.module('chromePage', ['ngRoute', 'ngCookies']);
    
    app.config(function($routeProvider, $locationProvider) {
    	$routeProvider
    	.when("/", {
			templateUrl : "templates/dashboard.html",
			controller : "dashboardController"
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
			controller : "settingsController"
		})
        .when("/logout", {
            templateUrl: "templates/dashboard.html",
            controller : "logoutController"
        })
		.otherwise({
	        templateUrl : "templates/dashboard.html",
	        controller : "dashboardController"
	    });
	});

    app.controller("chromePageCtrl", ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location){
        $scope.user = {loggedIn: false};
        $scope.user = {name: "test"};
        $scope.user = {email: "test@test.com"};

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
                }).error(function(data){
                    console.log("error");
                });
            }
            $scope.getUser();
        };

    }]);


    app.controller("registerController", ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location){

        $scope.register = function(){
            var sUrl = "http://chromepage.local/backend/web/api/users/registers";
            var oConfig = {
                url: sUrl,
                method: "POST",
                data: $scope.registerForm,
                params: {callback: "JSON_CALLBACK"}
            };
            $http(oConfig).success(function(data){
                $cookies.put('token', data.token);
                $scope.token = data.token;
                $scope.user.name = data.name;
                $scope.user.email = data.email;
                $scope.user.loggedIn = true;
                $scope.setUserSettings();
            }).error(function(data){
                console.log("error");
            });
        }

        $scope.setUserSettings = function(){
            var sUrl = "http://chromepage.local/backend/web/api/settings/users";
            var oConfig = {
                url: sUrl,
                method: "POST",
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
                console.log(data);
                $location.path('/dashboard');
            }).error(function(data){
                console.log("error");
            });
        }

    }]);

    app.controller("loginController", ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location){
        
        $scope.login = function(){
            var sUrl = "http://chromepage.local/backend/web/api/users/logins";
            var oConfig = {
                url: sUrl,
                method: "POST",
                data: $scope.loginForm,
                params: {callback: "JSON_CALLBACK"}
            };
            $http(oConfig).success(function(data){
                $cookies.put('token', data.token);
                console.log(data.token);
                $scope.user.name = data.name;
                $scope.user.email = data.email;
                $scope.user.loggedIn = true;
                $location.path('/dashboard');
            }).error(function(data){
                 console.log("error");
            });
        }

    }]);

    app.controller("logoutController", ['$scope', '$http','$cookies', '$location', function($scope, $http, $cookies, $location){
        $cookies.remove('token');
        $scope.user = [];
        $scope.user.loggedIn = false;
        $location.path('/login');
    }]);


	app.controller("dashboardController", ['$scope', '$http', '$cookies', function($scope, $http, $cookies){
		$scope.todos = [];
        $scope.weather = [];
        $scope.token = $cookies.get('token');
        $scope.settings = [];

        $scope.getSettings = function(){
            var sUrl = "http://chromepage.local/backend/web/api/settings";
            var oConfig = {
                url: sUrl,
                method: "GET",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
                for(setting in data){
                    if (data[setting].visible==1) 
                    {
                        $scope.settings.push(data[setting]);
                        if (data[setting].widget=="todo") 
                        {
                            $scope.getTodos();
                            $scope.showTodo = true;
                            $("#widgets").append("<todo-directive/>");
                        };
                        if (data[setting].widget=="weather") 
                        {
                            $scope.getWeather(data[setting].account);
                            $scope.showWeather = true;
                        };
                    };
                }
            }).error(function(data){
                 console.log("error");
            });
        }
        $scope.getSettings();

	    $scope.getTodos = function(){
            var sUrl = "http://chromepage.local/backend/web/api/tasks";
            var oConfig = {
                url: sUrl,
                method: "GET",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
                for (todo in data) 
                {
               		$scope.todos.push(data[todo]);
                };
            });
        }

        $scope.getWeather = function($location){
            var sUrl = "http://api.openweathermap.org/data/2.5/weather?q="+$location+"&units=metric&appid=ad5bf1181d1ab5166d19757241c1511e";
            var oConfig = {
                url: sUrl,
                method: "GET"
            };
            $http(oConfig).success(function(data){
                $scope.weather = data;
                console.log($scope.weather);
            });
        }
        
        $scope.toggleDone = function($id){
        	var sUrl = "http://chromepage.local/backend/web/api/tasks/"+$id+"/toggle";
            var oConfig = {
                url: sUrl,
                method: "PATCH",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
            	$scope.todos = [];
            	for (todo in data) 
                {
               		$scope.todos.push(data[todo]);
                };
            });
        }

        $scope.postTodo = function(){
        	var sUrl = "http://chromepage.local/backend/web/api/tasks";
            var oConfig = {
                url: sUrl,
                method: "POST",
                data: $scope.todoForm,
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };

            $http(oConfig).success(function(data){
            	$scope.todos = [];
            	for (todo in data) 
                {
               		$scope.todos.push(data[todo]);
                };
                $scope.todoForm.todo = "";
            });
        }

        $scope.deleteTodo = function($id){
        	var sUrl = "http://chromepage.local/backend/web/api/tasks/"+$id;
            var oConfig = {
                url: sUrl,
                method: "DELETE",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
            	$scope.todos = [];
            	for (todo in data) 
                {
               		$scope.todos.push(data[todo]);
                };
            });
        }

	}]);

app.directive("weatherDirective", function() {
    return {
        templateUrl : "widgets/weather.html"
    };
});
app.directive("todoDirective", function() {
    return {
        templateUrl : "widgets/todo.html"
    };
});

    app.controller("settingsController", ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location){
        $scope.settings = [];
        $scope.token = $cookies.get('token');
        $scope.getSettings = function(){
            var sUrl = "http://chromepage.local/backend/web/api/settings";
            var oConfig = {
                url: sUrl,
                method: "GET",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
                console.log(data);
                $scope.settings = data;
            }).error(function(data){
                 console.log("error");
            });
        }
        $scope.getSettings();

        $scope.changeAccount = function($id, $account){
            var sUrl = "http://chromepage.local/backend/web/api/settings/"+$id+"/accounts/"+$account;
            var oConfig = {
                url: sUrl,
                method: "PATCH",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
                console.log(data);
            }).error(function(data){
                 console.log("error");
            });
        }

        $scope.toggleShow = function($id){
            var sUrl = "http://chromepage.local/backend/web/api/settings/"+$id+"/toggle";
            var oConfig = {
                url: sUrl,
                method: "PATCH",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
                console.log(data);
            }).error(function(data){
                 console.log("error");
            });
        }

    }]);
    
})();

