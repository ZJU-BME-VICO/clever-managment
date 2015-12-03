function ApiViewCtr($scope, $document, resourceService, DEVELOPMENT_API_DISPLAY_MASTER_URL, treeDataFormatService, busyService) {

	$scope.treeControl = {};
	$scope.initData = function() {
		resourceService.get(DEVELOPMENT_API_DISPLAY_MASTER_URL).then(function(list) {
			$scope.list = list;
			formatList(list);
			console.log(list);
			if (angular.isArray(list)) {
				$scope.selectedCategory = list[0];
				if (angular.isArray(list[0].apiVersionList)) {
					$scope.selectedVersion = list[0].apiVersionList[0];
					$scope.getApiListById($scope.selectedCategory.id, $scope.selectedVersion);
				}
			}

		});
	};
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
		//var string = angular.element( $document.querySelector('url')).value;
      
      return $scope.selectApi.apiUrl;
	};

	$scope.getFixType = function(type) {
		return type.slice(type.indexOf(":") + 1, type.length);
	};
	function formatList(list) {
		angular.forEach(list, function(value) {
			if (value.apiVersionList) {
				if (angular.isArray(value.apiVersionList)) {
					value.apiVersionList.sort(function(a, b) {
						return a - b;
					});
				};
			};
		});
	};

	$scope.initData();

	$scope.getApiListById = function(category, version) {
		var bid = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(DEVELOPMENT_API_DISPLAY_MASTER_URL + "/" + category + "/" + version).then(function(apiList) {
			$scope.apiList = apiList;
			console.log(apiList);
		});
		busyService.popBusy(bid);
	};

	$scope.searchKeyMapper = function(node) {
		return node.apiName ? node.apiName : node.rootUrlName;
	};

	$scope.$watch("apiListFilter", function(newValue) {
		$scope.treeControl.search(newValue);
	});
	$scope.selectApi = function(api) {
		if (api.rootUrlName) {
			$scope.selectedApi = undefined;
		}
		if (api.apiName) {
			$scope.selectedApi = api;
		}
	};

}