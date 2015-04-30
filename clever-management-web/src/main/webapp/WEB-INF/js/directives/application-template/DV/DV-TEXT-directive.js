angular.module('clever.management.directives.DVTEXT', []).directive('dvText',//驼峰式命名
function($document) {
	return {		
		restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
		scope : {//配置    绑定不同的数据到指令内部的作用域
	      UIData:'=guiData',	      
		},		
		
        template: '<div dragable>'+
                    '<img ng-class="UIData.label.picType"></img>'+
                    '<a>'+'{{UIData.label.labelContent}}'+'</a>'+'&nbsp;&nbsp:&nbsp;&nbsp&nbsp'+'<input id=UIData.label.code>'+
			       '</div>',
	    controller:function($scope){
	    	
	    	$scope.dvtextControl={};
	    },
		link : function(scope, element, attrs) {
	}
	};
});