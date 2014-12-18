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
    			value.parent=parent;
    			var extractedNode=extractNode(value,termDefinition);
    			treeItems.push(extractedNode);
    			termDefinition=extractedNode.label.term_definitions;
    			if(extractedNode.label.labelContent){
    				contentTree.push(extractedNode);
    			}   	 			
    			if(value.attributes){
    				extractedNode.children=[];
    				processNode(value.attributes,value,termDefinition,extractedNode.children,[]);
    			}else if(value.children){
    				extractedNode.children = [];
					processNode(value.children, value,termDefinition,extractedNode.children,[]);
    			}
    		}); 
    	}else {
    		node.parent = parent;
    		var extractedNode = extractNode(node,termDefinition);
    		treeItems.push(extractedNode);
    		termDefinition=extractedNode.label.term_definitions;
    		if(extractedNode.label.labelContent){
    				contentTree.push(extractedNode);
    			}	
			if (node.attributes) {
				extractedNode.children = [];			
				processNode(node.attributes, node,termDefinition, extractedNode.children,[]);
			} else if (node.children) {
				
				extractedNode.children = [];
				processNode(node.children, node,termDefinition,extractedNode.children,[]);
			} 
    	}
    };
    function extractNode (node,termDefinition) {
      var type,attribute,code,term_definitions ,name,archtype_id;
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
		if (node.term_definitions) {
			term_definitions = node.term_definitions;
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
		}else{
			if(termDefinition){	
				term_definitions=termDefinition;
			  if(code){
				if(term_definitions[0]==undefined){
					name=term_definitions.items[0].__text;
				}else{
					angular.forEach(term_definitions,function(value){
				      if(value._code==code){
					   name=value.items[0].__text;}
			});
			}
			}}			
		}
		return {
			label : {
				type : labelType,
				text : label,
				code : code,
				term_definitions : term_definitions,
				labelContent:name
			}
		};
      
    };
    function viewNode(){}
});
