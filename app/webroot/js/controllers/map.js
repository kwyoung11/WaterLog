enviroHubApp.controller('mapController', function($scope, DeviceDataService, WaterServicesService, leafletMarkerEvents, $log, $window )  {
  $scope.pageClass = 'page-map';
  $scope.message = 'Map page';
  // $scope.devices = DeviceDataService.devices.devices;
  // $scope.serviceValue = DeviceDataService.value;
  // console.log(DeviceDataService.value);

  angular.extend($scope, {
    //update this to change tile server
    //defaults: {
    //        tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
    //
    //        tileLayerOptions: {
    //            opacity: 0.9,
    //            detectRetina: true,
    //            reuseTiles: true,
    //        },

    center: {
      lat: 38.993,
      lng: -76.947,
      zoom: 16
    },
    //layout for markers
    // markers: {
    //         main_marker: {
    //             lat: 38.993,
    //             lng: -76.947,
    //             focus: true,
    //             title: "Marker",
    //             draggable: false,
    //             icon: {
    //                 type: 'awesomeMarker',
    //                 html: '6'
    //             },
    //             label: {
    //                 message:"98 degrees",
    //                 options: {
    //                     noHide: true
    //                 }
    //             }
    //         }
    //     },

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
  // $scope.markers = updateMap.clearMap();
  //$scope.markers = updateMap.displayPh($scope.markers, 0, 0);

  //fetches 3rd party ph -karl, and adds to map
  var addph = function (){
    DeviceDataService.getphData().then(function(data){
      console.log(data);
      for(i=0; i < data.length; i++){
        $scope.markers[data[i].name] = {
          lat: data[i].lat,
          lng: data[i].lon,
          focus: true,
          title: data[i].name,
          draggable: false,
          icon: {
            type: 'awesomeMarker',
            html: data[i].data
          }
        };
      }
    });
  }

  //fetches 3rd party temp -karl, and adds to map
  var addtemp = function (){
    DeviceDataService.gettempData().then(function(data){
      console.log(data);
      for(i=0; i < data.length; i++){
        $scope.markers[data[i].name] = {
          lat: data[i].lat,
          lng: data[i].lon,
          focus: true,
          title: data[i].name,
          draggable: false,
          icon: {
            type: 'awesomeMarker',
            html: data[i].data
          }
        };
      }
    });
  }

  //  addtemp();

  //fetches 3rd party turbidity -karl, and adds to map
  var addturb = function (){
    DeviceDataService.getturbData().then(function(data){
      console.log(data);
      for(i=0; i < data.length; i++){
        $scope.markers[data[i].name] = {
          lat: data[i].lat,
          lng: data[i].lon,
          focus: true,
          title: data[i].name, //deviceid
          draggable: false,
          icon: {
            type: 'awesomeMarker',
            html: data[i].data
          }
        };
      }
    });
  }

  angular.extend($scope, {
    addtemp: addtemp,
    addturb: addturb,
    addph  : addph
  });

  //for redirecting on clicking marker on map
  $scope.$on('leafletDirectiveMarker.click', function(event, args){
    //var markerName = args.leafletMarkerEvents.target.options.name;
    $window.location.href = 'www.google.com/?q='+args.modelName; //modelName is marker's title field
  });

  //failed attempt at updating map by fetching data from control panel
  $scope.submit = function(){
    console.log($scope.deviceCategory);
    if($scope.deviceCategory === "ph"){
      $scope.markers = updateMap.clearMap();
      $scope.addph();
      console.log($scope.markers);
    } else if($scope.deviceCategory === "turbidity"){
      $scope.markers = updateMap.clearMap();
      $scope.addturb();
    } else if($scope.deviceCategory === "temperature"){
      $scope.markers = updateMap.clearMap();
      $scope.addtemp();
    }
  };

});
