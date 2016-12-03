angular.module('appControllers').controller('modalCtrl', ['$scope','userService', function($scope,userService){
  $scope.submit = function(){
    userService.logIn(this.user,this.password)
  };
}]);
