angular.module('appControllers').controller('epa-details-controller', ['$scope','$routeParams','$http',function($scope,$routeParams,$http){
  $scope.epa = $routeParams.epa
  $scope.deltaText = "";
  $scope.deltaArrow = "even"
  $scope.mastery;
  $scope.testInfo = [];

  $http({
  method: 'GET',
  url: '/details/' + $scope.epa
  }).then(function successCallback(response) {
    $scope.epaDetails=response.data
  }, function errorCallback(response) {
    console.log("Error reading in EPA details : /details/"+$scope.epa)
  });

  $http({
    method: 'GET',
    url: '/users/'+$routeParams.id+'/summary'
  }).then(function successCallback(response) {
      $scope.currentEPAs = response.data;
      $scope.currentEPAs.forEach(function(element){
        if(element.epaid == $scope.epa){
          $scope.mastery = element.newval;
        }
      });

      $http({
        method: 'GET',
        url: '/tests/'+$routeParams.id+'/'+$scope.epa
      }).then(function successCallback(response) {
        if(response.data.length != 0){
          var total = 0;
          response.data.forEach(function(element){
            total+=element.newval;
          });

          var avgTemp = total/response.data.length;

          if($scope.mastery - avgTemp < -0.4){
            $scope.deltaText = 'Your level in this EPA has fallen since the last examination.';
            $scope.deltaArrow = 'down'
          }
          else if($scope.mastery - avgTemp > 0.4){
            $scope.deltaText = 'Your level in this EPA has risen since the last examination.'
            $scope.deltaArrow = 'up'
          }
          else{
            $scope.deltaText = 'Your level in this EPA has stayed the same since the last examination.';
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
    url: '/tests/'+$routeParams.id+'/'+$scope.epa
  }).then(function successCallback(response) {
    var tempres = response.data;

    for (i = 0; i < tempres.length; i++){
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

  // $scope.testInfo = [
  //   {
  //     'name' : 'Piedmont Health Services Rotation',
  //     'date' : 'May 05 2016',
  //     'score' : 95,
  //     'delta' : 'up',
  //     'newVal' : 3
  //   },
  //
  //   {
  //     'name' : 'Piedmont Health Services Rotation',
  //     'date' : 'April 25 2016',
  //     'score' : 79,
  //     'delta' : 'even',
  //     'newVal' : 2
  //   },
  //
  //   {
  //     'name' : 'Piedmont Health Services Rotation',
  //     'date' : 'Jan 09 2016',
  //     'score' : 65,
  //     'delta' : 'down',
  //     'newVal' : 2
  //   },
  //
  //   {
  //     'name' : 'Piedmont Health Services Rotation',
  //     'date' : 'Sept 14 2015',
  //     'score' : 90,
  //     'delta' : 'up',
  //     'newVal' : 3
  //   }
  // ];

  // var testDates = []
  // var testScores = []
  // $.each($scope.testInfo, function(){
  //   testDates.push(this.uploaded);
  //   testScores.push(this.newVal);
  // });
  //
  // $('#line-chart').highcharts({
  //   chart: {
  //     backgroundColor:'transparent'
  //   },
  //   title: {
  //       text: 'Recent Exam Trends',
  //       style: {
  //         fontSize: '24px'
  //       }
  //
  //   },
  //   xAxis: {
  //       categories: testDates.reverse()
  //   },
  //   yAxis: {
  //       title: {
  //           text: 'Mastery Level',
  //           style: {
  //             fontSize: '18px'
  //           }
  //       },
  //       plotLines: [{
  //           value: 0,
  //           width: 1,
  //           color: '#808080'
  //       }],
  //       min: 1,
  //       max: 4,
  //       tickInterval: 1
  //   },
  //   credits: {
  //     enabled: false
  //   },
  //   series: [{
  //       //name: 'Tokyo',
  //       showInLegend: false,
  //       data: testScores.reverse()
  //   }]
  // });

  $scope.helpText = "This is placeholder text"
  $scope.displayHelp = function(event){
    if(event.target.id == "headerHelp"){
      $scope.helpText = "This is the EPA details page for EPA" + $scope.epa + "." +
        "\r\nThis section shows a general overview of student progress on an EPA.";
    }
    if(event.target.id == "examHelp"){
      $scope.helpText = "This section contains a list and line graph of the 10 most recent grades that have affected the EPA evaluation for a student." +
        "\r\nThe list items include the exam/rotation name and date, the evaluation and effect on EPA mastery level by that item, and a link to all comments for that item.";
    }
    if(event.target.id == "checklistHelp"){
      $scope.helpText = "This section details the checklist of activities that an entrustable student is expected to be able to perform under EPA" + $scope.epa + ".";
    }
  }
}]);
