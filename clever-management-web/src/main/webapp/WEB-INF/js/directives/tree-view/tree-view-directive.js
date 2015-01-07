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
			nodeLabelClass : '@',
			clickNodeCallback : '&',
			doubleClickNodeCallback : '&',
			nodeLabelResources : '=',
			nodeLabelGenerator : '=',
		},
		controller : function($scope, $transclude) {
			
			var nodes = [];
			$scope.getNodes = function(){
				return nodes;
			};
			var currentNode = undefined;
			$scope.getCurrentNode = function(){
				return currentNode;
			};
			$scope.setCurrentNode = function(node){
				currentNode = node;
			};
			var nodeId = $scope.nodeId || 'id';
			$scope.getNodeId = function(){
				return nodeId;
			};
			var nodeChildren = $scope.nodeChildren || 'children';
			$scope.getNodeChildren = function(){
				return nodeChildren;
			};
			var nodeAliasName = $scope.nodeAliasName || 'nodeData';
			if (nodeAliasName == '_node') {
				throw 'Node alias name cannot be "_node".';
			}
			$scope.getNodeAliasName = function() {
				return nodeAliasName;
			}; 
			var nodeLabelClass = $scope.nodeLabelClass || '';
			$scope.getNodeLabelClass = function() {
				return nodeLabelClass;
			};
			var expandedIconElement;
			$scope.getExpandedIconElement = function(){
				return expandedIconElement.innerHTML;
			};
			var collapsedIconElement;
			$scope.getCollapsedIconElement = function(){
				return collapsedIconElement.innerHTML;
			};
			var treeNodeLabelElement;
			$scope.getTreeNodeLabelElement = function() {
				return treeNodeLabelElement.innerHTML;
			}; 
			$scope.clickNode = function(node) {
				$scope.clickNodeCallback({
					value : node,
				});
			};
			$scope.doubleClickNode = function(node) {
				$scope.doubleClickNodeCallback({
					value : node,
				});
			};
			$scope.getNodeLabel = function(node) {
				if (treeNodeLabelElement) {
					return 'getTreeNodeLabelElement()';
				}else if($scope.nodeLabelResources){
					return 'nodeLabelGenerator(' + nodeAliasName + ', nodeLabelResources)';
				}
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
		link : function(scope, elm, attrs){
			var template = '<tree-view-node ' +
								'ng-repeat="_node in treeData" ' +
								'ng-show="_node.show" ' +
								scope.getNodeAliasName().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + '="_node">' +
							'</tree-view-node>';
			
			scope.$watch('treeData', function(newValue) {
				if (newValue) {
					elm.html('').append($compile( template )(scope));
				}
			}); 

		},
	};
});