angular.module('clever.management.directives.apiClassPane', []).directive('apiClassPane', function(resourceService, msgboxService, DEVELOPMENT_API_MAINTAIN_SAVE_ROOTURL_URL, DEVELOPMENT_API_MAINTAIN_ROOTURL_BY_VERSIONMASTER_ID_URL) {
	return {
		restrict : 'E',
		scope : {
			versionMasterId : '=',
			maxHeight : '=',

		},
		templateUrl : 'js/directives/api-directives/api-class-pane/api.class.pane.html',
		controller : function($scope) {
			//console.log($scope.versionMasterId);
			console.log($scope.maxHeight);
			$scope.$watch('versionMasterId', function(newValue) {
				if (newValue) {
					resourceService.get(DEVELOPMENT_API_MAINTAIN_ROOTURL_BY_VERSIONMASTER_ID_URL + $scope.versionMasterId).then(function(list) {
						$scope.rootUrlList = list;
					});
				}
			});

			// save root url content , is chinese name here
			$scope.saveRootUrl = function() {
				var tempList = [];
				angular.forEach($scope.rootUrlList, function(value) {
					tempList.push({
						id : value.id,
						chineseName : value.chineseName,
					});
				});
				var bid = busyService.pushBusy('BUSY_LOADING');
				resourceService.post(DEVELOPMENT_API_MAINTAIN_SAVE_ROOTURL_URL, {
					id : $scope.versionMasterId,
					rootUrlMasters : tempList,
				}).then(function(result) {
					busyService.popBusy(bid);
					if (result.succeeded) {
						msgboxService.createMessageBox('API_MAINTAIN_SUCCEEDED', 'API_MAINTAIN_SUCCEEDED_HINT', {}, 'success');
					} else {
						msgboxService.createMessageBox('API_MAINTAIN_FAILED', 'API_MAINTAIN_FAILED_HINT', {
							errorMsg : result.message
						}, "error");
					}
				});
			};
		}
	};
});
