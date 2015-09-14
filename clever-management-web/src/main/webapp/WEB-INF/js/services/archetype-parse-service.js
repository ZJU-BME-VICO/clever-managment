angular.module('clever.management.services.archetypeParse', []).service('archetypeParseService', function() {

	var x2js = new X2JS();

	this.parseArchetypeXml = function(xml) {
		var archetype = x2js.xml_str2json(xml).archetype;

		//  console.log(archetype);

		return this.parseArchetype(archetype);
	};
	this.getOriginalArchetype = function(xml) {
		var archetype = x2js.xml_str2json(xml).archetype;
		return archetype;
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
		// console.log("this is the origarchetype");
		// console.log(archetype);
		header.concept = archetype.concept;
		header.id = archetype.archetype_id.value;
		//parse header details
		header.description = {
			details : '',
			original_author : '',
			lifecycle_state : '',
			other_contributors : '',
			other_details : '',
		};

		header.description.lifecycle_state = archetype.description.lifecycle;
		header.description.other_contributors = archetype.description.other_contributors;
		//----------------parse details--------------
		var details = archetype.description.details;
		var description_details = [];
		if (angular.isArray(details)) {
			angular.forEach(details, function(detail) {
				var _detail = {
					copyright : detail.copyright,
					miuse : detail.miuse,
					purpose : detail.purpose,
					use : detail.use,
					language : detail.language.code_string
				};
				// header.description.details.push(_detail);
				description_details.push(_detail);
			});
		} else {
			var detail = {
				copyright : details.copyright,
				miuse : details.miuse,
				purpose : details.purpose,
				use : details.use,
				language : details.language.code_string
			};
			//header.description.details.push(detail);
			description_details.push(detail);
		}
		header.description.details = description_details;
		//------------parse details end-------------

		//------------parse original_author--------------
		var original_author = [];

		original_author = archetype.description.original_author;
		var description_originalAuthor = [];
		angular.forEach(original_author, function(authorInfo) {
			var info = {
				text : authorInfo.__text,
				id : authorInfo._id,
			};
			description_originalAuthor.push(info);
			//header.description.original_author.push(info);
		});
		header.description.original_author = description_originalAuthor;
		//-------parse original_author end ------------------

		//------parse other_details-------------
		var other_details = archetype.description.other_details;
		var description_otherDetails = [];
		if (angular.isArray(other_details)) {
			angular.forEach(other_details, function(other_detail) {
				var detail = {
					text : other_detail.text,
					id : other_detail.id,
				};
				description_otherDetails.push(detail);
			});
		} else {
			var detail = {
				text : other_details.text,
				id : other_details.id,
			};
			description_otherDetails.push(detail);
		}
		header.description.other_details = description_otherDetails;
		console.log("this is the header");
		console.log(header);
		return header;
	};

	this.parseLanguage = function(archetype) {
		var languages = [];
		var originalLanguage = {
			code : archetype.original_language.code_string,
			terminology : archetype.original_language.terminology_id.value,
		};
		var details = archetype.description.details;
		if (angular.isArray(details)) {
			angular.forEach(details, function(detail) {
				languages.push({
					code : detail.language.code_string,
					terminology : detail.language.terminology_id.value
				});
			});
		} else {
			languages.push({
				code : details.language.code_string,
				terminology : details.language.terminology_id.value
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
					language : constraintDefinitions._language,
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
		var terminologies = parseTermDefinition(archetype.ontology.term_definitions);
		processNode(archetype.definition, undefined,undefined, definitions.treeItems, definitions.tableItems, terminologies);
		return definitions;
	};

	function processNode(node, parent,parsedParent, treeItems, tableItems, terminologies) {
		if (angular.isArray(node)) {
			angular.forEach(node, function(value) {
			    value.parent = parent;
				var extractedNode = extractNode(value,parsedParent,terminologies);				
				if (value.attributes) {
					extractedNode.children = [];
					processNode(value.attributes, value, extractedNode,extractedNode.children, tableItems, terminologies);
				} else if (value.children) {
					extractedNode.children = [];
					processNode(value.children, value,extractedNode, extractedNode.children, tableItems, terminologies);
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
		    node.parent = parent;
			var extractedNode = extractNode(node,parsedParent,terminologies);			
			if (node.attributes) {
				extractedNode.children = [];
				processNode(node.attributes, node, extractedNode,extractedNode.children, tableItems, terminologies);
			} else if (node.children) {
				extractedNode.children = [];
				processNode(node.children, node,extractedNode,extractedNode.children, tableItems, terminologies);
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

	function extractNode(node,parsedParent,term_definitions) {
		var type, attribute, code, occurrences, existence, cardinality, path,cnname, enname, dataType, picType, tableName, targetPath, name;
		var dataValue = [];
		var dataInfo = [];

		var archetypeSlot, includes, excludes;

		if (node['_xsi:type'] == 'ARCHETYPE_SLOT') {
			archetypeSlot = true;
			if (node.includes) {
				includes = node.includes;
			}
			if (node.excludes) {
				excludes = node.excludes;
			}
		} else {
			archetypeSlot = false;
		}

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
		if (node.target_path) {
			targetPath = node.target_path;
		}

		//5/17 add

		if (type == "ELEMENT") {
			if (node.attributes) {
				var nodeAttributes = node.attributes;
				if (angular.isArray(nodeAttributes)) {
					for (var i = 0; i < nodeAttirbutes.length; i++) {
						if (nodeAttributes[i].rm_attribute_name == 'value') {
							setDataInfo(nodeAttributes[i].children, dataInfo);
							break;
						}
					}
					var count;
					for (var i = 0; i < node.attributes.length - 1; i++) {
						if (node.attributes[i].rm_attribute_name == "name") {
							count = i;
						}
					}
					if (count != undefined) {
						if (node.attributes[count].children.attributes) {
							if (node.attributes[count].children.attributes.rm_attribute_name == "value") {
								if (node.attributes[count].children.attributes.children.item) {
									name = node.attributes[count].children.attributes.children.item.list;
								}
							}
						}
					}
				} else {
					if (nodeAttributes.rm_attribute_name == 'value') {
						setDataInfo(nodeAttributes.children, dataInfo);
					}
				}

			} else {
				dataType = 'ANY';
			}
		}
		if (dataInfo) {
			if (dataInfo.length == 1) {
				dataType = dataInfo[0].dataType;
				setDataValue(dataInfo[0], dataValue, term_definitions);
			} else if (dataInfo.length > 1) {
				dataType = 'CHOICE';
				angular.forEach(dataInfo, function(item) {
					setDataValue(item, dataValue, term_definitions);
				});
			}
		}
		//real name of items
		if (!name) {
			if (term_definitions && code) {
				cnname = getDefinition(code, term_definitions, "zh-cn");
				enname = getDefinition(code, term_definitions, "en");
				tableName = term_definitions[0].items[0].text;
			} else {
				cnname = label;
				enname=label;
			}
		}

		if (type == "ELEMENT") {
			picType = dataType;
		} else {
			picType = label;
		}
		if(parsedParent){
		    if(parsedParent.label.path){
		        if(labelType=='type'){
		            if(code){
                          path =parsedParent.label.path+"[" + code + "]";        
                        } 
                    else{
                        path=parsedParent.label.path;
                    }
		        }
		        else if(labelType='attribute'){
                        path =parsedParent.label.path+"/" + label;
		        }
        	}else{
        	    if(labelType='attribute'){
                        path ="/" + label;
                }
        	}        	
		  }
		return {
			label : {
				type : labelType,
				text : label,
				code : code,
				occurrences : occurrences,
				existence : existence,
				cardinality : cardinality,				
				labelContent : cnname,//display content
				enText : enname,//useless if path is ok
				dataType : dataType,
				picType : picType,
				dataValue : dataValue,//for default values
				dataInfo : dataInfo,
				tableName : tableName,
				path : path,//for element id
				
				targetPath : targetPath,
				slot : archetypeSlot,
				includes : includes,
				excludes : excludes
			}
		};
	}
//reach for default values 
	function setDataValue(dataInfo, dataValue, term_definitions) {
		if (dataInfo.dataType == "DV_ORDINAL") {
			var valueList = dataInfo.dataValue.list;
			angular.forEach(valueList, function(item) {
				var dropdownList = {
					value : item.value,
					symbol : getDefinition(item.symbol.defining_code.code_string, term_definitions, "zh-cn")
				};
				dataValue.push(dropdownList);
			});
		}
		if (dataInfo.dataType == "DV_CODED_TEXT") {
			if (dataInfo.dataValue.attributes) {
				if (dataInfo.dataValue.attributes.children) {
					var valueList = dataInfo.dataValue.attributes.children;
					if (valueList.code_list) {
						angular.forEach(valueList.code_list, function(item) {
							var dropdownList = {
								value : "",
								symbol : getDefinition(item, term_definitions, "zh-cn")
							};
							dataValue.push(dropdownList);
							dataInfo.dataType = "DV_ORDINAL";
						});
					}
					if (valueList.reference) {
						dataValue.push(valueList.reference);
						dataInfo.dataType = "DV_TEXT";
					}
					if (valueList.referenceSeturi) {
						dataValue.push(valueList.referenceSeturi);
						dataInfo.dataType = "DV_TEXT";
					}
				}
			}
		}
	}

	function setDataInfo(data, dataInfo) {
		if (angular.isArray(data)) {
			angular.forEach(data, function(item) {
				dataInfo.push({
					dataType : item.rm_type_name,
					dataValue : item
				});
			});
		} else {
			dataInfo.push({
				dataType : data.rm_type_name,
				dataValue : data
			});
		}
	}
//get different ontology
	function getDefinition(code, terminologies, language) {
		var name = "";
		var term_definitions;
		if (terminologies) {
			for ( i = 0; i < terminologies.length; i++) {
				if (terminologies[i].language == language) {
					term_definitions = terminologies[i].items;
				}
			}
		}
		if (term_definitions) {
			angular.forEach(term_definitions, function(value) {
				if (value.code == code) {
					name = value.text;
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
