angular.module('clever.management.directives.DVPROPORTION', []).directive('dvProportion',//驼峰式命名
function($document) {
	return {	
		restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
		scope : {//配置    绑定不同的数据到指令内部的作用域
	      UIData:'=guiData',	      
		},		
		
        template: '<div dragable>'+'<a>'+'{{UIData.label.labelContent}}'+'</a>'+'&nbsp;&nbsp:&nbsp;&nbsp&nbsp'+'<input>'+
			      +'<a>"%"</a>'
			      +'</div>',
	    controller:function($scope){
	    	
	    	$scope.dvproportionControl={};
	    },
		link : function(scope, element, attrs) {
                                    
                        
	},
	};
});