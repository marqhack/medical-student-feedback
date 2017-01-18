//Angular controller for the login view
//Contributions from Nick, Tommy

angular.module('appControllers').controller('loginCtrl', ['$scope','$http','cookieService','$location',function($scope,$http,cookieService,$location){
  $scope.checkLogin = checkLogin;

  function checkLogin(){
    var formLogin = $('#loginid').val();
    //console.log("2");

    $http({
      method: 'GET',
      url: '/users/'+formLogin,
    }).then(function successCallback(response) {
      if(response.data[0]){
        if (response.data[0].permissions == 1){
          $location.url('/adviser/'+formLogin);
        }
        else{
          $location.url('/'+formLogin);
        }

        cookieService.makeCookie('user',formLogin);
      }

    }, function errorCallback(response){
      console.log("Error getting user "+formLogin)
    });

  }
  //console.log(cookieService.getCookie('student'));
}]);
