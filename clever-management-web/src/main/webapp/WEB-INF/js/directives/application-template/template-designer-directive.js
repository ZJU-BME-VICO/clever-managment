angular.module('clever.management.directives.templateDesigner',[]).directive('templateDesigner',
function(){
    return{
        restrict : 'E',
        link : function(){            
        },
        controller:function($scope){
            $scope.templateDControl={
                saveTemplateInfo:function(){
                    var node=[];
                    var html=$('#editArea').html();
                },
                createNewTemplate:function(){
                    
                }   
            };
        },
    };
});
