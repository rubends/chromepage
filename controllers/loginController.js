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
                if (data.hasOwnProperty('error')) 
                {
                    $scope.error.exist = true;
                    $scope.error.reason = data.error;
                }
                else
                {
                    $scope.error.exist = false;
                    $cookies.put('token', data.token);
                    $location.path('/dashboard');
                }
            }).error(function(data){
                console.log(data);
            });
        }

    }]);