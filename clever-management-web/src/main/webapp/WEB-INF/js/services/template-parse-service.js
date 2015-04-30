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
                var label={text:nodec._concept_name,labelContent:archetype_name,code:undefined,type:"Archetype"}; //root node of archetype in oet   
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
                 Node.children=processRules(parseResult,nodec);
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
             var label={text:nodec._concept_name,labelContent:archetype_name,code:undefined,type:"Archetype"}; //root node of archetype in oet   
               var Node=[];
               Node.label=label;
               $.ajax({
                    url:ARCHETYPE_BY_NAME_URL+archetype_name,
                    type:'get',
                    async:false,
                    success:function(archetype){
                         parseResult = archetypeParseService.parseArchetypeXml(archetype.xml);}
                  });
               Node.children=processRules(parseResult,nodec);
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
                    if(value.parent.label.text==name){
                       if(value.children){
                       value.children.push(arResult);}
                       else{
                            value.children=[];
                            value.children.push(arResult);
                       }
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
                if(tree.parent.label.text==name){
                     if(tree.children){
                       tree.children.push(arResult);}
                       else{
                           tree.children=[];
                            tree.children.push(arResult);
                       }
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
       var tree=archetype.definitions.treeItems;
       var term_definitions=archetype.terminologies;
        if(term_definitions){
           for(i=0;i<term_definitions.terms.length;i++){
              if(term_definitions.terms[i].language=="en")
               {
                   items=term_definitions.terms[i].items;}
               }
           }
       var parent;
       var archetypeTree=[];
       var ruleList=[];
       if(node.Rule){
           for(i=0;i<node.Rule.length;i++){//in the same one archetype
               var path=node.Rule[i]._path;
               var reg=/\[|\]|\//;
               var path_array=path.split(reg);
               code=path_array.slice(-3,-1); 
               var flag=node.Rule[i]._max;
               ruleList.push({code:code,flag:flag});        
               }
        }
       getArchetypeDetail(tree,parent,ruleList,archetypeTree,items);
        return archetypeTree;        
    }

    function getArchetypeDetail(tree,parent,ruleList,archetypeTree,term_definitions) {            
        if(angular.isArray(tree)){//route 1
          angular.forEach(tree,function(value){
              value.parent=parent;
              var currentNode=nodeInfo(value,term_definitions);
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
                            getArchetypeDetail(value,parent,ruleList,currentNode.children,term_definitions); 
                        }
                    }
                }}
                if(!tip){ // do not agree 
                        
                        var typeT=currentNode.label.text;
                        if((typeList.indexOf(typeT)==-1)&&(attributeList.indexOf(typeT)==-1)){// ignore type
                           archetypeTree.push(currentNode);
                            if(value.children){
                                currentNode.children=[];
                                getArchetypeDetail(value.children,value,ruleList,currentNode.children,term_definitions);
                             } 
                         }else{                           
                            if(value.children){
                                value=value.children;
                                if(angular.isArray(value)){
                                    angular.forEach(value,function(item){
                                         item.parent=parent;
                                         var currentNode=nodeInfo(item,term_definitions);
                                         var typeT=currentNode.label.text;
                                         if((typeList.indexOf(typeT)==-1)&&(attributeList.indexOf(typeT)==-1)){// ignore type
                                              archetypeTree.push(currentNode);
                                              if(item.children){
                                                  currentNode.children=[];
                                                  getArchetypeDetail(item.children,item,ruleList,currentNode.children,term_definitions);
                                               }
                                           }
                                    });
                                }else{
                                    if(value.children){
                                     getArchetypeDetail(value,parent,ruleList,archetypeTree,term_definitions);}
                                 }
                          }  
                     }
                }
         });
            }else{
                var value=tree;
                value.parent=parent;
                var currentNode=nodeInfo(value,term_definitions);
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
                                getArchetypeDetail(value.children,value,ruleList,currentNode.children,term_definitions); 
                            }
                        }
                    }
                }
                    if(!tip){ // do not agree
                        currentNode.children=[];
                        var typeT=currentNode.label.text;
                        if((typeList.indexOf(typeT)==-1)&&(attributeList.indexOf(typeT)==-1)){// ignore type
                           archetypeTree.push(currentNode);
                            if(value.children){
                                currentNode.children=[];
                                getArchetypeDetail(value.children,value,ruleList,currentNode.children,term_definitions);
                             } 
                         }else{                           
                            if(value.children){
                                value=value.children;
                                if(angular.isArray(value)){
                                    angular.forEach(value,function(item){
                                         item.parent=parent;
                                         var currentNode=nodeInfo(item,term_definitions);
                                         var typeT=currentNode.label.text;
                                         if((typeList.indexOf(typeT)==-1)&&(attributeList.indexOf(typeT)==-1)){// ignore type
                                              archetypeTree.push(currentNode);
                                              if(item.children){
                                                  currentNode.children=[];
                                                  getArchetypeDetail(item.children,item,ruleList,currentNode.children,term_definitions);
                                               }
                                           }
                                    });
                                }else{
                                    if(value.children){
                                     getArchetypeDetail(value.children,value,ruleList,archetypeTree,term_definitions);}
                                 }
                          }  
                       } 
                       }
                    }                
              }
          
    function deleteData(tree){                      
                        var typeT=currentNode.label.text;
                        if((typeList.indexOf(typeT)!=-1)||(attributeList.indexOf(typeT)!=-1)){// ignore type
                            if(value.children){
                                value=value.children;
                                if(angular.isArray(value)){
                                    angular.forEach(value,function(item){
                                         getArchetypeDetail(item.children,item,ruleList,currentNode.children,term_definitions);
                                    });
                                }else{
                                     getArchetypeDetail(value.children,value,ruleList,currentNode.children,term_definitions);
                                }
                          }  
                        }
    }
           //不需要显示的节点类型
    var typeList = ['DV_COUNT', 'DV_TEXT', 'DV_DATE_TIME', 'DV_QUANTITY', 'DV_BOOLEAN','DV_QUANTITY','DV_ORDINAL','DV_DURATION','DV_PROPORTION','CODE_PHRASE','DV_CODED_TEXT'];
    var attributeList = ['value', 'magnitude','data','Tree','name','state','defining_code','events'];

    function nodeInfo(node,term_definitions){
       var code,name,type,text,archtype_id,dataType,picType;
       var dataValue=[];
       var type=node.label.type;
       var text=node.label.text;
       if (node.label.code) {
           code = node.label.code;
           if(term_definitions){
               angular.forEach(term_definitions,function(value){
                 if(value.code==code){
                 name=value.text;}
                });
               }       
            }       
        if(!name){
            name=text;}
        if(text=="ELEMENT"){
            dataType=node.children[0].children[0].label.text;
           /* var childDt;
            if(node.children[0].children[0].children[0]){
                childDt=node.children[0].children[0].children[0].label.text;
                if(childDt=="DV_CODED_TEXT"){
                    //原型解析之后 defining code的内容木有了 ，没有默认值；
                }
            }*/
            picType=dataType;
             if(dataType=="DV_CODED_TEXT"){            
        }
        }else{
            picType=text;
        }
       
       return {
           label : {
                type : type,// type attributes only2
                text : text,//items
                code : code,
                labelContent : name,
                dataType : dataType,//先设置用一下
                picType : picType,
                dataValue:dataValue
           }}; 
       
    }
    

});
