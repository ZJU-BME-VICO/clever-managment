angular.module('clever.management.directives.DVORDINAL', []).directive('dvOrdinal',//驼峰式命名
function($document) {
    return {        
        restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
        scope : {//配置    绑定不同的数据到指令内部的作用域
          UIData:'=guiData',          
        },      
        
        template: '<div dragable>'+'<a>'+'{{UIData.label.labelContent}}'+'</a>'+
                  '&nbsp;&nbsp:&nbsp;&nbsp&nbsp'+
                  '<select>'+
                  '<option>'+'{{UIData.label.dataValue[0].symbol+"("+UIData.label.dataValue[0].value+")"}}'+'</opntion>'+
                  '<option>'+'{{UIData.label.dataValue[1].symbol+"("+UIData.label.dataValue[1].value+")"}}'+'</opntion>'+
                  '<option>'+'{{UIData.label.dataValue[2].symbol+"("+UIData.label.dataValue[2].value+")"}}'+'</opntion>'+
                  '<option>'+'{{UIData.label.dataValue[3].symbol+"("+UIData.label.dataValue[3].value+")"}}'+'</opntion>'+
                  '<option>'+'{{UIData.label.dataValue[4].symbol+"("+UIData.label.dataValue[4].value+")"}}'+'</opntion>'+
                  '<option>'+'{{UIData.label.dataValue[5].symbol+"("+UIData.label.dataValue[5].value+")"}}'+'</opntion>'+
                  '<option>'+'{{UIData.label.dataValue[6].symbol+"("+UIData.label.dataValue[6].value+")"}}'+'</opntion>'+                
                  '</select>'+
                  '</div>',
        controller:function($scope){
            
            $scope.dvordinalControl={};
        },
        link : function(scope, element, attrs) {
    }
    };
});