function UniversalManagementListCtrl($scope, $state) {
	console.log($scope);
	
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
		//$state.go('')
		if(subMenu.introductionState){
				$state.go(subMenu.introductionState);
		}
	
		
	};

	$scope.$on('$stateChangeSuccess', function(event, toState) {
		if (toState.params) {
			if (toState.params.isHeader) {
				$scope.selectedSubMenu = $scope.menu.subMenus[0];
				$scope.selectSubMenu($scope.selectedSubMenu);
			}
		}
	}); 
	$scope.selectSubMenu($scope.selectedSubMenu);
	
}
