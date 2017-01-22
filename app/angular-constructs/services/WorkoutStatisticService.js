'use strict';

var angular = angular;
var module = angular.module('WorkoutStatisticsService', []);

module.factory('WorkoutStatisticsService', function (SessionService, WorkoutDataService, $timeout,  $state, AUTH_EVENTS) {
	var WorkoutStatisticsService = {};
	
		
	WorkoutStatisticsService.getTotalWeightLifted = function($scope, userid){
			var selectedId = this.getSelectedButton();
			var currentUserId= (userid) ? userid : "";
				if(selectedId === "byWeek"){
					this.getStatisticByWeek($scope, currentUserId);				
				}else if(selectedId === "byMonth"){
					this.getStatisticByMonth($scope, currentUserId);
				}else if(selectedId === "byYear"){
					this.getStatisticByYear($scope, currentUserId);
				}else if(selectedId === "byCustom"){
					this.getStatisticByCustom($scope, currentUserId);
				}			
		},
		
		
		WorkoutStatisticsService.getWeightLiftedByExercises =  function($scope, userid ){
			var selectedId = this.getSelectedButton();
			var currentUserId= (userid) ? userid : "";
				if(selectedId === "byWeek"){
					this.getWeekStatisticByExercises($scope, currentUserId);				
				}else if(selectedId === "byMonth"){
					this.getMonthlyStatisticByExercises($scope, currentUserId);
				}else if(selectedId === "byYear"){
					this.getStatisticByYear($scope, currentUserId );
				}else if(selectedId === "byCustom"){
					this.getStatisticByCustom($scope, currentUserId);
				}
		},
		
			
		
		WorkoutStatisticsService.getSelectedButton = function(){
			var selectedId;
			$(".btn-group > .btn").each(function(){
				if($(this).hasClass('active')){
					selectedId = this.id;
				}
			});
			return selectedId;
		},
		
		WorkoutStatisticsService.getTypeOfExercises = function(){
			var ByExerciseType="";
			
			if($("#weightliftedByWeek").hasClass('active')){
				ByExerciseType = "weightliftedByWeek";
			}else if($("#weightliftedByExercises").hasClass('active')){
				ByExerciseType = "weightliftedByExercises";
			}
			
			return ByExerciseType;
		},
		
		WorkoutStatisticsService.getUserID = function($scope,  userid){
			var currentUserId="";
			if(userid){
				currentUserId = userid;
			}else if($scope.SelectedUserName !== ""){
				currentUserId = $scope.SelectedUserid;
			}else {
				currentUserId = SessionService.getUserID();
			}
			return currentUserId;
		},
				
		WorkoutStatisticsService.getWeeklyExerciseReport = function($scope, userid){
			var ByExerciseType = this.getTypeOfExercises();
			var currentUserId= (userid) ? userid : "";
				if(ByExerciseType === "weightliftedByWeek"){
					this.getStatisticByWeek($scope,currentUserId);
				}else if(ByExerciseType === "weightliftedByExercises"){
					this.getWeekStatisticByExercises($scope, currentUserId);
				}
		},
		
		WorkoutStatisticsService.getMonthExerciseReport = function($scope, userid){
			var ByExerciseType = this.getTypeOfExercises();
			var currentUserId= (userid) ? userid : "";
				if(ByExerciseType === "weightliftedByWeek"){
					this.getStatisticByMonth($scope, currentUserId);
				}else if(ByExerciseType === "weightliftedByExercises"){
					this.getMonthlyStatisticByExercises($scope, currentUserId);
				}
		},
		
		
		WorkoutStatisticsService.getStatisticByWeek = function($scope , userid){
			$scope.exercisesList=[];
			$scope.SelectedExerciseName ="";
			WorkoutDataService.getUserWorkoutHistory(this.getUserID($scope, userid)).then(function (data) {
				$(".btn-group > .btn").removeClass("active disabled");
				$("#byWeek").addClass("active disabled");
				$("#weightliftedByWeek").addClass("active disabled");
				$("#weightliftedByExercises").removeClass("active disabled");
				if(data.data.length >0 ){
					$scope.showButons=true;
				var processedData = WorkoutSummaryProcessor.filterWorkoutsByTime(data.data, moment().subtract(13, 'day').startOf('day'), moment().endOf('day'));
					if(processedData.length > 0){
						DashBoardOperations.getSelectedUserDashBoardDetailsByWeek($scope , processedData);							
						$scope.graphHeading = AUTH_EVENTS.graphHeading;
						$scope.caloriesHeading = AUTH_EVENTS.caloriesHeading;
						$scope.workoutHeading = AUTH_EVENTS.workoutHeading;
					}else{
						$scope.periodWeightLiftedData=[];	
					}
					
					$scope.dashBoardTemplateUrl = "angular-constructs/workout-statistics/DashBoardByWeek.html";		
				}else{
					$scope.showButons=false;
					$scope.dashBoardTemplateUrl = "angular-constructs/shared/noDataFound.html";
				}
			});
		},
		
		WorkoutStatisticsService.getWeekStatisticByExercises = function($scope, userid){
			var WorkoutStatisticsService=this;
			WorkoutDataService.getUserWorkoutHistory(this.getUserID($scope, userid)).then(function (data) {
				$(".btn-group > .btn").removeClass("active disabled");
				$("#byWeek").addClass("active disabled");
				$("#weightliftedByExercises").addClass("active disabled");
				$("#weightliftedByWeek").removeClass("active disabled");
				if(data.data.length >0 ){	
						$scope.showButons=true;
						data = data.data;
						$scope.rawData = data;
					var exercisesList = WorkoutSummaryProcessor.getExerciseNamesList(data);
					
						exercisesList =_.sortBy(exercisesList);
						_.each($scope.exercisesList, function(exerciseName){
							var exerciseName = exerciseName.split(' ').join('');
							$("#"+exerciseName).removeClass("active disabled");
						});
						
					var processedData = WorkoutSummaryProcessor.getSelectedExercisesData(data, exercisesList[0]);
						processedData = WorkoutSummaryProcessor.filterWorkoutsByTime(processedData,moment().subtract(13, 'day').startOf('day'), moment().endOf('day'));
					if(processedData.length > 0){
						DashBoardOperations.getSelectedUserDashBoardDetailsByWeek($scope, processedData);
						$scope.graphHeading = AUTH_EVENTS.graphHeading;
						$scope.caloriesHeading = AUTH_EVENTS.caloriesHeading;
						$scope.workoutHeading = AUTH_EVENTS.workoutHeading;
					}else{															
						$scope.periodWeightLiftedData=[];	
					}
					
					$scope.dashBoardTemplateUrl = "angular-constructs/workout-statistics/DashBoardByWeek.html";	
					$scope.SelectedExerciseName = exercisesList[0];						
					$scope.exercisesList = exercisesList;	
					
					$timeout(function() {
						 	var name = exercisesList[0].split(' ').join('');
							$("#"+name).addClass("active disabled");
					}, 1000);
					
				}else{
					$scope.showButons=false;
					$scope.dashBoardTemplateUrl = "angular-constructs/shared/noDataFound.html";
				}				
			});
		},
		
		WorkoutStatisticsService.getSelectedWeeklyExercieGraphData = function($scope, exerciseName){
			
				_.each($scope.exercisesList, function(exerciseName){
					var exerciseName = exerciseName.split(' ').join('');
					$("#"+exerciseName).removeClass("active disabled");
				});
				
				var processedData = WorkoutSummaryProcessor.getSelectedExercisesData($scope.rawData, exerciseName);
					processedData = WorkoutSummaryProcessor.filterWorkoutsByTime(processedData,moment().subtract(13, 'day').startOf('day'), moment().endOf('day'));	
					if(processedData.length > 0){
						DashBoardOperations.getSelectedUserDashBoardDetailsByWeek($scope, processedData);				
						$scope.graphHeading = AUTH_EVENTS.graphHeading;
						$scope.caloriesHeading = AUTH_EVENTS.caloriesHeading;
						$scope.workoutHeading = AUTH_EVENTS.workoutHeading;						
					}else{						
						$scope.periodWeightLiftedData=[];
					}
					
					$scope.dashBoardTemplateUrl = "angular-constructs/workout-statistics/DashBoardByWeek.html";
					$scope.SelectedExerciseName = exerciseName;
					
					
				var name = exerciseName.split(' ').join('');
					$("#"+name).addClass("active disabled");
		},		
		
		
		WorkoutStatisticsService.getStatisticByMonth = function($scope, userid){
			WorkoutDataService.getUserWorkoutHistory(this.getUserID($scope, userid)).then(function (data) {
				$(".btn-group > .btn").removeClass("active disabled");
				$("#byMonth").addClass("active disabled");
				$("#weightliftedByWeek").addClass("active disabled");
				$("#weightliftedByExercises").removeClass("active disabled");
				if(data.data.length >0 ){
					$scope.showButons=true;
					data = data.data;
					$scope.rawData = data;
					var processedData = WorkoutSummaryProcessor.filterWorkoutsByTime(data, moment().subtract(56, 'day').startOf('day'), moment().endOf('day'));
					if(processedData.length > 0 ){
						DashBoardOperations.getSelectedUserDashBoardDetailsByMonth($scope , data);
							$scope.graphHeading = AUTH_EVENTS.graphHeading;
							$scope.caloriesHeading = AUTH_EVENTS.caloriesHeading;
							$scope.workoutHeading = AUTH_EVENTS.workoutHeading;					}else{
						$scope.periodWeightLiftedData=[];
					}
						$scope.dashBoardTemplateUrl = "angular-constructs/workout-statistics/DashBoardByMonth.html";
						$scope.SelectedExerciseName ="";
						$scope.exercisesList =[];
				}else {
					$scope.showButons=false;
					$scope.dashBoardTemplateUrl = "angular-constructs/shared/noDataFound.html";
				}
			});	
		},
		
		WorkoutStatisticsService.getMonthlyStatisticByExercises = function($scope, userid){		
			WorkoutDataService.getUserWorkoutHistory(this.getUserID($scope, userid)).then(function (data) {
				$(".btn-group > .btn").removeClass("active disabled");
				$("#byMonth").addClass("active disabled");
				$("#weightliftedByExercises").addClass("active disabled");
				$("#weightliftedByWeek").removeClass("active disabled");
				if(data.data.length >0 ){
						$scope.showButons=true;
						data = data.data;
						$scope.rawData = data;
					var exercisesList = WorkoutSummaryProcessor.getExerciseNamesList(data);
						exercisesList =_.sortBy(exercisesList);
						
						_.each($scope.exercisesList, function(exerciseName){
							var exerciseName = exerciseName.split(' ').join('');
							$("#"+exerciseName).removeClass("active disabled");
						});
					var processedData = WorkoutSummaryProcessor.getSelectedExercisesData(data, exercisesList[0]);
						processedData = WorkoutSummaryProcessor.filterWorkoutsByTime(processedData,moment().subtract(56, 'day').startOf('day'), moment().endOf('day'));
						if(processedData.length > 0){
							DashBoardOperations.getSelectedUserDashBoardDetailsByMonth($scope, processedData);
							$scope.graphHeading = AUTH_EVENTS.graphHeading;
							$scope.caloriesHeading = AUTH_EVENTS.caloriesHeading;
							$scope.workoutHeading = AUTH_EVENTS.workoutHeading;							
						}else{							
							$scope.periodWeightLiftedData=[];							
						}
						
						$scope.dashBoardTemplateUrl = "angular-constructs/workout-statistics/DashBoardByMonth.html";
						$scope.SelectedExerciseName = exercisesList[0];						
						$scope.exercisesList = exercisesList;	
						$timeout(function() {
							 	var name = exercisesList[0].split(' ').join('');
								$("#"+name).addClass("active disabled");
						}, 1000);
				}else {
					$scope.showButons=false;
					$scope.dashBoardTemplateUrl = "angular-constructs/shared/noDataFound.html";
				}
			});
		},
		
		
		WorkoutStatisticsService.getSelectedMonthlyExercieGraphData = function($scope, exerciseName){
			_.each($scope.exercisesList, function(exerciseName){
				var exerciseName = exerciseName.split(' ').join('');
				$("#"+exerciseName).removeClass("active disabled");
			});
			var processedData = WorkoutSummaryProcessor.getSelectedExercisesData($scope.rawData, exerciseName);
				processedData = WorkoutSummaryProcessor.filterWorkoutsByTime(processedData,moment().subtract(56, 'day').startOf('day'), moment().endOf('day'));
				if(processedData.length > 0){
					DashBoardOperations.getSelectedUserDashBoardDetailsByMonth($scope, processedData);
					$scope.graphHeading = AUTH_EVENTS.graphHeading;
					$scope.caloriesHeading = AUTH_EVENTS.caloriesHeading;
					$scope.workoutHeading = AUTH_EVENTS.workoutHeading;
				}else{	
					$scope.periodWeightLiftedData=[];
				}
				
				$scope.SelectedExerciseName = exerciseName;
				$scope.dashBoardTemplateUrl = "angular-constructs/workout-statistics/DashBoardByMonth.html";
				
			var name = exerciseName.split(' ').join('');
				$("#"+name).addClass("active disabled");
			
		},
		
		
		WorkoutStatisticsService.getStatisticByYear =  function($scope, userid){
			//$scope.getUserID($scope, userid)
			$(".btn-group > .btn").removeClass("active disabled");
			$("#byYear").addClass("active disabled");
			$scope.showButons=false;
			$scope.dashBoardTemplateUrl = "angular-constructs/workout-statistics/DashBoardByYear.html";
		},
		
		WorkoutStatisticsService.getStatisticByCustom = function($scope, userid){
			//$scope.getUserID($scope, userid)
			$(".btn-group > .btn").removeClass("active disabled");
			$("#byCustom").addClass("active disabled");
			$scope.showButons=false;
			$scope.dashBoardTemplateUrl = "angular-constructs/workout-statistics/DashBoardByCustom.html";
		}

		return WorkoutStatisticsService;
});
