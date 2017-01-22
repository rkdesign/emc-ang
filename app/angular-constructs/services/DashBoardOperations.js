'use strict';

var DashBoardOperations = {
		
		getSelectedUserDashBoardDetailsByWeek : function($scope, processedData){		
			
			//Filter dates by current period and last period
			var dualPeriodData = WorkoutSummaryProcessor.filterWorkoutsForTimePeriod(processedData, moment().subtract(13, 'day').startOf('day'), moment().endOf('day'));
			var currentPeriodData = WorkoutSummaryProcessor.filterWorkoutsForTimePeriod(dualPeriodData, moment().subtract(6, 'day').startOf('day'), moment().endOf('day'));
			var lastPeriodData = WorkoutSummaryProcessor.filterWorkoutsForTimePeriod(dualPeriodData, moment().subtract(13, 'day').startOf('day'), moment().subtract(7, 'day').endOf('day'));
			$scope.currentPeriodData = currentPeriodData;
			$scope.lastPeriodData = lastPeriodData;		

			//Sum the total lift time and weight lifted			
			var currentPeriodTotalWeightLifted = WorkoutSummaryProcessor.getTotalWeightLifted(currentPeriodData);
			var lastPeriodTotalWeightLifted = WorkoutSummaryProcessor.getTotalWeightLifted(lastPeriodData);
			var periodWeightLiftedDelta=0;
			if(lastPeriodTotalWeightLifted !== 0){
				periodWeightLiftedDelta = (currentPeriodTotalWeightLifted / lastPeriodTotalWeightLifted) - 1;
			}
			var periodWeightLiftedDeltaFormatted = Math.round(periodWeightLiftedDelta * 100);
			$scope.currentPeriodTotalWeightLifted = currentPeriodTotalWeightLifted;
			$scope.lastPeriodTotalWeightLifted = lastPeriodTotalWeightLifted;
			$scope.periodWeightLiftedDeltaFormatted = periodWeightLiftedDeltaFormatted;
			
			
			
			//Angular Chart.js
			$scope.periodSeries = ['Last Week', 'This Week'];
			$scope.periodLabels=[]
			for(var i=6; i >= 0; i--){
				$scope.periodLabels.push(moment().subtract(i, 'day').format("ddd").toUpperCase());
			}
			
			$scope.periodLabelsfor2Weeks=[]
			for(var i=13; i >= 0; i--){
				$scope.periodLabelsfor2Weeks.push(moment().subtract(i, 'day').format("MMM DD"));
			}
			
			$scope.periodWeightLiftedData = [
				WorkoutSummaryProcessor.getWeightLiftedArrayByWeekdays(lastPeriodData,moment().subtract(14, 'day').endOf('day')),
				WorkoutSummaryProcessor.getWeightLiftedArrayByWeekdays(currentPeriodData ,moment().subtract(7, 'day').endOf('day'))
			];
					

			var lastPeriodTotalCalories = WorkoutSummaryProcessor.getTotalCaloriesArrayByWeekdays(lastPeriodData, moment().subtract(14, 'day').endOf('day') );
			var currentPeriodTotalCalories = WorkoutSummaryProcessor.getTotalCaloriesArrayByWeekdays(currentPeriodData,moment().subtract(7, 'day').endOf('day'));
			var lastPeriodTotalCaloriesData=0;
			var currentPeriodTotalCaloriesData =0;
			var periodTotalCaloriesDelta = 0;
			$scope.lastPeriodTotalCaloriesData =0;
			$scope.currentPeriodTotalCaloriesData =0;
			
			$scope.periodTotalWorkoutsData = [
 				lastPeriodTotalCalories,
				currentPeriodTotalCalories
			];
			_.each(lastPeriodTotalCalories, function(workout){
				lastPeriodTotalCaloriesData += parseInt(workout);
			});
			
			_.each(currentPeriodTotalCalories, function(workout){
				currentPeriodTotalCaloriesData += parseInt(workout);
			});
			
			$scope.lastPeriodTotalCaloriesData = lastPeriodTotalCaloriesData;
			$scope.currentPeriodTotalCaloriesData = currentPeriodTotalCaloriesData ;
			
			if(lastPeriodTotalCaloriesData > 0){
				periodTotalCaloriesDelta = (currentPeriodTotalCaloriesData / lastPeriodTotalCaloriesData) - 1;
			}
			$scope.periodTotalCaloriesDelta = Math.round(periodTotalCaloriesDelta * 100);
			
			
			
			var lastPeriodTotalWorkouts = WorkoutSummaryProcessor.getTotalWorkoutArrayByWeekdays(lastPeriodData, moment().subtract(14, 'day').endOf('day') );
			var currentPeriodTotalWorkouts = WorkoutSummaryProcessor.getTotalWorkoutArrayByWeekdays(currentPeriodData,moment().subtract(7, 'day').endOf('day'));
			var lastPeriodTotalWorkoutsData=0;
			var currentPeriodTotalWorkoutsData =0;
			var periodTotalWorkoutsDelta = 0;
			$scope.lastPeriodTotalWorkoutsData =0;
			$scope.currentPeriodTotalWorkoutsData =0;
			
			$scope.periodTotalCaloriesData = [
 				lastPeriodTotalWorkouts,
 				currentPeriodTotalWorkouts
 			];
			
			_.each(lastPeriodTotalWorkouts, function(workout){
				lastPeriodTotalWorkoutsData += parseInt(workout);
			});
			
			_.each(currentPeriodTotalWorkouts, function(workout){
				currentPeriodTotalWorkoutsData += parseInt(workout);
			})
			$scope.lastPeriodTotalWorkoutsData = lastPeriodTotalWorkoutsData;
			$scope.currentPeriodTotalWorkoutsData = currentPeriodTotalWorkoutsData ;
			
			if(lastPeriodTotalWorkoutsData > 0){
				periodTotalWorkoutsDelta = (currentPeriodTotalWorkoutsData / lastPeriodTotalWorkoutsData) - 1;
			}
			$scope.periodTotalWorkoutsDelta = Math.round(periodTotalWorkoutsDelta * 100);
			
			
			$scope.weightLiftedDisplayOptions = {
				scaleLabel: function (payload) {
					return payload.value + " lbs";
				}				
			};
			
			$scope.caloriesDisplayOptions ={
				scaleLabel: function (payload) {
					return payload.value + " kcal";
				}	
			}
			$scope.colours =  this.getGraphColors();
			
			//$scope.clickFun = this.getBarDetails(event);
			
			$scope.liftTimeDisplayOptions = {
				scaleLabel: function (payload) {
					var newLabel = moment.duration(parseInt(payload.value), 'ms').format("mm:ss");
					if (newLabel.indexOf(":") < 0) {
						newLabel = "00:" + newLabel;
					}
					return newLabel;
				},
				multiTooltipTemplate : function(payload){
					return moment.duration(parseInt(payload.value), 'ms').format("H[h] mm[m] ss[s]");	
				}	
			};		
		},
		
		
		getBarDetails : function(evt){
			var data = Chart.getBarsAtEvent(evt);
		},
		
		getSelectedUserDashBoardDetailsByMonth : function($scope, data){

			/*data = data.data;
			console.log("Workout data obtained in the controller");
			console.dir(data);*/

			//Get all workouts by user
			//var processedData = WorkoutSummaryProcessor.processWorkoutSummaryData(data);
			var processedData = data;
			var twoMonthDays= 56;
			var currentMonthDays = 28;

			//Filter dates by current period and last period
			var dualPeriodData = WorkoutSummaryProcessor.filterWorkoutsForTimePeriod(processedData, moment().subtract(twoMonthDays, 'day').startOf('day'), moment().endOf('day'));
			var currentPeriodData = WorkoutSummaryProcessor.filterWorkoutsForTimePeriod(dualPeriodData, moment().subtract(currentMonthDays, 'day').startOf('day'), moment().endOf('day'));
			var lastPeriodData = WorkoutSummaryProcessor.filterWorkoutsForTimePeriod(dualPeriodData, moment().subtract(twoMonthDays, 'day').startOf('day'), moment().subtract(currentMonthDays, 'day').endOf('day'));
			$scope.currentPeriodData = currentPeriodData;
			$scope.lastPeriodData = lastPeriodData;		

			//Sum the total lift time and weight lifted			
			var currentPeriodTotalWeightLifted = WorkoutSummaryProcessor.getTotalWeightLifted(currentPeriodData);
			var currentPeriodTotalLiftTime = WorkoutSummaryProcessor.getTotalLiftTime(currentPeriodData);
			var currentPeriodTotalLiftTimeString = moment.duration(currentPeriodTotalLiftTime, 'ms').format("H[h] mm[m] ss[s]");
			
			var lastPeriodTotalWeightLifted = WorkoutSummaryProcessor.getTotalWeightLifted(lastPeriodData);
			var lastPeriodTotalLiftTime = WorkoutSummaryProcessor.getTotalLiftTime(lastPeriodData);
			var lastPeriodTotalLiftTimeString = moment.duration(lastPeriodTotalLiftTime, 'ms').format("H[h] mm[m] ss[s]");

			var periodWeightLiftedDelta=0;
			var periodTotalLiftTimeDelta=0;
			if(lastPeriodTotalWeightLifted !== 0){
				periodWeightLiftedDelta = (currentPeriodTotalWeightLifted / lastPeriodTotalWeightLifted) - 1;
			}			
			if(lastPeriodTotalLiftTime !== 0){
				periodTotalLiftTimeDelta = (currentPeriodTotalLiftTime / lastPeriodTotalLiftTime) - 1;
			}
			var periodWeightLiftedDeltaFormatted = Math.round(periodWeightLiftedDelta * 100);
			var periodTotalLiftTimeDeltaFormatted = Math.round(periodTotalLiftTimeDelta * 100);

			$scope.currentPeriodTotalWeightLifted = currentPeriodTotalWeightLifted;
			$scope.currentPeriodTotalLiftTime = currentPeriodTotalLiftTimeString;
			$scope.lastPeriodTotalWeightLifted = lastPeriodTotalWeightLifted;
			$scope.lastPeriodTotalLiftTime = lastPeriodTotalLiftTimeString;
			$scope.periodTotalLiftTimeDeltaFormatted = periodTotalLiftTimeDeltaFormatted;
			$scope.periodWeightLiftedDeltaFormatted = periodWeightLiftedDeltaFormatted;

			//Angular Chart.js
			$scope.periodSeries = ['Last Month', 'Current Month'];
			$scope.periodLabels=['1st Week', '2nd Week', '3rd Week', '4th Week']
			/*for(var i=6; i >= 0; i--){
				$scope.periodLabels.push(moment().subtract(i, 'day').format("dddd").toUpperCase());
			}*/
			var lastMonthDates =[];
			var currentMonthDates = []
			/* for(var i=0; i<= 4; i++){
				 currentMonthDates.push(moment().subtract(28 -(days * i), 'day'));
			}
			for(var i=0; i< currentMonthDates.length-1; i++){
				$scope.periodLabels.push(moment(dates[i]).add(1,"day").format('ddd MMM Do') +" -- " + moment(dates[i+1]).format(' MMM DD'))
			}
			
				 
			for(var i=0; i<= 4; i++){
				lastMonthDates.push(moment().subtract(56 -(days * i), 'day'));				
			}*/
			
			
			$scope.periodWeightLiftedData = [
				WorkoutSummaryProcessor.getWeightLiftedArrayByMonth(lastPeriodData,twoMonthDays),
				WorkoutSummaryProcessor.getWeightLiftedArrayByMonth(currentPeriodData ,currentMonthDays)
			];
		
			
			var lastPeriodTotalCalories = WorkoutSummaryProcessor.getTotalCaloriesArrayByMonth(lastPeriodData, twoMonthDays );
			var currentPeriodTotalCalories = WorkoutSummaryProcessor.getTotalCaloriesArrayByMonth(currentPeriodData, currentMonthDays);
			var lastPeriodTotalCaloriesData=0;
			var currentPeriodTotalCaloriesData =0;
			var periodTotalCaloriesDelta = 0;
			$scope.lastPeriodTotalCaloriesData =0;
			$scope.currentPeriodTotalCaloriesData =0;
			
			$scope.periodTotalCaloriesData = [
 				lastPeriodTotalCalories,
				currentPeriodTotalCalories
			];
			_.each(lastPeriodTotalCalories, function(workout){
				lastPeriodTotalCaloriesData += parseInt(workout);
			});
			
			_.each(currentPeriodTotalCalories, function(workout){
				currentPeriodTotalCaloriesData += parseInt(workout);
			});
			
			$scope.lastPeriodTotalCaloriesData = lastPeriodTotalCaloriesData;
			$scope.currentPeriodTotalCaloriesData = currentPeriodTotalCaloriesData ;
			
			if(lastPeriodTotalCaloriesData > 0){
				periodTotalCaloriesDelta = (currentPeriodTotalCaloriesData / lastPeriodTotalCaloriesData) - 1;
			}
			$scope.periodTotalCaloriesDelta = Math.round(periodTotalCaloriesDelta * 100);
			
			
		
			var lastPeriodTotalWorkouts = WorkoutSummaryProcessor.getTotalWorkoutArrayByMonth(lastPeriodData, twoMonthDays );
			var currentPeriodTotalWorkouts = WorkoutSummaryProcessor.getTotalWorkoutArrayByMonth(currentPeriodData, currentMonthDays);
			var lastPeriodTotalWorkoutsData=0;
			var currentPeriodTotalWorkoutsData =0;
			var periodTotalWorkoutsDelta = 0;
			$scope.lastPeriodTotalWorkoutsData =0;
			$scope.currentPeriodTotalWorkoutsData =0;
			
			$scope.periodTotalWorkoutsData = [
 				lastPeriodTotalWorkouts,
 				currentPeriodTotalWorkouts
 			];
			
			_.each(lastPeriodTotalWorkouts, function(workout){
				lastPeriodTotalWorkoutsData += parseInt(workout);
			});
			
			_.each(currentPeriodTotalWorkouts, function(workout){
				currentPeriodTotalWorkoutsData += parseInt(workout);
			})
			$scope.lastPeriodTotalWorkoutsData = lastPeriodTotalWorkoutsData;
			$scope.currentPeriodTotalWorkoutsData = currentPeriodTotalWorkoutsData ;
			
			if(lastPeriodTotalWorkoutsData  > 0){
				periodTotalWorkoutsDelta = (currentPeriodTotalWorkoutsData / lastPeriodTotalWorkoutsData) - 1;
			}
			$scope.periodTotalWorkoutsDelta = Math.round(periodTotalWorkoutsDelta * 100);
			
			
			
			
			$scope.weightLiftedDisplayOptions = {
				scaleLabel: function (payload) {
					return payload.value + " lbs";
				}
			};
			
			$scope.caloriesDisplayOptions = {
				scaleLabel: function (payload) {
					return payload.value + " kcal";
				}
			};
			
			$scope.colours =  this.getGraphColors();
			
			$scope.liftTimeDisplayOptions = {
				scaleLabel: function (payload) {
					var newLabel = moment.duration(parseInt(payload.value), 'ms').format("mm:ss");
					if (newLabel.indexOf(":") < 0) {
						newLabel = "00:" + newLabel;
					}
					return newLabel;
				},
				multiTooltipTemplate : function(payload){
					return moment.duration(parseInt(payload.value), 'ms').format("H[h] mm[m] ss[s]");	
				}
			};				
		},
		
		
		getGraphColors : function(){
			var colours=[];
			return colours =  [
			                   { 				
			   					"fillColor": "rgba(51,103,214, 0.3)",
			   			        "strokeColor": "rgba(51,103,214, 0.8)",
			   			        "pointColor": "rgba(51,103,214, 1)",
			   			        "pointStrokeColor": "#fff"	
			   			    },
						     { 				
								"fillColor": "rgba(51,103,214, 0.6)",
						        "strokeColor": "rgba(51,103,214, 1)",
						        "pointColor": "rgba(51,103,214, 1)",
						        "pointStrokeColor": "#fff"	
					        }
					       
					        ]
				},
		
		
		getSelectedUserHistroyDetailsByDate : function($scope, data, days){				
			var dualPeriodData = WorkoutSummaryProcessor.filterWorkoutsForTimePeriod(data, moment().subtract(days, 'day').startOf('day'), moment().endOf('day'));
			
			var dateOrganizedData = WorkoutSummaryProcessor.organizeWorkoutsByDate(dualPeriodData, true);
			var dateKeys = Object.keys(dateOrganizedData);
			dateKeys.sort();
			dateKeys.reverse();
			$scope.dateOrganizedData = dateOrganizedData;
			$scope.dateKeys = dateKeys;
			//console.dir(dateOrganizedData);
		},
		
		getSelectedUserHistroyDetailsByExercise : function($scope, data, days){					
			var dualPeriodData = WorkoutSummaryProcessor.filterWorkoutsForTimePeriod(data, moment().subtract(days, 'day').startOf('day'), moment().endOf('day'));
			var dateOrganizedData = WorkoutSummaryProcessor.organizeWorkoutsByExercise(dualPeriodData);						
			$scope.dateOrganizedData = dateOrganizedData;			
		},
		
		
		
		getSelectedUserLiveWorksDetails : function($scope, userID, URLS, $http, SessionService){
			
			var idRegex = new RegExp("\\[USERID\\]", "ig");
			var url = (URLS.SITE_URL + URLS.LIVE)
			.replace(idRegex, encodeURIComponent(userID));
			
			$http.get((url), {
				withCredentials: true,
				cache: false,							
				headers: {'Authorization': SessionService.getID()}
			}).success(function (data) {
				//data = {"exerciseInProgress":{"id":"560ac30a0476266c264a16a6","exerciseDefinitionId":"55e7f3002580d0350a753b4a","smartWeightsUserId":"55ee01ad2580d0350a753bbf","sets":[{"sequence":0,"weight":null,"id":"560ac3140476266c264a16a7","exerciseInProgressId":"560ac30a0476266c264a16a6","reps":[]},{"sequence":1,"weight":20,"id":"560ac3150476266c264a16a8","exerciseInProgressId":"560ac30a0476266c264a16a6","reps":[{"extensionDuration":629,"contractionDuration":590,"sequence":1,"id":"560ac3150476266c264a16a9","setId":"560ac3150476266c264a16a8"}]},{"sequence":2,"weight":20,"id":"560ac3220476266c264a16aa","exerciseInProgressId":"560ac30a0476266c264a16a6","reps":[{"extensionDuration":771,"contractionDuration":435,"sequence":1,"id":"560ac3220476266c264a16ab","setId":"560ac3220476266c264a16aa"}]}],"exerciseDefinition":{"name":"Bicep Curl","description":"Bicep Curl","id":"55e7f3002580d0350a753b4a"}}};
				if (!data || data == "null") {
					$scope.liveWorkoutData=[];
					return false;
				}
				
	
				if ($scope.liveWorkoutData && $scope.liveWorkoutData.sets && $scope.liveWorkoutData.sets.length &&
					$scope.liveWorkoutData.sets.length === data.sets.length &&
					$scope.liveWorkoutData.sets[$scope.liveWorkoutData.sets.length - 1].reps.length === data.sets[data.sets.length - 1].reps.length) {
					//data unchanged
					//console.log("data unchanged");
					return false;
				}
			
				//place all reps into a single array for easy table creation...
				var repArray = [];			
				for (var i = data.sets.length-1; i >= 0; i--) {
					var set = data.sets[i];
					if(set.reps.length === 0) {
				    	data.sets.splice(i,1);				       
				    }
				}
												
				for (var i = 0; i < data.sets.length; i++) {
					var set = data.sets[i];
					
					//console.log("processing set " + set.sequence);
					for (var s = 0; s < set.reps.length; s++) {
						var rep = set.reps[s];
						//console.log("processing rep " + rep.sequence);
						rep.set = i+1;
						rep.rep = s+1;
						rep.weight = set.weight;
						rep.extensionDuration = (rep.extensionDuration).toFixed(1) +"s";
						rep.contractionDuration = (rep.contractionDuration).toFixed(1) +"s";
						repArray.push(rep);
					}
				}
				//console.dir(repArray);

				$scope.repArray = repArray;
				$scope.liveWorkoutData = data;

			});
		
			
		},
		
		adminExercisesInProcess : function(data){
			var graphData =[];
			
			for(var i=0; i<data.length; i++ ){			
				
				var barChartData = {
			  		labels : this.getLabels(data[i]),
			  		datasets : [
			  			{
			  				"fillColor": "rgba(51,103,214, 0.3)",
		   			        "strokeColor": "rgba(51,103,214, 0.8)",
		   			        "pointColor": "rgba(51,103,214, 1)",
		   			        "pointStrokeColor": "#fff",
			  				data : this.getChartData(data[i])
			  			}
			  		]
			  	};
				barChartData.ExerciseName = data[i].strengthExerciseDefinition.name
				graphData.push(barChartData);			
			}
			return graphData;
		},
		
				
		getLabels : function(data){
			var sets=[];			 
			_.each(data.sets, function(set, index){
				if(set.reps.length > 0){
					sets.push(set.weight + " lbs") ;
				}
			});			
			return sets;
		},
		
		getChartData : function(data){
			var chartData=[];
			_.each(data.sets, function(set){
				chartData.push(set.reps.length);				
			});			
			return chartData;		
		}
		
		
		
}