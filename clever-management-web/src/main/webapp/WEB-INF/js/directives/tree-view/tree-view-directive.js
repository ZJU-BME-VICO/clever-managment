angular.module('clever.management.directives.treeView', []).directive('treeView', function() {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			treeData : '=',
			treeControl : '=',
			nodeId : '@',
			nodeChildren : '@',
			selectNodeCallback : '&',
		},
		template : '<tree-view-node ' +
						'ng-repeat="node in treeData" ' +
						'ng-show="node.show" ' +
						'ng-init="node.show = true" ' +
						'node-data="node">' +
					'</tree-view-node>',
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
			
			this.selectNode = function(selectedNode) {
				$scope.selectNodeCallback({
					value : selectedNode
				});
			};
			
			$scope.$watch('treeData', function(newValue, oldValue) {
				if (newValue != oldValue) {
					nodes = [];
					currentNode = undefined;
				}
			});
			
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
	};
});