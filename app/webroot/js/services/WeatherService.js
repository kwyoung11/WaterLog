var WeatherService = function($) {

  // Data
  var weatherData = [];

  /* Request Thirdparty Data
   * dataArray -> External Water Data Single or multiple
   * For Current Date - Ommit parameters
   *
   */
  var getData = function(dataArray, startDT, endDT, isMultipleDevices) {
    var deferred = $.Deferred();
    // Default GetRequest Parameters
    lat = '38.3184722';
    lon = '-76.0885556';
    var coordinates = lat + "," + lon + ",";

    $.ajax({
      url: "//api.worldweatheronline.com/premium/v1/past-weather.ashx",
      method: "GET",
      data: {
        q: coordinates,
        tp: '24',
        key: '6a84cb44929303c283f70d8c7f7ec',
        format: 'json',
        date: startDT,
        endDate: endDT
      }
    }).success(function(data) {
      // Format Data and Get Data Objects
      weatherData = formatWeatherData(data);

      if (isMultipleDevices) {
        weatherData = getMultipleDeviceData(dataArray, weatherData);
      } else {
        weatherData = getSingleDeviceData(dataArray, weatherData);
      }
      // output Data
      var outputData = {
        'weatherData': weatherData
      };
      deferred.resolve(outputData);

    }).error(function() {
      alert("error");
      deferred.reject(error);
    });

    return deferred;
  };

  /**
   * Format From Weather api
   * Values Date, tempF
   **/
  function formatWeatherData(dataArray) {
    var output = [];
    var arr = dataArray.data.weather;

    for (var i = 0; i < arr.length; i++) {
      var dateString = arr[i].date;
      var tempF = arr[i].hourly[0].tempF;

      output.push({
        date: dateString,
        temp: tempF
      });
    }
    return output;
  }

  /**
  * Get Temperature for a date from weatherData array
  * Return null if not found
  **/
  function getTemp(data, dateString) {
    dateString = dateString.replace(/\b0(?=\d)/g, '');
    for (var i = 0; i < data.length; i++) {
      var dateString2 = data[i].date.replace(/\b0(?=\d)/g, '');
      if (dateString2 == dateString)
        return data[i].temp;
    }
    return null;
  }

  function getMultipleDeviceData(dataValues, weatherData) {
    for (var i = 0; i < dataValues.length; i++) {
      var dateString = dataValues[i].date;
      var temp = getTemp(weatherData, dateString);
      if (temp != null)
        dataValues[i].data.weatherTempF = temp;
    }
    return dataValues;
  }

  function getSingleDeviceData(dataValues) {
    for (var i = 0; i < dataValues.length; i++) {
      var data = dataValues[i].data;
      for (var j = 0; j < data.length; j++) {
        var dateString = dataValues[i].data[j].date;
        var temp = getTemp(weatherData, dateString);
        if (temp != null)
          dataValues[i].data[j].values.weatherTempF = temp;
      }
    }
    return dataValues;
  }

  return{
    getData : getData
  }

}(jQuery);
