angular.module('clever.management.directives.DV_TEXT', []).directive('DV_TEXT',
function($compile) {
	return {
		require: '^nodeList',
		restrict : 'E',//A 仅匹配属性名字  E 仅匹配元素名字
		scope : {//配置    绑定不同的数据到指令内部的作用域
	      nodeData:'='
		},
		link : function(scope, element, attrs) { 
		//指令修改DOM通常是在link配置中，link选项接受一个带有如下标签的函数function link(scope,element,attrs) {...}
		//其中： - scope是angular scope对象 - element指令匹配的jqLite封装的元素(angular内部实现的类jquery的库) - attrs是一个带有规范化后属性名字和相应值的对象
			
			
			var template ='<label>'+'{{nodeData.detailInfo.labelContent}}'+'</label>'+':'+'<input>';
			if (scope.nodeData) {
				element.html('').append($compile( template )(scope));
			}
		},
	};
});