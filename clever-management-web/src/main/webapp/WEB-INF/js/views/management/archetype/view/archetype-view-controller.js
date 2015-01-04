function ArchetypeViewCtrl($scope, $timeout, resourceService, ARCHETYPE_LIST_URL, ARCHETYPE_MASTER_BY_ID_URL, ARCHETYPE_BY_ID_URL) {

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

	$scope.getFixedTitle = function(title, length) {
		var titleLength = length || 15;
		if (title.length > titleLength) {
			return title.substring(0, titleLength / 2) + '...' + title.substring(title.length - titleLength / 2, title.length);
		}
	};

	$scope.createNewMasterTabById = function(id) {
		var tabId = 'master_' + id;
		if (containsTabId(tabId) < 0) {
			resourceService.get(ARCHETYPE_MASTER_BY_ID_URL + id).then(function(masterInfo) {
				$scope.tabs.push({
					id : 'master_' + masterInfo.id,
					type : 'master',
					title : masterInfo.conceptName,
					content : masterInfo,
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

	$scope.createNewArchetypeTabById = function(id) {
		var tabId = 'archetype_' + id;
		if (containsTabId(tabId) < 0) {
			resourceService.get(ARCHETYPE_BY_ID_URL + id).then(function(archetypeInfo) {
				$scope.tabs.push({
					id : 'archetype_' + archetypeInfo.id,
					type : 'archetype',
					title : archetypeInfo.name,
					content : archetypeInfo,
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
