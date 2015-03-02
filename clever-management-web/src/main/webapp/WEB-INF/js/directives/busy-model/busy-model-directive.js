angular.module('clever.management.directives.busyModel', []).directive('busyModel', function($window, busyService) {
	return {
		restrict : 'AE',
		transclude : true,
		scope : {
			size : '@',
		},
		templateUrl : 'js/directives/busy-model/busy-model.html',
		controller : function($scope) {
			/*$scope.isBusy = false;*/
			//					$scope.zIndex = -1;
			$scope.$watch(function() {
				return busyService.getBusy();
			}, function(newValue) {
				$scope.isBusy = newValue;
				//						$scope.zIndex = newValue ? 1000 : -1;
			});

			angular.element($window).bind('resize', function() {
				$scope.windowWidth = $window.innerWidth;
				$scope.windowHeight = $window.innerHeight;
				$scope.$apply();
			});

			$scope.$watch(function() {
				return busyService.getBusyHint();
			}, function(newValue) {
				$scope.busyHint = newValue ? newValue : '';
			});
		}
	};
});
