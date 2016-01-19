angular.module('clever.management.directives.definitionOntologyPane', []).directive('definitionOntologyPane', function(archetypeEditService) {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			ontologyItem : '=',
		},
		templateUrl : 'js/directives/archetype-edit-directives/definition-pane/ontology-pane/ontology.pane.html',

		controller : function($scope, $element, $attrs) {
		   console.log($scope.ontologyItem);
		   $scope.$watch('ontologyItem.displayPart.description', function(newValue){
		   	  if(newValue){
		   	  	$scope.ontologyItem.originalPart.description = newValue;
		   	  }
		   });
		}
	};
});