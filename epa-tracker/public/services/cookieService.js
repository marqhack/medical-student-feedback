//Cookie service to check for currently logged in user
//Contributions from Nick, Tommy

angular.module('myApp').service('cookieService', ['$cookies','$http','$q', function ($cookies,$http,$q) {

  function getCookie(id){
    var myCookie;
    myCookie = $cookies.get(id);
    return myCookie;
  }

  function makeCookie(id,value){
    var myCookie;
    $cookies.put(id,value,{expires: undefined});
  }

  function deleteCookie(id){
    $cookies.remove(id);
  }

  function isAuthorized(cookieID, userID){
    var deferred = $q.defer();
    //check if cookieID matches userID
    if (cookieID == userID){
      deferred.resolve(true);
    }
    else{
       //check if cookieID is that of adviser
       //if true, check if userID is a student of that adviser
       $http({
         method: 'GET',
         url: '/users/'+cookieID,
       }).then(function successCallback(response) {

         if (response.data[0].permissions == 1){
           $http({
             method: 'GET',
             url: '/adviser/'+cookieID+'/advisees'
           }).then(function successCallback(response) {

             var advisees = response.data;
             advisees.forEach(function(element){
               if(element.uid == userID){
                 deferred.resolve(true);
               }
             });

             deferred.resolve(false);

           }, function errorCallback(response){
             console.log("Error getting advisees for adviser "+cookieID)
           });
         }
         else if(response.data[0].permissions == 2){
           deferred.resolve(true);
         }
         else{
           deferred.resolve(false);
         }
       }, function errorCallback(response) {
           console.log("Error getting user "+cookieID)
       });
    }
    return deferred.promise;
  }

  return{
    getCookie: getCookie,
    makeCookie: makeCookie,
    deleteCookie: deleteCookie,
    isAuthorized: isAuthorized
  };

}]);
