angular.module('myApp').factory('userService', ['$http', function ($http) {
  var User;

  var setUser = function (user) {
    if (angular.isObject(user))
      User = user;
  };

  var getUser = function () {
    if (angular.isObject(User)){
      return User;
    }
    else{
      return null;
    }
  };

  var logIn = function (username, password) {
    // $http call that validates the username and password.

    setUser({ user: username });
  };

  return {
    logIn: logIn,
    getUser: getUser
  };
}]);
