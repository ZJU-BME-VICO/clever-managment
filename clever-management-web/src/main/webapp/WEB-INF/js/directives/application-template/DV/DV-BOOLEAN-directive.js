angular.module('clever.management.directives.DVBOOLEAN', []).directive('dvBoolean',//驼峰式命名
function($document) {
    return {        
        transclude:true,    
        restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
        scope : {//配置    绑定不同的数据到指令内部的作用域
          UIData:'=guiData',          
        },      
        
        template: '<li dragable>'+
                    '<img ng-class="UIData.label.picType"></img>'+
                    '<a>'+'{{UIData.label.labelContent}}'+'</a>'+'&nbsp;&nbsp:&nbsp;&nbsp&nbsp'+'<input type="radio">'+ 
                  '</li>',
        controller:function($scope){
            
            $scope.dvbooleanControl={};
        },
        link : function(scope, element, attrs) {
    }
    };
});