angular.module('clever.management.directives.treeView', []).directive('treeView', function($compile) {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			treeData : '=',
			treeControl : '=',
			nodeId : '@',
			nodeChildren : '@',
			nodeAliasName : '@',
			clickNodeCallback : '&',
			doubleClickNodeCallback : '&',
		},
		controller : function($scope, $transclude) {
			
			var nodes = [];
			this.getNodes = function(){
				return nodes;
			};
			this.getCurrentNode = function(){
				return currentNode;
			};
			var currentNode = undefined;
			this.setCurrentNode = function(node){
				currentNode = node;
			};
			var nodeId = $scope.nodeId || 'id';
			this.getNodeId = function(){
				return nodeId;
			};
			var nodeChildren = $scope.nodeChildren || 'children';
			this.getNodeChildren = function(){
				return nodeChildren;
			};
			var nodeAliasName = $scope.nodeAliasName || 'nodeData';
			if (nodeAliasName == '_node') {
				throw 'Node alias name cannot be "_node".';
			}
			this.getNodeAliasName = function() {
				return nodeAliasName;
			}; 
			var expandedIconElement;
			this.getExpandedIconElement = function(){
				return expandedIconElement;
			};
			var collapsedIconElement;
			this.getCollapsedIconElement = function(){
				return collapsedIconElement;
			};
			var treeNodeLabelElement;
			this.getTreeNodeLabelElement = function(){
				return treeNodeLabelElement;
			};
			this.clickNode = function(node) {
				$scope.clickNodeCallback({
					value : node,
				});
			};
			this.doubleClickNode = function(node) {
				$scope.doubleClickNodeCallback({
					value : node,
				});
			}; 
			
			$scope.$watch('treeData', function(newValue, oldValue) {
				if (newValue != oldValue) {
					nodes = [];
					currentNode = undefined;
				}
			});
			
			$scope.treeControl = {
				expandAll : function() {
					angular.forEach(nodes, function(node) {
						node.collapsed = false;
					});
				},
				collapseAll : function() {
					angular.forEach(nodes, function(node) {
						node.collapsed = true;
					});
				},
			};
			
			$transclude(function(clone, scope) {
               	angular.forEach(clone, function(node) {
					if (isExpandedIcon(node)) {
						expandedIconElement = node;
					} else if (isCollapsedIcon(node)) {
						collapsedIconElement = node;
					} else if (isTreeNodeLabel(node)) {
						treeNodeLabelElement = node;
					}  else {
					}
				});
            });
            
            function isExpandedIcon(node){
				return node.tagName &&  (
				       node.hasAttribute('tree-expanded-icon') ||
				       node.tagName.toLowerCase() === 'tree-expanded-icon'
				);
			}
			
			function isCollapsedIcon(node){
				return node.tagName &&  (
				       node.hasAttribute('tree-collapsed-icon') ||
				       node.tagName.toLowerCase() === 'tree-collapsed-icon'
				);
			}
			
			function isTreeNodeLabel(node){
				return node.tagName &&  (
				       node.hasAttribute('tree-node-label') ||
				       node.tagName.toLowerCase() === 'tree-node-label'
				);
			}
		},
		link : function(scope, elm, attrs, ctrl){
			var template = '<tree-view-node ' +
								'ng-repeat="_node in treeData" ' +
								'ng-show="_node.show" ' +
								ctrl.getNodeAliasName().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + '="_node">' +
							'</tree-view-node>';
			
			scope.$watch('treeData', function(newValue) {
				if (newValue) {
					elm.html('').append($compile( template )(scope));
				}
			}); 

		},
	};
});