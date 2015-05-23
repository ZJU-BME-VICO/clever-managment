angular.module('clever.management.directives.controlBox', []).directive('controlBox',['$document',
function($compile,$document) {
    return{
        restrict : 'EA',
        transclude:true,
        templateUrl : 'js/directives/application-template/control-box/control-box.html',
        link : function(scope,element,attrs){
            
             element.on('mousedown',function(event){
                 var html;
                 var id=event.target.parentElement.getAttribute("id");
                 if(id=="label"){
                     html='<input value="Cost"onfocus="if(value=="Cost"){value=""}"onblur="if(value==""){value="Cost"}" style="border:0px"/>'; ;
                 }
                 if(id=="btn"){
                     var html='<button class="btn btn-primary btn-lg ng-binding" style="float:right;margin-right:20px;padding:8px 16px;"  ng-click="save()">保存</button>'
                     //var html='<ccButton></ccButton>';}
                 var addin=angular.element(html); 
                 //$("#editArea").append($compile( addin )(scope));             
                 $("#editArea").append(addin); 
                 }
             });   
             },
         };          
}]);