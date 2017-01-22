angular.module('Account', ['Authentication'])
	.controller('AccountController', function ($scope, $http, SessionService ,AUTH_EVENTS, AuthService) {
		$scope.authError = false;	
		$scope.authSuccess=false;
		 $(".nav-tabs > li").removeClass("active");
	     $("#profileTab").addClass("active");
		 
		AuthService.getUserDetails()		
			.then(function (user) {				
				$scope.userDetails = user;				
			});
		
		$scope.usernameMap = function($event){				
			$scope.credentials.nickname =  $event.target.value
		};
		$scope.accountTemplateUrl = "angular-constructs/account/Profile.html";	
		
		
		$scope.updateUserDetails = function (userDetails) {		
			$scope.authFailureMessage = "";
			$scope.authSuccessMessage = "";
			
			$scope.$broadcast('runCustomValidations', {
	            forms: ['profileForm']
	        });
			if(this.profileForm.$valid) {
				userDetails.id = SessionService.getUserID();
				userDetails.nickname = userDetails.nickname.toLowerCase().replace(/\s+/g,'');
				userDetails.email = userDetails.email.toLowerCase().replace(/\s+/g,'');
			AuthService.updateUserDetails(userDetails)
			.then(function (user) {
				console.log("credentials==" +user)	
				$scope.authSuccess=true;
				$scope.authError = false;
				$scope.authSuccessMessage = AUTH_EVENTS.userUpdateSuccess;
			})
			.catch(function (res) {
				$scope.authSuccess=false;
				$scope.authError = true;
				$scope.authFailureMessage = AUTH_EVENTS.userUpdateFailed;
				
			});
			}
		};
	}).controller('Changepassword', function ($scope, $http, SessionService ,AUTH_EVENTS, AuthService) {
		$scope.authError = false;	
		$scope.authSuccess=false;	
		$(".nav-tabs > li").removeClass("active");
	     $("#changePasswordTab").addClass("active");
				
		$scope.credentials = {				
				oldpassword		: '',
				password		: '',
				confirmpassword	: ''
		};
		$scope.accountTemplateUrl = "angular-constructs/account/ChangePassword.html";	
		
		
		$scope.changepassword = function (userDetails) {	
			$scope.authFailureMessage = "";
			$scope.authSuccessMessage = "";
			$scope.$broadcast('runCustomValidations', {
	            forms: ['changePwdForm']
	        });
			if(this.changePwdForm.$valid) {
				var password = userDetails.confirmpassword;	
				//oldpassword = userDetails.oldpassword;	
				
				userDetails={};
				userDetails.password =password;
				//userDetails.oldpassword =oldpassword;	
				
				
			AuthService.changepassword(userDetails)
			.then(function (user) {
				console.log("credentials==" +user)	
				$scope.authSuccess=true;
				$scope.authError = false;
				$scope.authSuccessMessage = AUTH_EVENTS.passwordUpdateSuccess;
			})
			.catch(function (res) {
				$scope.authSuccess=false;
				$scope.authError = true;
				$scope.authFailureMessage = res.data.error.message;
				
			});
			}
		}
	}).controller('FriendsController', function ($scope, $http, $state, SessionService ,AUTH_EVENTS, AuthService, $q) {
		$scope.authError = false;
		$scope.authSuccess=false;
		$scope.templateUrl = "";
		$scope.friendName = "";
		$scope.userDetails = "";
		$scope.friendList = 0;
		$scope.requestList = 0;
		$(".nav-tabs > li").removeClass("active");
		
		var selectedModule =  $state.current.data.selectedModule;
		$scope.$on('$viewContentLoaded', function() {
			if(selectedModule === "Friends"){
				$scope.accountTemplateUrl = "angular-constructs/account/FriendsList.html";					
			    $("#FriendsTab").addClass("active");
			    $scope.getFriendsDetails();
			}else if(selectedModule === "Notification"){
				$scope.accountTemplateUrl = "angular-constructs/account/Notification.html";	
				$("#notificationTab").addClass("active");
				$scope.getNotificationDetails();
			}
		});
		
		$scope.restMessage = function(){
			$scope.authSuccess=false;
			$scope.authError = false;
			$scope.userDetails= "";
		}
		
		//Get Friend List
		$scope.getFriendsDetails = function(){
			$scope.restMessage();			
			AuthService.getFollowingFriendList()
			.success(function (data) {			
				$scope.friendList = data;
			})
			.catch(function (res) {
				$scope.authSuccess=false;
				$scope.authError = true;
				$scope.authFailureMessage ="Email :"+ email +" "+AUTH_EVENTS.EmailNotFound;
			});
		}
		
		$scope.searchFriendName = function(friendName){
			$scope.$broadcast('runCustomValidations', {
	            forms: ['firendsForm']
	        });
			if(this.firendsForm.$valid) {
				var pattern = /\S+@\S+\.\S+/;
				if(pattern.test(friendName)){
					$scope.searchByEmail(friendName);
				}else{
					$scope.searchByName(friendName);
				}	
			}
		}
		
		//Search by email id
		$scope.searchByEmail = function(email){
			$scope.restMessage();			
			AuthService.searchByEmail(email)
			.success(function (data) {			
				if(data !== 'null'){
					$scope.userDetails = data
				}else{
					$scope.authSuccess=false;
					$scope.authError = true;
					$scope.authFailureMessage ="Email :"+ email +" "+AUTH_EVENTS.NameNotFound;					
				}
			})
			.catch(function (res) {
				$scope.authSuccess=false;
				$scope.authError = true;
				$scope.authFailureMessage ="Email :"+ email +" "+AUTH_EVENTS.EmailNotFound;
			});
		}
		
		//search by name
		$scope.searchByName = function(name){
			$scope.restMessage();		
			AuthService.searchByName(name)
			.success(function (data) {			
				if(data !== 'null'){
					$scope.userDetails = data
				}else{
					$scope.authSuccess=false;
					$scope.authError = true;
					$scope.authFailureMessage ="Name : "+name +" "+AUTH_EVENTS.NameNotFound;					
				}
			})
			.catch(function (res) {
				$scope.authSuccess=false;
				$scope.authError = true;
				$scope.authFailureMessage ="Name : "+ name +" "+AUTH_EVENTS.NameNotFound;
			});
		}
		
		//send request to friend
		$scope.sendRequest = function(user){
			$scope.restMessage();		
			AuthService.sendRequestToFriend(user.id)
			.success(function (data) {			
				$scope.authSuccess=true;
				$scope.authError = false;
				$scope.authSuccessMessage =AUTH_EVENTS.SendRequettoFriend  +" "+ user.firstName;
			})
			.catch(function (res) {
				$scope.authSuccess=false;
				$scope.authError = true;
				$scope.authFailureMessage =AUTH_EVENTS.SendRequetFail+" "+ user.firstName;
			});						
		}
		
		//Get Notification Details
		$scope.getNotificationDetails = function(){
			AuthService.incomingFriendRequest()
			.success(function (data) {	
				$scope.requestList = $scope.getOriginUserList(data);
			})
			.catch(function (res) {
				$scope.authSuccess=false;
				$scope.authError = true;
				$scope.authFailureMessage =res.data.error.message;
			});						
		}
		
		$scope.getOriginUserList = function(requestDataList){
			var userList =[];			
			_.each(requestDataList, function(requestData){
				requestData.originUser.requestID = requestData.id;
				userList.push(requestData.originUser);
			});
			
			return userList;
		}
		
		//Get User Information
		$scope.getUserInfo = function(data, callback){
			var prom = []; 
	    	 data.forEach(function (user) {
	    		 prom.push(AuthService.getRequestedFriendDetails(user.originUserId));	    		 
	    	 });
	    	 
	    	 $q.all(prom).then(function (userinfo) {
	    		 _.each(data, function(requestobject){
	    			 _.each(userinfo, function(user){
	    				 if(requestobject.originUserId === user.id){
	    					 user.requestID = requestobject.id;
	    				 }
	    			 })
	    		 });
	    		 callback(userinfo);	           
	         });
		}
		
		//Approve Friend Request
		$scope.approveRequest = function(user, index){
			AuthService.approveFriendRequest(user.requestID)
			.success(function (data) {	
				$scope.requestList.splice(index,1);
				$scope.authSuccess=true;
				$scope.authError = false;
				$scope.authSuccessMessage = user.firstName +" "+ AUTH_EVENTS.RequestApproved;
			})
			.catch(function (res) {
				$scope.authSuccess=false;
				$scope.authError = true;
				$scope.authFailureMessage =res.data.error.message;
			});		
		}
		
		//Reject Friend Request
		$scope.rejectRequest = function(user, index){
			AuthService.rejectFriendRequest(user.requestID)
			.success(function (data) {	
				$scope.requestList.splice(index,1);
				$scope.authSuccess=true;
				$scope.authError = false;
				$scope.authSuccessMessage = user.firstName +" "+ AUTH_EVENTS.RequestRejected;
			})
			.catch(function (res) {
				$scope.authSuccess=false;
				$scope.authError = true;
				$scope.authFailureMessage =res.data.error.message;
			});	
		}
		
		//Reject Friend Request
		$scope.removeFriend = function(user, index){
			AuthService.removeFriend(user.id)
			.success(function (data) {	
				$scope.friendList.splice(index,1);
				$scope.authSuccess=true;
				$scope.authError = false;
				$scope.authSuccessMessage = user.firstName +" "+ AUTH_EVENTS.RemovedFriend;
			})
			.catch(function (res) {
				$scope.authSuccess=false;
				$scope.authError = true;
				$scope.authFailureMessage =res.data.error.message;
			});	
		}
	});