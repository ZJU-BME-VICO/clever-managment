function DesignerCtrl($scope,resourceService,templateParseService,$compile){
	$scope.language = [];
	$scope.defination={};
	var url='js/views/management/application/designer/111.xml';
	//var url='js/views/management/application/designer/HeartFailure.xml';
	resourceService.get(url).then(function(result){
		var x2js = new X2JS();
	    var tmp = x2js.xml_str2json(result).template;
	    var parseResult=templateParseService.parseTemplate(tmp);
	    $scope.templateList=parseResult.definition.definitionTree;
	    $scope.nodeList=parseResult.definition.contentTree[1];
	});
   
   /* $scope.selectNode=function(node){
        var nodeData=node;
        var id="#"+nodeData.label.code+"_"+nodeData.label.labelContent; 
          $(id).clone().appendTo("#editArea");//clone all ui contet
         var addin=angular.element('<dv-text gui-data="nodeList" gui-control="dvtextControl"></dv-text>');
          var scope={//配置    绑定不同的数据到指令内部的作用域
            UIData:'=guiData',          
           };     
          $("#editArea").append($compile( addin )(scope));

    };*/
	$scope.treeControl = {};

	$scope.collapse = function() {
		$scope.treeControl.collapseAll();
	};

	$scope.expand = function() {
		$scope.treeControl.expandAll();
	};	$scope.nodeControl = {};
	
	//$scope.cloneItems=function(){
	  //  nodeData=$scope.treeControl.getCurrentNode();
	   // $scope.treeControl.cloneItem(nodeData);
	//};
	
	
}

