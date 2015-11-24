enviroHubApp.controller('menuController', function($scope, LoginService)  {
  var map_button =      { link: "#map",     text: "Map" };
  var devices_button =  { link: "#devices", text: "Devices" };
  var about_button =    { link: "#about",   text: "About" };
  var contact_button =  { link: "#contact", text: "Contact" };
  var login_button =    { link: "#login",   text: "Login/Register" };
  var logout_button =   { link: "#logout",  text: "Logout" };

  var logged_in_buttons = [map_button, devices_button, about_button, contact_button, logout_button];
  var other_buttons = [login_button, about_button, contact_button];

  $scope.$watch('LoginService.status', function(){

  });

  if (LoginService.status == LoginService.success) {
    $scope.buttons = logged_in_buttons;
  } else {
    $scope.buttons = other_buttons;
  }

  var colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink'];
  $scope.getRandomColor = function () {
    return colors[Math.floor(Math.random() * colors.length)];
  }
});
