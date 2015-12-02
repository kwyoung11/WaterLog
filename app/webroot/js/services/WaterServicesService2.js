var WaterServicesService = function($) {
  // Data
  var devices = [];
  var parameters = [];
  var dataValues = [];

  /* Request Thirdparty Data
   * For Current Date - Ommit parameters
   * For no sinleID needed - Ommit parameter
   */
   var getData = function(startDT, endDT, singleID) {
    var deferred = $.Deferred();
    // Default GetRequest Parameters
    var parameterCd = '00010,00400';
    var state = 'md';

    var today = new Date();
    var yestarday = new Date();
    var todayStart = new Date();
    todayStart.setDate(today.getDate() -2);
    yestarday.setDate(today.getDate() - 1);

    if (startDT === undefined || endDT === undefined ||
      !startDT.trim() || !endDT.trim()) {
      startDT = todayStart.toJSON().slice(0, 10);
      endDT = yestarday.toJSON().slice(0, 10);
    }

    var url = externalWaterURL(state, parameterCd, startDT, endDT);
  //  console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onload = function() {
      // Format Data and Get Data Objects
      var data = jQuery.parseJSON(xhr.response);

      var waterData = parseExternalWater(data);
      devices = waterData.devices;
      parameters = waterData.parameters;
      dataValues = waterData.dataValues;

      // Get Single Device Data
      var singleDeviceData = [];
      if (singleID !== undefined) {
        singleDeviceData = getDataSingle(singleID);
      }

      // output Data
      var outputData = {
        "devices": devices,
        "parameters": parameters,
        "multipleDeviceData": dataValues,
        "singleDeviceData": singleDeviceData
      };

      deferred.resolve(outputData);
    };

    xhr.onerror = function() {
      deferred.reject(xhr.response);
    }
    return deferred;
}

  /**
   * Get Device data from deviceID
   * Format Single Device/Data Point information
   */
  function getDataSingle(id) {
    // Get Data Values
    var singleDevice = [];

    for (var i = 0; i < dataValues.length; i++) {
      var x = dataValues[i];

      if (x.deviceID == id) {
        // add device
        if (singleDevice.length == 0) {
          singleDevice.push({
            deviceID: x.deviceID,
            name: x.name,
            lat: x.lat,
            lon: x.lon,
            data: []
          });
        }
        // add data
        singleDevice[0].data.push({
          date: x.date,
          values: x.data
        });
      }
    }
    return singleDevice;
  };


  function externalWaterURL(state, waterParams, startDT, endDT) {
  var baseURL = "http://waterservices.usgs.gov/nwis/";
  var dataType = "dv"; //dv => daily values, iv => All data (too much)
  var format = "json"; // use rdb for easy to view in browswer, JSON available as well
  var indent = "off";
  var url = baseURL.concat(dataType,"/?format=",format,"&indent=",indent,"&stateCd=",state,
                                "&startDT=",startDT,"&endDT=",endDT,"&parameterCd=",waterParams);

  return url;
}

  /**
   *  Parse the Water JSON File -
   *  Output JSON {device:[], paramter:[], dataValuesGrouped:[] }
   */
  function parseExternalWater(data) {
    var statisticCodeFilter = "00001"; // Daily Values calculated with different statistics code.
    var out = "";
    var counter = 0;
    var dataValuesOut = [];
    var siteValuesOut = [];
    var parameterValuesOut = [];
    var arrayOut = [];

    // Loop Through TimeSeries Array
    for (var i = 0; i < data['value'].timeSeries.length; i++) {
      // Json Array Base Elements
      var siteElements = data['value'].timeSeries[i].sourceInfo;
      var parameterElements = data['value'].timeSeries[i].variable;
      var dataValues = data['value'].timeSeries[i].values[0];

      // Get data values from base Elements
      var deviceID = siteElements.siteCode[0].value;
      var deviceName = siteElements.siteName;
      var devicelat = parseFloat(siteElements.geoLocation.geogLocation.latitude);
      var devicelong = parseFloat(siteElements.geoLocation.geogLocation.longitude);
      // Parameter Values
      var parameterCode = parameterElements.variableCode[0].value;
      var parameterName = parameterElements.variableName;
      var parameterDescription = parameterElements.variableDescription;
      var statisticCode = parameterElements.options.option[0].optionCode;

      var parameterSystemName = '';
      if (parameterCode == '00010') {
        parameterSystemName = 'PH';
      } else if (parameterCode == '00400') {
        parameterSystemName = 'temperature';
      } else if (parameterCode == '00000') {
        parameterSystemName = 'turbidity';
      }

      // Push parameters to array
      var insertParameter = {
        parameterCode: parameterCode,
        parameterSystemName: parameterSystemName,
        parameterName: parameterName,
        parameterDescription: parameterDescription
      }
      parameterValuesOut.pushIfNotExist(insertParameter, function(e) {
        return e.parameterCode === insertParameter.parameterCode;
      });

      // Push Site Details to device array
      var insertSite = {
        deviceID: deviceID,
        name: deviceName,
        lat: devicelat,
        lon: devicelong
      }
      siteValuesOut.pushIfNotExist(insertSite, function(e) {
        return e.deviceID === insertSite.deviceID;
      });

      // Filter by dialy code statistic
      if (statisticCode == statisticCodeFilter) {
        // Get Values Data From Array
        var valuesArray = "";
        for (var j = 0; j < dataValues.value.length; j++, counter++) {
          var value = parseFloat(dataValues.value[j].value);
          var dateTime = dataValues.value[j].dateTime;
          var date = new Date(dateTime);
          var dateString = (date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate());

          // add data Values
          dataValuesOut.push({
            //  id: counter,
            deviceID: deviceID,
            name: deviceName,
            lat: devicelat,
            lon: devicelong,
            parameterCode: parameterSystemName,
            dataValue: value,
            date: dateString
          });
        }
      }
    }

    // Group the Data Values for output
    var dataValuesGrouped = groupExternalWater(dataValuesOut);

    // Return Object
    return {
      "devices": siteValuesOut,
      "parameters": parameterValuesOut,
      "dataValues": dataValuesGrouped
    };
  };

  /** Groups Water Data by device and date. Places data values in array.
   *  Mulitple data values per single record.
   */
  function groupExternalWater(data) {
    // Group Data
    var result = groupBy(data, function(item) {
      return [item.deviceID, item.date];
    });

    var arrGrouped = [];
    for (var i = 0; i < result.length; i++) {
      var arr = result[i];

      var tempValues = [];
      for (var j = 0; j < arr.length; j++)
        tempValues.push(arr[j].parameterCode, arr[j].dataValue);

      // Conver temp to key->value pair
      var tempPair = {};
      for (var ii = 0; ii < tempValues.length; ii += 2)
        tempPair[tempValues[ii]] = tempValues[ii + 1];

      arrGrouped.push({
        deviceID: arr[0].deviceID,
        name: arr[0].name,
        lat: arr[0].lat,
        lon: arr[0].lon,
        data: tempPair,
        date: arr[0].date
      });
    }

    return arrGrouped;
  };

  /**
   * Filter object from a field == codeString
   *
   **/
  function getObject(jsObject, field, codeString) {
    var found;
    jsObject.some(function(obj) {
      if (obj[field] == codeString) {
        found = obj;
        return true;
      }
    });

    return found;
  }


  /**
   * Auxiliary Function - Group Array Elements
   * Usage Example:
   * var result = groupBy(list, function(item) {
   *  return [item.deviceID, item.date]; });
   ***/
  function groupBy(array, f) {
    var groups = {};
    array.forEach(function(o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function(group) {
      return groups[group];
    })
  };

  /****
   * Array Comparator for unique array insertion
   **/
  Array.prototype.inArray = function(comparer) {
    for (var i = 0; i < this.length; i++) {
      if (comparer(this[i])) return true;
    }
    return false;
  };

  /**
   * Use Comparator to push if unique
   */
  Array.prototype.pushIfNotExist = function(element, comparer) {
    if (!this.inArray(comparer)) {
      this.push(element);
    }
  };

  return{
    getData : getData
  }
}(jQuery);
