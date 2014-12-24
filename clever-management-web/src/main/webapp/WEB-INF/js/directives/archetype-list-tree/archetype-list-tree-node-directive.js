angular.module('clever.management.directives.archetypeListTreeNode', []).directive('archetypeListTreeNode',
function($compile) {
	return {
		require: '^archetypeListTree',
		restrict : 'E',
		scope : {
			nodeData : '=',
			treeScope : '=',
			selectNodeCallback : '=',
			highlightText : '=',
		},
		link : function(scope, element, attrs) { 
		
			scope.nodeData.collapsed = true;
			scope.treeScope.nodes.push(scope.nodeData); 
			
			var template = '<ul>' +
								'<li>' +
									'<img class="collapsed" ng-show="nodeData.specialiseArchetypeMasters.length && nodeData.collapsed" ng-click="selectNodeHead(nodeData)"></img>' +
									'<img class="expanded" ng-show="nodeData.specialiseArchetypeMasters.length && !nodeData.collapsed" ng-click="selectNodeHead(nodeData)"></img>' +
									'<span ng-show="!nodeData.specialiseArchetypeMasters.length" style="padding: 1px 5px;width: 15px;"/>' +
									'<i class="normal" ng-hide="nodeData.specialiseArchetypeMasters.length"></i> ' +
									'<span ng-class="nodeData.selected" ng-click="selectNodeLabel(nodeData)" ng-dblclick="doubleClickNodeLabel(nodeData)">' +
										'<img ng-class="nodeData.lifecycleState | lowercase"></img>' +
										'<span ng-bind-html="nodeData.conceptName | highlight:highlightText | unsafe"></span>' +
										'&nbsp<span style="color: grey;font-size: 10pt;">({{nodeData.latestArchetypeVersion}})</span>' +
									'</span>' +
									'<archetype-list-tree-node ' +
										'ng-hide="nodeData.collapsed || !node.show" ' +
										'ng-repeat="node in nodeData.specialiseArchetypeMasters" ' +
										'ng-init="node.parent = nodeData;node.show = true;" ' +
										'tree-scope="treeScope" ' +
										'node-data="node" ' +
										'highlight-text="highlightText" ' +
										'select-node-callback="selectNodeCallback">' +
									'</archetype-tree-list-node>' +
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
		},
	};
});
