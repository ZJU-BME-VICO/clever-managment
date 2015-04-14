angular.module('clever.management.directives.storagetemplateListTree', []).directive('storagetemplateListTree', function() {
        return {
        restrict : 'E',
        transclude:true,
        scope : {
            treeData : '=',
            treeControl : '=',
            selectNodeCallback : '&',
            clickNodeCallback : '&',
            doubleClickNodeCallback : '&',
        },
        template : '<storagetemplate-list-tree-node ng-transclue ng-repeat="node in treeData" node-data="node" tree-scope="treeScope" ng-mousedown="cloneItems(nodeData)"></storagetemplate-list-tree-node>',
        controller : function($scope,$element,$document) {
            
            $scope.treeScope = {
                currentNode : undefined,
                nodes : [],
            };
            var nodes = [];
            this.getNodes = function(){
                return nodes;
            };
            this.selectNode = function(selectedNode) {
                $scope.selectNodeCallback({
                    node : selectedNode
                });
            };
           /* $scope.doubleClickNode = function(node) {
                $scope.doubleClickNodeCallback({
                    value : node,
                });
            };*/
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