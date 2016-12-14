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

        $scope.chooseTheme = function($theme){
            switch($theme) {
                case "dark":
                    $scope.changeColor('backgroundcolor', "#2b2b2b");
                    $scope.changeColor('widgetcolor', "#989898");
                    $scope.changeColor('headercolor', "#c10000");
                    $scope.changeColor('fontcolor', "#ffffff");
                    $scope.newBackgroundColor = "#2b2b2b";
                    $scope.newWidgetColor = "#989898";
                    $scope.newHeaderColor = "#c10000";
                    $scope.newFontColor = "#ffffff";
                    break;
                case "light":
                    $scope.changeColor('backgroundcolor', "#ffffff");
                    $scope.changeColor('widgetcolor', "#e0e0e0");
                    $scope.changeColor('headercolor', "#757575");
                    $scope.changeColor('fontcolor', "#2b2b2b");
                    $scope.newBackgroundColor = "#ffffff";
                    $scope.newWidgetColor = "#e0e0e0";
                    $scope.newHeaderColor = "#757575";
                    $scope.newFontColor = "#2b2b2b";
                    break;
                case "candy":
                    $scope.changeColor('backgroundcolor', "#042526");
                    $scope.changeColor('widgetcolor', "#55B3C2");
                    $scope.changeColor('headercolor', "#D94723");
                    $scope.changeColor('fontcolor', "#F5F3DA");
                    $scope.newBackgroundColor = "#042526";
                    $scope.newWidgetColor = "#55B3C2";
                    $scope.newHeaderColor = "#D94723";
                    $scope.newFontColor = "#F5F3DA";
                    break;
            }
        }

    }]);