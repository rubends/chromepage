app.controller("dashboardController", ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location){
		$scope.todos = [];
        $scope.weather = [];
        // $scope.settings = [];
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
                $scope.settings = data;
                for(setting in data){
                    if (data[setting].visible==1) 
                    {
                        $scope.settings.push(data[setting]);
                        if (data[setting].widget=="todo") 
                        {
                            $scope.getTodos();
                            $scope.showTodo = true;
                            $scope.todoPlace = data[setting].place;
                        };
                        if (data[setting].widget=="weather") 
                        {
                            $scope.getWeather(data[setting].account);
                            $scope.showWeather = true;
                            $scope.weatherPlace = data[setting].place;
                        };
                        $("."+data[setting].widget+"Widget").addClass("place"+data[setting].place);
                        $(".place"+data[setting].place).insertAfter(".place"+(data[setting].place-1));
                        $(".place"+data[setting].place).insertBefore(".place"+(data[setting].place+1));

                    };
                };
            }).error(function(data){
                $scope.error.exist = true;
                if (data.code == "401") 
                {
                    $location.path('/login');
                    $scope.error.reason = "You have to be loggedin";
                }
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

	}]);