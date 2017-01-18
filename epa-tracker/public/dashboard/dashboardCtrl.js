//Angular controller for the student dashboard view
//Contributions by Nick, Grant, Tommy

angular.module('appControllers').controller('dashboardCtrl', ['$scope','$routeParams','$http','cookieService','$location',function($scope,$routeParams,$http,cookieService,$location){

  $scope.id = $routeParams.id;
  $scope.summaryDeltas = {
    'Regressed' : [],
    'Even' : [],
    'Improved' : []
  }
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
    url: '/users/'+$routeParams.id,
  }).then(function successCallback(response) {
    $scope.name = response.data[0].fname + " " + response.data[0].lname;
    $scope.year = response.data[0].year;
    $scope.email = response.data[0].email;
  }, function errorCallback(response) {
    console.log("error loading user "+$routeParams.id);
  });

  $http({
    method: 'GET',
    url: '/student/'+$routeParams.id+'/summary'
  }).then(function successCallback(response) {
      $scope.currentEPAs = response.data;
      $scope.graphData = {
        '1' : [],
        '2' : [],
        '3' : [],
        '4' : []
      };

      $scope.currentEPAs.forEach(function(element){
        var temp = element.newval;
        $scope.graphData[temp].push(element.epaid);

        $http({
          method: 'GET',
          url: '/tests/'+$routeParams.id+'/'+element.epaid
        }).then(function successCallback(response) {
          if(response.data.length != 0){
            var total = 0;
            response.data.forEach(function(element){
              total+=element.newval;
            });

            var avgTemp = total/response.data.length;

            if(element.newval - avgTemp < -0.4){
              $scope.summaryDeltas.Regressed.push(element.epaid);
            }
            else if(element.newval - avgTemp > 0.4){
              $scope.summaryDeltas.Improved.push(element.epaid);
            }
            else{
              $scope.summaryDeltas.Even.push(element.epaid);
            }
          }
        }, function errorCallback(response) {
          console.log("error")
        });

      });

      $('#chart').highcharts({
          chart: {
              type: 'column',
              backgroundColor:'transparent'
          },
          title: {
              text: 'EPAs by Level of Entrustability',
              style: {
                fontSize: '24px'
              }
          },
          xAxis: {
              type: 'category'
          },
          yAxis: {
              title: {
                  text: ''
              }

          },
          legend: {
              enabled: false
          },
          plotOptions: {
              series: {
                  states: {
                      hover: {
                          enabled: false
                      }
                  },
                  borderWidth: 0,
                  dataLabels: {
                      enabled: true,
                      format: '{point.y}'
                  }
              }
          },

          tooltip: {
            enabled: false
              //headerFormat: '<span style="font-size:20px">{series.name}</span><br>',
              //pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> EPAs<br/></span> <b>'
          },

          series: [{
              name: 'EPAs in this level',
              colorByPoint: true,
              data: [{
                  name: 'Pre Entrustable (Early learner)',
                  y: $scope.graphData[1].length,
                  color: '#7E57C2'
                  //drilldown: 'Pre Entrustable'
              }, {
                  name: 'Direct Supervision',
                  y: $scope.graphData[2].length,
                  color: '#7E57C2'
                  //drilldown: 'Level 2'
              }, {
                  name: 'Indirect Supervision',
                  y: $scope.graphData[3].length,
                  color: '#7E57C2'
                  //drilldown: 'Level 3'
              }, {
                  name: 'Entrustable (Independent)',
                  y: $scope.graphData[4].length,
                  color: '#7E57C2'
                  //drilldown: 'Entrustable'
              }]
          }],
          credits: {
            enabled: false
          }
      });
      // Apply the theme
      Highcharts.setOptions(Highcharts.theme);
    }, function errorCallback(response) {
      console.log("error")
  });

  //Modal Text
  $scope.helpText = "This is placeholder text"
  $scope.displayHelp = function(event){
    if(event.target.id == "chartHelp"){
      $scope.helpText = "This section displays a bar graph of the levels of the student's EPAs. EPAs can be scored in a range from 1 to 4.\r\n\r\nLevel 1 (Pre-Entrustable): Unable to properly perform the EPA.\r\nLevel 2 (Direct Supervision): Direct supervision is required when performing an EPA.\r\nLevel 3 (Indirect Supervision): Does not need direct supervision to perform an EPA.\r\nLevel 4 (Entrustable): Routinely able to perform an EPA at a proficient level without supervision.\r\n\r\nStudents in lower grade levels are expected to get lower mastery levels for their EPAs.";
    }
    if(event.target.id == "regHelp"){
      $scope.helpText = "This section details the number of EPAs that have regressed or improved compared to the average of the last 10 examinations in each EPA level.";
    }
    if(event.target.id == "listHelp"){
      $scope.helpText = "This section is a detailed combination of the above two; EPAs are listed based on mastery level and improvements and regressions are indicated." +
        "\r\n\r\nClick on an EPA to show the details page for that EPA.";
    }
  }
}]);
