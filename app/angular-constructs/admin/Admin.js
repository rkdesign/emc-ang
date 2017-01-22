angular.module('Admin',[])
	.controller('AdminController', function ($scope, $http,AUTH_EVENTS, AUTH_MESSAGES, AdminDataService) {
		$scope.authError = false;
		$scope.authSuccess=false;
		$scope.newField = {};
        $scope.editing = false;
        $scope.adminAuth = true;
        $scope.createForm= true;
        $scope.allExerices = false;
        $scope.adminCnt = true;
        $scope.fitnessCnt = false;
        
        $(".nav-tabs > li").removeClass("active");
        $("#exerciseList").addClass("active");
        
        $scope.$on('$viewContentLoaded', function() {
			$scope.getAllExerciseList();
		});
		
        $scope.resetMessage= function(){
        	$scope.authError = false;
    		$scope.authSuccess=false;
        }
        
               
        $scope.getAllExerciseList = function(){ 
        	 $scope.resetMessage();		
        	 $scope.createForm= true;
             $scope.allExerices = false;
        	 //get All Exercise records
    		AdminDataService.getExerciseList()
    		.success(function (data) {			
    			$scope.exerciseList = data;
    		})
    		.catch(function (res) {
    			if(res.data.error.code === "AUTHORIZATION_REQUIRED"){
    				 $scope.adminAuth= false;
    			}
    			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
    			$scope.authFailureMessage = message;			
    			$scope.authError = true;
    		});
    		
    		$scope.adminTemplateUrl = "angular-constructs/admin/ExerciseList.html";	
        }
        
       
		
		//Edit Exercise records
		$scope.editExercise = function(exercise) {
	        $scope.editing =true; 
	        $scope.editing = $scope.exerciseList.indexOf(exercise);
	        $scope.newField = angular.copy(exercise);
	    }
		
		
	    //save / update Exercise records
	    $scope.saveExercise = function(exercise) {
	    	 $scope.resetMessage();		
	        if ($scope.editing !== false) {	           
	            $scope.editing = false;
	        }       
	        
	       /* $scope.$broadcast('runCustomValidations', {
	            forms: ['adminForm']
	        });*/
			/*if(this.adminForm.$valid) {*/
		        AdminDataService.updateExercise(exercise)
		        .success(function (data) {			
		        	 $scope.newField = data;
		        	 $scope.exerciseList[$scope.editing] = $scope.newField;
		        	 $scope.authSuccessMessage = exercise.name + AUTH_EVENTS.exerciseUpdatedSuccessfully;
		        	 $scope.authSuccess=true;
		        	 $scope.authError = false
				})
				.catch(function (res) {
					var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
					$scope.authFailureMessage = message;
					$scope.exerciseList[$scope.editing] = $scope.newField;
					$scope.authSuccess=false;
					$scope.authError = true;
				});
			}
	   /* };*/
	    
	    //cancel update records
	    $scope.cancelEdit = function() {
	        if ($scope.editing !== false) {	  
	        	$scope.exerciseList[$scope.editing] = $scope.newField;
	            $scope.editing = false;
	        }       
	    };
		
	    //Delete Exercise records
	    $scope.deleteExercise = function(exercise, index){
	    	 $scope.resetMessage();		
	    	AdminDataService.deleteExercise(exercise)
			.success(function (data) {			
				$scope.exerciseList.splice(index, 1);
				$scope.authSuccessMessage = exercise.name + AUTH_EVENTS.exerciseDeletedSuccessfully;
				 $scope.authSuccess=true;
	        	 $scope.authError = false
			})
			.catch(function (res) {
				var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
				$scope.authFailureMessage = message;				
				$scope.authError = true;
				$scope.authSuccess=false;				
			});
	    };
	    
	    //load Create Exerice form
	    $scope.getCreateExerciseForm = function(){
	    	 $scope.resetMessage();		
	    	 $scope.createForm= false;
	         $scope.allExerices = true;
	    	 $scope.adminTemplateUrl = "angular-constructs/admin/createExercise.html";	
	    };
	    
	    //Create Exercise records
	    $scope.createExercise = function(exercise){	   
	    	$scope.$broadcast('runCustomValidations', {
	            forms: ['exerciseForm']
	        });    	

			if(this.exerciseForm.$valid) {		    	

		    	AdminDataService.createExercise(exercise)
				.success(function (data) {	
					$scope.authSuccess = true;
					$scope.authError = false;
					$scope.authSuccessMessage = data.name + AUTH_EVENTS.exerciseCreateSuccessfully;
					//$state.go("fitnesscenter");
				})
				.catch(function (res) {
					var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
					$scope.authFailureMessage = message;					
					$scope.authError = true;
					$scope.authSuccess = false;
				})
		    	.finally(function () {
					$scope.exercise.name = "";
					$scope.exercise.description = "";
				});
		    }
	    }
		
	})
	.controller('ExerciseMachineController', function ($scope, $http, $state, AdminDataService, AUTH_MESSAGES, AUTH_EVENTS, $q) {
		$scope.authError = false;
		$scope.authSuccess=false;
		$scope.newField = {};
        $scope.editing = false;
        $scope.myWeights = [];
        $scope.myExercise = [];       
        $scope.updatedList=[];
        $scope.deleteList=[];
        $scope.adminAuth = true;
        $scope.createExerForm= true;
        $scope.allExericesMachine = false;
        $scope.adminCnt = false;
        $scope.fitnessCnt = true;
        $scope.showModal = false;
        $scope.allExercise=[];
        
        $scope.selected_items = [];
        
        $scope.resetMessage= function(){
        	$scope.authError = false;
    		$scope.authSuccess=false;
    		$scope.updatedList=[];
    		$scope.deleteList=[];
        }
               
        
        $(".nav-tabs > li").removeClass("active");
        $("#exerciseMachineList").addClass("active");
        
        $scope.$on('$viewContentLoaded', function() {
			$scope.getAllExerciseMachineList();
		});
		
        $scope.getAllExerciseMachineList =  function(){
        	 $scope.resetMessage();		
        	 $scope.createExerForm= true;
             $scope.allExericesMachine = false;            
             $scope.resetMessage();
        	 //get All Exercise records
    		AdminDataService.getAllExerciseMachineList()
    		.success(function (data) {	
    			$scope.getAllExerciseList(data);
    			/*$scope.allExercise =  $scope.getExercises(data);    			
    			$scope.exerciseMachineList = $scope.mapAllExercie(data,$scope.allExercise); 
    			$scope.exerciseMachineList = data; 
    			console.log($scope.exerciseMachineList)*/
    		})
    		.catch(function (res) {
    			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
    			$scope.authFailureMessage = message;			
    			$scope.authError = true;
    		});
    		
    		$scope.adminTemplateUrl = "angular-constructs/admin/exerciseMachine.html";	
        };
       
         $scope.getAllExerciseList = function(exerciseMachines){ 
        	AdminDataService.getExerciseList()
    		.success(function (data) {
    			$scope.allExercise =  data   			
    			var exerciseMachineList = $scope.mapAllExercie(exerciseMachines,data); 
    			$scope.exerciseMachineList  = _.sortBy(exerciseMachineList, function(exerciseMachine){return exerciseMachine.name});
    			//$scope.exerciseMachineList = exerciseMachines;    				
    		})
    		.catch(function (res) {
    			if(res.data.error.code === "AUTHORIZATION_REQUIRED"){
    				 $scope.adminAuth= false;
    			}
    			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
    			$scope.authFailureMessage = message;			
    			$scope.authError = true;
    		});
    		
        }
                
        
        $scope.getExercises = function(dataObj ){
        	var tempExerciesList =[];
        	_.each(dataObj, function(exercisesList){
        		_.each(exercisesList.strengthExerciseDefinitions, function(exercises){
        			tempExerciesList.push(exercises);
        		});        		
        	});        	
        	return _.uniq(tempExerciesList, false, function(exercise){ return exercise.name; });
        	
        };
        
       $scope.mapAllExercie = function(exerciseMachineList, allExercise){
        	
        	return _.each(exerciseMachineList, function(exercisesList){          		
            	exercisesList.currentExercises=[];             
        		_.each(exercisesList.strengthExerciseDefinitions, function(exercises){	        		
	        		exercisesList.currentExercises.push(exercises);	        		
        		});
        		exercisesList.allExercises = allExercise;        		
        	});
        };
        
       
       
		//Edit Exercise records
		$scope.editExerciseMachine = function(exerciseMachine) {
			 $scope.resetMessage();			       	        
	        $scope.editing = $scope.exerciseMachineList.indexOf(exerciseMachine);
	        $scope.newField = angular.copy(exerciseMachine);
	       		
	    }
		
		
	    //update Exercise records
	    $scope.saveExerciseMachine = function(exerciseMachine, myWeights, myExercise) {
	    	 $scope.resetMessage();		
	       if ($scope.editing !== false) {	           
	            $scope.editing = false;
	        }    
	       
	        if(myWeights.length > 0){
	        	exerciseMachine.weightRange = myWeights;
	        }
	        if(myExercise.length >0 ){  
	        	var savedExerciseList=[];
	        	var deleteExerciseList=[];
	        		        	
	        	_.each(exerciseMachine.strengthExerciseDefinitions, function(exercise){
	        		if(_.where(myExercise, {id:exercise.id }).length === 0){
	        			deleteExerciseList.push(exercise)
	        		}
	        	});
	        	
	        	_.each(myExercise, function(exercise){
	        		if(_.where(exerciseMachine.strengthExerciseDefinitions, {id:exercise.id }).length === 0){
	        			savedExerciseList.push(exercise)
	        		}
	        	});        	
	             	
	        }
	        
	        $scope.$broadcast('runCustomValidations', {
	            forms: ['fitnessForm']
	        });
			if(this.fitnessForm.$valid) {
				var name = exerciseMachine.name;
		       AdminDataService.updateExerciseMachine(exerciseMachine)
		        .success(function (data) {		
		        	$scope.authSuccessMessage = name +" "+ AUTH_EVENTS.exerciseMachineUpdatedSuccessfully;
		        	$scope.authSuccess = true;
					$scope.authError = false;	
		        	if(savedExerciseList.length >0){
			        	$scope.addExerciseToExerciseMachine(data, savedExerciseList, function(calBackdata){
			        		
			        		var updateList = $scope.getUpdatedExercise(calBackdata,savedExerciseList);
			        		exerciseMachine.currentExercises = myExercise;
			        		exerciseMachine.exercises = myExercise;
		        						        		
			        		$scope.updatedList=updateList.join(",") +" exercises are added to "+ name;
			        						        				        							
			        	});	
			        		
		        	}
		        	if(deleteExerciseList.length >0){
		        		$scope.deleteExerciseToExerciseMachine(data, deleteExerciseList, function(calBackdata){
			        		
		        			var updateList=[];
		        			
		        			exerciseMachine.currentExercises = myExercise;
			        		exerciseMachine.exercises = myExercise;
		        			
		        		/*	_.each(deleteExerciseList, function(exercise, index){
		    	        		if(_.where(exerciseMachine.exercises, {id:exercise.id }).length === 0){
		    	        			exerciseMachine.currentExercises.splice(index,1);
		    	        			exerciseMachine.exercises.splice(index,1)
		    	        		}
		    	        	});*/
		        						
			        		_.each(deleteExerciseList, function(exercise){			        			
			        			updateList.push(exercise.name);
			        		})			        		
			        		$scope.deleteList=updateList.join(",") +" exercises are removed from "+ name;
							
			        	});	
		        	}
					
				})
				.error(function(res){
					
				})
				.catch(function (res) {
					var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
					$scope.authFailureMessage = message;					
					$scope.authError = true;
					$scope.authSuccess = false;
				});
			}
	    };
	    
	    $scope.getUpdatedExercise = function(rawData,exercises){
	    	var updateList=[];
	    	_.each(exercises, function(exercise){
				_.each(rawData,function(savedExercise){
					if(savedExercise.exerciseDefinitionId === exercise.id ){
						updateList.push(exercise.name);
					}
				})
			});
	    	return updateList;
	    }
	    
	    //cancel update records
	    $scope.cancelEdit = function() {
	    	 $scope.resetMessage();
	        if ($scope.editing !== false) {	  
	        	$scope.exerciseMachineList[$scope.editing] = $scope.newField;
	            $scope.editing = false;
	        }       
	    };
		
	    //Delete Exercise records
	    $scope.deleteExerciseMachine = function(exerciseMachine, index){	
	    	 $scope.resetMessage();		
	    	AdminDataService.deleteExerciseMachine(exerciseMachine)
			.success(function (data) {			
				$scope.authSuccess = true;
				$scope.authError = false;
				$scope.authSuccessMessage = exerciseMachine.name +" "+ AUTH_EVENTS.exerciseMachineDeletedSuccessfully;
				$scope.exerciseMachineList.splice(index, 1);
			})
			.catch(function (res) {
				var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
				$scope.authFailureMessage = message;				
				$scope.authError = true;
			});
	    };
	    
	    
	    $scope.getCreateExerciseMachineForm = function(){
	    	$scope.resetMessage();
	    	$scope.createExerForm= false;
	        $scope.allExericesMachine = true;
	       
	        AdminDataService.getFitnessCenterList()
	    	.success(function (data) {
	    		var FitnessCenterList = [];
	    			FitnessCenterList.push({name:"--Select Fitness Center--", value :-1} );
	    			_.each(data, function(item){        		
	    				FitnessCenterList.push(item );
	    			});  
    		$scope.FitnessCenterList = FitnessCenterList;
    		$scope.fitnessCenter = FitnessCenterList[0];
	    	})
	    	.catch(function (res) {
	    		var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
	    		$scope.authFailureMessage = message;			
	    		$scope.authError = true;
	    	});
	        
	        
	        $scope.adminTemplateUrl = "angular-constructs/admin/createExerciseMachine.html";	
	    };
	    
	       
	    
	    //Create Exercise records
	    $scope.createExerciseMachine = function(fitnessCenter, exerciseMachine, myWeights, myExercise){	
	    	 $scope.resetMessage();
	    	 if(fitnessCenter.value === -1){
	    			$scope.authFailureMessage = "Please Select Fitness Center";					
					$scope.authError = true;
					return false;
	    	 }
	    	
	    	 if(myWeights){
		        	exerciseMachine.weightRange = [];
		        	var tempList = myWeights.split(",");
		        	if(parseInt(tempList)){
			        	for(var i = 0; i< tempList.length; i++){
			        		if(parseInt(tempList[i])){
			        			exerciseMachine.weightRange.push(tempList[i])
			        		}
			        	}	
		        	}
		        
		        	if(exerciseMachine.weightRange.length === 0){
		        		$scope.authFailureMessage = "Please enter valid weight range";		
		        		myWeights="";
						$scope.authError = true;
						return true;
		        	}
		        }
	    	 
	    	 if(myExercise){
		        	exerciseMachine.exercises=[];
		        	for(var i=0; i< myExercise.length; i++){
		        		exerciseMachine.exercises.push({
		        			id : myExercise[i].id,
		        			name : myExercise[i].name,
		        			description : myExercise[i].description
		        		})
		        	}        	
		        }
	    	
	    	$scope.$broadcast('runCustomValidations', {
	            forms: ['exerciseMachineForm']
	        });
	    	
			if(this.exerciseMachineForm.$valid) {
				var name = exerciseMachine.name;
		    	AdminDataService.createExerciseMachine(fitnessCenter.id, exerciseMachine)
				.success(function (data) {	
					$scope.addExerciseToExerciseMachine(data, exerciseMachine.exercises, function(calBackdata){						
						var updateList = $scope.getUpdatedExercise(calBackdata,exerciseMachine.exercises);						
						$scope.updatedList=updateList.join(",") +" exercises are mapped to "+ name;	
					});		
					
					
					$scope.authSuccess = true;
					$scope.authError = false;
					$scope.authSuccessMessage = data.name + AUTH_EVENTS.exerciseCreateSuccessfully;
					//$state.go("fitnesscenter");
				})
				.catch(function (res) {
					var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
					$scope.authFailureMessage = message;					
					$scope.authError = true;
					$scope.authSuccess = false;
				})
		    	.finally(function () {
					exerciseMachine.name = "";
					exerciseMachine.uid = "";
					$scope.myExercise="";
					$scope.myWeights="";
					$scope.fitnessCenter = $scope.FitnessCenterList[0];
				});
		    }
	    }		
	    	    
	    
	    $scope.addExerciseToExerciseMachine = function (data, exercises, callback) {
	    	 var prom = [];    	 
	    	 
	    	 exercises.forEach(function (exercise, i) {
	    		 prom.push(AdminDataService.addExerciseToExerciseMachine(data, exercise));	    		 
	    	 });
	    	 
	    	 $q.all(prom).then(function (data) {
	    		 callback(data);	           
	         });
	    }
	    
	    
	    $scope.deleteExerciseToExerciseMachine= function (data, exercises, callback) {
	    	 var prom = [];    	 
	    	 
	    	 exercises.forEach(function (exercise, i) {
	    		 prom.push(AdminDataService.deleteExerciseToExerciseMachine(data, exercise));	    		 
	    	 });
	    	 
	    	 $q.all(prom).then(function (data) {
	    		 callback(data);	           
	         });
	    }
	})
	.controller('AdminDashBoardController', function ($scope, $http, $state, AdminDataService, AUTH_MESSAGES, AUTH_EVENTS,WorkoutDataService,SessionService, $rootScope, WorkoutStatisticsService) {
		$scope.authError = false;
		$scope.authSuccess=false;
		$scope.showGraph=false;
		$scope.templateUrl="";
		$scope.userValue="";
		$scope.downloadBtn = false;
		$scope.graphHeading = AUTH_EVENTS.graphHeading;
		$scope.caloriesHeading = AUTH_EVENTS.caloriesHeading;
		$scope.workoutHeading = AUTH_EVENTS.workoutHeading;
		$scope.days = 14;
		$scope.showButons=false;
		$scope.Math = window.Math;
		
		var selectedModule =  $state.current.data.selectedModule;
		if(selectedModule === 'history'){
			$scope.downloadBtn  = true;
		}
		
		AdminDataService.getAllUsersList()
		.success(function (data) {
			$scope.userList =  $scope.getAllUserNames(data);
			$scope.user = $scope.userList[0];
			$scope.showButons=true;
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
		});
	
		$scope.getAllUserNames = function(data){
			var	userList=[];
				userList.push({nickname:"--Select User--", value :-1} )
			_.each(data, function(user){        		
        			userList.push({nickname:user.nickname, value:user.id} )
        	});  
			return userList;
		}
		
		$scope.getSelectedUserDetails =  function(user){
			console.log("selected user details : "+user);
			
			if(user.value === -1){
				$scope.SelectedUserName = "";
				$scope.showGraph=false;
				return false;
			}
			$scope.userValue = user.value;
			
			WorkoutDataService.getUserWorkoutHistory(user.value)
			.then(function (data) {	
				if(data && data.data.length >0){				
					
					if(selectedModule === 'dashboard'){	
						$scope.templateUrl = "angular-constructs/workout-statistics/WorkoutStatistics.html";
						WorkoutStatisticsService.getStatisticByWeek($scope, $scope.userValue);						
					}else if(selectedModule === 'history'){
						DashBoardOperations.getSelectedUserHistroyDetailsByDate($scope, data.data, $scope.days);	
						$scope.templateUrl = 'angular-constructs/workout-history/WorkoutHistory.html';
						$scope.historyTemplateUrl="angular-constructs/workout-history/WorkoutHistoryByDate.html";
						$(".btn-group > .btn").removeClass("active");
						$("#byDate").addClass("active");
						$scope.activeSelectedButtons();	
						$scope.showButons=true;
					}					
				}else{
					$scope.templateUrl = "angular-constructs/shared/noDataFound.html";
				}
				
				$scope.SelectedUserName = user.nickname;
				$scope.showGraph=true;
			});
			
		}		
			
		

		$scope.getTotalWeightLifted = function(){
			WorkoutStatisticsService.getTotalWeightLifted($scope, $scope.userValue);
		};
		
		$scope.getWeightLiftedByExercises = function(){
			WorkoutStatisticsService.getWeightLiftedByExercises($scope, $scope.userValue);
		};
		
			
		$scope.getWeeklyExerciseReport = function(){
			WorkoutStatisticsService.getWeeklyExerciseReport($scope, $scope.userValue);
		};
		
		$scope.getMonthExerciseReport = function(){
			WorkoutStatisticsService.getMonthExerciseReport($scope, $scope.userValue);
		};
		
		$scope.getStatisticByYear = function(){
			WorkoutStatisticsService.getStatisticByYear($scope, $scope.userValue);
		};
		
		$scope.getStatisticByCustom = function(){
			WorkoutStatisticsService.getStatisticByCustom($scope, $scope.userValue);
		};
		
		$scope.getSelectedWeeklyExercieGraphData = function(exerciseName){
			WorkoutStatisticsService.getSelectedWeeklyExercieGraphData($scope, exerciseName);
		}
		
		$scope.getSelectedMonthlyExercieGraphData = function(exerciseName){
			WorkoutStatisticsService.getSelectedMonthlyExercieGraphData($scope, exerciseName);
		}
		
	
		
		$scope.gethistoryByExercise = function(){
			WorkoutDataService.getUserWorkoutHistory($scope.userValue)
			.success(function (data) {		
				$(".btn-group > .btn").removeClass("active");	
				DashBoardOperations.getSelectedUserHistroyDetailsByExercise($scope, data, $scope.days);
				$scope.historyTemplateUrl="angular-constructs/workout-history/WorkoutHistoryByExercise.html";
				$("#byExercise").addClass("active disabled");
				$scope.activeSelectedButtons();	
				$scope.showButons=true;
			});			
		}
		
		$scope.getHistoryByDate = function(){
			WorkoutDataService.getUserWorkoutHistory($scope.userValue)
			.success(function (data) {		
				$(".btn-group > .btn").removeClass("active disabled");	
				DashBoardOperations.getSelectedUserHistroyDetailsByDate($scope, data, $scope.days);
				$scope.historyTemplateUrl="angular-constructs/workout-history/WorkoutHistoryByDate.html";					
				$("#byDate").addClass("active disabled");
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
			$scope.getSelectedbutton();
		}
		
		$scope.getHistroyByMonth  = function(){
			$scope.days = 30;
			$scope.getSelectedbutton();
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
		
		$scope.getSelectedbutton = function(){
			var selectedId;
			$(".btn-group > .btn").each(function(){
				if($(this).hasClass('active')){
					selectedId = this.id;
				}
			});
			
			if(selectedId === "byDate"){
				$scope.getHistoryByDate();
			}else if(selectedId === "byExercise"){
				$scope.gethistoryByExercise();
			}else{
				$scope.getHistoryByDate();
			}
		}
		
		
	})
	.controller('AdminLiveWorkOutController', function ($scope, $http, $state, AdminDataService, AUTH_MESSAGES, AUTH_EVENTS,WorkoutDataService, URLS, $interval, SessionService) {
		$scope.authError = false;
		$scope.authSuccess=false; 
		$scope.showGraph=false;
		$scope.templateUrl="";
		$scope.user="Select User";
		
		
		AdminDataService.getAllUsersList()
		.success(function (data) {
			$scope.userList =  $scope.getAllUserNames(data);
			$scope.user = $scope.userList[0];
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
		});
	
		$scope.getAllUserNames = function(data){
			var	userList=[];
				userList.push({nickname:"--Select User--", value :-1} )	
			_.each(data, function(user){        		
        			userList.push({nickname:user.nickname, value:user.id} )
        	});  
			return userList;
		}
		
		$scope.getSelectedUserDetails =  function(user){	
			if(user.value === -1){
				$scope.SelectedUserName = "";
				$scope.showGraph=false;
				return false;
			}			
			$scope.selectedUser = user;
			var stop;
			var tick = function () {			
				DashBoardOperations.getSelectedUserLiveWorksDetails($scope, $scope.selectedUser.value, URLS, $http, SessionService);	
				$scope.templateUrl = 'angular-constructs/workout-live/WorkoutLive.html';
				$scope.showGraph=true;
			}

			stop =  $interval(tick, 2000);
			$scope.$on('$destroy', function () { 
					$interval.cancel(stop); 
			});
			
		
			
			
			$scope.SelectedUserName = user.nickname;
			
		}
			
	})
	.controller('DownloadFileController', function ($scope, $http, $state, AdminDataService, AUTH_MESSAGES, AUTH_EVENTS,WorkoutDataService, URLS, $interval, SessionService,$q ) {
	
		$scope.authError = false;
		$scope.authSuccess=false; 
		$scope.showGraph=false;
		$scope.templateUrl="";
		$scope.users=0;	
		$scope.dummyList=[];
		
		AdminDataService.getAllUsersList()
		.success(function (data) {
			$scope.userList =  $scope.getAllUserNames(data);			
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
		});
	
		$scope.getAllUserNames = function(data){
			var	userList=[];				
			_.each(data, function(user){  
				if(user.nickname){
        			userList.push({name:user.nickname, value:user.id} )
				}
        	});  
			return userList;
		}
		
		$scope.getSelectedUsersDetails =  function(){	
			var userValue=[];
			if($scope.users.length === 0){				
				return false;
			}		
			
			_.each($scope.users, function(user){
				userValue.push(user.value);
			})
			//var data = [{"userName":"Chad","dateObj":[{"date":"28-09-2015","exercise":[{"Exercise Name":"Leg Extension","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Bench Press","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Chest Fly","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Bicep Curl","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Leg Extension","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]}]},{"date":"30-09-2015","exercise":[{"Exercise Name":"Leg Extension","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Bench Press","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Chest Fly","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Bicep Curl","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Leg Extension","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]}]},{"date":"01-10-2015","exercise":[{"Exercise Name":"Leg Extension","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Bench Press","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Chest Fly","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Bicep Curl","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Leg Extension","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]}]}]},{"userName":"Rama","dateObj":[{"date":"28-09-2015","exercise":[{"Exercise Name":"Leg Extension","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Bench Press","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Chest Fly","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Bicep Curl","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Leg Extension","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]}]},{"date":"30-09-2015","exercise":[{"Exercise Name":"Leg Extension","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Bench Press","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Chest Fly","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Bicep Curl","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Leg Extension","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]}]},{"date":"01-10-2015","exercise":[{"Exercise Name":"Leg Extension","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Bench Press","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Chest Fly","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Bicep Curl","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]},{"Exercise Name":"Leg Extension","set":[1,2],"Weight":[60,60],"Reps":[12,12],"Contract Time":[".5s",".9s"],"Extend Time":[".5s",".9s"]}]}]}]
			//CSVConvertor.JSONToCSVConvertor(data, true);		
				$scope.allUserHistoryDetails(userValue,  function(value){
					var results = WorkoutSummaryProcessor.getParserDetails($scope.users, value);
					CSVConvertor.JSONToCSVConvertor(results);	
				});
		        	
			
		},
		
		 $scope.allUserHistoryDetails = function (data, callback) {
	    	 var prom = [];    	 
	    	 
	    	 data.forEach(function (usersID, i) {
	    		 prom.push(WorkoutDataService.getUserWorkoutHistory(usersID));	    		 
	    	 });
	    	 
	    	 $q.all(prom).then(function (data) {
	    		 callback(data);	           
	         });
	    }
		
	})
	.controller('MailCenterController', function ($scope, $http, $state, AdminDataService, AUTH_MESSAGES, AUTH_EVENTS, URLS, $interval, SessionService ) {
		$scope.authError = false;
		$scope.authSuccess=false; 
		$scope.showGraph=false;
		$scope.adminAuth = true;
		$scope.templateUrl="";
		$scope.users=0;		
		
		var selectedModule =  $state.current.data.selectedModule;
		$(".nav-tabs > li").removeClass("active");
		$("#mailCenter").addClass("active");
		
		$scope.$on('$viewContentLoaded', function() {
			$scope.getAllUsers();
			
		})
			
	
		$scope.getAllUsers =  function(){	
			AdminDataService.getAllUsersList()
			.success(function (data) {
				var userList = [];
				if(data.length>0){
					_.each(data, function(user){
						user.checked= false;
						if(user.smartWeightsUserOptions && user.smartWeightsUserOptions.enableWeeklySummaryEmail){
							userList.push(user);
						}
					});					
					
					$scope.UserList = userList;
				}				
			})
			.catch(function (res) {
				var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
				$scope.authFailureMessage = message;			
				$scope.authError = true;
			});				 
			$scope.adminTemplateUrl = "angular-constructs/admin/mailConfiguration.html";
		}
		
		
		$scope.getSelectedUserList= function(userlist){
			var selectedUserList =[];			
			
			_.each(userlist, function(user){
				if(user.checked){
					selectedUserList.push(user);
				}
			});
			
			if(selectedUserList.length>0){
				for (var i = 0; i < selectedUserList.length; i++) {
				    (function(index) {
				        setTimeout(function() { 
				        	$scope.CallMailService(selectedUserList[index]);
				        	}, i * 3000);
				    })(i);
				}	
				 
			}
		}
		
		
		$scope.CallMailService = function(user){
			var idRegex = new RegExp("\\[USERID\\]", "ig");
			var url = (URLS.SITE_URL + URLS.HISTORY).replace(idRegex, encodeURIComponent(user.id));
			var params= "filter={\"include\":[\"strengthExerciseDefinition\",  {\"sets\":[\"reps\"]}]}";
			url = url+"?"+params;
						
			mailService.weeklyWorkoutMailService(URLS.EXTERNAL_SITE_URL+URLS.MAIL_WEEKLY_REPORT_ACTION_NAME, url, SessionService.getID(), user.email,user.username);
			
			
		}
	})
	.controller('ExerciseProgressController', function ($scope, $http, $state, AdminDataService, AUTH_MESSAGES, AUTH_EVENTS,  SessionService, $interval ) {
		$scope.authError = false;
		$scope.authSuccess=false; 
		$scope.adminAuth = true;
		$scope.showError = false;
		$scope.templateUrl="";
		$scope.chartObject =[];
		$scope.selectedFitnessCenterId = -1;
		var tick;
		var stop;
		
		var selectedModule =  $state.current.data.selectedModule;
		$(".nav-tabs > li").removeClass("active");
		$("#exerciseInProgress").addClass("active");
		
		$scope.resetMessage= function(){
        	$scope.authError = false;
    		$scope.authSuccess=false;
        }
		
		$scope.$on('$viewContentLoaded', function() {
			$scope.getFitnessCenterList();			
		})
		
		
		 $scope.getFitnessCenterList = function(){
	    	$scope.resetMessage();	    	
	       
	        AdminDataService.getFitnessCenterList()
	    	.success(function (data) {
	    		var FitnessCenterList = [];
	    			FitnessCenterList.push({name:"--Select Fitness Center--", id :-1} );
	    			_.each(data, function(item){        		
	    				FitnessCenterList.push(item );
	    			});  
    		$scope.FitnessCenterList = FitnessCenterList;
    		$scope.fitnessCenter = FitnessCenterList[0];
	    	})
	    	.catch(function (res) {
	    		var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
	    		$scope.authFailureMessage = message;			
	    		$scope.authError = true;
	    	});
	        
	        
	        $scope.adminTemplateUrl = "angular-constructs/admin/exerciseInProgress.html";	
	    };
	    
	    $scope.getCurrentExerciseList = function(center){
	    	if(center.id < 0){
				$scope.showError=true;
				$scope.removeGraph();
				$interval.cancel(stop);
				stop = "";
				$scope.selectedFitnessCenterId = center.id;
	    		return false;	    		
	    	}
			if(stop){
				$interval.cancel(stop);
				stop = "";				
			}
			
			$scope.selectedFitnessCenterId = center.id;
			$scope.callSelectedExercisesRecords();
			tick = function () {
				if($scope.selectedFitnessCenterId !== -1){
					$scope.callSelectedExercisesRecords();
				}
			}
			stop =  $interval(tick, 10000);
		}
		$scope.$on('$destroy', function () { 
				$interval.cancel(stop); 
		});
		
		$scope.callSelectedExercisesRecords= function(){
	    	 AdminDataService.getCurrentExerciseList($scope.selectedFitnessCenterId)
	    	 .success(function (data) {
		    		 if(data.length > 0){
						 data = $scope.getLast4Records(data);						 
			    		 var graphData = DashBoardOperations.adminExercisesInProcess(data);
						 $scope.removeGraph();
						 $scope.generateGraph(graphData);
			    		 $scope.showError=false;
		    		 }else{
						 $scope.showError=true;
						 $scope.removeGraph();
					 }
		    	})
		    	.catch(function (res) {
		    		var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
		    		$scope.authFailureMessage = message;			
		    		$scope.authError = true;
		    	});
	    };
	    
		$scope.removeGraph = function(){
	    	_.each($scope.chartObject, function(chart, index){
				chart.destroy();
				$("#exerciseName"+index)[0].innerHTML = "";
			});
			$scope.chartObject=[];
	    }
		
		
		$scope.generateGraph = function(graphData){	
			for(var i=0; i< graphData.length; i++){
				var canvas = $("#canvas"+i).get(0);
				var ctx = canvas.getContext("2d");
				var charnum = "chart"+i;				
					charnum = new Chart(ctx).HorizontalBar(graphData[i], {
					responsive: true,
					barShowStroke: true
				});	
				$scope.chartObject.push(charnum)
				$("#exerciseName"+i)[0].innerHTML = "<b>"+graphData[i].ExerciseName +"</b>";
			}
		};
		
		
		
		
		$scope.getLast4Records = function(data){
			var latestData = []
			if(data.length>4){
				for(var i= 4; i >= 0; data.length--){
					latestData.push(data[i]);
				}
			}else{
				latestData = data;
			}
						
			for(var i = latestData.length - 1; i >= 0; i--){
				var record = latestData[i];
				for(var j = record.sets.length -1; j >= 0; j-- ){
					var sets  = record.sets[j];
					if(sets.reps.length < 1){
						record.sets.splice(j, 1);
					}					
				}
				if(record.sets.length < 1){
					latestData.splice(i, 1);
				}
			}		
			
			return latestData;
			
		};		
		    
	});
