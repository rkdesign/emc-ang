'use strict';

var angular = angular;
var module = angular.module('AdminService', ['Authentication']);

module.factory('AdminDataService', function ($q, $http,  SessionService, URLS , AUTH_MESSAGES) {
	var dataService = {};
	
	//get All Exercise list
	dataService.getExerciseList = function () {
		
		return $http
			.get((URLS.SITE_URL + URLS.EXERCISE_LIST ), {
				withCredentials: true,
				cache: false,
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {
				console.log("Failed to Exercise List: " + res.error.message);
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});		
		
	};
	
	// Update Exercise 
	dataService.updateExercise = function (exercise) {
		var idRegex = new RegExp("\\[EXERCISEID\\]", "ig");
		var url = (URLS.SITE_URL + URLS.UPDATE_EXERCISE)
		.replace(idRegex, encodeURIComponent(exercise.id));
		return $http
			.put(url, exercise, {
				withCredentials: true,
				cache: false,
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {
				console.log("Failed to update the Exercise : " + res.error.message);
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});	
	};

	// Update Exercise 
	dataService.deleteExercise = function (exercise) {
		var idRegex = new RegExp("\\[EXERCISEID\\]", "ig");
		var url = (URLS.SITE_URL + URLS.DELETE_EXERCISE)
		.replace(idRegex, encodeURIComponent(exercise.id));
		return $http
			.delete(url, {
				withCredentials: true,
				cache: false,
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {
				console.log("Failed to delete the  Exercise : " + res.error.message);
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});
	};
	
	// Update Exercise 
	dataService.createExercise = function (exercise) {		
		return $http
			.post((URLS.SITE_URL + URLS.CREATE_EXERCISE), exercise,{
				withCredentials: true,
				cache: false,
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {
				console.log("Failed to create Exercise : " + res.error.message);
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});
	};
	
	
	//Fitness Center services
	
	//get All Exercise Machine list
	dataService.getAllExerciseMachineList = function () {
			
		return $http
			.get((URLS.SITE_URL + URLS.GET_EXERCISE_MACHINE ), {
				withCredentials: true,
				cache: false,
				params: {'filter' : '{"include":["strengthExerciseDefinitions"]}'},
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {
				console.log("Failed to get user ExerciseMachine List: " + res.error.message);
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});		
		
	};
	
	//Create Exercise Machine 
	dataService.createExerciseMachine = function (fitnessCompanyID, exerciseMachine, $q) {
		var idRegex = new RegExp("\\[FITNESS_CENTER_ID\\]", "ig");
		var url = (URLS.SITE_URL + URLS.CREATE_EXERCISE_MACHINE)
		.replace(idRegex, encodeURIComponent(fitnessCompanyID));
		return $http
			.post((url),exerciseMachine, {
				withCredentials: true,
				cache: false,				
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {				
				return data;
			})		
			.error(function (res) {
				console.log("Failed to create ExerciseMachine : " + res.error.message);
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});		
		
	};
	
	//Add Exercise to Exercise Machine 
	dataService.addExerciseToExerciseMachine = function (data, exerciseMachine) {
		var idRegex = new RegExp("\\[EXERCISE_MACHINE_ID\\]", "ig");
		var fkRegex = new RegExp("\\[EXERCISE_ID\\]", "ig");
		var url = (URLS.SITE_URL + URLS.MAP_EXERCISE_TO_MACHINE)
		.replace(idRegex, encodeURIComponent(data.id))
		.replace(fkRegex, encodeURIComponent(exerciseMachine.id));
			
		return $http
				.put((url), null, {
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
	
	//Delete Exercise to Exercise Machine updates 
	dataService.deleteExerciseToExerciseMachine = function (data, exerciseMachine) {
		var idRegex = new RegExp("\\[EXERCISE_MACHINE_ID\\]", "ig");
		var fkRegex = new RegExp("\\[EXERCISE_ID\\]", "ig");
		var url = (URLS.SITE_URL + URLS.DELETE_EXERCISE_TO_MACHINE)
		.replace(idRegex, encodeURIComponent(data.id))
		.replace(fkRegex, encodeURIComponent(exerciseMachine.id));
			
		return $http
				.delete((url), {
					withCredentials: true,
					cache: false,				
					headers: {'Authorization': SessionService.getID()}
				}).success(function (data) {			
					return data;
				})		
				.error(function (res) {
					console.log("Failed to delete ExerciseMachine  " + res.error.message);
					var message = AUTH_MESSAGES[res.error.message] || res.error.message;
					return message;
				});		
	
		
	};
	
	//Update Selected Exercise Machine 
	dataService.updateExerciseMachine = function (exerciseMachine) {
		var idRegex = new RegExp("\\[EXERCISE_MACHINE_ID\\]", "ig");
		var url = (URLS.SITE_URL + URLS.UPDATE_EXERCISE_MACHINE)
		.replace(idRegex, encodeURIComponent(exerciseMachine.id));
		return $http
			.put((url),exerciseMachine, {
				withCredentials: true,
				cache: false,				
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {
				console.log("Failed to updated ExerciseMachine: " + res.error.message);
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});		
		
	};
	
	//Delete Selected Exercise Machine 
	dataService.deleteExerciseMachine = function (exerciseMachine) {
		var idRegex = new RegExp("\\[EXERCISE_MACHINE_ID\\]", "ig");
		var url = (URLS.SITE_URL + URLS.DELETE_EXERCISE_MACHINE)
		.replace(idRegex, encodeURIComponent(exerciseMachine.id));
		return $http
			.delete((url), {
				withCredentials: true,
				cache: false,				
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {
				console.log("Failed to delete ExerciseMachine: " + res.error.message);
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});		
		
	};
	
	//get all users list
	dataService.getAllUsersList = function(){		
		return $http
		.get((URLS.SITE_URL + URLS.GET_USER_INFO), {
			withCredentials: true,
			cache: false,				
			headers: {'Authorization': SessionService.getID()}
		}).success(function (data) {			
			return data;
		})		
		.error(function (res) {
			console.log("Failed to get user List: " + res.error.message);
			var message = AUTH_MESSAGES[res.error.message] || res.error.message;
			return message;
		});			
	};
	
	//Delete Selected Exercise Machine 
	dataService.deleteUser = function (id) {
		var idRegex = new RegExp("\\[USERID\\]", "ig");
		var url = (URLS.SITE_URL + URLS.DELETE_USER)
		.replace(idRegex, encodeURIComponent(id));
		return $http
			.delete((url), {
				withCredentials: true,
				cache: false,				
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {
				console.log("Failed to delete USER: " + res.error.message);
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});		
		
	};
	
	
	
	//get all getPrivileges list
	dataService.getUserPrivileges = function(id){	
		var idRegex = new RegExp("\\[USERID\\]", "ig");
		var url = (URLS.SITE_URL + URLS.GET_USER_PRIVILIGES)
		.replace(idRegex, encodeURIComponent(id));
				
		return $http
		.get((url), {
			withCredentials: true,
			cache: false,				
			headers: {'Authorization': SessionService.getID()}
		}).success(function (data) {			
			return data;
		})		
		.error(function (res) {
			console.log("Failed to get user List: " + res.error.message);
			var message = AUTH_MESSAGES[res.error.message] || res.error.message;
			return message;
		});		
		
	};
	
	//NFCTag Service
	dataService.getAllNFCTags = function(){
		return $http
		.get((URLS.SITE_URL + URLS.GET_ALL_USERS_NFCTAGS), {
			withCredentials: true,
			cache: false,				
			params: {'filter':{'include':['smartWeightsUser']}},
			headers: {'Authorization': SessionService.getID()}
		}).success(function (data) {			
			return data;
		})		
		.error(function (res) {
			console.log("Failed to get all NFCTag List: " + res.error.message);
			var message = AUTH_MESSAGES[res.error.message] || res.error.message;
			return message;
		});		
	};
	
	dataService.CreateNFCTags = function(user){
		return $http
		.post((URLS.SITE_URL + URLS.CREATE_NFCTAG),user, {
			withCredentials: true,
			cache: false,
			headers: {'Authorization': SessionService.getID()}
		}).success(function (data) {			
			return data;
		})		
		.error(function (res) {
			console.log("Failed to Create the NFCTag: " + res.error.message);
			var message = AUTH_MESSAGES[res.error.message] || res.error.message;
			return message;
		});		
	};
	
	//Delete NFC Tag
	dataService.deleteNFCTag = function (id) {
		var idRegex = new RegExp("\\[NFC_UID\\]", "ig");
		var url = (URLS.SITE_URL + URLS.DELETE_NFCTAG)
		.replace(idRegex, encodeURIComponent(id));
		return $http
			.delete((url), {
				withCredentials: true,
				cache: false,				
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {
				console.log("Failed to Delete the : " + res.error.message);
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});	
	 };
	 
	 dataService.getSelectedNFCTags = function(id){
		 	var idRegex = new RegExp("\\[NFC_UID\\]", "ig");
			var url = (URLS.SITE_URL + URLS.GET_SELECTED_NFCTAG)
			.replace(idRegex, encodeURIComponent(id));
		 
			return $http
			.get((url), {
				withCredentials: true,
				cache: false,				
				params: {'filter':{'include':['smartWeightsUser']}},
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {
				console.log("Failed to get NFCTag: " + res.error.message);
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});		
		};
		
		//Update Selected NFCTag 
		dataService.updateSelectedNFCTAg = function (nfcID, user) {
			var idRegex = new RegExp("\\[NFC_UID\\]", "ig");
			var url = (URLS.SITE_URL + URLS.UPDATE_NFCTAG)
			.replace(idRegex, encodeURIComponent(nfcID));
			return $http
				.put((url),user, {
					withCredentials: true,
					cache: false,				
					headers: {'Authorization': SessionService.getID()}
				}).success(function (data) {			
					return data;
				})		
				.error(function (res) {
					console.log("Failed to update the : " + res.error.message);
					var message = AUTH_MESSAGES[res.error.message] || res.error.message;
					return message;
				});
			};
		
		//Map Selected NFCTag to user
		dataService.mapSelectedNFCTAgToUser = function (uid, user) {
			var idRegex = new RegExp("\\[NFC_UID\\]", "ig");
			var userIdRegex = new RegExp("\\[USERID\\]", "ig");
			var url = (URLS.SITE_URL + URLS.MAP_TO_USER_NFCTAG)
			.replace(idRegex, encodeURIComponent(uid))
			.replace(userIdRegex, encodeURIComponent(user.id));
			return $http
				.put((url),"", {
					withCredentials: true,
					cache: false,				
					headers: {'Authorization': SessionService.getID()}
				}).success(function (data) {			
					return data;
				})		
				.error(function (res) {
					console.log("Failed to update the : " + res.error.message);
					var message = AUTH_MESSAGES[res.error.message] || res.error.message;
					return message;
				});	
			};
			
			//get Fitness center list
			dataService.getFitnessCenterList = function () {
				return $http
				.get((URLS.SITE_URL + URLS.FITNESS_CENTER_LIST), {
					withCredentials: true,
					cache: false,				
					/*params: {'filter':{'include':['smartWeightsUser']}},*/
					headers: {'Authorization': SessionService.getID()}
				}).success(function (data) {			
					return data;
				})		
				.error(function (res) {
					console.log("Failed to get all Fitness Center List: " + res.error.message);
					var message = AUTH_MESSAGES[res.error.message] || res.error.message;
					return message;
				});	
			};
				
			//get Fitness center list
			dataService.getTrainingCenterList = function () {
				return $http
				.get((URLS.SITE_URL + URLS.FITNESS_COMPANY_LIST), {
					withCredentials: true,
					cache: false,							
					params: {'filter':{'include':['fitnessCenters','administrators']}},
					headers: {'Authorization': SessionService.getID()}
				}).success(function (data) {			
					return data;
				})		
				.error(function (res) {
					console.log("Failed to get all Training Center List: " + res.error.message);
					var message = AUTH_MESSAGES[res.error.message] || res.error.message;
					return message;
				});	
			};

			//Create Fitness company 
			dataService.createFitnessCompany = function(fitnessCompany){
				return $http
				.post((URLS.SITE_URL + URLS.CREATE_FITNESS_COMPANY),fitnessCompany, {
					withCredentials: true,
					cache: false,
					headers: {'Authorization': SessionService.getID()}
				}).success(function (data) {			
					return data;
				})		
				.error(function (res) {
					console.log("Failed to Create Fitness Company " + res.error.message);
					var message = AUTH_MESSAGES[res.error.message] || res.error.message;
					return message;
				});		
			};
			
			//Delete Fitness Company
			dataService.deleteFitnessCompany = function (id) {
				var idRegex = new RegExp("\\[FITNESS_COMPANY_ID\\]", "ig");
				var url = (URLS.SITE_URL + URLS.DELETE_FITNESS_COMPANY)
				.replace(idRegex, encodeURIComponent(id));
				return $http
					.delete((url), {
						withCredentials: true,
						cache: false,				
						headers: {'Authorization': SessionService.getID()}
					}).success(function (data) {			
						return data;
					})		
					.error(function (res) {
						console.log("Failed to Delete the Fitness company : " + res.error.message);
						var message = AUTH_MESSAGES[res.error.message] || res.error.message;
						return message;
					});	
			 };
		
			//Update Selected Fitness Company  
			dataService.updateFitnessCompany = function (id, fitnessCompany) {
				var idRegex = new RegExp("\\[FITNESS_COMPANY_ID\\]", "ig");
				var url = (URLS.SITE_URL + URLS.UPDATE_FITNESS_COMPANY)
				.replace(idRegex, encodeURIComponent(id));
				return $http
					.put((url),fitnessCompany, {
						withCredentials: true,
						cache: false,				
						headers: {'Authorization': SessionService.getID()}
					}).success(function (data) {			
						return data;
					})		
					.error(function (res) {
						console.log("Failed to update the : " + res.error.message);
						var message = AUTH_MESSAGES[res.error.message] || res.error.message;
						return message;
					});
				};
			
			 
			 
			//Create Fitness company 
			dataService.createFitnessCenter = function(id , fitnessCenter){				
				var idRegex = new RegExp("\\[FITNESS_COMPANY_ID\\]", "ig");
				var url = (URLS.SITE_URL + URLS.CREATE_FITNESS_CENTER)
				.replace(idRegex, encodeURIComponent(id));
				
				return $http
				.post((url),fitnessCenter, {
					withCredentials: true,
					cache: false,
					headers: {'Authorization': SessionService.getID()}
				}).success(function (data) {			
					return data;
				})		
				.error(function (res) {
					console.log("Failed to Create Fitness Center " + res.error.message);
					var message = AUTH_MESSAGES[res.error.message] || res.error.message;
					return message;
				});		
			};
			
			//Delete Fitness Company
			dataService.deleteFitnessCenter = function (id) {
				var idRegex = new RegExp("\\[FITNESS_CENTER_ID\\]", "ig");
				var url = (URLS.SITE_URL + URLS.DELETE_FITNESS_CENTER)
				.replace(idRegex, encodeURIComponent(id));
				return $http
					.delete((url), {
						withCredentials: true,
						cache: false,				
						headers: {'Authorization': SessionService.getID()}
					}).success(function (data) {			
						return data;
					})		
					.error(function (res) {
						console.log("Failed to Delete the Fitness company : " + res.error.message);
						var message = AUTH_MESSAGES[res.error.message] || res.error.message;
						return message;
					});	
			 };

		//Update Selected Fitness Center
		dataService.updateFitnessCenter = function (id, fitnessCenter) {
			var idRegex = new RegExp("\\[FITNESS_CENTER_ID\\]", "ig");
			var url = (URLS.SITE_URL + URLS.UPDATE_FITNESS_CENTER)
			.replace(idRegex, encodeURIComponent(id));
			return $http
				.put((url),fitnessCenter, {
					withCredentials: true,
					cache: false,				
					headers: {'Authorization': SessionService.getID()}
				}).success(function (data) {			
					return data;
				})		
				.error(function (res) {
					console.log("Failed to update the : " + res.error.message);
					var message = AUTH_MESSAGES[res.error.message] || res.error.message;
					return message;
				});
			};
			
				
		//Assign Fitness Company priviliges  to user
		dataService.assignSelectedCompanyToUser = function (cId, userId) {
			var cidRegex = new RegExp("\\[FITNESS_COMPANY_ID\\]", "ig");
			var idRegex = new RegExp("\\[USERID\\]", "ig");
			var url = (URLS.SITE_URL + URLS.ASSIGN_FINESS_COMPANY_TO_USER)
			.replace(cidRegex, encodeURIComponent(cId))
			.replace(idRegex, encodeURIComponent(userId));
			return $http
				.put((url),"", {
					withCredentials: true,
					cache: false,				
					headers: {'Authorization': SessionService.getID()}
				}).success(function (data) {			
					return data;
				})		
				.error(function (res) {
					console.log("Failed to Assign the : " + res.error.message);
					var message = AUTH_MESSAGES[res.error.message] || res.error.message;
					return message;
				});	
			};
			
			//remove Fitness Company priviliges  to user
			dataService.removeSelectedCompanyToUser = function (cId, userId) {
				var cidRegex = new RegExp("\\[FITNESS_COMPANY_ID\\]", "ig");
				var idRegex = new RegExp("\\[USERID\\]", "ig");
				var url = (URLS.SITE_URL + URLS.REMOVE_FINESS_COMPANY_TO_USER)
				.replace(cidRegex, encodeURIComponent(cId))
				.replace(idRegex, encodeURIComponent(userId));
				return $http
					.delete((url), {
						withCredentials: true,
						cache: false,				
						headers: {'Authorization': SessionService.getID()}
					}).success(function (data) {			
						return data;
					})		
					.error(function (res) {
						console.log("Failed to remove the : " + res.error.message);
						var message = AUTH_MESSAGES[res.error.message] || res.error.message;
						return message;
					});	
				};
			
			//Assign Fitness Company priviliges  to user
			dataService.assignSelectedFitnessCenterToUser = function (FcId, userId) {
				var cidRegex = new RegExp("\\[FITNESS_CENTER_ID\\]", "ig");
				var idRegex = new RegExp("\\[USERID\\]", "ig");
				var url = (URLS.SITE_URL + URLS.ASSIGN_FINESS_CENTER_TO_USER)
				.replace(cidRegex, encodeURIComponent(FcId))
				.replace(idRegex, encodeURIComponent(userId));
				return $http
					.put((url),"", {
						withCredentials: true,
						cache: false,				
						headers: {'Authorization': SessionService.getID()}
					}).success(function (data) {			
						return data;
					})		
					.error(function (res) {
						console.log("Failed to Assign the : " + res.error.message);
						var message = AUTH_MESSAGES[res.error.message] || res.error.message;
						return message;
					});	
				};
				
				
				//remove Fitness center priviliges  to user
				dataService.removeSelectedFitnessCenterToUser = function (FcId, userId) {
					var cidRegex = new RegExp("\\[FITNESS_CENTER_ID\\]", "ig");
					var idRegex = new RegExp("\\[USERID\\]", "ig");
					var url = (URLS.SITE_URL + URLS.REMOVE_FINESS_CENTER_TO_USER)
					.replace(cidRegex, encodeURIComponent(FcId))
					.replace(idRegex, encodeURIComponent(userId));
					return $http
						.delete((url), {
							withCredentials: true,
							cache: false,				
							headers: {'Authorization': SessionService.getID()}
						}).success(function (data) {			
							return data;
						})		
						.error(function (res) {
							console.log("Failed to remove the : " + res.error.message);
							var message = AUTH_MESSAGES[res.error.message] || res.error.message;
							return message;
						});	
					};
					
					//Assign Admin privileges  to user
					dataService.assignAdminPrivilegesToUser = function (userId) {						
						var idRegex = new RegExp("\\[USERID\\]", "ig");
						var url = (URLS.SITE_URL + URLS.ASSIGN_ADMIN_ROLE)						
						.replace(idRegex, encodeURIComponent(userId));
						return $http
							.put((url),"", {
								withCredentials: true,
								cache: false,				
								headers: {'Authorization': SessionService.getID()}
							}).success(function (data) {			
								return data;
							})		
							.error(function (res) {
								console.log("Failed to Assign the : " + res.error.message);
								var message = AUTH_MESSAGES[res.error.message] || res.error.message;
								return message;
							});	
						};
								
						//Remove Admin privileges  to user
						dataService.removeAdminPrivilegesToUser = function (userId) {						
							var idRegex = new RegExp("\\[USERID\\]", "ig");
							var url = (URLS.SITE_URL + URLS.REMOVE_ADMIN_ROLE)						
								.replace(idRegex, encodeURIComponent(userId));
							return $http
								.put((url),"", {
									withCredentials: true,
									cache: false,				
									headers: {'Authorization': SessionService.getID()}
								}).success(function (data) {			
									return data;
								})		
								.error(function (res) {
									console.log("Failed to Remove the : " + res.error.message);
									var message = AUTH_MESSAGES[res.error.message] || res.error.message;
									return message;
								});	
							};	
							
		//get Fitness level Exerice list
		dataService.getCurrentExerciseList = function (id) {
			var idRegex = new RegExp("\\[FITNESS_CENTER_ID\\]", "ig");
			var url = (URLS.SITE_URL + URLS.ADMIN_LIVE)						
				.replace(idRegex, encodeURIComponent(id));
			
			return $http
			.get((url), {
				withCredentials: true,
				cache: false,				
				params: {'filter' : '{"include":["strengthExerciseDefinition",{"sets":["reps"]}]}'},
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {
				console.log("Failed to get all Fitness Center Exercise list: " + res.error.message);
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});	
		};
		
		//get Fitness level Exerice list
		dataService.getCurrentExerciseRecordList = function (uid) {	
			return $http
			.get((URLS.SITE_URL + URLS.EXERCISE_MACHINE_RECORDS_LIST), {
				withCredentials: true,
				cache: false,
				params :{'filter' : '{"where":{"uid":"'+uid+'"},"include":{"relation":"strengthExerciseRecords", "scope":{"include":["smartWeightsUser","strengthExerciseDefinition", {"sets":["reps"]}]}}}'},
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {			
				return data;
			})		
			.error(function (res) {
				console.log("Failed to get all Fitness Center Exercise list: " + res.error.message);
				var message = AUTH_MESSAGES[res.error.message] || res.error.message;
				return message;
			});	
		};
			
	return dataService;
});
