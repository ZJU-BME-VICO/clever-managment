function ApiEditCtr($scope, resourceService, DEVELOPMENT_API_MAINTAIN_ADD_PARAM_URL, DEVELOPMENT_API_MAINTAIN_CLASSATTRIBUTE_URL, DEVELOPMENT_API_MAINTAIN_CLASSMASTER_ADD_URL, DEVELOPMENT_API_MAINTAIN_CLASSMASTER_URL, DEVELOPMENT_API_MAINTAIN_SAVE_PARAMS_URL, DEVELOPMENT_API_MAINTAIN_SAVE_API_URL, DEVELOPMENT_API_MAINTAIN_SAVE_ROOTURL_URL, DEVELOPMENT_API_DISPLAY_MASTER_URL, DEVELOPMENT_API_REMOVE_BY_VERSIONID_URL, DEVELOPMENT_API_REMOVE_BY_MASTER_URL, DEVELOPMENT_API_MAINTAIN_OVERALL_URL, busyService, $modal) {

	$scope.treeControl = {};
	$scope.tabControl = {};

	$scope.languages = ['zh', 'en'];
	$scope.treeLanguage = 'en';
	$scope.selectLanguage = function(lan) {
		$scope.treeLanguage = lan;
	};

	$scope.changeTab = function(tab) {
		$scope.view_tab = tab;
	};
	// initial data, get api information with first category and firt version of it
	$scope.getApiMasters = function() {
		var bid = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(DEVELOPMENT_API_DISPLAY_MASTER_URL).then(function(list) {
			$scope.masterList = list;
			sortVersionMasters(list);
			if (angular.isArray(list)) {
				$scope.selectedApiMaster = list[0];
				if (angular.isArray(list[0].versionMasters)) {//init selected version master
					$scope.selectedVersionMaster = list[0].versionMasters[0];
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

	$scope.afterChangeApiMaster = function() {
		if ($scope.selectedApiMaster) {
			$scope.selectedVersionMaster = $scope.selectedMaster.versionMasters[0];
			$scope.getApiListById($scope.selectedVersionMaster.id);
		}
	};

	$scope.afterChangeVersionMaster = function() {
		$scope.getApiListById($scope.selectedVersionMaster.id);
	};

}