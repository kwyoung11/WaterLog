  var DeviceDataService = function ($){
        var latest_device_data = [];

        var requests = [];
        var deviceInformation = {};

        var devices_request = $.Deferred();
        var request = $.Deferred();

        $.get("/api/device?location=36.1,25.1&radius=1000000")
        .success(function(response){
          for (var i = 0; i < response.length; i++){
            deviceInformation[response[i].id] = response[i];
            var x = $.get("/api/devices", { device_id: response[i].id, latest_record: true });
            requests.push(x);
          }
          devices_request.resolve(response);
          $.when.apply($, requests).then(function(_){
            var data = [];
            for (var i = 0; i < arguments.length; i++){
              data.push(arguments && arguments[i] && arguments[i][0] && arguments[i][0][0]);
            }
            for (var i = 0; i < data.length; i++){
              var dt = {};
              for (var j = 0; j < data[i].keys.length; j++){
                dt[data[i].keys[j].toLowerCase()] = parseFloat(data[i].values[j]).toPrecision(3);
              }
              latest_device_data.push({
                lat: parseFloat(deviceInformation[data[i].device_id].latitude),
                lon: parseFloat(deviceInformation[data[i].device_id].longitude),
                name: deviceInformation[data[i].device_id].name,
                data: dt
              });
            }
            request.resolve(latest_device_data);
          });
        });
        // for(i = 0; i < device.value.length; i++){
        //    console.log(device.value[i].values[0]);
        // }
        // device.devices={"devices":[
        // {"deviceName": "d1", "temp": 77, "lat": 38.9929846 , "lng": -76.9468502},
        // {"deviceName": "d2", "temp": 82, "lat": 38.9943243 , "lng": -76.9434234},
        // {"deviceName": "d3", "temp": 63, "lat": 38.9912345 , "lng": -76.9422222},
        // {"deviceName": "d4", "temp": 44, "lat": 38.9933333 , "lng": -76.9476543},
        // {"deviceName": "d5", "temp": 55, "lat": 38.9954545 , "lng": -76.9245466},
        // ]};
        // return device;
        //var ph = [{name:"John", lat:38.9929846, lon:-76.9468502, data:{ph:3.0, temperature: 88.5, turbidity: 7.0},date:"2015-11-22"}, {name:"Mara", lat:38.9943243, lon:-76.9434234, data:{ph:4.5, temperature: 70.3, turbidity: 3.0}, date:"2015-11-21"} ];
        //var request = $.get("http://vache.cs.umd.edu/api/devices?device_id=1");
        var getphData = function (){
            var deferred = $.Deferred();
            request.then(function(dt){
                var data = [];
                // console.log(ph);
                for (var i = 0; i < dt.length; i++){
                  if ( dt[i].data["pH".toLowerCase()] )
                    data.push({
                      name: dt[i].name,
                      lat: dt[i].lat,
                      lon: dt[i].lon,
                      data: dt[i].data["pH".toLowerCase()]
                    });
                }
                deferred.resolve(data);
            });
            return deferred;
        }


        var gettempData = function (){
            var deferred = $.Deferred();
            request.then(function(dt){
                var data = [];
                // console.log(ph);
                for (var i = 0; i < dt.length; i++){
                  if ( dt[i].data["temperature".toLowerCase()] )
                    data.push({
                      name: dt[i].name,
                      lat: dt[i].lat,
                      lon: dt[i].lon,
                      data: dt[i].data["temperature".toLowerCase()]
                    });
                }
                // console.log(data);
                deferred.resolve(data);
            });
            return deferred;
        }

        var getturbData = function (){
            var deferred = $.Deferred();
            request.then(function(dt){
                var data = [];
                // console.log(ph);
                for (var i = 0; i < dt.length; i++){
                  if ( dt[i].data["turbidity".toLowerCase()] )
                    data.push({
                      name: dt[i].name,
                      lat: dt[i].lat,
                      lon: dt[i].lon,
                      data: dt[i].data["turbidity".toLowerCase()]
                    });
                }
                // console.log(data);
                deferred.resolve(data);
            });
            return deferred;
        }

        var getAllDevices = function(){
          return devices_request;
        }

        var getData = function(){
          return request;
        }

        return{
          getAllDevices: getAllDevices,
          getData: getData,
          getphData : getphData,
          gettempData : gettempData,
          getturbData : getturbData
        }

    }(jQuery);
