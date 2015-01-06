angular.module('clever.management.directives.treeViewNode', []).directive('treeViewNode', function($compile) {
	return {
		restrict : 'E',
		require : '^treeView',
		scope : {
			nodeData : '=',
		},
		controller : function($scope) {
			
		},
		compile: function(elm, attrs, transclude) {
      		return{
        		pre: function preLink(scope, elm, attrs, treeCtrl){
      	  			
        		},
        		post :function postLink(scope, elm, attrs, treeCtrl) {
        			
					scope.nodeData.collapsed = true;

					treeCtrl.getNodes().push(scope.nodeData);
					
					var template = '<ul>' +
										'<li>' +
											'<span ng-show="nodeData.specialisedArchetypeMasters.length && nodeData.collapsed" ng-click="selectNodeHead(nodeData)">' + treeCtrl.getExpandedIconElement().innerHTML + '</span>' +
											'<span ng-show="nodeData.specialisedArchetypeMasters.length && !nodeData.collapsed" ng-click="selectNodeHead(nodeData)">' + treeCtrl.getCollapsedIconElement().innerHTML + '</span>' +
											'<span ng-class="nodeData.selected" ng-click="selectNodeLabel(nodeData)" ng-dblclick="doubleClickNodeLabel(nodeData)">' + treeCtrl.getTreeNodeLabelElement().innerHTML + '</span>' +
											'<tree-view-node ' +
												'ng-hide="nodeData.collapsed || !node.show" ' +
												'ng-repeat="node in childNodes" ' +
												'ng-init="node.parent = nodeData;node.show = true;" ' +
												'node-data="node">' +
											'</tree-view-node>' +
										'</li>' +
									'</ul>';

					if (scope.nodeData) {
						elm.html('').append($compile( template )(scope));
					}
					
					scope.childNodes = scope.nodeData[treeCtrl.getNodeChildren()];

					scope.selectNodeHead = function(selectedNode) {
						//Collapse or Expand
						selectedNode.collapsed = !selectedNode.collapsed;
					};

					scope.doubleClickNodeLabel = function(selectedNode) {
						//Collapse or Expand
						selectedNode.collapsed = !selectedNode.collapsed;

						// call back
						treeCtrl.selectNode(selectedNode);
					};

					scope.selectNodeLabel = function(selectedNode) {
						//remove highlight from previous node
						if (treeCtrl.getCurrentNode() && treeCtrl.getCurrentNode().selected) {
							treeCtrl.getCurrentNode().selected = undefined;
						}

						//set highlight to selected node
						selectedNode.selected = 'selected';

						//set currentNode
						treeCtrl.setCurrentNode(selectedNode);
					};
					
					//We need to transclude later, once the content container is ready.
					//when this link happens, we're inside a tab heading.
					//scope.$transcludeFn = transclude;
				},
        	};
     	},
	};
});

