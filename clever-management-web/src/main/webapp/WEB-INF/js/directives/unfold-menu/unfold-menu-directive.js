angular.module('clever.management.directives.unfoldMenu', []).directive('unfoldMenu', function($compile) {
	return {
		restrict : 'E',
		scope : {
			mgrFuns : '=',
			funInfos : '=',
			funNames : '=',
			menuClick : '&',
		},
		transclude : 'true',
		controller : function($scope) {
			$scope.addFooter = function(target) {
				$scope.menuClick({
					value : target
				});
			};
		},
		link : function(scope, element, attr) {
			var template = '<a href="#" ng-repeat="mgrFun in mgrFuns" title="{{mgrFun.title}}" menu-click="addFooter"' + 
								'class="menuItem {{mgrFun.icon}} fa-2x rotary" ng-click="addFooter(mgrFun.id)">' + 
							'</a>';

			if (scope.mgrFuns) {
				element.html('').append($compile(template)(scope));
			};
		}
	};
}); 