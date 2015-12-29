angular.module('clever.management.directives.pojoClassPane', []).directive('pojoClassPane', function(msgboxService, DEVELOPMENT_API_MAINTAIN_CLASSATTRIBUTE_URL, DEVELOPMENT_API_MAINTAIN_CLASSMASTER_URL, busyService, resourceService) {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			// pojoClass: '=',
			versionMasterId : '=',
			maxHeight : '=',
		},
		templateUrl : 'js/directives/api-directives/pojo-class-pane/pojo.class.pane.html',
		controller : function($scope) {

			$scope.treeControl = {};

			$scope.$watch('versionMasterId', function(newValue, oldValue) {
				if (newValue) {
					var classBid = busyService.pushBusy('BUSY_LOADING');
					resourceService.get(DEVELOPMENT_API_MAINTAIN_CLASSMASTER_URL + $scope.versionMasterId).then(function(list) {
						console.log(list);
						$scope.classMasters = list;
						busyService.popBusy(classBid);
					});
				}
			});

			$scope.selectClass = function(value) {
				console.log(value);
				$scope.selectedClass = value;
			};

			$scope.$watch('classNameFilter', function(newValue) {
				$scope.treeControl.search(newValue);
			});
			$scope.searchKeyMapper = function(node) {
				return node.name;
			};

			$scope.saveAttribute = function() {
				var master = $scope.selectedClass;
				var attributeList = [];

				if (master.attributes) {
					if (angular.isArray(master.attributes)) {
						angular.forEach(master.attributes, function(attribute) {
							var temp = {
								id : attribute.id,
								descriptionEn : attribute.descriptionEn,
								descriptionZh : attribute.descriptionZh,
								isRequired : attribute.isRequired,
							};
							attributeList.push(temp);
						});
					} else {
						var tempAttr = {
							id : attributes.id,
							descriptionEn : attributes.descriptionEn,
							descriptionZh : attributes.descriptionZh,
							isRequired : attributes.isRequired,
						};
						attributeList.push(tempAttr);
					}
				}
				if (attributeList.length > 0) {
					var bid = busyService.pushBusy('BUSY_LOADING');
					resourceService.post(DEVELOPMENT_API_MAINTAIN_CLASSATTRIBUTE_URL, attributeList).then(function(result) {
						busyService.popBusy(bid);
						if (result.succeeded) {
							msgboxService.createMessageBox('API_MAINTAIN_SUCCEEDED', 'API_MAINTAIN_SUCCEEDED_HINT', {}, 'success');
						} else {
							msgboxService.createMessageBox('API_MAINTAIN_FAILED', 'API_MAINTAIN_FAILED_HINT', {
								errorMsg : result.message
							}, "error");
						}
					});
				}

			};
		}
	};
});
