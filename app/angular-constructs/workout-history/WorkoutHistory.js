angular.module('WorkoutHistory', ['chart.js','Authentication'])
	.service('WorkoutHistoryService', function () {

	})
	.controller('WorkoutHistoryController', function ($scope,  $state, SessionService, WorkoutDataService,AuthService, AUTH_EVENTS) {
		
		var selectedModule =  $state.current.data.selectedModule;		
		$scope.SelectedUserName="";
		$scope.SelectedUserid="";
		$scope.userList=[];
		$scope.days = 14;
		$scope.showButons=false;
		$scope.Math = window.Math;
		
		$scope.$on('$viewContentLoaded', function() {
			$scope.getHistoryByDate(null);
			$scope.getFriendsDetails();
		});
		
		$scope.getHistoryByDate = function(userid){
			WorkoutDataService.getUserWorkoutHistory($scope.getUserID(userid))
			.success(function (data) {		
				$(".btn-group > .btn").removeClass("active disabled");	
				DashBoardOperations.getSelectedUserHistroyDetailsByDate($scope, data, $scope.days);
				$scope.historyTemplateUrl="angular-constructs/workout-history/WorkoutHistoryByDate.html";					
				$("#byDate").addClass("active disabled");	
				$scope.activeSelectedButtons();
				$scope.showButons=true;
			});
		}
				
		$scope.gethistoryByExercise = function(userid){
			WorkoutDataService.getUserWorkoutHistory($scope.getUserID(userid))
			.success(function (data) {		
				$(".btn-group > .btn").removeClass("active disabled");	
				DashBoardOperations.getSelectedUserHistroyDetailsByExercise($scope, data, $scope.days);
				$scope.historyTemplateUrl="angular-constructs/workout-history/WorkoutHistoryByExercise.html";
				$("#byExercise").addClass("active disabled");
				$scope.activeSelectedButtons();
				$scope.showButons=true;
			});			
		}	
		
		$scope.yearlyUnderConstruction = function(){						
			$scope.historyTemplateUrl = "angular-constructs/workout-history/WorkoutHistroyByYear.html";	
			$scope.activeSelectedButtons();
			$scope.showButons=false;
		}
		$scope.customUnderConstruction = function(){						
			$scope.historyTemplateUrl = "angular-constructs/workout-history/WorkoutHistroyByCustom.html";	
			$scope.activeSelectedButtons();
			$scope.showButons=false;
		}
		
		$scope.getHistroyByWeek  = function(){
			$scope.days = 14;
			$scope.getSelectedbutton($scope.getUserID(null));
		}
		
		$scope.getHistroyByMonth  = function(){
			$scope.days = 30;
			$scope.getSelectedbutton($scope.getUserID(null));
		}
		
		$scope.getHistroyByYear = function(){			
			/* TODO  */
			$scope.days = 7;
			//$scope.getSelectedbutton($scope.getUserID(null));
			$(".btn-group > .btn").removeClass("active disabled");
			$scope.yearlyUnderConstruction();	
		}
		
		$scope.getHistroyByCustom  = function(){		
			
			/* TODO  */
			$scope.days = 10;
			//$scope.getSelectedbutton($scope.getUserID(null));
			$(".btn-group > .btn").removeClass("active disabled");
			$scope.customUnderConstruction();	
		}
		
		$scope.activeSelectedButtons = function(){
				switch ($scope.days) {
			    case 14:
			    	$("#byWeek").addClass("active disabled");
			        break;
			    case 30:
			    	$("#byMonth").addClass("active disabled");
			        break;
			    case 7:
			    	$("#byYear").addClass("active disabled");
			    	break;
			    case 10:
			    	$("#byCustom").addClass("active disabled");
			        break;
			};
		}
		$scope.getUserID = function(userid){
			var currentUserId="";
			if(userid){
				currentUserId = userid;
			}else if($scope.SelectedUserName !== ""){
				currentUserId = $scope.SelectedUserid;
			}else {
				currentUserId = SessionService.getUserID();
			}
			return currentUserId;
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
			
			$scope.getSelectedbutton(userId);
			
		}
		
		$scope.getSelectedbutton = function(userId){
			var selectedId;
			$(".btn-group > .btn").each(function(){
				if($(this).hasClass('active')){
					selectedId = this.id;
				}
			});
			
			if(selectedId === "byDate"){
				$scope.getHistoryByDate(userId);
			}else if(selectedId === "byExercise"){
				$scope.gethistoryByExercise(userId);
			}else{
				$scope.getHistoryByDate(userId);
			}
		}
		
		
	});