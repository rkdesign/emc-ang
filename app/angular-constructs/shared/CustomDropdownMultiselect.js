'use strict';

var angular = angular;

angular.module('CustomDropdownMultiselect', [])
.directive('dropdownMultiselect',  function(){
		return {
	       restrict: 'E',
	       scope:{           
	            model: '=',
	            options: '=',
	            pre_selected: '=preSelected',
	            extraSettings  :'='	
	       },
	       templateUrl :"angular-constructs/shared/directiveTemplates/multiSelectDropDown.html",     
	       controller: function($scope){
	           
	           $scope.openDropdown = function(){                    
	        	   if(!this.open){ 	        		  
	        		   return false;	
	        	   } else{
	        		   $scope.model=$scope.pre_selected;
	        	   }	        	   
	        	                                     
	            };
	           
	            $scope.settings = {
					enableEntervalue:false
	            }
	            
	            angular.extend($scope.settings, $scope.extraSettings || []);
	            
	            $scope.onBlur = function($event) {
					var userlist = $event.target.value.split(",");
					if(userlist.length < 0 ) return false;
				
					for(var i = 0; i< userlist.length; i++){
						if(userlist[i] !== ""){
							$scope.model.push(parseInt(userlist[i]));
						}
	        		}	
					$scope.model = _.uniq($scope.model);
				};				
	            
	            $scope.selectAll = function () {
	                $scope.model = $scope.options;
	            };            
	            $scope.deselectAll = function() {
	                $scope.model=[];
	            };
	            $scope.setSelectedItem = function(){
	                var model = this.option;
	                if (_.contains($scope.model, model)) {
	                    $scope.model = _.without($scope.model, model);
	                } else {
	                    $scope.model.push(model);
	                }                
	                return false;
	            };
	            $scope.isChecked = function (model) {     
	            	if($scope.model && model && $scope.model.length > 0  && model.id){
		            	_.each($scope.model, function(sModel,i){
		            		if(sModel.id === model.id){
		            			$scope.model[i]= model;
		            		}
		            	})
	            	}
	            	
	                if (_.contains($scope.model, model)) {
	                    return 'glyphicon glyphicon-ok pull-right';
	                }
	                return false;
	            	
	                
	            };                                 
	       }
	   } 
});