angular.module('clever.management.directives.archetypeMasterPane', []).directive('archetypeMasterPane', function() {
	return {
		restrict : 'E',
		scope : {
			archetypeMasterInfo : '=',
			selectArchetypeCallback : '&',
			selectMasterCallback : '&',
		},
		templateUrl : 'js/directives/archetype-master-pane/archetype-master-pane.html',
		controller : function($scope) {
			$scope.getFormatedTime = function(time) {
				var date = new Date();
				date.setTime(time);
				return date.format('yyyy-MM-dd hh:mm:ss');
			};
			$scope.selectArchetype = function(archetype) {
				$scope.selectArchetypeCallback({
					value : archetype,
				});
			};
			$scope.selectSpecialiseMaster = function(master) {
				$scope.selectMasterCallback({
					value : master,
				});
			};
			$scope.selectSpecialiseArchetype = function(archetype) {
				$scope.selectArchetypeCallback({
					value : archetype,
				});
			};
		},
		link : function(scope, element, attr) {
			scope.tableMaxHeight = angular.isDefined(attr.maxHeight) ? scope.$parent.$eval(attr.maxHeight) - 90 : undefined;
			scope.tableTitleWidth = angular.isDefined(attr.tableTitleWidth) ? scope.$parent.$eval(attr.tableTitleWidth) : 200;
		},
	};
});
