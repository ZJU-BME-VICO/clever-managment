angular.module('clever.management.directives.storagetemplateListTreeNode', []).directive('storagetemplateListTreeNode',
function($compile,$document) {        
        return {
        require:'^storagetemplateListTree',
        restrict : 'E',
        scope : {
            treeData:'=',
            nodeData : '=',
            treeScope : '=',
            selectNodeCallback : '=',
            doubleClickNodeCallback:'=',
        },
        restrict : 'E',
        link : function(scope,element, attrs,treeCtrl) {             
            scope.nodeData.collapsed = true;
            scope.treeScope.nodes.push(scope.nodeData); 
            treeCtrl.getNodes().push(scope.nodeData);
            var template = '<ul id={{nodeData.name+"."+nodeData.latestTemplateVersion}}>' +
                                '<li>' +
                                    '<img ng-class="nodeData.picType"></img>' +
                                    '<span ng-class="nodeData.selected"  ng-dblclick="doubleClickNodeLabel(nodeData)">' +
                                        '{{nodeData.conceptName}}' +'('+'{{nodeData.latestTemplateVersion}}'+')'+
                                    '</span>' +
                                    '  <template-list-tree tree-data="templateDetail" ng-mousedown="cloneItems()"></template-list-tree> '+
                                '</li>' +
                            '</ul>';

            if (scope.nodeData) {
                element.html('').append($compile( template )(scope));
            }

            scope.selectNodeHead = function(selectedNode){
                //Collapse or Expand
                selectedNode.collapsed = !selectedNode.collapsed;
            };
            
            scope.doubleClickNodeLabel = function(selectedNode){
                //Collapse or Expand
                selectedNode.collapsed = !selectedNode.collapsed;
                // call back
                treeCtrl.selectNode(selectedNode);
            };      
                    
            scope.selectNodeLabel = function(selectedNode) {
                //remove highlight from previous node
                if (scope.treeScope.currentNode && scope.treeScope.currentNode.selected) {
                    scope.treeScope.currentNode.selected = undefined;
                }
                //set highlight to selected node
                selectedNode.selected = 'selected';
                //set currentNode
                scope.treeScope.currentNode = selectedNode;
               // scope.nodeScope.currentNode = selectedNode;
                scope.nodeData=selectedNode;                
            };
                
    },
    };
               
});
