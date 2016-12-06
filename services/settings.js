app.factory('settingsService', ['$http', '$cookies', '$location', function($http, $cookies, $location) {
	return {
		get: function(){
            if ($cookies.get('token')) {
    			var sUrl = "http://chromepage.local/backend/web/api/settings";
                var oConfig = {
                    url: sUrl,
                    method: "GET",
                    params: {callback: "JSON_CALLBACK"},
                    headers: {Authorization: 'Bearer ' + $cookies.get('token')}
                };
                return $http(oConfig);
            }
            else {
                $location.path('/login');
                $scope.error.reason = "You have to be loggedin";
            }
		}
	};
}]);