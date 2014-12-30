function DesignerCtrl($scope,resourceService,templateParseService,$compile){
	$scope.language = [];
	$scope.defination={};
	//var url='js/views/management/application/designer/111.xml';
	var url='js/views/management/application/designer/HeartFailure.xml';
	resourceService.get(url).then(function(result){
		var x2js = new X2JS();
	    var tmp = x2js.xml_str2json(result).template;
	    var parseResult=templateParseService.parseTemplate(tmp);
	    $scope.templateList=parseResult.definition.definitionTree;
	    $scope.nodeList=parseResult.definition.contentTree[1];
	});
	
	$scope.treeControl = {};

	$scope.collapse = function() {
		$scope.treeControl.collapseAll();
	};
	$scope.expand = function() {
		$scope.treeControl.expandAll();
	};
	
	
}

