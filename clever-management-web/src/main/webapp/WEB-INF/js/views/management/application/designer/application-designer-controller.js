function DesignerCtrl($scope,resourceService,$q,templateParseService,$compile,STORAGE_TEMPLATE_LIST_URL,ARCHETYPE_BY_NAME_URL,STORAGE_TEMPLATE_BY_NAME_URL){
	$scope.language = [];
	$scope.defination={};
	$scope.templateDetail=[];
	$scope.tplist=[];
	$scope.controlList=['btnFn','labelFn'];
	$scope.selected="1";

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

    console.log("Main Controller loaded.");
    $scope.isVisible = false;
  
    $scope.$watch('isVisible', function(){
        console.log('change');
    });
    
	$scope.$watch("selected", function(newValue, oldValue) {
    if (newValue!=oldValue) {
        alert("watch"); 
        alert(newValue); 
    }
  });
	
	$scope.deleteElement=function(){
	    var aa=$scope.selected;
	    alert("delete");
	    alert(aa);
	    var parent=document.getElementById('editArea');
	    var child=document.getElementById('editArea').currentElement;
	   // alert(child);
	};
	
	$scope.getTemplateDetail=function(node){
	    var url=node.name+"."+node.latestTemplateVersion;
	    resourceService.get(STORAGE_TEMPLATE_BY_NAME_URL+url).then(function(temp){
        var xml=temp.oet;
        var x2js=new X2JS();
        var template=x2js.xml_str2json(xml).template;       
        var parseResult=templateParseService.parseTemplate(template);  
        var tempalteName=parseResult.template_name;
        if($scope.tplist.indexOf(tempalteName)==-1){
            $scope.tplist.push(tempalteName);
            $scope.templateDetail.push(parseResult.definitions);
         }
       
        });
	};
    
	$scope.collapse = function() {
		for(i=0;i<$scope.templateDetail.length;i++){
            var data=$scope.templateDetail[i];
            collapseAll(data);
        }
	};
	$scope.expand = function() {
	    for(i=0;i<$scope.templateDetail.length;i++){
	        var data=$scope.templateDetail[i];
	        expandAll(data);
	    }	
	};
	
	
	$scope.saveTemplate = function() {
        var html=$('#editArea').html();
        load("ss.html",html);
    };
    $scope.newTemplate = function() {
      document.getElementById('editArea').innerHTML="";
    };
    
    function fake_click(obj) {
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0 , false, false, false, false, 0, null);
        obj.dispatchEvent(ev);
    }
    
    function load(name,data){             
        var urlObject=window.URL||window.weblitURL||window;
        var export_blob=new Blob([data]); 
        var save_link=document.createElementNS("http://www.w3.org/1999/xhtml","a");
        save_link.href=urlObject.createObjectURL(export_blob);
        save_link.download=name;
        fake_click(save_link);
    }
    function collapseAll(data){
        if(angular.isArray(data)){
            angular.forEach(data, function(node) {
                node.collapsed = true;
                if(node.children){
                    collapseAll(node.children);
                }  
                });
        }else{
           data.collapsed = true;
           if(data.children){
             collapseAll(data.children);
           }
       }
    }
    function expandAll(data){
        if(angular.isArray(data)){
            angular.forEach(data, function(node) {
                node.collapsed = false;
                if(node.children){
                    expandAll(node.children);
                }  
                });
        }else{
           data.collapsed = false;
           if(data.children){
             expandAll(data.children);
           }
       }
    }
	
}

