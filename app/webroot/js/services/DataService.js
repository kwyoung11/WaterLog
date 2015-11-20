enviroHubApp.service('DataService', function ($q, $http){
  var Rainfall = [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4];
  var SeaLevelPressure = [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7];
  var Temperature = [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6];

  this.getRainFallData = function(){
    var deferred = $q.defer();
    setTimeout(function(){
      deferred.resolve(Rainfall);
    }, 10);
    return deferred.promise;
  }

  this.getSeaLevelPressureData = function(){
    var deferred = $q.defer();
    setTimeout(function(){
      deferred.resolve(SeaLevelPressure);
    }, 10);
    return deferred.promise;
  }

  this.getTemperatureData = function(){
    var deferred = $q.defer();
    setTimeout(function(){
      deferred.resolve(Temperature);
    }, 10);
    return deferred.promise;
  }
});
