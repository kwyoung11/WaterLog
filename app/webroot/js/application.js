
// script.js

    // create the module and name it enviroHubApp
        // also include ngRoute for all our routing needs
    var enviroHubApp = angular.module('enviroHubApp', ['ngRoute', 'ngAnimate']);

    // configure our routes
    enviroHubApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : '/views/home/home.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/about', {
                templateUrl : '/views/about.html',
                controller  : 'aboutController'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : '/views/contact.html',
                controller  : 'contactController'
            })

            // route for the login page
            .when('/login', {
                templateUrl : '/views/sessions/login.html',
                controller  : 'loginController'
            })

            // route for the map page
            .when('/map', {
                templateUrl : '/views/home/map.html',
                controller  : 'mapController'
            })

            // route for the devices page
            .when('/devices', {
                templateUrl : '/views/devices/devices.html',
                controller  : 'devicesController'
            });
    });

    // create the controller and inject Angular's $scope
    enviroHubApp.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.pageClass = 'page-home';
        $scope.message = 'Everyone come and see how good I look!';
    });

    enviroHubApp.controller('aboutController', function($scope) {
        $scope.pageClass = 'page-about';
        $scope.message = 'Look! I am an about page.';
    });

    enviroHubApp.controller('contactController', function($scope) {
        $scope.pageClass = 'page-contact';
        $scope.message = 'Contact us! JK. This is just a demo.';
    });


    enviroHubApp.controller('loginController', function($scope) {
        $scope.pageClass = 'page-login';
        $scope.message = 'Login page';
    });

    enviroHubApp.controller('mapController', function($scope) {
        $scope.pageClass = 'page-map';
        $scope.message = 'Map page';
    });

    enviroHubApp.controller('devicesController', function($scope) {
  $scope.pageClass = 'page-devices';
  $scope.devices = [{
    "lat": "29.07441",
    "long": "31.09785",
    "date": "7/12/2015",
    "pH": 4,
    "temperature": 13,
    "id": 69144,
    "status": "active"
  }, {
    "lat": "41.5083",
    "long": "-8.2083",
    "date": "11/2/2014",
    "pH": 3,
    "temperature": 57,
    "id": 3466,
    "status": "active"
  }, {
    "lat": "57.4872",
    "long": "12.0761",
    "date": "1/22/2015",
    "pH": 8,
    "temperature": 3,
    "id": 55667
  }, {
    "lat": "13.5941",
    "long": "122.878",
    "date": "7/21/2015",
    "pH": 7,
    "temperature": 85,
    "id": 70309,
    "status": "active"
  }, {
    "lat": "30.81544",
    "long": "108.37089",
    "date": "7/9/2015",
    "pH": 3,
    "temperature": 55,
    "id": 56595
  }, {
    "lat": "-17.61667",
    "long": "177.46667",
    "date": "12/3/2014",
    "pH": 13,
    "temperature": 37,
    "id": 68841
  }, {
    "lat": "40.18347",
    "long": "44.25862",
    "date": "5/26/2015",
    "pH": 0,
    "temperature": 5,
    "id": 23280
  }, {
    "lat": "39.25",
    "long": "-8.5833",
    "date": "5/10/2015",
    "pH": 14,
    "temperature": 68,
    "id": 33658,
    "status": "active"
  }, {
    "lat": "52.07539",
    "long": "19.65557",
    "date": "2/18/2015",
    "pH": 14,
    "temperature": 39,
    "id": 8763
  }, {
    "lat": "52.4338",
    "long": "53.1583",
    "date": "6/26/2015",
    "pH": 7,
    "temperature": 52,
    "id": 51596
  }];
  console.log($scope);
});


    // document.getElementById('update_password_resets').setAttribute('action', '/password_resets/' + window.location.pathname.split("/")[2]);
