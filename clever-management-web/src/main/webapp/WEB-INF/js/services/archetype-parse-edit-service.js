/*this service is created for construct a archetype from the original archetype .with a reference to the
 original node ,when we operate in the diaplay element ,we can bind the operation to the original archetype,
 by edit original archetype directly*/

angular.module('clever.management.service.archetypeParseEdit', []).service('archetypeParseEditService', function() {
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
			oriNodeRef : archetype, //---------for edit
			header : header,
			terminologies : terminologies,
			definitions : definitions,
			languages : languages
		};
	};
	this.parseHeader = function(archetype) {
		var header = {};
		header.concept = archetype.concept;
		//archetype concept
		header.id = archetype.archetype_id.value;
		//archetype_id
		//parse header details
		header.description = {//description: not an editable array.just the content
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
		header.description.details.oriNodeRef = details;
		//details : editable array. save the reference
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
		//original author : not an editable array

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
		header.description.other_details.oriNodeRef = other_details;
		//other_details  : editable array save the reference
		return header;
	};
	//--------------parse languages---------------------
	this.parseLanguage = function(archetype) {
		var languages = [];
		var originalLanguage = {//original language. not an editable array
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

		languages.oriNodeRef = details;
		//make details as original reference,is just because when we want to add a
		//language ,we must add it in the details
		return {
			originalLanguage : originalLanguage,
			languages : languages
		};
	};

	this.parseTerminology = function(archetype) {
		var termDefinitions = archetype.ontology.term_definitions;
		var constrainDefinitions = archetype.ontology.constraint_definitions;
		var termBindings = archetype.ontology.term_bindingd;
		var constraintBindings = archetype.ontology.constraint_bindings;
		return {
			oriNodeRef : archetype.terminology, //add a reference to ontology, because it is a editable array,
			terms_definitions : parseTermDefinition(termDefinitions),
			constraint_definitions : parseConstrainDefinition(constrainDefinitions),
			term_bindings : parseTermBindings(termBindings),
			constraintBindings : parseConstraintBindings(constraintBindings),
		};
	};

	function parseTermDefinition(termDefinitions) {
		if (termDefinitions) {
			var terms = [];
			if (angular.isArray(termDefinitions)) {//termDefinition is an array with element which consist of an language an an archetypTermList
				angular.forEach(termDefinitions, function(termDefinition) {
					var term = {
						//oriNodeRef:termDefinition,                 // no need
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
					term.items.oriNodeRef = termDefinition.items;
					// here is termDefinition in termDefinitions
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
				term.oriNodeRef = termDefinitions.items;
				//here is termDefinitions directly
				terms.push(term);
			}
			terms.oriNodeRef = termDefinitions;
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
					constrain.items.oriNoderef = constraintDefintion.items;
					// editable array:constraint.items
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
				constrain.items.oriNoderef = constraintDefintions.items;
				// editable array:constraint.items  ....here is constraintDefinitions

			}

			constraints.oriNodeRef = constraintDefinitions;
			//editable array: constaintDefinitions
			return constraints;
		}
	}

	function parseTermBindings(termBindings) {
		if (termBindings) {
			var myTermBindings = [];
			if (angular.isArray(termBindins)) {
				angular.forEach(termBindings, function(termBinding) {
					var term = {
						terminology : termBinding.terminology,
						items : []
					};
					anglar.forEach(termBinding.items, function(item) {
						var myItem = {
							code : item.code,
							termonology_id : item.value.terminology_id,
							code_string : item.value.code_string,
						};

						term.items.push(myItem);
					});
					term.items.oriNodeRef = termBinding.items;
					myTermBindings.push(term);
				});
			} else {
				var term = {
					terminology : termBindings.terminology,
					items : []
				};
				anglar.forEach(termBindings.items, function(item) {
					var myItem = {
						code : item.code,
						termonology_id : item.value.terminology_id,
						code_string : item.value.code_string,
					};

					term.items.push(myItem);
				});
				term.items.oriNodeRef = termBindings.items;
				myTermBindings.push(term);

			}
			myTermBindings.oriNodeRef = termBindings;
			return myTermBindings;
		}
	}

	function parseConstraintBindings(constraintBindings) {
		if (constraintBindings) {
			var myConstraintBindings = [];
			if (angular.isArray(constraintBindings)) {
				angular.forEach(constraintBindings, function(constraintBinding) {
					var term = {
						terminology : constraintBinding.terminology,
						items : []
					};
					angular.forEach(constraintBinding.items, function(item) {
						var myItem = {
							code : item.code,
							value : item.value,
						};
						term.items.push(myItem);

					});
					term.items.oriNodeRef = constraintBinding.items;
					myConstraintBindings.push(term);

				});

			} else {
				var term = {
					terminology : constraintBindings.terminology,
					items : []
				};
				angular.forEach(constraintBindings.items, function(item) {
					var myItem = {
						code : item.code,
						value : item.value,
					};
					term.items.push(myItem);

				});
				term.items.oriNodeRef = constraintBindings.items;
				myConstraintBindings.push(term);
			}

			myConstraintBindings.oriNodeRef = constraintBindings;
			return myConstraintBindings;
		}
	}


	this.parseDefinition = function(archetype) {
		var definitions = {};
		// definitions.tableItems = [];
		definitions.treeItems = [];
		var terminologies = parseTermDefinition(archetype.ontology.term_definitions);
		myProcessNode(archetype.definition, undefined, definitions.treeItems, definitions.tableItems, terminologies, undefined);
		return definitions;
	};

	function processNode(node, parent, treeItems, tableItems, terminologies) {
		if (angular.isArray(node)) {
			angular.forEach(node, function(value) {
				var extractedNode = extractNode(value, terminologies);
				extractedNode.oriNodeRef = value;
				value.parent = parent;
				if (value.attributes) {
					extractedNode.children = [];
					processNode(value.attributes, value, extractedNode.children, tableItems, terminologies);
					extractedNode.children.oriNodeRef = value.attributes;

				} else if (value.children) {
					extractedNode.children = [];
					processNode(value.children, value, extractedNode.children, tableItems, terminologies);
					extractedNode.children.oriNodeRef = value.children;
				}
				treeItems.push(extractedNode);
			});
		} else {
			var extractedNode = extractNode(node, terminologies);
			node.parent = parent;
			extractedNode.oriNodeRef = node;
			if (node.attributes) {
				extractedNode.children = [];
				processNode(node.attributes, node, extractedNode.children, tableItems, terminologies);
				extractedNode.oriNodeRef = node.attributes;
			} else if (node.children) {
				extractedNode.children = [];
				processNode(node.children, node, extractedNode.children, tableItems, terminologies);
				extractedNode.oriNodeRef = node.children;
			}

			treeItems.push(extractedNode);
		}
	}

	function myProcessNode(typeNode, parent, treeItems, terminologies, parentAttribute) {
		if (angular.isArray(typeNode)) {
			angular.forEach(typeNode, function(value) {
				if (noTraverseTypeList.indexOf(value.rm_type_name) == -1) {
					var extractedNode = extractNode(value, terminologies, parentAttribute);
					if (value.attributes) {
						extractedNode.children = [];
						processAttribute(value.attributes, value, extractedNode.children, terminologies);
					}
					if (parentAttribute) {
						extractedNode.parentAttribute = parentAttribute;
					}
					extractedNode.oriNodeRef = value;
					treeItems.push(extractedNode);
				}
			});

		} else {
			if (noTraverseTypeList.indexOf(typeNode.rm_type_name) == -1) {
				var extractedNode = extractNode(typeNode, terminologies, parentAttribute);
				if (typeNode.attributes) {
					extractedNode.children = [];
					processAttribute(typeNode.attributes, extractedNode, extractedNode.children, terminologies);
				}
				if (parentAttribute) {
					extractedNode.parentAttribute = parentAttribute;
				}
				extractedNode.oriNodeRef = typeNode;
				treeItems.push(extractedNode);
			}
		}
	}

	function processAttribute(attributes, parent, treeItems, terminologies) {
		if (attributes) {

			if (angular.isArray(attributes)) {

				angular.forEach(attributes, function(attribute) {
					if (noTraverseAttributes.indexOf(attribute.rm_attribute_name) != -1 && attribute.children) {//if attribute type should be keep
						var keepAttribute = extractNode(attribute, terminologies, undefined);
						keepAttribute.children = [];
						myProcessNode(attribute.children, keepAttribute, keepAttribute.children, terminologies, undefined);
						keepAttribute.oriNodeRef = attribute;
						treeItems.push(keepAttribute);
					} else {
						var noKeepAttribute = extractNode(attribute, terminologies, undefined);
						noKeepAttribute.oriNodeRef = attribute;
						if (attribute.children) {
							myProcessNode(attribute.children, treeItems.parent, treeItems, terminologies, noKeepAttribute);
						}

					}
				});
			} else {
				if (noTraverseAttributes.indexOf(attributes.rm_attribute_name) != -1 && attributes.children) {//if attribute type should be keep
					var keepAttribute = extractNode(attributes, terminologies, undefined);
					keepAttribute.children = [];
					keepAttribute.oriNodeRef = attributes;
					myProcessNode(attributes.children, keepAttribute, keepAttribute.children, terminologies, undefined);
					treeItems.push(keepAttribute);
				} else {
					var noKeepAttribute = extractNode(attributes, terminologies, undefined);
					noKeepAttribute.oriNodeRef = attributes;
					if (attributes.children) {
						myProcessNode(attributes.children, treeItems.parent, treeItems, terminologies, noKeepAttribute);
					}
				}

			}
		}
	}

	var noTraverseTypeList = ['DV_TEXT', 'DV_CODED_TEXT', 'DV_QUANTITY', 'DV_ORDINAL', 'DV_DATE_TIME', 'DV_DATE', 'DV_TIME', 'DV_BOOLEAN', 'DV_COUNT', 'DV_DURATION', 'DV_INTERVAL<DV_DATE>', 'DV_INTERVAl<DV_TIME>', 'DV_INTERVAL<DV_DATE_TIME>', 'DV_INTERVAL<COUNT>', 'DV_INTERVAL<QUANTITY>', 'DV_MULTIMEDIA', 'DV_URI', 'DV_EHR_URI', 'DV_PROPORTION', 'DV_IDENTIFIER', 'DV_PARSABLE', 'DV_BOOLEAN'];
	var noTraverseAttributes = ['subject', 'ism_transition', 'otherParticipations', 'links'];
	var typeList = ['ITEM_LIST', 'ITEM_TREE', 'HISTORY'];
	function extractNode(node, term_definitions, parentAttribute) {
		var type, attribute, code, occurrences, existence, cardinality, cnname, enname, dataType, picType, tableName, targetPath, name;
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
			if (typeList.indexOf(type) != -1) {
				label = parentAttribute.label.text;
			} else {
				label = type;
			}
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
						if (node.attributes[i].rm_attribute_name == "name") {//find a attribute which name is "name"?
							count = i;
						}
					}
					if (count != undefined) {
						if (node.attributes[count].children.attributes) {//if there is a attribute which name is 'name'.there might be children, the base type and its attributes?
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

		if (!name) {
			if (term_definitions && code) {
				name = getDefinition(code, term_definitions, "zh-cn");
				enname = getDefinition(code, term_definitions, "en");
				tableName = term_definitions[0].items[0].text;
			} else {
				name = label;
			}
		}

		if (type == "ELEMENT") {
			picType = dataType;
		} else {
			picType = label;
		}

		return {
			label : {
				type : labelType,
				text : label,
				code : code,
				occurrences : occurrences,
				existence : existence,
				cardinality : cardinality,
				//  labelContent: name,
				//  enText:enname,
				dataType : dataType,
				picType : picType,
				dataValue : dataValue,
				dataInfo : dataInfo,
				//    tableName: tableName,
				//    targetPath: targetPath,

				slot : archetypeSlot,
				includes : includes,
				excludes : excludes
			}
		};
	}

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

});
