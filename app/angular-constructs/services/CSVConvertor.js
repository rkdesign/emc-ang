'use strict';

var CSVConvertor = {
		
		JSONToCSVConvertor : function(JSONData){
			var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;   
			var CSV = '';     
		
			
			CSV = this.generateHeading(arrData[0],CSV);
			CSV += '\r\n';
			CSV += this.generateBodyContent(arrData);
			
			if (CSV == '') {        
				 growl.error("Invalid data");
				 return;
			}   
			var fileName = "DashBoard";
			if(this.msieversion()){
			var IEwindow = window.open();
			IEwindow.document.write('sep=,\r\n' + CSV);
			IEwindow.document.close();
			IEwindow.document.execCommand('SaveAs', true, fileName + ".csv");
			IEwindow.close();
			} else {
			 var uri = 'data:application/csv;charset=utf-8,' + escape(CSV);
			 var link = document.createElement("a");    
			 link.href = uri;
			 //link.style = "visibility:hidden";
			 link.download = fileName + ".csv";
			 document.body.appendChild(link);
			 link.click();
			 document.body.removeChild(link);
			}
		},
		
		msieversion : function(){
			var ua = window.navigator.userAgent; 
			var msie = ua.indexOf("MSIE "); 
			if (msie != -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number 
			{
				return true;
			} else { // If another browser, 
				return false;
			}
				return false; 
		},
		
		generateHeading : function(data,keyName){
			var keys = _.keys(data);
			
			for(var i=0; i< keys.length; i++){
				if(typeof data[keys[i]] === "object"){
						if(_.keys(data[keys[i]][0]).length > 0){
							return this.generateHeading(data[keys[i]][0],keyName);
						}else{
							keyName += keys[i]+',';
						};			
				}else if (typeof data[keys[i]] === "string"){
					keyName += keys[i]+',';
				}
			}
			return keyName;
		},
		
		generateBodyContent : function (arrData){
			
			var rowData="";
			for (var i = 0; i < arrData.length; i++) {			
	            rowData = this.processRow(arrData[i],rowData,rowData);
	        }
			return rowData;
		},
		
		processRow : function(row , rowValue){
			rowValue += this.getUserName(row);
			rowValue = this.getDataObject(row.dateObj,rowValue, row.User);
			rowValue += '\r\n';
			return rowValue;
		},
		
		getUserName : function (userObject){				
			return userObject.UserName+',' + userObject.User+',';	
		},
		
		getDataObject : function(dateObject, rowValue, user){
			
			for(var i=0; i< dateObject.length; i++){
				if(i > 0){
					rowValue += ","+ '"'+ user +'",';
				}
				rowValue += '"' + dateObject[i].Date + '","' +  dateObject[i].Time +'",' ;
				
				rowValue += this.getExerciseList(user,  dateObject[i].Date, dateObject[i].Time, dateObject[i].exercise);
				rowValue += '\r';
			}	
		return rowValue;		
		},
		
		getExerciseList : function(user, dateValue, timeValue, exerciseList){
			var exericise="";
			for(var i=0; i< exerciseList.length; i++){
				if(i > 0){
					exericise += "," + '"'+ user +'","' + dateValue +'","' + timeValue+'",';
				}
				if(exericise){
					exericise +=  '"' + exerciseList[i].ExerciseName+ '",';	
				}else{
					exericise =  '"' + exerciseList[i].ExerciseName+ '",';	
				}
				exericise += this.getExerciseDetails(user, dateValue, timeValue, exerciseList[i].ExerciseName, exerciseList[i]);			
			}
			return exericise;
		},
		
		getExerciseDetails : function (user, dateValue, timeValue, ExerciseName, exerciseData){	
			var exerData="";
			for(var i=0; i< exerciseData.Sets.length; i++){
				if(i > 0){
					exerData += ","+ '"'+ user +'","' + dateValue +'","' + timeValue+'","' + ExerciseName +'",';
				}
				if(exerData){
					exerData += '"' + exerciseData.Sets[i] +'","' + exerciseData.Weight[i] +'","' + exerciseData.Reps[i] +'","' + exerciseData.ContractTime[i] +'","' + exerciseData.ExtendTime[i]+'","'+ exerciseData.RestDuration[i]+'","'+ exerciseData.SetDuration[i]+'","'+ exerciseData.TotalWork[i]+'","'+ exerciseData.TotalCalories[i]+'",';
				}else{
					exerData =  '"' + exerciseData.Sets[i] +'","' + exerciseData.Weight[i] +'","' + exerciseData.Reps[i] +'","' + exerciseData.ContractTime[i] +'","' + exerciseData.ExtendTime[i]+'","'+ exerciseData.RestDuration[i]+'","'+ exerciseData.SetDuration[i]+'","'+ exerciseData.TotalWork[i]+'","'+ exerciseData.TotalCalories[i]+'",';
				}		
				exerData += '\r';			
			}
			return exerData
		}
}