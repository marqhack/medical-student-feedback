//Controller for the topmost navigation bar
//Contributions from Nick, Tommy

angular.module('appControllers').controller('navbarCtrl', ['$scope','cookieService', '$location','$http', function($scope,cookieService, $location,$http){
  $scope.logout = logout;
  $scope.gotoHome = gotoHome;
  $scope.goBack = goBack;
  $scope.gotoFAQ = gotoFAQ;
  $scope.cookieID = cookieService.getCookie('user');

  gotoHome();

  function logout(){
    cookieService.deleteCookie('user');
    $location.url('/login');
  }

  function gotoHome(){
    $scope.cookieID = cookieService.getCookie('user');

    if(!$scope.cookieID){
      $location.url('/login');
    }
    else{
      $http({
        method: 'GET',
        url: '/users/'+$scope.cookieID,
      }).then(function successCallback(response) {

        if (response.data[0].permissions == 1){
          $location.url('/adviser/'+$scope.cookieID);
        }
        else{
          $location.url('/'+$scope.cookieID);
        }
      }, function errorCallback(response){
        console.log("Error getting user "+$scope.cookieID);
      });
    }
  }

  function gotoFAQ(){
    $location.url('/faq');
  }

  function goBack(){
    $scope.cookieID = cookieService.getCookie('user');
    var route = $location.path().split('/');

    $http({
      method: 'GET',
      url: '/users/'+$scope.cookieID,
    }).then(function successCallback(response) {
      //Check to see if the user is an adviser or not
      if (response.data[0].permissions == 1){

        //Check if adviser is in the details view (/id/details/epa)
        if(route.length == 4){
          $location.url('/'+route[1]);
        }

        //Check if adviser is in the student dashboard view (/id)
        else if(route.length == 2){
          $location.url('/adviser/'+$scope.cookieID);
        }
      }

      else{
        //check to see if the student is in details view or not
        if(route.length == 4){
          $location.url('/'+$scope.cookieID);
        }
      }
    }, function errorCallback(response){
      console.log("Error getting user "+$scope.cookieID);
    });
  }

}]);
