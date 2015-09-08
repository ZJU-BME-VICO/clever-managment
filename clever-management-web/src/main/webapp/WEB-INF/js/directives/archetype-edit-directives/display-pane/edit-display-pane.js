angular.module('clever.management.directives.editDisplayPane',[]).directive('editDisplayPane',function(){
	return {
		restrict:'E',
		transclude: true,
		scope:{
			ArchetypeInfo:'=',
		},
		templateUrl:'js/directives/archetype-edit-directives/display-pane/edit-display-pane.html',
		controller: function($scope,$element){
			
		},
		links: function(scope,element,attr){
			
		}
	};
});
