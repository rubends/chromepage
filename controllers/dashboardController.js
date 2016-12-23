app.controller("dashboardController", ['$scope', '$http', '$cookies', '$location', 'settings', function($scope, $http, $cookies, $location, settings){
		$scope.todos = [];
        $scope.groceries = [];
        $scope.weather = [];
        $scope.widgetTemplates = [];

        if (settings == "error") {
            $location.path('/login');
            $scope.error.reason = "You have to be loggedin";
            $scope.error.exist = true;
        }
        else if($scope.user.loggedIn){
            $scope.settings = settings.data;
            // $scope.user = user.data;
            // $scope.user.loggedIn = true;
            console.log($scope.user);
            $scope.dashboardStyle = {'background-color': $scope.user.background_color, 'color': $scope.user.font_color};
            $scope.widgetHeader = {'background-color': $scope.user.header_color, 'color': $scope.user.font_color};
            $scope.widgetBody = {'background-color': $scope.user.widget_color, 'color': $scope.user.font_color};
            $scope.buttonStyle = {'background-color': $scope.user.header_color, 'color': $scope.user.font_color};
            $scope.buttonHoverStyle = {'background-color': $scope.user.font_color, 'color': $scope.user.header_color};

        }

        
        for(setting in $scope.settings){
            if ($scope.settings[setting].visible==1) 
            {
                $scope.widgetTemplates[$scope.settings[setting].place] = "widgets/" + $scope.settings[setting].widget + ".html";

                if ($scope.settings[setting].widget=="todo") 
                {
                    getTodos();
                    $scope.todoWidget = $scope.settings[setting];
                };
                if ($scope.settings[setting].widget=="weather") 
                {
                    getWeather($scope.settings[setting].account);
                    $scope.weatherWidget = $scope.settings[setting];
                };
                if ($scope.settings[setting].widget=="joke") 
                {
                    getJoke();
                    $scope.jokeWidget = $scope.settings[setting];
                };
                if ($scope.settings[setting].widget=="catGifs") 
                {
                    $scope.catWidget = $scope.settings[setting];
                };
                if ($scope.settings[setting].widget=="groceryList") 
                {
                    getGroceries();
                    $scope.groceryWidget = $scope.settings[setting];
                };
                if ($scope.settings[setting].widget=="analogClock") 
                {
                    $scope.analogClockWidget = $scope.settings[setting];
                };
                if ($scope.settings[setting].widget=="digitalClock") 
                {
                    $scope.digitalClockWidget = $scope.settings[setting];
                };

            };
        };

        $('.grid').masonry({
          itemSelector: '.move',
          columnWidth: '.move',
          percentPosition: true
        });

        $('#widgets').sortable({
            helper: 'clone',
            forceHelperSize: true,
            items: '.move',
            helper: 'original',
            cursor: 'move',
            update: function(event, ui) {
                var data = $(this).sortable('toArray');
                for (var i = 0; i < data.length; i++) {
                    var sUrl = "http://chromepage.local/backend/web/api/settings/"+data[i]+"/places/"+i;
                    var oConfig = {
                        url: sUrl,
                        method: "PATCH",
                        params: {callback: "JSON_CALLBACK"},
                        headers: {Authorization: 'Bearer ' + $scope.token}
                    };
                    $http(oConfig).success(function(data){
                        // console.log(data);
                    }).error(function(data){
                         console.log("error");
                    });
                };
            },
        });

        $scope.changeSize = function($id, $size){
            if ($size < 3) {
                $size = $size + 1;
            }
            else {
                $size = 1;
            }
            $scope.newWidgetSize = $size;
            var sUrl = "http://chromepage.local/backend/web/api/settings/"+$id+"/sizes/"+$size;
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
        
        function getTodos(){
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

        function getGroceries(){
            var sUrl = "http://chromepage.local/backend/web/api/grocerys";
            var oConfig = {
                url: sUrl,
                method: "GET",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
                for (grocery in data) 
                {
                    $scope.groceries.push(data[grocery]);
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
            var sUrl = "http://chromepage.local/backend/web/api/jokes.json";
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

        $scope.postTodo = function($todo){
        	var sUrl = "http://chromepage.local/backend/web/api/tasks";
            var oConfig = {
                url: sUrl,
                method: "POST",
                data: {todo:$todo},
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
            	$scope.todos = [];
            	for (todo in data) 
                {
               		$scope.todos.push(data[todo]);
                };
                $("#addTodo").val('');
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

        $scope.changeWeather = function($id, $weather){
            var sUrl = "http://chromepage.local/backend/web/api/settings/"+$id+"/accounts/"+$weather;
            var oConfig = {
                url: sUrl,
                method: "PATCH",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
                getWeather($weather);
            }).error(function(data){
                 console.log("error");
            });
        }

        $scope.postGrocery = function($grocery){
            var sUrl = "http://chromepage.local/backend/web/api/grocerys";
            var oConfig = {
                url: sUrl,
                method: "POST",
                data: {item:$grocery},
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
                $scope.groceries = [];
                for (grocery in data) 
                {
                    $scope.groceries.push(data[grocery]);
                };
                $("#addGrocery").val('');
            });
        }

        $scope.deleteGrocery = function($id){
            var sUrl = "http://chromepage.local/backend/web/api/groceries/"+$id;
            var oConfig = {
                url: sUrl,
                method: "DELETE",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
                $scope.groceries = [];
                for (grocery in data) 
                {
                    $scope.groceries.push(data[grocery]);
                };
            });
        }

        $scope.deleteAllGroceries = function(){
            var sUrl = "http://chromepage.local/backend/web/api/all/grocery";
            var oConfig = {
                url: sUrl,
                method: "DELETE",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
                $scope.groceries = [];
            });
        }

	}]);