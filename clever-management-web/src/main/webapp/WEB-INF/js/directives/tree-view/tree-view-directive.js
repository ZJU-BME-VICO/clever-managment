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
			clickNodeMenuCallback : '&',
			nodeMenuGenerator : '=',
			nodeLabelGenerator : '=',
			searchKeyMapper : '=',
			
			nodeMessageGenerator:'=',
			clickEditMenuCallback:'&',
			specialiseArchetypeCallback:'&',
			deleteArchetypeCallback:'&',
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
				//$scope.nodeMessageGenerator(node);
			};
			$scope.clickNodeMenu = function(node, type, value) {//for template edit
				$scope.clickNodeMenuCallback({
					node : node,
					type : type,
					value : value
				});
			};
			
			
			$scope.clickEditNodeMenu = function(node,type){
				
				$scope.clickEditMenuCallback({
					node:node,
					type:type,
				});
			};
			
			$scope.specialiseArchetype = function(node){
				$scope.specialiseArchetypeCallback({
					value:node,
				});
			};
			$scope.deleteArchetype = function(node){
				$scope.deleteArchetypeCallback({
					value:node,
				});
			};
			
			
			$scope.doubleClickNode = function(node) {
				//console.log(node);
				$scope.doubleClickNodeCallback({
					value : node,
				});
			};
			
			
			$scope.getNodeLabel = function(node, aliasName) {
				if (treeNodeLabelElement) {
					return '<span class="' + $scope.getNodeLabelClass() + '">' + $scope.getTreeNodeLabelElement() + '</span>';
				}else if($scope.nodeLabelGenerator){
					if ($scope.nodeMenuGenerator) {
						return $scope.nodeLabelGenerator(node, aliasName);
					} else {
						return '<span class="' + $scope.getNodeLabelClass() + 
							'" ng-bind-html="nodeLabelGenerator(' + $scope.getNodeAliasName() + ') | unsafe"></span>';
					}
				}
			};

			$scope.isContextMenu = function() {
				if ($scope.nodeMenuGenerator) {
					return true;
				} else {
					return false;
				}
			};

			$scope.getNodeMenu = function(node, aliasName) {
				if ($scope.nodeMenuGenerator) {
					return $scope.nodeMenuGenerator(node, aliasName);
				}
			};

			$scope.keyword = '';
			
			$scope.$watch('treeData', function(newValue, oldValue) {
				if (newValue != oldValue) {
					currentNode = undefined;
					nodes = [];
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
				search : function(keyword) {
					$scope.keyword = keyword;
					if (keyword != '') {
						// Reset node state before search
						angular.forEach(nodes, function(node) {
							node.containsTargetChild = undefined;
						});
						angular.forEach(nodes, function(node) {
							if ($scope.searchKeyMapper(node).toLowerCase().indexOf(keyword.toLowerCase()) < 0) {
								if (!node.containsTargetChild) {
									node.show = false;
								}
							} else {
								node.show = true;
								var tempNode = node;
								while (tempNode.parent) {
									tempNode = tempNode.parent;
									if (tempNode.orginalCollapased == undefined) {
										tempNode.orginalCollapased = tempNode.collapsed;
									}
									tempNode.show = true;
									tempNode.collapsed = false;
									tempNode.containsTargetChild = true;
								}
							}
						});
					} else {
						angular.forEach(nodes, function(node) {
							node.show = true;
							if (node.orginalCollapased != undefined) {
								node.collapsed = node.orginalCollapased;
								node.orginalCollapased = undefined;
							}
						});
					}
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
			
			scope.$watch('treeData', function(newValue, oldValue) {
				if (newValue === oldValue){return;}
				else if(newValue){
					//scope.nodes=[];
					console.log("this is tree data ====================================");
					console.log(scope.treeData);
					elm.html('').append($compile( template )(scope));
				}
			}); 

		},
	};
});