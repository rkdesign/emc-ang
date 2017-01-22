angular.module('WorkoutLive', ['chart.js'])
	.controller('WorkoutLiveController', function ($scope, $interval, $http, URLS, SessionService) {
		$scope.liveWorkoutData = null;
		var stop;
		var tick = function () {			
			DashBoardOperations.getSelectedUserLiveWorksDetails($scope,SessionService.getUserID(), URLS, $http, SessionService);			
		}	
		
		stop =  $interval(tick, 2000);
		$scope.$on('$destroy', function () { 
				$interval.cancel(stop); 
		});
	})
	.directive('liveWorkoutUpdateTable', function () {
		var directive = {				
			templateUrl: "angular-constructs/shared/directiveTemplates/liveWorkoutUpdateTable.html"
		};
		return directive;
	})
;
