employeesRegisterApp.controller("loginCtrl", function ($scope, $http) {

  $scope.signOut = function () {
    localStorage.setItem('currentUser', "");
  };

  $scope.signOut();

  $scope.isNotExist = false;

  $scope.sign = function (login, passw) {
    $scope.isNotExist = false;
    $http.get("/Users?login=" + login + "&password=" + sha256(passw)).then(function(response) {
          $scope.user = response.data[0];
          if ($scope.user && $scope.user.id) {
              localStorage.setItem('currentUser', JSON.stringify($scope.user));
              location.href = "#table";
              return;
            };
          $scope.isNotExist = true;
      });
  };

});


employeesRegisterApp.controller("tableCtrl", ['tableFactory', '$http', '$scope', function (tableFactory, $http, $scope ) {
  // check if user is authorized
  var initTest = function () {
    if (localStorage.getItem('currentUser') == "") {
      location.href = "#login";
    };
  };
  initTest();

  // inject service object into controller
  $scope.tableFactory = tableFactory;

  //initial download of information from database
  $scope.tableFactory.getTable();

  // watcher for changing in service object
  $scope.$watch(watchSource, function(current, previous){
      $scope.tableFactory = current;
    });

  function watchSource(){
      return tableFactory;
    };


  // necessary for form validation, sorting and editing variables
  $scope.selectedCheckboxes = [];
  $scope.showHelp = false;
  $scope.sortType = '';
  $scope.sortReverse = '';

  // function for sorting in reverse order
  $scope.setReverse = function () {
    if ($scope.sortReverse === '') {
      $scope.sortReverse = false;
    }
    else {
      $scope.sortReverse = !$scope.sortReverse;
    };
  };


  $scope.applyFilter = function(name, surname, position) {
    $scope.selectedCheckboxes = [];
    $scope.addOrEditForm.$setPristine();
    tableFactory.search['firstName'] = name;
    tableFactory.search['secondName'] = surname;
    tableFactory.search['position'] = position;
    if (tableFactory.search['firstName'] || tableFactory.search['secondName'] || tableFactory.search['position']) {
      tableFactory.isFilterSet = true;
    }
    else {
      tableFactory.isFilterSet = false;
    };
  };

  $scope.clearFilter = function () {
    tableFactory.search = {};
    tableFactory.isFilterSet = false;
    tableFactory.countSimpleQuery = 0;
  };

  $scope.clearForm = function () {
    $scope.addOrEditForm.$setPristine();
    $scope.firstName = "";
    $scope.secondName = "";
    $scope.position = "";
  }

  // function for adding new or editing existing elements of the table and database
  $scope.saveOrEdit = function (name, surname, position) {
    $scope.showHelp = false;
    if (!name || !surname || !position) {
      $scope.showHelp = true;
      return;
    };
    // for supporting edit
    if ($scope.selectedCheckboxes.length == 1) {
      var newObj = {
        "id": $scope.selectedCheckboxes[0],
        "firstName": name,
        "secondName": surname,
        "position": position
      };
      $http.put("/Employees/" + $scope.selectedCheckboxes[0], newObj).then(function (response) {
        for (var i = 0; i < tableFactory.employList.length; i++) {
          if (tableFactory.employList[i].id == response.data.id) {
            tableFactory.employList.splice(i, 1, response.data);
          };
        };
      });
      $scope.selectedCheckboxes = [];
      $scope.clearForm();
      return;
    };
    // for supporting adding new employees
    var newObj = {
      "firstName": name,
      "secondName": surname,
      "position": position
    };
    $http.post("/Employees", newObj).then(function (response) {
      tableFactory.employList.push(response.data);
    });
    $scope.clearForm();
  };

  // function for checking which eleents select user for editing
  $scope.isChecked = function (empl_id) {
    var index = $scope.selectedCheckboxes.indexOf(empl_id);
    if (index == -1) {
          $scope.selectedCheckboxes.push(empl_id);
      }
    else {
          $scope.selectedCheckboxes.splice(index, 1);
    };
    // if user select ONLY 1 element - enter it to inputs field for edit
    if ($scope.selectedCheckboxes.length == 1) {
      for (var i = 0; i < tableFactory.employList.length; i++) {
        if (tableFactory.employList[i].id == $scope.selectedCheckboxes[0]) {
          $scope.firstName = tableFactory.employList[i].firstName;
          $scope.secondName = tableFactory.employList[i].secondName;
          $scope.position = tableFactory.employList[i].position;
          break;
        };
      };
    }
    else {
      $scope.firstName = "";
      $scope.secondName = "";
      $scope.position = "";
    };
  };

  // function for deleting selected elements
  $scope.delete = function () {
    for (var i = 0; i < $scope.selectedCheckboxes.length; i++) {
      for (var j = 0; j < tableFactory.employList.length; j++) {
        if (tableFactory.employList[j].id == $scope.selectedCheckboxes[i]) {
          tableFactory.employList.splice(j, 1);
          $http.delete("/Employees/" + $scope.selectedCheckboxes[i]).then(function (response) {});
          break;
        };
      };
      $scope.selectedCheckboxes.splice(i, 1);
      i--;
    };
    $scope.clearForm();
  };


}]);
