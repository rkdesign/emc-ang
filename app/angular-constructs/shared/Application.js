angular.module('Application', [])
	.controller('ApplicationController', function ($scope, USER_ROLES, AuthService) {
		$scope.currentUser = null;
		//$scope.userRoles = USER_ROLES;

		$scope.setCurrentUser = function (user) {
			console.log("Current user: " + user)
			$scope.currentUser = user;			
		};		
		
	});