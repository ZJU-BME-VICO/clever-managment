function ApiViewCtr($scope, $document, $timeout, resourceService, DEVELOPMENT_API_DISPLAY_VERSIONMASTER_BY_ID_URL, DEVELOPMENT_API_DISPLAY_PARAM_DETAILS_URL, DEVELOPMENT_API_DISPLAY_MASTER_URL, DEVELOPMENT_API_DISPLAY_APIINFOMATION_URL, busyService) {

	$scope.treeControl = {};
	$scope.languages = ['zh', 'en'];
	$scope.treeLanguage = 'zh';
	$scope.selectLanguage = function(lan) {
		$scope.treeLanguage = lan;
	};

	// api tree expand and collapse action
	$scope.stretchState = 'EXPAND_ALL';
	$scope.stretch = function() {
		if ($scope.stretchState == 'EXPAND_ALL') {
			$scope.treeControl.expandAll();
			$scope.stretchState = 'COLLAPSE_ALL';
		} else {
			$scope.treeControl.collapseAll();
			$scope.stretchState = 'EXPAND_ALL';
		}
	};

	// for api tree search
	$scope.searchKeyMapper = function(node) {
		if ($scope.treeLanguage == 'en') {
			return node.name ? node.name : node.rootUrlName;
		} else if ($scope.treeLanguage == 'zh') {
			return node.chineseName;
		}
	};

	// api search function
	$scope.apiListFilter = {
		value : "",
	};
	$scope.$watch("apiListFilter.value", function(newValue, oldValue) {
		if (newValue != undefined) {
			if ($scope.treeControl && $scope.treeControl.search) {
				$scope.treeControl.search(newValue);
			}
		}
	});

	$scope.getApiMasters = function() {
		var bid = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(DEVELOPMENT_API_DISPLAY_MASTER_URL).then(function(list) {
			$scope.list = list;
			sortVersionMasters(list);
			if (angular.isArray(list)) {
				$scope.selectedApiMaster = list[0];
				if (angular.isArray(list[0].versionMasters)) {//init selected version master
					$scope.selectedVersionMaster = list[0].versionMasters[0];
					$scope.getApiListById($scope.selectedVersionMaster.id);
				}
			}
			busyService.popBusy(bid);
		});
	}();

	// sort the version list in master
	function sortVersionMasters(list) {
		angular.forEach(list, function(value) {
			if (value.versionMasters) {
				if (angular.isArray(value.versionMasters)) {
					value.versionMasters.sort(function(a, b) {
						return a.version - b.version;
					});
				};
			};
		});
	};

	// get data from backend with master id and version
	$scope.getApiListById = function(id) {
		var bid = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(DEVELOPMENT_API_DISPLAY_VERSIONMASTER_BY_ID_URL + id).then(function(versionMaster) {
			$scope.versionMaster = versionMaster;
			$scope.stretchState = 'EXPAND_ALL';
			busyService.popBusy(bid);
		});
	};

	// click api node call back,select api
	$scope.selectApi = function(api) {
		// root url name node
		if (api.rootUrlName) {
			$scope.selectedApi = undefined;
		}
		// api node
		if (api.name) {
			$scope.selectedRtParam = undefined;
			$scope.selectedRqParam = undefined;
			$scope.selectedApi = api;
			var bid = busyService.pushBusy("BUSY_LOADING");
			resourceService.get(DEVELOPMENT_API_DISPLAY_APIINFOMATION_URL + $scope.selectedApi.id).then(function(result) {
				$scope.selectedApi = result;
				busyService.popBusy(bid);
			});
		}
	};

	$scope.afterChangeApiMaster = function() {
		if ($scope.selectedApiMaster) {
			$scope.selectedVersionMaster = $scope.selectedMaster.versionMasters[0];
			$scope.getApiListById($scope.selectedVersionMaster.id);
		}
	};
	
	$scope.afterChangeVersionMaster = function() {
		$scope.getApiListById($scope.selectedVersionMaster.id);
	};
	
	$scope.getRqParamDetails = function(param) {
		$scope.selectedRqParam = param;
		resourceService.get(DEVELOPMENT_API_DISPLAY_PARAM_DETAILS_URL + param.type + '/versionid/' + $scope.versionMaster.id).then(function(details) {
			$scope.selectedRqParam.details = details;
		});
	};

	$scope.getRtParamDetails = function(param) {
		$scope.selectedRtParam = param;
		resourceService.get(DEVELOPMENT_API_DISPLAY_PARAM_DETAILS_URL + param.type + '/versionid/' + $scope.versionMaster.id).then(function(details) {
			$scope.selectedRtParam.details = details;
		});

	};

	$scope.isReturnCodeNeeded = function() {
		var params = $scope.selectedApi.returnParams;
		var result;
		if (params) {
			if (angular.isArray(params)) {
				angular.forEach(params, function(param) {
					if (param.name == 'resultCode') {
						result = true;
					}
				});
			} else {
				if (params.name == 'resultCode') {
					result = true;
				}
			}
		} else {
			result = false;
		}

		return result;
	};
}