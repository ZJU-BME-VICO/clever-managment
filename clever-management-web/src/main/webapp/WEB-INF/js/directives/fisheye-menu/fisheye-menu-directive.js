angular.module('clever.management.directives.fisheyeMenu', []).directive('fisheyeMenu',function($compile){
	return {
		restrict:'E',
		scope:{
			funInfos:'=',
			funNames:'=',
			itemClick:'&',
		},
		transclude:'true',
		controller:function($scope){
			$scope.addBody=function(target){
				//小标题头
				$scope.funNames.push({"name":"——"});
				while($scope.funNames.length!=2)
					$scope.funNames.pop();

				$scope.itemClick({
					value:target
				});
			};
		},
		link: function(scope, element, attr) {
			var template='<div class="dock">'+
							'<div class="dock-container2">'+
								'<a class="dock-item2" href="#" ng-repeat="funInfo in funInfos" item-click="addBody"'+
									' ng-click="addBody(funInfo.alt)">'+
									'<span>{{funInfo.title}}</span>'+
									'<img ng-src="img/{{funInfo.imgUrl}}" alt="{{funInfo.alt}}">'+
								'</a>'+
							'</div>'+
						'</div>';
			if (scope.funInfos) {
				element.html('').append($compile(template)(scope));
			};

			scope.$watch('funInfos', function(newValue, oldValue) {
				if (newValue.length > 0) {
					$timeout(function() {
						$(element).Fisheye({
							maxWidth : 60,
							items : 'a',
							itemsText : 'span',
							container : '.dock-container2',
							itemWidth : 40,
							proximity : 80,
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