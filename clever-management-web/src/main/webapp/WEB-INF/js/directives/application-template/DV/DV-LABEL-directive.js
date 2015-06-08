angular.module('clever.management.directives.dvLabel', []).directive('dvLabel',//驼峰式命名
function($document) {
    return {        
    	replace:true,
        restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
        scope : {//配置    绑定不同的数据到指令内部的作用域
                UIData:'=guiData',    
        },      
        
        template: '<li dragable id={{UIData.label.labelContent+"_"+UIData.label.code}}>'+
                    '<img ng-class="UIData.label.picType"></img>'+
                    '<span>'+'<b>'+'{{UIData.label.labelContent}}'+'</b>'+ '</span>'+
                  '</li>',
        controller:function($scope){
        },
        link : function(scope, element, attrs) {
    }
    };
});