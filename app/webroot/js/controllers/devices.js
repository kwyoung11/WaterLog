enviroHubApp.controller('devicesController', function($scope, $q, $location, SessionService, UserDataService) {
  $scope.pageClass = 'page-devices';
  $scope.devices = [];

  var id = SessionService.getUserId();
  if (id == undefined)
    $location.path('/login');

  UserDataService.getUserDevices().then(function(data) {
    $scope.devices = data;
  });
});
