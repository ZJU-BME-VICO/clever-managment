function ManagementCtrl($scope) {
	$scope.breadcrumbs = $scope.$state.current.name.split('.');
	$scope.management = 'management';
}