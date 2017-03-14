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


employeesRegisterApp.controller("tableCtrl", function ($scope, $http) {
  var initTest = function () {
    if (localStorage.getItem('currentUser') == "") {
      location.href = "#login";
    };
  };
  initTest();

  $scope.employList = [];
  $scope.selectedCheckboxes = [];
  $scope.showHelp = false;
  $scope.id;
  $scope.sortType = '';
  $scope.sortReverse = '';
  $scope.search = {};
  $scope.isFilterSet = false;

  $scope.setReverse = function () {
    if ($scope.sortReverse === '') {
      $scope.sortReverse = false;
    }
    else {
      $scope.sortReverse = !$scope.sortReverse;
    };
  };

  $scope.applyFilter = function(name, surname, position) {
    $scope.addOrEditForm.$setPristine();
    $scope.search['firstName'] = name;
    $scope.search['secondName'] = surname;
    $scope.search['position'] = position;
    if ($scope.search['firstName'] || $scope.search['secondName'] || $scope.search['position']) {
      $scope.isFilterSet = true;
    }
    else {
      $scope.isFilterSet = false;
    };
  };

  $scope.clearFilter = function () {
    $scope.search = {};
    $scope.isFilterSet = false;
  };

  $http.get("/Employees?q=n&_start=7&_limit=20").then(function(response) {
    for (var i = 0; i < response.data.length; i++) {
      $scope.employList.push(response.data[i]);
      };
    console.log($scope.employList);
    });

  $scope.getId = function() {
    // TODO: change function to communicate with server rather than operates on client's employees array
    $scope.id = $scope.employList.length > 0 ? $scope.employList[$scope.employList.length-1]['id'] : 0;
  };

  $scope.clearForm = function () {
    $scope.addOrEditForm.$setPristine();
    $scope.firstName = "";
    $scope.secondName = "";
    $scope.position = "";
  }

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
        for (var i = 0; i < $scope.employList.length; i++) {
          if ($scope.employList[i].id == response.data.id) {
            $scope.employList.splice(i, 1, response.data);
            console.log(response.data);
          };
        };
      });
      $scope.selectedCheckboxes = [];
      $scope.clearForm();
      return;
    };
    // for supporting adding new employees
    $scope.getId();
    var newObj = {
      "id": $scope.id + 1,
      "firstName": name,
      "secondName": surname,
      "position": position
    };
    $http.post("/Employees", newObj).then(function (response) {
      $scope.employList.push(response.data);
    });
    $scope.clearForm();
  };


  $scope.isChecked = function (empl_id) {
    var index = $scope.selectedCheckboxes.indexOf(empl_id);
    if (index == -1) {
          $scope.selectedCheckboxes.push(empl_id);
      }
    else {
          $scope.selectedCheckboxes.splice(index, 1);
    };
    console.log($scope.selectedCheckboxes);
    if ($scope.selectedCheckboxes.length == 1) {
      for (var i = 0; i < $scope.employList.length; i++) {
        if ($scope.employList[i].id == $scope.selectedCheckboxes[0]) {
          $scope.firstName = $scope.employList[i].firstName;
          $scope.secondName = $scope.employList[i].secondName;
          $scope.position = $scope.employList[i].position;
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


  $scope.delete = function () {
    for (var i = 0; i < $scope.selectedCheckboxes.length; i++) {
      for (var j = 0; j < $scope.employList.length; j++) {
        if ($scope.employList[j].id == $scope.selectedCheckboxes[i]) {
          $scope.employList.splice(j, 1);
          $http.delete("/Employees/" + $scope.selectedCheckboxes[i]).then(function (response) {});
          break;
        };
      };
      $scope.selectedCheckboxes.splice(i, 1);
      i--;
    };
    $scope.clearForm();
  };

  // TODO: filter function should delete some values from the selectedCheckboxes array




});
