angular.module('clever.management.directives.introductionPane', []).directive('introductionPane', function(){
	return {
		restrict : 'ACE',
		transclude : true,
		scope :{
			menuContent: '=',
		},
		templateUrl : 'js/directives/introduction-pane/introduction-pane.html',
		controller : function($scope, $state){
			
		}
	};
});
