angular.module('clever.management.directives.apiParamInformationPane', []).directive('apiParamInformationPane', function($modal, resourceService, DEVELOPMENT_API_MAINTAIN_ADD_PARAM_URL, DEVELOPMENT_API_MAINTAIN_SAVE_PARAMS_URL, msgboxService, busyService) {
	return {
		restrict : 'E',
		scope : {
			apiInfo : '=',
			versionMasterId : '=',
		},
		templateUrl : 'js/directives/api-directives/api-param-information-pane/api.param.information.pane.html',
		controller : function($scope) {
			$scope.$watch('apiInfo', function(newValue) {
				console.log(newValue);
			});

			$scope.saveParamInfo = function() {
				var bid = busyService.pushBusy('BUSY_LOADING');
				console.log($scope.apiInfo);
				resourceService.post(DEVELOPMENT_API_MAINTAIN_SAVE_PARAMS_URL, {
					id : $scope.apiInfo.id,
					requestParams : $scope.apiInfo.requestParams,
					returnParams : $scope.apiInfo.returnParams,
				}).then(function(result) {
					console.log(result);
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
			
			function addRequestParam(type) {
				var bid = busyService.pushBusy('BUSY_LOADING');
				resourceService.post(DEVELOPMENT_API_MAINTAIN_ADD_PARAM_URL + $scope.apiInfo.id + '/versionid/' + $scope.versionMasterId, type).then(function(result) {
					if (result.succeeded) {
						msgboxService.createMessageBox('API_MAINTAIN_SUCCEEDED', 'API_MAINTAIN_SUCCEEDED_HINT', {}, 'success');
					} else {
						msgboxService.createMessageBox('API_MAINTAIN_FAILED', 'API_MAINTAIN_FAILED_HINT', {
							errorMsg : result.message
						}, "error");
					}
					busyService.popBusy(bid);
				});
			}

			//auxiliary modal
			$scope.addRequestParam = function(size) {
				var modalInstance = $modal.open({
					animation : true, // animations on
					templateUrl : 'js/directives/api-directives/api-param-information-pane/api.add.param.html',
					controller : function MaintainModelCtrl($scope, $modalInstance) {
						$scope.ok = function() {
							$modalInstance.close({
								type : $scope.type,
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
					addRequestParam(message.type);
				});
			};

		}
	};
});
