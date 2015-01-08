angular.module('clever.management.directives.unfoldMenu', []).directive('unfoldMenu', function($timeout,$window) {
	return {
		restrict: 'EA',
		transclude: true,
		templateUrl: 'js/directives/unfold-menu/unfold-menu.html',
		scope: {
			menuItems : '=',
			mouseOverItem : '=',
			currentBreadCrumbs : '=',
			selectMenuCallback : '&',
			clickMenuCallback : '&',
		}, 
	 	controller: function($scope) {
	 		$scope.menuOver = function(title,index) {
				$scope.selectMenuCallback({
					valueTitle : title,
					valueIndex : index
				});
			};

			$scope.selectMenu=function(item){
				$scope.clickMenuCallback({
					value : item
				});
			};
	 	},
		link: function(scope, elemtn, attr) {
			
			scope.showMenu=[];
			
			scope.getItems=function(item){
				return item.title!='MENU_RETURN';
			};
			
			scope.$watch(function(){
				return document.body.clientWidth;
			},function(newVal,oldVal){
				if(newVal){
					$timeout(function(){
						var items = document.querySelectorAll('.menuItem');
						if(newVal>=1800){
							$('.menuItem').addClass("fa-5x");
							for(var i = 0; i < items.length; i++) {
									items[i].style.width = "65px";
								};
							}else if(newVal>=1000){
								$('.menuItem').removeClass("fa-5x");
								$('.menuItem').addClass("fa-4x");
								for(var i = 0; i < items.length; i++) {
										items[i].style.width = "55px";
									};
							}else{
								$('.menuItem').removeClass("fa-5x");
								$('.menuItem').removeClass("fa-4x");
								$('.menuItem').addClass("fa-3x");
								for(var i = 0; i < items.length; i++) {
										items[i].style.width = "40px";
									};
							}
					},0);
				}
			});
			
			scope.$watch('mouseOverItem',function(newVal){
				scope.showMenu=[];
				if(newVal==-1){
					var temp=scope.currentBreadCrumbs;
					scope.showMenu={'title':temp.title,'icon':temp.icon,'info':temp.info};
				}
				else{
					angular.forEach(scope.menuItems,function(menuItem){
						if(menuItem.title==scope.mouseOverItem){
							scope.showMenu={'title':menuItem.title,'icon':menuItem.icon,'info':menuItem.info};
						}
					});
					if(scope.showMenu.length==0){
						var temp=scope.currentBreadCrumbs;
						scope.showMenu={'title':temp.title,'icon':temp.icon,'info':temp.info};
					}
				}
			});
			
			scope.$watch('menuItems',function(newVal,oldVal){
				if(newVal){
					$timeout(function(){
						var items = document.querySelectorAll('.menuItem');
						for(var i = 0; i < items.length; i++) {
							items[i].style.left = (47 - 25*Math.cos(-0.5 * Math.PI - 2*(1/items.length)*i*Math.PI)).toFixed(4) + "%";
							items[i].style.top = (50 + 25*Math.sin(-0.5 * Math.PI - 2*(1/items.length)*i*Math.PI)).toFixed(4) + "%";
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