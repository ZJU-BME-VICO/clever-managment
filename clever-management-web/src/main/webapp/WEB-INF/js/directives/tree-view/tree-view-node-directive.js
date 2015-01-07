angular.module('clever.management.directives.treeViewNode', []).directive('treeViewNode', function($compile) {
	return {
		restrict : 'E',
		link : function(scope, elm, attrs) {
			
			var nodeAliasName = scope.getNodeAliasName();
			var nodeData = scope[nodeAliasName] = scope.$eval(attrs[nodeAliasName]);		
			nodeData.collapsed = true;
			nodeData.show = true;
			scope.getNodes().push(nodeData);
			scope.childNodes = nodeData[scope.getNodeChildren()];
	
			var template = '<ul>' +
								'<li>' +
									'<span ng-if="childNodes.length" ng-show="!' + nodeAliasName + '.collapsed" ng-click="selectNodeHead(' + nodeAliasName + ')">' + scope.getExpandedIconElement() + '</span>' +
									'<span ng-if="childNodes.length" ng-show="' + nodeAliasName + '.collapsed" ng-click="selectNodeHead(' + nodeAliasName + ')">' + scope.getCollapsedIconElement() + '</span>' +
									'<span ng-class="' + nodeAliasName + '.selected" ng-click="clickNodeLabel(' + nodeAliasName + ')" ng-dblclick="doubleClickNodeLabel(' + nodeAliasName + ')">' + 
										'<span ng-if="!childNodes.length" style="visibility: hidden;">' + scope.getExpandedIconElement() + '</span>' +
										'<span class="' + scope.getNodeLabelClass() + '" ng-bind-html="' + scope.getNodeLabel(nodeData) + ' | unsafe"></span>' +
									'</span>' +
									'<tree-view-node ' +
										'ng-repeat="_node in childNodes" ' +
										'ng-hide="_node.parent.collapsed || !_node.show" ' +
										'ng-init="_node.parent = ' + nodeAliasName + '" ' +
										nodeAliasName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + '="_node">' +
									'</tree-view-node>' +
								'</li>' +
							'</ul>';
							
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
				scope.doubleClickNode(selectedNode);
			};

			scope.clickNodeLabel = function(selectedNode) {
				//remove highlight from previous node
				if (scope.getCurrentNode() && scope.getCurrentNode().selected) {
					scope.getCurrentNode().selected = undefined;
				}

				//set highlight to selected node
				selectedNode.selected = 'selected';

				//set currentNode
				scope.setCurrentNode(selectedNode);

				scope.clickNode(selectedNode);
			};
		},
	};
});

