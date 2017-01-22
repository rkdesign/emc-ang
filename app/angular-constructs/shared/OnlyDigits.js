'use strict';

var angular = angular;

angular.module('numberValidation',[])
.directive('onlyDigits', function () {

  return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, element, attrs, modelCtrl) {
          modelCtrl.$parsers.push(function (inputValue) {
              if (inputValue == undefined) return '';
              var transformedInput = inputValue.replace(/[^0-9]/g, '');
              if (transformedInput !== inputValue) {
                  modelCtrl.$setViewValue(transformedInput);
                  modelCtrl.$render();
              }
              return transformedInput;
          });
      }
  };
});