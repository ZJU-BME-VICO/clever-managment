function DesignerCtrl($scope,resourceService,templateParseService,$compile,ARCHETYPE_BY_NAME_URL,TEMPLATE_BY_NAME_URL){
	$scope.language = [];
	$scope.defination={};
	//var url='js/views/management/application/designer/eReferral.xml';
	//var url='js/views/management/application/designer/Demo with hide on form.xml';
	var url='js/views/management/application/designer/openEHR-EHR-INSTRUCTION.request-imaging_exam.xml';
	resourceService.get(url).then(function(result){
		var x2js = new X2JS();
	    var tmp = x2js.xml_str2json(result);	    
	});
	resourceService.get(TEMPLATE_BY_NAME_URL+'openEHR-EHR-INSTRUCTION.request-imaging_exam.v1.1').then(function(temp){
	    var x2js=new X2JS();
	    var template=x2js.xml_str2json(temp).template;
	    $scope.templateList=template;
	});
	
	
	$scope.treeControl = {};

	$scope.collapse = function() {
		$scope.treeControl.collapseAll();
	};
	$scope.expand = function() {
		$scope.treeControl.expandAll();
	};
	$scope.saveTemplate = function() {
        $scope.treeControl.saveTemp();
    };
	
	
}

