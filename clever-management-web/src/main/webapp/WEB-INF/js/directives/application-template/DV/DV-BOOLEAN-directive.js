angular.module('clever.management.directives.DVBOOLEAN', []).directive('dvBoolean',//驼峰式命名
function($document) {
    return {        
        replace:true,    
        restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
        scope : {//配置    绑定不同的数据到指令内部的作用域
          UIData:'=guiData',    
           template:'=templateName',      
        },      
        
       /* template: '<li dragable id={{UIData.label.enText+"_"+UIData.label.code}}>'+
                    '<img ng-class="UIData.label.picType"></img>'+
                    '<a>'+'{{UIData.label.labelContent}}'+'</a>'+'&nbsp;&nbsp:&nbsp;&nbsp&nbsp'+'<input name={{UIData.label.enText+"_"+UIData.label.tableName}} id={{UIData.label.enText+"_"+UIData.label.code+"_"+number}}  type="checkbox">'+ 
                  '</li>',*/
         template: '<li dragable ng-context-menu="menuOptions" id={{UIData.label.enText+"_"+UIData.label.code}}>'
                    +'<img ng-class="UIData.label.picType"></img>'
                    +'<select ng-model="dataEntry" name={{UIData.label.enText+"_"+UIData.label.tableName}} id={{UIData.label.path}} template={{template}}>'
                    +'<option>无</option>'+'<option>有</option>'
                    +'</li>',        
        controller:function($scope){            
            $scope.dvbooleanControl={};
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
    }
    };
});