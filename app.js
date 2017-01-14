var app = angular.module('chromePage', ['ngRoute', 'ngCookies']);

(function() {
    
    
    app.config(function($routeProvider, $locationProvider) {
    	$routeProvider
    	.when("/", {
			templateUrl : "templates/home.html"
		})
		.when("/register", {
			templateUrl : "templates/register.html",
			controller : "registerController"
		})
		.when("/login", {
			templateUrl : "templates/login.html",
			controller : "loginController"
		})
		.when("/settings", {
			templateUrl: "templates/settings.html",
			controller : "settingsController",
            resolve: {
                settings: ['settingsService', function(settingsService){
                    return settingsService.get();
                }]
            }
		})
        .when("/logout", {
            templateUrl: "templates/dashboard.html",
            controller : "logoutController"
        })
        .when("/dashboard", {
            templateUrl : "templates/dashboard.html",
            controller : "dashboardController",
            resolve: {
                settings: ['settingsService', function(settingsService){
                    return settingsService.get();
                }],
                user: ['getUserService', function(getUserService){
                    return getUserService.getUser();
                }]
            }
        })
		.otherwise({
	        templateUrl : "templates/home.html"
	    });
	});

    app.controller("chromePageCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', 'getUserService', '$rootScope', function($rootScope, $scope, $http, $cookies, $location, getUserService, $rootScope){
        $scope.user = {loggedIn: false};
        $scope.error = {exist: false};

        $scope.$watch(function() { return $cookies.get('token'); }, function() {
            if ($cookies.get('token')) {
                $rootScope.token = $cookies.get('token');
                getUserService.getUser().success(function(data){
                    $scope.user = data;
                    $scope.user.loggedIn = true;
                    console.log("get user from cookie");
                }).error(function(data){
                    $location.path('/login');
                    $scope.error.reason = "You have to be loggedin";
                    $scope.error.exist = true;
                });
            }
            else {
                $scope.user = [];
                $scope.user.loggedIn = false;
            }
        });

    }]);

    app.directive('packery', ['$rootScope', '$http', '$timeout', function($rootScope, $http, $timeout) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            // console.log("link called on", element[0]);
            if ($rootScope.packery === undefined || $rootScope.packery === null) {
              scope.element = element;
              $rootScope.packery = new Packery(element[0].parentElement, {
                isResizeBound: true,
                // rowHeight: 100,
                columnWidth: 1,
                itemSelector: '.moveWidget'
              });
              $rootScope.packery.bindResize();
              var draggable1 = new Draggabilly(element[0]);
              $rootScope.packery.bindDraggabillyEvents(draggable1);

              draggable1.on('dragEnd', function(instance, event, pointer) {
                savePlace();
                $timeout(function() {
                  $rootScope.packery.layout();
                }, 200);
              });

              var orderItems = function() {
                var itemElems = $rootScope.packery.getItemElements();
                // $(itemElems).each(function(i, itemElem) {
                //   $(itemElem).text(i + 1);
                // });
              };

              $rootScope.packery.on('layoutComplete', orderItems);
              $rootScope.packery.on('dragItemPositioned', orderItems);

            } else {
              var draggable2 = new Draggabilly(element[0]);
              $rootScope.packery.bindDraggabillyEvents(draggable2);

              draggable2.on('dragEnd', function(instance, event, pointer) {
                savePlace();
                $timeout(function() {
                  $rootScope.packery.layout();
                }, 200);
              });

            }

            function savePlace(){
                console.log("save place");
                var itemElems = $rootScope.packery.getItemElements();
                for (var i = 0; i < itemElems.length; i++) {
                    var sUrl = "http://chromepage.local/backend/web/api/settings/"+itemElems[i].id+"/places/"+i;
                    var oConfig = {
                        url: sUrl,
                        method: "PATCH",
                        params: {callback: "JSON_CALLBACK"},
                        headers: {Authorization: 'Bearer ' + $rootScope.token}
                    };
                    $http(oConfig).success(function(data){
                        // console.log(data);
                    }).error(function(data){
                         console.log("error");
                    });
                };
            }


            $timeout(function() {
              $rootScope.packery.reloadItems();
              $rootScope.packery.layout();
            }, 100);
          }
        };

      }
    ]);
    
})();

