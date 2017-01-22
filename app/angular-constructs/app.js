var app = angular.module('swwc', [
	'facebook-service',
	'ui.router',
	'chart.js',	
	'Application',
	'WorkoutStatisticsService',
	'WorkoutStatistics',
	'WorkoutHistory',
	'WorkoutLive',
	'WorkoutFaker',
	'Authentication',
	'Account',
	'WorkoutData',
	'Admin',
	'AdminService',	
	'CustomDropdownMultiselect',
	'directives.customvalidation.customValidationTypes',
	'ui.event',
	'TrainingCenterModule',
	'NFCTagModule',
	'numberValidation',
	'AdminDebug',
	'720kb.tooltips'
]);

//Set up constants
app
	.constant('AUTH_EVENTS', {
		loginSuccess: 'auth-login-success',
		loginFailed: 'User name or password incorrect',
		logoutSuccess: 'auth-logout-success',
		sessionTimeout: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		notAuthorized: 'auth-not-authorized',
		registraionSuccess : 'You have registered successfully',
		userUpdateSuccess : 'User details successfully updated',
		userUpdateFailed : 'User details updated failed',
		passwordUpdateFailed : 'User details updated failed',
		passwordUpdateSuccess : 'Password updated successfully',
		resetpasswordSuccess : 'Your new Password send to your register mail. Please check your register mail ',
		resetpasswordError : 'Unable to reset your password. Please contact your  Admin ',
		exerciseListerror		:	'unable to get ExerciseList',
		exerciseediterror		:	'unable to update the Exercise',
		exerciseCreateSuccessfully : ' Exercise Created Successfully',
		exerciseUpdatedSuccessfully : ' Exercise Updated Successfully',
		exerciseDeletedSuccessfully : ' Exercise Deleted Successfully',
		exerciseMachineDeletedSuccessfully : 'Exercise Machine Deleted Successfully',
		exerciseMachineUpdatedSuccessfully : 'Exercise Machine Updated Successfully',
		NFCTagCreateSuccessfully : 'NFC Tag is created Successfully',
		NFCTagUpdatedSuccessfully : 'NFC Tag is Updated Successfully',
		NFCTagDeleteSuccessfully : 'NFC Tag is Deleted Successfully',
		UserDeleteSuccessfully  : ' is Deleted Successfully',
		SameUserDeleteMessage	:	'you cannot delete',
		createFitnessCompanySuccess	: 'Fitness Company Create Successfully',
		deleteFitnessCompanySuccess  : 'Fitness Company Delete Successfully' ,
		updateFitnessCompanySuccess  : 'Fitness Company updated Successfully' ,
		createFitnessCenterSuccess	: 'Fitness Center Create Successfully',
		updateFitnessCenterSuccess	: 'Fitness Center Updated Successfully',
		deleteFitnessCenterSuccess	: 'Fitness Center Deleted Successfully',
		EmailNotFound				: 'that you tried to reach does not exist.',
		NameNotFound				: 'that you tried to reach does not exist.',
		SendRequettoFriend			: 'Request is send to ',
		SendRequetFail				: 'Request Unable to send to ',
		RequestApproved				: 'Request Approved',
		RequestRejected				: 'Request Rejected',
		RemovedFriend				: 'Removed for the Friend list',
		graphHeading				: 'Total Weight Lifted',
		caloriesHeading				: 'Calorie',
		workoutHeading				: 'Total Workouts'
		
	})
	.constant('AUTH_MESSAGES', {
		'Error.Passport.Email.NotFound': 'Email not found',
		'Error.Passport.Username.NotFound': 'Username not found',
		'Error.Passport.Password.Wrong': 'Incorrect password'
	})
	.constant('USER_ROLES', {
		all: '*',
		admin: 'admin',
		editor: 'editor',
		guest: 'guest'
	})
	.constant('URLS', {
		//SITE_URL				: 'http://10.10.10.11:8400/',
		//SITE_URL				: 'http://api.thesmartweights.com/',
		//SITE_URL 				: 'http://api.thesmartweights.com/api/v0/',
		//SITE_URL 				: 'http://api-staging.thesmartweights.com/api/v0/',
		SITE_URL				: 'http://api-staging.thesmartweights.com:80/api/v0/',		
		//mail application url
		//EXTERNAL_SITE_URL		: 'http://localhost:8080/EmailApplication/',
		//EXTERNAL_SITE_URL		: 'http://smartweights.elasticbeanstalk.com/', //rama AWS URL
		EXTERNAL_SITE_URL		: 'http://smartweightsmailerv-env.us-west-2.elasticbeanstalk.com/',  //praveen AWS URL
		
		HISTORY					: 'SmartWeightsUsers/[USERID]/strengthExerciseRecords',
		LIVE					: 'SmartWeightsUsers/[USERID]/getStrengthExerciseInProgress',
		ADMIN_LIVE				: 'FitnessCenters/[FITNESS_CENTER_ID]/strengthExercisesInProgress',
		LOGIN					: 'SmartWeightsUsers/login?include=user',
		REGISTER				: 'SmartWeightsUsers',
		GET_USER_INFO			: 'SmartWeightsUsers/',
		UPDATE_USER_DETAILS 	: 'SmartWeightsUsers/',
		UPDATE_PASSWORD		 	: 'SmartWeightsUsers/',
		RESET_PASSWORD		 	: 'SmartWeightsUsers/reset',
		GET_USER_PRIVILIGES		: 'SmartWeightsUsers/[USERID]/getPrivileges',
		ASSIGN_ADMIN_ROLE		: 'SmartWeightsUsers/[USERID]/assignAdministratorRole',
		REMOVE_ADMIN_ROLE		: 'SmartWeightsUsers/[USERID]/revokeAdministratorRole',
		DELETE_USER				: 'SmartWeightsUsers/[USERID]',
		LOGOUT					: 'SmartWeightsUsers/logout',
		FOLLOWING_LIST			: 'SmartWeightsUsers/[USERID]/following',
		SEARCH_BY_NAME			: 'SmartWeightsUsers/findByUsername/[USER_NAME]',
		SEARCH_BY_EMAIL			: 'SmartWeightsUsers/findByEmail/[USER_EMAIL]',
		SEND_REQUEST_TO_FRIEND	: 'SmartWeightsUsers/[USERID]/sendFriendRequest/[FRIEND_ID]',
		REMOVE_FRIEND			: 'SmartWeightsUsers/[USERID]/removeFriend/[FRIEND_ID]',
		INCOMING_FRIEND_REQUEST	: 'SmartWeightsUsers/[USERID]/incomingFriendRequests',
		GET_USER_DETAILS		: 'SmartWeightsUsers/[FRIEND_ID]/info',
		CONFIRM_REQUEST			: 'FriendRequests/[REQUEST_ID]/accept',
		REJECT_REQUEST			: 'FriendRequests/[REQUEST_ID]/reject',
		EXERCISE_START			: 'exerciseStart?login=[LOGIN]&exercise=[EXERCISE]',
		EXERCISE_STOP			: 'exerciseStop?login=[LOGIN]&exercise=[EXERCISE]',
		EXERCISE_UPDATE			: 'exerciseUpdate?login=[LOGIN]&exercise=[EXERCISE]',
		CREATE_EXERCISE			: 'StrengthExerciseDefinitions',
		EXERCISE_LIST			: 'StrengthExerciseDefinitions',
		UPDATE_EXERCISE			: 'StrengthExerciseDefinitions/[EXERCISEID]',
		DELETE_EXERCISE			: 'StrengthExerciseDefinitions/[EXERCISEID]',
		GET_EXERCISE_MACHINE	: 'ExerciseMachines',
		CREATE_EXERCISE_MACHINE	: 'FitnessCenters/[FITNESS_CENTER_ID]/exerciseMachines',
		UPDATE_EXERCISE_MACHINE	: 'ExerciseMachines/[EXERCISE_MACHINE_ID]',
		DELETE_EXERCISE_MACHINE	: 'ExerciseMachines/[EXERCISE_MACHINE_ID]',
		MAP_EXERCISE_TO_MACHINE : 'ExerciseMachines/[EXERCISE_MACHINE_ID]/StrengthExerciseDefinitions/rel/[EXERCISE_ID]',
		DELETE_EXERCISE_TO_MACHINE : 'ExerciseMachines/[EXERCISE_MACHINE_ID]/StrengthExerciseDefinitions/rel/[EXERCISE_ID]',
		EXERCISE_MACHINE_RECORDS_LIST : 'ExerciseMachines/findOne',
		GET_ALL_USERS_NFCTAGS	: 'NFCTags/',
		CREATE_NFCTAG			: 'NFCTags/',
		DELETE_NFCTAG			: 'NFCTags/[NFC_UID]',
		GET_SELECTED_NFCTAG		: 'NFCTags/[NFC_UID]',
		UPDATE_NFCTAG			: 'NFCTags/[NFC_UID]',
		MAP_TO_USER_NFCTAG		: 'NFCTags/[NFC_UID]/assign/[USERID]',
		FITNESS_COMPANY_LIST	: 'FitnessCompanies',
		CREATE_FITNESS_COMPANY	: 'FitnessCompanies',
		DELETE_FITNESS_COMPANY	: 'FitnessCompanies/[FITNESS_COMPANY_ID]',
		UPDATE_FITNESS_COMPANY	: 'FitnessCompanies/[FITNESS_COMPANY_ID]',
		CREATE_FITNESS_CENTER	: 'FitnessCompanies/[FITNESS_COMPANY_ID]/fitnessCenters',
		FITNESS_CENTER_LIST		: 'FitnessCenters',
		DELETE_FITNESS_CENTER	: 'FitnessCenters/[FITNESS_CENTER_ID]',
		UPDATE_FITNESS_CENTER	: 'FitnessCenters/[FITNESS_CENTER_ID]',
		ASSIGN_FINESS_COMPANY_TO_USER : 'FitnessCompanies/[FITNESS_COMPANY_ID]/administrators/rel/[USERID]',
		REMOVE_FINESS_COMPANY_TO_USER : 'FitnessCompanies/[FITNESS_COMPANY_ID]/administrators/rel/[USERID]',
		ASSIGN_FINESS_CENTER_TO_USER : 'FitnessCenters/[FITNESS_CENTER_ID]/administrators/rel/[USERID]',
		REMOVE_FINESS_CENTER_TO_USER : 'FitnessCenters/[FITNESS_CENTER_ID]/administrators/rel/[USERID]',
		
		//AWS Mail Action 
		MAIL_REGISTRATION_ACTION_NAME 	: 'registriaonSucess.html',
		MAIL_NFC_TAG_ACTION_NAME 		: 'nfcTagDetails.html',
		MAIL_WEEKLY_REPORT_ACTION_NAME 	: 'weeklyWorkoutDetail.html',
		MAIL_RECENT_WORKOUT_ACTION_NAME : 'recentWorkoutDetails.html',			
			
	}).config(function( facebookProvider) {
		  facebookProvider.setInitParams('321797711181052',true,true,true,'v2.3');
		  facebookProvider.setPermissions(['email','public_profile']);
	})
	

//Set up routes
	.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider, SessionService, $httpProvider) {

			//Set up routes
			$urlRouterProvider.otherwise('/');
			$stateProvider
			$stateProvider.state('/', {
				url: '/',
				// templateUrl: 'partials/workout-summary.html',
				// controller: 'WorkoutSummaryController',
				data: {
					requireLogin: false
				}
			})
				.state('workout-statistics', {
					url: '/workout-statistics',
					templateUrl: 'angular-constructs/workout-statistics/WorkoutStatistics.html',
					controller: 'WorkoutStatisticsController',
					moduleTitle:'Fitness DashBoard',
					data: {
						requireLogin: true,
						selectedModule:'dashboard'
					}
				}).state('workout-live', {
					url: '/workout-live',
					templateUrl: 'angular-constructs/workout-live/WorkoutLive.html',
					controller: 'WorkoutLiveController',
					moduleTitle:'Live workout',
					data: {
						requireLogin: true,
						selectedModule:'liveWorkout'
					}
				}).state('workout-history', {
					url: '/workout-history',
					templateUrl: 'angular-constructs/workout-history/WorkoutHistory.html',
					controller: 'WorkoutHistoryController',
					moduleTitle:'workout history',
					data: {
						requireLogin: true,
						selectedModule:'history'
					}
				}).state('workout-historyByExercise', {
					url: '/workout-historyByExercise',
					templateUrl: 'angular-constructs/workout-history/WorkoutHistory.html',
					controller: 'WorkoutHistoryController',
					moduleTitle:'workout history',
					data: {
						requireLogin: true,
						selectedModule:'ByExercise'
					}
				}).state('workout-faker', {
					url: '/workout-faker',
					templateUrl: 'angular-constructs/workout-faker/WorkoutFaker.html',
					controller: 'WorkoutFakerController',
					moduleTitle:'workout faker',
					data: {
						requireLogin: true
					}
				}).state('account', {
					url: '/account',
					templateUrl: 'angular-constructs/account/Account.html',
					controller: 'AccountController',
					moduleTitle:'My Account',
					data: {
						requireLogin: true
					}
				}).state('changepassword', {
					url: '/changepassword',
					templateUrl: 'angular-constructs/account/Account.html',
					controller: 'Changepassword',
					moduleTitle:'Change Password',
					data: {
						requireLogin: true
					}
				}).state('register', {
					url: '/register',
					templateUrl: 'angular-constructs/auth/register.html',
					controller: 'RegistrationController',
					moduleTitle:'Register',
					data: {
						requireLogin: false
					} 
				}).state('login', {
					url: '/login',
					templateUrl: 'angular-constructs/auth/login.html',
					controller: 'LoginController',
					moduleTitle:'Login',
					data: {
						requireLogin: false
					}
				}).state('resetpassword', {
					url: '/resetpassword',
					templateUrl: 'angular-constructs/auth/forgotpassword.html',
					controller: 'ForgotPasswordController',
					moduleTitle:'Forgot Password',
					data: {
						requireLogin: false
					}
				}).state('logout', {
					url: '/logout',
					templateUrl: 'angular-constructs/auth/logout.html',
					controller: 'LogoutController',
					moduleTitle:'Logout',
					data: {
						requireLogin: true
					}
				}).state('admin', {
					url: '/admin',
					templateUrl: 'angular-constructs/admin/admin.html',
					controller: 'AdminController',
					moduleTitle:'Exercise List',
					data: {
						requireLogin: true
					}
				}).state('exerciseMachine', {
					url: '/exerciseMachine',
					templateUrl: 'angular-constructs/admin/admin.html',
					controller: 'ExerciseMachineController',
					moduleTitle:'Exercise Machine',
					data: {
						requireLogin: true
					}
				}).state('createExercise', {
					url: '/createExercise',
					templateUrl: 'angular-constructs/admin/createExercise.html',
					controller: 'AdminController',
					moduleTitle:'Create Exercise',
					data: {
						requireLogin: true
					}
				}).state('createExerciseMachine', {
					url: '/createExerciseMachine',
					templateUrl: 'angular-constructs/admin/createExerciseMachine.html',
					controller: 'ExerciseMachineController',
					moduleTitle:'Create Exercise ',
					data: {
						requireLogin: true
					}
				}).state('admin-workout-statistics', {
					url: '/admin-workout-statistics',
					templateUrl: 'angular-constructs/admin/adminDashBoard.html',
					controller: 'AdminDashBoardController',
					moduleTitle:'Fitness DashBoard',
					data: {
						requireLogin: true,
						selectedModule:'dashboard'
					}
				}).state('admin-workout-history', {
					url: '/admin-workout-history',
					templateUrl: 'angular-constructs/admin/adminDashBoard.html',
					controller: 'AdminDashBoardController',
					moduleTitle:'workout history',
					data: {
						requireLogin: true,
						selectedModule:'history'
					}
				}).state('admin-workout-historyByExercise', {
					url: '/admin-workout-historyByExercise',
					templateUrl: 'angular-constructs/admin/adminDashBoard.html',
					controller: 'AdminDashBoardController',
					moduleTitle:'workout history',
					data: {
						requireLogin: true,
						selectedModule:'ByExercise'
					}
				}).state('admin-workout-live', {
					url: '/admin-workout-live',
					templateUrl: 'angular-constructs/admin/adminDashBoard.html',
					controller: 'AdminLiveWorkOutController',
					moduleTitle:'live workout',
					data: {
						requireLogin: true,
						selectedModule:'liveWorkout'
					}
				}).state('admin-file-download', {
					url: '/admin-file-download',
					templateUrl: 'angular-constructs/admin/adminFileDownload.html',
					controller: 'DownloadFileController',
					moduleTitle:'Down load CSV ',
					data: {
						requireLogin: true,
						selectedModule:'liveWorkout'
					}
				})
				.state('admin-user-NFC', {
					url: '/admin-user-NFC',
					templateUrl: 'angular-constructs/admin/admin.html',
					controller: 'NFCController',
					moduleTitle:'NFC Tags',
					data: {
						requireLogin: true,
						selectedModule:'USERS'
					}
				})
				.state('admin-user-modification', {
					url: '/admin-user-modification',
					templateUrl: 'angular-constructs/admin/admin.html',
					controller: 'NFCController',
					moduleTitle:'User Modification',
					data: {
						requireLogin: true,
						selectedModule:'UserModification'
					}
				})
				.state('admin-user-privileges', {
					url: '/admin-user-privileges',
					templateUrl: 'angular-constructs/admin/admin.html',
					controller: 'NFCController',
					moduleTitle:'User Privileges',
					data: {
						requireLogin: true,
						selectedModule:'Userprivileges'
					}
				})
				.state('fitnessCenter', {
					url: '/fitnessCenter',
					templateUrl: 'angular-constructs/admin/admin.html',
					controller: 'FitnessCenterController',
					moduleTitle:'Fitness Center',
					data: {
						requireLogin: true,
						selectedModule:'FitnessCenter'
					}
				})
				.state('fitnessCompany', {
					url: '/fitnessCompany',
					templateUrl: 'angular-constructs/admin/admin.html',
					controller: 'TrainingCenterController',
					moduleTitle:'Fitness Company',
					data: {
						requireLogin: true,
						selectedModule:'FitnessCenter'
					}
				})
				.state('mailCenter', {
					url: '/mailCenter',
					templateUrl: 'angular-constructs/admin/admin.html',
					controller: 'MailCenterController',
					moduleTitle:'Mail',
					data: {
						requireLogin: true,
						selectedModule:'mailCenter'
					}
				})
				.state('exerciseInProgress', {
					url: '/exerciseInProgress',
					templateUrl: 'angular-constructs/admin/admin.html',
					controller: 'ExerciseProgressController',
					moduleTitle:'Exercise In Progress',
					data: {
						requireLogin: true,
						selectedModule:'ExerciseInProgress'
					}
				})
				.state('friends', {
					url: '/friends',
					templateUrl: 'angular-constructs/account/Account.html',
					controller: 'FriendsController',
					moduleTitle:'Friends',
					data: {
						requireLogin: true,
						selectedModule:'Friends'
					}
				}).state('notification', {
					url: '/notification',
					templateUrl: 'angular-constructs/account/Account.html',
					controller: 'FriendsController',
					moduleTitle:'Notification',
					data: {
						requireLogin: true,
						selectedModule:'Notification'
					}
				}).state('adminDebug', {
					url: '/adminDebug',
					templateUrl: 'angular-constructs/admin/admin.html',
					controller: 'DebugController',
					moduleTitle:'Admin Debug',
					data: {
						requireLogin: true,
						selectedModule:'Admindebug'
					}
				});
		}
	])

//Upon refresh/load of the SPA, send user straight to login page if they are not authenticated, else send them to home
	.run(function ($rootScope, $state) {
		$rootScope.moduleTitle = 'Smart Health Clubs'
		$state.go('/');

		$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
			var requireLogin = toState.data.requireLogin;
			//console.log('Logged in? ' + $rootScope.loggedIn);
			if (requireLogin && $rootScope.loggedIn !== true) {
				//event.preventDefault();
				//$state.go('login');
			}
			if(toState.moduleTitle){
				$rootScope.moduleTitle = toState.moduleTitle;
			}
		});

	})
