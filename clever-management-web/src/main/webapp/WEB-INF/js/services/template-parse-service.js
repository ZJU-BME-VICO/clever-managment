angular.module('clever.management.services.templateParse',[]).service('templateParseService',function(){
    this.parseTemplate=function(template){
    	var id=template.template_id.value;
    	var concept=template.concept;
    	var language=this.parseLanguage(template);
    	var description=this.parseDescription(template);
    	var usseee;
    	var termdefiniton=this.parseTermDefinitions(template);//complete xml with termDefinition info
    	var definition=this.parseDefinition(template);// xml after deleting some node
    	return {
    		language:language,
    		description:description,
    		definition:definition,
    		termdefiniton:termdefiniton   		
       };
    };	
    
    this.parseLanguage=function(template){
    	var language={
    		terminology:template.language.terminology_id.value,
    		code:template.language.code_string,
    	};
    	return language;
    };
    this.parseDescription=function(template){    	   	
    };
    this.parseDefinition=function(template){
    	var definition={};
    	definition.definitionTree=[];
    	definition.contentTree=[];
    	//var tmp=parseTermDefinitions(template);
    	processNode(template.definition,undefined,definition.definitionTree,definition.contentTree);
    	return definition;
    };
     //搜索全部定义信息应该在删除无效节点之前，不然有的节点找不到自己的父辈
    this.parseTermDefinitions=function(template){
        var termDefined=[];
        processedTermDefinition(template.definition,undefined,termDefined);
        return termDefined;           
    };
    
    function processNode(node,parent,treeItems,contentTree){
    	if(angular.isArray(node)){
    		angular.forEach(node,function(value){
    			pushData(value,parent,treeItems,contentTree);
    		}); }
       else{
    		 pushData(node,parent,treeItems,contentTree);    			
    		}    		
    	}
    

    function pushData(node,parent,treeItems,contentTree){
    	    node.parent = parent;
    		var extractedNode = extractNode(node);
    		var typeT=extractedNode.label.text;
    		if(typeT=="ELEMENT"){//node with archetype term_definitions
    				var leafNode=getleafNode(extractedNode);
    				contentTree.push(leafNode);
    			}	
    		//删除一些类型的节点
       		if((typeList.indexOf(typeT)==-1)&&(attributeList.indexOf(typeT)==-1)){
    			treeItems.push(extractedNode);
    		    if(node.attributes){ 
        			extractedNode.children=[];
        			processNode(node.attributes,node,extractedNode.children,contentTree);
        	    }else if(node.children){    				
        			extractedNode.children = [];
    				processNode(node.children, node,extractedNode.children,contentTree);
    	        } 
            }else{ 
    			node=unNeedNode(node);
    			if(angular.isArray(node)){
    			angular.forEach(node,function(item){
    			    item.parent=parent;
    				var extractedNode=extractNode(item);
    			    var typeT=extractedNode.label.text;
    			    if(typeT=="ELEMENT"){//node with archetype term_definitions
        				var leafNode=getleafNode(extractedNode);
        				contentTree.push(leafNode);
    			    }
    		        if((typeList.indexOf(typeT)==-1)&&(attributeList.indexOf(typeT)==-1)){
    				   treeItems.push(extractedNode); }
    			       if(item.attributes){ 
        			       extractedNode.children=[];
        			       processNode(item.attributes,item,extractedNode.children,contentTree);
    	    	       }else if(item.children){    				
        			       extractedNode.children = [];
    				       processNode(item.children, item,extractedNode.children,contentTree);
    			}    			
               });
              }else {
              	if(node.children||node.attributes){pushData(node,parent,treeItems,contentTree);}
              	}
    
            }
    }
    //不需要显示的节点类型
    var typeList = ['DV_COUNT', 'DV_TEXT', 'DV_DATE_TIME', 'DV_QUANTITY', 'DV_BOOLEAN','DV_QUANTITY','DV_ORDINAL','DV_DURATION','DV_PROPORTION','CODE_PHRASE','DV_CODED_TEXT'];
	var attributeList = ['value', 'magnitude','data','Tree','items','name','state','defining_code','events'];
    
    function unNeedNode(node){
        if(node.children){
            node=node.children;
        }else if(node.attributes){
            node=node.attributes;
        }
        return node;
    }
    
 
    
    function processedTermDefinition(node,parent,itemsTree){
        if (angular.isArray(node)){
             angular.forEach(node,function(value){
                 value.parent=parent;
                 var extractedNode=extractNode(value);                 
                 itemsTree.push(extractedNode);
                 if(value.attributes){
                     extractedNode.children=[];
                     processedTermDefinition(value.attributes,value,extractedNode.children);
                 }
                 if(value.children){
                     extractedNode.children=[];
                     processedTermDefinition(value.children,value,extractedNode.children);
                 }
             });
        }else{
            node.parent=parent;
            var extractedNode=extractNode(node);
             itemsTree.push(extractedNode);
                 if(node.attributes){
                     extractedNode.children=[];
                     processedTermDefinition(node.attributes,node,extractedNode.children);
                 }
                 if(node.children){
                     extractedNode.children=[];
                     processedTermDefinition(node.children,node,extractedNode.children);
                 }
        }
        
    }
    
 
	  
   // list some information in label attribute  
    function extractNode (node) {
      var type,attribute,code,term_definitions ,name,archtype_id,dataType,picType;
      var dataValue=[];
      var dataInfo=[];
      type=node.rm_type_name;
      attribute=node.rm_attribute_name;
      if (node.node_id) {
			code = node.node_id;
		}
		var label, labelType;
		if (type) {
			labelType = 'type';
			label = type;
		}
		if (attribute) {
			labelType = 'attribute';
			label = attribute;
		}
		 term_definitions = getDefinitionList(node);
		//data type
		if (type=="ELEMENT"){
			if(node.attributes){
				if(node.attributes.length==undefined){
					dType=node.attributes.children.rm_type_name;
				    dIndex=node.attributes.children;
				    dataInfo.push({dataType:dType,dataValue:dIndex});
					 /* if(node.attributes.children.attributes){//attributes or children  number unknown
					     if(node.attributes.children.attributes.children){
					  	if(node.attributes.children.attributes.children.item){
					  		dataValue.push(node.attributes.children.attributes.children.item.list);
					  		}else if(node.attributes.children.attributes.children.code_list){
					  			var valueList=node.attributes.children.attributes.children.code_list;
					  			angular.forEach(valueList,function(item){
					  				var dropdownList=getDefinition(item,term_definitions);
					  				dataValue.push(dropdownList);
					  			});
					  		}
					  		}; 
					  }else if(node.attributes.children.list){
					  	if(dataType=="DV_QUANTITY"){
					  		if(node.attributes.children.list.magnitude){
					  			var range=node.attributes.children.list.magnitude.lower+"..."+node.attributes.children.list.magnitude.upper;
					  			var unit=node.attributes.children.list.units;
					  			dataIndex={range:range,unit:unit};
					  			dataValue.push(dataIndex);
					  		}else if(node.attributes.children.list.units){
					  			var unit=node.attributes.children.list.units;
					  			dataValue.push(unit);
					  			}else {
					  				var list=node.attributes.children.list;
					  				angular.forEach(list,function(item){
					  					var unit=item.units;
					  					dataValue.push(unit);
					  				});
					  			}				  		
					  		
					  	}
					  	if(dataType=="DV_ORDINAL"){
					  		var valueList=node.attributes.children.list;
						angular.forEach(valueList,function(item){
							var dropdownList={value:item.value,symbol:getDefinition(item.symbol.defining_code.code_string,term_definitions)};
							dataValue.push(dropdownList);
						});
					  	}
						
					  }*/
				}else{
				    var i=0;//heart failure   typical smoke amount
				    while(node.attributes[i]){
				        if(node.attributes[i].children){
    				        dType=node.attributes[i].children.rm_type_name;
    				        dIndex=node.attributes[i].children;
    				        dataInfo.push({dataType:dType,dataValue:dIndex});}
    				        i++;				        
				    }
				  //dataType=node.attributes[0].children.rm_type_name;
				}
				
				}
		}
		if(dataInfo){
		 if(dataInfo.length==1){
                dataType=dataInfo[0].dataType;
                if(dataType=="DV_ORDINAL"){
                    var valueList=dataInfo[0].dataValue.list;
                        angular.forEach(valueList,function(item){
                            var dropdownList={value:item.value,symbol:getDefinition(item.symbol.defining_code.code_string,term_definitions)};
                            dataValue.push(dropdownList);
                    });
                 }
                 if(dataType=="DV_CODED_TEXT"){
                     if(dataInfo[0].dataValue.attributes.children){
                         var valueList=dataInfo[0].dataValue.attributes.children;
                         if(valueList.code_list){
                             angular.forEach(valueList.code_list,function(item){
                                 var dropdownList={value:"",symbol:getDefinition(item,term_definitions)};
                                    dataValue.push(dropdownList);
                                   dataInfo[0].dataType="DV_ORDINAL";
                             });
                         }
                         if(valueList.reference){
                             dataValue.push(valueList.reference);
                              dataInfo[0].dataType="DV_TEXT";
                         }
                          if(valueList.referenceSeturi){
                             dataValue.push(valueList.referenceSeturi);
                             dataInfo[0].dataType="DV_TEXT";
                         }
                     }
                 }
    }
    }
       //real name of items    
       
        if(node.attributes){
            if(node.attributes.length>1){
                var count;
                for(var i=0;i<node.attributes.length-1;i++){                    
                    if(node.attributes[i].rm_attribute_name=="name")
                    {count=i;}
                }
                if(count!=undefined){
                    if(node.attributes[count].children.attributes){
                        if(node.attributes[count].children.attributes.rm_attribute_name=="value"){
                            if(node.attributes[count].children.attributes.children.item){
                                name=node.attributes[count].children.attributes.children.item.list;
                            }
                        }
                    }
                 }                
            }
        }
        if(!name){               
           if(term_definitions&&code){
                name=getDefinition(code,term_definitions);
           }else{
               name=label;
           }
          }                     
        
		if(type=="ELEMENT"){		   
		   picType=dataType;
		}else{
		   picType=label;
		}	
		
		return {
			label : {
				type : labelType,
				text : label,
				code:code,
				term_definitions : term_definitions,
				labelContent:name,
				dataType:dataType,
				dataValue:dataValue,
				picType:picType,
				dataInfo:dataInfo
			}
		};
      
    }
    
    function getDefinition(code,term_definitions){
    	var name="";
    	    if(term_definitions){
    		if(term_definitions[0]==undefined){
					name=term_definitions.items[0].__text;
				}else{
					angular.forEach(term_definitions,function(value){
				      if(value._code==code){
					   name=value.items[0].__text;}
			});
			}    	
    	}
    	return name;
    }
       //get node definitions from itself or its parent or ancestor
   function getDefinitionList(node){
       var termdefinitionList=termDefiniton(node);
       return termdefinitionList;
    }
   function termDefiniton(node){
      if (node.term_definitions){
         return node.term_definitions;   
      }
      if(node.parent){             
         var termdefinitionList=termDefiniton(node.parent);
         return termdefinitionList; 
      }   
      else{
         return null;
      }        
      }
      
    function getleafNode(node){
    	var type,dataType,labelContent,dataValue;
        return {
        	detailInfo:{
        		type:node.label.type,
        		dataType:node.label.dataType,
        		labelContent:node.label.labelContent,
        		dataValue:node.label.dataValue
        	}
        };
    }
    
    
});
