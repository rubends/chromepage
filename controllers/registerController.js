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
                $scope.user.backgroundColor = data.backgroundColor;
                $scope.user.widgetColor = data.widgetColor;
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