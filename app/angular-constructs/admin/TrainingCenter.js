angular.module('TrainingCenterModule',[])
.controller('TrainingCenterController', function ($scope, $http, $state, AdminDataService, AUTH_MESSAGES, AUTH_EVENTS,  SessionService ) {
	$scope.authError = false;
	$scope.authSuccess=false; 
	$scope.TrainingCenterList=false;
	$scope.adminAuth = true;
	$scope.fitnessCompanyCnt = true;
	
	 $scope.resetMessage= function(){
	     	$scope.authError = false;
	 		$scope.authSuccess=false; 		
	     }
	
	
    $(".nav-tabs > li").removeClass("active");
    $("#trainingcenter").addClass("active");
    
    $scope.$on('$viewContentLoaded', function() {
		$scope.getAllFitnessCompanyList();
	});
    
  //get Fitness Center list
    $scope.getAllFitnessCompanyList = function(){
    	$scope.createFitnessCompany =  true;
    	$scope.allFitnessCompanyList = false;
    	$scope.resetMessage();
    	AdminDataService.getTrainingCenterList()
    	.success(function (data) {
    		$scope.TrainingCenterList = data;
    		console.log(data)
    	})
    	.catch(function (res) {
    		var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
    		$scope.authFailureMessage = message;			
    		$scope.authError = true;
    	});
    	$scope.adminTemplateUrl = "angular-constructs/admin/trainingCenter.html";
    	$scope.fitnessCompanyCnt = true;
    }
    
    $scope.loadFitnessCompanyForm = function(){
    	$scope.resetMessage();
    	$scope.createFitnessCompany =  false;
    	$scope.allFitnessCompanyList = true;
    	$scope.fitnessCompany="";
    	$scope.adminTemplateUrl = "angular-constructs/admin/createFitnessCompany.html";
    }
    
    $scope.CreateFitnessCompany = function(fitnessCompany){	
    	$scope.resetMessage();
    	AdminDataService.createFitnessCompany(fitnessCompany)
    	.success(function (data) {
    		$scope.authSuccess = true;
    		$scope.authError = false;
    		$scope.authSuccessMessage = data.name  +" "+ AUTH_EVENTS.createFitnessCompanySuccess;
    	})
    	.catch(function (res) {
    		var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
    		$scope.authFailureMessage = message;			
    		$scope.authError = true;
    		$scope.authSuccess = false;
    	}).finally(function () {
			$scope.fitnessCompany.name = "";
			$scope.fitnessCompany.description = "";
		}); 	
	}
	
    //Delete Fitness Company
    $scope.deleteFitnessCompany = function(fitnessCompany, index){
    	$scope.resetMessage();
    	AdminDataService.deleteFitnessCompany(fitnessCompany.id)
    	.success(function (data) {
    		$scope.authSuccess = true;
    		$scope.authError = false;
    		$scope.authSuccessMessage = fitnessCompany.name +" " + AUTH_EVENTS.deleteFitnessCompanySuccess;
    		$scope.TrainingCenterList.splice(index, 1);
    	})
    	.catch(function (res) {
    		var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
    		$scope.authFailureMessage = message;			
    		$scope.authError = true;
    		$scope.authSuccess = false;
    	});	
    }
    
    //load Fitness Company edit form
    $scope.loadFitnessCompanyEditForm = function(trainingCenter, index){    	
		$scope.editing =true; 
        $scope.editing = $scope.TrainingCenterList.indexOf(trainingCenter);
        $scope.newField = angular.copy(trainingCenter);
    }
    
    //update Fitness Company
    $scope.updateFitnessCompany = function(trainingCenter, index){
    	var fitnessComapnyDetails={
				  "name": trainingCenter.name,
				  "description": trainingCenter.description
		}	
    	AdminDataService.updateFitnessCompany(trainingCenter.id, fitnessComapnyDetails)
		.success(function (data) {				
			$scope.authError = false;
			$scope.authSuccess=true;
			$scope.authSuccessMessage = trainingCenter.name +" " + AUTH_EVENTS.updateFitnessCompanySuccess;				
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
			$scope.authSuccess=false; 
		});
    }
    
})
.controller('FitnessCenterController', function ($scope, $http, $state, AdminDataService, AUTH_MESSAGES, AUTH_EVENTS,  SessionService ) {
	$scope.authError = false;
	$scope.authSuccess=false; 
	$scope.fitnessCenterList=false;	
	$scope.adminAuth = true;
	$scope.fitnessCnt  = true;
	
	$scope.resetMessage= function(){
     	$scope.authError = false;
 		$scope.authSuccess=false; 		
     }
	
    $(".nav-tabs > li").removeClass("active");
    $("#fitnesscenter").addClass("active");
    
    $scope.$on('$viewContentLoaded', function() {
		$scope.getAllFitnessCenterList();
	});
    
	//get Fitness Center list    
    $scope.getAllFitnessCenterList = function(){
    	$scope.createFitnessCenter = true;
    	$scope.allFitnessCenterList = false;
    	AdminDataService.getFitnessCenterList()
    	.success(function (data) {
    		$scope.fitnessCenterList = data;
    		console.log(data)
    	})
    	.catch(function (res) {
    		var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
    		$scope.authFailureMessage = message;			
    		$scope.authError = true;
    	});
    	$scope.adminTemplateUrl = "angular-constructs/admin/fitnessCenter.html";
    }
	
    
    $scope.loadFitnessCenterForm = function(){
    	$scope.resetMessage();
    	$scope.createFitnessCenter =  false;
    	$scope.allFitnessCenterList = true;
    	$scope.fitnessCenter="";
    	AdminDataService.getTrainingCenterList()
    	.success(function (data) {
    		var TrainingCenterList = [];
    			TrainingCenterList.push({name:"--Select Fitness Comapny--", value :-1} );
    			_.each(data, function(item){        		
    				TrainingCenterList.push(item );
    			});  
    		$scope.TrainingCenterList = TrainingCenterList;
    		$scope.fitnessCompany = TrainingCenterList[0]; 
    	})
    	.catch(function (res) {
    		var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
    		$scope.authFailureMessage = message;			
    		$scope.authError = true;
    	});
    	
    	$scope.adminTemplateUrl = "angular-constructs/admin/createFitnessCenter.html";
    	
    }
    
	$scope.CreateFitnessCenter = function(fitnessCompany , fitnessCenter){
		if(fitnessCompany.value === -1){ 
			$scope.authFailureMessage = "Please select Fitness Center Company";			
    		$scope.authError = true;
			return false;
		}else{
			$scope.authFailureMessage = "";			
    		$scope.authError = false;
		}
	 $scope.$broadcast('runCustomValidations', {
            forms: ['FitnessCenterForm']
     });
	 
		 
		if(this.FitnessCenterForm.$valid) {			
			$scope.createFitnessCenter = false;
	    	$scope.allFitnessCenterList = true;
	    	$scope.resetMessage();
	    	AdminDataService.createFitnessCenter(fitnessCompany.id , fitnessCenter)
	    	.success(function (data) {   
	    		$scope.authSuccess = true;
	    		$scope.authError = false;
	    		$scope.authSuccessMessage = fitnessCenter.name +" " + AUTH_EVENTS.createFitnessCenterSuccess;
	    	})
	    	.catch(function (res) {
	    		var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
	    		$scope.authFailureMessage = message;			
	    		$scope.authError = true;
	    		$scope.authSuccess = false;
	    	}).finally(function () {
				$scope.fitnessCenter="";
			});    
		}
	}

    //Delete Fitness Center
    $scope.deleteFitnessCenter = function(fitnessCenter, index){
    	$scope.resetMessage();
    	AdminDataService.deleteFitnessCenter(fitnessCenter.id)
    	.success(function (data) {
    		$scope.authSuccess = true;
    		$scope.authError = false;
    		$scope.authSuccessMessage = fitnessCenter.name +" " + AUTH_EVENTS.deleteFitnessCenterSuccess;
    		$scope.fitnessCenterList.splice(index, 1);
    	})
    	.catch(function (res) {
    		var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
    		$scope.authFailureMessage = message;			
    		$scope.authError = true;
    		$scope.authSuccess = false;
    	}); 	
    }
    
	$scope.loadFitnessCenterEditForm = function(FitnessCenter, index){
		$scope.editing =true; 
        $scope.editing = $scope.fitnessCenterList.indexOf(FitnessCenter);
        $scope.newField = angular.copy(FitnessCenter);
	}
	
    //update Fitness Company
    $scope.updateFitnessCenter = function(fitnessCenter, index){
    	var fitnessCenterDetails={
				  "name": fitnessCenter.name,
				  "description": fitnessCenter.description,
				  "phoneNumber" : fitnessCenter.phoneNumber,
				  "address" : fitnessCenter.address
		}	
    	AdminDataService.updateFitnessCenter(fitnessCenter.id, fitnessCenterDetails)
		.success(function (data) {				
			$scope.authError = false;
			$scope.authSuccess=true;
			$scope.authSuccessMessage = fitnessCenter.name +" " + AUTH_EVENTS.updateFitnessCenterSuccess;				
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
			$scope.authSuccess=false; 
		});
    }
	
});	