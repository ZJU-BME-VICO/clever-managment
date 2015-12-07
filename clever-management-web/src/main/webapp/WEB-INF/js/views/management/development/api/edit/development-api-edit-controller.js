function ApiEditCtr($scope, resourceService, DEVELOPMENT_API_MAINTAIN_SAVE_PARAMS, DEVELOPMENT_API_MAINTAIN_SAVE_API, DEVELOPMENT_API_MAINTAIN_SAVE_ROOTURL, DEVELOPMENT_API_DISPLAY_MASTER_URL, DEVELOPMENT_API_MAINTAIN_SINGLE_URL, DEVELOPMENT_API_REMOVE_BY_VERSIONID_URL, DEVELOPMENT_API_REMOVE_BY_MASTER_URL, DEVELOPMENT_API_MAINTAIN_OVERALL_URL, busyService, $modal) {

	$scope.treeControl = {};
	$scope.tabControl = {};

	$scope.languages = ['zh', 'en'];
	$scope.treeLanguage = 'en';
	$scope.selectLanguage = function(lan) {
		$scope.treeLanguage = lan;
	};
	$scope.initData = function() {
		var bid = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(DEVELOPMENT_API_DISPLAY_MASTER_URL).then(function(list) {
			$scope.masterList = list;
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

	$scope.getApiListById = function(categoryId, version) {
		var bid = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(DEVELOPMENT_API_DISPLAY_MASTER_URL + "/" + categoryId + "/" + version).then(function(master) {
			$scope.versionMaster = master;
			$scope.stretchState = 'EXPAND_ALL';
			console.log(master);
			busyService.popBusy(bid);
		});

	};

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

	$scope.baseTabId = 'baseTabId';
	$scope.selectApi = function(api) {
		if (api.rootUrlName) {
			$scope.selectedApi = undefined;
		}
		if (api.name) {
			$scope.selectedApi = api;
			$scope.tabControl.selectTabById('baseTabId');
		}
	};

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

	$scope.saveRootUrl = function() {
		var tempList = [];
		angular.forEach($scope.versionMaster.rootUrlMasters, function(master) {
			tempList.push({
				id : master.id,
				chineseName : master.chineseName,
			});
		});
		resourceService.post(DEVELOPMENT_API_MAINTAIN_SAVE_ROOTURL, {
			id : $scope.versionMaster.id,
			rootUrlMasters : tempList,
		}).then(function(result) {
			console.log(result);
		});
	};

	$scope.saveApiBaseInfo = function() {

		resourceService.post(DEVELOPMENT_API_MAINTAIN_SAVE_API, {
			id : $scope.selectedApi.id,
			chineseName : $scope.selectedApi.chineseName,
			description : $scope.selectedApi.description,
			chineseDescription : $scope.selectedApi.chineseDescription,

		}).then(function(result) {
			console.log(result);
		});
	};
	$scope.saveParamInfo = function() {
		resourceService.post(DEVELOPMENT_API_MAINTAIN_SAVE_PARAMS, {
			id : $scope.selectedApi.id,
			requestParams : $scope.selectedApi.requestParams,
			returnParams : $scope.selectedApi.returnParams,
		}).then(function(result) {
			cosole.log(result);
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

	$scope.deleteByVersion = function(masterId, version) {
		resourceService.get(DEVELOPMENT_API_REMOVE_BY_VERSIONID_URL + masterId + '/' + version).then(function(result) {
			console.log(result);
		});
	};
	$scope.deleteByMasterId = function(masterId) {
		resourceService.get(DEVELOPMENT_API_REMOVE_BY_MASTER_URL +masterId).then(function(result) {
			console.log(result);
		});
	};
	$scope.maintainOverallApi = function(masterName, url, version) {
		var bid = busyService.pushBusy('BUSY_LOADING');
		resourceService.post(DEVELOPMENT_API_MAINTAIN_OVERALL_URL, {
			masterName : masterName,
			url : url,
			version : version,
		}).then(function(result) {
			busyService.popBusy(bid);
			console.log(result);
		});

	};

	$scope.openAddUpdateModal = function(size) {
		var modalInstance = $modal.open({
			animation : true, // animations on
			templateUrl : 'js/views/management/development/api/edit/api.add.update.html',
			controller : function MaintainModelCtrl($scope, $modalInstance) {
				$scope.masterName = '';
				$scope.url = '';
				$scope.version = '';
				console.log($scope.inputMasterName);
				$scope.ok = function() {
					$modalInstance.close({
						masterName : $scope.masterName,
						url : $scope.url,
						version : $scope.version,
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
			console.log(message);
			$scope.maintainOverallApi(message.masterName, message.url, message.version);
		});
	};

	$scope.openDeleteModal = function(size) {
		var modalInstance = $modal.open({
			animation : true,
			templateUrl : 'js/views/management/development/api/edit/api.delete.html',
			controller : function DeleteModelCtrl($scope, $modalInstance, treeData) {

				$scope.treeData = formatData(treeData);
				console.log($scope.treeData);

				$scope.selectNode = function(value) {
					if (value.isMaster) {
						$scope.returnValue = value;
					} else if (value.isVersion) {
						value.masterId = value.parent.id;
						$scope.returnValue = value;
					}
				};

				function formatData(masterList) {
					var treeData = [];
					if (masterList) {
						if (angular.isArray(masterList)) {
							angular.forEach(masterList, function(value) {
								var temp = {
									id : value.id,
									isMaster : true,
									label : value.name,
									children : formatVersionList(value.versionList),
								};
								treeData.push(temp);
							});
						} else {
							var temp = {
								isMaster : true,
								label : masterList.name,
								children : formatVersionList(masterList.versionList),
							};
							treeData.push(temp);
						}
					}
					return treeData;
				}

				function formatVersionList(list) {
					var returnList = [];
					if (list) {
						if (angular.isArray(list)) {
							angular.forEach(list, function(value) {
								var temp = {
									version : value,
									isVersion : true,
									label : 'version: ' + value,
									children : [],
								};
								returnList.push(temp);
							});
						} else {
							var temp = {
								isVersion : true,
								label : 'version: ' + list,
								children : [],
							};
							returnList.push(temp);
						}
					}
					return returnList;
				}


				console.log(treeData);
				$scope.ok = function() {
					$modalInstance.close({
						value : $scope.returnValue,
					});
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			},
			size : size,
			resolve : {
				treeData : function() {
					return $scope.masterList;
				}
			}
		});
		modalInstance.result.then(function(message) {// modal message back
			var value = message.value;
			if (value.isVersion) {
                 $scope.deleteByVersion(value.masterId, value.version);
			}else if(value.isMaster){
				$scope.deleteByMasterId(value.id);
			}
		});
	};

}