function DesignerCtrl($scope,resourceService,templateParseService,$compile,ARCHETYPE_BY_NAME_URL,STORAGE_TEMPLATE_BY_NAME_URL){
	$scope.language = [];
	$scope.defination={};
	//var url='js/views/management/application/designer/eReferral.xml';
	//var url='js/views/management/application/designer/Demo with hide on form.xml';
	/*var url='js/views/management/application/designer/openEHR-EHR-INSTRUCTION.request-imaging_exam.xml';
	resourceService.get(url).then(function(result){
		var x2js = new X2JS();
	    var tmp = x2js.xml_str2json(result).template;	    
	});*/
	
	 resourceService.get(ARCHETYPE_BY_NAME_URL+'openEHR-EHR-INSTRUCTION.request-imaging_exam.v1.xml').then(function(result){
                    var archetype=result;
                });
	
	 resourceService.get(STORAGE_TEMPLATE_BY_NAME_URL+'openEHR-EHR-INSTRUCTION.request-imaging_exam.v1.1').then(function(temp){
	    var xml=temp.content;
	    var x2js=new X2JS();
	    var template=x2js.xml_str2json(xml).template;
	    var parseResult=templateParseService.parseTemplate(template).definitions;
	    /*var url=parseResult[0].archetype_id;
	    var path=parseResult[0].leafInfo;
	    resourceService.get(ARCHETYPE_BY_NAME_URL+url).then(function(result){
                    var archetype=result;
                });*/
	    
	    
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

