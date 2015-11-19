    enviroHubApp.factory('DeviceDataService', function ($http){
        var device = {};
        $http.get("http://vache.cs.umd.edu/api/devices?device_id=1")
        .success(function(response){
            console.log("got here");
            device.value = response;
            console.log(device);
            console.log(response);
            console.log(device.devices.devices[0].temp);
            device.devices.devices[0].temp=device.value[0].values[2];
            console.log(device.value[0].values[2]);
        });
        //for(i = 0; i < device.value.length; i++){
        //    console.log(device.value[i].values[0]);
        //}
        device.devices={"devices":[
        {"deviceName": "d1", "temp": 77, "lat": 38.9929846 , "lng": -76.9468502},
        {"deviceName": "d2", "temp": 82, "lat": 38.9943243 , "lng": -76.9434234},
        {"deviceName": "d3", "temp": 63, "lat": 38.9912345 , "lng": -76.9422222},
        {"deviceName": "d4", "temp": 44, "lat": 38.9933333 , "lng": -76.9476543},
        {"deviceName": "d5", "temp": 55, "lat": 38.9954545 , "lng": -76.9245466},
        ]};
        return device;
    });
