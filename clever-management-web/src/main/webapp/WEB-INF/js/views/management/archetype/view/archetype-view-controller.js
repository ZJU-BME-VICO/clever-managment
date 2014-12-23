function ArchetypeViewCtrl($scope, resourceService, ARCHETYPE_LIST_URL) {
	var list1 = [{
		id : '1',
		name : 'test 1',
		lifecycleState : 'Draft',
		specialiseArchetypeMasters : [{
			id : '1.1',
			name : 'test 1.1',
		lifecycleState : 'Teamreview',
			specialiseArchetypeMasters : [],
		}, {
			id : '1.2',
			name : 'test 1.2',
		lifecycleState : 'Published',
			specialiseArchetypeMasters : [{
				id : '1.2.1',
				name : 'test 1.2.1',
		lifecycleState : 'Draft',
				specialiseArchetypeMasters : [],
			}],
		}],
	}, {
		id : '2',
		name : 'test 2',
		lifecycleState : 'Draft',
		specialiseArchetypeMasters : [{
			id : '2.1',
			name : 'test 2.1',
		lifecycleState : 'Published',
			specialiseArchetypeMasters : [],
		}],
	}];

	var list2 = [{
		id : '1',
		name : 'test 1',
		lifecycleState : 'Draft',
		specialiseArchetypeMasters : [{
			id : '1.1',
			name : 'test 1.1',
		lifecycleState : 'Draft',
			specialiseArchetypeMasters : [],
		}, {
			id : '1.2',
			name : 'test 1.2',
		lifecycleState : 'Draft',
			specialiseArchetypeMasters : [{
				id : '1.2.1',
				name : 'test 1.2.1',
		lifecycleState : 'Draft',
				specialiseArchetypeMasters : [],
			}],
		}],
	}];

	$scope.archetypeList = list1;

	$scope.treeControl = {};

	$scope.selectNode = function(node) {
		var a;
	};

	$scope.collapse = function() {
		$scope.treeControl.collapseAll();
	};

	$scope.expand = function() {
		$scope.treeControl.expandAll();
	};

	$scope.changeTree = function() {
		if ($scope.archetypeList == list1) {
			$scope.archetypeList = list2;
		} else {
			$scope.archetypeList = list1;
		}
	};
	
	$scope.$watch('filter',function(newValue){
		$scope.treeControl.search(newValue);
	});
}
