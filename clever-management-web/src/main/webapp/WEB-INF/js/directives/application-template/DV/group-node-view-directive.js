angular.module('clever.management.directives.groupNodeView', []).directive('groupNodeView',
function($compile,$document,$timeout) {
     var datatypeList= new Array('DV_QUANTITY','DV_TEXT','DV_ORDINAL', 'DV_DATE_TIME','DV_DATE', 'DV_COUNT', 'DV_BOOLEAN','DV_CODED_TEXT','DV_PROPORTION','DV_DURATION');
     var templateStrList= new Array('<dv-quantity gui-data="nodeData" gui-control="dvquantityControl"></dv-quantity>','<dv-text gui-data="nodeData" gui-control="dvtextControl" selected-Element="$parent.selectedElement"></dv-text>',
                                    '<dv-ordinal gui-data="nodeData" gui-control="dvordinalControl"></dv-ordinal>','<dv-datetime gui-data="nodeData" gui-control="dvdatetimeControl"></dv-datetime>','<dv-datetime gui-data="nodeData" gui-control="dvdatetimeControl"></dv-datetime>',
                                    '<dv-count gui-data="nodeData" gui-control="dvcountControl"></dv-count>','<dv-boolean gui-data="nodeData" gui-control="dvbooleanControl"></dv-boolean>',
                                    '<dv-codedtext gui-data="nodeData" gui-control="dvcodedtextControl"></dv-codedtext>','9');
        
    return{
        restrict:'E',
        transclude:true,
        scope:{
            UIData:'=guiData',
        },  
        controller:function($scope){
            $scope.groupNodeViewControl={};
        },
        link:function(scope,ele,attrs){
             var parentDivId="#editArea";
             var count=0;
             var data=[];
             data.push(scope.UIData);
             createTemplate(data,parentDivId);
             
             function createTemplate(node,parentId){
                 if(angular.isArray(node)){
                   angular.forEach(node,function(data){
                         var nodeData=data;
                         var currentDivId;
                         var part_template;
                         var childDiv;
                         if(nodeData.label){
                             var currentDivId;
                             var part_template;
                             var childDiv;
                             if(!nodeData.label.dataType){
                                currentDivId="#"+nodeData.label.picType+'_'+nodeData.label.labelContent;
                                imgClass=nodeData.label.picType;
                                textContent=nodeData.label.labelContent;
                                
                                part_template='<cluster gui-data="nodeData"></cluster>';
                                
                               /* part_template='<div class="{{nodeData.label.picType}}" id={{nodeData.label.picType}}+"_"+nodeData.label.labelContent">'+
                                              '<img ng-class="{{nodeData.label.picType}}"></img>'+
                                              '<span>{{nodeData.label.labelContent}}</span>'+'</div>'; 
                                part_template='<div id={{currentDivId}}>'+
                                  '<img ng-class={{imgClass}}></img>'+
                                  '<span>{{textContent}}</span>'+'</div>';  */                                   
                             }else{
                                 var type=nodeData.label.dataType;
                                 currentDivId="#"+nodeData.label.labelContent+"_"+nodeData.label.code;
                                 for( var i=0;i<9;i++){
                                     if(type==datatypeList[i])
                                     {
                                        part_template=templateStrList[i]; 
                                        
                                 };
                                 }
                             } 
                              $timeout(function(){
                                  var parentDiv=document.getElementById(parentId);
                                  var addin=angular.element(part_template);
                                  var childDiv=ele.html('').append($compile( part_template )(scope));
                                  $(parentId).append(childDiv); },0);                  
                         
                          //parentDiv.applyElement(childDiv); 
                         if(nodeData.children){
                             createTemplate(nodeData.children,currentDivId); 
                         }
                         }
                   });
                  
                 }
                else{
                   var nodeData=node;
                   if(nodeData.label){
                         var currentDivId;
                         var part_template;
                         var childDiv;
                         if(!nodeData.label.dataType){
                            currentDivId=nodeData.label.picType+'_'+nodeData.label.labelContent;
                            imgClass=nodeData.label.picType;
                            textContent=nodeData.label.labelContent;
                            
                             part_template='<cluster gui-data="nodeData"></cluster>';
                             
                           /* part_template='<div class="{{nodeData.label.picType}}" id={{nodeData.label.picType}}+"_"+nodeData.label.labelContent">'+
                                          '<img ng-class="{{nodeData.label.picType}}"></img>'+
                                          '<span>{{nodeData.label.labelContent}}</span>'+'</div>'; 
                            part_template='<div id={{currentDivId}}>'+
                              '<img ng-class={{imgClass}}></img>'+
                              '<span>{{textContent}}</span>'+'</div>';       */                              
                         }else{
                             var type=nodeData.label.dataType;
                             currentDivId=nodeData.label.labelContent+"_"+nodeData.label.code;
                             for( var i=0;i<9;i++){
                                 if(type==datatypeList[i])
                                 {
                                    part_template=templateStrList[i]; 

                                 }
                             };
                             }
                         }                   
                          var parentDiv=document.getElementById(parentId);
                          var addin=angular.element(part_template);
                          var childDiv=ele.html('').append($compile( part_template )(scope));
                         $(parentId).append(childDiv);  
                          //parentDiv.applyElement(childDiv);           
                     if(nodeData.children){
                         createTemplate(node.children,currentDivId); 
                     }
                 }
             };          
        },
        
    };
});