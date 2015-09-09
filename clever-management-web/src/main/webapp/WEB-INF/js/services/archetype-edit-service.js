angular.module('clever.management.service.archetypeEdit', []).service('archetypeEditService', function() {

	this.getCBoolean = function() {
		return {
			'_xsi:type' : "C_BOOLEAN",
			true_valid : "true",
			false_valid : "true",
		};
	};

	this.getCDateTime = function() {
		return {
			'_xsi:type' : "C_DATE_TIME",
			pattern : undefined,
			list : undefined,
			range : undefined,
			assumed_value : undefined,
		};
	};

	this.getCDuration = function() {
		return {
			'_xsi:type' : "C_DURATION",
			value : undefined,
			parttern : undefined,
			range : undefined,
		};
	};

	this.getCInteger = function() {
		return {
			'_xsi:type' : "C_INTEGER",
			list : [],
			range : undefined,
			assumed_value : undefined,
		};
	};

	this.getCReal = function() {
		return {
			'_xsi:type' : "C_REAL",
			list : [],
			range : undefined,
			assumed_value : undefined,
		};
	};

	this.getCString = function() {
		return {
			'_xsi:type' : "C_STRING",
			pattern : undefined,
			list : [],
			default_value : undefined,
			assumed_value : undefined,
		};
	};

	//primitive object get this.end

	//Constraint object get function
	this.getCDvOrdinal = function() {
		return {
			'_xsi:type' : "C_DV_ORDINAL",
			list : undefined, //element is ordinal --- consist of value|symbol.defining_code.terminology_id.value&code_string
		    rm_type_name: 'DV_ORDINAL',
		};
	};

	this.getCCodePhrase = function() {
		return {
			'_xsi:type' : "C_CODE_PHRASE",
			terminology_id : undefined,
			//code_string:undefined,
			code_list : [], //element is just number
			assumed_value : undefined,
		};
	};
	this.getCCodePhraseWithPara = function(terminologyValue, codeList, assumedValue) {
		return {
			'_xsi:type' : "C_CODE_PHRASE",
			terminology_id : {
				value : terminologyValue,
			},
			//code_string:undefined,
			code_list : codeList, //element is just number
			assumed_value : assumedValue,
		};
	};
	this.getCDvQuantity = function() {
		return {
			'_xsi:type' : "C_DV_QUANTITY",
			property : undefined, // terminology_id/value    code_string
			list : null, //ervery element have:  units   magnitude  precision
			assumed_value : undefined,
            rm_type_name : "DV_QUANTITY",
		};
	};

	this.getArchetypeInternalRef = function(rmTypeName, occurrences, targetPath) {
		return {
			'_xsi:type' : "ARCHETYPE_INTERNAL_REF",
			rm_type_name : rmTypeName,
			occurrences : occurrences,
			target_path : targetPath,
		};
	};

	this.getConstraintRef = function() {
		return {
			'_xsi:type' : "CONSTRAINT_REF",
			reference : undefined,
		};
	};

	this.getArchetypeSlot = function(rmTypeName, nodeId, occurrences, includes, excludes) {
		return {
			'_xsi:type' : "ARCHETYPE_SLOT",
			rm_type_name : rmTypeName,
			node_id : nodeId,
			occurrences : occurrences,
			includes :{string_expression:includes},
			excludes :{string_expression:excludes},
		};
	};
	this.defaultIncludes =  "archetype_id/value matches {/.*/}";

	//constraint object get this.end

	this.getNodeLabel = function(cardinality, code, dataType, dataValue, excludes, existence, includes, occurrences, picType, slot, text, type) {
		return {
			cardianlity : cardinality,
			code : code,
			dataType : dataType,
			dataValue : dataValue,
			excludes : excludes,
			existence : existence,
			includes : includes,
			occurrences : occurrences,
			picType : picType,
			slot : slot,
			text : text,
			type : type,
		};
	};

	this.getBaseTypeDefaultLabel = function(code, dataType) {
		return this.getNodeLabel(undefined, code, dataType, [], undefined, undefined, undefined, this.getDefaultOccurrences(0, 1), dataType, false, "ELEMENT", "type");
	};

	//this this.return an object(parsed type).which can be added to display Object
	this.getBaseTypeObject = function(children, nodeId, type, oriNodeRef, parent, parentAttribute, isSlot) {

		var label;
		if (isSlot) {
			label = this.getNodeLabel(undefined, nodeId, undefined, [], undefined, undefined, undefined, this.getDefaultOccurrences(0, 1), type, true, type, "type");
		} else if (type == "CLUSTER") {
			var label = this.getNodeLabel(undefined, nodeId, type, [], undefined, undefined, undefined, this.getDefaultOccurrences(0, 1), type, false, "CLUSTER", "type");
		} else {
			var label = this.getBaseTypeDefaultLabel(nodeId, type);
		}
		;

		return {
			children : children,
			collapsed : true,
			label : label,
			oriNodeRef : oriNodeRef,
			parent : parent,
			parentAttribute : parentAttribute,
			show : true,
		};
	};
   
	
	this.getBaseAttribute = function(children, parent, oriNodeRef, picType, cardinality) {
		var label;
		if (cardinality) {
			label = this.getNodeLabel(cardinality, undefined, undefined, [], undefined, this.getDefaultExistence(1, 1), undefined, undefined, picType, false, picType, "attributes");
		} else {
			label = this.getNodeLabel(undefined, undefined, undefined, [], undefined, this.getDefaultExistence(1, 1), undefined, undefined, picType, false, picType, "attributes");

		}

		return {
			children : children,
			collapsed : false,
			label : label,
			oriNodeRef : oriNodeRef,
			parent : parent,
			selected : 'selected',
			show : true,
		};
	};


	//this this.return a ccomplexObejct an it's attribute
	//function
	this.getOccurrences = function(lower, lower_included, lower_unbounded, upper, upper_included, upper_unbounded) {
		return {
			lower :(lower==undefined||lower==null)?  undefined : lower.toString() ,
			lower_included : lower_included.toString(),
			lower_unbounded : lower_unbounded.toString(),
			upper : (upper==undefined||upper==null)?   undefined : upper.toString() ,
			upper_included : upper_included.toString(),
			upper_unbounded : upper_unbounded.toString(),

		};
	};

	this.getDefaultOccurrences = function(lower, upper) {
		if(upper == '*'){
			return  this.getOccurrences(lower,true,false,undefined,false,true);
		}
		return this.getOccurrences(lower, true, false, upper, true, false);
	};

	this.getCComplexObject = function(attributes, nodeId, occurrences, rmTypeName) {
		return {
			'_xsi:type' : "C_COMPLEX_OBJECT",
			attributes : attributes,
			node_id : nodeId,
			occurrences : occurrences,
			rm_type_name : rmTypeName,
		};
	};
	getCComplexObject = function(attributes, nodeId, occurrences, rmTypeName) {
		return {
			'_xsi:type' : "C_COMPLEX_OBJECT",
			attributes : attributes,
			node_id : nodeId,
			occurrences : occurrences,
			rm_type_name : rmTypeName,
		};
	};

	this.getCPrimitiveObject = function(item, nodeId, occurrences, rmTypeName) {
		return {
			'_xsi:type' : "C_PRIMITIVE_OBJECT",
			item : item,
			node_id : nodeId,
			occurrences : occurrences,
			rm_type_name : rmTypeName,
		};
	};

	this.getCSingleAttribute = function(children, existence, rmAttributeName) {
		return {
			'_xsi:type' : "C_SINGLE_ATTRIBUTE",
			children : children,
			existence : existence,
			rm_attribute_name : rmAttributeName,
		};
	};
	getCSingleAttribute = function(children, existence, rmAttributeName) {
		return {
			'_xsi:type' : "C_SINGLE_ATTRIBUTE",
			children : children,
			existence : existence,
			rm_attribute_name : rmAttributeName,
		};
	};

	this.getExistence = function(lower, lower_included, lower_unbounded, upper, upper_included, upper_unbounded) {
		return {
			lower : (lower==undefined||lower==null)?  undefined : lower.toString() ,
			lower_included : lower_included.toString(),
			lower_unbounded : lower_unbounded.toString(),
			upper :  (upper==undefined||upper==null)? undefined : upper.toString(),
			upper_included : upper_included.toString(),
			upper_unbounded : upper_unbounded.toString(),

		};
	};

	this.getDefaultExistence = function(lower, upper) {
		return this.getExistence(lower, true, false, upper, true, false);
	};

	//node id generator logic
	function getDotNumber(code) {
		var number = 0;
		while (code.indexOf(".") != -1) {
			code = code.slice(code.indexOf('.') + 1, code.length);
			number++;
		}
		return number;
	}

	function getMaxDotNumber(codeArray) {
		var maxDotNumber = 0;
		var tempDotNumber = 0;
		angular.forEach(codeArray, function(code) {
			tempDotNumber = getDotNumber(code);
			if (tempDotNumber > maxDotNumber) {
				maxDotNumber = tempDotNumber;
			}
		});
		return maxDotNumber;

	}

	function getCodeArray(termDefinition) {
		var codeArray = [];
		if (angular.isArray(termDefinition)) {
			angular.forEach(termDefinition[0].items, function(item) {
				codeArray.push(item.code);
			});

		} else {
			angular.forEach(termDefinition.items, function(item) {
				codeArray.push(item.code);
			});
		}
		return codeArray;
	}

	function getLastNumber(code) {
		var lastString = '';
		if (code.lastIndexOf('.') != -1) {
			lastString = code.slice(code.lastIndexOf('.') + 1, code.length);
		} else {
			lastString = code.slice(2,code.length);
		}
		return parseInt(lastString);

	}

	function sortNumber(a, b) {
		return b - a;
	}

	function getMaxCodeMessage(codeArray, maxDotNumer) {

		var dotNumber = maxDotNumer;
		while (dotNumber >= 0) {
			var currentArray = [];
			angular.forEach(codeArray, function(code) {
				if (getDotNumber(code) == dotNumber) {
					var number = getLastNumber(code);
					currentArray.push(number);
				}
			});
			if (currentArray.length > 0) {
				currentArray.sort(sortNumber);
				if (dotNumber == maxDotNumer) {

					if (currentArray[0] == 1) {
						if (maxDotNumer == 0) {
							return {
								maxNumber : 1,
								dotNumber : 0,

							};
						}
						dotNumber--;
						continue;
					}

				}
				return {
					maxNumber : currentArray[0],
					dotNumber : dotNumber,
				};

			}

			dotNumber--;

		}

	}


	this.getTermDefinitionNodeId = function(ontology) {
		var termDefinition = ontology.term_definitions;
		var codeArray = getCodeArray(termDefinition);
		var maxDotNumber = getMaxDotNumber(codeArray);
		var maxCodeMessage = getMaxCodeMessage(codeArray, maxDotNumber);
		//var nodeId = 'at';
		var nodeId = "";
		var dotNumber = maxDotNumber;
		var nodeId = (maxCodeMessage.maxNumber + 1).toString();
		if (dotNumber == 0) {
			//nodeId += lastString;
			while (nodeId.length < 4) {
				nodeId = "0" + nodeId;
			}
		} else {
			while (dotNumber > 0) {
				nodeId = '0.' + nodeId;
				dotNumber--;
			}
		}
		nodeId = "at" + nodeId;
		return nodeId;

	};

	function getDisOntologyItem(nodeId, text, description) {
		return {
			code : nodeId,
			comment : undefined,
			description : description,
			text : text,
		};
	}

	function getOriOntologyItem(nodeId, text, description) {
		return {
			_code : nodeId,
			items : [{
				_id : "text",
				__text : text,
			}, {
				_id : "description",
				__text : description,
			}]

		};
	}


	this.synchronizeOntology = function(ontology, nodeId, text, description) {
		var terms = ontology.term_definitions;
		if (angular.isArray(terms)) {
			angular.forEach(terms, function(term) {
				if (term.language == "en") {
					pushToDisOntologyTerm(term.items, nodeId, text, description);
				} else {
					pushToDisOntologyTerm(term.items, nodeId, "*", "*");
				}
			});
		} else {
			if (terms.language == "en") {
				pushToDisOntologyTerm(terms.items, nodeId, text, description);
			} else {
				pushToDisOntologyTerm(terms.items, nodeId, "*", "*");
			}
		}

		//change original node content
		if (angular.isArray(terms.oriNodeRef)) {
			angular.forEach(terms.oriNodeRef, function(term) {
				if (term._language == "en") {
					pushToOriOntoltogyTerm(term.items, nodeId, text, description);
				} else {
					pushToOriOntoltogyTerm(term.items, nodeId, "*", "*");
				}
			});
		} else {
			term = terms.oriNodeRef;
			if (term._language == "en") {
				pushToOriOntoltogyTerm(term.items, nodeId, text, description);
			} else {
				pushToOriOntoltogyTerm(term.items, nodeId, "*", "*");
			}
		}
	};

	function pushToOriOntoltogyTerm(items, nodeId, text, description) {
		if (angular.isArray(items)) {
			items.push(getOriOntologyItem(nodeId, text, description));
		} else {
			var tempItems = [];
			tempItems.push(getOriOntologyItem(nodeId), text, description);
			tempItems.push(items);
			items = tempItems;
		}
	}

	function pushToDisOntologyTerm(items, nodeId, text, description) {
		if (angular.isArray(items)) {
			items.push(getDisOntologyItem(nodeId, text, description));
		} else {
			var tempItems = [];
			tempItems.push(getDisOntologyItem(nodeId, text, description));
			tempItems.push(items);
			items = tempItems;
		}
	}

	// synchronize original ontology
	this.synchronizeOriOntology = function(nodeId, text, description, ontology) {
		var termDefinitions = ontology.term_definitions;
		if (angular.isArray(termDefinitions)) {
			angular.forEach(termDefinitions, function(term) {
				if (term._language == "en") {
					term.items.push(getOriOntologyItem(nodeId, text, description));
				} else {
					term.items.push(getOriOntologyItem(nodeId, "*", "*"));
				}
			});
		} else {
			term = terms.oriNodeRef;
			if (term._langguage == "en") {
				term.items.push(getOriOntologyItem(nodeId, text, description));
			} else {
				term.items.push(getOriOntologyItem(nodeId, "*", "*"));
			}
		}
	};
	this.getCMultipleAttribute = function(children, cardianlity, existence, rmAttributeName) {
		return {
			'_xsi:type' : "C_MULTIPLE_ATTRIBUTE",
			children : children,
			existence : existence,
			rm_attribute_name : rmAttributeName,
			cardinality : cardianlity,
		};
	};

	this.getCardinality = function(lower, lower_included, lower_unbounded, upper, upper_included, upper_unbounded, isOrdered, isUnique) {
		var interval;
		if (upper_unbounded == true) {
			interval = {
				lower : lower.toString(),
				lower_included : lower_included.toString(),
				lower_unbounded : lower_unbounded.toString(),
				upper_unbounded : upper_unbounded.toString(),
			};
		} else {
			interval = {
				lower : lower.toString(),
				lower_included : lower_included.toString(),
				lower_unbounded : lower_unbounded.toString(),
				upper : upper.toString(),
				upper_included : upper_included.toString(),
				upper_unbounded : upper_unbounded.toString(),
			};
		}
		return {
			interval : interval,
			is_ordered : isOrdered,
			is_unique : isUnique,
		};
	};

	this.getDefaultCardinality = function(lower) {
		return this.getCardinality(lower, true, false, 1, false, true, false, false);
	};
    getDefaultCardinality = function(lower) {
		return this.getCardinality(lower, true, false, 1, false, true, false, false);
	};
	//getNodeLabel(cardinality, code, dataType, dataValue, excludes, existence, includes, occurrences, picType, slot, text, type) {

	this.getAttribute = function(cardinality, text, oriNodeRef) {
		return {
			oriNodeRef : oriNodeRef,
			label : this.getNodeLabel(cardinality, undefined, undefined, [], undefined, this.getDefaultExistence(1, 1), undefined, undefined, text, false, text, "attribute"),
		};
	};

	this.attributeCheck = function(node) {

		if (node.oriNodeRef.attributes && node.childrenAttribute) {
			return;
		} else if ((!node.oriNodeRef.attributes||node.oriNodeRef.attributes.length == 0) && !node.childrenAttribute) {
			var multiAttribute = this.getCMultipleAttribute([], this.getDefaultCardinality(1), this.getDefaultExistence(1, 1), "items");
			node.oriNodeRef.attributes = multiAttribute;

			var attribute = this.getAttribute(this.getDefaultCardinality(1), "items", multiAttribute);

			node.childrenAttribute = attribute;
			//node.children = [];

		}

	};
	
	
	
	//package the base function 
	this.getSingleAttr = function(children, existence, attrName){
		return getCSingleAttribute(children, this.getDefaultExistence(existence[0], existence[1]), attrName);
	};
	
	this.getComplexObject = function(attributes, nodeId, occurrences, objectName){
		return getCComplexObject(attributes, nodeId, this.getDefaultOccurrences(occurrences[0], occurrences[1]), objectName);
	};
	this.getMultyAttr = function(children, cardinality_lower, exixtence, attrName){
		return  getCMultipleAttribute(children, this.getDefaultCardinality(1), getDefaultOccurrences(occurrences[0], occurrences[1]), attrName);
	};
	
	
	
	
	
	
	
	this.getPARTY_SELF = function(){
		//return this.getCComplexObject([], '', this.getDefaultOccurrences(1,1), "PARTY_SELF");
		return this.getComplexObject([], '', [1,1], "PARTY_SELF");
	};
	
	this.getPARTY_RELATED = function() {
		// var definingCode = editor.getCSingleAttribute([], editor.getDefaultExistence(1, 1), "defining_code");
		// var DV_CODED_TEXT = editor.getCComplexObject(definingCode, '', editor.getDefaultOccurrences(1, 1), "DV_CODED_TEXT");
		// var relationship = editor.getCSingleAttribute(DV_CODED_TEXT, editor.getDefaultExistence(1, 1), "relationship");
		// var PARTY_RELATED = editor.getCComplexObject([relationship], '', editor.getDefaultOccurrences(1, 1), "PARTY_RELATED");
		var relationship = this.getSingleAttr([this.getDV_CODED_TEXT()], [1,1], "relationship");
		var PARTY_RELATED = this.getComplexObject([relationship], '', [1,1], "PARTY_RELATED");
		return PARTY_RELATED;
	}; 

	this.getPARTY_IDENTIFIED = function(){
		//var externalRef = this.getCSingleAttribute([this.getPARTY_REF()], this.getDefaultExistence(1,1), "externalRef");
		//var name = this.getCSingleAttribute([], this.getDefaultExistence(1,1),"name");
		//var identifiers  = this.getCSingleAttribute([this.getDV_IDENTIFIER()], this.getDefaultExistence(1,1), "identifiers");
		//return this.getCComplexObject([], '', this.getDefaultOccurrences(1,1), "PARTY_IDENTIFIED");
		return this.getComplexObject([], '', [1,1], 'PARTY_IDENTIFIED');
		
	};
	
	this.getPARTY_REF = function(){
		
	 // var id = this.getCSingleAttribute([this.getGENERIC_ID()], this.getDefaultExistence(1,1), "id");
	  var id = this.getSingleAttr([this.getGENERIC_ID()], [1,1], 'id');
	  return this.getComplexObject([id], '', [1,1], "PARTY_REF");
	};
	
	this.getGENERIC_ID = function(){
		return this.getComplexObject([], '', [1,1], "GENERIC_ID" );
	};

	this.getDV_IDENTIFIER = function() {
		var issuer = this.getSingleAttr(null, [1,1], "issuer");
		var assigner = this.getSingleAttr(null, [1,1], "assigner");
		var id = this.getSingleAttr(null, [1,1], "id");
		var type = this.getSingleAttr(null, [1,1], "type");
		var DV_IDENTIFIER =this.getComplexObject([issuer, assigner, id, type], "", [1,1], "DV_IDENTIFIER");
		return DV_IDENTIFIER;
	};
    this.getDV_CODED_TEXT = function(){
    	var definingCode = this.getSingleAttr([],[1,1],"defining_code");
		var DV_CODED_TEXT = this.getComplexObject(definingCode, '', [1, 1], "DV_CODED_TEXT");
		return DV_CODED_TEXT;
    };
    this.getDV_TEXT = function(){
    	return this.getComplexObject([], '', [1,1], "DV_TEXT");
    };

});
