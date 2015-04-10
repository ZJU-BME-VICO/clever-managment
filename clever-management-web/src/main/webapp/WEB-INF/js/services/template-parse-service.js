angular.module('clever.management.services.templateParse',[]).service('templateParseService',function(resourceService,$q,archetypeParseService,ARCHETYPE_BY_NAME_URL){
    this.parseTemplate=function(template){
        var id=template.id;
        var name=template.name;
        var definitions=this.parseDefinition(template);// xml after deleting some node
        var length=definitions.length;
        return {
            template_id:id,
            template_name:name,
            definitions:definitions[length-1]         
       };
    };  
    this.parseDefinition=function(template){
        var definitions=[];
        var parent=[];
        tranformOet(template.definition,parent,definitions);
        return definitions;
    };

    function tranformOet(node,parent,operationalTemplate){//proess oet 第一个node是definition
        var nodeHere=node;
        if(angular.isArray(nodeHere)){
            angular.forEach(nodeHere,function(nodec){              
                var archetype_name=nodec._archetype_id;
                var childNode=[];
                var archetype; 
                var optTree=[]; 
                var label={name:nodec._concept_name,archetypeName:archetype_name,code:undefined}; //root node of archetype in oet   
                var Node=[];
                Node.label=label;                
                /*test  use Synchronous ajax of jquery */
                $.ajax({
                    url:ARCHETYPE_BY_NAME_URL+archetype_name,
                    type:'get',
                    async:false,
                    success:function(archetype){
                         parseResult = archetypeParseService.parseArchetypeXml(archetype.xml);}
                 });
                 Node.children=processRules(parseResult.definitions.treeItems,nodec);
                 var path=nodec._path;
                 if(path){//找cluster 原型的父节点,重新遍历书找到节点太麻烦了，怎么处理
                      var reg=/\[|\]|\//;
                      var path_array=path.split(reg);
                      var name=path_array.slice(-3,-2);
                      var code=path_array.slice(-2,-1);  
                      var passTree=[]; 
                      processItems(parent,undefined,name,code,Node,passTree);
                      optTree=passTree;
                    }else{
                       optTree.push(Node);
                   }
                   operationalTemplate.push(optTree);
                if(nodec.Items){
                    tranformOet(nodec.Items,optTree,operationalTemplate);
                } 
             });       
        }else{
               var nodec=nodeHere;
               var archetype_name=nodec._archetype_id;
               var childNode=[];
               var archetype; 
               var optTree=[];   
               var label={name:nodec._concept_name,archetypeName:archetype_name,code:undefined}; //root node of archetype in oet   
               var Node=[];
               Node.label=label;
               $.ajax({
                    url:ARCHETYPE_BY_NAME_URL+archetype_name,
                    type:'get',
                    async:false,
                    success:function(archetype){
                         parseResult = archetypeParseService.parseArchetypeXml(archetype.xml);}
                  });
               Node.children=processRules(parseResult.definitions.treeItems,nodec);
               var path=nodec._path;
               if(path){//找cluster 原型的父节点,重新遍历书找到节点太麻烦了，，怎么处理
                  var reg=/\[|\]|\//;
                  var path_array=path.split(reg);
                  var name=path_array.slice(-3,-2);
                  var code=path_array.slice(-2,-1); 
                  var passTree=[]; 
                  processItems(parent,undefined,name,code,Node,passTree);
                  optTree=passTree;
                }else{                  
                  optTree.push(Node);
                 }   
               operationalTemplate.push(optTree);//非要PUSH一下数据才能传出去？？
                if(nodec.Items){
                    tranformOet(nodec.Items,optTree,operationalTemplate);
                }     
         }             
    }
    
    function processItems(tree,parent,name,code,arResult,newTree){
        if(angular.isArray(tree)){
             angular.forEach(tree,function(value){
                  value.parent=parent;
                  if(value.label.code==code){//agree
                    if(value.parent.label.text){
                       value.children.push(arResult);
                    }
                   }
                  var currentNode=[];
                  currentNode.label=value.label;
                  newTree.push(currentNode);
                  if(value.children){
                      currentNode.children=[];
                      processItems(value.children,value,name,code,arResult,currentNode.children); 
                 }
             });
        }else{
             tree.parent=parent;
             if(tree.label.code==code){//agree
                if(tree.parent.label.text){
                    tree.children.push(arResult);
                }
             }
             var currentNode=[];
             currentNode.label=tree.label;
             newTree.push(currentNode);
             if(tree.children){
                 currentNode.children=[];
                processItems(tree.children,tree,name,code,arResult,currentNode.children); 
             }
        }
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
          
    function nodeInfo(node){
       var code,name,archtype_id,dataType,picType;
       if (node.label.code) {
           code = node.label.code;
        }
       return {
           label : {
                type : node.label.type,
                text : node.label.text,
                code : code,
                labelContent : name,
                dataType : dataType,
                picType : picType,
           }}; 
       
    }
    
    function MappingToTerminology(code,termDefinitions){
        var name,dataType,picType;
          
    }
});
