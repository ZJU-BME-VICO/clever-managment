function DesignerCtrl($scope,resourceService,$q,templateParseService,$compile,STORAGE_TEMPLATE_LIST_URL,ARCHETYPE_BY_NAME_URL,STORAGE_TEMPLATE_BY_NAME_URL){
	$scope.language = [];
	$scope.defination={};
	$scope.templateDetail=[];

     resourceService.get(STORAGE_TEMPLATE_LIST_URL).then(function(list) {            
            $scope.templateList = list;
        });
	
	/* resourceService.get(STORAGE_TEMPLATE_BY_NAME_URL+'openEHR-EHR-INSTRUCTION.request-imaging_exam.v1.1').then(function(temp){
	    var xml=temp.oet;
	    var x2js=new X2JS();
	    var template=x2js.xml_str2json(xml).template;	    
	    var parseResult=templateParseService.parseTemplate(template);    
	    $scope.templateDetail=parseResult;
	});*/
	
	
	$scope.treeControl = {};
	
	$scope.getTemplateDetail=function(node){
	    var url=node.name+"."+node.latestTemplateVersion;
	    resourceService.get(STORAGE_TEMPLATE_BY_NAME_URL+url).then(function(temp){
        var xml=temp.oet;
        var x2js=new X2JS();
        var template=x2js.xml_str2json(xml).template;       
        var parseResult=templateParseService.parseTemplate(template);    
        $scope.templateDetail=parseResult.definitions;
        });
	};

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

