angular.module('clever.management.directives.apiBaseInformationPane', []).directive('apiBaseInformationPane', function(DEVELOPMENT_API_MAINTAIN_SAVE_API_URL, resourceService, busyService, msgboxService) {
	return {
		restrict : 'E',
		scope : {
			apiInfo : '=',
		},
		templateUrl : 'js/directives/api-directives/api-base-information-pane/api.base.information.pane.html',
		controller : function($scope) {
			$scope.$watch('apiInfo', function(newValue) {
				console.log(newValue);
			});
			$scope.saveApiBaseInfo = function() {
				var bid = busyService.pushBusy('BUSY_LOADING');
				resourceService.post(DEVELOPMENT_API_MAINTAIN_SAVE_API_URL, {
					id : $scope.apiInfo.id,
					chineseName : $scope.apiInfo.chineseName,
					description : $scope.apiInfo.description,
					chineseDescription : $scope.apiInfo.chineseDescription,

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
