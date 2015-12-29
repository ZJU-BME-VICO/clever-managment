angular.module('clever.management.directives.pojoClassAddPane', []).directive('pojoClassAddPane', function(msgboxService, DEVELOPMENT_API_MAINTAIN_CLASSMASTER_ADD_URL, resourceService, busyService) {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			versionMasterId : '=',
			maxHeight : '=',
		},
		templateUrl : 'js/directives/api-directives/pojo-class-add-pane/pojo.class.add.pane.html',
		controller : function($scope) {
			$scope.newMaster = function() {
				$scope.freshMaster = {
					name : "",
					type : "",
					attributes : [],
				};

			};
			$scope.newAttribute = function() {
				$scope.freshMaster.attributes.push({
					descriptionEn : '',
					descriptionZh : '',
					isRequired : true,
					name : '',
					type : '',
				});
			};

			$scope.addClassMaster = function() {
				var result = verifyClassMaster();
				var bid = busyService.pushBusy("BUSY_LOADING");
				if (result.succedded) {
					var val = $scope.freshMaster;

					resourceService.post(DEVELOPMENT_API_MAINTAIN_CLASSMASTER_ADD_URL, {
						versionId : $scope.versionMasterId,
						name : val.name,
						type : val.type,
						attributes : val.attributes,
					}).then(function(result) {
						console.log(result);
						busyService.popBusy(bid);
						if (result.succeeded) {
							msgboxService.createMessageBox('API_MAINTAIN_SUCCEEDED', 'API_MAINTAIN_SUCCEEDED_HINT', {}, 'success');
						} else {
							msgboxService.createMessageBox('API_MAINTAIN_FAILED', 'API_MAINTAIN_FAILED_HINT', {
								errorMsg : result.message
							}, 'error');
						}
					});
				} else {
					console.log(result);
					busyService.popBusy(bid);
					msgboxService.createMessageBox('API_MAINTAIN_FAILED', 'API_MAINTAIN_FAILED_HINT', {
						errorMsg : result.message
					}, 'error');
				}

			};

			function verifyClassMaster() {
				var result = {
					succedded : true,
					message : ""
				};
				if ($scope.freshMaster) {
					if ($scope.freshMaster.name && $scope.freshMaster.type) {
						var attrs = $scope.freshMaster.attributes;
						if (attrs) {
							angular.forEach(attrs, function(attr) {
								if (attr.name && attr.type) {

								} else {
									result.succedded = false;
									result.message = "the type or name of attribute should not be null";
								}
							});
						}
					} else {
						result.succedded = false;
						result.message = "the name or type fo class master should not be null!";
					}
				} else {
					result.succedded = false;
					result.message = "no class master is verifing!";
				}
				return result;
			}

		}
	};
});
