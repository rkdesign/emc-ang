angular.module('AdminDebug',[])
.controller('DebugController',  function ($scope, $http, $state, AdminDataService, AUTH_MESSAGES, AUTH_EVENTS,  SessionService ) {
		$scope.authError = false;
		$scope.authSuccess=false; 
		$scope.adminAuth = true;		
		$scope.errorMessage= false;
		
		var selectedModule =  $state.current.data.selectedModule;
		$(".nav-tabs > li").removeClass("active");
		$("#adminDebug").addClass("active");
		
		$scope.resetMessage= function(){
        	$scope.authError = false;
    		$scope.authSuccess=false;
        }
		
		$scope.$on('$viewContentLoaded', function() {				
			$scope.getAllExerciseMachineList();			
		})
		
		 $scope.getAllExerciseMachineList = function(){
	    	$scope.resetMessage();	    	
	       
	        AdminDataService.getAllExerciseMachineList()
	    	.success(function (data) {
	    		var exerciseMachineList = [];
	    			exerciseMachineList.push({name:"--Select Exercise Machine--", uid :-1} );
	    			_.each(data, function(item){        		
	    				exerciseMachineList.push(item );
	    			});  
    		$scope.exerciseMachineList = exerciseMachineList;
    		$scope.exerciseMachine = exerciseMachineList[0];
    		$scope.trainingCenter = true;  
  		
	    	})
	    	.catch(function (res) {
	    		var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
	    		$scope.authFailureMessage = message;			
	    		$scope.authError = true;
	    	});
	        $scope.adminTemplateUrl = "angular-constructs/admin/AdminDebug.html";		
	    };
	    
	    $scope.getCurrentExerciseList = function(exerciseMachine){
	    	if(exerciseMachine.uid < 0){
	    		$scope.fitnessCenterOrganizedData=[];
	    		$scope.dateKeys= [];
	    		$scope.errorMessage= false;
	    		return false;
	    	}
			AdminDataService.getCurrentExerciseRecordList(exerciseMachine.uid)
	    	 .success(function (data ) {
		    		 if(data && data.strengthExerciseRecords.length > 0){
			    		var dateOrganizedData = WorkoutSummaryProcessor.getSelectedTrainingCenterExercise(data);
						var dateKeys = Object.keys(dateOrganizedData);
							dateKeys.sort();
							dateKeys.reverse();
							$scope.fitnessCenterOrganizedData = dateOrganizedData;
							$scope.dateKeys = dateKeys;
		    		 }else{
						 $scope.fitnessCenterOrganizedData=[];
						 $scope.dateKeys=[];
					 }
		    	})
		    	.catch(function (res) {
		    		var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
		    		$scope.authFailureMessage = message;			
		    		$scope.authError = true;
		    	});
	    };
	    
	    
	    
	});