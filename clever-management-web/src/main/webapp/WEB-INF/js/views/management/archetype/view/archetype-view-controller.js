function ArchetypeViewCtrl($scope, $timeout, resourceService, ARCHETYPE_LIST_URL, ARCHETYPE_MASTER_BY_ID_URL, ARCHETYPE_BY_ID_URL) {

	$scope.treeControl = {};
	$scope.tabControl = {};
	$scope.tabs = [];
	$scope.isArchetypeListHidden = false;

	$scope.tabContainerHeight = {
		value : $scope.$parent.containerHeight - 35
	};
	$scope.$watch(function() {
		return $scope.$parent.containerHeight;
	}, function(newValue) {
		$scope.tabContainerHeight.value = newValue - 35;
	});

	resourceService.get(ARCHETYPE_LIST_URL).then(function(list) {
		$scope.archetypeList = list;
		
	});

	$scope.searchKeyMapper = function(node) {
		return node.conceptName + ' (' + node.latestArchetypeVersion + ')';
	};

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

	$scope.createNewMasterTab = function(master) {
		var tabId = 'master_' + master.id;
		if (containsTabId(tabId) < 0) {
			var count = $scope.tabs.push({
				id : tabId,
				type : 'archetype master',
				title : master.name,
				content : undefined,
			});
			var tab = $scope.tabs[count - 1];
			$timeout(function() {
				$scope.tabControl.selectTabById(tabId);
			}, 0);
			resourceService.get(ARCHETYPE_MASTER_BY_ID_URL + master.id).then(function(masterInfo) {
				tab.content = masterInfo;
			});
		} else {
			$scope.tabControl.selectTabById(tabId);
		}
	};

	$scope.createNewArchetypeTab = function(archetype) {
		var tabId = 'archetype_' + archetype.id;
		if (containsTabId(tabId) < 0) {
			var count = $scope.tabs.push({
				id : tabId,
				type : 'archetype',
				title : archetype.name,
				content : undefined,
			});
			var tab = $scope.tabs[count - 1];
			$timeout(function() {
				$scope.tabControl.selectTabById(tabId);
			}, 0);
			resourceService.get(ARCHETYPE_BY_ID_URL + archetype.id).then(function(archetypeInfo) {
				tab.content = archetypeInfo;
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
