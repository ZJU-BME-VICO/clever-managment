function UniversalManagementListCtrl($scope, $state) {
	
	$scope.containerHeight = {};
	$scope.$watch(function() {
		return $scope.$parent.containerHeight;
	}, function(newValue) {
		$scope.containerHeight = newValue - 65;
	});
	
	$scope.menu = $scope.stateMenuMap[$state.current.name];
	$scope.selectedSubMenu = $scope.menu.subMenus[0];
	
	$scope.selectSubMenu = function(subMenu){
		$scope.selectedSubMenu = subMenu;
	};
	
}
