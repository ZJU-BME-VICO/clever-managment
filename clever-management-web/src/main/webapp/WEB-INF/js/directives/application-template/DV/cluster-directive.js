angular.module('clever.management.directives.cluster', []).directive('cluster',
function($compile,$document) {
         var datatypeList= new Array('DV_QUANTITY','DV_TEXT','DV_ORDINAL', 'DV_DATE_TIME','DV_DATE', 'DV_COUNT', 'DV_BOOLEAN','DV_CODED_TEXT','DV_PROPORTION','DV_DURATION');
         var templatestrList= new Array('<dv-quantity gui-data="nodeData.children[{{}}]" gui-control="dvquantityControl"></dv-quantity>','<dv-text gui-data="nodeData" gui-control="dvtextControl" selected-Element="$parent.selectedElement"></dv-text>',
                                    '<dv-ordinal gui-data="nodeData" gui-control="dvordinalControl"></dv-ordinal>','<dv-datetime gui-data="nodeData" gui-control="dvdatetimeControl"></dv-datetime>','<dv-datetime gui-data="nodeData" gui-control="dvdatetimeControl"></dv-datetime>',
                                    '<dv-count gui-data="nodeData" gui-control="dvcountControl"></dv-count>','<dv-boolean gui-data="nodeData" gui-control="dvbooleanControl"></dv-boolean>',
                                    '<dv-codedtext gui-data="nodeData" gui-control="dvcodedtextControl"></dv-codedtext>','9');
         
        return {
        restrict : 'E',
        transclude:true,
        scope : {
            UIData:'=guiData',
        },
        controller:function($scope,$element){
        },
        
        link : function(scope,element, attrs) {  
           var childData=scope.UIData.children;   
           for(i=0;i<childData.lengh;i++){
                var type=nodeData.label.dataType;
                 var html="";
                 if(type){
                    for( var i=0;i<9;i++){
                         type=nodeData.label.dataInfo[0].dataType;
                         if(type==datatypeList[i])
                         {
                            html+=templatestrList[i]; 
                         }
                     };
                 }
           }
           angular.forEach(childData,function(child){
                
           });          
           var template='<div class="{{UIData.label.picType}}" id={{UIData.label.picType}}+"_"+UIData.label.labelContent">'+
                   '<img ng-class="{{UIData.label.picType}}"></img>'+
                   '<span>{{UIData.label.labelContent}}</span>'+'</div>';
           if (scope.UIData) {
               element.html('').append($compile( template )(scope));
            }
        },
        };
});
