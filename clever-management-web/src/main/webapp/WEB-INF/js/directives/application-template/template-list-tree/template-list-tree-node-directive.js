angular.module('clever.management.directives.templateListTreeNode', []).directive('templateListTreeNode',
function($compile,$document) {
    var addin=angular.element('<dv-quantity gui-data="nodeData" gui-control="dvquantityControl"></dv-quantity>');
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
		    $scope.nodeControl={
		      /*cloneItems:function(){
		        var select=$scope.nodeScope.currentNode;
                var id="#"+select.label.code+"_"+select.label.labelContent;          
                var startX=0,startY,startZ=0,x=0,y=0;
                $(".float").css({
                    position:"relative",    
                    backgroundColor: 'lightgrey',
                    cursor: 'pointer' ,
                    width:'50px',   
                    height:'20px'   
                });
                $(".float").hide();  
                $element.on('mousedown',function(event){
                    event.preventDefault();
                    startX=event.screenX - x;
                    startY=event.screenY - y;  
                 $(id).clone().appendTo(".float"); 
                 $document.on('mousemove',mousemove);
                 $document.on('mouseup',mouseup);               
                
               });
               
           
                function mousemove(event){
                 $(".float").show();  //append after then present element               
                 $(".float").css({
                    display:"block"  
                 });
                 y=event.screenY-startY;
                 x=event.screenX-startX;
                 $(".float").css({
                    top:y+'px',
                    left:x+'px'
                });
                 };
                function mouseup(){
                  $(id).clone().appendTo("#editArea");//clone all ui contet
                  $("#editArea").append(addin);
                  y=event.screenY-startY;
                  x=event.screenX-startX;
                  $(id).css({
                    top:y+'px',
                    left:x+'px'
                   });
                    $(".float").empty();
                    $(".float").hide();                 
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                };
        },*/
        };
        },

		link : function(scope,element, attrs) { 	 		    
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
									'<template-list-tree-node ng-hide="nodeData.collapsed" ng-repeat="node in nodeData.children" ng-init="node.parent = nodeData" tree-scope="treeScope" node-data="node" select-node-callback="selectNodeCallback"  ng-mousedown="cloneItems()"></template-tree-list-node>' +
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
				scope.nodeScope.currentNode = selectedNode;
				scope.nodeData=selectedNode;				
			};
    			
	},
	};
});
