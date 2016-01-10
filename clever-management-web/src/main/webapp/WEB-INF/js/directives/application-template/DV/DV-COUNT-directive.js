angular.module('clever.management.directives.DVCOUNT', []).directive('dvCount',//驼峰式命名
function($document) {
    return {       
        replace:true,    
        restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
        scope : {//配置    绑定不同的数据到指令内部的作用域
          UIData:'=guiData',  
           template:'=templateName',        
        },      
        
        template: '<li dragable ng-context-menu="menuOptions" id={{UIData.label.enText+"_"+UIData.label.code}}>'
                    +'<img ng-class="UIData.label.picType"></img>'
                    +'<span>'+'{{UIData.label.labelContent}}'+'</span>'+'&nbsp;:&nbsp;'
                    +'<input name={{UIData.label.enText+"_"+UIData.label.tableName}} id={{UIData.label.path}} template={{template}} style="width:80px;">'
                    +'</li>',
        controller:function($scope){
             $scope.dvcountControl={};
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
        	element.css({
        		
        	});
    }
    };
});