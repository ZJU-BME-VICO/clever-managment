angular.module('clever.management.directives.archetypeMasterPane', []).directive('archetypeMasterPane', function() {
	return {
		restrict : 'E',
		scope : {
			archetypeMaster : '=',
		},
		templateUrl : 'js/directives/archetype-master-pane/archetype-master-pane.html',
		controller : function($scope) {
			$scope.tabControl = {};
			$scope.historyVersions = [];
			var latestVersion = parseInt($scope.archetypeMaster.latestArchetypeVersion.replace('v', ''));
			while (latestVersion > 0) {
				$scope.historyVersions.push({
					value : 'v' + latestVersion,
					fullName : $scope.archetypeMaster.name + '.v' + latestVersion,
				});
				latestVersion -= 1;
			}
			$scope.getFormatedTime = function(time) {
				var date = new Date();
				date.setTime(time);
				return date.format('yyyy-MM-dd hh:mm:ss');
			};
		},
		link : function(scope, element, attr) {
			scope.tableMaxHeight = angular.isDefined(attr.maxHeight) ? scope.$parent.$eval(attr.maxHeight) - 90 : undefined;
			scope.tableTitleWidth = angular.isDefined(attr.tableTitleWidth) ? scope.$parent.$eval(attr.tableTitleWidth) : 200;
		},
	};
});
