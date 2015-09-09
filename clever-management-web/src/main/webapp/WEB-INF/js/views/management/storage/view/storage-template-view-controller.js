define(['lazyLoader'], function(lazyLoader) {
	lazyLoader.controller('StorageTemplateViewCtrl', function($scope, $timeout, resourceService, busyService, STORAGE_TEMPLATE_LIST_URL, STORAGE_TEMPLATE_MASTER_BY_ID_URL, ARCHETYPE_MASTER_BY_ID_URL, STORAGE_TEMPLATE_BY_ID_URL, ARCHETYPE_BY_ID_URL) {

		$scope.treeControl = {};
		$scope.tabControl = {};
		$scope.tabs = [];
		$scope.isTemplateListHidden = false;
		var cluster = {
			isDirectory : true,
			type : 'cluster',
			name : 'Cluster',
			children : [],
		};
		var composition = {
			isDirectory : true,
			type : 'composition',
			name : 'Composition',
			children : [],
		};
		var element = {
			isDirectory : true,
			type : 'element',
			name : 'Element',
			children : [],
		};
		var action = {
			isDirectory : true,
			type : 'action',
			name : 'Action',
			children : [],
		};
		var evaluation = {
			isDirectory : true,
			type : 'evaluation',
			name : 'Evaluation',
			children : [],
		};
		var observation = {
			isDirectory : true,
			type : 'observation',
			name : 'Observation',
			children : [],
		};
		var instruction = {
			isDirectory : true,
			type : 'instruction',
			name : 'Instruction',
			children : [],
		};
		var admin = {
			isDirectory : true,
			type : 'admin',
			name : 'Admin',
			children : [],
		};
		var entry = {
			isDirectory : true,
			type : 'folder',
			name : 'Entry',
			children : [action, evaluation, observation, instruction, admin],
		};
		var section = {
			isDirectory : true,
			type : 'section',
			name : 'Section',
			children : [],
		};
		var stucture = {
			isDirectory : true,
			type : 'ehr-structure',
			name : 'Stucture',
			children : [],
		};
		var demographic = {
			isDirectory : true,
			type : 'folder',
			name : 'Demographic Model Archetypes',
			children : [],
		};
		var templateList = [{
			isDirectory : true,
			type : 'folder',
			name : 'EHR Archetypes',
			children : [cluster, composition, element, entry, section, stucture],
		}, demographic];
		var templateListMap = {
			cluster : cluster.children,
			composition : composition.children,
			element : composition.children,
			action : action.children,
			evaluation : evaluation.children,
			observation : observation.children,
			instruction : instruction.children,
			admin_entry : admin.children,
			section : section.children,
			stucture : stucture.children,
			demographic : demographic.children,
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
		resourceService.get(STORAGE_TEMPLATE_LIST_URL).then(function(list) {
			angular.forEach(templateListMap, function(value, key) {
				value.length = 0;
			});
			angular.forEach(list, function(template, index) {
				if (template.rmName == 'DEMOGRAPHIC') {
					templateListMap['demographic'].push(template);
				} else {
					var templates = templateListMap[template.rmEntity.toLowerCase()];
					if (template == undefined) {
						console.log('Cannot classify template ' + template.name);
					} else {
						templates.push(template);
					}
				}
			});
			$scope.templateList = [];
			$scope.templateList = templateList;
			// Classify
			busyService.popBusy(busyId);
		});

		$scope.collapse = function() {
			$scope.treeControl.collapseAll();
		};

		$scope.expand = function() {
			$scope.treeControl.expandAll();
		};

		$scope.searchKeyMapper = function(node) {
			return node.conceptName + ' (' + node.latestArchetypeVersion + ')';
		};

		$scope.$watch('templateListFilter', function(newValue) {
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

		$scope.createNewTemplateMasterTab = function(master) {
			if (!master.isDirectory) {
				var tabId = 'template_master_' + master.id;
				if (containsTabId(tabId) < 0) {
					var count = $scope.tabs.push({
						id : tabId,
						type : 'template master',
						title : master.name,
						content : undefined,
					});
					var tab = $scope.tabs[count - 1];
					$timeout(function() {
						$scope.tabControl.selectTabById(tabId);
					}, 0);
					resourceService.get(STORAGE_TEMPLATE_MASTER_BY_ID_URL + master.id).then(function(masterInfo) {
						tab.content = masterInfo;
					});
				} else {
					$scope.tabControl.selectTabById(tabId);
				}
			}
		};

		$scope.createNewTemplateTab = function(template) {
			var tabId = 'template_' + template.id;
			if (containsTabId(tabId) < 0) {
				var count = $scope.tabs.push({
					id : tabId,
					type : 'template',
					title : template.name,
					content : undefined,
				});
				var tab = $scope.tabs[count - 1];
				$timeout(function() {
					$scope.tabControl.selectTabById(tabId);
				}, 0);
				resourceService.get(STORAGE_TEMPLATE_BY_ID_URL + template.id).then(function(templateInfo) {
					templateInfo.rmOriginator = template.rmOriginator;
					templateInfo.rmName = template.rmName;
					templateInfo.rmEntity = template.rmEntity;
					tab.content = templateInfo;
				});
			} else {
				$scope.tabControl.selectTabById(tabId);
			}
		};

		$scope.createNewArchetypeMasterTab = function(master) {
			var tabId = 'archetype_master_' + master.id;
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

	});
});
