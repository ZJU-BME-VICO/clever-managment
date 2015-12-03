function ApiEditCtr($scope, resourceService, DEVELOPMENT_API_DISPLAY_MASTER_URL, DEVELOPMENT_API_MAINTAIN_SINGLE_URL, DEVELOPMENT_API_REMOVE_BY_VERSIONID_URL, DEVELOPMENT_API_REMOVE_BY_MASTER_URL, DEVELOPMENT_API_MAINTAIN_OVERALL_URL, busyService, $modal) {

	$scope.initData = function() {
		resourceService.get(DEVELOPMENT_API_DISPLAY_MASTER_URL).then(function(list) {
			$scope.list = list;
			console.log(list);
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
		return node.apiName? node.apiName : node.rootUrlName;
	};

	$scope.selectApi = function(api) {
		var bid = busyService.pushBusy('BUSY_LOADING');
		console.log(api);
		// template.lifecycleState = true;
		if (api.rootUrlName) {
			$scope.selectedApi = undefined;
		}
		if (api.apiName) {
			$scope.selectedApi = api;
		}
		busyService.popBusy(bid);
	};

	$scope.saveApiInfo = function() {
		resourceService.post(DEVELOPMENT_API_MAINTAIN_SINGLE_URL, {
			id : $scope.selectedApi.id,
			requestParams : $scope.selectedApi.requestParams,
			returnParams : $scope.selectedApi.returnParams,
			description : $scope.selectedApi.description,
		}).then(function(result) {
			console.log(result);
		});
	};
	$scope.deleteApiCategroy = function() {
		resourceService.get(DEVELOPMENT_API_REMOVE_BY_MASTER_URL + $scope.selectedCategory.id).then(function(result) {
			console.log(result);
		});
	};
	$scope.deleteApiVersion = function() {
		resourceService.get(DEVELOPMENT_API_REMOVE_BY_VERSIONID_URL + $scope.selectedCategory.id + '/' + $scope.selectedVersion).then(function(result) {
			console.log(result);
		});
	};

	$scope.maintainOverallApi = function(masterName, url) {
		var bid = busyService.pushBusy('BUSY_LOADING');
		resourceService.post(DEVELOPMENT_API_MAINTAIN_OVERALL_URL, {
			masterName : masterName,
			url : url,
		}).then(function(result) {
			busyService.popBusy(bid);
			console.log(result);
		});

	};

	$scope.openMaintainModel = function(size) {
		var modalInstance = $modal.open({
			animation : true, // animations on
			templateUrl : 'maintainModel.html',
			controller : function MaintainModelCtrl($scope, $modalInstance) {
				$scope.inputMasterName = '';
				$scope.inputUrl = '';
				console.log($scope.inputMasterName);
				$scope.ok = function() {
					$modalInstance.close({
						masterName : $scope.inputMasterName,
						url : $scope.inputUrl,
					});
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			},
			size : size,
			resolve : {}
		});
		modalInstance.result.then(function(message) {// modal message back
			$scope.maintainOverallApi(message.masterName, message.url);
		});
	};

	// $scope.maintainOverallApi();

}