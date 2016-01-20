angular.module('clever.management.directives.nodeInfoPane', []).directive('nodeInfoPane', function(archetypeEditService) {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			node: '=',
		},
		templateUrl : 'js/directives/archetype-edit-directives/definition-pane/node-info-pane/node.info.pane.html',

		controller : function($scope, $element, $attrs) {        
		}
	};
});