var mapModule = angular.module("mapApp", ['leaflet-directive']);

mapModule.config(function($logProvider){
  $logProvider.debugEnabled(false);
});

mapModule.controller('mapController', function( $scope, leafletMarkerEvents)  {
  // $scope.devices = DeviceDataService.devices.devices;
  // $scope.serviceValue = DeviceDataService.value;
  // console.log(DeviceDataService.value);

  angular.extend($scope, {
    //update this to change tile server
    defaults: {
      tileLayer: "http://virulent.cs.umd.edu/osm_tiles/{z}/{x}/{y}.png",

      tileLayerOptions: {
        opacity: 0.9,
        detectRetina: true,
        reuseTiles: true,
      }
    },

    center: {
      lat: 38.993,
      lng: -76.947,
      zoom: 16
    },
    //layout for markers
    // markers: {
    //       main_marker: {
    //           lat: 38.993,
    //           lng: -76.947,
    //           focus: true,
    //           title: "Marker",
    //           draggable: false,
    //           icon: {
    //               type: 'awesomeMarker',
    //               html: '6'
    //           },
    //           label: {
    //               message:"98 degrees",
    //               options: {
    //                   noHide: true
    //               }
    //           }
    //       }
    //   },

    markers: {

    },
    events: {
      marker: {
        enable: ['click']
      }
    }
  });

    //1st succ attempt at changing markers
    // for(i=0; i < $scope.devices.length; i++){
    //     $scope.markers["device"+i] = {
    //         lat:$scope.devices[i].lat,
    //         lng:$scope.devices[i].lng,
    //         focus: true,
    //         title:$scope.devices[i].deviceName,
    //         draggable: false,
    //         icon: {
    //             type: 'awesomeMarker',
    //             html: $scope.devices[i].temp
    //         }
    //     };
    // }

    // updateMap.displayPh = function (markers, date, userId){
    //   console.log(WaterServicesService.getMultipleDeviceData());
    // return {};
    //};

    $scope.clearMap = function(){
      angular.extend($scope, {
        markers: {}
      });
    }
    // $scope.markers = updateMap.clearMap();
    //$scope.markers = updateMap.displayPh($scope.markers, 0, 0);



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
            html: data[i].data
          }
        });
      }
      newMarkers(markers);
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

    //fetches 3rd party ph -karl, and adds to map
    var addThridPartyph = function (){
      WaterServicesService.getData('2015-11-18', '2015-11-18').then(function(data){
        var new_data = [];
        // console.log(data.multipleDeviceData)
        for (var i = 0; i < data.multipleDeviceData.length; i++){
          if (data.multipleDeviceData[i].data.PH)
            new_data.push({
              lat: parseFloat(data.multipleDeviceData[i].lat),
              lng: parseFloat(data.multipleDeviceData[i].lon),
              name: data.multipleDeviceData[i].deviceID,
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
      });
    }
    var addThridPartyTemperature = function (){
      WaterServicesService.getData('2015-11-18', '2015-11-20', 01649500).then(function(data){
        WaterServicesService.getData('2015-11-18', '2015-11-20').then(function(data){
          var new_data = [];
          console.log(data)
          for (var i = 0; i < data.multipleDeviceData.length; i++){
            if (data.multipleDeviceData[i].data.temperature)
              new_data.push({
                lat: parseFloat(data.multipleDeviceData[i].lat),
                lng: parseFloat(data.multipleDeviceData[i].lon),
                name: data.multipleDeviceData[i].deviceID,
                data: parseFloat(data.multipleDeviceData[i].data.temperature),
                icon: {
                  type: 'awesomeMarker',
                  html: data.multipleDeviceData[i].data.temperature
                }
              });
          }
          // console.log(new_data);
          newMarkers(new_data);
        });
      });
    }
    var addThridPartyTurbidity = function (){
      WaterServicesService.getData('2015-11-18', '2015-11-20', 01649500).then(function(data){
        console.log(data);
      });
    }

    // //for redirecting on clicking marker on map
    // $scope.$on('leafletDirectiveMarker.click', function(event, args){
    //   //var markerName = args.leafletMarkerEvents.target.options.name;
    //   $window.location.href = 'www.google.com/?q='+args.modelName; //modelName is marker's title field
    // });
    //
    // //failed attempt at updating map by fetching data from control panel

    $scope.submit = function(){
      $scope.clearMap();
      if($scope.deviceCategory === "pH"){
        addDeviceph();
      } else if($scope.deviceCategory === "Turbidity"){
        addDeviceTurbidity();
      } else if($scope.deviceCategory === "Temperature"){
        addDeviceTemperature();
      }

      if ($scope.thirdParty === "pH"){
        addThridPartyph();
      } else if($scope.thirdParty === "Turbidity"){
        addThridPartyTurbidity();
      } else if($scope.thirdParty === "Temperature"){
        addThridPartyTemperature();
      }
    };
  });
