//Angular controller for the EPA details view
//Contributions by Nick, Grant, Tommy

angular.module('appControllers').controller('detailsCtrl', ['$scope','$routeParams','$http','cookieService','$location','$q',function($scope,$routeParams,$http,cookieService,$location,$q){

  $scope.epa = $routeParams.epa
  $scope.id = $routeParams.id;
  $scope.deltaText = "";
  $scope.deltaArrow = "even"
  $scope.mastery;
  $scope.testInfo = [];
  $scope.commentText = '';
  $scope.comments = [];

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
    url: '/epa/' + $scope.epa
    }).then(function successCallback(response) {
      $scope.epaDetails=response.data
    }, function errorCallback(response) {
      console.log("Error reading in EPA details : /details/"+$scope.epa)
  });

  $http({
    method: 'GET',
    url: '/student/'+$scope.id+'/summary'
  }).then(function successCallback(response) {
      $scope.currentEPAs = response.data;
      $scope.currentEPAs.forEach(function(element){
        if(element.epaid == $scope.epa){
          $scope.mastery = element.newval;
        }
      });

      $http({
        method: 'GET',
        url: '/tests/'+$scope.id+'/'+$scope.epa
      }).then(function successCallback(response) {
        if(response.data.length != 0){
          var total = 0;
          response.data.forEach(function(element){
            total+=element.newval;
          });

          var avgTemp = total/response.data.length;

          if($scope.mastery - avgTemp < -0.4){
            $scope.deltaText = 'Your level in this EPA has fallen compared to the average of the previous 10 examinations.';
            $scope.deltaArrow = 'down'
          }
          else if($scope.mastery - avgTemp > 0.4){
            $scope.deltaText = 'Your level in this EPA has risen compared to the average of the previous 10 examinations.'
            $scope.deltaArrow = 'up'
          }
          else{
            $scope.deltaText = 'Your level in this EPA has stayed the same compared to the average of the previous 10 examinations.';
            $scope.deltaArrow = 'even'
          }
        }
      }, function errorCallback(response) {
        console.log("error")
      });
  }, function errorCallback(response) {
    console.log("error in /users/:id/summary");
  });

  $http({
    method: 'GET',
    url: '/tests/'+$scope.id+'/'+$scope.epa
  }).then(function successCallback(response) {
    var tempres = response.data;
    var promises = [];

    for (i = 0; i < tempres.length; i++){
      promises.push($http({
        method: 'GET',
        url: '/comments/'+tempres[i].hid,
      }).then(function successCallback(response){
        return response.data
      },function errorCallback(error){
        console.log(error);
      }));

      if (i == tempres.length-1){
        tempres[i].delta = '';
      }
      else if(tempres[i].newval > tempres[i+1].newval){
        tempres[i].delta = 'up';
      }
      else if(tempres[i].newval < tempres[i+1].newval){
        tempres[i].delta = 'down';
      }
      else{
        tempres[i].delta = 'even';
      }

      var tempDate = tempres[i].examdate.split('-');
      tempres[i].examdate = tempDate[1] + "/" + tempDate[2].substring(0,2) + "/" + tempDate[0];
      $scope.testInfo.push(tempres[i]);
    }

    $q.all(promises).then(function(commentArray){
      $scope.comments = commentArray;
    })

    var testDates = []
    var testScores = []
    $.each($scope.testInfo, function(){
      testDates.push(this.examdate);
      testScores.push(this.newval);
    });

    $('#line-chart').highcharts({
      chart: {
        backgroundColor:'transparent'
      },
      title: {
          text: 'Recent Exam Trends',
          style: {
            fontSize: '24px'
          }
      },
      xAxis: {
          categories: testDates.reverse()
      },
      yAxis: {
          title: {
              text: 'Mastery Level',
              style: {
                fontSize: '18px'
              }
          },
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }],
          min: 1,
          max: 4,
          tickInterval: 1
      },
      credits: {
        enabled: false
      },
      series: [{
          //name: 'Tokyo',
          showInLegend: false,
          data: testScores.reverse()
      }]
    });
  }, function errorCallback(response) {
    console.log("error");
  });

  $scope.getComment = function(index){
    var testComments = $scope.comments[index];
    if(testComments.length == 0){
      $scope.commentText = 'There are no comments for this examination.'
    }
    else{
      $scope.commentText = '';
      testComments.forEach(function(element){
        $scope.commentText += element.body + '\r\n';
      });
    }

  }

  $scope.helpText = "This is placeholder text"
  $scope.displayHelp = function(event){
    if(event.target.id == "headerHelp"){
      $scope.helpText = "The arrow is calculated by taking the difference between the most recent examination in EPA " +$scope.epa+" and the average of the last 10 examinations. If the difference is within a threshold of 0.4 then no difference is recorded and an even arrow will be displayed. Any differences above the threshold will show the corresponding up or down arrow."
    }
    if(event.target.id == "examHelp"){
      $scope.helpText = "This section contains a list and line graph of the 10 most recent grades that have affected the EPA evaluation for a student." +
        "\r\n\r\nThe list items include the exam/rotation name and date, the evaluation and effect on EPA mastery level by that item, and a link to all comments for that item. The deltas are the trend between the test evaluation and the test evaluation directly before it.";
    }
    if(event.target.id == "checklistHelp"){
      $scope.helpText = "This section details the checklist of activities that an entrustable student is expected to be able to perform under EPA " + $scope.epa + ".";
    }
  }
}]);
