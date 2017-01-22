'use strict';

var angular = angular;
var module = angular.module('WorkoutData', ['Authentication']);

module.factory('WorkoutDataService', function ($q, $http, $location, SessionService, URLS) {
	var dataService = {};
	var idRegex = new RegExp("\\[USERID\\]", "ig");
	dataService.getUserWorkoutHistory = function (userId) {
		console.log("get user workout history for " + userId);
		var url = (URLS.SITE_URL + URLS.HISTORY)
				.replace(idRegex, encodeURIComponent(userId));		
		
		return $http.get((url), {
			cache: false,
			withCredentials: true,			
			params: {'filter' : '{"include":["strengthExerciseDefinition", "exerciseMachine", {"sets":["reps"]}]}'},
			headers: {'Authorization': SessionService.getID()}
		})
			.success(function (data) {
				console.log("Got data!");
				console.dir(data);
				dataService.userWorkoutHistory = data;
				return data;
			})
			.error(function (err) {
				console.log("Failed to get user workout history: " + err);
			});
	};
		
	
	dataService.getUserLiveWorkout = function (userId) {
		
		return $http.get((URLS.SITE_URL + URLS.LIVE), {
			withCredentials: true,
			cache: false,
			headers: {'Authorization': userId}
		}).success(function (data) {
			return data;
		})
		.error(function (err) {
			console.log("Failed to get user live work out history: " + err);
		});
	}
	

	return dataService;
});
