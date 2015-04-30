angular.module('clever.management.directives.controlBox', []).directive('controlBox',
function($compile,$document) {
    return{
        restrict:'EA',
        transclude:true,
        scope:{
            id:'=',
        }, 
        templateUrl : 'js/directives/application-template/control-box/control-box.html',
        link: function(element,scope,attrs){
             element.on('mousedown',function(event){
                 var data=scope.divData;
                  var id=$element;
             });
             
             scope.creatFn=function(){
                  var data=scope.divData;
                  var id=$element;
            };
            /*e  lement.bind(click,function(){
                 var html='<button class="btn btn-default" type="button" ng-click="save()">save</button>';
                 var addin=angular.element(html);              
                 $("#editArea").append($compile( addin )(scope));
            });*/
        },
    };
});