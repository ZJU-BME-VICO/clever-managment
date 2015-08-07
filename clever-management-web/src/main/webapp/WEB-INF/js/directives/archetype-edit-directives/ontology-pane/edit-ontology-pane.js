angular.module('clever.management.directives.editOntologyPane',[]).directive('editOntologyPane',function(){
	return {
		restrict:'E',
		transclude: true,
		scope:{},
		templateUrl:'js/directives/archetype-edit-directives/ontology-pane/edit-ontology-pane.html',
		controller: function($scope,$element,$attr){},
		links: function(scope,element,attr){},
	};
});
