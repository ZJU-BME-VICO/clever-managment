angular.module('clever.management.directives.linksPane', []).directive('linksPane', function(archetypeEditService) {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			link : "=",

		},
		templateUrl : 'js/directives/archetype-edit-directives/definition-pane/links-pane/links-pane.html',

		controller : function($scope, $element, $attrs) {
			$scope.$watch('link', function(newValue, oldValue){
				if(newValue){
					processLink($scope.link);
				}
			});
			
			function processLink(link){
				angular.forEach(link.oriNodeRef.attributes, function(attribute){
					if(attribute.rm_attribute_name == "meaning"){
						$scope.meaning = attribute.children.attributes.children.item;
					}
					if(attribute.rm_attribute_name == "target"){
						$scope.target = attribute.children.attributes.children.item;
					}
				});
			}
		}
	};
});