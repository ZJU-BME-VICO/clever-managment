angular.module('clever.management.directives.ccButton', []).directive('ccButton',//驼峰式命名
function($document) {
    return {        
        restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
        scope : {//配置    绑定不同的数据到指令内部的作用域
                   
        },      
        
        template: '<div dragable ng-context-menu  visible="isVisible">'+
                  '<button class="btn btn-default" type="button" ng-click="save()">save</button>'
                 +'</div>',
        controller:function($scope){
            
            $scope.btnControl={};
            $scope.save = function(){
                
            };
        },
        link : function(scope, element, attrs) {
    }
    };
});