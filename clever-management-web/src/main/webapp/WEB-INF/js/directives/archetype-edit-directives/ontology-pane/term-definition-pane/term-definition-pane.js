angular.module('clever.management.directives.termDefinitionPane', []).directive('termDefinitionPane', function(archetypeEditService) {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			termDefinition : '=',
			maxHeight : '=',
		},
		templateUrl : 'js/directives/archetype-edit-directives/ontology-pane/term-definition-pane/term.definition.pane.html',

		controller : function($scope, $element, $attrs) {
			$scope.currentFilter = 'codeFilter';
			$scope.filterAlter = function() {
				$scope.currentFilter = $scope.currentFilter == 'codeFilter' ? 'textFilter' : 'codeFilter';
			};

		}
	};
});
