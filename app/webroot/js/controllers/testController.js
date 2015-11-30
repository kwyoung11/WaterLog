enviroHubApp.controller('testController', function($scope, WaterServicesService, WeatherService) {

  $scope.pageClass = "page-test";
  $scope.multipleDeviceData = null;
  $scope.singleDeviceData = null;

  /* Get Request Data - Multiple Device/Data Point Information
   * startDt and endDt parameters override dates
   * If no value supplied then current date used
   */
  $scope.getMultipleDeviceData = function() {
    // Call to External Water Data
    WaterServicesService.getData($scope.startDT, $scope.endDT).then(function(response) {
      var data = response;
      $scope.multipleDeviceData = data.multipleDeviceData;

      // Call to Weather Service - After data
      var isMultipleDevices = true;
      WeatherService.getData($scope.multipleDeviceData, $scope.startDT, $scope.endDT, isMultipleDevices).then(function(response) {
        var appendWeather = response;
        $scope.multipleDeviceData = appendWeather.weatherData;

        // weather service call
        // console.log(JSON.stringify($scope.multipleDeviceData));
      });
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
      $scope.singleDeviceData = data.singleDeviceData;

      // Call to Weather Service - After data
      var isMultipleDevices = false;
      WeatherService.getData($scope.singleDeviceData, $scope.startDT, $scope.endDT, isMultipleDevices).then(function(response) {
        var appendWeather = response;
        $scope.singleDeviceData = appendWeather.weatherData;

        // weather service call
        console.log(JSON.stringify($scope.singleDeviceData));
      });
    });
  };

});
