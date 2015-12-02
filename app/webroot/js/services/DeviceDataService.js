  var DeviceDataService = function ($){
        // var device = {};
        var latest_device_data = [];

        var requests = [];
        var deviceInformation = {};
        var request = $.Deferred();

        $.get("http://vache.cs.umd.edu/api/device?location=36.1,25.1&radius=10000")
        .success(function(response){
          for (var i = 0; i < response.length; i++){
            deviceInformation[response[i].id] = response[i];
            var x = $.get("http://vache.cs.umd.edu/api/devices", { device_id: response[i].id, latest_record: true });
            requests.push(x);
          }

          $.when.apply($, requests).then(function(_){
            for (var i = 0; i < arguments.length; i++){
              var dt = {};
              for (var j in arguments[i][0][0].keys){
                dt[arguments[i][0][0].keys[j]] = parseFloat(arguments[i][0][0].values[j]).toPrecision(3);
              }
              latest_device_data.push({
                lat: parseFloat(deviceInformation[arguments[i][0][0].device_id].latitude),
                lon: parseFloat(deviceInformation[arguments[i][0][0].device_id].longitude),
                name: deviceInformation[arguments[i][0][0].device_id].name,
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
        this.getphData = function (){
            var deferred = $.Deferred();
            request.then(function(dt){
                var data = [];
                // console.log(ph);
                for (var i = 0; i < dt.length; i++){
                  if ( dt[i].data["pH"] )
                    data.push({name: dt[i].name, lat: dt[i].lat, lon: dt[i].lon, data: dt[i].data["pH"] });
                }
                deferred.resolve(data);
            });
            return deferred;
        }

        this.gettempData = function (){
            var deferred = $.Deferred();
            request.then(function(dt){
                var data = [];
                // console.log(ph);
                for (var i = 0; i < dt.length; i++){
                  if ( dt[i].data["temperature"] )
                    data.push({name: dt[i].name, lat: dt[i].lat, lon: dt[i].lon, data: dt[i].data["temperature"]});
                }
                // console.log(data);
                deferred.resolve(data);
            });
            return deferred;
        }

        this.getturbData = function (){
            var deferred = $.Deferred();
            request.then(function(dt){
                var data = [];
                // console.log(ph);
                for (var i = 0; i < dt.length; i++){
                  if ( dt[i].data["turbidity"] )
                    data.push({name: dt[i].name, lat: dt[i].lat, lon: dt[i].lon, data: dt[i].data["turbidity"]});
                }
                // console.log(data);
                deferred.resolve(data);
            });
            return deferred;
        }

        return{
          getphData : getphData,
          gettempData : gettempData,
          getturbData : getturbData
        }

    }(jQuery);
