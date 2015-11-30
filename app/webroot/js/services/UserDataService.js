enviroHubApp.factory('UserDataService', function ($http, $q, PubSubService, SessionService){
  var service = {};
  var id = undefined;
  var data = undefined;

  service.getUserDevices = function (){
    var deferred = $q.defer();
    id = id || SessionService.getUserId();
    if (id == undefined){
      deferred.reject("Fail");
      return deferred.promise;
    }

    $http({
      method : "GET",
      url    : '/api/users',
      params : {
        user_id: id
      }
    }).success(function(dt){
      deferred.resolve(dt.devices);
    });
    return deferred.promise;
  }

  return service;
});
