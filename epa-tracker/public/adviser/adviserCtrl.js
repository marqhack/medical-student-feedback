//Angular controller for the adviser view
//Contributions from Nick, Grant, Tommy

angular.module('appControllers').controller('adviserCtrl', ['$scope', '$routeParams','$http','$location','cookieService', function($scope, $routeParams, $http, $location,cookieService){

  $scope.id = $routeParams.id;
  $scope.threshold = 3;
  $scope.reverse = true;
  $scope.property = 'regressed';
  $scope.gradyears = [];
  $scope.allyears = [1,2,3,4];

  var userCookie = cookieService.getCookie('user');

  if(!userCookie){
    $location.url('/login');
  }
  else{
    cookieService.isAuthorized(userCookie, $scope.id).then(function(auth){
      if(!auth){
        $location.url('/unauthorized');
      }
    });
  }
  $http({
    method: 'GET',
    url: '/users/'+$scope.id,
  }).then(function successCallback(response) {
    $scope.adviser = response.data[0].fname + ' ' + response.data[0].lname;
    if (response.data[0].permissions == 1){
      $http({
        method: 'GET',
        url: '/adviser/'+$scope.id+'/advisees'
      }).then(function successCallback(response) {
        $scope.advisees = response.data;
        $scope.advisees.forEach(function(element){

          if($.inArray(element.year,$scope.gradyears) == -1) {
            $scope.gradyears.push(element.year);
          }

          element['improved'] = 0;
          element['regressed'] = 0;
          $http({
            method: 'GET',
            url: '/student/'+element.uid.toString()+'/summary'
          }).then(function successCallback(response) {
              $scope.currentEPAs = response.data;
              element['average'] = 0
              $scope.currentEPAs.forEach(function(element2){
                element['average'] += element2.newval;

                $http({
                  method: 'GET',
                  url: '/tests/'+element.uid+'/'+element2.epaid
                }).then(function successCallback(response) {
                  if(response.data.length != 0){
                    var total = 0;
                    response.data.forEach(function(element3){
                      total+=element3.newval;
                    });

                    var avgTemp = total/response.data.length;

                    if(element2.newval - avgTemp < -0.4){
                      element['regressed']++;

                    }
                    else if(element2.newval - avgTemp > 0.4){
                      element['improved']++;
                    }
                  }
                }, function errorCallback(response) {
                  console.log("error")
                });

              });
              element['average'] = (element['average']/$scope.currentEPAs.length).toPrecision(3);

          }, function errorCallback(response) {
              console.log("error")
          });

        });

        $scope.gradyears.sort();
      }, function errorCallback(response) {
        console.log("error")
      });
    }
    else{
      var view = '/'+$scope.id;
      $location.url(view);
    }
  }, function errorCallback(response) {
    console.log("error getting adviser")
  });

  $scope.curfilter = undefined;

  $scope.changeFilter = function(vari){
    if(vari == 0){
      $scope.curfilter = undefined;
    }
    else if($scope.gradyears.indexOf(vari) != -1){
      $scope.curfilter = vari;
    }
  }

  $scope.sortBy = function(propertyName){
    if ($scope.property == propertyName){
      $scope.reverse = !$scope.reverse;
    }
    else{
      $scope.reverse = true;
    }
    $scope.property = propertyName;
  };

  $scope.displayHelp = function(event){
    if(event.target.id == "adviserHelp"){
      $scope.helpText = "This section allows advisers to see a list of their students." +
      "\r\n\r\nClick on a field to sort by that field. Students with high numbers of improved or regressed EPAs will appear highlighted. The number of improved and regressed is calculated by comparing the student's most recent examination to the average of the 10 most recent examinations for each EPA.\r\n\r\nClicking on a student's name will take you to the student's dashboard.";
    }
  }

}]);
