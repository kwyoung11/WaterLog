enviroHubApp.service('DataService', function ($q, $http){
  var pH = [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4];
  var turbidity = [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7];
  var temperature = [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6];

  var request = $http.get("http://vache.cs.umd.edu/api/devices?device_id=1");

  this.getpHData = function (){
    var deferred = $q.defer();
    request.success(function(dt){
      var data = [];
      for (var i = 0; i < dt.length; i++){
        data.push({time: dt[i].created_at, value: dt[i].values[0]});
      }
      deferred.resolve(data);
    });
    return deferred.promise;
  }

  this.getTurbidityData = function (){
    var deferred = $q.defer();
    request.success(function(dt){
      var data = [];
      for (var i = 0; i < dt.length; i++){
        data.push({time: dt[i].created_at, value: dt[i].values[1]});
      }
      deferred.resolve(data);
    });
    return deferred.promise;
  }

  this.getTemperatureData = function (){
    var deferred = $q.defer();
    request.success(function(dt){
      var data = [];
      for (var i = 0; i < dt.length; i++){
        data.push({time: dt[i].created_at, value: dt[i].values[2]});
      }
      deferred.resolve(data);
    });
    return deferred.promise;
  }

  // this.getTurbidityData = function(){
  //   var deferred = $q.defer();
  //   setTimeout(function(){
  //     deferred.resolve(turbidity);
  //   }, 10);
  //   return deferred.promise;
  // }
  //
  // this.getTemperatureData = function(){
  //   var deferred = $q.defer();
  //   setTimeout(function(){
  //     deferred.resolve(temperature);
  //   }, 10);
  //   return deferred.promise;
  // }
});
