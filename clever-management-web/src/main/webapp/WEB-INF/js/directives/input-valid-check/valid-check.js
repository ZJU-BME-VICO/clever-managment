angular.module('clever.management.directives.validCheck', []).directive('validCheck', function($timeout, ngPopover, toaster) {

	return {
		restrict : 'A',
		require : 'ngModel',
		scope : {

		},
	//	template : '<script type="text/ng-template" id="unvalidAlert">' + '<alert  type="danger"  style="margin-bottom:0"><span class="glyphicon glyphicon-exclamation-sign"></span>&nbsp;{{alert.msg}}</alert>' + '</script>',
		link : function($scope, element, attr, ngModelCtrl) {
		   $scope.element = element[0];
		   $scope.$watch("element.value", function(newValue){
		   	  if(newValue && newValue.indexOf('"') != -1){
		   	  	  toaster.pop('error', "Input error", "The input should not contains quato character!");
		   	  }
		   });
		}
			
	};
});

