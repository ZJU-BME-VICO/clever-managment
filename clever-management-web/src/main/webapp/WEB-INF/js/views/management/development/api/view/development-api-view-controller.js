function ApiViewCtr($scope, $document, resourceService, DEVELOPMENT_API_DISPLAY_PARAM_DETAILS, DEVELOPMENT_API_DISPLAY_MASTER_URL, DEVELOPMENT_API_DISPLAY_RETURNPARAMS, DEVELOPMENT_API_DISPLAY_REQUESTPARAMS, treeDataFormatService, busyService) {

	$scope.treeControl = {};
	$scope.languages = ['zh', 'en'];
	$scope.treeLanguage = 'en';
	$scope.selectLanguage = function(lan) {
		$scope.treeLanguage = lan;
	};

	$scope.initData = function() {
		var bid = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(DEVELOPMENT_API_DISPLAY_MASTER_URL).then(function(list) {
			$scope.list = list;
			formatList(list);
			console.log(list);
			if (angular.isArray(list)) {
				$scope.selectedCategory = list[0];
				if (angular.isArray(list[0].versionList)) {
					$scope.selectedVersion = list[0].versionList[0];
					$scope.getApiListById($scope.selectedCategory.id, $scope.selectedVersion);
				}
			}
			busyService.popBusy(bid);
		});
	}();

	//api tree expand and collapse action
	$scope.stretchState = 'EXPAND_ALL';
	$scope.stretch = function() {
		//$scope.stretchState = ($scope.stretchState == 'EXPAND_ALL') ? 'COLLAPSE_ALL' : 'EXPAND_ALL';
		if ($scope.stretchState == 'EXPAND_ALL') {
			$scope.treeControl.expandAll();
			$scope.stretchState = 'COLLAPSE_ALL';
		} else {
			$scope.treeControl.collapseAll();
			$scope.stretchState = 'EXPAND_ALL';
		}
	};

	$scope.copyUrl = function() {
		return $scope.selectApi.url;
	};

	// auxiliary operate function, should be optimize
	var baseTypeList = ['string', 'int', 'dateTime'];
	$scope.getFixClass = function(type) {
		var temp = type.slice(type.indexOf(":") + 1, type.length);
		if (baseTypeList.indexOf(temp) != -1) {
			return temp;
		} else {
			return 'others';
		};
	};
	$scope.getFixTypeName = function(type) {
		return type.slice(type.indexOf(":") + 1, type.length);
	};

	//sort the version list in master
	function formatList(list) {
		angular.forEach(list, function(value) {
			if (value.versionList) {
				if (angular.isArray(value.versionList)) {
					value.versionList.sort(function(a, b) {
						return a - b;
					});
				};
			};
		});
	};

	//get data from backend with master id and version
	$scope.getApiListById = function(categoryId, version) {
		var bid = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(DEVELOPMENT_API_DISPLAY_MASTER_URL + "/" + categoryId + "/" + version).then(function(apiList) {
			$scope.apiList = apiList;
			$scope.stretchState = 'EXPAND_ALL';
			busyService.popBusy(bid);
		});

	};

	//for api tree search
	$scope.searchKeyMapper = function(node) {
		if ($scope.treeLanguage == 'en') {
			return node.name ? node.name : node.rootUrlName;
		} else if ($scope.treeLanguage == 'zh') {
			return node.chineseName;
		}
	};
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

	//click api node call back,select api, and jump the tab to base tab
	$scope.selectApi = function(api) {
		if (api.rootUrlName) {
			$scope.selectedApi = undefined;
		}
		if (api.name) {
			console.log(api);
			$scope.selectedRtParam = undefined; 
			$scope.selectedRqParam = undefined;
			$scope.selectedApi = api;
			var rqbid = busyService.pushBusy("BUSY_LOADING");
			resourceService.get(DEVELOPMENT_API_DISPLAY_REQUESTPARAMS + $scope.selectedApi.id).then(function(list) {
				$scope.selectedApi.requestParams = list;
				busyService.popBusy(rqbid);
			});
			var rtbid = busyService.pushBusy("BUSY_LOADING");
			resourceService.get(DEVELOPMENT_API_DISPLAY_RETURNPARAMS + $scope.selectedApi.id).then(function(list) {
				$scope.selectedApi.returnParams = list;
				busyService.popBusy(rtbid);

			});

		}
	};

	//when change the api master(category), select the latest version by default
	$scope.$watch('selectedCategory', function(newValue, oldValue) {
		if (newValue && oldValue) {
			var versionList = $scope.selectedCategory.versionList;
			$scope.selectedVersion = versionList[versionList.length - 1];
		}
	});
	$scope.$watch('selectedVersion', function(newValue, oldValue) {
		if (newValue && oldValue) {
			$scope.getApiListById($scope.selectedCategory.id, $scope.selectedVersion);
		}
	});

	$scope.getRqParamDetails = function(param) {
		//console.log(param);
		$scope.selectedRqParam = param;

		resourceService.get(DEVELOPMENT_API_DISPLAY_PARAM_DETAILS + param.id).then(function(details) {
			$scope.selectedRqParam.details = details;
		});
	};
	$scope.getRtParamDetails = function(param) {
		$scope.selectedRtParam = param;

		resourceService.get(DEVELOPMENT_API_DISPLAY_PARAM_DETAILS + param.id).then(function(details) {
			$scope.selectedRtParam.details = details;
		});

	};

//	$scope.getParamDetails = function(param) {}

}