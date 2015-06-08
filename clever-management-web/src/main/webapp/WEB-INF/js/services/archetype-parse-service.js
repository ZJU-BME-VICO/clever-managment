angular.module('clever.management.services.archetypeParse', []).service('archetypeParseService', function() {

	var x2js = new X2JS();

	this.parseArchetypeXml = function(xml) {
		var archetype = x2js.xml_str2json(xml).archetype;
		return this.parseArchetype(archetype);
	};

	this.parseArchetype = function(archetype) {
		var header = this.parseHeader(archetype);
		var terminologies = this.parseTerminology(archetype);
		var definitions = this.parseDefinition(archetype);
		var languages = this.parseLanguage(archetype);
		return {
			header : header,
			terminologies : terminologies,
			definitions : definitions,
			languages : languages
		};
	};

	this.parseHeader = function(archetype) {
		var header = {};
		header.concept = archetype.concept;
		header.id = archetype.archetype_id.value;
		header.descriptions = [];
		var details = archetype.description.details;
		if (angular.isArray(details)) {
			angular.forEach(details, function(detail) {
				var description = {
					copyright : detail.copyright,
					miuse : detail.miuse,
					purpose : detail.purpose,
					use : detail.use,
					language : detail.language.code_string
				};
				header.descriptions.push(description);
			});
		} else {
			var description = {
				copyright : details.copyright,
				miuse : details.miuse,
				purpose : details.purpose,
				use : details.use,
				language : details.language.code_string
			};
			header.descriptions.push(description);
		}
		return header;
	};

	this.parseLanguage = function(archetype) {
		var languages = [];
		var originalLanguage = {
			code : archetype.original_language.code_string,
			terminology : archetype.original_language.terminology_id.value,
		};
		var descriptions = archetype.description.details;
		if (angular.isArray(descriptions)) {
			angular.forEach(descriptions, function(description) {
				languages.push({
					code : description.language.code_string,
					terminology : description.language.terminology_id.value
				});
			});
		} else {
			languages.push({
				code : descriptions.language.code_string,
				terminology : descriptions.language.terminology_id.value
			});
		}
		return {
			originalLanguage : originalLanguage,
			languages : languages
		};
	};

	this.parseTerminology = function(archetype) {
		var termDefinitions = archetype.ontology.term_definitions;
		var constrainDefinitions = archetype.ontology.constraint_definitions;
		return {
			terms : parseTermDefinition(termDefinitions),
			constraints : parseConstrainDefinition(constrainDefinitions)
		};
	};

	function parseTermDefinition(termDefinitions) {
		if (termDefinitions) {
			var terms = [];
			if (angular.isArray(termDefinitions)) {
				angular.forEach(termDefinitions, function(termDefinition) {
					var term = {
						language : termDefinition._language,
						items : []
					};
					angular.forEach(termDefinition.items, function(definition) {
						var code, text, description, comment;
						code = definition._code;
						angular.forEach(definition.items, function(value) {
							if (value._id == 'text') {
								text = value.__text;
							} else if (value._id == 'description') {
								description = value.__text;
							} else if (value._id == 'comment') {
								comment = value.__text;
							}
						});
						term.items.push({
							code : code,
							text : text,
							description : description,
							comment : comment,
						});
					});
					terms.push(term);
				});
			} else {
				var term = {
					language : termDefinitions._language,
					items : []
				};
				angular.forEach(termDefinitions.items, function(definition) {
					var code, text, description;
					code = definition._code;
					angular.forEach(definition.items, function(value) {
						if (value._id == 'text') {
							text = value.__text;
						} else if (value._id == 'description') {
							description = value.__text;
						}
					});
					term.items.push({
						code : code,
						text : text,
						description : description,
					});
				});
				terms.push(term);
			}
			return terms;
		}
	}

	function parseConstrainDefinition(constraintDefinitions) {
		if (constraintDefinitions) {
			var constraints = [];
			if (angular.isArray(constraintDefinitions)) {
				angular.forEach(constraintDefinitions, function(constraintDefinition) {
					var constraint = {
						language : constraintDefinition._language,
						items : []
					};
					angular.forEach(constraintDefinition.items, function(definition) {
						var code, text, description;
						code = definition._code;
						angular.forEach(definition.items, function(value) {
							if (value._id == 'text') {
								text = value.__text;
							} else if (value._id == 'description') {
								description = value.__text;
							}
						});
						constraint.items.push({
							code : code,
							text : text,
							description : description,
						});
					});
					constraints.push(constraint);
				});
			} else {
				var constraint = {
					language : termDefinitions._language,
					items : []
				};
				angular.forEach(constraintDefinitions.items, function(definition) {
					var code, text, description;
					code = definition._code;
					angular.forEach(constraint.items, function(value) {
						if (value._id == 'text') {
							text = value.__text;
						} else if (value._id == 'description') {
							description = value.__text;
						}
					});
					constraint.items.push({
						code : code,
						text : text,
						description : description,
					});
				});
				constraints.push(constraint);
			}
			return constraints;
		}
	}


	this.parseDefinition = function(archetype) {
		var definitions = {};
		definitions.tableItems = [];
		definitions.treeItems = [];
		var terminologies=parseTermDefinition(archetype.ontology.term_definitions);
		processNode(archetype.definition, undefined, definitions.treeItems, definitions.tableItems,terminologies);
		return definitions;
	};

	function processNode(node, parent, treeItems, tableItems,terminologies) {
		if (angular.isArray(node)) {
			angular.forEach(node, function(value) {
				var extractedNode = extractNode(value,terminologies);
				value.parent = parent;
				if (value.attributes) {
					extractedNode.children = [];
					processNode(value.attributes, value, extractedNode.children, tableItems,terminologies);
				} else if (value.children) {
					extractedNode.children = [];
					processNode(value.children, value, extractedNode.children, tableItems,terminologies);
				} else {
					/*var leafNode = extractLeafNode(value);
					 if (leafNode) {
					 tableItems.push(leafNode);
					 }*/
				}
				if (value.parent && value.parent.parent && value.parent.parent.rm_type_name == 'ELEMENT') {
					var leafNode = extractLeafNode(value);
					if (leafNode) {
						tableItems.push(leafNode);
					}
				}
				treeItems.push(extractedNode);
			});
		} else {
			var extractedNode = extractNode(node,terminologies);
			node.parent = parent;
			if (node.attributes) {
				extractedNode.children = [];
				processNode(node.attributes, node, extractedNode.children, tableItems,terminologies);
			} else if (node.children) {
				extractedNode.children = [];
				processNode(node.children, node, extractedNode.children, tableItems,terminologies);
			} else {
				/*var leafNode = extractLeafNode(value);
				 if (leafNode) {
				 tableItems.push(leafNode);
				 }*/
			}
			if (node.parent && node.parent.parent && node.parent.parent.rm_type_name == 'ELEMENT') {
				var leafNode = extractLeafNode(node);
				if (leafNode) {
					tableItems.push(leafNode);
				}
			}
			treeItems.push(extractedNode);
		}
	}

	function extractNode(node,term_definitions) {
		var type, attribute, code, occurrences, existence, cardinality,cnname,dataType,picType,tableName,enname;
	    var dataValue=[];
        var dataInfo=[];

		type = node.rm_type_name;
		attribute = node.rm_attribute_name;
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
		if (node.occurrences) {
			occurrences = node.occurrences;
		}
		if (node.existence) {
			existence = node.existence;
		}
		if (node.cardinality) {
			cardinality = node.cardinality;
		}
		
		//5/17 add	
          
        if (type=="ELEMENT"){
            if(node.attributes){
                if(node.attributes.length==undefined){
                    dType=node.attributes.children.rm_type_name;
                    dIndex=node.attributes.children;
                    dataInfo.push({dataType:dType,dataValue:dIndex});
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
                            var dropdownList={value:item.value,symbol:getDefinition(item.symbol.defining_code.code_string,term_definitions,"zh-cn")};
                            dataValue.push(dropdownList);
                    });
                 }
                 if(dataType=="DV_CODED_TEXT"){
                     if(dataInfo[0].dataValue.attributes){
                     if(dataInfo[0].dataValue.attributes.children){
                         var valueList=dataInfo[0].dataValue.attributes.children;
                         if(valueList.code_list){
                             angular.forEach(valueList.code_list,function(item){
                                 var dropdownList={value:"",symbol:getDefinition(item,term_definitions,"zh-cn")};
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
        
        if(!cnname){               
           if(term_definitions&&code){
                cnname=getDefinition(code,term_definitions,"zh-cn");
                enname=getDefinition(code,term_definitions,"en");
                tableName=term_definitions[0].items[0].text;
           }else{
               cnname=label;
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
				code : code,
				occurrences : occurrences,
				existence : existence,
				cardinality : cardinality,
				labelContent:cnname,
				enText:enname,
				dataType:dataType,
				picType:picType,
				dataValue:dataValue,
				dataInfo:dataInfo,
				tableName:tableName
			}
		};
	}

   function getDefinition(code,terminologies,language){
   		var term_definitions;
        if(terminologies){
        for(i=0;i<terminologies.length;i++){
          if(terminologies[i].language==language)
           {
               term_definitions=terminologies[i].items;}
           }
       }  
        var name="";
        if(term_definitions){       
            angular.forEach(term_definitions,function(value){
              if(value.code==code){
               name=value.text;
               }
            });
            }       
        return name;
    }

	function processCodePhrase(codePhraseNode, nodes) {
		var labelType = 'codePhrase';
		var codeList;
		if (codePhraseNode.code_list) {
			codeList = codePhraseNode.code_list;
		}
		if (codePhraseNode.reference) {
			codeList = codePhraseNode.reference;
		}
		if (angular.isArray(codeList)) {
			angular.forEach(codeList, function(code) {
				nodes.push({
					label : {
						type : labelType,
						text : '',
						code : code
					}
				});
			});
		} else {
			nodes.push({
				label : {
					type : labelType,
					text : '',
					code : codeList
				}
			});
		}
	}

	var typeList = ['DV_COUNT', 'DV_TEXT', 'DV_DATE_TIME', 'DV_QUANTITY', 'DV_BOOLEAN'];
	var attributeList = ['value', 'magnitude'];

	function extractLeafNode(node) {
		var type = node.rm_type_name;
		var attribute = node.parent.rm_attribute_name;
		if (typeList.indexOf(type) != -1) {
			if (attributeList.indexOf(attribute) != -1) {
				return {
					type : type,
					code : node.parent.parent.node_id,
					occurrences : node.parent.parent.occurrences,
				};
			}
		}
	}

});
