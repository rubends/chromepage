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
                    console.log(data);
                }
                else
                {
                    $scope.error.exist = false;
                    $cookies.put('token', data.token);
                    $scope.user.name = data.name;
                    $scope.user.email = data.email;
                    $scope.user.loggedIn = true;
                    $scope.user.backgroundColor = data.backgroundColor;
                    $scope.user.widgetColor = data.widgetColor;
                    $location.path('/dashboard');
                }
            }).error(function(data){
                console.log(data);
            });
        }

    }]);