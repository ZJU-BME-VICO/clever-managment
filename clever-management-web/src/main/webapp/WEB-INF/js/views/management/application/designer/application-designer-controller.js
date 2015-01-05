function DesignerCtrl($scope,resourceService,templateParseService,$compile){
	$scope.language = [];
	$scope.defination={};
	var url='js/views/management/application/designer/eReferral.xml';
	//var url='js/views/management/application/designer/Demo with hide on form.xml';
	//var url='js/views/management/application/designer/Heart Failure Clinic First Visit.xml';
	resourceService.get(url).then(function(result){
		var x2js = new X2JS();
	    var tmp = x2js.xml_str2json(result).template;
	    var parseResult=templateParseService.parseTemplate(tmp);
	    $scope.templateList=parseResult.definition.definitionTree;
	    // $scope.templateList=parseResult.termdefiniton;
	    $scope.nodeList=parseResult.definition.contentTree[1];
	    $scope.templateName=parseResult.concept;
	});
	
	$scope.treeControl = {};

	$scope.collapse = function() {
		$scope.treeControl.collapseAll();
	};
	$scope.expand = function() {
		$scope.treeControl.expandAll();
	};
	
	
}

