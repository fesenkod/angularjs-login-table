angular.module('employeesRegisterApp').factory('tableFactory', ['$http', function($http) {
  // service object to return
  var tableFact = {};

  // array with information for displaying in table
  tableFact.employList = [];

  // variable for preventing ng-infinite-scroll triggering before previous piece of data was not downloaded
  tableFact.busyLoadingData = false;

  tableFact.isFilterSet = false;
  tableFact.search = {};
  tableFact.countSimpleQuery = 0;
  tableFact.countFilterQuery = 0;

  tableFact.getId = function() {
    tableFact.id = tableFact.employList.length > 0 ? tableFact.employList[tableFact.employList.length-1]['id'] : 0;
  };

  tableFact.getTable = function (isButtonClickedFirst) {
    if (tableFact.busyLoadingData) return;
    tableFact.busyLoadingData = true;
    // if filter is set - get table according to it's setteings
    if (tableFact.isFilterSet) {
      if (isButtonClickedFirst) {
        tableFact.employList = [];
        console.log("hello");
        console.log(tableFact.employList);
      };
      tableFact.getId();
      var query = tableFact.buildFilterQuery(tableFact.search['firstName'], tableFact.search['secondName'], tableFact.search['position']);
      $http.get(query).then(function(response) {
        for (var i = 0; i < response.data.length; i++) {
          tableFact.employList.push(response.data[i]);
          };
        tableFact.busyLoadingData = false;
        });
      tableFact.countFilterQuery++;
    }
    // if filter was not set - get data by chunks consistently
    else {
      if (isButtonClickedFirst) {
        tableFact.employList = [];
      };
      tableFact.getId();
      if (tableFact.countSimpleQuery != 0) {
        tableFact.id++;
      };
      $http.get("/Employees?_start=" + (tableFact.id) + "&_limit=20").then(function(response) {
        for (var i = 0; i < response.data.length; i++) {
          tableFact.employList.push(response.data[i]);
          };
        tableFact.busyLoadingData = false;
        tableFact.countSimpleQuery++;
        });
    };
  };

  tableFact.buildFilterQuery = function (name, surname, position) {
    var query = "/Employees?";
    if (name) {
      query += "firstName_like=" + name + "&";
    };
    if (surname) {
      query += "secondName_like=" + surname + "&";
    };
    if (position) {
      query += "position_like=" + position + "&";
    };
    if (tableFact.countFilterQuery != 0) {
      tableFact.id++;
    };
    query += "id_gte=" + (tableFact.id) + "&_limit=20";
    return query;
  };

  return tableFact;

}]);
