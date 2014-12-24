angular.module('clever.management.directives.DVTEXT', []).directive('dvText',//驼峰式命名
function($document) {
	return {		
		restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
		scope : {//配置    绑定不同的数据到指令内部的作用域
	      UIData:'=guiData',	      
		},		
		
        template: '<div>'+'<a>'+'{{UIData.detailInfo.labelContent}}'+'</a>'+'&nbsp;&nbsp:&nbsp;&nbsp&nbsp'+'<input>'+
			       '</div>',
	    controller:function($scope){
	    	
	    	$scope.dvtextControl={};
	    },
		link : function(scope, element, attrs) {
		//指令修改DOM通常是在link配置中，link选项接受一个带有如下标签的函数function link(scope,element,attrs) {...}
		//其中： - scope是angular scope对象 - element指令匹配的jqLite封装的元素(angular内部实现的类jquery的库) - attrs是一个带有规范化后属性名字和相应值的对象
		var startX=0,startY,startZ=0,x=0,y=0;
		element.css({
			position:"relative",	
		    backgroundColor: 'lightgrey',
            cursor: 'pointer'		
		});
		element.on('mousedown',function(event){
			event.preventDefault();
			startX=event.screenX - x;
			startY=event.screenY - y;
			$document.on('mousemove',mousemove);
			$document.on('mouseup',mouseup);
		});
		function mousemove(event){
			y=event.screenY-startY;
			x=event.screenX-startX;
			element.css({
				top:y+'px',
				left:x+'px'
			});
		}
		function mouseup(){
			$document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
		}
		},
	};
});