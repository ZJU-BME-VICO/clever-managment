angular.module('clever.management.directives.editDefinitionPane',[]).directive('editDefinitionPane', function(){                                 
     return{
     	restrict: 'E',
     //	transclude:true,
     	scope:{ 
     	},
     	templateUrl:'js/directives/archetype-edit-directives/definition-pane/edit-definition-pane.html',
     	controller: function($scope, $element, $attrs){
     		
     	},
     	links: function(scope,element,attrs){
     		
     	}
     };

	
});

/*angular.module('clever.management.directives.archetypeEditDirectives.definitionPane', []).directive('editDefinitionPane', function() {
	return {
		restrict : 'E',
		scope : {
			definition : '=',
			terminology : '=',
		},
		templateUrl : 'js/directives/definition-pane/definition-pane.html',
		controller : function($scope, $element, $attrs) {
			$scope.selectedView = "Table";
			}
	};
});*/


