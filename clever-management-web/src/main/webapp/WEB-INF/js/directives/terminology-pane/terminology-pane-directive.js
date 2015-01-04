angular.module('clever.management.directives.terminologyPane', []).directive('terminologyPane', [
function() {
	return {
		restrict : 'E',
		scope : {
			terminology : '=',
		},
		templateUrl : 'js/directives/terminology-pane/terminology-pane.html',
		replace : true,	
		controller : function($scope, $element, $attrs){
			$scope.isTermCollapsed = false;
			$scope.isConstraintCollapsed = false;
		},
	};
}]);