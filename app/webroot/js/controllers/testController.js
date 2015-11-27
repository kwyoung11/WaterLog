enviroHubApp.controller('testController', function($scope, WaterServicesService, WeatherService) {

  $scope.pageClass = "page-test";
  $scope.multipleDeviceData = null;
  $scope.singleDeviceData = null;
  $scope.dataDevices = null;
  $scope.dataParameters = null;
  $scope.dataWeather = null;

  /* Get Request Data - Multiple Device/Data Point Information
   * startDt and endDt parameters override dates
   * If no value supplied then current data used
   */
  $scope.getMultipleDeviceData = function() {
    // Call to External Water Data
    WaterServicesService.getData($scope.startDT, $scope.endDT).then(function(response) {
      var data = response;
      $scope.multipleDeviceData = data.multipleDeviceData;
      $scope.dataDevices = data.devices;
      $scope.dataParameters = data.parameters;

      // Call to Weather Service - After data
      WeatherService.getData($scope.multipleDeviceData,$scope.startDT, $scope.endDT).then(function(response) {
        var appendWeather = response;
        $scope.multipleDeviceData = appendWeather.weatherData;
        // weather service call
        console.log(JSON.stringify($scope.multipleDeviceData));
      });
    });
  };

/*
  $scope.getWeather = function() {
    var arrayToAppend = $scope.multipleDeviceData;
    WeatherService.getData(arrayToAppend,$scope.startDT, $scope.endDT).then(function(response) {
      var data = response;
      $scope.dataWeather = data.weatherData;
      // weather service call
      console.log(JSON.stringify($scope.dataWeather));
    });
  };
*/
  $scope.getSingleDeviceData = function() {
    WaterServicesService.getData($scope.startDT, $scope.endDT, $scope.singleDeviceID).then(function(response) {
      var data = response;
      $scope.multipleDeviceData = data.multipleDeviceData;
      $scope.dataDevices = data.devices;
      $scope.dataParameters = data.parameters;
      $scope.singleDeviceData = data.singleDeviceData;
      console.log(JSON.stringify($scope.singleDeviceData));
    });
  };

  /* Get Request Data - Single Device/Data Point Information
   * startDt and endDt parameters override dates (current date if none provided)
   * singleDeviceID - filter on deviceID
   */
  $scope.getSingleDeviceData = function() {
    WaterServicesService.getData($scope.startDT, $scope.endDT, $scope.singleDeviceID).then(function(response) {
      var data = response;
      $scope.multipleDeviceData = data.multipleDeviceData;
      $scope.dataDevices = data.devices;
      $scope.dataParameters = data.parameters;
      $scope.singleDeviceData = data.singleDeviceData;
      console.log(JSON.stringify($scope.singleDeviceData));
    });
  };

  $scope.getDevices = function() {
    console.log(JSON.stringify($scope.dataDevices));
    return $scope.dataDevices;
  };

  $scope.getParameters = function() {
    console.log(JSON.stringify($scope.dataParameters));
    return $scope.dataParameters;
  };

});
