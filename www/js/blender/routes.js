/**
 * Each services for the Blender application
 */
var br = angular.module('blenderRoute', ['blenderController', 'ngRoute']);

// Routing
br.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/home', { templateUrl: 'view/home.html', controller: 'homeController' })
		.when('/login', { templateUrl: 'view/login.html', controller: 'loginController' })
		.when('/create', { templateUrl: 'view/create.html', controller: 'createController' })
		.when('/setting', { templateUrl: 'view/setting.html', controller: 'settingController' })
		.otherwise({ redirectTo: '/login' });
}]);
