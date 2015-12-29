angular.module('clever.management.directives.apiInformationPane', []).directive('apiInformationPane', function(DEVELOPMENT_API_DISPLAY_APIINFOMATION_URL, DEVELOPMENT_API_DISPLAY_VERSIONMASTER_BY_ID_URL, DEVELOPMENT_API_DISPLAY_VERSIONMASTER_BY_ID_URL, DEVELOPMENT_API_DISPLAY_MASTER_URL, DEVELOPMENT_API_MAINTAIN_CLASSMASTER_URL, resourceService, busyService) {
	return {
		restrict : 'E',
		scope : {
			versionMasterId : '=',
			maxHeight : '=',
		},
		templateUrl : 'js/directives/api-directives/api-information-pane/api.information.pane.html',
		controller : function($scope) {
			$scope.treeControl = {};
			//api list search
			// for api tree search
			$scope.searchKeyMapper = function(node) {
				return node.chineseName;
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

			$scope.$watch('versionMasterId', function(newValue) {
				if (newValue) {
					$scope.getApiListById();
				}
			});
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

			$scope.getApiListById = function() {
				var bid = busyService.pushBusy('BUSY_LOADING');
				resourceService.get(DEVELOPMENT_API_DISPLAY_VERSIONMASTER_BY_ID_URL + $scope.versionMasterId).then(function(master) {
					$scope.versionMaster = master;
					$scope.stretchState = 'EXPAND_ALL';
					console.log(master);
					busyService.popBusy(bid);
				});
			};
		}
	};
});
