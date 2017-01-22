'use strict';

var CurrentWorkoutProcessor = {

	monthNames: ['January', 'February', 'March',
		'April', 'May', 'June', 'July', 'August', 'September',
		'October', 'November', 'December'
	],

	weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

	processCurrentWorkoutData: function (data) {

		if (!data) {
			return null;
		}

		var newData = {};

		newData.exercise = data.exerciseLk;
		newData.set = data.set;
		newData.rep = data.rep;
		newData.contractionTime = data.upTime;
		newData.extensionTime = data.downTime;
		newData.weight = data.weight;
		newData.unixTime = data.time;
		newData.timeString = moment.unix(parseInt(data.time)).format("h:mm:ss A");

		if (
			typeof(newData.exercise) !== 'undefined' &&
			typeof(newData.set) !== 'undefined' &&
			typeof(newData.rep) !== 'undefined' &&
			typeof(newData.contractionTime) !== 'undefined' &&
			typeof(newData.extensionTime) !== 'undefined' &&
			typeof(newData.weight) !== 'undefined' &&
			typeof(newData.unixTime) !== 'undefined'
		) {
			return newData;
		} else {
			return null;
		}
	},
};
