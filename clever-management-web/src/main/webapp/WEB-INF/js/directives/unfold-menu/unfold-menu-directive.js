angular.module('clever.management.directives.unfoldMenu', []).directive('unfoldMenu', function($timeout) {
	return {
		restrict: 'EA',
		transclude: true,
		templateUrl: 'js/directives/unfold-menu/unfold-menu.html',
		scope: {
			clickItem:"=",
			menuItems:"=",
			selectMenuCallback : '&',
		}, 
	 	controller: function($scope) {
	 		$scope.menuClick = function(id,index) {
				$scope.selectMenuCallback({
					valueID : id,
					valueIndex : index
				});
			};
	 	},
		link: function(scope, elemtn, attr) {
			scope.$watch('menuItems',function(newVal,oldVal){
				if(newVal){
					$timeout(function(){
						var items = document.querySelectorAll('.menuItem');
						var itemLength = scope.menuItems.length;
						for(var i = 0; i < itemLength; i++) {
							items[i].style.left = (50 - 25*Math.cos(-0.5 * Math.PI - 2*(1/itemLength)*i*Math.PI)).toFixed(4) + "%";
							items[i].style.top = (50 + 25*Math.sin(-0.5 * Math.PI - 2*(1/itemLength)*i*Math.PI)).toFixed(4) + "%";
						};
					},0);
				}
			});

			scope.caretClick=function(temp){
				
				if(temp=='itemContent'){
					if($('.item-content')[0].style.display=="none"){
						$('.item-content')[0].style.display="block";
						$('.itemContent').removeClass("icon-caret-right");
						$('.itemContent').addClass("icon-caret-down");
					}else{
						$('.item-content')[0].style.display="none";
						$('.itemContent').removeClass("icon-caret-down");
						$('.itemContent').addClass("icon-caret-right");
					}
				}
			};
		}
	};
}); 