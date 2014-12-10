angular.module('clever.management.directives.busyModel', []).directive(
		'busyModel', function(busyService) {
			return {
				restrict : 'AE',
				transclude : true,
				scope: {
					size : '@',
					windowHeight : '=',
					windowWidth : '=',
				},
				templateUrl : 'js/directives/busy-model/busy-model.html',
				controller : function($scope) {
					$scope.isBusy = false;
					$scope.$watch(function() {
						return busyService.getBusy();
					}, function(newValue) {
						$scope.isBusy = newValue;
					});
				}
			};
		});