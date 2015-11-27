enviroHubApp.service('WeatherService', function($q, $http) {

  // delete $http.defaults.headers.common['X-Requested-With'];

  // Data
  var weatherData = [];

  /* Request Thirdparty Data
   * For Current Date - Ommit parameters
   * For no sinleID needed - Ommit parameter
   */
  this.getData = function(dataArray, startDT, endDT, lat, lon) {
    var deferred = $q.defer();
    // Default GetRequest Parameters
    lat = '38.3184722';
    lon = '-76.0885556';

    // Date Conversion
    var unixTimeStart = new Date(startDT).getTime()/1000;
    var unixTimeEnd = new Date(endDT).getTime()/1000;

    $http({
      url: "//api.openweathermap.org/data/2.5/forecast",
      method: "GET",
      data: [],
      params: {
        lat: lat,
        lon: lon,
        APPID: '30fd80f42423a5b174d6a0e18a76e2ab',
        type: 'daily',
        start:unixTimeStart,
        end:unixTimeEnd
      }
    }).success(function(data) {
      // Format Data and Get Data Objects
      weatherData = formatWeatherData(data);
      weatherData = getMultipleDeviceData(dataArray, unixTimeStart, unixTimeEnd);

      // output Data
      var outputData = {
        'weatherData': weatherData
      };

      deferred.resolve(outputData);

    }).error(function() {
      alert("error");
      deferred.reject(error);
    });

    return deferred.promise;
  };

  function formatWeatherData(dataArray) {
    var output = [];
    var arr = dataArray.list;

    for (var i = 0; i < arr.length; i++) {
        var date = new Date(arr[i].dt_txt);
		    var dateString = (date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate());

        var temp = arr[i].main.temp;
        output.push({
        	date: dateString,
          temp: temp
         });
    }
    return output;
  }

  function getTemp(data, dateString) {
    for (var i = 0; i < data.length; i++) {
      if (data.date == dateString)
        return data.temp;
    }
    return null;
  }

  function getMultipleDeviceData(dataValues, startDT, endDT) {
    for (var i = 0; i < dataValues.length; i++) {
      var dateString = dataValues[i].date;
      var temp = getTemp(weatherData, dateString);
      if (temp != null)
        dataValues[i].data.weatherTemp = temp;
    }
    return dataValues;
  }

function getSingleDeviceData(array, startDT, endDT) {

}

});
