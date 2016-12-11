angular.module('appControllers',[]);
var myApp = angular.module('myApp', ['appControllers','ngRoute']);

//Routing
myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/:id', {
    templateUrl : '/dashboard/dashboard.html',
  })
  .when('/:id/details/:epa',{
    templateUrl : '/details/epa-details.html',
    caseInsensitiveMatch: true
  })
  .when('/adviser/:id',{
    templateUrl : '/adviser/adviser.html',
    caseInsensitiveMatch: true
  })
  /*.otherwise({
    redirectTo  : '/'
  });*/
}]);
