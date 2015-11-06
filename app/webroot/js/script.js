// script.js

    // create the module and name it enviroHubApp
        // also include ngRoute for all our routing needs
    var enviroHubApp = angular.module('enviroHubApp', ['ngRoute', 'ngAnimate']);

    // configure our routes
    enviroHubApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : '/js/pages/home.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/about', {
                templateUrl : '/js/pages/about.html',
                controller  : 'aboutController'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : '/js/pages/contact.html',
                controller  : 'contactController'
            })

            // route for the login page
            .when('/login', {
                templateUrl : '/js/pages/login.html',
                controller  : 'loginController'
            })

            // route for the map page
            .when('/map', {
                templateUrl : '/js/pages/map.html',
                controller  : 'mapController'
            })

            // route for the devices page
            .when('/devices', {
                templateUrl : '/js/pages/devices.html',
                controller  : 'devicesController'
            });
    });

    // create the controller and inject Angular's $scope
    enviroHubApp.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.pageClass = 'page-home';
        $scope.message = 'Everyone comes and see how good I look!';
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
