enviroHubApp.controller('menuController', function($scope, SessionService, PubSubService)  {
  var map_button =      { link: "#map",     text: "Map" };
  var devices_button =  { link: "#devices", text: "Devices" };
  var about_button =    { link: "#about",   text: "About" };
  var contact_button =  { link: "#contact", text: "Contact" };
  var login_button =    { link: "#login",   text: "Login/Register" };
  var logout_button =   { link: "#login",   text: "Logout" };

  var logged_in_buttons = [map_button, devices_button, about_button, contact_button, logout_button];
  var logged_out_buttons = [login_button, about_button, contact_button];

  PubSubService.subscribe(SessionService.loginSuccess, function (){
    $scope.buttons = logged_in_buttons;
  });

  PubSubService.subscribe(SessionService.logoutSuccess, function (){
    $scope.buttons = logged_out_buttons;
  });

  if (SessionService.status == SessionService.loginSuccess) {
    $scope.buttons = logged_in_buttons;
  } else {
    $scope.buttons = logged_out_buttons;
    setTimeout(function(){ $scope.$apply(); });
  }

  var colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink'];
  $scope.getRandomColor = function () {
    return colors[Math.floor(Math.random() * colors.length)];
  }
});

enviroHubApp.directive("mainNavigationButtons", function(SessionService){
  return function($scope, element, attrs){
    $(element).on('click', function (e){
      if (e.target.text.trim() == "Logout"){
        SessionService.logoutUser();
      }
    })
  }
});



// enviroHubApp.directive("menuMapButton", function (){
//   return function($scope, element, attrs){
//
//   };
// });
//
// enviroHubApp.directive("menuDevicesButton", function (){
//   return function($scope, element, attrs){
//
//   };
// });
//
// enviroHubApp.directive("menuAboutButton", function (){
//   return function($scope, element, attrs){
//
//   };
// });
//
// enviroHubApp.directive("menuContactButton", function (){
//   return function($scope, element, attrs){
//
//   };
// });
//
// enviroHubApp.directive("menuLoginButton", function (){
//   return function($scope, element, attrs){
//
//   };
// });
//
// enviroHubApp.directive("menuLogoutButton", function ($scope, SessionService){
//   return function($scope, element, attrs) {
//     $(element).on('click', function () {
//       SessionService.logoutUser ();
//     });
//   };
// });
