angular.module('clever.management.services.templateParse',[]).service('templateParseService',function(resourceService,archetypeParseService,ARCHETYPE_BY_NAME_URL){
    this.parseTemplate=function(template){
    	var id=template.id.value;
    	var name=template.name;
    	var description=this.parseDescription(template);
      	var definitions=this.parseDefinition(template);// xml after deleting some node
    	return {
    		id:id,
    		name:name,
    		description:description,
    		definitions:definitions 		
       };
    };	
    this.parseDescription=function(template){    	   	
    };
    this.parseDefinition=function(template){
    	var operationalTemplate=[];
    	operationalTemplate.push({template_name:template.name,template_id:template.id.value});
    	operationalTemplate.children=[];
    	tranformOet(template.definition,operationalTemplate.children);    	
    	return operationalTemplate;
    };
    function tranformOet(node,listTree){//proess oet 第一个node是definition
        var nodeHere=node;
        if(angular.isArray(nodeHere)){
            angular.forEach(nodeHere,function(nodec){
            var archetype_name=nodec._archetype_id;
            var childNode=[];
            var archetype; 
            var optTree=[];  
            var Node={concept:nodec._concept_name,archetype_name:archetype_name}; //root node of archetype in oet   
            
            resourceService.get(ARCHETYPE_BY_NAME_URL+archetype_name).then(function(archetype){
                  parseResult = archetypeParseService.parseArchetypeXml(archetype.xml);
                  childNode.push(processRules(parseResult.definitions.treeItems,nodec));
                  /*if(nodec.Items){
                     for(i=0;i<nodec.Items.length;i++){
                         var newnode=[];
                         newnode.conceptName=nodec.Items[i]._concept_name;
                         newnode.archetype_name=nodec.Items[i]._archetype_id;
                         childNode.push(newnode);
                         childNode.children=[];
                     } 
                  } */
                  Node.children=childNode;
                  optTree.push(Node);   
                  if(optTree.length!=0){
                    listTree.push(optTree);
                    if(nodec.Items){
                        optTree.children=[];
                        tranformOet(nodec.Items,optTree.children);
                    }    
                    }   
             });
            });       
        }else{
               var nodec=nodeHere;
               var archetype_name=nodec._archetype_id;
               var childNode=[];
               var archetype; 
               var optTree=[];  
               var Node={concept:nodec._concept_name,archetype_name:archetype_name}; //root node of archetype in oet 
              resourceService.get(ARCHETYPE_BY_NAME_URL+archetype_name).then(function(archetype){
                  parseResult = archetypeParseService.parseArchetypeXml(archetype.xml);
                  childNode.push(processRules(parseResult.definitions.treeItems,nodec));
                  if(nodec.Items){
                     for(i=0;i<nodec.Items.length;i++){
                         var newnode=[];
                         newnode.conceptName=nodec.Items[i]._concept_name;
                         newnode.archetype_name=nodec.Items[i]._archetype_id;
                         childNode.push(newnode);
                         childNode.children=[];
                     } 
                  } 
                  Node.children=childNode;
                  var path=nodec._path;
                       if(path){//找cluster 原型的父节点,重新遍历书找到节点太麻烦了，，怎么处理
                          var reg=/\[|\]|\//;
                          var path_array=path.split(reg);
                          var name=path_array.slice(-3,-2);
                          var code=path_array.slice(-2,-1);  
                          processItems(tree,undefined,name,code,Node,undefined);
                       }
                  
                  optTree.push(Node);   
                  if(optTree.length!=0){
                    listTree.push(optTree);
                    if(nodec.Items){
                        optTree.children=[];
                        tranformOet(nodec.Items,optTree.children);
                    }    
                    }   
             });        
         }      
    }
    function processItems(tree,parent,name,code,name,arResult，newTree){
        if(angular.isArray(tree)){
            angular.forEach(tree,function(node){
                var tip=false;
                  if(node.label.code==code){//agree
                    if(value.parent.label.text){
                        value.children=arResult;
                        tip=false;
                    }}
            });
        }else{
            
        }
    }
    function getArchetypeInfo(node,optTree){//process archetype for oet
        var archetype_name=node._archetype_id+".xml";
        var childNode=[];
        var archetype; 
        var nodec=node;
        var archTree=[];  
        var Node={concept:node._concept_name,archetype_name:archetype_name}; //root node of archetype in oet   
        
        resourceService.get(ARCHETYPE_BY_NAME_URL+archetype_name).then(function(archetype){
          parseResult = archetypeParseService.parseArchetypeXml(archetype);
          childNode.push(processRules(parseResult.definitions.treeItems,nodec));
          if(nodec.Items){
             for(i=0;i<nodec.Items.length;i++){
                 var newnode=[];
                 newnode.conceptName=nodec.Items[i]._concept_name;
                 newnode.archetype_name=nodec.Items[i]._archetype_id;
                 childNode.push(newnode);
                 childNode.children=[];
             } 
          } 
          Node.children=childNode;
          optTree.push(Node);    
          //return optTree; 
         });
             
    }
    function processRules(archetype,node){
       var tree=archetype;
       var parent;
       var archetypeTree=[];
       var ruleList=[];
       for(i=0;i<node.Rule.length;i++){//in the same one archetype
           var path=node.Rule[i]._path;
           var reg=/\[|\]|\//;
           var path_array=path.split(reg);
           code=path_array.slice(-3,-1); 
           var flag=node.Rule[i]._max;
           ruleList.push({code:code,flag:flag});        
           }
       getArchetypeDetail(tree,parent,ruleList,archetypeTree);
       return archetypeTree;        
    }

    function getArchetypeDetail(tree,parent,ruleList,archetypeTree) {            
        if(angular.isArray(tree)){//route 1
          angular.forEach(tree,function(value){
              value.parent=parent;
              var currentNode=nodeInfo(value);
              var tip=false;
              for(i=0;i<ruleList.length;i++){
                var name=ruleList[i].code[0];
                var node_id=ruleList[i].code[1]; 
                var flag=ruleList[i].flag;
                
                if(value.label.code==node_id){//agree
                    if(value.parent.label.text){
                       if(!(flag==0)){ 
                            archetypeTree.push(currentNode);                                      
                        } 
                        tip=true;
                        currentNode.children=[];
                        if(value.children){
                            getArchetypeDetail(value.children,value,ruleList,currentNode.children); 
                        }
                    }
                }}
                if(!tip){ // do not agree
                    archetypeTree.push(currentNode);
                    currentNode.children=[];
                    if(value.children){
                        getArchetypeDetail(value.children,value,ruleList,currentNode.children);
                     }
                }
         });
            }else{
                var value=tree;
                value.parent=parent;
                var currentNode=nodeInfo(value);
                var tip=false;
                for(i=0;i<ruleList.length;i++){
                    var name=ruleList[i].code[0];
                    var node_id=ruleList[i].code[1]; 
                    var flag=ruleList[i].flag;
                    if(value.label.code==node_id){//agree
                        if(value.parent.label.text){
                           if(!(flag==0)){ 
                                archetypeTree.push(currentNode);                                      
                            } 
                            tip=true;
                            currentNode.children=[];
                            if(value.children){
                                getArchetypeDetail(value.children,value,ruleList,currentNode.children); 
                            }
                        }
                    }
                }
                    if(!tip){ // do not agree
                        archetypeTree.push(currentNode);
                        currentNode.children=[];
                        if(value.children){
                            getArchetypeDetail(value.children,value,ruleList,currentNode.children);
                         }                  
                 }
              }
          }
      // function 
    function nodeInfo(node){
       var code,name,archtype_id,dataType,picType;
       if (node.label.code) {
           code = node.label.code;
        }

       return {
           label : {
                type : node.label.type,
                text : node.label.text,
                code:code,
                labelContent:name,
                dataType:dataType,
                picType:picType,
           }}; 
       
    }
        function MappingTerminology(code,archetype){  
        var name,datatype,code,archetypeName;
        var definitions=archetypeInfo.definitions;
        var terminologies=archetypeInfo.terminologies.terms[0].items;
        var reg=/\[|\]|\//;
        var path_array=path.split(reg);
        code=path_array.slice(-2);
        
        if(definitions.tableItems){//只用了原型解析里解析好的数据，很多没有数据类型，考虑重新按应用模板解析方法重新写
            if(angular.isArray(definitions.tableItems)){
                angular.forEach(definitions.tableItems,function(value){
                   if(value.code==code){
                       datatype=value.type;                                   
                   } 
                });
            };
        }
        for(i=0;i<terminologies.length;i++){
           if(terminologies[i].code==code){
               name=terminologies[i].text;
           }
       }  
        return {
            attrbutes:{
                name:name,
                datatype:datatype,
                code:code,
                archetypeName:archetypeName
             }
    };
    }
});