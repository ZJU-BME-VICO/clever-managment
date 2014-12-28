angular.module('clever.management.directives.DVQUANTITY', []).directive('dvQuantity',//驼峰式命名
function($document) {
	return {	
		restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
		scope : {//配置    绑定不同的数据到指令内部的作用域
	      UIData:'=guiData',	      
		},		
		
        template: '<div dragable>'+'<a>'+'{{UIData.label.labelContent}}'+'</a>'+'&nbsp;&nbsp:&nbsp;&nbsp&nbsp'+'<input placeholder="{{UIData.label.dataValue[0].range}}">'+
			      '{{UIData.label.dataValue[0].unit}}'+
			       '</div>',
	    controller:function($scope){
	    	
	    	$scope.dvquantityControl={};
	    },
		link : function(scope, element, attrs) {
	},
	};
});