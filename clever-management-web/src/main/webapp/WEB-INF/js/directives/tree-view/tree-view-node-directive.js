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
			var parentIndex = attrs.nodeIndex || '';

			var template = '<ul>' +
								'<li>' +
									'<span ng-if="childNodes.length" ng-show="!' + nodeAliasName + '.collapsed" ng-click="selectNodeHead(' + nodeAliasName + ')">' + scope.getExpandedIconElement() + '</span>' +
									'<span ng-if="childNodes.length" ng-show="' + nodeAliasName + '.collapsed" ng-click="selectNodeHead(' + nodeAliasName + ')">' + scope.getCollapsedIconElement() + '</span>' +
									'<span ng-class="' + nodeAliasName + '.selected" ng-click="clickNodeLabel(' + nodeAliasName + ')" ng-dblclick="doubleClickNodeLabel(' + nodeAliasName + ')">' + 
										'<span ng-if="!childNodes.length" style="visibility: hidden;">' + scope.getExpandedIconElement() + '</span>' +
										scope.getNodeLabel(nodeData) +
									'</span>' +
									'<tree-view-node ' +
										'ng-repeat="_node in childNodes" ' +
										'ng-hide="_node.parent.collapsed || !_node.show" ' +
										'ng-init="_node.parent = ' + nodeAliasName + '" ' +
										nodeAliasName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + '="_node">' +
									'</tree-view-node>' +
								'</li>' +
							'</ul>';

			var templateWithMenu = '<ul>' +
										'<li role="context-menu">' +
											'<span ng-if="childNodes.length" ng-show="!' + nodeAliasName + '.collapsed" ng-click="selectNodeHead(' + nodeAliasName + ')">' + scope.getExpandedIconElement() + '</span>' +
											'<span ng-if="childNodes.length" ng-show="' + nodeAliasName + '.collapsed" ng-click="selectNodeHead(' + nodeAliasName + ')">' + scope.getCollapsedIconElement() + '</span>' +
											'<span context-menu="onShow(' + nodeAliasName + ')" data-target="'+ parentIndex +'.{{$index}}"' + 
												'ng-class="' + nodeAliasName + '.selected"' + 'ng-click="clickNodeLabel(' + nodeAliasName + ')" ng-dblclick="doubleClickNodeLabel(' + nodeAliasName + ')">' + 
												'<span ng-if="!childNodes.length" style="visibility: hidden;">' + scope.getExpandedIconElement() + '</span>' +
												scope.getNodeLabel(nodeData, nodeAliasName) +
											'</span>' + 
											'<span class="dropdown position-fixed" id="'+ parentIndex +'.{{$index}}">' +
												scope.getNodeMenu(nodeData, nodeAliasName) +
											'</span>' +
											'<tree-view-node ' +
												'ng-repeat="_node in childNodes" ' +
												'ng-hide="_node.parent.collapsed || !_node.show" ' +
												'ng-init="_node.parent = ' + nodeAliasName + '" ' +
												'node-index="'+ parentIndex + '.{{$index}}"' +
												nodeAliasName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + '="_node">' +
											'</tree-view-node>' +
										'</li>' +
									'</ul>';
							
			if (nodeData) {
				if (scope.isContextMenu()) {
					elm.html('').append($compile( templateWithMenu )(scope));
				} else {
					elm.html('').append($compile( template )(scope));
				}
			}


           scope.nodeMenu = {
			 ACTION:["Time","Description","Ism_transition","Subject","Participation","Links"],
			 OBSERVATION:["Data","State","Subject","Participation","Links"],
			 EVALUATION:["Data","State","Subject","Participation","Links"],
			 INSTRUCTION:["Activity","Narrative","State","Subject","Participation","Links"],
			 ADMIN_ENTRY:["Data","State","Subject","Participation","Links"],	
			 ITEM_TREE:["TEXT","CODED_TEXT","QUANTITY","COUNT","DATE_TIME","DURATION","ORDINAL","BOOLEAN","INTERVAL","MULTIMEDIA","URI","IDENTIFIER","PROPERTION","CLUSTER"],
			 ITEM_LIST:	["TEXT","CODED_TEXT","QUANTITY","COUNT","DATE_TIME","DURATION","ORDINAL","BOOLEAN","INTERVAL","MULTIMEDIA","URI","IDENTIFIER","PROPERTION","CLUSTER"],
			 CLUSTER: ["TEXT","CODED_TEXT","QUANTITY","COUNT","DATE_TIME","DURATION","ORDINAL","BOOLEAN","INTERVAL","MULTIMEDIA","URI","IDENTIFIER","PROPERTION","CLUSTER"],
			};
            
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

			scope.setNodeByContextMenu = function(node, type, value) {
				scope.clickNodeMenu(node, type, value);
			};
			
			scope.editNodeByMenu = function(node,type){
				scope.clickEditNodeMenu(node,type);
			};
			scope.specialiseNodeByMenu = function(node){
				console.log("specialise archetype here");
				console.log(node);
				scope.specialiseArchetype(node);
				
			};
           scope.deleteNodeByMenu = function(node){
           	    console.log("delete archetype here");
           	    console.log(node);
           	    scope.deleteArchetype(node);
           };
			scope.onShow = function(node) {
				scope.clickNodeLabel(node);
			};
		},
	};
});
