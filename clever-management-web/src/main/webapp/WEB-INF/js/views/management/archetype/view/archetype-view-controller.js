function ArchetypeViewCtrl($scope, $timeout, resourceService, ARCHETYPE_LIST_URL, ARCHETYPE_MASTER_BY_ID_URL) {

	$scope.treeControl = {};
	$scope.tabControl = {};
	$scope.tabs = [];
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
		var tabId = 'master_' + node.id;
		if (containsTabId(tabId) < 0) {
			resourceService.get(ARCHETYPE_MASTER_BY_ID_URL + node.id).then(function(master) {
				$scope.tabs.push({
					id : 'master_' + master.id,
					type : 'master',
					title : master.conceptName,
					content : master,
				});
				// Select after compile finished
				$timeout(function() {
					$scope.tabControl.selectTabById(tabId);
				}, 0);
			});
		} else {
			$scope.tabControl.selectTabById(tabId);
		}
	};

	$scope.collapse = function() {
		$scope.treeControl.collapseAll();
	};

	$scope.expand = function() {
		$scope.treeControl.expandAll();
	};

	$scope.select = function(tab) {
		var a;
	};

	$scope.close = function(tab) {
		angular.forEach($scope.tabs, function(value, index) {
			if (value.id == tab.id) {
				// execute outside the callback
				$timeout(function() {
					$scope.tabs.splice(index, 1);
				}, 0);
			}
		});
	};

	function containsTabId(id) {
		var result = -1;
		angular.forEach($scope.tabs, function(value, index) {
			if (value.id == id) {
				result = index;
			}
		});
		return result;
	}

}
