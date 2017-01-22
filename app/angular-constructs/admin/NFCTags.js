angular.module('NFCTagModule',[])
.controller('NFCController', function ($scope, $http, $state, AdminDataService, AUTH_MESSAGES, AUTH_EVENTS,  SessionService, URLS ) {
	
	$scope.authError = false;
	$scope.authSuccess=false; 
	$scope.editMode=false;		
	$scope.newField = {};
    $scope.editing = false;
	$scope.AdminNFCTemplateUrl="";
	$scope.users=0;
	$scope.NFCuserList=[];
	$scope.showFilter = false;
	$scope.adminAuth = true;
	$scope.usernfc=true;
	$scope.showGraph=false;
	$scope.userPrivileges={};
	
	$(".nav-tabs > li").removeClass("active");
	$("#nfcTag").addClass("active");
	
	var selectedModule =  $state.current.data.selectedModule;
	
	$scope.$on('$viewContentLoaded', function() {
		if(selectedModule === "USERS"){
			$(".userclass > .btn").removeClass("active disabled");
			$("#nfcbtn").addClass("active disabled");	
			$scope.getAllUsersNFCTags();			
		}else if(selectedModule === "UserModification"){
			$(".userclass > .btn").removeClass("active disabled");
			$("#modificationbtn").addClass("active disabled");
			$scope.UserModification();			
		}else if(selectedModule === "Userprivileges"){
			$(".userclass > .btn").removeClass("active disabled");
			$("#privilegesbtn").addClass("active disabled");
			$scope.loadUserPrivilegesForm();
		}
	});
	
			  
	$scope.getAllUsersNFCTags =  function(){		
		 $scope.resetMessage();
		AdminDataService.getAllUsersList()
		.success(function (data) {				
			$scope.getNFCTags(data);
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
		});	
		$scope.nfctag= false;
		$scope.usermodification= true;
		$scope.userprivileges= true;
		$scope.adminTemplateUrl = "angular-constructs/admin/usersNFC.html";	
	}
	
	//Get all NFC Tags
	$scope.getNFCTags = function(userList){
		AdminDataService.getAllNFCTags()
		.success(function (data) {
			$scope.NFCuserList = $scope.mapAllUsers(data,userList);	
			$scope.showFilter = true;
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
		});
	}
		
	//Map user id with NFC id
	$scope.mapAllUsers = function(nfcData, users){								
		_.each(nfcData, function(nfcUser){
			_.each(users, function(user){					
				if(user.id === nfcUser.smartWeightsUserId){
					user.uid  = nfcUser.uid;
					user.nfcID  = nfcUser.id;						
				}					
			})        			
    	});  
		return users;
	}
	
	//Enable to row edit
	$scope.editNFC = function(user,index){			
		if(user.uid){
			$("#create_"+index)[0].style.display="none";
		}else{
			$("#save_"+index)[0].style.display="none";
		}
		$scope.editing =true; 
        $scope.editing = $scope.NFCuserList.indexOf(user);
        $scope.newField = angular.copy(user);
	}
	
	//cancel row editing
    $scope.cancelEdit = function() {
        if ($scope.editing !== false) {	  
        	$scope.NFCuserList[$scope.editing] = $scope.newField;
            $scope.editing = false;
        }       
    };
	
	
	//Create NFC tag
	$scope.createNFC = function(user){
		$scope.newField = angular.copy(user);
		$scope.editing= $scope.NFCuserList.indexOf(user);
		
		var userDetails={
				  "uid": user.uid,
				  "id": user.uid,
				  "name": user.nickname
		}
		AdminDataService.CreateNFCTags(userDetails)
		.success(function (data) {				
			$scope.authError = false;
			$scope.authSuccess=true;
			$scope.authSuccessMessage = user.nickname +" " + AUTH_EVENTS.NFCTagCreateSuccessfully;
			$scope.newField.nfcID = data.id;
			$scope.mapNFCTagToUser(data.id , user);
			$scope.CallMailService(user, data.uid, true );
					
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
			$scope.authSuccess=false; 
		});
	}
	
	//map NFC Tag to selected User
	$scope.mapNFCTagToUser = function(id, user){				
		AdminDataService.mapSelectedNFCTAgToUser(id, user)
		.success(function (data) {				
			$scope.authError = false;
			$scope.authSuccess=true;
			$scope.authSuccessMessage = user.nickname +" " + AUTH_EVENTS.NFCTagCreateSuccessfully;	
			$scope.NFCuserList[$scope.editing] = $scope.newField;				
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
			$scope.authSuccess=false; 
		});
	}
	
	//Update NFCTag
	$scope.updateNFC = function(user){
		$scope.newField = angular.copy(user);
		$scope.editing= $scope.NFCuserList.indexOf(user);
		var userDetails={
				  "uid": user.uid,
				  "name": user.nickname
		}			
		AdminDataService.updateSelectedNFCTAg(user.nfcID, userDetails)
		.success(function (data) {				
			$scope.authError = false;
			$scope.authSuccess=true;
			$scope.NFCuserList[$scope.editing] = $scope.newField;
			$scope.authSuccessMessage = user.nickname +" " + AUTH_EVENTS.NFCTagUpdatedSuccessfully;		
			$scope.CallMailService(user, data.uid, false );
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
			$scope.authSuccess=false; 
		});		
	}
	
	//Delete NFCTag
	$scope.deleteNFC = function(user){	
		$scope.newField = angular.copy(user);
		$scope.editing= $scope.NFCuserList.indexOf(user);
		AdminDataService.deleteNFCTag(user.nfcID)
		.success(function (data) {				
			$scope.authError = false;
			$scope.authSuccess=true;
			$scope.authSuccessMessage = user.nickname +" " + AUTH_EVENTS.NFCTagDeleteSuccessfully;
			$scope.newField.uid  = "";
			$scope.newField.nfcID  = "";	
			$scope.NFCuserList[$scope.editing] = $scope.newField;
			$scope.editing =false;
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
			$scope.authSuccess=false; 
			$scope.editing= false;
			$scope.newField= {}
		});			
	}
	
	$scope.CallMailService = function(user, nfcTag, status){
			mailService.NFCTagCreationMailService(URLS.EXTERNAL_SITE_URL+ URLS.MAIL_NFC_TAG_ACTION_NAME, user.email, user.nickname, nfcTag, status);
	}
	
	// User modification
	$scope.UserModification = function(){		
		//$scope.$parent.moduleTitle = "User Modification";
		 $scope.resetMessage();
		$scope.nfctag= true;
		$scope.usermodification= false;
		$scope.userprivileges= true;
		AdminDataService.getAllUsersList()
		.success(function (data) {
			$scope.userList =  data;			
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
		});
		
		$scope.adminTemplateUrl = "angular-constructs/admin/usersModification.html";	
	}
	
	
	//Delete user
	$scope.deleteUser = function(user, index){	
		if(user.id === SessionService.getUserID()){
			$scope.authError = true;
			$scope.authFailureMessage = user.nickname +" " + AUTH_EVENTS.SameUserDeleteMessage;	
			return false
		}
		AdminDataService.deleteUser(user.id)
		.success(function (data) {				
			$scope.authError = false;
			$scope.authSuccess=true;
			$scope.authSuccessMessage = user.nickname +" " + AUTH_EVENTS.UserDeleteSuccessfully;				
			$scope.userList.splice(index, 1);
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
			$scope.authSuccess=false; 
			$scope.newField= {}
		});			
	}
	
	 $scope.resetMessage= function(){
     	$scope.authError = false;
 		$scope.authSuccess=false; 		
     }
	
	$scope.loadUserPrivilegesForm = function(){
		$scope.resetMessage();
		//$scope.$parent.moduleTitle = "Edit User Privileges";
		$scope.nfctag= true;
		$scope.usermodification= true;
		$scope.userprivileges= false;
		$scope.SelectedUserName = "";
		$scope.userPrivileges="";
		$scope.TrainingCenterList=[];
		$scope.fitnessCenterList=[];
		
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
		
		$scope.adminTemplateUrl = "angular-constructs/admin/editUserPrivileges.html";			
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
		if(user.value === -1){
			$scope.SelectedUserName = "";
			$scope.showGraph=false;
			return false;
		}			
		$scope.userPrivileges = "";
		$scope.userRoles={};
		$scope.fitnesCompany={};
		$scope.fitnesCenter= {};
		$scope.fitnesCompanyAdmin="";
		$scope.fitnesCenterAdmin= "";
		$scope.admin ="";
		$scope.TrainingCompanyMessage=[];
		$scope.FitnessCenterMessage = [];
		$scope.TrainingCompanyMessage="";
		$scope.FitnessCenterMessage=""
		
		AdminDataService.getUserPrivileges(user.value)
		.success(function (data) {
			//Fitness Company 
			if(data.fitnessCompaniesAdministrated.length > 0){
				$scope.fitnesCompanyAdmin= true;
				data.fitnessCompaniesAdministrated = $scope.createCheckedValue(data.fitnessCompaniesAdministrated)
			}else{
				$scope.fitnesCompanyAdmin = false;
			}
			
			//Fitness Cetner
			if(data.fitnessCentersAdministrated.length > 0){
				$scope.fitnesCenterAdmin= true;
				data.fitnessCentersAdministrated = $scope.createCheckedValue(data.fitnessCentersAdministrated)
			}else{
				$scope.fitnesCenterAdmin = false;
			}
			
			//admin role
			if(data.roles.length > 0){
				$scope.admin= true;
				var admin = {
						name: data.roles[0],
						checked : true
				}
				data.roles=[];
				data.roles.push(admin);
			}else{
				$scope.admin = false;
			}
			
			$scope.userPrivileges = data;
			
			$scope.getAllTrainingCenterList(data.fitnessCompaniesAdministrated);	
			$scope.getAllFitnessCenterList(data.fitnessCentersAdministrated);
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
		});
		
		$scope.SelectedUserName = user.nickname;
		$scope.showUser=true;		
	}
	
	
	
	//get all Fitness Company List
	$scope.getAllTrainingCenterList = function(mappedFitnessCompaniesList){
		var mappedFitnessCompaniesList = mappedFitnessCompaniesList;
		AdminDataService.getTrainingCenterList()
    	.success(function (data) {
    		data = $scope.removeDuplicateObject(mappedFitnessCompaniesList, data);    		
    		if(data.length > 0){    		
				$scope.TrainingCenterList = data;
    		}else{
    			$scope.TrainingCompanyMessage = "All Traning Compaines are mapped to selected user "
    		}
    	})
    	.catch(function (res) {
    		var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
    		$scope.authFailureMessage = message;			
    		$scope.authError = true;
    	});
	}
	
	//remove duplicate objects
	$scope.removeDuplicateObject= function(preSelected, newObjects){
		if(!preSelected && !preSelected.length) return false;
		
		for(var i=0; i<preSelected.length; i++ ){
			for(var j=0; j<newObjects.length ; j++ ){
				if(preSelected[i].id === newObjects[j].id){
					newObjects.splice(j, 1);
				} 
			}
		}
		
		return $scope.createCheckedValue(newObjects);		
			
	}
	
	
	$scope.createCheckedValue = function(accessObjects){
		_.each(accessObjects, function(admObject){
			admObject.checked= true;	
		});
		
		return accessObjects;	
	}
	
	// updted fitness company privileges to user
	$scope.updateFitnessCompanyPrivilegesToUser =  function(fitnessCompany, user){		
		AdminDataService.assignSelectedCompanyToUser(fitnessCompany.id , user.value)
		.success(function (data) {				
			$scope.authError = false;
			$scope.authSuccess=true;
			$scope.authSuccessMessage = fitnessCompany.name +" mapped to " + user.name;
			fitnessCompany.checked= true;
			$scope.userPrivileges.fitnessCompaniesAdministrated.push(fitnessCompany);
			$scope.fitnesCompanyAdmin=true;
			$scope.TrainingCenterList = _.without($scope.TrainingCenterList, _.findWhere($scope.TrainingCenterList, {id: fitnessCompany.id}));
			if($scope.TrainingCenterList.length === 0){
				$scope.TrainingCompanyMessage = "All Fitness Center are mapped to selected user ";
			} 
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
			$scope.authSuccess=false; 
		});		
	}
	
	//remove fitness company privileges to user
	$scope.removeFitnessCompanyPrivilegesToUser =  function(fitnessCompany, user, index){		
		AdminDataService.removeSelectedCompanyToUser(fitnessCompany.id , user.value)
		.success(function (data) {				
			$scope.authError = false;
			$scope.authSuccess=true;
			$scope.authSuccessMessage = fitnessCompany.name +" privileges removed  to " + user.name;
			
			$scope.userPrivileges.fitnessCompaniesAdministrated.splice(index, 1);			
			$scope.fitnesCompanyAdmin = ($scope.userPrivileges.fitnessCompaniesAdministrated.length > 0) ? true : false;
			
			fitnessCompany.checked= true;
			$scope.TrainingCenterList.push(fitnessCompany );
    		$scope.TrainingCompanyMessage=false;
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
			$scope.authSuccess=false; 
		});		
	}
	
	//get All Fitness Center list
	$scope.getAllFitnessCenterList = function(mappedFitnessCenterList){
		var mappedFitnessCenterList = mappedFitnessCenterList;
		AdminDataService.getFitnessCenterList()
    	.success(function (data) {
    		data = $scope.removeDuplicateObject(mappedFitnessCenterList, data);
    		if(data.length > 0){    		
    			$scope.fitnessCenterList = data;
    		}else{
    			$scope.FitnessCenterMessage = "All Fitness Center are mapped to selected user "
    		}
    		
    	})
    	.catch(function (res) {
    		var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
    		$scope.authFailureMessage = message;			
    		$scope.authError = true;
    	});
	}
	
	//updated fitness center privileges to user
	$scope.updateFitnessCenterPrivilegesToUser = function(fitnessCenter, user){
		AdminDataService.assignSelectedFitnessCenterToUser(fitnessCenter.id , user.value)
		.success(function (data) {				
			$scope.authError = false;
			$scope.authSuccess=true;			
			$scope.authSuccessMessage = fitnessCenter.name +" mapped to " + user.name;
			fitnessCenter.checked= true;
			$scope.userPrivileges.fitnessCentersAdministrated.push(fitnessCenter);
			$scope.fitnesCenterAdmin=true;
			$scope.fitnessCenterList = _.without($scope.fitnessCenterList, _.findWhere($scope.fitnessCenterList, {id: fitnessCenter.id}));
			if($scope.fitnessCenterList.length === 0){
				$scope.FitnessCenterMessage = "All Fitness Center are mapped to selected user ";
			} 
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
			$scope.authSuccess=false; 
		});	
	}
	
	// remove fitness center privileges to user
	$scope.removeFitnessCenterPrivilegesToUser =  function(fitnessCenter, user, index){		
		AdminDataService.removeSelectedFitnessCenterToUser(fitnessCenter.id , user.value)
		.success(function (data) {				
			$scope.authError = false;
			$scope.authSuccess=true;
			$scope.authSuccessMessage = fitnessCenter.name +"  privileges removed  to " + user.name;
			$scope.userPrivileges.fitnessCentersAdministrated.splice(index, 1);
			$scope.fitnesCenterAdmin = ($scope.userPrivileges.fitnessCentersAdministrated.length > 0) ? true : false;
			fitnessCenter.checked= true;
			$scope.fitnessCenterList.push(fitnessCenter );
    		$scope.FitnessCenterMessage = false;
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
			$scope.authSuccess=false; 
		});		
	}
	
	$scope.assignAdminPrivileges = function(user){		
		AdminDataService.assignAdminPrivilegesToUser(user.value)
		.success(function (data) {				
			$scope.authError = false;
			$scope.authSuccess=true;
			$scope.authSuccessMessage = "Admin Privileges are assign to " + user.name;
			var admin = {
					name: "admin",
					checked : true
			}
			$scope.userPrivileges.roles=[];
			$scope.userPrivileges.roles.push(admin);			
			$scope.admin = true;
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
			$scope.authSuccess=false; 
		});		
	};
	
	$scope.removeAdminPrivileges = function(roles, user, index){
		if(user.value === SessionService.getUserID()){
			roles.checked = true;
			return false;
		}
		AdminDataService.removeAdminPrivilegesToUser(user.value)
		.success(function (data) {				
			$scope.authError = false;
			$scope.authSuccess=true;
			$scope.authSuccessMessage = "Admin Privileges are removed from " + user.name;
			$scope.userPrivileges.roles.splice(index, 1);
			$scope.admin = false;
			
		})
		.catch(function (res) {
			var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
			$scope.authFailureMessage = message;			
			$scope.authError = true;
			$scope.authSuccess=false; 
		});		
	};	
	
	
});