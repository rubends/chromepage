app.controller("settingsController", ['$scope', '$http', '$cookies', '$location', 'settings', function($scope, $http, $cookies, $location, settings){
        
        if (settings == "error") {
            $location.path('/login');
            $scope.error.reason = "You have to be loggedin";
            $scope.error.exist = true;
        }
        else {
            $scope.settings = settings.data;
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
                for (var i = 0; i < $scope.settings.length; i++) {
                    if ($scope.settings[i].id == $id) {
                        $scope.settings[i].visible = data;
                    };
                };
            });
        }

        $scope.changeColor = function($option, $color){
            var sUrl = "http://chromepage.local/backend/web/api/users/"+ $option + "/colors/" +encodeURIComponent($color);
            var oConfig = {
                url: sUrl,
                method: "PATCH",
                params: {callback: "JSON_CALLBACK"},
                headers: {Authorization: 'Bearer ' + $scope.token}
            };
            $http(oConfig).success(function(data){
                if ($option == "backgroundcolor") {
                    $scope.user.background_color = $color;
                }
                if ($option == "widgetcolor") {
                    $scope.user.widget_color = $color;
                }
                if ($option == "headercolor") {
                    $scope.user.header_color = $color;
                }
                if ($option == "fontcolor") {
                    $scope.user.font_color = $color;
                }
            }).error(function(data){
                 console.log(data);
            });
        }

    }]);