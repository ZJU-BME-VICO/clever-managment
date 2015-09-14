function ManagementCtrl($scope, $state, $timeout) {
	var undefined;
	$scope.containerHeight = {};
	$scope.$watch(function() {
		return $scope.$parent.containerHeight;
	}, function(newValue) {
		$scope.containerHeight = newValue - 55;
	});
}
