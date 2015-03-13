angular.module('clever.management.directives.storagetemplateListTree', []).directive('storagetemplateListTree', function() {
   return {
        restrict : 'E',
        scope : {
            treeData : '=',
            treeControl : '=',
            selectNodeCallback : '&',
        },
        template : '<storagetemplate-list-tree-node ' +
                        'ng-repeat="node in treeData" ' +
                        'ng-show="node.show" ' +
                        'ng-init="node.show = true" ' +
                        'node-data="node">' +
                    '</storagetemplate-list-tree-node>',
        
        controller : function($scope) {

            $scope.highlightText = '';

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
            var keyword = '';
            this.getKeyword = function(){
                return keyword;
            };

            this.selectNode = function(selectedNode) {
                $scope.selectNodeCallback({
                    value : selectedNode
                });
            };

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
                search : function(filter) {
                    keyword = filter;
                    if (keyword != '') {
                        // Reset node state before search
                        angular.forEach(nodes, function(node) {
                            node.containsTargetChild = undefined;
                        });
                        angular.forEach(nodes, function(node) {
                            if ((node.conceptName + '(' + node.latestArchetypeVersion + ')').toLowerCase().indexOf(keyword.toLowerCase()) < 0) {
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

            $scope.$watch('treeData', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    nodes = [];
                    currentNode = undefined;
                }
            });
        }, link : function(scope, element, attrs) {

        },
    };
});