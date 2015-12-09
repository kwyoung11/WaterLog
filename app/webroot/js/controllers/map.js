var mapModule = angular.module("mapApp", ['leaflet-directive']);

mapModule.config(function($logProvider){
  $logProvider.debugEnabled(false);
});

mapModule.controller('mapController', function( $scope, leafletMarkerEvents)  {
  angular.extend($scope, {
    load: 0,
    //update this to change tile server
    defaults: {
      //tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
      //should point to
      //tileLayer: "http://virulent.cs.umd.edu/osm_tiles/{z}/{x}/{y}.png",
      //tileLayer: "http://virulent.cs.umd.edu/osm_tiles/{z}/{x}/{y}.png",
      tileLayerOptions: {
        opacity: 0.9,
        detectRetina: true,
        reuseTiles: true,
      }
    },
    tiles: {
      //url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      //use if our's isn't fast enough
      // url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
      //our tile server
      url: tileServerLocationURL
    },
    center: {
      lat: 38.993,
      lng: -76.947,
      zoom: 16
    },

    markers: {},
    // ds
    events: {
      marker: {
        enable: ['click']
      }
    }
  });

    $scope.clearMap = function(){
      angular.extend($scope, {
        markers: {}
      });
    }

    var newMarkers = function(markers){
      var marks = $scope.markers;
      var max = 0;
      for (var i in marks){
        if (parseInt(i) && parseInt(i) > max)
          max = parseInt(i);
      }

      for (var i = max+1; i < max+1+markers.length; i++) {
        marks[i] = (markers[i-max-1]);
      }

      angular.extend($scope, {
        markers: marks
      });
    }

    function mapData (data){
      var markers = [];
      for(var i = 0; i < data.length; i++){
        markers.push({
          lat: data[i].lat,
          lng: data[i].lon,
          focus: true,
          title: data[i].name,
          draggable: false,
          icon: {
            type: 'awesomeMarker',
            markerColor: 'blue',
            html: data[i].data
          }
        });
      }
      newMarkers(markers);
      $scope.load --;
    }
    //fetches device ph, and adds to map
    var addDeviceph = function (){
      DeviceDataService.getphData().then(mapData);
    }
    var addDeviceTemperature = function (){
      DeviceDataService.gettempData().then(mapData);
    }
    var addDeviceTurbidity = function (){
      DeviceDataService.getturbData().then(mapData);
    }

    DeviceDataService.getAllDevices().then(function(data){
      $scope.load ++;
      var dt = [];
      for (var i = 0; i < data.length; i++){
        dt.push({
          data:'•',
          lat: parseFloat(data[i].latitude),
          lon: parseFloat(data[i].longitude),
          name: data[i].name
        });
      }
      mapData(dt);
    });

    DeviceDataService.getData().then(function(data){
      // $scope.load ++;
    });

    // Date String Values from Scope Date input
    var startDTString = function () {
      return $scope.input_date.toJSON().slice(0, 10);
    }
    var endDTString = function () {
      return $scope.input_date.toJSON().slice(0, 10);
    }


    //fetches 3rd party ph -karl, and adds to map
    var addThridPartyph = function (){
      WaterServicesService.getData(startDTString(), endDTString()).then(function(data){
        var new_data = [];
        // console.log(data.multipleDeviceData)
        for (var i = 0; i < data.multipleDeviceData.length; i++){
          if (data.multipleDeviceData[i].data.PH)
            new_data.push({
              lat: parseFloat(data.multipleDeviceData[i].lat),
              lng: parseFloat(data.multipleDeviceData[i].lon),
              name: data.multipleDeviceData[i].deviceID+"thirdParty",
              data: parseFloat(data.multipleDeviceData[i].data.PH),
              icon: {
                type: 'awesomeMarker',
                markerColor: 'red',
                html: data.multipleDeviceData[i].data.PH
              }
            });
        }
        // console.log(new_data);
        newMarkers(new_data);
        $scope.load --;
        $scope.$apply();
      });
    }
    var addThridPartyTemperature = function (){
      WaterServicesService.getData(startDTString(), endDTString()).then(function(data){
        var new_data = [];
        for (var i = 0; i < data.multipleDeviceData.length; i++){
          if (data.multipleDeviceData[i].data.temperature){
            new_data.push({
              lat: parseFloat(data.multipleDeviceData[i].lat),
              lng: parseFloat(data.multipleDeviceData[i].lon),
              name: data.multipleDeviceData[i].deviceID+"thirdParty",
              data: parseFloat(Math.round(data.multipleDeviceData[i].data.temperature * 1.8000 + 32.00)),
              icon: {
                type: 'awesomeMarker',
                markerColor: 'red',
                html: Math.round(data.multipleDeviceData[i].data.temperature * 1.8000 + 32.00)
              }
            });
          }
        }

        newMarkers(new_data);
        $scope.load --;
        $scope.$apply();
      });
    }

    var addThridPartyTurbidity = function (){

        WaterServicesService.getData(startDTString(), endDTString()).then(function(data){
          var new_data = [];
          for (var i = 0; i < data.multipleDeviceData.length; i++){
            if (data.multipleDeviceData[i].data.turbidity)
              new_data.push({
                lat: parseFloat(data.multipleDeviceData[i].lat),
                lng: parseFloat(data.multipleDeviceData[i].lon),
                name: data.multipleDeviceData[i].deviceID+"thirdParty",
                data: parseFloat(data.multipleDeviceData[i].data.turbidity),
                icon: {
                  type: 'awesomeMarker',
                  markerColor: 'red',
                  html: data.multipleDeviceData[i].data.turbidity
                }
              });
          }
          newMarkers(new_data);
          $scope.load --;
          $scope.$apply();
        });

    }

    var addThridPartyWeatherTempF = function (){
      WaterServicesService.getData(startDTString(), endDTString()).then(function(data){
        var multipleDeviceData = data.multipleDeviceData;
        // Call to Weather Service - After data - Date only goes back 3 weeks
        WeatherService.getData(multipleDeviceData, startDTString(), endDTString(), true).then(function(response) {
          var appendWeather = response;
          multipleDeviceData = appendWeather.weatherData;

          var new_data = [];
          for (var i = 0; i < multipleDeviceData.length; i++){
            if (multipleDeviceData[i].data.weatherTempF) {

              new_data.push({
                lat: parseFloat(multipleDeviceData[i].lat),
                lng: parseFloat(multipleDeviceData[i].lon),
                name: multipleDeviceData[i].deviceID+"thirdParty",
                data: parseFloat(data.multipleDeviceData[i].data.weatherTempF),
                icon: {
                  type: 'awesomeMarker',
                  markerColor: 'red',
                  html: multipleDeviceData[i].data.weatherTempF
                }
              });
            }
          }
          newMarkers(new_data);
          $scope.$apply();
          $scope.load --;
        });
      });
    }

    //for redirecting on clicking marker on map
    $scope.$on('leafletDirectiveMarker.click', function(event, args){
      //var markerName = args.leafletMarkerEvents.target.options.name;
      // window.location.href = 'http://vache.cs.umd.edu/devices/'+args.modelName; //modelName is marker's title field
      console.log('click');
      console.log(args.modelName);
      if(args.modelName.indexOf("thirdParty") != -1){
        $(angular.element('.fullscreen.modal')[0]).empty();
        $(angular.element('.fullscreen.modal')[0]).append('<iframe allowfullscreen style="width:100%;height:100%" src="/devices/'+ args.modelName + '"></iframe>');
        var frame = $(angular.element('.fullscreen.modal')[0]).find('iframe');
        frame.load(function(){
          var contents = frame.contents();
          var chart = contents.find('html body #chart');
          contents.find('body *').hide();
          chart.show();
          chart.find('*').show();
          $(angular.element('.fullscreen.modal')[0]).modal('show');
        })
      }
    });

    //failed attempt at updating map by fetching data from control panel
    $scope.submit = function(){
      $scope.clearMap();
      aZipcode = convertZipcodeToLatLong($scope.zipcode);
      if (aZipcode != undefined){
        $scope.center.lat = parseFloat(aZipcode.lat);
        $scope.center.lng = parseFloat(aZipcode.long);
      }
      if($scope.deviceCategory === "pH"){
        addDeviceph();
        $scope.load ++;
      } else if($scope.deviceCategory === "Turbidity"){
        addDeviceTurbidity();
        $scope.load ++;
      } else if($scope.deviceCategory === "Temperature"){
        addDeviceTemperature();
        $scope.load ++;
      }

      if ($scope.thirdParty === "pH"){
        addThridPartyph();
        $scope.load ++;
      } else if($scope.thirdParty === "Turbidity"){
        addThridPartyTurbidity();
        $scope.load ++;
      } else if($scope.thirdParty === "Temperature"){
        addThridPartyTemperature();
        $scope.load ++;
      } else if($scope.thirdParty === "weatherTempF"){
        addThridPartyWeatherTempF();
        $scope.load ++;
      }
    };

  });
