define(['lazyLoader'], function(lazyLoader) {
	lazyLoader.directive('storageTemplatePane', function(archetypeParseService) {
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
				scope.paneHeight = angular.isDefined(attrs.maxHeight) ? scope.$parent.$eval(attrs.maxHeight): undefined;
				scope.tableTitleWidth = angular.isDefined(attrs.tableTitleWidth) ? scope.$parent.$eval(attrs.tableTitleWidth) : 200;
			},
		};
	});
});
