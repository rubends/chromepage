app.factory('getUserService', ['$http', '$cookies', function($http, $cookies) {
	return {
		getUser: function(){
                var sUrl = "http://chromepage.local/backend/web/api/user";
                var oConfig = {
                    url: sUrl,
                    method: "GET",
                    params: {callback: "JSON_CALLBACK"},
                    headers: {Authorization: 'Bearer ' + $cookies.get('token')}
                };
                return $http(oConfig);
        }
	};
}]);