var employeesRegisterApp = angular.module("employeesRegisterApp", ["ngRoute", "infinite-scroll"]);

employeesRegisterApp.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
  .when("/", {
    templateUrl : "views/login.html",
    controller : "loginCtrl"
  })
  .when("/table", {
    templateUrl : "views/table.html",
    controller : "tableCtrl"
  })
  .otherwise({
    templateUrl : "views/login.html",
    controller : "loginCtrl"
  });
});

  // check if user is authorized
employeesRegisterApp.run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function (event) {
        if ($location.path() == "/table" && !localStorage.getItem('currentUser')) {
            console.log('ACCESS DENIED. YOU SHOULD LOG IN!');
            event.preventDefault();
            $location.path('/');
        };
    });
}]);
