angular.module('clever.management.directives.groupNodeView', []).directive('groupNodeView',
function($compile,$document) {
    return{
        restrict:'E',
        transclude:true,
        scope:{
            UIData:'=guiData',
        },      
        controller:function($scope,$transclude){
            $scope.groupNodeViewControl={};
        },
        link:function(scope,ele,attrs){
             var tmp;
             var data=scope.UIData;
             var template=createTemplate(data,tmp);
             
             function createTemplate(data,tmp){
                 if(angular.isArray(data)){
                   
                    if(data.label){
                         var type=data.label.picType;
                         template='<div class=type><a>{{data.label.labelContent}}</a>';
                         if(data.children){
                             data="";
                         }
                     } 
                 }
              else{
                   if(data.label){
                         var type=data.label.picType;
                         template='<div class=type><a>{{data.label.labelContent}}</a>';
                         if(data.children){
                             data="";
                         }
                     }
             } 
           }         
        },
        
    };
});