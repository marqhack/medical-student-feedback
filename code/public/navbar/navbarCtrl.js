angular.module('appControllers').controller('navbarCtrl', ['$scope', 'userService','$uibModal', function($scope,userService,$uibModal){
  var user = userService.getUser();

  if(user == null){
      //$dialog.dialog({}).open('loginModal.html');
      //console.log("#name")
    console.log("login");
    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'loginModal.html',
      controller: 'modalCtrl.js'
    });
    userService.logIn();
    user = userService.getUser();
  }

  $scope.username = user.username;

}]);
