var DataService = function ($){
  //var request = $.get("http://vache.cs.umd.edu/api/devices?device_id=1");

  this.getpHData = function (deviceID){

    var request = $.get("/api/devices?device_id=" + deviceID);
    var deferred = $.Deferred();
    request.success(function(dt){
      console.log(dt);
      var data = [];
      for (var i = 0; i < dt.length; i++){
        data.push({time: dt[i].created_at, value: dt[i].values[0]});
      }
      deferred.resolve(data);
    });
    return deferred;
  }

  this.getTurbidityData = function (deviceID){
    var request = $.get("/api/devices?device_id=" + deviceID);
    var deferred = $.Deferred();
    request.success(function(dt){
      var data = [];
      for (var i = 0; i < dt.length; i++){
        data.push({time: dt[i].created_at, value: dt[i].values[1]});
      }
      deferred.resolve(data);
    });
    return deferred;
  }

  this.getTemperatureData = function (deviceID){
    var request = $.get("/api/devices?device_id=" + deviceID);
    var deferred = $.Deferred();
    request.success(function(dt){
      var data = [];
      for (var i = 0; i < dt.length; i++){
        data.push({time: dt[i].created_at, value: dt[i].values[2]});
      }
      deferred.resolve(data);
    });
    return deferred;
  }

    this.getTemperatureDataWithDates = function (deviceID, startDate, endDate){
    var request = $.get("/api/devices?device_id=" + deviceID);
    var deferred = $.Deferred();
    request.success(function(dt){
      var data = [];
      for (var i = 0; i < dt.length; i++){
        var d = new Date(dt[i].created_at);
        var comparisonStart = d.getTime() >= startDate.getTime();
        var comparisonEnd = d.getTime() <= endDate.getTime();
        if( comparisonStart && comparisonEnd){
          data.push({time: dt[i].created_at, value: dt[i].values[2]});
        }
      }
      deferred.resolve(data);
    });
    return deferred;
  }

    this.getTurbidityDataWithDates = function (deviceID, startDate, endDate){
    var request = $.get("/api/devices?device_id=" + deviceID);
    var deferred = $.Deferred();
    request.success(function(dt){
      var data = [];
      for (var i = 0; i < dt.length; i++){
        var d = new Date(dt[i].created_at);
        var comparisonStart = d.getTime() >= startDate.getTime();
        var comparisonEnd = d.getTime() <= endDate.getTime();
        if( comparisonStart && comparisonEnd){
          data.push({time: dt[i].created_at, value: dt[i].values[1]});
        }
      }
      deferred.resolve(data);
    });
    return deferred;
  }

  this.getpHDataWithDates = function (deviceID, startDate, endDate){

    var request = $.get("/api/devices?device_id=" + deviceID);
    var deferred = $.Deferred();
    request.success(function(dt){
      var data = [];
      for (var i = 0; i < dt.length; i++){
        var d = new Date(dt[i].created_at);
        var comparisonStart = d.getTime() >= startDate.getTime();
        var comparisonEnd = d.getTime() <= endDate.getTime();
        if( comparisonStart && comparisonEnd){
          data.push({time: dt[i].created_at, value: dt[i].values[0]});
        }
      }
      deferred.resolve(data);
    });
    return deferred;
  }

  return {
    getpHData : getpHData,
    getTemperatureData : getTemperatureData,
    getTurbidityData : getTurbidityData,
    getTemperatureDataWithDates : getTemperatureDataWithDates,
    getTurbidityDataWithDates : getTurbidityDataWithDates,
    getpHDataWithDates : getpHDataWithDates
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
