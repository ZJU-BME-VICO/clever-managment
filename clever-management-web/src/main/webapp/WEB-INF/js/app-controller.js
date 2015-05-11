angular.module('clever.management.controllers.app', []).controller('appCtrl', function($scope, $translate, $window, $timeout, authenticationService, containerService) {

	$scope.isAuthenticated = false;
	$scope.$watch(function() {
		return authenticationService.isAuthenticated();
	}, function(newValue) {
		$scope.isAuthenticated = newValue;
	});

	$scope.selectLanguage = function(key) {
		$translate.use(key);
	};

	$scope.getCurrentLanguage = function() {
		var language = $translate.use();
		if (language == 'zh') {
			return 'LANGUAGE_ZH';
		} else if (language == 'en') {
			return 'LANGUAGE_EN';
		}
	};


	// $scope.containerHeight = $window.innerHeight - 100;
	containerService.setHeight($window.innerHeight - 100);

	angular.element($window).bind('resize', function() {
		// $scope.containerHeight = $window.innerHeight - 100 < 700?700:$window.innerHeight - 100;
		// $scope.containerHeight = $window.innerHeight - 100;
		// $scope.$apply();
		containerService.setHeight($window.innerHeight);
		$scope.containerHeight = containerService.getHeight() - 100; 
	});

});
