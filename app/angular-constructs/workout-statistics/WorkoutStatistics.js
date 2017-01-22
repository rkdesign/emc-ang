angular.module('WorkoutStatistics', ['chart.js'])
	.controller('WorkoutStatisticsController', function ($scope, $http, WorkoutDataService,SessionService,AuthService, AUTH_EVENTS, $timeout, $rootScope, WorkoutStatisticsService) {
		
		$scope.SelectedUserName="";
		$scope.SelectedUserid="";
		$scope.userList=[];
		$scope.exercisesList=[];
		$scope.rawData =[];
		$scope.showButons=false;
		$scope.graphHeading = AUTH_EVENTS.graphHeading;
		$scope.caloriesHeading = AUTH_EVENTS.caloriesHeading;
		$scope.workoutHeading = AUTH_EVENTS.workoutHeading;
		
		
		$scope.$on('$viewContentLoaded', function() {
			WorkoutStatisticsService.getStatisticByWeek($scope, null);
			$scope.getFriendsDetails();
		});
			
		
		$scope.getTotalWeightLifted = function(){
			WorkoutStatisticsService.getTotalWeightLifted($scope, null);
		};
		
		$scope.getWeightLiftedByExercises = function(){
			WorkoutStatisticsService.getWeightLiftedByExercises($scope, null);
		};
		
			
		$scope.getWeeklyExerciseReport = function(){
			WorkoutStatisticsService.getWeeklyExerciseReport($scope, null);
		};
		
		$scope.getMonthExerciseReport = function(){
			WorkoutStatisticsService.getMonthExerciseReport($scope, null);
		};
		
		$scope.getStatisticByYear = function(){
			WorkoutStatisticsService.getStatisticByYear($scope, null);
		};
		
		$scope.getStatisticByCustom = function(){
			WorkoutStatisticsService.getStatisticByCustom($scope, null);
		};
		
		$scope.getSelectedWeeklyExercieGraphData = function(exerciseName){
			WorkoutStatisticsService.getSelectedWeeklyExercieGraphData($scope, exerciseName);
		}
		
		$scope.getSelectedMonthlyExercieGraphData = function(exerciseName){
			WorkoutStatisticsService.getSelectedMonthlyExercieGraphData($scope, exerciseName);
		}
		
		//Get Friend List
		$scope.getFriendsDetails = function(){					
			AuthService.getFollowingFriendList()
			.success(function (data) {
				if(data.length > 0) {
					$scope.userList = $scope.getAllUserNames(data);
					$scope.user = $scope.userList[0];
				}
			})
			.catch(function (res) {
				$scope.authSuccess=false;
				$scope.authError = true;
				$scope.authFailureMessage ="Email :"+ email +" "+AUTH_EVENTS.EmailNotFound;
			});
		}
		
		
		$scope.getAllUserNames = function(data){
			var	userList=[];
				userList.push({nickname:"--Select User--", value :-1} )
			_.each(data, function(user){        		
        			userList.push({nickname:user.nickname, value:user.id} )
        	});  
			return userList;
		}
		
		$scope.getSelectedUserDetails =  function(user){	
			var userId =""
			if(user.value === -1){
				$scope.SelectedUserName = "";
				$scope.SelectedUserid = SessionService.getUserID();	
				userId = SessionService.getUserID();	
			}else{
				$scope.SelectedUserName = user.nickname;
				$scope.SelectedUserid = user.value;
				userId = user.value;
			}
			var selectedId;
			$(".btn-group > .btn").each(function(){
				if($(this).hasClass('active')){
					selectedId = this.id;
				}
			});
				
			if(selectedId === "byWeek"){
				WorkoutStatisticsService.getWeeklyExerciseReport($scope,userId);
			}else if(selectedId === "byMonth"){
				WorkoutStatisticsService.getMonthExerciseReport($scope, userId);				
			}else if(selectedId === "byYear"){
				WorkoutStatisticsService.getStatisticByYear($scope,userId);
			}else if(selectedId === "byCustom"){
				WorkoutStatisticsService.getStatisticByCustom($scope, userId);
			}
		};
		
		
		
		$scope.chartBatClick = function(evt){
			console.log(evt);			
		}
		
	});