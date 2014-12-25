function ArchetypeViewCtrl($scope, resourceService, ARCHETYPE_LIST_URL) {

	$scope.treeControl = {};
	$scope.isArchetypeListHidder = false;

	resourceService.get(ARCHETYPE_LIST_URL).then(function(list) {
		$scope.archetypeList = list;
	});

	$scope.$watch('archetypeListFilter', function(newValue) {
		if (newValue != undefined) {
			$scope.treeControl.search(newValue);
		}
	});

	$scope.selectNode = function(node) {
		var a;
	};

	$scope.collapse = function() {
		$scope.treeControl.collapseAll();
	};

	$scope.expand = function() {
		$scope.treeControl.expandAll();
	};

}
