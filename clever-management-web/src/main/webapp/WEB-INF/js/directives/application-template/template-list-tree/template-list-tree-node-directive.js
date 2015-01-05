angular.module('clever.management.directives.templateListTreeNode', []).directive('templateListTreeNode',
function($compile,$document) {
         var datatypeList= new Array('DV_QUANTITY','DV_TEXT','DV_ORDINAL', 'DV_DATE_TIME', 'DV_COUNT', 'DV_BOOLEAN','DV_PROPORTION','DV_DURATION','CODE_PHRASE','DV_CODED_TEXT');
         var templateList= new Array('<dv-quantity gui-data="nodeData" gui-control="dvquantityControl"></dv-quantity>','<dv-text gui-data="nodeData" gui-control="dvtextControl"></dv-text>',
                                    '<dv-ordinal gui-data="nodeData" gui-control="dvordinalControl"></dv-ordinal>','<dv-datetime gui-data="nodeData" gui-control="dvdatetimeControl"></dv-datetime>',
                                    '<dv-count gui-data="nodeData" gui-control="dvcountControl"></dv-count>','<dv-boolean gui-data="nodeData" gui-control="dvbooleanControl"></dv-boolean>',
                                    '7','8','9');
         var floatDiv=angular.element('<div class="floatDiv" style="z-index:999" ng-show=true></div>');  
    	return {
		require: ['^templateListTree'],
		restrict : 'E',
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

		link : function(scope,element, attrs,treeCotrol) { 	 		    
			scope.nodeData.collapsed = true;
			scope.treeScope.nodes.push(scope.nodeData); 
			
			var template = '<ul id={{nodeData.label.code+"_"+nodeData.label.labelContent}}>' +
								'<li>' +
									'<img class="collapsed" ng-show="nodeData.children.length && nodeData.collapsed" ng-click="selectNodeHead(nodeData)"></img>' +
									'<img class="expanded" ng-show="nodeData.children.length  && !nodeData.collapsed" ng-click="selectNodeHead(nodeData)"></img>' +
									'<span ng-show="!nodeData.children.length" style="padding: 1px 5px;width: 15px;"/>' +
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
				selectedNode.collapsed = !selectedNode.collapsed;				
				// call back
				scope.selectNodeCallback(selectedNode); 
				
				//clone to edit area
				 var nodeData=selectedNode;
                 //var id="#"+nodeData.label.code+"_"+nodeData.label.labelContent; 
                 //$(id).clone().appendTo("#editArea");//clone all ui contet
                 var type=nodeData.label.dataType;
                 var html="";
                 for( var i=0;i<9;i++){
                     if(type==datatypeList[i])
                     {
                        html=templateList[i]; 
                     }
                 };
                 var addin=angular.element(html);              
                 $("#editArea").append($compile( addin )(scope));
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
