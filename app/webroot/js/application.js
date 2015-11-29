
// script.js

    // create the module and name it enviroHubApp
        // also include ngRoute for all our routing needs
    var enviroHubApp = angular.module('enviroHubApp', ['ngRoute', 'ngAnimate', 'leaflet-directive', 'highcharts-ng']);

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
                templateUrl : '/views/map/map.html',
                controller  : 'mapController'
            })

            // route for the devices page
            .when('/devices', {
                templateUrl : '/views/devices/devices.html',
                controller  : 'devicesController'
            })

            // route for the device details page
            .when('/devicesDetails', {
                templateUrl : '/views/devices/devicesDetails.html',
                controller  : 'devicesDetailsController'
            })

            // route for the bulkupload details page
            .when('/bulk', {
                templateUrl : '/views/upload/bulk.html',
                controller  : 'uploadBulkController'
            })

            .when('/single', {
                templateUrl : '/views/upload/single.html',
                controller  : 'uploadSingleController'
            })

            .when('/test', {
                templateUrl : '/views/test/test.html',
                controller  : 'testController'
            })

            ;
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

