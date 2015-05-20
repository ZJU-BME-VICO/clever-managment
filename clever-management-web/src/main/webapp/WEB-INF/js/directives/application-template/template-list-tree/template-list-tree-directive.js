angular.module('clever.management.directives.templateListTree', []).directive('templateListTree', function() {
		return {
		restrict : 'E',
		transclude : true,
		scope : {
			treeData : '=',
			tempControl : '=',
		},
		template : '<template-list-tree-node ng-repeat="node in treeData" node-data="node" tree-scope="treeScope" select-node-callback="selectNode" ng-mousedown="cloneItems(nodeData)">'
		            +'</template-list-tree-node>',
		controller : function($scope,$element,$document) {
		
			$scope.treeScope = {
				currentNode : undefined,
				nodes : [],
			};
			
			$scope.selectNode = function(selectedNode) {
				$scope.selectNodeCallback({
					node : selectedNode
				});
			};
			
			$scope.tempControl = {};
			
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
