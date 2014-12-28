angular.module('clever.management.controllers.app', []).controller('appCtrl', function($scope, $translate, $window, $timeout, authenticationService) {

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

	$scope.windowHeight = $window.innerHeight;
	$scope.windowWidth = $window.innerWidth;
	$scope.containerHeight = $scope.windowHeight - 100;

	angular.element($window).bind('resize', function() {
		$scope.windowWidth = $window.innerWidth > 1280 ? $window.innerWidth : 1280;
		$scope.windowHeight = $window.innerHeight > 720 ? $window.innerHeight : 720;
		$scope.containerHeight = $scope.windowHeight - 100;
		$scope.$apply();
	});

});
