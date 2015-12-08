var DataService = function ($){
  //var request = $.get("http://vache.cs.umd.edu/api/devices?device_id=1");

  var getData = function (deviceID){
    var deferred = $.Deferred();
    if (deviceID == undefined) {
      deferred.reject("InvalidID");
      return;
    }

    var request = $.get("/api/devices?device_id=" + deviceID);
    request.success(function(dt){
      var data = [];
      for (var i = 0; i < dt.length; i++){
        for (var k = 0; k < dt[i].keys.length; k++){
          if (data[dt[i].keys[k]] == undefined)
            data[dt[i].keys[k]] = {data: [], unit: dt[i].units && dt[i].units[k]};
          data[dt[i].keys[k]].data.push({ time: dt[i].created_at.substring(0, 10), val: parseFloat(dt[i].values[k]).toPrecision(4) });
        }
      }

      for (var i in data){
        data[i].data.sort(function(a, b){
          return new Date(a.time) - new Date(b.time);
        });
      }

      deferred.resolve(data);
    });
    return deferred;
  };

  var getDataWithDates = function(deviceID, startDate, endDate){
    var deferred = $.Deferred();
    if (deviceID == undefined) {
      deferred.reject("InvalidID");
      return;
    }

    var request = $.get("/api/devices?device_id=" + deviceID);
    request.success(function(dt){
      var data = [];

      for (var i = 0; i < dt.length; i++){
        for (var k = 0; k < dt[i].keys.length; k++){
          if (data[dt[i].keys[k]] == undefined)
            data[dt[i].keys[k]] = {data: [], unit: dt[i].units && dt[i].units[k]};


          var d = new Date(dt[i].created_at);
          var comparisonStart = d.getTime() >= startDate.getTime();
          var comparisonEnd = d.getTime() <= endDate.getTime();
          if (comparisonStart && comparisonEnd){
            data[dt[i].keys[k]].data.push({ time: dt[i].created_at.substring(0, 10), val: parseFloat(dt[i].values[k]).toPrecision(4) });
          }
        }
      }

      for (var i in data){
        data[i].data.sort(function(a, b){
          return new Date(a.time) - new Date(b.time);
        });
      }

      deferred.resolve(data);
    });
    return deferred;
  }

  //
  // var getpHData = function (deviceID){
  //
  //   var request = $.get("/api/devices?device_id=" + deviceID);
  //   var deferred = $.Deferred();
  //   request.success(function(dt){
  //     var data = [];
  //     for (var i = 0; i < dt.length; i++){
  //       data.push({time: dt[i].created_at, value: dt[i].values[0]});
  //     }
  //     deferred.resolve(data);
  //   });
  //   return deferred;
  //
  // }
  //
  // var getTurbidityData = function (deviceID){
  //   var request = $.get("/api/devices?device_id=" + deviceID);
  //   var deferred = $.Deferred();
  //   request.success(function(dt){
  //     var data = [];
  //     for (var i = 0; i < dt.length; i++){
  //       data.push({time: dt[i].created_at, value: dt[i].values[1]});
  //     }
  //     deferred.resolve(data);
  //   });
  //   return deferred;
  // }
  //
  // var getTemperatureData = function (deviceID){
  //   var request = $.get("/api/devices?device_id=" + deviceID);
  //   var deferred = $.Deferred();
  //   request.success(function(dt){
  //     var data = [];
  //     for (var i = 0; i < dt.length; i++){
  //       data.push({time: dt[i].created_at, value: dt[i].values[2]});
  //     }
  //     deferred.resolve(data);
  //   });
  //   return deferred;
  // }
  //
  // var getTemperatureDataWithDates = function (deviceID, startDate, endDate){
  //   var request = $.get("/api/devices?device_id=" + deviceID);
  //   var deferred = $.Deferred();
  //   request.success(function(dt){
  //     var data = [];
  //     for (var i = 0; i < dt.length; i++){
  //       var d = new Date(dt[i].created_at);
  //       var comparisonStart = d.getTime() >= startDate.getTime();
  //       var comparisonEnd = d.getTime() <= endDate.getTime();
  //       if( comparisonStart && comparisonEnd){
  //         data.push({time: dt[i].created_at, value: dt[i].values[2]});
  //       }
  //     }
  //     deferred.resolve(data);
  //   });
  //   return deferred;
  // }
  //
  // var getTurbidityDataWithDates = function (deviceID, startDate, endDate){
  //   var request = $.get("/api/devices?device_id=" + deviceID);
  //   var deferred = $.Deferred();
  //   request.success(function(dt){
  //     var data = [];
  //     for (var i = 0; i < dt.length; i++){
  //       var d = new Date(dt[i].created_at);
  //       var comparisonStart = d.getTime() >= startDate.getTime();
  //       var comparisonEnd = d.getTime() <= endDate.getTime();
  //       if( comparisonStart && comparisonEnd){
  //         data.push({time: dt[i].created_at, value: dt[i].values[1]});
  //       }
  //     }
  //     deferred.resolve(data);
  //   });
  //   return deferred;
  // }
  //
  // var getpHDataWithDates = function (deviceID, startDate, endDate){
  //
  //   var request = $.get("/api/devices?device_id=" + deviceID);
  //   var deferred = $.Deferred();
  //   request.success(function(dt){
  //     var data = [];
  //     for (var i = 0; i < dt.length; i++){
  //       var d = new Date(dt[i].created_at);
  //       var comparisonStart = d.getTime() >= startDate.getTime();
  //       var comparisonEnd = d.getTime() <= endDate.getTime();
  //       if( comparisonStart && comparisonEnd){
  //         data.push({time: dt[i].created_at, value: dt[i].values[0]});
  //       }
  //     }
  //     deferred.resolve(data);
  //   });
  //   return deferred;
  // }

  return {
    getData: getData,
    getDataWithDates: getDataWithDates,
    // getpHData : getpHData,
    // getTemperatureData : getTemperatureData,
    // getTurbidityData : getTurbidityData,
    // getTemperatureDataWithDates : getTemperatureDataWithDates,
    // getTurbidityDataWithDates : getTurbidityDataWithDates,
    // getpHDataWithDates : getpHDataWithDates
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
}(jQuery);
