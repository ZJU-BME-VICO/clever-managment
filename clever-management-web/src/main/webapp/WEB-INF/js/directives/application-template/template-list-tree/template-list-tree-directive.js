angular.module('clever.management.directives.templateListTree', []).directive('templateListTree', function() {
	return {
		restrict : 'E',
		scope : {
			treeData : '=',
			treeControl : '=',
			selectNodeCallback : '&',
		},
		template : '<template-list-tree-node ng-repeat="node in treeData" node-data="node" tree-scope="treeScope" select-node-callback="selectNode" ng-mousedown="cloneItems(nodeData)"></template-list-tree-node>',
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
				selectedNodes:function(selectedNode){
				    $scope.selectNodeCallback({
                    node : selectedNode
                });
				},
				cloneItem:function(node){
				      // var select=$scope.selectNode();
				var select=node;      
                var id="#"+select.label.code+"_"+select.label.labelContent;          
                var startX=0,startY,startZ=0,x=0,y=0;
                $(".float").css({
                    position:"relative",    
                    backgroundColor: 'lightgrey',
                    cursor: 'pointer' ,
                    width:'50px',   
                    height:'20px'   
                });
                $(".float").hide();  
                $element.on('mousedown',function(event){
                    event.preventDefault();
                    startX=event.screenX - x;
                    startY=event.screenY - y;  
                 $(id).clone().appendTo(".float"); 
                 $document.on('mousemove',mousemove);
                 $document.on('mouseup',mouseup);               
                
               });
               
           
                function mousemove(event){
                 $(".float").show();  //append after then present element               
                 $(".float").css({
                    display:"block"  
                 });
                 y=event.screenY-startY;
                 x=event.screenX-startX;
                 $(".float").css({
                    top:y+'px',
                    left:x+'px'
                });
                 };
                function mouseup(){
                  $(id).clone().appendTo("#editArea");//clone all ui contet
                  $("#editArea").append(addin);
                  y=event.screenY-startY;
                  x=event.screenX-startX;
                  $(id).css({
                    top:y+'px',
                    left:x+'px'
                   });
                    $(".float").empty();
                    $(".float").hide();                 
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                };
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
