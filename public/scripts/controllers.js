employeesRegisterApp.controller("loginCtrl", function ($scope, $http) {

  $scope.signOut = function () {
    localStorage.setItem('currentUser', "");
  };

  $scope.signOut();

  $http.get("users.json").then(function(response) {
        $scope.users = response.data;
        console.log($scope.users);
    });

  $scope.isNotExist = false;

  $scope.sign = function (login, passw) {
    $scope.isNotExist = false;
    for (var i = 0; i < $scope.users["Users"].length; i++) {
      if ($scope.users["Users"][i].login == login && $scope.users["Users"][i].password == passw) {
        localStorage.setItem('currentUser', JSON.stringify($scope.users["Users"][i]));
        location.href = "#table";
        return;
      };
    };
    $scope.isNotExist = true;
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
  $scope.id;

  $http.get("employees.json").then(function(response) {
    for (var i = 0; i < response.data["Employees"].length; i++) {
      $scope.employList.push(response.data["Employees"][i]);
      };
    console.log($scope.employList);
    });

  $scope.getId = function() {
    $scope.id = $scope.employList[$scope.employList.length-1].Id;
  };

  $scope.showHelp = false;

  $scope.save = function (name, surname, position) {
    if (!name || !surname || !position) {
      $scope.showHelp = true;
      return;
    };
    $scope.getId();
    var newObj = {
      "Id": $scope.id + 1,
      "firstName": name,
      "secondName": surname,
      "position": position
    };
    $http({method: 'POST',
    url: "/employees",
    headers: {
      'Content-Type': 'application/json'
    },
    data: newObj}).then(function (response) {
      employList.push(response.data);
    });
  };

});
