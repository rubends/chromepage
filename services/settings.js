app.factory('settingsService', ['$http', '$cookies', function($http, $cookies) {
	return {
		get: function(){
            if ($cookies.get('token')) {
    			var sUrl = "../backend/web/api/settings";
                var oConfig = {
                    url: sUrl,
                    method: "GET",
                    params: {callback: "JSON_CALLBACK"},
                    headers: {Authorization: 'Bearer ' + $cookies.get('token')}
                };
                return $http(oConfig);
            }
            else{
                return "error";
            }
		}
	};
}]);