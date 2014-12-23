angular.module('clever.management.services.templateParse',[]).service('templateParseService',function(){
    this.parseTemplate=function(template){
    	var id=template.template_id.value;
    	var concept=template.concept;
    	var language=this.parseLanguage(template);
    	var description=this.parseDescription(template);
    	var definition=this.parseDefinition(template);
    	return {
    		language:language,
    		description:description,
    		definition:definition
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
    	processNode(template.definition,undefined,undefined,definition.definitionTree,definition.contentTree);
    	return definition;
    };
    
    function processNode(node,parent,termDefinition,treeItems,contentTree){
    	if(angular.isArray(node)){
    		angular.forEach(node,function(value){
    			pushData(value,parent,termDefinition,treeItems,contentTree);
    		}); }else{
    			pushData(node,parent,termDefinition,treeItems,contentTree);
    			
    		}
    		
    		}
    
    function unNeedNode(node){
    	if(node.children){
    		node=node.children;
    	}else if(node.attributes){
    		node=node.attributes;
    	}
    	return node;
    }
    function pushData(node,parent,termDefinition,treeItems,contentTree){
    	    node.parent = parent;
    		var extractedNode = extractNode(node,termDefinition);
    		termDefinition=extractedNode.label.term_definitions;
    		var typeT=extractedNode.label.text;
    		if(typeT=="ELEMENT"){//node with archetype term_definitions
    				var leafNode=getleafNode(extractedNode);
    				contentTree.push(leafNode);
    			}	
    	   		if((typeList.indexOf(typeT)==-1)&&(attributeList.indexOf(typeT)==-1)){
    			treeItems.push(extractedNode);
    		    if(node.attributes){ 
    			extractedNode.children=[];
    			processNode(node.attributes,node,termDefinition,extractedNode.children,contentTree);
    	    	}else if(node.children){    				
    			extractedNode.children = [];
				processNode(node.children, node,termDefinition,extractedNode.children,contentTree);
    		   } 
            }else{ 
    			node=unNeedNode(node);
    			if(angular.isArray(node)){
    			angular.forEach(node,function(item){
    				var extractedNode=extractNode(item,termDefinition);
    			    var typeT=extractedNode.label.text;
    			    if(typeT=="ELEMENT"){//node with archetype term_definitions
    				var leafNode=getleafNode(extractedNode);
    				contentTree.push(leafNode);
    			}
    			    termDefinition=extractedNode.label.term_definitions; 
    		        if((typeList.indexOf(typeT)==-1)&&(attributeList.indexOf(typeT)==-1)){
    				   treeItems.push(extractedNode); }
    			       if(item.attributes){ 
    			       extractedNode.children=[];
    			       processNode(item.attributes,item,termDefinition,extractedNode.children,contentTree);
    	    	       }else if(item.children){    				
    			       extractedNode.children = [];
				       processNode(item.children, item,termDefinition,extractedNode.children,contentTree);
    			}    			
               });
              }else {
              	if(node.children||node.attributes){pushData(node,parent,termDefinition,treeItems,contentTree);}
              	}
    
            }
    }
    
    var typeList = ['DV_COUNT', 'DV_TEXT', 'DV_DATE_TIME', 'DV_QUANTITY', 'DV_BOOLEAN','DV_QUANTITY','DV_ORDINAL','DV_DURATION','CODE_PHRASE','DV_CODED_TEXT'];
	var attributeList = ['value', 'magnitude','items','data','name','state','defining_code','events'];
	
	
    function extractNode (node,termDefinition) {
      var type,attribute,code,term_definitions ,name,archtype_id,dataType,picType;
      var dataValue=[];
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
		//term_definitions
		if (node.term_definitions) {
			term_definitions = node.term_definitions;
		}else if(termDefinition){	
				term_definitions=termDefinition;				
			}
		if(term_definitions){
			name=getDefinition(code,term_definitions);
		}
		//data type
		if (type=="ELEMENT"){
			if(node.attributes){
				if(node.attributes.length==undefined){
					dataType=node.attributes.children.rm_type_name;
					  if(node.attributes.children.attributes){
					  	if(node.attributes.children.attributes.children.item){
					  		dataValue.push(node.attributes.children.attributes.children.item.list);
					  		}else if(node.attributes.children.attributes.children.code_list){
					  			var valueList=node.attributes.children.attributes.children.code_list;
					  			angular.forEach(valueList,function(item){
					  				var dropdownList=getDefinition(item,term_definitions);
					  				dataValue.push(dropdownList);
					  			});
					  		}
						; 
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
						
					  }
				}else{
				  dataType=node.attributes[0].children.rm_type_name;
				}
				
				}
		}
		if(!name){
		   name=label;
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
			}
		};
      
    }
    
    function getDefinition(code,term_definitions){
    	var name="";
    	if(code){
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
