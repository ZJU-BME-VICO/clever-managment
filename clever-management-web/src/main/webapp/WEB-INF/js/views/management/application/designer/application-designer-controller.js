function DesignerCtrl($scope,resourceService){
	$scope.test = 'abc';
	$scope.language = [];
	$scope.defination={};
	var xmlDoc;
	var xmlhttp=new window.XMLHttpRequest();
	var url='js/views/management/application/designer/111.xml';
	//var url="111.xml";
    if(xmlhttp!=null){

	xmlhttp.open("GET",url,false);
	xmlhttp.send(null);
	}
	if(xmlhttp.readyState==4 && xmlHttp.status == 200)
	{
		xmlDoc=xmlhttp.responseXML.documentElement;
	}
    	
		var x2js = new X2JS();
	    var template = x2js.xml_str2json(xmlDoc).template;//对象里 有没有template属性？
	//$scope.init=function(){
		//var tmp=templateRetrieveService.getTemplateXmlByName(templateName);
		//tmp是xml?假设是吧
		
	//    var parseResult=templateParseService.parseTemplate(template);
	//}
	
//变量传递过程？ html(tmpname)-->retrievectrl(getdata)-->ctrl

}

