angular.module('clever.management.directives.treeViewNode', []).directive('treeViewNode', function($compile) {
	return {
		restrict : 'E',
		link : function(scope, elm, attrs) {

			var nodeAliasName = scope.getNodeAliasName();
			var nodeData = scope[nodeAliasName] = scope.$eval(attrs[nodeAliasName]);
			if (nodeData.collapsed == undefined) {
				nodeData.collapsed = true;
			}
			nodeData.show = true;
			scope.getNodes().push(nodeData);
			scope.childNodes = nodeData[scope.getNodeChildren()];
			var parentIndex = attrs.nodeIndex || '';
			var prefix = scope.menuPrefix || '';
			var template = '<ul>' + 
								'<li role="context-menu" ng-class="' + nodeAliasName + '.collapsed ? \'collapsed\' : \'expanded\'">' + 
									'<span ng-if="childNodes.length" ng-show="!' + nodeAliasName + '.collapsed" ng-click="selectNodeHead(' + nodeAliasName + ')">' + 
										scope.getExpandedIconElement() + 
									'</span>' + 
									'<span ng-if="childNodes.length" ng-show="' + nodeAliasName + '.collapsed" ng-click="selectNodeHead(' + nodeAliasName + ')">' + 
										scope.getCollapsedIconElement() + 
									'</span>' + 
									'<span context-menu="onShow(node)" data-target="' + prefix + parentIndex + '.{{$index}}"' + 'ng-class="' + nodeAliasName + '.selected"' + ' ng-click="clickNodeLabel(' + nodeAliasName + ')" ng-dblclick="doubleClickNodeLabel(' + nodeAliasName + ')">' + 
										'<span ng-if="!childNodes.length" style="visibility: hidden;">' + scope.getExpandedIconElement() + '</span>' + 
										'<span ng-class="' + nodeAliasName + '.selected">' + scope.getNodeLabel(nodeData) + '</span>' + 
									'</span>' + 
									'<span class="dropdown position-fixed" id="' + prefix + parentIndex + '.{{$index}}">' + scope.getNodeMenuFormElement() +
								    '</span>'+
									'<tree-view-node ' + 
										'ng-repeat="_node in childNodes track by $index" ' + 
										'ng-hide="_node.parent.collapsed || !_node.show" ' + 
										'ng-init="_node.parent = ' + nodeAliasName + '" ' + 'node-index="' + parentIndex + '.{{$index}}"' +  nodeAliasName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + '="_node">' + 
									'</tree-view-node>' + 
								'</li>' + 
							'</ul>';

			var templateWithMenu = '<ul>' + 
			                           '<li role="context-menu">' + 
			                             '<span ng-if="childNodes.length" ng-show="!' + nodeAliasName + '.collapsed" ng-click="selectNodeHead(' + nodeAliasName + ')">' + scope.getExpandedIconElement() + '</span>' + 
		                                 '<span ng-if="childNodes.length" ng-show="' + nodeAliasName + '.collapsed" ng-click="selectNodeHead(' + nodeAliasName + ')">' + scope.getCollapsedIconElement() + '</span>' + 
			                             '<span context-menu="onShow(' + nodeAliasName + ')" data-target="' + prefix + parentIndex + '.{{$index}}"' + 'ng-class="' + nodeAliasName + '.selected"' + 'ng-click="clickNodeLabel(' + nodeAliasName + ')" ng-dblclick="doubleClickNodeLabel(' + nodeAliasName + ')">' + 
			                             '<span ng-if="!childNodes.length" style="visibility: hidden;">' + scope.getExpandedIconElement() + '</span>' + 
			                              scope.getNodeLabel(nodeData, nodeAliasName) + '</span>' + 
			                             '<span class="dropdown position-fixed" id="' + prefix + parentIndex + '.{{$index}}">' + scope.getNodeMenu(nodeData, nodeAliasName) + '</span>' + 
			                             '<tree-view-node ' + 'ng-repeat="_node in childNodes" ' + 'ng-hide="_node.parent.collapsed || !_node.show" ' + 'ng-init="_node.parent = ' + nodeAliasName + '" ' + 'node-index="' + parentIndex + '.{{$index}}"' + nodeAliasName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + '="_node">' + '</tree-view-node>' + 
			                           '</li>' + 
			                       '</ul>';

			if (nodeData) {
				if (scope.isContextMenu()) {
					elm.html('').append($compile( templateWithMenu )(scope));
				} else {
					elm.html('').append($compile( template )(scope));
				}
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
				
			  //  scope.clickNoeLabel(selectedNode);
			};

			scope.clickNodeLabel = function(selectedNode) {
				var node = scope.getCurrentNode();
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

			scope.operateNodeByContextMenu = function(node, type, value) {
				scope.clickNodeMenu(node, type, value);
			};

			// scope.editNodeByMenu = function(node, type) {
				// scope.clickEditNodeMenu(node, type);
			// };
			
			scope.specialiseNodeByMenu = function(node) {
				var specialisedArchetype = scope.specialiseArchetype(node);
				node.collapsed = false;
				scope.clickNodeLabel(specialisedArchetype);

				scope.doubleClickNode(specialisedArchetype);
			};
			scope.deleteNodeByMenu = function(node) {
				console.log("delete archetype here");
				console.log(node);
				scope.deleteArchetype(node);
			};
			// scope.clickNodeMenu = function(operateType, node){
				// console.log(operateType);
				// console.log(node);
				// scope.clickMenu(operateType, node);
			// };
			scope.onShow = function(node) {
				scope.clickNodeLabel(node);
			};
		},
	};
});
