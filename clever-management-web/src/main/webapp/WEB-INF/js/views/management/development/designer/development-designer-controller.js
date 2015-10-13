function DesignerCtrl($scope,resourceService,$q,templateParseService,archetypeParseService,$compile,STORAGE_TEMPLATE_LIST_URL,ARCHETYPE_BY_NAME_URL,STORAGE_TEMPLATE_BY_NAME_URL,ARCHETYPE_LIST_URL){
	$scope.language = [];
	$scope.defination={};
	$scope.templateDetail=[];
	$scope.tplist=[];
	$scope.isTemolateListHidden = false;
	$scope.controlList=['btnFn','labelFn'];
	$scope.selectedElement="初始化";
	$scope.tempControl={};
	//test contextmenu
    $scope.player = {
            gold: 100
        };
        $scope.items = [
            { name: 'Small Health Potion', cost: 4 },
            { name: 'Small Mana Potion', cost: 5 },
            { name: 'Iron Short Sword', cost: 12 }
        ];
        $scope.menuOptions = [
            ['Buy', function ($itemScope) {
                $scope.player.gold -= $itemScope.item.cost;
            }],
            null,
            ['Sell', function ($itemScope) {
                $scope.player.gold += $itemScope.item.cost;
            }]
        ];
        
     //for template display don't delete!!
     resourceService.get(STORAGE_TEMPLATE_LIST_URL).then(function(list) {            
            $scope.templateList = list;
        });
        $scope.getTemplateDetail=function(node){
        var tempName=node.name;
        var pos=tempName.lastIndexOf(".v");        
        var url=tempName.substring(0,pos)+"."+node.latestTemplateVersion;
        resourceService.get(STORAGE_TEMPLATE_BY_NAME_URL+url).then(function(temp){
        var xml=temp.oet;
        var x2js=new X2JS();
        var template=x2js.xml_str2json(xml).template;       
        var parseResult=templateParseService.parseTemplate(template);  
        var tempalteName=parseResult.template_name;
        if($scope.tplist.indexOf(tempalteName)==-1){
            $scope.tplist.push(tempalteName);
           // $scope.templateDetail.push(parseResult.definitions);
             var simplifyTree=processTreeContent(parseResult.definitions);
            $scope.templateDetail.push(simplifyTree);
         }       
        });
    };
    
       
      //for archetype display
    /*  resourceService.get(ARCHETYPE_LIST_URL).then(function(list) {            
            $scope.templateList = list;
        });
      $scope.getTemplateDetail=function(node){
        var url=node.name+"."+node.latestArchetypeVersion;
        resourceService.get(ARCHETYPE_BY_NAME_URL+url).then(function(temp){
        var xml=temp.xml;
        var x2js=new X2JS();
        var archetype=x2js.xml_str2json(xml).archetype;       
        var parseResult=archetypeParseService.parseArchetype(archetype);  
        var archetypeName=node.name;
        if($scope.tplist.indexOf(archetypeName)==-1){
            $scope.tplist.push(archetypeName);
            var simplifyTree=processTreeContent(parseResult.definitions.treeItems);
            $scope.templateDetail.push(simplifyTree);
         }       
        });
    };*/
    
	//local file
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
	
	// delete archetype node for display
	function processTreeContent(tree){
	    var definition=[];
        processNode(tree,undefined,definition);
        return definition; 
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

