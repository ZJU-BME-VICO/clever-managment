function DesignerCtrl($scope,resourceService,templateParseService){
	$scope.language = [];
	$scope.defination={};
	var url='js/views/management/application/designer/111.xml';
	resourceService.get(url).then(function(result){
		var x2js = new X2JS();
	    var tmp = x2js.xml_str2json(result).template;//对象里 有没有template属性？
	    var parseResult=templateParseService.parseTemplate(tmp);
	});
	//var url="111.xml";
    	
	//$scope.init=function(){
		//var tmp=templateRetrieveService.getTemplateXmlByName(templateName);
		//tmp是xml?假设是吧
		
	//    var parseResult=templateParseService.parseTemplate(template);
	//}
	
//变量传递过程？ html(tmpname)-->retrievectrl(getdata)-->ctrl

}

