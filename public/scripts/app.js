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
