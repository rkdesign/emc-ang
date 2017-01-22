var loginRegex = new RegExp("\\[LOGIN\\]", "ig");
var exerciseRegex = new RegExp("\\[EXERCISE\\]", "ig");

angular.module('WorkoutFaker', ['chart.js'])
	.factory('WorkoutFakerService', function ($http, URLS) {
		var fakerService = {};

		fakerService.fakeWorkoutStart = function (data, login, exerciseName) {
			var url = (URLS.SITE_URL + URLS.EXERCISE_START)
		};

		fakerService.fakeWorkoutStop = function (data, login, exerciseName) {
			var url = (URLS.SITE_URL + URLS.EXERCISE_STOP)
				.replace(exerciseRegex, encodeURIComponent(exerciseName))
				.replace(loginRegex, encodeURIComponent(login));

			console.log(url);
			return $http.post(url, {
				workoutSummary: JSON.stringify(data),
			}, {
				withCredentials: true,
				cache: false,
			});
		};

		fakerService.fakeWorkoutUpdate = function (data, login, exerciseName) {
			var url = (URLS.SITE_URL + URLS.EXERCISE_UPDATE)
		};

		return fakerService;
	})
	.controller('WorkoutFakerController', function ($scope, $http, WorkoutFakerService) {

		//$scope.fakeData = {"upTime": [[798, 588, 586, 667, 598, 669, 658, 693, 696, 670, 657], [797, 617, 669, 688, 648, 624, 708, 669, 674, 728, 669, 692]], "set": 2, "weight": [25, 25], "rep": [11, 12], "timeStr": "Sun May 10 10:00:33 2015", "downTime": [[678, 738, 679, 656, 719, 798, 758, 758, 777, 759, 878], [697, 778, 759, 798, 778, 779, 819, 838, 837, 819, 759, 757]], "avgUpTime": [661, 681], "time": Math.round((new Date().getTime()) / 1000), "restDuration": [38519, 14096], "setDuration": [16825.0, 18689.0], "avgDownTime": [745, 784]}

		$scope.unixTime = Math.round((new Date().getTime()) / 1000),
			$scope.login = "Chad";
		$scope.exercise = "Bicep Curl";
		$scope.weight = 25;
		$scope.sets = 2;
		$scope.reps = 10;
		$scope.approximateContractionTime = 700;
		$scope.approximateExtensionTime = 700;
		$scope.variance = 150;
		$scope.restDuration = 30000;

		$scope.message = "";

		$scope.fakeWorkoutStop = function () {
			$scope.message = "";

			var fakeData = {
				time: $scope.unixTime,
				set: $scope.sets,
				rep: [],
				weight: [],
				upTime: [],
				downTime: [],
				restDuration: [],
				setDuration: [],
				avgDownTime: [],
				avgUpTime: [],
			};

			for (var i = 0; i < $scope.sets; i++) {
				fakeData.rep.push($scope.reps);
				fakeData.weight.push($scope.weight);
				fakeData.restDuration.push($scope.restDuration);

				//Simulates uptime stuff
				var upTime = [];
				for (var s = 0; s < $scope.reps; s++) {
					var rand = Math.floor($scope.approximateContractionTime + ((Math.random() * $scope.variance) + 1) - $scope.variance * 0.5);

					upTime.push(rand);
				}
				fakeData.upTime.push(upTime);
				var totalUpTime = Math.round(upTime.reduce(function (previous, current) {
					return previous + current;
				}));
				var avgUpTime = Math.round(totalUpTime / upTime.length);
				fakeData.avgUpTime.push(avgUpTime);

				//Simulates downtime stuff
				var downTime = [];
				for (var o = 0; o < $scope.reps; o++) {
					var rand = Math.floor($scope.approximateExtensionTime + ((Math.random() * $scope.variance) + 1) - $scope.variance * 0.5);
					downTime.push(rand);
				}
				fakeData.downTime.push(downTime);
				var totalDownTime = Math.round(downTime.reduce(function (previous, current) {
					return previous + current;
				}));
				var avgDownTime = Math.round(totalDownTime / downTime.length);
				fakeData.avgDownTime.push(avgDownTime);

				fakeData.setDuration.push(totalUpTime + totalDownTime);
			}

			console.dir(fakeData);

			WorkoutFakerService.fakeWorkoutStop(fakeData, $scope.login, $scope.exercise)
				.success(function (data) {
					console.log("Success:");
					console.dir(data);
					$scope.message = "Successfully faked workout";
				})
				.error(function (data) {
					console.log("Fail:");
					console.dir(data);
					$scope.message = data.error;
				});
		};
	});