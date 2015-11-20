enviroHubApp.service("WaterServicesService", function ($http){
  this.getPHData = function(start, end){
    var deferred = $q.defer();
    $http({
      type:'get',
      url:'falksdjf',
      data: {
        format:"json",
        indent:"off",

      },
      success:function(data){
        format (data);
        deferred.resolve();
      }
    });
    return deferred.promise;
  }


  // this.getDevices = function(start, end) {
  // this.getParameters = function(start, end) {
  // this.getDeviceData = function(start, end) {
  // this.getTemperatureData = function(start, end) {
});
