function DesignerCtrl($scope,resourceService,$q,templateParseService,archetypeParseService,busyService,treeDataFormatService, $compile,STORAGE_TEMPLATE_LIST_EDIT_PUBLISHED_URL,STORAGE_TEMPLATE_LIST_URL,ARCHETYPE_BY_NAME_URL,STORAGE_TEMPLATE_LIST_EDIT_DRAFT_URL,STORAGE_TEMPLATE_BY_NAME_URL,ARCHETYPE_LIST_URL){
	$scope.language = [];
	$scope.defination={};
	$scope.templateDetail=[];
	$scope.tplist=[];
	$scope.isTemolateListHidden = false;
	$scope.controlList=['btnFn','labelFn'];
	$scope.selectedElement="初始化";
	$scope.tempControl={};
	
	$scope.newtemplateList={};
    $scope.templateFiles = {
        draft : [],
        published : []
    };
        
    $scope.getTemplateDetail=function(node){
        var url=node.name;
      /*  var pos=tempName.lastIndexOf(".v");        
        var url=tempName.substring(0,pos)+"."+node.latestTemplateVersion;*/
        resourceService.get(STORAGE_TEMPLATE_BY_NAME_URL+url).then(function(temp){
        var xml=temp.oet;
        var x2js=new X2JS();
        var template=x2js.xml_str2json(xml).template;       
        var parseResult=templateParseService.parseTemplate(template);  
        var tempalteName=parseResult.template_name;
        if($scope.tplist.indexOf(tempalteName)==-1){
            $scope.tplist.push(tempalteName);
            var simplifyTree=processTreeContent(parseResult);
            $scope.templateDetail.push(simplifyTree);
         }       
        });
    };
    
    //change templtatelist view as other pages
    
    $scope.isTemplateListHidden = false;

    $scope.initData = function() {
        var busyDraft = busyService.pushBusy('BUSY_LOADING');
        resourceService.get(STORAGE_TEMPLATE_LIST_EDIT_DRAFT_URL).then(function(list) {
            $scope.templateFiles.draft = list;
            $scope.templateFiles.draftReady = true;
            generateTreeData();
            busyService.popBusy(busyDraft);
        });

        var busyPublished = busyService.pushBusy('BUSY_LOADING');
        resourceService.get(STORAGE_TEMPLATE_LIST_EDIT_PUBLISHED_URL).then(function(list) {
            $scope.templateFiles.published = list;
            $scope.templateFiles.publishedReady = true;
            generateTreeData();
            busyService.popBusy(busyPublished);
        });
    };

    function generateTreeData() {
        if ($scope.templateFiles.draftReady && $scope.templateFiles.publishedReady) {
            $scope.templateFiles.draftReady = false;
            $scope.templateFiles.publishedReady = false;
            var list = $scope.templateFiles.draft.concat($scope.templateFiles.published);
            $scope.originalTemplateList = list;
            $scope.formatedObject = treeDataFormatService.formatTreeData(list, 'children');
            $scope.newtemplateList = $scope.formatedObject.formatedList;
            //console.log($scope.templateList);
            if ($scope.needLocatedObjectName) {
                $timeout(function() {
                    $scope.locateTemplate(findTemplateByName($scope.needLocatedObjectName));
                    $scope.needLocatedObjectName = undefined;
                }, 0);
            }
        }

    }
    $scope.initData();

    console.log("Main Controller loaded.");
    $scope.isVisible = false;
  
    $scope.$watch('isVisible', function(){
        console.log('change');
    });
    
	$scope.$watch("selectedElement", function(newValue, oldValue) {
       if (newValue!=oldValue) {
            alert("watch"); 
            alert(newValue); 
        }
    });
	
	$scope.deleteElement=function(){
	    var aa=$scope.selectedElement;
	    alert("delete");
	    alert(aa);
	    var parent=document.getElementById('editArea');
	    var child=document.getElementById('editArea').currentElement;
	   // alert(child);
	};
	   
	$scope.collapse = function() {
		for(i=0;i<$scope.templateDetail.length;i++){
            var data=$scope.templateDetail[i];
            collapseAll(data.definitions);
        }
	};
	$scope.expand = function() {
	    for(i=0;i<$scope.templateDetail.length;i++){
	        var data=$scope.templateDetail[i];
	        expandAll(data.definitions);
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
	
	// delete archetype node for display
	function processTreeContent(tree){
	    var definition=[];
        processNode(tree.definitions,undefined,definition);
         return { 
            template_id:tree.template_id,
            template_name:tree.template_name,
           // template_contentName:template_contentName,
            definitions:definition     
       };
	};
	function processNode(tree,parent,archetypeTree){
	    if(angular.isArray(tree)){//route 1
          angular.forEach(tree,function(value){
              value.parent=parent;
              var currentNode={};
              currentNode.label=value.label;
                var typeT=currentNode.label.picType;
                if((typeList.indexOf(typeT)==-1)&&(attributeList.indexOf(typeT)==-1)){// ignore type
                   archetypeTree.push(currentNode);
                    if(value.children){
                        currentNode.children=[];
                        processNode(value.children,value,currentNode.children);
                     } 
                 }else{                           
                    if(value.children){
                        value=value.children;
                        if(angular.isArray(value)){
                            angular.forEach(value,function(item){
                                 item.parent=parent;
                                 var currentNode={};
                                 currentNode.label=item.label;
                                 var typeT=currentNode.label.picType;
                                 if((typeList.indexOf(typeT)==-1)&&(attributeList.indexOf(typeT)==-1)){// ignore type
                                      archetypeTree.push(currentNode);
                                      if(item.children){
                                          currentNode.children=[];
                                          processNode(item.children,item,currentNode.children);
                                       }
                                   }
                            });
                        }else{
                            if(value.children){
                             processNode(value,parent,archetypeTree);}
                         }
                  }  
             }      
	       });
    }else{
        var value=tree;
        value.parent=parent;
        var currentNode={};
        currentNode.label=value.label;
           currentNode.children=[];
            var typeT=currentNode.label.picType;
            if((typeList.indexOf(typeT)==-1)&&(attributeList.indexOf(typeT)==-1)){// ignore type
               archetypeTree.push(currentNode);
                if(value.children){
                    currentNode.children=[];
                    processNode(value.children,value,currentNode.children);
                 } 
             }else{                           
                if(value.children){
                    value=value.children;
                    if(angular.isArray(value)){
                        angular.forEach(value,function(item){
                             item.parent=parent;
                             var currentNode={};
                             currentNode.label=item.label;
                             var typeT=currentNode.label.picType;
                             if((typeList.indexOf(typeT)==-1)&&(attributeList.indexOf(typeT)==-1)){// ignore type
                                  archetypeTree.push(currentNode);
                                  if(item.children){
                                      currentNode.children=[];
                                      processNode(item.children,item,currentNode.children);
                                   }
                               }
                        });
                    }else{
                        if(value.children){
                         processNode(value.children,value,archetypeTree);}
                     }
              }  
           } 
        }
        };
    //var typeList = ['DV_COUNT', 'DV_TEXT', 'DV_DATE_TIME','DV_DATE', 'DV_QUANTITY', 'DV_BOOLEAN','DV_QUANTITY','DV_ORDINAL','DV_DURATION','DV_PROPORTION','CODE_PHRASE','DV_CODED_TEXT'];
    var typeList=[];
    var attributeList = ['value', 'magnitude','data','Tree','name','state','defining_code','events','items','Archetype'];

};

