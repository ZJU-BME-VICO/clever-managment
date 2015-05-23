angular.module('clever.management.directives.templateListTreeNode', []).directive('templateListTreeNode',
function($compile,$document) {
         var datatypeList= new Array('DV_QUANTITY','DV_TEXT','DV_ORDINAL', 'DV_DATE_TIME','DV_DATE', 'DV_COUNT', 'DV_BOOLEAN','DV_CODED_TEXT','DV_PROPORTION','DV_DURATION');
         var templatestrList= new Array('<dv-quantity gui-data="nodeData" gui-control="dvquantityControl"></dv-quantity>','<dv-text gui-data="nodeData" gui-control="dvtextControl" selected-Element="$parent.selectedElement"></dv-text>',
                                    '<dv-ordinal gui-data="nodeData" gui-control="dvordinalControl"></dv-ordinal>','<dv-datetime gui-data="nodeData" gui-control="dvdatetimeControl"></dv-datetime>','<dv-datetime gui-data="nodeData" gui-control="dvdatetimeControl"></dv-datetime>',
                                    '<dv-count gui-data="nodeData" gui-control="dvcountControl"></dv-count>','<dv-boolean gui-data="nodeData" gui-control="dvbooleanControl"></dv-boolean>',
                                    '<dv-codedtext gui-data="nodeData" gui-control="dvcodedtextControl"></dv-codedtext>','9');
         var floatDiv=angular.element('<div class="floatDiv" style="z-index:999" ng-show=true></div>');  
    	
    	return {
		require: ['^templateListTree'],
		restrict : 'E',
		transclude:true,
		scope : {
			nodeData : '=',
			treeScope : '=',
			selectNodeCallback : '=',
		},
		controller:function($scope,$element){
		    $scope.nodeScope={
		       currentNode : undefined,
                nodes : [], 
		    };	          
        },

		link : function(scope,element, attrs,tempControl) { 	 		    
			scope.nodeData.collapsed = true;
			scope.treeScope.nodes.push(scope.nodeData); 
			
			var template ='<ul id={{nodeData.label.code+"_"+nodeData.label.labelContent}}>' +
								'<li>'+
								    '<img class="collapsed" ng-show="nodeData.children.length && nodeData.collapsed" ng-click="selectNodeHead(nodeData)"></img>' +
                                    '<img class="expanded" ng-show="nodeData.children.length  && !nodeData.collapsed" ng-click="selectNodeHead(nodeData)"></img>' +
								    '<span ng-show="nodeData.children.length" style="padding: 1px 5px;width: 15px;"/>' +
                                    '<i class="normal" ng-hide="nodeData.children.length"></i> ' +
									'<img ng-class="nodeData.label.picType"></img>' +
									'<span ng-class="nodeData.selected"  ng-click="selectNodeLabel(nodeData)" ng-dblclick="doubleClickNodeLabel(nodeData)">' +
										'{{nodeData.label.labelContent}}' +
									'</span>' +
									'<template-list-tree-node ng-hide="nodeData.collapsed" ng-repeat="node in nodeData.children" ng-init="node.parent = nodeData" tree-scope="treeScope" node-data="node" select-node-callback="selectNodeCallback"  ng-mousedown="cloneItems(nodeData)"></template-tree-list-node>' +
								'</li>' +
							'</ul>';

			if (scope.nodeData) {
				element.html('').append($compile( template )(scope));
			}

			scope.selectNodeHead = function(selectedNode){
				//Collapse or Expand
				selectedNode.collapsed = !selectedNode.collapsed;
			};
			
			scope.doubleClickNodeLabel = function(selectedNode){
				//Collapse or Expand
	   //selectedNode.collapsed = !selectedNode.collapsed;				
				// call back
				//scope.selectNodeCallback(selectedNode); 
				
				//clone to edit area
				 var nodeData=selectedNode;
                 //var id="#"+nodeData.label.code+"_"+nodeData.label.labelContent; 
                 //$(id).clone().appendTo("#editArea");//clone all ui contet
                
                 var type=nodeData.label.dataType;
                 var html="";
                 if(type){
                    /* if(nodeData.parent.label.occurrences.upper_unbounded=="true"){
                            nodeData.label.tableName=nodeData.parent.label.labelContent;
                            html='<cluster gui-data="nodeData"></cluster>'
                         }*/
                     for( var i=0;i<9;i++){
                         type=nodeData.label.dataInfo[0].dataType;
                         
                         if(type==datatypeList[i])
                         {
                            html=templatestrList[i]; 
                         }
                     };
                 }else{
                      //html='<group-node-view gui-data="nodeData" gui-control="groupNodeViewControl"></group-node-view>';
                        //html='<template-list-tree tree-data="nodeData" ng-mousedown="cloneItems()" temp-control="tempControl"></template-list-tree>';
                   html='<dv-label gui-data="nodeData"></dv-label>';
                   }
              var addin=angular.element(html);              
              $("#editArea").append($compile( addin )(scope));
                 
                 
                // var data=[];
                 //data.push(nodeData);
                 //createTemplate(data,"#editArea");
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
                                
                                part_template='<cluster id={{currentDivId}} gui-data="nodeData"></cluster>';
                                
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
                                        part_template=templatestrList[i]; 
                                        
                                 };
                                 }
                             } 
                                  var parentDiv=document.getElementById(parentId);
                                  var addin=angular.element(part_template);
                                  $("#editArea").append($compile( part_template )(scope));
                                 // $(parentId).append(childDiv);                   
                         
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
                                    part_template=templatestrList[i]; 

                                 }
                             };
                             }
                         }                   
                          var parentDiv=document.getElementById(parentId);
                          var addin=angular.element(part_template);
                          var childDiv=ele.html('').append($compile( part_template )(scope));
                         $("#editArea").append(childDiv);  
                          //parentDiv.applyElement(childDiv);           
                     if(nodeData.children){
                         createTemplate(node.children,currentDivId); 
                     }
                 }
             };          
                    

			};		
					
			scope.selectNodeLabel = function(selectedNode) {
				//remove highlight from previous node
				if (scope.treeScope.currentNode && scope.treeScope.currentNode.selected) {
					scope.treeScope.currentNode.selected = undefined;
				}
				//set highlight to selected node
				selectedNode.selected = 'selected';
				//set currentNode
				scope.treeScope.currentNode = selectedNode;
				scope.nodeScope.currentNode = selectedNode;
				scope.nodeData=selectedNode;				
			};
    			
	},
	};
               
});
