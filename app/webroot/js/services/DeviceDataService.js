  var DeviceDataService = function ($){
        // var device = {};
        // $http.get("http://vache.cs.umd.edu/api/devices?device_id=1")
        // .success(function(response){
        //     console.log("got here");
        //     device.value = response;
        //     console.log(device);
        //     console.log(response);
        //     console.log(device.devices.devices[0].temp);
        //     device.devices.devices[0].temp=device.value[0].values[2];
        //     console.log(device.value[0].values[2]);
        // });
        // //for(i = 0; i < device.value.length; i++){
        // //    console.log(device.value[i].values[0]);
        // //}
        // device.devices={"devices":[
        // {"deviceName": "d1", "temp": 77, "lat": 38.9929846 , "lng": -76.9468502},
        // {"deviceName": "d2", "temp": 82, "lat": 38.9943243 , "lng": -76.9434234},
        // {"deviceName": "d3", "temp": 63, "lat": 38.9912345 , "lng": -76.9422222},
        // {"deviceName": "d4", "temp": 44, "lat": 38.9933333 , "lng": -76.9476543},
        // {"deviceName": "d5", "temp": 55, "lat": 38.9954545 , "lng": -76.9245466},
        // ]};
        // return device;
        var ph = [{name:"John", lat:38.9929846, lon:-76.9468502, data:{ph:3.0, temperature: 88.5, turbidity: 7.0},date:"2015-11-22"}, {name:"Mara", lat:38.9943243, lon:-76.9434234, data:{ph:4.5, temperature: 70.3, turbidity: 3.0}, date:"2015-11-21"} ];
        var request = $.get("http://vache.cs.umd.edu/api/devices?device_id=1");
        this.getphData = function (){
            var deferred = $.Deferred();
            request.success(function(dt){
                var data = [];
                // console.log(ph);
                for (var i = 0; i < ph.length; i++){
                    data.push({name: ph[i].name, lat: ph[i].lat, lon: ph[i].lon, data: ph[i].data.ph});
                }
                // console.log(data);
                deferred.resolve(data);
            });
            return deferred;
        }

        this.gettempData = function (){
            var deferred = $.Deferred();
            request.success(function(dt){
                var data = [];
                // console.log(ph);
                for (var i = 0; i < ph.length; i++){
                    data.push({name: ph[i].name, lat: ph[i].lat, lon: ph[i].lon, data: ph[i].data.temperature});
                }
                // console.log(data);
                deferred.resolve(data);
            });
            return deferred;
        }

        this.getturbData = function (){
            var deferred = $.Deferred();
            request.success(function(dt){
                var data = [];
                // console.log(ph);
                for (var i = 0; i < ph.length; i++){
                    data.push({name: ph[i].name, lat: ph[i].lat, lon: ph[i].lon, data: ph[i].data.turbidity});
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
