angular.module('clever.management.directives.DVPROPORTION', []).directive('dvProportion',//驼峰式命名
function($document) {
	return {	
	    replace:true,   
		restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
		scope : {//配置    绑定不同的数据到指令内部的作用域
	      UIData:'=guiData',	
	       template:'=templateName',      
		},		
		
        template: '<div dragable ng-context-menu="menuOptions" >'+'<a>'+'{{UIData.label.labelContent}}'+'</a>'+'&nbsp;:&nbsp;'+'<input id={{UIData.label.path}} template={{template}}>'+
			      +'<a>"%"</a>'
			      +'</div>',
	    controller:function($scope){	    	
	    	$scope.dvproportionControl={};
	    	$scope.menuOptions = [
                ['delete', function ($itemScope) {
                    var id=$itemScope.UIData.label.enText+"_"+$itemScope.UIData.label.code;
                    var obj=document.getElementById(id);
                    var parentDiv=document.getElementById("editArea");
                    parentDiv.removeChild(obj);
                }],
            ];
	    },
		link : function(scope, element, attrs) {
                                    
                        
	},
	};
});