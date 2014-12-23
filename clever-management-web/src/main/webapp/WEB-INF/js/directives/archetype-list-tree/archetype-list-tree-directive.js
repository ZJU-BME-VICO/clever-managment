angular.module('clever.management.directives.archetypeListTree', []).directive('archetypeListTree', function() {
	return {
		restrict : 'E',
		scope : {
			treeData : '=',
			treeControl : '=',
			selectNodeCallback : '&',
		},
		template : '<archetype-list-tree-node ng-repeat="node in treeData" ng-show="node.show" ng-init="node.show = true" node-data="node" tree-scope="treeScope" select-node-callback="selectNode"></archetype-list-tree-node>',
		controller : function($scope) {

			$scope.treeScope = {
				currentNode : undefined,
				nodes : [],
			};

			$scope.selectNode = function(selectedNode) {
				$scope.selectNodeCallback({
					node : selectedNode
				});
			};

			$scope.treeControl = {
				expandAll : function() {
					angular.forEach($scope.treeScope.nodes, function(node) {
						node.collapsed = false;
					});
				},
				collapseAll : function() {
					angular.forEach($scope.treeScope.nodes, function(node) {
						node.collapsed = true;
					});
				},
				search : function(keyword) {
					if (keyword != '') {
						angular.forEach($scope.treeScope.nodes, function(node) {
							if (node.name.indexOf(keyword) < 0) {
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
						angular.forEach($scope.treeScope.nodes, function(node) {
							node.show = true;
							if (node.orginalCollapased != undefined) {
								node.collapsed = node.orginalCollapased;
								node.orginalCollapased = undefined;
							}
						});
					}
				},
			};

			$scope.$watch('treeData', function(newValue, oldValue) {
				if (newValue != oldValue) {
					$scope.treeScope = {
						currentNode : undefined,
						nodes : [],
					};
				}
			});
		},
		link : function(scope, element, attrs) {

		},
	};
});
