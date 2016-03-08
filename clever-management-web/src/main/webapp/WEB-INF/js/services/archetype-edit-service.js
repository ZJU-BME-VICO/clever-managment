angular.module('clever.management.service.archetypeEdit', []).service('archetypeEditService', function(archetypeParseEditService, rmFactoryService, $rootScope) {

  var self = this;



  var getCBoolean = function() {
    return {
      '_xsi:type': "C_BOOLEAN",
      true_valid: "true",
      false_valid: "true",
    };
  };

  var getCDateTime = function() {
    return {
      '_xsi:type': "C_DATE_TIME",
      pattern: undefined,
      list: undefined,
      range: undefined,
      assumed_value: undefined,
    };
  };
  var getCDuration = function() {
    return {
      '_xsi:type': "C_DURATION",
      value: undefined,
      parttern: undefined,
      range: undefined,
    };
  };

  var getCInteger = function() {
    return {
      '_xsi:type': "C_INTEGER",
      list: [],
      range: undefined,
      assumed_value: undefined,
    };
  };

  var getCReal = function() {
    return {
      '_xsi:type': "C_REAL",
      list: [],
      range: undefined,
      assumed_value: undefined,
    };
  };

  var getCString = function(stringList) {
    return {
      '_xsi:type': "C_STRING",
      pattern: undefined,
      list: stringList,
      default_value: undefined,
      assumed_value: undefined,
    };
  };

  //primitive object get var end

  //Constraint object get function
  var getCDvOrdinal = function() {
    return {
      '_xsi:type': "C_DV_ORDINAL",
      list: undefined, //element is ordinal --- consist of value|symbol.defining_code.terminology_id.value&code_string
      rm_type_name: 'DV_ORDINAL',
    };
  };

  var getCCodePhrase = function() {
    return {
      '_xsi:type': "C_CODE_PHRASE",
      terminology_id: undefined,
      //code_string:undefined,
      code_list: [], //element is just number
      assumed_value: undefined,
    };
  };
  var getCCodePhraseWithPara = function(terminologyValue, codeList, assumedValue) {
    return {
      '_xsi:type': "C_CODE_PHRASE",
      terminology_id: {
        value: terminologyValue,
      },
      //code_string:undefined,
      code_list: codeList, //element is just number
      assumed_value: assumedValue,
    };
  };
  var getCDvQuantity = function() {
    return {
      '_xsi:type': "C_DV_QUANTITY",
      property: undefined, // terminology_id/value    code_string
      list: null, //ervery element have:  units   magnitude  precision
      assumed_value: undefined,
      rm_type_name: "DV_QUANTITY",
    };
  };

  var getArchetypeInternalRef = function(rmTypeName, occurrences, targetPath) {
    return {
      '_xsi:type': "ARCHETYPE_INTERNAL_REF",
      rm_type_name: rmTypeName,
      occurrences: occurrences,
      target_path: targetPath,
    };
  };

  var getConstraintRef = function() {
    return {
      '_xsi:type': "CONSTRAINT_REF",
      reference: undefined,
    };
  };

  var getArchetypeSlot = function(rmTypeName, nodeId, occurrences, includes, excludes) {
    return {
      '_xsi:type': "ARCHETYPE_SLOT",
      rm_type_name: rmTypeName,
      node_id: nodeId,
      occurrences: occurrences,
      includes: {
        string_expression: includes
      },
      excludes: {
        string_expression: excludes
      },
    };
  };
  this.defaultIncludes = "archetype_id/value matches {/.*/}";

  var cobjectMap = {
		    C_BOOLEAN : getCBoolean,
		    C_DATE_TIME : getCDateTime,
		    C_DURATION : getCDuration,
		    C_INTEGER : getCInteger,
		    C_REAL : getCReal,
		    C_STRING : getCString,
		    C_DV_ORDINAL : getCDvOrdinal,
		    C_CODE_PHRASE : getCCodePhrase,
		    C_DV_QUANTITY : getCDvQuantity,
		    ARCHETYPE_INTERNAL_REF : getArchetypeInternalRef,
		    CONSTRAINT_REF : getConstraintRef,
		    ARCHETYPE_SLOT : getArchetypeSlot,
  }

  
  //constraint object get this.end

  this.getNodeLabel = function(cardinality, code, dataType, dataValue, excludes, existence, includes, occurrences, picType, slot, text, type) {
    return {
      cardianlity: cardinality,
      code: code,
      dataType: dataType,
      dataValue: dataValue,
      excludes: excludes,
      existence: existence,
      includes: includes,
      occurrences: occurrences,
      picType: picType,
      slot: slot,
      text: text,
      type: type,
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
    };

    return {
      children: children,
      collapsed: true,
      label: label,
      oriNodeRef: oriNodeRef,
      parent: parent,
      parentAttribute: parentAttribute,
      show: true,
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
      children: children,
      collapsed: false,
      label: label,
      oriNodeRef: oriNodeRef,
      parent: parent,
      selected: 'selected',
      show: true,
    };
  };


  //this this.return a ccomplexObejct an it's attribute
  //function
  this.getOccurrences = function(lower, lower_included, lower_unbounded, upper, upper_included, upper_unbounded) {
    return {
      lower: (lower == undefined || lower == null) ? undefined : lower.toString(),
      lower_included: lower_included.toString(),
      lower_unbounded: lower_unbounded.toString(),
      upper: (upper == undefined || upper == null) ? undefined : upper.toString(),
      upper_included: upper_included.toString(),
      upper_unbounded: upper_unbounded.toString(),

    };
  };

  this.getDefaultOccurrences = function(lower, upper) {
    if (upper == '*') {
      return this.getOccurrences(lower, true, false, undefined, false, true);
    }
    return this.getOccurrences(lower, true, false, upper, true, false);
  };

  this.getCComplexObject = function(attributes, nodeId, occurrences, rmTypeName) {
    return {
      '_xsi:type': "C_COMPLEX_OBJECT",
      attributes: attributes,
      node_id: nodeId,
      occurrences: occurrences,
      rm_type_name: rmTypeName,
    };
  };
  getCComplexObject = function(attributes, nodeId, occurrences, rmTypeName) {
    return {
      '_xsi:type': "C_COMPLEX_OBJECT",
      attributes: attributes,
      node_id: nodeId,
      occurrences: occurrences,
      rm_type_name: rmTypeName,
    };
  };

  this.getCPrimitiveObject = function(item, nodeId, occurrences, rmTypeName) {
    return {
      '_xsi:type': "C_PRIMITIVE_OBJECT",
      item: item,
      node_id: nodeId,
      occurrences: occurrences,
      rm_type_name: rmTypeName,
    };
  };

  this.getCSingleAttribute = function(children, existence, rmAttributeName) {
    return {
      '_xsi:type': "C_SINGLE_ATTRIBUTE",
      children: children,
      existence: existence,
      rm_attribute_name: rmAttributeName,
    };
  };
  getCSingleAttribute = function(children, existence, rmAttributeName) {
    return {
      '_xsi:type': "C_SINGLE_ATTRIBUTE",
      children: children,
      existence: existence,
      rm_attribute_name: rmAttributeName,
    };
  };

  this.getExistence = function(lower, lower_included, lower_unbounded, upper, upper_included, upper_unbounded) {
    return {
      lower: (lower == undefined || lower == null) ? undefined : lower.toString(),
      lower_included: lower_included.toString(),
      lower_unbounded: lower_unbounded.toString(),
      upper: (upper == undefined || upper == null) ? undefined : upper.toString(),
      upper_included: upper_included.toString(),
      upper_unbounded: upper_unbounded.toString(),

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
    var items;
    if (angular.isArray(termDefinition)) {
      items = termDefinition[0].items;
    } else {
      items = termDefinition.items;
    }
    if (angular.isArray(items)) {
      angular.forEach(items, function(item) {
        codeArray.push(item._code);
      })
    } else {
      codeArray.push(items._code);
    }
    return codeArray;
  }

  function getLastNumber(code) {
    var lastString = '';
    if (code.lastIndexOf('.') != -1) {
      lastString = code.slice(code.lastIndexOf('.') + 1, code.length);
    } else {
      lastString = code.slice(2, code.length);
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
                maxNumber: 1,
                dotNumber: 0,

              };
            }
            dotNumber--;
            continue;
          }

        }
        return {
          maxNumber: currentArray[0],
          dotNumber: dotNumber,
        };

      }

      dotNumber--;

    }

  }


  this.getTermDefinitionNodeId = function(originalTermDefinition) {
    //  var termDefinition = ontology.term_definitions;

    console.log("this is termdefinition after parse--------------------------");
    console.log(originalTermDefinition);

    var codeArray = getCodeArray(originalTermDefinition);
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


  function getOriOntologyItem(nodeId, text, description) {
    return {
      _code: nodeId,
      items: [{
        _id: "text",
        __text: text,
      }, {
        _id: "description",
        __text: description,
      }]

    };
  }


  this.synchronizeOntology = function(ontology, nodeId, text, description) {
    var term_definitions = ontology.term_definitions;
    this.synchronizeOriOntology(nodeId, text, description, ontology.oriNodeRef);
    ontology.term_definitions = archetypeParseEditService.parseTermDefinition(term_definitions.oriNodeRef);
  };

  function pushToOriOntoltogyTerm(items, nodeId, text, description) {
    if (angular.isArray(items)) {
      items.push(getOriOntologyItem(nodeId, text, description));
      return items;
    } else {
      var tempItems = [];
      tempItems.push(getOriOntologyItem(nodeId, text, description));
      tempItems.push(items);
      return tempItems;
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
      var term = termDefinitions;
      if (term._language == "en") {
        term.items = pushElementToArray(getOriOntologyItem(nodeId, text, description), term.items);
      } else {
        term.items = pushElementToArray(getOriOntologyItem(nodeId, "*", "*"), term.items);
      }
    }
  };

  this.pushElementToArray = pushElementToArray;

  function pushElementToArray(element, array) {
    if (array) {
      if (angular.isArray(array)) {
        array.push(element);
      } else {
        array = [array, element];
      }
    } else {
      array = [element];
    }
    return array;
  }
  this.getCMultipleAttribute = function(children, cardianlity, existence, rmAttributeName) {
    return {
      '_xsi:type': "C_MULTIPLE_ATTRIBUTE",
      children: children,
      existence: existence,
      rm_attribute_name: rmAttributeName,
      cardinality: cardianlity,
    };
  };

  this.getCardinality = function(lower, lower_included, lower_unbounded, upper, upper_included, upper_unbounded, isOrdered, isUnique) {
    var interval;
    if (upper_unbounded == true) {
      interval = {
        lower: lower.toString(),
        lower_included: lower_included.toString(),
        lower_unbounded: lower_unbounded.toString(),
        upper_unbounded: upper_unbounded.toString(),
      };
    } else {
      interval = {
        lower: lower.toString(),
        lower_included: lower_included.toString(),
        lower_unbounded: lower_unbounded.toString(),
        upper: upper.toString(),
        upper_included: upper_included.toString(),
        upper_unbounded: upper_unbounded.toString(),
      };
    }
    return {
      interval: interval,
      is_ordered: isOrdered,
      is_unique: isUnique,
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
      oriNodeRef: oriNodeRef,
      label: this.getNodeLabel(cardinality, undefined, undefined, [], undefined, this.getDefaultExistence(1, 1), undefined, undefined, text, false, text, "attribute"),
    };
  };




  //package the base function
  this.getSingleAttr = function(children, existence, attrName) {
    return getCSingleAttribute(children, this.getDefaultExistence(existence[0], existence[1]), attrName);
  };

  this.getComplexObject = function(attributes, nodeId, occurrences, objectName) {
    return getCComplexObject(attributes, nodeId, this.getDefaultOccurrences(occurrences[0], occurrences[1]), objectName);
  };
  this.getMultyAttr = function(children, cardinality_lower, existence, attrName) {
    return this.getCMultipleAttribute(children, this.getDefaultCardinality(1), this.getDefaultExistence(existence[0], existence[1]), attrName);
  };





//
//
//  this.getPARTY_SELF = function() {
//    //return this.getCComplexObject([], '', this.getDefaultOccurrences(1,1), "PARTY_SELF");
//    return this.getComplexObject(null, '', [1, 1], "PARTY_SELF");
//  };
//
//  this.getPARTY_RELATED = function() {
//    // var definingCode = editor.getCSingleAttribute([], editor.getDefaultExistence(1, 1), "defining_code");
//    // var DV_CODED_TEXT = editor.getCComplexObject(definingCode, '', editor.getDefaultOccurrences(1, 1), "DV_CODED_TEXT");
//    // var relationship = editor.getCSingleAttribute(DV_CODED_TEXT, editor.getDefaultExistence(1, 1), "relationship");
//    // var PARTY_RELATED = editor.getCComplexObject([relationship], '', editor.getDefaultOccurrences(1, 1), "PARTY_RELATED");
//    var relationship = this.getSingleAttr([this.getDV_CODED_TEXT()], [1, 1], "relationship");
//    var PARTY_RELATED = this.getComplexObject([relationship], '', [1, 1], "PARTY_RELATED");
//    return PARTY_RELATED;
//  };
//
//  this.getPARTY_IDENTIFIED = function() {
//    //var externalRef = this.getCSingleAttribute([this.getPARTY_REF()], this.getDefaultExistence(1,1), "externalRef");
//    //var name = this.getCSingleAttribute([], this.getDefaultExistence(1,1),"name");
//    //var identifiers  = this.getCSingleAttribute([this.getDV_IDENTIFIER()], this.getDefaultExistence(1,1), "identifiers");
//    //return this.getCComplexObject([], '', this.getDefaultOccurrences(1,1), "PARTY_IDENTIFIED");
//    return this.getComplexObject(null, '', [1, 1], 'PARTY_IDENTIFIED');
//
//  };
//
//  this.getPARTY_REF = function() {
//
//    // var id = this.getCSingleAttribute([this.getGENERIC_ID()], this.getDefaultExistence(1,1), "id");
//    var id = this.getSingleAttr([this.getGENERIC_ID()], [1, 1], 'id');
//    return this.getComplexObject([id], '', [1, 1], "PARTY_REF");
//  };
//
//  this.getGENERIC_ID = function() {
//    return this.getComplexObject(null, '', [1, 1], "GENERIC_ID");
//  };




  //get primitive object
  this.getPrimitiveString = function(string) {
    var cstring = this.getCString(string || "*");
    var primitive = this.getCPrimitiveObject(cstring, '', this.getDefaultOccurrences(1, 1), "STRING");
    return primitive;
  };




  function getArchetypeId(info) {
    return info.organization + "-" + info.referenceModel + '-' + info.entityType + "." + info.concept + ".v1.1";
  }

  function getLanguage(codeString, terminologyId) {
    return {
      code_string: codeString,
      terminology_id: {
        value: terminologyId,
      },
    };
  }

  function getDefaultDescription() {
    return {
      original_author: [{
        _id: "date",
        __text: "NaN-aN-aN",
      }, {
        _id: "name",
        __text: "",
      }, {
        _id: "organisation",
        __text: "",
      }, {
        _id: "email",
        __text: "",
      }, ],
      lifecycle_state: "0",
      details: {
        copyright: "",
        missue: "",
        purpose: "",
        use: "",
        language: getLanguage("en", "ISO_639-1"),
      },

      other_details: {
        _id: "",
        __text: "",
      }
    };
  }

  function getDefaultOntology(info) {
    return {
      term_definitions: [{
        _language: "en",
        items: [{
          _code: "at0000",
          items: [{
            _id: "text",
            __text: info.concept,
          }, {
            _id: "description",
            __text: "*"
          }]
        }, ]
      }]
    };
  }


  function createBaseArchetype(info) {
    var occ = self.getDefaultOccurrences(0, 1);
    var archetypeId = getArchetypeId(info);
    info.archetypeId = archetypeId;
    var jsonObj = {
      adl_version: "1.4",
      archetype_id: {
        value: archetypeId
      },
      concept: "at0000",
      definition: {
        attributes: undefined,
        node_id: "at0000",
        occurrences: occ,
        rm_type_name: info.entityType,
        rm_obejct: new rmFactoryService[info.entityType],
      },
      description: getDefaultDescription(),
      ontology: getDefaultOntology(info),
      original_language: getLanguage("en", "ISO_639-1"),
    };
    return jsonObj;
  }

  /**
   * Create a new archetype, firstly create a base archetype consist of base information and a simple definition and ontology
   * @param {object} pattern.organization: "openEHR", pattern.referenceModel: "DEMOGRAPHIC", pattern.entityType: "AGENT", pattern.concept: "concept"
   * @return A json archetype
   */
  this.createArchetype = function(pattern) {
    console.log('the pattern is :');
    console.log(pattern);
    var jsonArchetype = createBaseArchetype(pattern);
    console.log(jsonArchetype);
    var rm_object = jsonArchetype.definition.rm_obejct;
    var attributes = generateAttributesWithOriOntology(rm_object.attributes, jsonArchetype.ontology);
    if (attributes.length) {
      jsonArchetype.definition.attributes = attributes;
    }
    return jsonArchetype;
  };

  var rmTypeWhiteList = ['STRING', 'INTEGER'];

  /**
   * create an Object node with type, get next node id in term_definition and synchronize the ontology
   * for archetype create
   * @param {Object} type The reference model type of the CObject
   * @param {Object} ontology The ontology in original archetype
   */
  function generateCObjectWithOriOntology(type, ontology) {
    if (rmTypeWhiteList.indexOf(type) != -1) {
      return undefined;
    }
    var rmObject = rmFactoryService[type] && (new rmFactoryService[type]);
    if (rmObject.isAbstract) {
      return undefined;
    }

    var nodeId = self.getTermDefinitionNodeId(ontology.term_definitions);
    self.synchronizeOriOntology(nodeId, type, '*', ontology);
    var attributes = generateAttributesWithOriOntology(rmObject, ontology);
    return self.getComplexObject(attributes, nodeId, [0, 1], type);
  }
  /**
   * generate required attribute for a rmObject, for archetype create
   * @param {Object} attributes The reference object's attributes
   * @param {Object} ontology The ontology in original archetype
   */
  function generateAttributesWithOriOntology(rmObject, ontology) {
    var attributes = rmObject.attributes;
    var result = [];
    angular.forEach(attributes, function(attribute) {
      if (attribute['@required']) {
        if (attribute['@children'].isArray) {
          var multiAttribute = self.getMultyAttr([], 0, [1, 1], attribute.name);
          result.push(multiAttribute);
        } else {
          var children = generateCObjectWithOriOntology(attribute['@children'].type, ontology);
          var singleAttr = self.getSingleAttr(children || [], [1, 1], attribute.name);
          result.push(singleAttr);
        }
      }
    });
    return result;
  }

   var intervalMap = {
		 INTERVAL_COUNT : 'DV_INTERVAL<DV_COUNT>',
		 INTERVAL_QUANTITY : 'DV_INTERVAL<DV_QUANTITY>',
		 INTERVAL_DATETIME : 'DV_INTERVAL<DV_DATE_TIME>',
   }
  
  this.generateCObjectWithParsedOntology = function(type, ontology) {
	 if(type.includes('SLOT_')){ 
        type = type.slice(5, type.length);
        var nodeId = self.getTermDefinitionNodeId(ontology.term_definitions.oriNodeRef);
        self.synchronizeOntology(ontology, nodeId, type, '*');
    	return getArchetypeSlot(type, nodeId,  self.getDefaultOccurrences(1,'*'), self.defaultIncludes, undefined) 
    }
	 if(cobjectMap[type]){
		 return cobjectMap[type]();
	 }else{ 
		 if (rmTypeWhiteList.indexOf(type) != -1) {
			 return undefined;
		 }
		 
		 var rmObject = rmFactoryService[type] && (new rmFactoryService[type]);
		 if (rmObject.isAbstract) {
			 return 'can not generate rmObject with type : ' + type + ' because this type is a abstract!';
		 }
		 var nodeId = self.getTermDefinitionNodeId(ontology.term_definitions.oriNodeRef);
		 
		 self.synchronizeOntology(ontology, nodeId, type, '*');
		 var attributes = this.generateAttributesWithParsedOntology(rmObject, ontology);
		 return self.getComplexObject(attributes, nodeId, [0, 1], type.includes('INTERVAL')? intervalMap[type] : type);
	 }
	
  }

  this.generateAttributesWithParsedOntology = function(rmObject, ontology) {
    var attributes = rmObject.attributes;
    var result = [];
    angular.forEach(attributes, function(attribute) {
      if (attribute['@required']) {
        if (attribute['@children'].isArray) {
          var multiAttribute = self.getMultyAttr([], 0, [1, 1], attribute.name);
          result.push(multiAttribute);
        } else {
        	/* for interval type node, may should be rewrite someday */
          if(['upper', 'lower'].indexOf(attribute.name) != -1){
        	  var children = self.generateCObjectWithParsedOntology(attribute['@children'].type, ontology);
              var singleAttr = self.getSingleAttr(children, [1, 1], attribute.name);
          }else{
        	  //var children = generateCObjectWithParsedOntology(attribute['@children'].type, ontology);
        	  var singleAttr = self.getSingleAttr([], [1, 1], attribute.name);
          }
          result.push(singleAttr);
        }
      }
    });
    return result;
  }
  
  this.generateAttributesWithParsedOntologyForInterval = function(rmObject, ontology) {
	    var attributes = rmObject.attributes;
	    var result = [];
	    angular.forEach(attributes, function(attribute) {
	      if (attribute['@required']) {
	        if (attribute['@children'].isArray) {
	          var multiAttribute = self.getMultyAttr([], 0, [1, 1], attribute.name);
	          result.push(multiAttribute);
	        } else {
	          var children = generateCObjectWithParsedOntology(attribute['@children'].type, ontology);
	          var singleAttr = self.getSingleAttr(children, [1, 1], attribute.name);
	          result.push(singleAttr);
	        }
	      }
	    });
	    return result;
	  }

//  this.generateAttribtue = function(attributeName, parentType) {
//    var rmAttribtue = rmFactoryService.getAttribute(new rmFactoryService[parentType], attributeName);
//    var attribute;
//    if (rmAttribtue['@children'].isArray) {
//      attribute = self.getMultyAttr([], 0, [0, 1], attributeName);
//    } else {
//      attribute = self.getSingleAttr([], [0, 1], attributeName);
//    }
//    return attribute;
//  }

});
