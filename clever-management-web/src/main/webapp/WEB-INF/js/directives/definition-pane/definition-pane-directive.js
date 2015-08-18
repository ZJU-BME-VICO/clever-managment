angular.module('clever.management.directives.definitionPane', []).directive('definitionPane', function() {
	return {
		restrict : 'E',
		scope : {
			definition : '=',
			terminology : '=',
		},
		templateUrl : 'js/directives/definition-pane/definition-pane.html',
		controller : function($scope, $element, $attrs) {
			$scope.selectedView = "Table";

			$scope.isExpandedAll = false;
			$scope.$watch('isExpandedAll', function(newValue, oldValue) {
				if ($scope.treeControl && newValue) {
					$scope.treeControl.expandAll();
				} else if ($scope.treeControl && !newValue) {
					$scope.treeControl.collapseAll();
				}
			});

			$scope.selectDefinitionItem = function(definitionItem) {
				$scope.selectedDefinitionItem = definitionItem.label;
			};

			
		},
		link : function($scope, elm, attrs) {
			$scope.getTreeNodeLabel = function(node) {
				var label = '';
				if (node.label.type == 'type') {
					label += '<span class="clever-icon ' + node.label.text + '" style="padding: 7px 7px; background-position-y: 8px;"></span>' + 
						     '<span style="color: brown;font-weight: bold;">&nbsp;' + node.label.text + '</span>';
				} else if (node.label.type == 'attribute') {
					label += '<span style="color: darkblue;">' + node.label.text + '</span>';
				}
				if (node.label.code) {
					label += '<span style="color: green;font-weight: bold;"> [' + getOntologyByCode(node.label.code, $scope.terminology).text + ']</span>';
				}
				return label;
			};

			$scope.getOntologyByCode = function(code) {
				return getOntologyByCode(code, $scope.terminology);
			};

			function getOntologyByCode(code, terminology) {
				if (terminology && code) {
					var matchedOntology;
					if (terminology.term) {
						angular.forEach(terminology.term.items, function(value) {
							if (value.code == code) {
								matchedOntology = value;
							}
						});
					}
					if (terminology.constraint) {
						angular.forEach(terminology.constraint.items, function(value) {
							if (value.code == code) {
								matchedOntology = value;
							}
						});
					}
					return matchedOntology;
				}
			}
			$scope.contentHeight = angular.isDefined(attrs.maxHeight) ? $scope.$parent.$eval(attrs.maxHeight) : undefined;
		}
	};
});
