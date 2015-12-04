function ArchetypeViewCtrl($scope, $timeout, busyService, resourceService, treeDataFormatService, ARCHETYPE_LIST_URL, ARCHETYPE_MASTER_BY_ID_URL, ARCHETYPE_BY_ID_URL) {

	$scope.treeControl = {};
	$scope.tabControl = {};
	$scope.tabs = [];
	$scope.isArchetypeListHidden = false;

	$scope.tabContainerHeight = {
		value : $scope.$parent.containerHeight - 40
	};
	$scope.$watch(function() {
		return $scope.$parent.containerHeight;
	}, function(newValue) {
		$scope.tabContainerHeight.value = newValue - 40;
	});

	var busyId = busyService.pushBusy('BUSY_LOADING');
	resourceService.get(ARCHETYPE_LIST_URL).then(function(list) {
		$scope.formatedObject = treeDataFormatService.formatTreeData(list, 'specialisedArchetypeMasters');
		$scope.archetypeList = [];
		$scope.archetypeList = $scope.formatedObject.formatedList;
		// Classify
		busyService.popBusy(busyId);
	});

	$scope.searchKeyMapper = function(node) {
		if (node.isDirectory) {
			return node.name;
		} else {
			return node.conceptName + ' (' + node.latestArchetypeVersion + ')';
		}
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
		if (!master.isDirectory) {
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
				var busy = busyService.pushBusy('BUSY_LOADING');
				resourceService.get(ARCHETYPE_MASTER_BY_ID_URL + master.id).then(function(masterInfo) {
					tab.content = masterInfo;
					busyService.popBusy(busy);
				});
			} else {
				$scope.tabControl.selectTabById(tabId);
			}
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
			var busy = busyService.pushBusy('BUSY_LOADING');
			resourceService.get(ARCHETYPE_BY_ID_URL + archetype.id).then(function(archetypeInfo) {
				tab.content = archetypeInfo;
				busyService.popBusy(busy);
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
