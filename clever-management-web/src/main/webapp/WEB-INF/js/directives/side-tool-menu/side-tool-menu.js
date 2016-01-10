angular.module('clever.management.directives.sideToolMenu', []).directive('sideToolMenu', function() {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			toolMenus : '=',
		},
		templateUrl : 'js/directives/side-tool-menu/side.tool.menu.html',
		controller : function($scope) {
		}
	};
});
