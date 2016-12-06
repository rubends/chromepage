app.controller("settingsController", ['$scope', '$http', '$cookies', '$location', 'settings', function($scope, $http, $cookies, $location, settings){
        $scope.settings = settings.data;
        $scope.token = $cookies.get('token');

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

        $scope.changePlace = function($id, $place){
            var sUrl = "http://chromepage.local/backend/web/api/settings/"+$id+"/places/"+$place;
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

        $scope.changeBackgroundColor = function($color){
            var sUrl = "http://chromepage.local/backend/web/api/users/"+encodeURIComponent($color)+"/backgroundcolor";
            var oConfig = {
                url: sUrl,
                method: "PATCH",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
                $scope.user.backgroundColor = $color;
            }).error(function(data){
                 console.log(data);
            });
        }

    }]);