function ApiViewCtr($scope, $document, $timeout, resourceService,
		DEVELOPMENT_API_DISPLAY_PARAM_DETAILS,
		DEVELOPMENT_API_DISPLAY_MASTER_URL,
		DEVELOPMENT_API_DISPLAY_RETURNPARAMS,
		DEVELOPMENT_API_DISPLAY_APIINFOMATION_URL,
		DEVELOPMENT_API_DISPLAY_REQUESTPARAMS, treeDataFormatService,
		busyService) {

	$scope.treeControl = {};
	$scope.languages = [ 'zh', 'en' ];
	$scope.treeLanguage = 'zh';
	$scope.selectLanguage = function(lan) {
		$scope.treeLanguage = lan;
	};

	$scope.initData = function() {
		var bid = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(DEVELOPMENT_API_DISPLAY_MASTER_URL).then(
				function(list) {
					$scope.list = list;
					formatList(list);
					// console.log(list);
					if (angular.isArray(list)) {
						$scope.selectedCategory = list[0];
						if (angular.isArray(list[0].versionList)) {
							$scope.selectedVersion = list[0].versionList[0];
							$scope.getApiListById($scope.selectedCategory.id,
									$scope.selectedVersion);
						}
					}
					busyService.popBusy(bid);
				});
	}();

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

	// sort the version list in master
	function formatList(list) {
		angular.forEach(list, function(value) {
			if (value.versionList) {
				if (angular.isArray(value.versionList)) {
					value.versionList.sort(function(a, b) {
						return a - b;
					});
				}
				;
			}
			;
		});
	}
	;

	// get data from backend with master id and version
	$scope.getApiListById = function(categoryId, version) {
		var bid = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(
				DEVELOPMENT_API_DISPLAY_MASTER_URL + "/" + categoryId + "/"
						+ version).then(function(apiList) {
			$scope.apiList = apiList;
			console.log(apiList);
			$scope.stretchState = 'EXPAND_ALL';
			busyService.popBusy(bid);
		});
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

	// click api node call back,select api
	$scope.selectApi = function(api) {
		// root url name node
		if (api.rootUrlName) {
			$scope.selectedApi = undefined;
		}
		// api node
		if (api.name) {
			// console.log(api);
			$scope.selectedRtParam = undefined;
			$scope.selectedRqParam = undefined;
			$scope.selectedApi = api;
			var bid = busyService.pushBusy("BUSY_LOADING")
			resourceService.get(
					DEVELOPMENT_API_DISPLAY_APIINFOMATION_URL
							+ $scope.selectedApi.id).then(function(result) {
				$scope.selectedApi = result;
				console.log(result);
				busyService.popBusy(bid);
			})

		}
	};

	$scope.$watch('selectedCategory', function(newValue, oldValue) {
		if (newValue && oldValue) {
			var versionList = $scope.selectedCategory.versionList;
			$scope.selectedVersion = undefined;
			$timeout(function() {
				$scope.selectedVersion = versionList[versionList.length - 1];
			}, 0);
		}
	});
	$scope.$watch('selectedVersion', function(newValue, oldValue) {
		if (newValue) {
			$scope.getApiListById($scope.selectedCategory.id,
					$scope.selectedVersion);
		}
	});
	$scope.getRqParamDetails = function(param) {
		$scope.selectedRqParam = param;
		resourceService.get(DEVELOPMENT_API_DISPLAY_PARAM_DETAILS + param.type)
				.then(function(details) {
					$scope.selectedRqParam.details = details;
				});
	};
	$scope.getRtParamDetails = function(param) {
		// console.log(param);
		$scope.selectedRtParam = param;
		resourceService.get(DEVELOPMENT_API_DISPLAY_PARAM_DETAILS + param.type)
				.then(function(details) {
					$scope.selectedRtParam.details = details;
				});

	};
	$scope.returnCodeNeeded = function() {
		var params = $scope.selectedApi.returnParams;
		var result;
		if (params) {
			if (angular.isArray(params)) {
				angular.forEach(params, function(param) {
					if (param.name == 'resultCode') {
						result = true;
					}
				})
			} else {
				if (params.name == 'resultCode') {
					result = true;
				}
			}
		}else{
			result = false;
		}

		return result;
	}

}