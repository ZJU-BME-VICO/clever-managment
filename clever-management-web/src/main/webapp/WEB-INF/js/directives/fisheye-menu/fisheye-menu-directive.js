angular.module('clever.management.directives.fisheyeMenu', []).directive('fisheyeMenu', function($timeout) {
	return {
		restrict : 'EA',
		scope : {
			menus : '=',
			selectMenuCallback : '&',
		},
		template : '<div class="dock">'+
						'<div class="dock-container2">'+
							'<a class="dock-item2" ng-repeat="menu in menus" href ng-click="selectMenu(menu)">'+
								'<span>{{menu.title | translate}}</span>'+
								'<img ng-src="{{menu.imgUrl}}">'+
							'</a>'+
						'</div>'+
					'</div>',
		controller : function($scope) {
			$scope.selectMenu = function(menu) {
				$scope.selectMenuCallback({
					value : menu
				});
			};
		},
		link : function(scope, element, attr) {
			var itemWidth = angular.isDefined(attr.itemWidth) ? scope.$parent.$eval(attr.itemWidth) : 80;
			var maxWidth = angular.isDefined(attr.maxWidth) ? scope.$parent.$eval(attr.maxWidth) : 30;
			var proximity = angular.isDefined(attr.proximity) ? scope.$parent.$eval(attr.proximity) : 30;
			scope.$watch('menus', function(newValue, oldValue) {
				if (newValue) {
					$timeout(function() {
						$(element).Fisheye({
							maxWidth : maxWidth,
							items : 'a',
							itemsText : 'span',
							container : '.dock-container2',
							itemWidth : itemWidth,
							proximity : proximity,
							alignment : 'left',
							valign : 'bottom',
							halign : 'center'
						});
					}, 0);
				}
			});
		}
	};
}); 