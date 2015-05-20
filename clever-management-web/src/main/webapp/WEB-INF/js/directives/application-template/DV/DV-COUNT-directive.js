angular.module('clever.management.directives.DVCOUNT', []).directive('dvCount',//驼峰式命名
function($document) {
    return {       
        replace:true,    
        restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
        scope : {//配置    绑定不同的数据到指令内部的作用域
          UIData:'=guiData',          
        },      
        
        template: '<li dragable id={{UIData.label.labelContent+"_"+UIData.label.code}}>'
                    +'<img ng-class="UIData.label.picType"></img>'
                    +'<span>'+'{{UIData.label.labelContent}}'+'</span>'+'&nbsp;&nbsp:&nbsp;&nbsp&nbsp'+'<input id={{UIData.label.labelContent+UIData.label.code}}>'+
                   '</li>',
        controller:function($scope){
            
            $scope.dvcountControl={};
        },
        link : function(scope, element, attrs) {
    }
    };
});