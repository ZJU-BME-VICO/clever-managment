angular.module('clever.management.directives.treeViewNode', []).directive('treeViewNode', function($compile) {
	return {
		restrict : 'E',
		require : '^treeView',
		link : function(scope, elm, attrs, treeCtrl) {
			
			var nodeAliasName = treeCtrl.getNodeAliasName();
	
			var template = '<ul>' +
								'<li>' +
									'<span ng-if="childNodes.length" ng-show="!' + nodeAliasName + '.collapsed" ng-click="selectNodeHead(' + nodeAliasName + ')">' + treeCtrl.getExpandedIconElement().innerHTML + '</span>' +
									'<span ng-if="childNodes.length" ng-show="' + nodeAliasName + '.collapsed" ng-click="selectNodeHead(' + nodeAliasName + ')">' + treeCtrl.getCollapsedIconElement().innerHTML + '</span>' +
									'<span ng-class="' + nodeAliasName + '.selected" ng-click="clickNodeLabel(' + nodeAliasName + ')" ng-dblclick="doubleClickNodeLabel(' + nodeAliasName + ')">' + 
										'<span ng-if="!childNodes.length" style="visibility: hidden;">' + treeCtrl.getExpandedIconElement().innerHTML + '</span>' +
										treeCtrl.getTreeNodeLabelElement().innerHTML + 
									'</span>' +
									'<tree-view-node ' +
										'ng-repeat="_node in childNodes" ' +
										'ng-hide="_node.parent.collapsed || !_node.show" ' +
										'ng-init="_node.parent = ' + nodeAliasName + '" ' +
										nodeAliasName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + '="_node">' +
									'</tree-view-node>' +
								'</li>' +
							'</ul>';
							
			var nodeData = scope[treeCtrl.getNodeAliasName()] = scope.$eval(attrs[treeCtrl.getNodeAliasName()]);		
			nodeData.collapsed = true;
			nodeData.show = true;
			treeCtrl.getNodes().push(nodeData);
			scope.childNodes = nodeData[treeCtrl.getNodeChildren()];

			if (nodeData) {
				elm.html('').append($compile( template )(scope));
			}

			scope.selectNodeHead = function(selectedNode) {
				//Collapse or Expand
				selectedNode.collapsed = !selectedNode.collapsed;
			};

			scope.doubleClickNodeLabel = function(selectedNode) {
				//Collapse or Expand
				selectedNode.collapsed = !selectedNode.collapsed;

				// call back
				treeCtrl.doubleClickNode(selectedNode);
			};

			scope.clickNodeLabel = function(selectedNode) {
				//remove highlight from previous node
				if (treeCtrl.getCurrentNode() && treeCtrl.getCurrentNode().selected) {
					treeCtrl.getCurrentNode().selected = undefined;
				}

				//set highlight to selected node
				selectedNode.selected = 'selected';

				//set currentNode
				treeCtrl.setCurrentNode(selectedNode);

				treeCtrl.clickNode(selectedNode);
			};
		},
	};
});

