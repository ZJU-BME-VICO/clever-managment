angular.module('clever.management.directives.archetypeListTreeNode', []).directive('archetypeListTreeNode',
function($compile) {
	return {
		require: '^archetypeListTree',
		restrict : 'E',
		scope : {
			nodeData : '=',
		},
		link : function(scope, element, attrs, treeCtrl) { 
		
			scope.nodeData.collapsed = true;
			scope.$watch(function() {
				return treeCtrl.getKeyword();
			}, function(newValue) {
				scope.highlightText = newValue;
			});
			treeCtrl.getNodes().push(scope.nodeData);

			var template = '<ul>' +
								'<li>' +
									'<img class="collapsed" ng-show="nodeData.specialisedArchetypeMasters.length && nodeData.collapsed" ng-click="selectNodeHead(nodeData)"></img>' +
									'<img class="expanded" ng-show="nodeData.specialisedArchetypeMasters.length && !nodeData.collapsed" ng-click="selectNodeHead(nodeData)"></img>' +
									'<span ng-style="{\'margin-left\': nodeData.specialisedArchetypeMasters.length ? \'5px\' : \'15px\'}" ng-class="nodeData.selected" ng-click="selectNodeLabel(nodeData)" ng-dblclick="doubleClickNodeLabel(nodeData)">' +
										'<img ng-class="nodeData.lifecycleState | lowercase"></img>' +
										'<span ng-bind-html="nodeData.conceptName | highlight:highlightText | unsafe"></span>' +
										'&nbsp;<span style="color: grey;font-size: 10pt;">({{nodeData.latestArchetypeVersion}})</span>' +
									'</span>' +
									'<archetype-list-tree-node ' +
										'ng-hide="nodeData.collapsed || !node.show" ' +
										'ng-repeat="node in nodeData.specialisedArchetypeMasters" ' +
										'ng-init="node.parent = nodeData;node.show = true;" ' +
										'node-data="node">' +
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
		},
	};
});
