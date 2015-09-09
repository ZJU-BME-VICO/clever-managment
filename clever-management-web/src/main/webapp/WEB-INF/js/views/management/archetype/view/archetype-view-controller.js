function ArchetypeViewCtrl($scope, $timeout, busyService, resourceService, ARCHETYPE_LIST_URL, ARCHETYPE_MASTER_BY_ID_URL, ARCHETYPE_BY_ID_URL) {

	$scope.treeControl = {};
	$scope.tabControl = {};
	$scope.tabs = [];
	$scope.isArchetypeListHidden = false;
	var cluster = {
		isDirectory : true,
		type : 'cluster',
		name : 'Cluster',
		specialisedArchetypeMasters : [],
	};
	var composition = {
		isDirectory : true,
		type : 'composition',
		name : 'Composition',
		specialisedArchetypeMasters : [],
	};
	var element = {
		isDirectory : true,
		type : 'element',
		name : 'Element',
		specialisedArchetypeMasters : [],
	};
	var action = {
		isDirectory : true,
		type : 'action',
		name : 'Action',
		specialisedArchetypeMasters : [],
	};
	var evaluation = {
		isDirectory : true,
		type : 'evaluation',
		name : 'Evaluation',
		specialisedArchetypeMasters : [],
	};
	var observation = {
		isDirectory : true,
		type : 'observation',
		name : 'Observation',
		specialisedArchetypeMasters : [],
	};
	var instruction = {
		isDirectory : true,
		type : 'instruction',
		name : 'Instruction',
		specialisedArchetypeMasters : [],
	};
	var admin = {
		isDirectory : true,
		type : 'admin',
		name : 'Admin',
		specialisedArchetypeMasters : [],
	};
	var entry = {
		isDirectory : true,
		type : 'folder',
		name : 'Entry',
		specialisedArchetypeMasters : [action, evaluation, observation, instruction, admin],
	};
	var section = {
		isDirectory : true,
		type : 'section',
		name : 'Section',
		specialisedArchetypeMasters : [],
	};
	var stucture = {
		isDirectory : true,
		type : 'ehr-structure',
		name : 'Stucture',
		specialisedArchetypeMasters : [],
	};
	var demographic = {
		isDirectory : true,
		type : 'folder',
		name : 'Demographic Model Archetypes',
		specialisedArchetypeMasters : [],
	};
	var archetypeList = [{
		isDirectory : true,
		type : 'folder',
		name : 'EHR Archetypes',
		specialisedArchetypeMasters : [cluster, composition, element, entry, section, stucture],
	}, demographic];
	var archetypeListMap = {
		cluster : cluster.specialisedArchetypeMasters,
		composition : composition.specialisedArchetypeMasters,
		element : composition.specialisedArchetypeMasters,
		action : action.specialisedArchetypeMasters,
		evaluation : evaluation.specialisedArchetypeMasters,
		observation : observation.specialisedArchetypeMasters,
		instruction : instruction.specialisedArchetypeMasters,
		admin_entry : admin.specialisedArchetypeMasters,
		section : section.specialisedArchetypeMasters,
		stucture : stucture.specialisedArchetypeMasters,
		demographic : demographic.specialisedArchetypeMasters,
	};

	$scope.tabContainerHeight = {
		value : $scope.$parent.containerHeight - 35
	};
	$scope.$watch(function() {
		return $scope.$parent.containerHeight;
	}, function(newValue) {
		$scope.tabContainerHeight.value = newValue - 35;
	});

	var busyId = busyService.pushBusy('BUSY_LOADING');
	resourceService.get(ARCHETYPE_LIST_URL).then(function(list) {
		angular.forEach(archetypeListMap, function(value, key) {
			value.length = 0;
		});
		angular.forEach(list, function(master, index) {
			if (master.rmName == 'DEMOGRAPHIC') {
				archetypeListMap['demographic'].push(master);
			} else {
				var masters = archetypeListMap[master.rmEntity.toLowerCase()];
				if (master == undefined) {
					console.log('Cannot classify archetype ' + master.name);
				} else {
					masters.push(master);
				}
			}
		});
		$scope.archetypeList = [];
		$scope.archetypeList = archetypeList;
		// Classify
		busyService.popBusy(busyId);
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
