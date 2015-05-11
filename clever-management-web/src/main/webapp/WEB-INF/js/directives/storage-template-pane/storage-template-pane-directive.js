define(['lazyLoader'], function(lazyLoader) {
	lazyLoader.directive('storageTemplatePane', function(archetypeParseService, containerService) {
		return {
			restrict : 'E',
			scope : {
				templateInfo : '=',
				selectArchetypeCallback : '&',
				selectMasterCallback : '&',
			},
			templateUrl : 'js/directives/storage-template-pane/storage-template-pane.html',
			controller : function($scope) {

				$scope.selectSpecialiseArchetype = function() {
					$scope.selectArchetypeCallback({
						value : $scope.templateInfo.specialiseArchetype
					});
				};

				$scope.selectTemplateMaster = function() {
					$scope.selectMasterCallback({
						value : {
							id : $scope.templateInfo.versionMasterId,
							name : $scope.templateInfo.versionMasterName,
						},
					});
				};

				$scope.generateDownloadHref = function(content) {
					return 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
				};
			},
			link : function(scope, elm, attrs) {
				scope.paneHeight = containerService.getHeight() - 280;
                scope.$watch(function() {
                    return containerService.getHeight()
                }, function(newValue) {
                    scope.paneHeight = newValue - 280 < 180 ? 180 : newValue - 280;
                });
				// scope.paneHeight = angular.isDefined(attrs.maxHeight) ? scope.$parent.$eval(attrs.maxHeight) - 95 : undefined;
				scope.tableTitleWidth = angular.isDefined(attrs.tableTitleWidth) ? scope.$parent.$eval(attrs.tableTitleWidth) : 200;
			},
		};
	});
});
