'use strict';

var angular = angular;
var module = angular.module('Authentication', ['directives.customvalidation.customValidationTypes']);

module.controller('RegistrationController', function ($scope, $rootScope, $state, AUTH_EVENTS, AuthService, URLS) {
	$scope.credentials = {
			firstName 		: '',
			lastName 		: '',
			nickname		: '',
			email			: '',
			password		: '',
			confirmpassword	: '',
			gender			: '',
			age				: '',
			gymtimings		: '',
			mailingAddress	: '',
			phonenumber		: ''		
	};
	
		
	$scope.usernameMap = function($event){				
		$scope.credentials.nickname =  $event.target.value.split("@")[0];
	};
	
	$scope.registrationError = false;
	$scope.registrationSuccess = false;
	$scope.register = function (credentials) {
		$scope.authFailureMessage = "";
		$scope.authSuccessMessage = "";
		$scope.registrationError = false;
		$scope.registrationSuccess = false;
		
			
		$scope.$broadcast('runCustomValidations', {
            forms: ['registerForm']
        });
		
		if($scope.registerForm.$valid) {
			
			credentials.nickname = credentials.nickname.toLowerCase().replace(/\s+/g,'');
			credentials.email = credentials.email.toLowerCase().replace(/\s+/g,'');
			AuthService.register(credentials)
			.then(function (user) {
				$rootScope.registrationSuccess = true;	
				$state.go('login');			
				$scope.registrationError = false;
				//$scope.CallMailService(credentials.nickname, credentials.email,credentials.password);				
			})
			.catch(function (res) {
				$scope.authFailureMessage = res.data.error.message;
				$scope.registrationError = true;
				$rootScope.registrationSuccess = false;	
			})
			.finally(function () {
				$scope.credentials.password = "";
				$scope.credentials.confirmpassword = "";
			});
		}
	};
	
	$scope.CallMailService = function(nickname, userEmail, password){	
		var methodName = "registriaonSucess.html";
			mailService.RegistrationSucessMailService(URLS.EXTERNAL_SITE_URL+URLS.MAIL_REGISTRATION_ACTION_NAME, nickname, userEmail, password);
	}
});

module.controller('LoginController', function ($scope, $rootScope, $state, AUTH_EVENTS, USER_ROLES, AuthService, $timeout, facebook, SessionService, AdminDataService) {
	 	
	$scope.credentials = {
		email: "",
		password: ""
	};
	
	$scope.loginError = false;	
	$scope.loginSuccess=false;
	$scope.authSuccessMessage = "";
	
	if($rootScope.registrationSuccess){
		$scope.authSuccessMessage = AUTH_EVENTS.registraionSuccess;
		$scope.loginSuccess = true;		
		$rootScope.registrationSuccess= false;
	}
	
	$scope.$on('$viewContentLoaded', function(event) {
	      $timeout(function() {	    	
	    		 $("#email")[0].value ="";	    	 
	    		 $("#password")[0].value="";	    	  
	      },100);
	    });
	
	$scope.login = function (credentials) {
		
		$scope.authFailureMessage = "";
		$scope.authSuccessMessage = "";		
		$scope.loginError = false;	
		$scope.loginSuccess=false;
				
		$scope.$broadcast('runCustomValidations', {
            forms: ['loginForm']
        });
		if($scope.loginForm.$valid) {
			credentials.email = credentials.email.toLowerCase().replace(/\s+/g,'');
			$scope.loginError = false
			$scope.callLoginService(credentials);
		}
	};
	
	$scope.callLoginService =  function(credentials){
		AuthService.login(credentials)
		.then(function (data) {				
			$scope.loginError = false;							
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);	
			$rootScope.loggedIn = true;
			$scope.getUserPrivileges(data.user);
			
		})					
		.catch(function (res) {
			$scope.authFailureMessage = AUTH_EVENTS.loginFailed;
			$scope.loginError = true;				
		})
		.then(function () {
			$scope.credentials.password = "";
			$scope.credentials.nickname = "";
		});
	}
	
		$scope.getUserPrivileges = function(user){
			AdminDataService.getUserPrivileges(user.id)
			.success(function (data) {			
				//$scope.fitnesCompanyAdmin = (data.fitnessCompaniesAdministrated.length > 0) ? true : false;
				//$scope.fitnesCenterAdmin = (data.fitnessCentersAdministrated.length > 0) ? true : false;
				//$scope.admin = (data.roles.length > 0) ? true : false;		
				
				if(data.roles.length > 0){					
					user.userRoles = USER_ROLES.admin;
					$scope.setCurrentUser(user);
					$state.go("admin");
				}else{
					user.userRoles = USER_ROLES.guest;
					$scope.setCurrentUser(user);
					$state.go("workout-statistics");
				}
			})
			.catch(function (res) {
				var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
				$scope.authFailureMessage = message;			
				$scope.authError = true;
			});
		}
	
	
			$scope.getPublicProfile = function(){
		    	facebook.getUser().then(function(r){
		    		var response = r.user;
		    		console.log(r.user);
		    		var userDetails = {
		       				firstName 		: response.first_name,
		       				lastName 		: response.last_name,
		       				nickname		: response.name.toLowerCase().replace(/\s+/g,''),
		       				email			: response.email.toLowerCase().replace(/\s+/g,''),
		       				password		: response.first_name+"@1234",
		       				gender			: response.gender,
		       				age				: (response.age_range) ? response.age_range : 21,
		       				gymtimings		: '',
		       				mailingAddress	: '',
		       				phonenumber		: ''    
		       		};
		        	   
		            // $scope.ValidateUserRegistration(userDetails);
		             console.log(userDetails)
		    	});
		    }
		    $scope.img = "";
		    
		    $scope.getProfilePicture = function(){
		    	facebook.getUserPicture("me",{width:300, height:300}).then(function(r){
		    		$scope.img = r.picture.url;
		    	});
		    }
        
   
	
         $scope.ValidateUserRegistration = function(userProfile){
        	 
        	 $scope.facebookUserProfileRegistration(userProfile);
        	 
        	 /*AuthService.emailValidate(userDetails.email)
        	 .then(function (data) {				
				if(data){
					$scope.setCurrentUser(data.user);	
					SessionService.create(user);
					$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);	
					$rootScope.loggedIn = true;
					$state.go("workout-statistics");					
				}else{
					$scope.facebookUserProfileRegistration(userProfile);
				}
			})					
			.catch(function (res) {
				$scope.authFailureMessage = AUTH_EVENTS.loginFailed;
				$scope.loginError = true;				
			});*/
         }
         
         $scope.facebookUserProfileRegistration = function(userProfile){        	       	        	         	 			
 			AuthService.register(userProfile)
 			.then(function (user) {
 				var credentials={
 						nickname : userProfile.nickname,
 						password : userProfile.password
 				} 				
 				$scope.callLoginService(credentials);
 			})
 			.catch(function (res) {
 				$scope.authFailureMessage = res.data.error.message;
 				$scope.registrationError = true;
 			});
 			
         };
	
});

module.controller('ForgotPasswordController', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
	$scope.credentials = {
		email: ''		
	};
	$scope.authError = false;	
	$scope.authSuccess=false;

	$scope.fotgotpassword = function (credentials) {
		$scope.authFailureMessage = "";
		
		$scope.$broadcast('runCustomValidations', {
            forms: ['loginForm']
        });
		if($scope.loginForm.$valid) {			
		AuthService.resetpassword(credentials)
			.then(function (user) {
				$scope.authSuccess = true;
				$scope.authError = false;
				$scope.authSuccessMessage = AUTH_EVENTS.resetpasswordSuccess;	
			})
			.catch(function (res) {
				$scope.authSuccess = false;
				$scope.authError = true;
				$scope.authFailureMessage = AUTH_EVENTS.resetpasswordError;
			})
			.then(function () {
				$scope.credentials.email = "";
			});
		}
	};
});


module.controller('LogoutController', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {

	$scope.authError = false;	
	$scope.authSuccess=false;
	
	$scope.logout = function () {
		$scope.logoutStatus = "Logging out...";
		AuthService.logout()
			.then(function () {
				$scope.authError = false;
				$scope.authSuccess=true;
				$scope.logoutStatus = "You have been logged out. Goodbye!";
			})
			.catch(function () {
				$scope.authError = true;
				$scope.authSuccess=false;
				$scope.logoutStatus = "There was some kind of error logging you out! You may still be logged in...";
			})
			.finally(function () {
				$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
				$scope.setCurrentUser(null);
				$rootScope.loggedIn = false;
			});
	};
	$scope.logout();
});

module.factory('AuthService', function ($http, SessionService, AUTH_MESSAGES, URLS) {
	var authService = {};
	//user Registration Service
	authService.register = function (credentials) {
		//Real login
		return $http
			.post((URLS.SITE_URL + URLS.REGISTER), credentials, {
				cache: false,
				withCredentials: true,
			})
			.then(function (res) {
				if (res.data.error) {
					var message = AUTH_MESSAGES[res.data.error.message] || res.data.error.message;
					throw Error(message);
				} else {
					console.log("Login attempt: ");
					console.dir(res.data);					
					return res.data;
				}
			});
	};
	
	//user login Service
	authService.login = function (credentials) {
		//Real login
		return $http
			.post((URLS.SITE_URL + URLS.LOGIN), credentials, {
				cache: false,
				withCredentials: true,
			})
			.then(function (res) {
				if (res.data.error) {
					var message = AUTH_MESSAGES[res.data.error] || res.data.error;
					throw Error(message);
				} else {
					console.log("Login attempt: ");
					console.dir(res.data);
					SessionService.create(res.data);
					return res.data;
				}
			});
	};
	
	
	//user email validation Service
	authService.emailValidate = function (email) {
		
		return true;
		
		/*return $http
			.post((URLS.SITE_URL + URLS.LOGIN), credentials, {
				cache: false,
				withCredentials: true,
			})
			.then(function (res) {
				if (res.data.error) {
					var message = AUTH_MESSAGES[res.data.error] || res.data.error;
					throw Error(message);
				} else {
					console.log("Login attempt: ");
					console.dir(res.data);
					SessionService.create(res.data);
					return res.data;
				}
			});*/
	};
	
	
	//user logout Service
	authService.logout = function () {
		
		return $http({
			 	url: URLS.SITE_URL + URLS.LOGOUT,
	            method: "POST",	           
	            headers: {'Authorization': SessionService.getID()}
			})	
			.success(function () {
				SessionService.destroy();
			}).error(function (res) {
				console.log(res)
			});
		
	};
	
	// get user details
	authService.getUserDetails = function() {
		return $http
			.get((URLS.SITE_URL + URLS.GET_USER_INFO + SessionService.getUserID()), {
				cache: false,
				withCredentials: true,
				headers: {'Authorization': SessionService.getID()}
			}).then(function (res) {
				if (res.data.error) {
					var message = AUTH_MESSAGES[res.data.error] || res.data.error;
					throw Error(message);
				} else {							
					return res.data;
				}
			});
	};
	
	//update user details
	authService.updateUserDetails = function(userDetails) {
		return $http
			.put((URLS.SITE_URL + URLS.UPDATE_USER_DETAILS + SessionService.getUserID()), userDetails, {
				cache: false,
				withCredentials: true,
				headers: {'Authorization': SessionService.getID()}
			}).then(function (res) {
				if (res.data.error) {
					var message = AUTH_MESSAGES[res.data.error] || res.data.error;
					throw Error(message);
				} else {							
					return res.data;
				}
			});
	};

	// password resest service
	authService.resetpassword = function (credentials) {
		//Real login
		return $http
			.post((URLS.SITE_URL + URLS.RESET_PASSWORD), credentials, {
				cache: false,
				withCredentials: true,
				headers: {'Authorization': SessionService.getID()}
			})
			.then(function (res) {
				if (res.data.error) {
					var message = AUTH_MESSAGES[res.data.error] || res.data.error;
					throw Error(message);
				} else {									
					return res;
				}
			});
	};
	
	// password resest service
	authService.changepassword = function (credentials) {
		//Real login
		return $http
			.put((URLS.SITE_URL + URLS.UPDATE_PASSWORD +  SessionService.getUserID()), credentials, {
				cache: false,
				withCredentials: true,
				headers: {'Authorization': SessionService.getID()}
			})
			.then(function (res) {
				if (res.data.error) {
					var message = AUTH_MESSAGES[res.data.error] || res.data.error;
					throw Error(message);
				} else {
					console.log("Login attempt: ");
					console.dir(res.data);					
					return res.data;
				}
			});
	};
	

	authService.isAuthenticated = function () {
		return !!Session.userId;
	};

	authService.isAuthorized = function (authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		return (authService.isAuthenticated() &&
		authorizedRoles.indexOf(Session.userRole) !== -1);
	};

	//Get Following Friend List
	authService.getFollowingFriendList = function () {
		var idRegex = new RegExp("\\[USERID\\]", "ig");		
		var url = (URLS.SITE_URL + URLS.FOLLOWING_LIST)
		.replace(idRegex, encodeURIComponent(SessionService.getUserID()));		
		
		return $http
			.get(url, {
				cache: false,
				withCredentials: true,
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {			
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});	
	};
	
	// Search By email 
	authService.searchByEmail = function (email) {
		var idRegex = new RegExp("\\[USER_EMAIL\\]", "ig");
		var url = (URLS.SITE_URL + URLS.SEARCH_BY_EMAIL)
		.replace(idRegex, encodeURIComponent(email));
		
		return $http
		.get((url), {
			cache: false,
			withCredentials: true,
			headers: {'Authorization': SessionService.getID()}
		}).success(function (data) {			
			return data;
		})		
		.error(function (res) {			
			var message = AUTH_MESSAGES[res.error.message] || res.error.message;
			return message;
		});			
	};
	
	// Search By email 
	authService.searchByName = function (name) {
		var idRegex = new RegExp("\\[USER_NAME\\]", "ig");
		var url = (URLS.SITE_URL + URLS.SEARCH_BY_NAME)
		.replace(idRegex, encodeURIComponent(name));
		
		return $http
			.get((url), {
				cache: false,
				withCredentials: true,
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {			
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});	
	};
	
	//Send request to friend
	authService.sendRequestToFriend = function (id) {
		var idRegex = new RegExp("\\[USERID\\]", "ig");
		var fkRegex = new RegExp("\\[FRIEND_ID\\]", "ig");
		var url = (URLS.SITE_URL + URLS.SEND_REQUEST_TO_FRIEND)
		.replace(idRegex, encodeURIComponent(SessionService.getUserID()))
		.replace(fkRegex, encodeURIComponent(id));
		
		return $http
			.post((url), '',{
				cache: false,
				withCredentials: true,
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {			
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});	
	};
	
	authService.incomingFriendRequest = function () {
		var idRegex = new RegExp("\\[USERID\\]", "ig");		
		var url = (URLS.SITE_URL + URLS.INCOMING_FRIEND_REQUEST)
		.replace(idRegex, encodeURIComponent(SessionService.getUserID()));		
		
		return $http
			.get(url, {
				cache: false,
				withCredentials: true,
				params: {'filter':{'include':['originUser'],'where': {'status':'STATUS_PENDING'}}},
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {			
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});	
	};
	
	authService.getRequestedFriendDetails = function(id){
		var idRegex = new RegExp("\\[FRIEND_ID\\]", "ig");		
		var url = (URLS.SITE_URL + URLS.GET_USER_DETAILS)
			.replace(idRegex, encodeURIComponent(id));		
		
		return $http
			.get(url, {
				cache: false,
				withCredentials: true,
				headers: {'Authorization': SessionService.getID()}
			}).then(function (res) {
				if (res.data.error) {
					var message = AUTH_MESSAGES[res.data.error] || res.data.error;
					throw Error(message);
				} else {							
					return res.data;
				}
			});
	}
	
	authService.approveFriendRequest = function(id){
		var idRegex = new RegExp("\\[REQUEST_ID\\]", "ig");		
		var url = (URLS.SITE_URL + URLS.CONFIRM_REQUEST)
			.replace(idRegex, encodeURIComponent(id));		
		
		return $http
			.post(url,'', {
				cache: false,
				withCredentials: true,
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {			
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});	
	}
	
	authService.rejectFriendRequest = function(id){
		var idRegex = new RegExp("\\[REQUEST_ID\\]", "ig");		
		var url = (URLS.SITE_URL + URLS.REJECT_REQUEST)
			.replace(idRegex, encodeURIComponent(id));	
		
		return $http
			.post(url,'', {
				cache: false,
				withCredentials: true,
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {			
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});	
	}
	
	//Send request to friend
	authService.removeFriend = function (id) {
		var idRegex = new RegExp("\\[USERID\\]", "ig");
		var fkRegex = new RegExp("\\[FRIEND_ID\\]", "ig");
		var url = (URLS.SITE_URL + URLS.REMOVE_FRIEND)
		.replace(idRegex, encodeURIComponent(SessionService.getUserID()))
		.replace(fkRegex, encodeURIComponent(id));
		
		return $http
			.put((url), '',{
				cache: false,
				withCredentials: true,
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {			
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});	
	};
	
	
	return authService;
});

module.factory('SessionService', function () {

	var sessionService = {};

	sessionService.create = function (data) {		
			this.id = data.id;
			this.userID = data.userId;
			this.nickname = data.user.nickname;
			this.userEmail = data.user.email;		
	};

	sessionService.destroy = function () {
		this.id = null;
		this.userID = null;
		this.nickname = null;
		this.userEmail = null;
	};

	sessionService.getID = function () {
		return this.id;
	};
	
	sessionService.getUserID = function () {
		return this.userID;
	};

	sessionService.getUsername = function () {
		return this.nickname;
	}

	sessionService.getUserEmail = function () {
		return this.userEmail;
	};
	
	

	sessionService.isAuthorized = function () {
		return ((!!this.userID));
	};

	return sessionService;
})
