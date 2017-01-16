app.controller("dashboardController", ['$rootScope', '$scope', '$http', '$cookies', '$location', 'settings', 'user', function($rootScope, $scope, $http, $cookies, $location, settings, user){
		$scope.todos = [];
        $scope.groceries = [];
        $scope.weather = [];
        $scope.meetings = [];

        if (settings != "error" && user != "error") {
            $scope.settings = settings.data;
            $scope.user = user.data;
            $scope.user.loggedIn = true;

            console.log($scope.user);
            $scope.dashboardStyle = {'background-color': $scope.user.background_color, 'color': $scope.user.font_color};
            $scope.widgetHeader = {'background-color': $scope.user.header_color, 'color': $scope.user.font_color, 'border': 'none'};
            $scope.widgetBody = {'background-color': $scope.user.widget_color, 'color': $scope.user.font_color};
            $scope.buttonStyle = {'background-color': $scope.user.header_color, 'color': $scope.user.font_color};
            $scope.buttonHoverStyle = {'background-color': $scope.user.font_color, 'color': $scope.user.header_color};
        }
        else{
            $location.path('/login');
            $scope.error.reason = "You have to be loggedin";
            $scope.error.exist = true;
        }
        
        for(setting in $scope.settings){
            if ($scope.settings[setting].visible==1) 
            {
                $scope.settings[setting].widgetTemplate = "widgets/" + $scope.settings[setting].widget + ".html";

                $scope[$scope.settings[setting].widget + "Widget"] = $scope.settings[setting];

                if ($scope.settings[setting].widget=="todo") 
                {
                    getTodos();
                };
                if ($scope.settings[setting].widget=="weather") 
                {
                    getWeather($scope.settings[setting].account);
                };
                if ($scope.settings[setting].widget=="joke") 
                {
                    getJoke();
                };
                if ($scope.settings[setting].widget=="groceryList") 
                {
                    getGroceries();
                };
                if ($scope.settings[setting].widget=="meeting") 
                {
                    getMeetings();
                };

            };
        };

        $('.grid').imagesLoaded( function() {
          $rootScope.packery.layout();
        });

        $scope.changeSize = function($id, $size){
            if ($size < 4) {
                $size = $size*2;
            }
            else {
                $size = 1;
            }
            $scope.newWidgetSize = $size;
            $rootScope.packery.layout();
            var sUrl = "../backend/web/api/settings/"+$id+"/sizes/"+$size;
                    var oConfig = {
                        url: sUrl,
                        method: "PATCH",
                        params: {callback: "JSON_CALLBACK"},
                        headers: {Authorization: 'Bearer ' + $rootScope.token}
                    };
                    $http(oConfig).success(function(data){
                        console.log(data);
                    }).error(function(data){
                         console.log("error");
                    });
        }
        
        function getTodos(){
            var sUrl = "../backend/web/api/tasks";
            var oConfig = {
                url: sUrl,
                method: "GET",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $rootScope.token}
            };
            $http(oConfig).success(function(data){
                for (todo in data) 
                {
               		$scope.todos.push(data[todo]);
                };
            });
        }

        function getGroceries(){
            var sUrl = "../backend/web/api/grocerys";
            var oConfig = {
                url: sUrl,
                method: "GET",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $rootScope.token}
            };
            $http(oConfig).success(function(data){
                for (grocery in data) 
                {
                    $scope.groceries.push(data[grocery]);
                };
            });
        }

        function getMeetings(){
            var sUrl = "../backend/web/api/meetings";
            var oConfig = {
                url: sUrl,
                method: "GET",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $rootScope.token}
            };
            $http(oConfig).success(function(data){
                $scope.date = new Date();
                $scope.yesterday = new Date();
                $scope.yesterday.setDate($scope.yesterday.getDate() - 1);
                $scope.dates = [];
                for (meeting in data) 
                {
                    if(jQuery.inArray(data[meeting].date, $scope.dates) !== -1){
                        data[meeting].isUsed = true;
                    }
                    else{
                        data[meeting].isUsed = false;
                        $scope.dates.push(data[meeting].date);
                    }
                    var time = new Date(data[meeting].date.replace(' ', 'T')).getTime();
                    if (time > $scope.yesterday) {
                        $scope.meetings.push(data[meeting]);
                    };
                };
            });
        }

        function getWeather($location){
            var sUrl = "http://api.openweathermap.org/data/2.5/weather?q="+$location+"&units=metric&appid=ad5bf1181d1ab5166d19757241c1511e";
            var oConfig = {
                url: sUrl,
                method: "GET"
            };
            $http(oConfig).success(function(data){
                $scope.weather = data;
            }).error(function(data){
                console.log(data);
            });
        }

        function getJoke(){
            var sUrl = "../backend/web/api/jokes.json";
            var oConfig = {
                url: sUrl,
                method: "GET"
            };
            $http(oConfig).success(function(data){
                var rndm = Math.floor((Math.random() * 31) + 1);
                $scope.joke = data.jokes[rndm];
            }).error(function(data){
                $scope.joke = "No jokes found.";
            });
        }
        
        $scope.toggleDone = function($id){
        	var sUrl = "../backend/web/api/tasks/"+$id+"/toggle";
            var oConfig = {
                url: sUrl,
                method: "PATCH",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $rootScope.token}
            };
            $http(oConfig).success(function(data){
            	$scope.todos = [];
            	for (todo in data) 
                {
               		$scope.todos.push(data[todo]);
                };
            });
        }

        $scope.postTodo = function($todo){
        	var sUrl = "../backend/web/api/tasks";
            var oConfig = {
                url: sUrl,
                method: "POST",
                data: {todo:$todo},
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $rootScope.token}
            };
            $http(oConfig).success(function(data){
            	$scope.todos.push(data);
                $("#addTodo").val('');
            });
        }

        $scope.deleteTodo = function($id){
        	var sUrl = "../backend/web/api/tasks/"+$id;
            var oConfig = {
                url: sUrl,
                method: "DELETE",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $rootScope.token}
            };
            $http(oConfig).success(function(data){
            	$scope.todos = $.grep($scope.todos, function(e){ 
                     return e.id != $id; 
                });
            });
        }

        $scope.changeWeather = function($id, $weather){
            var sUrl = "../backend/web/api/settings/"+$id+"/accounts/"+$weather;
            var oConfig = {
                url: sUrl,
                method: "PATCH",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $rootScope.token}
            };
            $http(oConfig).success(function(data){
                getWeather($weather);
            }).error(function(data){
                 console.log("error");
            });
        }

        $scope.postGrocery = function($grocery){
            var sUrl = "../backend/web/api/grocerys";
            var oConfig = {
                url: sUrl,
                method: "POST",
                data: {item:$grocery},
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $rootScope.token}
            };
            $http(oConfig).success(function(data){
                $scope.groceries.push(data);
                $("#addGrocery").val('');
            });
        }

        $scope.deleteGrocery = function($id){
            var sUrl = "../backend/web/api/groceries/"+$id;
            var oConfig = {
                url: sUrl,
                method: "DELETE",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $rootScope.token}
            };
            $http(oConfig).success(function(data){
                $scope.groceries = $.grep($scope.groceries, function(e){ 
                     return e.id != $id; 
                });
            });
        }

        $scope.deleteAllGroceries = function(){
            var sUrl = "../backend/web/api/all/grocery";
            var oConfig = {
                url: sUrl,
                method: "DELETE",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $rootScope.token}
            };
            $http(oConfig).success(function(data){
                $scope.groceries = [];
            });
        }

        $scope.postMeeting = function($title, $date, $time){
            var sUrl = "../backend/web/api/meetings";
            var oConfig = {
                url: sUrl,
                method: "POST",
                data: {title:$title, date:$date, time:$time},
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $rootScope.token}
            };
            $http(oConfig).success(function(data){
                var date = new Date(data.date.replace(' ', 'T')).getTime();
                if (date >= $scope.yesterday) {
                    $scope.meetings.push(data);
                };
                $(".meetingForm").val('');
            });
        }

        $scope.deleteMeeting = function($id){
            var sUrl = "../backend/web/api/meetings/"+$id;
            var oConfig = {
                url: sUrl,
                method: "DELETE",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $rootScope.token}
            };
            $http(oConfig).success(function(data){
                $scope.meetings = $.grep($scope.meetings, function(e){ 
                     return e.id != $id; 
                });
            });
        }
	}]);