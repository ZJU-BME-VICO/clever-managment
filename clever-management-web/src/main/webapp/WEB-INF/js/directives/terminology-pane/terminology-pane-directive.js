angular.module('clever.management.directives.terminologyPane', []).directive('terminologyPane', function(containerService) {
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
		link : function(scope, element, attrs) {
			scope.maxHeight = containerService.getHeight() - 280;
            scope.$watch(function() {
                return containerService.getHeight()
            }, function(newValue) {
                scope.maxHeight = newValue - 280 < 180 ? 180 : newValue - 280;
            });
			// scope.maxHeight = angular.isDefined(attrs.maxHeight) ? scope.$parent.$eval(attrs.maxHeight) : undefined;
		}
	};
});