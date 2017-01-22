'use strict';

var WorkoutSummaryProcessor = {

	monthNames: ['January', 'February', 'March',
		'April', 'May', 'June', 'July', 'August', 'September',
		'October', 'November', 'December'
	],

	weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

	//sorts data from processWorkoutSummaryData() by date
	sortByDate: function (data) {
		return data.sort(function (a, b) {
			return a.unixTime > b.unixTime;
		});
	},

	getSelectedDate : function(days, selectedday){
		for(var i =0; i< days.length; i++){
			if(days[i] === selectedday){
				return i;
			}
		}
	},
	
	covertToMinHours : function(data){		
		for(var i=0; i< data.length; i++){
			var newLabel = moment.duration(parseInt(data[i]), 'ms').format("H[h] mm[m] ss[s]");			
			data[i] = newLabel;
		}		
		return data;
	},
	
	
	
	//takes input from filterWorkoutsForTimePeriod() and outputs an array representing weight lifted, organized by weekday
	getWeightLiftedArrayByWeekdays: function (data, dateObj) {
		var arr=[], dateArr=[];	
		for(var i=0; i <= 6; i++){
			var day = dateObj.add(1,"day").format("Do");			
			arr.push(day);	
			dateArr.push(0);
		}		
		for (var i = 0; i < data.length; i++) {
			var workout = data[i];
			var setDayOfWeekNumber = moment.unix(workout.unixTime).format('Do');
			var index = this.getSelectedDate(arr,setDayOfWeekNumber);					
				for (var j = 0; j < workout.sets.length; j++) {
					var set = workout.sets[j];
					dateArr[index] += (set.reps.length * set.weight);
				}
		}
		return dateArr;
	},
	
	//takes input from filterWorkoutsForTimePeriod() and outputs an array representing time that weights were in the air, organized by weekday
	getLiftTimeArrayByWeekdays: function (data,dateObj) {		
		var arr=[], dateArr=[];	
		for(var i=0; i <= 6; i++){
			var day = dateObj.add(1,"day").format("Do");			
			arr.push(day);	
			dateArr.push(0);
		}
		for (var i = 0; i < data.length; i++) {
			var workout = data[i];
			var setDayOfWeekNumber = moment.unix(workout.unixTime).format('Do');
			var index = this.getSelectedDate(arr,setDayOfWeekNumber)
			for (var j = 0; j < workout.sets.length; j++) {
				var set = workout.sets[j];
				dateArr[index] += (set.setDuration);
			}
		}
		return dateArr;
	},
	
	//takes input from filterWorkoutsForTimePeriod() and outputs an array representing rest Time , organized by weekday
	getRestTimeArrayByWeekdays: function (data,dateObj) {		
		var arr=[], dateArr=[];	
		for(var i=0; i <= 6; i++){
			var day = dateObj.add(1,"day").format("Do");			
			arr.push(day);	
			dateArr.push(0);
		}
		for (var i = 0; i < data.length; i++) {
			var workout = data[i];
			var setDayOfWeekNumber = moment.unix(workout.unixTime).format('Do');
			var index = this.getSelectedDate(arr,setDayOfWeekNumber)
			for (var j = 0; j < workout.sets.length; j++) {
				var set = workout.sets[j];				
				dateArr[index] += (set.restDuration);
			}
		}
		return dateArr;
	},

	//takes input from filterWorkoutsForTimePeriod() and outputs an array representing weight lifted
	getWeightLiftedArrayByTwoWeekdays: function (data, dateObj) {
		var arr=[], dateArr=[];	
		for(var i=0; i <= 14; i++){
			var day = dateObj.add(1,"day").format("Do");			
			arr.push(day);	
			dateArr.push(0);
		}		
		for (var i = 0; i < data.length; i++) {
			var workout = data[i];
			var setDayOfWeekNumber = moment.unix(workout.unixTime).format('Do');
			var index = this.getSelectedDate(arr,setDayOfWeekNumber);					
				for (var j = 0; j < workout.sets.length; j++) {
					var set = workout.sets[j];
					dateArr[index] = (set.reps.length * set.weight);
				}
		}
		return dateArr;
	},
	

	getLiftTimeArrayByTwoWeekdays: function (data,dateObj) {		
		var arr=[], dateArr=[];	
		for(var i=0; i <= 12; i++){
			var day = dateObj.add(1,"day").format("Do");			
			arr.push(day);	
			dateArr.push(0);
		}
		for (var i = 0; i < data.length; i++) {
			var workout = data[i];
			var setDayOfWeekNumber = moment.unix(workout.unixTime).format('Do');
			var index = this.getSelectedDate(arr,setDayOfWeekNumber)
			for (var j = 0; j < workout.sets.length; j++) {
				var set = workout.sets[j];
				dateArr[index] += (set.setDuration);
			}
		}
		return dateArr;
	},

	
	
	
	
	getWeightLiftedArrayByMonth: function (data, days) {
		var dates=[], dateArr=[0,0,0,0], weekDays = 7;
		 for(var i=0; i<= 4; i++){
				dates.push(moment().subtract(days -(weekDays * i), 'day').startOf('day'));				
			}
		 for(var m=0; m< dates.length-1; m++){
			 	var result  = this.filterWorkoutsForTimePeriod(data, moment(dates[m]).add(1,"day").startOf("day") , moment(dates[m+1]).endOf('day'));
			 	//console.log( moment(dates[m]).add(1,"day").startOf("day") +"----"+ moment(dates[m+1]).endOf('day'))
			 	for (var i = 0; i < result.length; i++) {
					var workout = result[i];								
						for (var j = 0; j < workout.sets.length; j++) {
							var set = workout.sets[j];
							dateArr[m] += (set.reps.length * set.weight);
						}
				}		 
		 }	
		return dateArr;
	},
	getLiftTimeArrayByMonth: function (data, days) {	
		var dates=[], dateArr=[0,0,0,0], weekDays = 7;
		 for(var i=0; i<= 4; i++){
				dates.push(moment().subtract(days -(weekDays * i), 'day').startOf('day'));				
			}
		 for(var m=0; m< dates.length-1; m++){
			 	var result  = this.filterWorkoutsForTimePeriod(data, moment(dates[m]).add(1,"day").startOf("day") , moment(dates[m+1]).endOf('day'));
			 	//console.log( moment(dates[m]).add(1,"day").startOf("day") +"----"+ moment(dates[m+1]).endOf('day'))
			 	for (var i = 0; i < result.length; i++) {
					var workout = result[i];								
						for (var j = 0; j < workout.sets.length; j++) {
							var set = workout.sets[j];
							dateArr[m] += (set.setDuration);
						}
				}		 
		 }
		
		return dateArr;		 
	},
	
	//takes input from filterWorkoutsForTimePeriod() and outputs an Integer representing total weight lifted
	getTotalWeightLifted: function (data) {

		var totalWeightLifted = 0;
		for (var i = 0; i < data.length; i++) {
			var workout = data[i];			
			for (var j = 0; j < workout.sets.length; j++) {
				var set = workout.sets[j];
				totalWeightLifted += (set.reps.length * set.weight);
			}
		}
		return totalWeightLifted;
	},

	//takes input from filterWorkoutsForTimePeriod() and outputs an Integer representing total seconds that weights were in the air
	getTotalLiftTime: function (data) {
		var totalLiftTime = 0;
		for (var i = 0; i < data.length; i++) {
			var workout = data[i];
			for (var j = 0; j < workout.sets.length; j++) {
				var set = workout.sets[j];
				//totalLiftTime += ((set.avgContractionTime + set.avgExtensionTime) * set.reps);
				totalLiftTime += set.setDuration;
			}
		}
		return totalLiftTime;
	},
	
	//takes input from filterWorkoutsForTimePeriod() and outputs an Integer representing total seconds that USER rest
	getTotalRestTime: function (data) {
		var totalRestTime = 0;
		for (var i = 0; i < data.length; i++) {
			var workout = data[i];
			for (var j = 0; j < workout.sets.length; j++) {
				var set = workout.sets[j];
				//totalLiftTime += ((set.avgContractionTime + set.avgExtensionTime) * set.reps);
				totalRestTime += set.restDuration;
			}
		}
		return totalRestTime;
	},

	//takes input from processWorkoutSummaryData() and organizes it by date so that we can easily display it using Angular
	organizeWorkoutsByDate: function (data, format) {

		var exercisesByDate = {};

		for (var i = 0; i < data.length; i++) {
			var workout = data[i];
			var workoutDay = moment.unix(workout.unixTime).startOf('day');
			var workoutDayUnix = workoutDay.unix();
			//var workoutCalendarString = workoutDay.calendar();
			if(format){
				for(var j=0; j<workout.sets.length; j++ ){
					workout.sets[j].averageContractionDuration = (workout.sets[j].averageContractionDuration).toFixed(1)  +"s";
					workout.sets[j].averageExtensionDuration = (workout.sets[j].averageExtensionDuration).toFixed(1) +"s" ;
					workout.sets[j].restTime = moment.duration(workout.sets[j].restDuration).format("HH:mm:ss");
					workout.sets[j] = this.getCssClassName(workout.sets[j]);
				}
			}
			if (!exercisesByDate[workoutDayUnix]) {
				exercisesByDate[workoutDayUnix] = [];
			}

			workout.dateString = workoutDay.format('ddd MMM Do, YYYY');
			workout.timeString = moment.unix(workout.unixTime).format("HH:mm:ss");
			exercisesByDate[workoutDayUnix].push(workout);

		}

		return exercisesByDate;
	},
	
	getExerciseNamesList : function(rawData){
		var exercisesNames =[];
		for (var i = 0; i < rawData.length; i++) {
				var workout = rawData[i];
				if(workout.strengthExerciseDefinition){	
					exercisesNames.push( workout.strengthExerciseDefinition.name);
				}		
		}
		return exercisesNames = _.uniq(exercisesNames );
	},
	
	//get exercise name
	getExerciseNames : function(rawData){
		var exercisesNames =[];
		for (var i = 0; i < rawData.length; i++) {
				var workout = rawData[i];
				if(workout.strengthExerciseDefinition){				
						var exerData = {
	        					"exerciseName" : workout.strengthExerciseDefinition.name,
	        					"dateObj":[]
	        			};
						exercisesNames.push(exerData);
				}		
		}
		return exercisesNames = _.uniq(exercisesNames , function(exercises){return exercises.exerciseName});
	},
	
	//get all dates
	getDatesDetails : function(exercisesNames, rawData){		
	
		for (var i = 0; i < rawData.length; i++) {
			var workout = rawData[i];
			if(workout.strengthExerciseDefinition){
				var exerciseDefinition = workout.strengthExerciseDefinition.name;
				for(var k=0; k < exercisesNames.length; k++){						
					if(exerciseDefinition === exercisesNames[k].exerciseName){	
						var workoutDay = moment.unix(workout.unixTime).startOf('day');
						var workoutDayUnix = workoutDay.unix();
						
						var DaysData = {
	        					"day" : workoutDayUnix,
	        					"workoutRecord":[]
	        			};
						exercisesNames[k].dateObj.push(DaysData);
					}
				}				
			}
		}
		
		// remove duplicates		
		for(var i=0; i < exercisesNames.length; i++){	
			exercisesNames[i].dateObj = _.uniq(exercisesNames[i].dateObj, function(dateObj){return dateObj.day});
			exercisesNames[i].dateObj = _.sortBy(exercisesNames[i].dateObj, function(dateObj){return dateObj.day});
			exercisesNames[i].dateObj.reverse();
		}
		
		return exercisesNames;
	},
	
	getCssClassName : function(set){
		if(set.restTime <= 15){
			set.cssClassName = 'green';
		}else if(set.restTime > 15 && set.restTime <= 30){
			set.cssClassName = 'lightgreen';
		}else if(set.restTime > 30 && set.restTime <= 45){
			set.cssClassName = 'lightred';
		}else if(set.restTime > 45 ){
			set.cssClassName = 'red';
		}
		return set;
	},
	
	mapByDate : function(exercisesNames, data){
		for (var i = 0; i < data.length; i++) {
				var workout = data[i];			
				if(workout.strengthExerciseDefinition){
					var exerciseDefinition = workout.strengthExerciseDefinition.name;
					
						for(var k=0; k < exercisesNames.length; k++){						
							if(exerciseDefinition === exercisesNames[k].exerciseName){							
								var workoutDay = moment.unix(workout.unixTime).startOf('day');
								var workoutDayUnix = workoutDay.unix();							
								
								for(var j=0; j<workout.sets.length; j++ ){
									workout.sets[j].averageContractionDuration = (workout.sets[j].averageContractionDuration).toFixed(1)  +"s";
									workout.sets[j].averageExtensionDuration = (workout.sets[j].averageExtensionDuration).toFixed(1) +"s" ;
									workout.sets[j].restTime = moment.duration(workout.sets[j].restDuration).format("HH:mm:ss");
									workout.sets[j] = this.getCssClassName(workout.sets[j])
									
								}
								workout.dateString = workoutDay.format('ddd MMM Do, YYYY');
								
								var dateObject = exercisesNames[k].dateObj;
								
								for(var m=0; m < dateObject.length; m++){
									if(dateObject[m].day === workoutDayUnix){
										dateObject[m].workoutRecord.push(workout)
									}
								}													
							}
						}		
					}
				}
		return exercisesNames;
	},
	
	setExerciseSetCount : function(exercisesNames){
		
		for(var i=0; i<exercisesNames.length; i++ ){
			var exercise = exercisesNames[i];
			
			for(var j=0; j<exercise.dateObj.length; j++){
				var dateOb = exercise.dateObj[j];
				var count=0;
				for(var k=0; k<dateOb.workoutRecord.length; k++){
					var workout = dateOb.workoutRecord[k];
					for(var l=0; l<workout.sets.length; l++ ){
						count++
						workout.sets[l].count =count
					}
				}
			}
		}
		return exercisesNames;
		
	},
	
	organizeWorkoutsByExercise: function (data) {
				
		var exercisesNames = this.getExerciseNames(data);
		
			exercisesNames = this.getDatesDetails(exercisesNames, data);
			
			exercisesNames = this.mapByDate(exercisesNames, data)
			
			return exercisesNames =  this.setExerciseSetCount(exercisesNames);
		
	},

	//takes an ExerciseRecord and returns the workouts that occurred in between two moments
	filterWorkoutsForTimePeriod: function (data, moment1, moment2) {
		var filteredData = data.filter(function (exerciseRecord) {
			var exerciseMoment = moment.unix(exerciseRecord.unixTime);
				exerciseRecord.day = exerciseMoment.format('ddd MMM Do, YYYY');
			return exerciseMoment.isBetween(moment1, moment2);
		})
		//console.log("Filtered data: ");
		//console.dir(filteredData);
		return filteredData;
	},
	
	//takes an ExerciseRecord and returns the workouts that occurred in between two moments
	filterWorkoutsByTime: function (data, moment1, moment2) {
		var filteredData = data.filter(function (exerciseRecord) {
			var exerciseMoment = moment.unix(exerciseRecord.unixTime);				
			return exerciseMoment.isBetween(moment1, moment2);
		});
		return filteredData;
	},
	
	
	getParserDetails : function(users, data){
		
		var mapData =[];		
		var userHistory=[];
		
		for(var i=0; i< data.length; i++){
			var byDate = this.organizeWorkoutsByDate(data[i].data, false);
			userHistory.push(this.parserCSVFormat(byDate));
		}
				
		_.each(users, function(user,i){
			var HistoryData = {
					UserName : user.name,
					User : "User"+parseInt(i+1),	
					dateObj :userHistory[i]
			}
			mapData.push(HistoryData)
		});	
		
		return mapData;
	
	},
	
	parserCSVFormat : function(byDateData){
		var keys = _.keys(byDateData);
		var exerciseByDate=[];
			for(var i=0; i < keys.length; i++){
				var currentDateObj = byDateData[keys[i]];				
				
				for(var k=0; k < currentDateObj.length; k++ ){
					var dateObject = {
							"Date": currentDateObj[k].dateString,
							"Time": currentDateObj[k].timeString,
							"exercise":[]
					}
					
					var exerciseObj = currentDateObj[k];
					
					var exerciseDetails={
							"ExerciseName" : exerciseObj.strengthExerciseDefinition.name,
							"Sets" 			: [],
							"Weight"		: [],
							"Reps"			: [],
							"ContractTime"	: [],
							"ExtendTime"	: [],
							"RestDuration" 	: [],
							"SetDuration" 	: [],
							"TotalWork"		: [],
							"TotalCalories"	: []
					}
					
					for(var j=0; j < exerciseObj.sets.length; j++ ){
						var set = exerciseObj.sets[j];
							exerciseDetails.Sets.push(j+1);
							exerciseDetails.Weight.push(set.weight);
							exerciseDetails.Reps.push(set.reps.length);
							exerciseDetails.ContractTime.push(set.averageContractionDuration);
							exerciseDetails.ExtendTime.push(set.averageExtensionDuration);
							exerciseDetails.RestDuration.push(set.restDuration);
							exerciseDetails.SetDuration.push(set.setDuration);
							exerciseDetails.TotalWork.push((set.totalWork) ? (set.totalWork).toFixed() : "");
							exerciseDetails.TotalCalories.push((set.totalCalories) ? (set.totalCalories).toFixed() : "");
					}
					dateObject.exercise.push(exerciseDetails);
					exerciseByDate.push(dateObject);
				}
					
				
			}
			return exerciseByDate;
				
	},
	
	getWeightLiftedArrayByExercises : function(data){					
		var dataArr=[], workoutList=[]; 
		var exercisesNames = this.getExerciseNamesList(data);
		for(var i=0; i<exercisesNames.length; i++ ){
			dataArr.push(0);			
		}
		
		for(var k=0; k < exercisesNames.length; k++){	
			for (var i = 0; i < data.length; i++) {
				var workout = data[i];			
				if(workout.strengthExerciseDefinition){					 
					if(workout.strengthExerciseDefinition.name === exercisesNames[k]){						
						for (var j = 0; j < workout.sets.length; j++) {
								var set = workout.sets[j];
								dataArr[k] += (set.reps.length * set.weight);
						}
					}
				}
			}
		}	
		
		workoutList.push(exercisesNames);
		workoutList.push(dataArr);		
		return workoutList;	
	},
	
	getLiftTimeArrayByExercises: function (data) {		
		var  dataArr=[];	
		var exercisesNames = this.getExerciseNamesList(data);	
		for(var i=0; i<exercisesNames.length; i++ ){
			dataArr.push(0);		
		}	
		
		for(var k=0; k < exercisesNames.length; k++){	
			for (var i = 0; i < data.length; i++) {
				var workout = data[i];	
				if(workout.strengthExerciseDefinition){	
					if(workout.strengthExerciseDefinition.name === exercisesNames[k]){	
						for (var j = 0; j < workout.sets.length; j++) {
							 var set = workout.sets[j];
							 dataArr[k] += (set.setDuration);
						}
					}
				}
			}		
		}			
	 
		return dataArr;		
	},
	
	
	getRestTimeArrayByExercises: function (data) {	
		var dataArr=[];	
		var exercisesNames = this.getExerciseNamesList(data);	
		for(var i=0; i<exercisesNames.length; i++ ){
			dataArr.push(0);		
		}	
		
		for(var k=0; k < exercisesNames.length; k++){	
			for (var i = 0; i < data.length; i++) {
				var workout = data[i];	
				if(workout.strengthExerciseDefinition){	
					if(workout.strengthExerciseDefinition.name === exercisesNames[k]){	
						for (var j = 0; j < workout.sets.length; j++) {
							var set = workout.sets[j];
							dataArr[k] += (set.restDuration);
						}
					}
				}
			}
		}	
		return dataArr;	
	},
	
	getSelectedExercisesData : function(rawData, exercisesName){
		var exercisesList =[];
		for (var i = 0; i < rawData.length; i++) {
			var workout = rawData[i];
			if(workout.strengthExerciseDefinition){	
				if(workout.strengthExerciseDefinition.name === exercisesName){
					exercisesList.push(workout);
				}
			}
		}
		return exercisesList;
	},
	
	getDatesDetailsTrainingCenter : function(ExerciseRecords){		
		var exercisesByDate ={};
			
		_.each(ExerciseRecords, function(record){
			var workoutDay = moment.unix(record.unixTime).startOf('day');
			var workoutDayUnix = workoutDay.unix();
				if (!exercisesByDate[workoutDayUnix]) {
					exercisesByDate[workoutDayUnix] = [];
				}
				record.dateString = workoutDay.format('ddd MMM Do, YYYY');				
				exercisesByDate[workoutDayUnix].push(record);
			});
	
		return exercisesByDate;
	},
	
	
	getUserObject : function(ExerciseRecords){
		var exercisesByDate ={};
		var keys = _.keys(ExerciseRecords);
		_.each(keys, function(key){					
			var userObject = [];
			var records = ExerciseRecords[key];
				exercisesByDate[key] = [];
				
			var userObject = this.getUserName(records);
				userObject = this.getUserExerciseObject(userObject, records);
				userObject = this.getUserRecordsObject(userObject, records);
				_.each(userObject, function(user){
					exercisesByDate[key].push(user);
				});				
				exercisesByDate[key].dateString = records[0].dateString;
		},this);
		
		return exercisesByDate;	
	},
	
	getUserName : function(records){
		var userObject = [];
		_.each(records, function(record){
			if(record.smartWeightsUser){
				var exerData = {
					"userName" : record.smartWeightsUser.nickname,
					"exercisesNames":[]
				};
				userObject.push(exerData);
			}
		});
		return userObject = _.uniq(userObject , function(record){return record.userName});
	},
	
	
	getUserExerciseObject : function(userObject , ExerciseRecords){
		
		_.each(userObject, function(user){
			var userExerciseObject = [];
			_.each(ExerciseRecords, function(record){							
				if(record.smartWeightsUser && user.userName === record.smartWeightsUser.nickname ){
					var exerData = {
	        				"ExerciseName" : record.strengthExerciseDefinition.name,
	        				"sets":[]
	        			};
					userExerciseObject.push(exerData);
				}
			});
			userExerciseObject = _.uniq(userExerciseObject , function(record){return record.ExerciseName});
			user.exercisesNames = userExerciseObject;
		});
		
		return userObject;
	},
				
	getUserRecordsObject : function(userObject , ExerciseRecords){
		
		_.each(userObject, function(user){
			_.each(user.exercisesNames, function(exerciseObject){	
				var setsRecords = [];				
				_.each(ExerciseRecords, function(record){									
					if(exerciseObject.ExerciseName === record.strengthExerciseDefinition.name){
						_.each(record.sets, function(set){
							exerciseObject.sets.push(set)
						});						
					}												
				});				
			});
		});		
		return userObject;
	},
	
	
	getSelectedTrainingCenterExercise : function(data){
			var userObject = this.getDatesDetailsTrainingCenter(data.strengthExerciseRecords)
				userObject = this.getUserObject(userObject, data.strengthExerciseRecords);	
				
			return userObject;			
			
	},
	//takes input from filterWorkoutsForTimePeriod() and outputs an array representing Total Workout , organized by weekday
	getTotalWorkoutArrayByWeekdays: function (data,dateObj) {		
		var arr=[], dateArr=[];	
		for(var i=0; i <= 6; i++){
			var day = dateObj.add(1,"day").format("Do");			
			arr.push(day);	
			dateArr.push(0);
		}
		for (var i = 0; i < data.length; i++) {
			var workout = data[i];
			var setDayOfWeekNumber = moment.unix(workout.unixTime).format('Do');
			var index = this.getSelectedDate(arr,setDayOfWeekNumber)
			for (var j = 0; j < workout.sets.length; j++) {
				var set = workout.sets[j];
				if(set.totalWork){
					dateArr[index] += (set.totalWork);
				}				
			}
		}
		for(var i=0; i< dateArr.length; i++){
			dateArr[i] = Math.round(dateArr[i]);
		}
		return dateArr;
	},
	
	getTotalCaloriesArrayByWeekdays: function (data,dateObj) {		
		var arr=[], dateArr=[];	
		for(var i=0; i <= 6; i++){
			var day = dateObj.add(1,"day").format("Do");			
			arr.push(day);	
			dateArr.push(0);
		}
		for (var i = 0; i < data.length; i++) {
			var workout = data[i];
			var setDayOfWeekNumber = moment.unix(workout.unixTime).format('Do');
			var index = this.getSelectedDate(arr,setDayOfWeekNumber)
			for (var j = 0; j < workout.sets.length; j++) {
				var set = workout.sets[j];
				if(set.totalCalories){
					dateArr[index] += (set.totalCalories);					
				}				
			}
		}
		for(var i=0; i< dateArr.length; i++){
			dateArr[i] = Math.round(dateArr[i]);
		}		
		return dateArr;
	},
	
	getTotalCaloriesArrayByMonth: function (data, days) {	
		var dates=[], dateArr=[0,0,0,0], weekDays = 7;
		 for(var i=0; i<= 4; i++){
				dates.push(moment().subtract(days -(weekDays * i), 'day').startOf('day'));				
			}
		 for(var m=0; m< dates.length-1; m++){
			 	var result  = this.filterWorkoutsForTimePeriod(data, moment(dates[m]).add(1,"day").startOf("day") , moment(dates[m+1]).endOf('day'));
			 	//console.log( moment(dates[m]).add(1,"day").startOf("day") +"----"+ moment(dates[m+1]).endOf('day'))
			 	for (var i = 0; i < result.length; i++) {
					var workout = result[i];								
						for (var j = 0; j < workout.sets.length; j++) {
							var set = workout.sets[j];
							if(set.totalCalories){
								dateArr[m] += (set.totalCalories);
							}
						}
				}		 
		 }
		for(var i=0; i< dateArr.length; i++){			
			dateArr[i] = Math.round(dateArr[i]);
		}
		return dateArr;		 
	},
	
	getTotalWorkoutArrayByMonth: function (data, days) {	
		var dates=[], dateArr=[0,0,0,0], weekDays = 7;
		 for(var i=0; i<= 4; i++){
				dates.push(moment().subtract(days -(weekDays * i), 'day').startOf('day'));				
			}
		 for(var m=0; m< dates.length-1; m++){
			 	var result  = this.filterWorkoutsForTimePeriod(data, moment(dates[m]).add(1,"day").startOf("day") , moment(dates[m+1]).endOf('day'));
			 	//console.log( moment(dates[m]).add(1,"day").startOf("day") +"----"+ moment(dates[m+1]).endOf('day'))
			 	for (var i = 0; i < result.length; i++) {
					var workout = result[i];								
						for (var j = 0; j < workout.sets.length; j++) {
							var set = workout.sets[j];
							if(set.totalWork){
								dateArr[m] += (set.totalWork);
							}
						}
				}		 
		 }
		for(var i=0; i< dateArr.length; i++){
			dateArr[i] = dateArr[i].toFixed();
		}
		return dateArr;		 
	}
	
	
};
