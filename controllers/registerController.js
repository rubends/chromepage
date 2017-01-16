app.controller("registerController", ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location){

        $scope.register = function(){
            var sUrl = "../backend/web/api/users/registers";
            var oConfig = {
                url: sUrl,
                method: "POST",
                data: $scope.registerForm,
                params: {callback: "JSON_CALLBACK"}
            };
            $http(oConfig).success(function(data){
                if (data.hasOwnProperty('error')) 
                {
                    $scope.error.exist = true;
                    $scope.error.reason = data.error;
                }
                else
                {
                    $scope.error.exist = false;
                    $cookies.put('token', data.token);
                    $scope.token = data.token;
                    $scope.user.loggedIn = true;
                    $scope.setUserSettings();
                }
            }).error(function(data){
                console.log("error");
            });
        }

        $scope.setUserSettings = function(){
            var sUrl = "../backend/web/api/settings/users";
            var oConfig = {
                url: sUrl,
                method: "POST",
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
                $location.path('/dashboard');
            }).error(function(data){
                console.log(data);
            });
        }

    }]);