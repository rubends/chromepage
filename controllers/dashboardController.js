app.controller("dashboardController", ['$scope', '$http', '$cookies', '$location', 'settings', function($scope, $http, $cookies, $location, settings){
		$scope.todos = [];
        $scope.weather = [];
        $scope.widgetTemplates = [];
        $scope.settings = settings.data;
        console.log(settings.data);
        $scope.token = $cookies.get('token');
        
        $(document).ready(function() {
            $("#dashboard").css("background-color", $scope.user.backgroundColor);

            for(setting in $scope.settings){
                if ($scope.settings[setting].visible==1) 
                {
                    $scope.widgetTemplates[$scope.settings[setting].place] = "widgets/" + $scope.settings[setting].widget + ".html";
                    
                    if ($scope.settings[setting].widget=="todo") 
                    {
                        getTodos();
                        $scope.showTodo = true;
                        $scope.todoId = $scope.settings[setting].id;
                        $scope.todoPlace = $scope.settings[setting].place;
                    };
                    if ($scope.settings[setting].widget=="weather") 
                    {
                        getWeather($scope.settings[setting].account);
                        $scope.showWeather = true;
                        $scope.weatherId = $scope.settings[setting].id;
                        $scope.weatherPlace = $scope.settings[setting].place;
                    };
                    if ($scope.settings[setting].widget=="joke") 
                    {
                        getJoke();
                        $scope.showJoke = true;
                        $scope.jokeId = $scope.settings[setting].id;
                        $scope.jokePlace = $scope.settings[setting].place;
                    };
                };
            };

            $('#widgets').sortable({
                helper: 'clone',
                forceHelperSize: true,
                items: '.move',
                helper: 'original',
                cursor: 'move',
                start: function(event, ui) {
                    
                }, 
                stop: function(event, ui) {
                   
                },
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
        });
        
        function getTodos(){
	    // $scope.getTodos = function(){
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

        function getWeather($location){
        // $scope.getWeather = function($location){
            var sUrl = "http://api.openweathermap.org/data/2.5/weather?q="+$location+"&units=metric&appid=ad5bf1181d1ab5166d19757241c1511e";
            var oConfig = {
                url: sUrl,
                method: "GET"
            };
            $http(oConfig).success(function(data){
                $scope.weather = data;
                // console.log($scope.weather);
            });
        }

        function getJoke(){
        // $scope.getJoke = function(){
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

	}]);