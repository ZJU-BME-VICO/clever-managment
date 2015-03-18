define(['lazyLoader'], function(lazyLoader) {
	lazyLoader.controller('StorageTemplateViewCtrl', function($scope, $timeout, resourceService, STORAGE_TEMPLATE_LIST_URL, STORAGE_TEMPLATE_MASTER_BY_ID_URL) {

		$scope.treeControl = {};
		$scope.tabControl = {};
		$scope.tabs = [];
		$scope.isTemplateListHidden = false;

		resourceService.get(STORAGE_TEMPLATE_LIST_URL).then(function(list) {
			$scope.templateList = list;
		});

		$scope.collapse = function() {
			$scope.treeControl.collapseAll();
		};

		$scope.expand = function() {
			$scope.treeControl.expandAll();
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

		$scope.createNewMasterTab = function(master) {
			var tabId = 'master_' + master.id;
			if (containsTabId(tabId) < 0) {
				var count = $scope.tabs.push({
					id : tabId,
					type : 'master',
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
