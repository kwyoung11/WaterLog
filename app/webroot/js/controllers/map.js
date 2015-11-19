enviroHubApp.controller('mapController', ['$scope', 'DeviceDataService', function($scope, DeviceDataService)  {
        $scope.pageClass = 'page-map';
        $scope.message = 'Map page';
        $scope.devices = DeviceDataService.devices.devices;
        $scope.serviceValue = DeviceDataService.value;
        console.log(DeviceDataService.value);
        angular.extend($scope, {
            center: {
                lat: 38.993,
                lng: -76.947,
                zoom: 16
            },
            markers: {
                    main_marker: {
                        lat: 38.993,
                        lng: -76.947,
                        focus: true,
                        title: "Marker",
                        draggable: false,
                        icon: {
                            type: 'awesomeMarker',
                            html: '6'
                        },
                        label: {
                            message:"98 degrees",
                            options: {
                                noHide: true
                            }
                        }
                    }
                }

        });
        for(i=0; i < $scope.devices.length; i++){
            $scope.markers["device"+i] = {
                lat:$scope.devices[i].lat, 
                lng:$scope.devices[i].lng,
                focus: true,
                title:$scope.devices[i].deviceName,
                draggable: false,
                icon: {
                    type: 'awesomeMarker',
                    html: $scope.devices[i].temp
                }
            };
        }
    }]);
