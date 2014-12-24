angular.module('clever.management.directives.templateListTreeNode', []).directive('templateListTreeNode',
function($compile,$document) {
	return {
		require: ['^templateListTree','dvText'],
		restrict : 'E',
		scope : {
			nodeData : '=',
			treeScope : '=',
			selectNodeCallback : '=',
		},
		link : function(scope, element, attrs,controllers) { 
			var templateTreeCtrl=controllers[0];
			var guiCtrl=controllers[1];
		
		    
			scope.nodeData.collapsed = true;
			scope.treeScope.nodes.push(scope.nodeData); 
			
			var template = '<ul>' +
								'<li>' +
									'<img class="collapsed" ng-show="nodeData.children.length && nodeData.collapsed" ng-click="selectNodeHead(nodeData)"></img>' +
									'<img class="expanded" ng-show="nodeData.children.length  && !nodeData.collapsed" ng-click="selectNodeHead(nodeData)"></img>' +
									'<span ng-show="!nodeData.children.length" style="padding: 1px 5px;width: 15px;"/>' +
									'<i class="normal" ng-hide="nodeData.children.length"></i> ' +
									'<img ng-class="nodeData.label.picType"></img>' +
									'<span ng-class="nodeData.selected"  ng-click="selectNodeLabel(nodeData)" ng-dblclick="doubleClickNodeLabel(nodeData)">' +
										'{{nodeData.label.labelContent}}' +
									'</span>' +
									'<template-list-tree-node ng-hide="nodeData.collapsed" ng-repeat="node in nodeData.children" ng-init="node.parent = nodeData" tree-scope="treeScope" node-data="node" select-node-callback="selectNodeCallback"></template-tree-list-node>' +
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
			};
			
			scope.drag=function(selectedNode){
				var divarea=document.getElementById("editArea");
				var temp=
				divarea.append()
				
			};
			
		    
		  /*  element.on=function(selectedNode){
		    	alert('selectedNode.lable.contentLabel');
		    	
		    };
		    scope.mouseup = function(selectedNode) {
	           console.log('Touch end');
           };*/
		},
	};
});
