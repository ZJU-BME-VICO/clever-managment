angular.module('clever.management.directives.definitionOntologyPane', []).directive('definitionOntologyPane', function(archetypeEditService) {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			ontologyItem : '=',
		},
		templateUrl : 'js/directives/archetype-edit-directives/definition-pane/ontology-pane/ontology.pane.html',

		controller : function($scope, $element, $attrs) {
			$scope.$watch('ontologyItem', function(newValue){
				console.log(newValue);
			});
		}
	};
});