angular.module('clever.management.directives.DVORDINAL', []).directive('dvOrdinal',//驼峰式命名
function($document) {
    return {        
        restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
        scope : {//配置    绑定不同的数据到指令内部的作用域
          UIData:'=guiData',          
        },      
       
                  
        template: '<div dragable>'+'<a>'+'{{UIData.label.labelContent}}'
                  +'</a>'+'&nbsp;&nbsp:&nbsp;&nbsp&nbsp'
                  +'<select ng-model="dataEntry" ng-options="index.symbol for index in UIData.label.dataValue">'
                  +'</select>'+'</div>',
        controller:function($scope){
            
            $scope.dvordinalControl={};
        },
        link : function(scope, element, attrs) {
            
             
            
    }
    };
});