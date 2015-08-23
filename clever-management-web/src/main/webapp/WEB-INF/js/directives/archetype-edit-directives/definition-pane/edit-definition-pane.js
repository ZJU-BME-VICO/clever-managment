angular.module('clever.management.directives.editDefinitionPane', []).directive('editDefinitionPane', function(archetypeSerializeService) {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			definition : '=',
			ontology : '=',
			selectedLanguage : '=',
			maxHeight : '=',
		},
		templateUrl : 'js/directives/archetype-edit-directives/definition-pane/edit-definition-pane.html',

		controller : function($scope, $element, $attrs) {

			$scope.getTreeNodeMessage = function(node) {

			};
			$scope.treeControl = {};
			$scope.isCollapse = true;
			$scope.collapse = function() {
				$scope.treeControl.collapseAll();
				$scope.isCollapse = true;

			};

			$scope.expand = function() {
				$scope.treeControl.expandAll();
				$scope.isCollapse = false;
			};
			$scope.getEditableTreeNodeLabel = function(node, aliasName) {

				var picType = node.label.picType.toLowerCase();
				var label = '';
				label += '<span class="archetype-edit-icon ' + node.label.picType.toLowerCase() + '" style="padding: 7px 10px; background-position-y: 10px;"></span>';
				if (node.label.code) {
					if (node.label.archetypeNode) {
						label += '<span style="color: black;font-weight: bold;">&nbsp';
					} else {
						label += '<span style="color: brown;">&nbsp';
					}

					label += getOntologyByCode(node.label.code, $scope.ontology).text;
					label += '</span>';
				} else if (node.label.text) {
					label += '<span style="color: brown;">&nbsp' + node.label.text + '</span>';
				}

				return label;
				//return '<span>undefineddd</span>';

			};

			$scope.getOntologyByCode = function(code, ontology) {
				return getOntoltogyByCode(node, ontology);
			};
			function getOntologyByCode(code, ontology) {
				if (ontology && code) {
					var matchedOntology;
					if (ontology.term_definitions) {
						angular.forEach(ontology.term_definitions, function(term) {
							if (term.language == 'en') {//$scope.selectedLanguage){
								angular.forEach(term.items, function(value) {
									if (value.code == code)
										matchedOntology = value;
									return matchedOntology;
								});
							}
						});
					}
					return matchedOntology;
				}
			}


			
			$scope.getTreeNodeMenu = function(node, aliasName) {

				var menuHtml = '<ul class="dropdown-menu" role="menu" ng-if="true">';
				if (node.label.slot) {

				} else {
					menuHtml += '<li  ng-repeat = "item in nodeMenu.' + node.label.picType + '"><a class="pointer" role="menuitem"  ng-click="editNodeByMenu(' + aliasName + ',item)">{{item}}</a></li>';
				}
				menuHtml += '</ul>';
				return menuHtml;

			}; 

			$scope.nodeMenu = {
				ACTION : ["Time", "Description", "Ism_transition", "Subject", "Participation", "Links"],
				OBSERVATION : ["Data", "State", "Subject", "Participation", "Links"],
				EVALUATION : ["Data", "State", "Subject", "Participation", "Links"],
				INSTRUCTION : ["Activity", "Narrative", "State", "Subject", "Participation", "Links"],
				ADMIN_ENTRY : ["Data", "State", "Subject", "Participation", "Links"],
			};
			$scope.testMenu = ["afd", "adsffas", "afsdaga"];
            $scope.baseTypeList = ["TEXT","CODED_TEXT","QUANTITY","COUNT","DATE_TIME","DURATION","ORDINAL","BOOLEAN","INTERVAL","MULTIMEDIA","URI","IDENTIFIER","PROPERTION","CLUSTER"],

			$scope.editArchetype = function(node, type) {
				console.log("this is value pass to edit definition pane");
				if($scope.baseTypeList.indexOf(type)!= -1){
					attributeCheck(node);
				}
				console.log(node);
				console.log(type);
				type = type.toLowerCase();
				
				
				
				
				switch(type) {
				case "Activity":
					addActivity(node);
					break;
				case "Narrative":
					addNarrative(node);
					break;

				/*
				*
				*
				*
				*/
				//	 ITEM_TREE:["TEXT","CODE_TEXT","QUANTITY","COUNT","DATE_TIME",
				//   "DURATION","ORDINAL","BOOLEAN","INTERVAL","MULTIMEDIA","URI",
				//   "IDENTIFIER","PROPERTION","CLUSTER"],

				case "text":
					addText(node);
					break;
				case "coded_text":
					addCodedText(node);
					break;
				case "quantity":
					addQuantity(node);
					break;
				case"count":
					addCount(node);
					break;
				case"date_time":
					addDateTime(node);
					break;
				case "duration":
					addDuration(node);
					break;
				case "ordinal":
					addOrdinal(node);
					break;
				case "boolean":
					addBoolean(node);
					break;
				case "interval<quantity>":
					addInterval_quantity(node);
					break;
				case "interval<integer>":
					addInterval_integer(node);
					break;
				case "interval<date_time>":
					addInterval_dateTime(node);
					break;
				case "multimedia":
					addMultimedia(node);
					break;
				case "uri":
					addUri(node);
					break;
				case "identifier":
					addIdentifier(node);
					break;
				case"propertion":
					addProportion(node);
					break;
				case "cluster":
					addCluster(node);
					break;
				}
              console.log("=================this is new definition================ ");
              console.log($scope.definition);
			};
			var test = "";
			if(!test){
				console.log("yes");
			}else
			{
				console.log("no");
			}

			//==========================edit function==================================

			//--------------------------addElement function-------------------------

			// primitive object get function

			function getCBoolean() {
				return {
					'_xsi:type' : "C_BOOLEAN",
					true_valid : "true",
					false_valid : "true",
				};
			}

			function getCDateTime() {
				return {
					'_xsi:type' : "C_DATE_TIME",
					pattern : undefined,
					list : undefined,
					range : undefined,
					assumed_value : undefined,
				};
			}

			function getCDuration() {
				return {
					'_xsi:type' : "C_DURATION",
					value : undefined,
					parttern : undefined,
					range : undefined,
				};
			}

			function getCInteger() {
				return {
					'_xsi:type' : "C_INTEGER",
					list : [],
					range : undefined,
					assumed_value : undefined,
				};
			}

			function getCReal() {
				return {
					'_xsi:type' : "C_REAL",
					list : [],
					range : undefined,
					assumed_value : undefined,
				};
			}

			function getCString() {
				return {
					'_xsi:type' : "C_STRING",
					pattern : undefined,
					list : [],
					default_value : undefined,
					assumed_value : undefined,
				};
			}

			//primitive object get function end

			//Constraint object get function
			function getCDvOrdinal() {
				return {
					'_xsi:type' : "C_DV_ORDINAL",
					list : [], //element is ordinal --- consist of value|symbol.defining_code.terminology_id.value&code_string
				};
			}

			function getCCodePhrase() {
				return {
					'_xsi:type' : "C_CODE_PHRASE",
					terminology_id : undefined,
					//code_string:undefined,
					code_list : [], //element is just number
					assumed_value : undefined,
				};
			}

			function getCDvQuantity() {
				return {
					'_xsi:type' : "C_DV_QUANTITY",
					property : undefined, // terminology_id/value    code_string
					list : [], //ervery element have:  units   magnitude  precision
					assumed_value : undefined,

				};
			}

			function getArchetypeInternalRef(rmTypeName, occurrences, targetPath) {
				return {
					'_xsi:type' : "ARCHETYPE_INTERNAL_REF",
					rm_type_name : rmTypeName,
					occurrences : occurrences,
					target_path : targetPath,
				};
			}

			function getConstraintRef() {
				return {
					'_xsi:type' : "CONSTRAINT_REF",
					reference : undefined,
				};
			}

			function getArchetypeSlot(rmTypeName, nodeId, occurrences) {
				return {
					'_xsi:type' : "ARCHETYPE_SLOT",
					rm_type_name : rmTypeName,
					node_id : nodeId,
					occurrences : occurrences,
					includes : undefined,
					excludes : undefined,
				};
			}

			//constraint object get function end

			function getNodeLabel(cardinality, code, dataType, dataValue, excludes, existence, includes, occurrences, picType, slot, text, type) {
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
			}

			function getBaseTypeDefaultLabel(code, dataType) {
				return getNodeLabel(undefined, code, dataType, [], undefined, undefined, undefined, getDefaultOccurrences(0, 1), dataType, false, "ELEMENT", "type");
			}

			//this function return an object(parsed type).which can be added to display Object
			function getBaseTypeObject(children, nodeId, type, oriNodeRef, parent, parentAttribute,isSlot) {
				
				var label;
				if(isSlot){
					label = getNodeLabel(undefined,nodeId,undefined,[],undefined,undefined,undefined,getDefaultOccurrences(0,1),type,true,type,"type");
				}else if(type=="CLUSTER"){
					var label = getNodeLabel(undefined,nodeId,type,[],undefined,undefined,undefined,getDefaultOccurrences(0,1),type,false,"CLUSTER","type");
				}else{
				var label = getBaseTypeDefaultLabel(nodeId, type);
				}
				
				
				return {
					children : children,
					collapsed : true,
					label : label,
					oriNodeRef : oriNodeRef,
					parent : parent,
					parentAttribute : parentAttribute,
					show : true,
				};
			}
			
			

			//this function return a ccomplexObejct an it's attribute
			//function
			function getOccurrences(lower, lower_included, lower_unbounded, upper, upper_included, upper_unbounded) {
				return {
					lower : lower.toString(),
					lower_included : lower_included.toString(),
					lower_unbounded : lower_unbounded.toString(),
					upper : upper.toString(),
					upper_included : upper_included.toString(),
					upper_unbounded : upper_unbounded.toString(),

				};
			}

			function getDefaultOccurrences(lower, upper) {
				return getOccurrences(lower, true, false, upper, true, false);
			}

			function getCComplexObject(attributes, nodeId, occurrences, rmTypeName) {
				return {
					'_xsi:type' : "C_COMPLEX_OBJECT",
					attributes : attributes,
					node_id : nodeId,
					occurrences : occurrences,
					rm_type_name : rmTypeName,
				};
			}

			function getCPrimitiveObject(item, nodeId, occurrences, rmTypeName) {
				return {
					'_xsi:type' : "C_PRIMITIVE_OBJECT",
					item : item,
					node_id : nodeId,
					occurrences : occurrences,
					rm_type_name : rmTypeName,
				};
			}

			function getCSingleAttribute(children, existence, rmAttributeName) {
				return {
					'_xsi:type' : "C_SINGLE_ATTRIBUTE",
					children : children,
					existence : existence,
					rm_attribute_name : rmAttributeName,
				};
			}

			function getExistence(lower, lower_included, lower_unbounded, upper, upper_included, upper_unbounded) {
				return {
					lower : lower.toString(),
					lower_included : lower_included.toString(),
					lower_unbounded : lower_unbounded.toString(),
					upper : upper.toString(),
					upper_included : upper_included.toString(),
					upper_unbounded : upper_unbounded.toString(),

				};
			}

			function getDefaultExistence(lower, upper) {
				return getExistence(lower, true, false, upper, true, false);
			}

			function getCardinality() {

			}

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
					lastString = code;
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

			function getTermDefinitionNodeId(ontology) {
				var termDefinition = ontology.term_definitions;
				var codeArray = getCodeArray(termDefinition);
				var maxDotNumber = getMaxDotNumber(codeArray);
				var maxCodeMessage = getMaxCodeMessage(codeArray, maxDotNumber);
				//var nodeId = 'at';
				var nodeId = "";
				var dotNumber = maxDotNumber;
				var nodeId = (maxCodeMessage.maxNumber + 1).toString();
				if (dotNumber == 0) {
					nodeId += lastString;
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

			}

			function getDisOntologyItem(nodeId, text) {
				return {
					code : nodeId,
					comment : undefined,
					description : "*",
					text : text,
				};
			}

			function getOriOntologyItem(nodeId, text) {
				return {
					_code : nodeId,
					items : [{
						_id : "text",
						__text : text,
					}, {
						_id : "description",
						__text : "*",
					}]

				};
			}

			function synchronizeOntology(nodeId,text) {
				var terms = $scope.ontology.term_definitions;
				if (angular.isArray(terms)) {
					angular.forEach(terms, function(term) {
						if (term.language == "en") {
							term.items.push(getDisOntologyItem(nodeId, text));
						} else {
							term.items.push(getDisOntologyItem(nodeId, "*"));
						}
					});
				} else {
					if (terms.language == "en") {
						terms.items.push(getDisOntologyItem(nodeId, text));
					} else {
						terms.items.push(getDisOntologyItem(nodeId, "*"));
					}
				}

				//change original node content
				if (angular.isArray(terms.oriNodeRef)) {
					angular.forEach(terms.oriNodeRef, function(term) {
						if (term._language == "en") {
							term.items.push(getOriOntologyItem(nodeId, text));
						} else {
							term.items.push(getOriOntologyItem(nodeId, "*"));
						}
					});
				} else {
					term = terms.oriNodeRef;
					if (term._langguage == "en") {
						term.items.push(getOriOntologyItem(nodeId, text));
					} else {
						term.items.push(getOriOntologyItem(nodeId, "*"));
					}
				}
			}

			function getCMultipleAttribute(children, cardianlity, existence, rmAttributeName) {
				return {
					'_xsi:type' : "C_MULTIPLE_ATTRIBUTE",
					children : children,
					existence : existence,
					rm_attribute_name : rmAttributeName,
					cardinality : cardianlity,
				};
			}

			function getCardinality(lower, lower_included, lower_unbounded, upper, upper_included, upper_unbounded, isOrdered, isUnique) {
				return {
					lower : lower.toString(),
					lower_included : lower_included.toString(),
					lower_unbounded : lower_unbounded.toString(),
					upper : upper.toString(),
					upper_included : upper_included.toString(),
					upper_unbounded : upper_unbounded.toString(),
					is_ordered : isOrdered,
					is_unique : isUnique,
				};
			}

			function getDefaultCardinality(lower) {
				return getCardinality(lower, true, false, 1, false, true, false, false);
			}

			//getNodeLabel(cardinality, code, dataType, dataValue, excludes, existence, includes, occurrences, picType, slot, text, type) {

			function getAttribute(cardinality, text, oriNodeRef) {
				return {
					oriNodeRef : oriNodeRef,
					label : getNodeLabel(cardinality, undefined, undefined, [], undefined, getDefaultExistence(1, 1), undefined, undefined, text, false, text, "attribute"),
				};
			}

			function attributeCheck(node) {
				
				if (node.oriNodeRef.attributes && node.childrenAttribute) {
					return;
				} else if (!node.oriNodeRef.attributes && !node.childrenAttribute) {
					var multiAttribute = getCMultipleAttribute([], getDefaultCardinality(1), getDefaultExistence(1, 1), "items");
					node.oriNodeRef.attributes = multiAttribute;

					var attribute = getAttribute(getDefaultCardinality(1), "items", multiAttribute);

					node.childrenAttribute = attribute;
					//node.children = [];

				}

			}
          
			//this function can be used to add element which is not special type ,just a ccomplexibject and attribute.no CType
			function addElement(node, type) {
				//attributeCheck(node);
				var nodeId = getTermDefinitionNodeId($scope.ontology);
				var baseObject = getCComplexObject(undefined, "", getDefaultOccurrences(1, 1), type);
				var attribute = getCSingleAttribute(baseObject, getDefaultExistence(1, 1), "value");
				var element = getCComplexObject(attribute, nodeId, getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(element);

				//var label = getBaseTypeDefaultLabel(nodeId, type);
				var textObject = getBaseTypeObject([], nodeId, type, element, node, node.childrenAttribute,false);
				node.children.push(textObject);

				synchronizeOntology(nodeId,"New Element");

			}

			function addText(node) {
				/*console.log("this is editable node");
				 console.log(node);
				 //console.log($scope.ontology);
				 var nodeId = getTermDefinitionNodeId($scope.ontology);
				 console.log("this is my node id ");
				 console.log(nodeId);

				 //(1):add text element to oriNodeRef
				 var dv_text = getCComplexObject(undefined, "", getDefaultOccurrences(1, 1), "DV_TEXT");
				 var attribute_value = getCSingleAttribute(dv_text, getDefaultExistence(1, 1), "value");
				 var object_element = getCComplexObject(attribute_value, nodeId, getDefaultOccurrences(0, 1), "ELEMENT");
				 node.oriNodeRef.attributes.children.push(object_element);
				 //console.log(node.oriNodeRef);

				 //(2):add text element to display object
				 var textObject = getBaseTypeObject([], nodeId,"DV_TEXT", object_element, node, node.childrenAttribute);
				 node.children.push(textObject);

				 //(3):add term in ontology
				 synchronizeOntology(nodeId);*/
				//attributeCheck(node);
				addElement(node, "DV_TEXT");
				console.log(node);
			}

			function addCodedText(node) {
				addElement(node, "DV_CODED_TEXT");
				//not right
			}

			function addQuantity(node) {
				var nodeId = getTermDefinitionNodeId($scope.ontology);
				// var cDvQuantity = {
				// 'xsi_type' : 'C_DV_QUANTITY',
				// property : undefined, // terminology_id/value    code_string
				// list : [], //ervery element have:  units   magnitude  precision
				// assumed_value : undefined,
				// };
				var cDvQuantity = getCDvQuantity();
				var attribute = getCSingleAttribute(cDvQuantity, getDefaultExistence(1, 1), "value");
				var eleObject = getCComplexObject(attribute, nodeId, getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add display object
				var disObject = getBaseTypeObject([], nodeId, "DV_QUANTITY", eleObject, node, node.childrenAttribute,false);
				node.children.push(disObject);

				//synchronize ontology
				synchronizeOntology(nodeId,"New Element");
			}

			function addCount(node) {
				addElement(node, "DV_COUNT");
			}

			function addDateTime(node) {
				var cDateTime = {
					'_xsi:type' : "C_DATE_TIME",
					pattern : undefined,
					list : undefined,
					range : undefined,
					assumed_value : undefined,
				};
				var primitiveObject = getCPrimitiveObject(cDateTime, "", getDefaultOccurrences(1, 1), "DATE_TIME");
				var nodeId = getTermDefinitionNodeId($scope.ontology);
				var bottomAttribute = getCSingleAttribute(primitiveObject, getDefaultExistence(1, 1), "value");
				var dateTimeObject = getCComplexObject(bottomAttribute, undefined, getDefaultOccurrences(0, 1), "DV_DATE_TIME");
				var topAttribute = getCSingleAttribute(dateTimeObject, getDefaultExistence(1, 1), "value");
				var eleObject = getCComplexObject(topAttribute, nodeId, getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add to display object
				var disObject = getBaseTypeObject([], nodeId, "DV_DATE_TIME", eleObject, node, node.childrenAttribute,false);
				node.children.push(disObject);
				//synchronize ontology
				synchronizeOntology(nodeId,"New Element");
			}

			function addDuration(node) {
				var cDuration = getCDuration();
				var primitiveObject = getCPrimitiveObject(cDuration, "", getDefaultOccurrences(1, 1), "DURATION");
				var nodeId = getTermDefinitionNodeId($scope.ontology);
				var bottomAttribute = getCSingleAttribute(primitiveObject, getDefaultExistence(1, 1), "value");
				var durationObject = getCComplexObject(bottomAttribute, undefined, getDefaultOccurrences(0, 1), "DV_DURATION");
				var topAttribute = getCSingleAttribute(durationObject, getDefaultExistence(1, 1), "value");
				var eleObject = getCComplexObject(topAttribute, nodeId, getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add to display object
				var disObject = getBaseTypeObject([], nodeId, "DV_DURATION", eleObject, node, node.childrenAttribute,false);
				node.children.push(disObject);

				//synchronize ontology
				synchronizeOntology(nodeId,"New Element");
			}

			function addOrdinal(node) {
				var cDvOrdinal = getCDvOrdinal();
				var attribute = getCSingleAttribute(cDvOrdinal, getDefaultExistence(1, 1), "value");
				var nodeId = getTermDefinitionNodeId($scope.ontology);
				var eleObject = getCComplexObject(attribute, nodeId, getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add to display object
				var disObject = getBaseTypeObject([], nodeId, "DV_ORDINAL", eleObject, node, node.childrenAttribute,false);
				node.children.push(disObject);
				//synchronize ontology
				synchronizeOntology(nodeId,"New Element");
			}

			function addBoolean(node) {
				var cBoolean = getCBoolean();
				var primitiveObject = getCPrimitiveObject(cBoolean, "", getDefaultOccurrences(1, 1), "BOOLEAN");
				var nodeId = getTermDefinitionNodeId($scope.ontology);
				var bottomAttribute = getCSingleAttribute(primitiveObject, getDefaultExistence(1, 1), "value");
				var durationObject = getCComplexObject(bottomAttribute, undefined, getDefaultOccurrences(0, 1), "DV_BOOLEAN");
				var topAttribute = getCSingleAttribute(durationObject, getDefaultExistence(1, 1), "value");
				var eleObject = getCComplexObject(topAttribute, nodeId, getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add display object
				var disObject = getBaseTypeObject([], nodeId, "DV_BOOLEAN", eleObject, node, node.childrenAttribute,false);
				node.children.push(disObject);
				//synchronize ontology
				synchronizeOntology(nodeId,"New Element");

			}

			function addInterval_quantity(node) {
				var nodeId = getTermDefinitionNodeId($scope.ontology);
				var cDvQuantity_upper = getCDvQuantity();
				var cDvQuantity_lower = getCDvQuantity();
				var eleObject = addInterval(cDvQuantity_upper, cDvQuantity_lower, "DV_QUANTITY");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add display object
				var disObject = getBaseTypeObject([], nodeId, "DV_INTERVAL<DV_QUANTITY>", eleObject, node, node.childrenAttribute,false);
				node.children.push(disObject);

				//synchronize ontology
				synchronizeOntology(nodeId,"New Element");

			}

			function addInterval_dateTime(node) {
				var nodeId = getTermDefinitionNodeId($scope.ontology);
				var cDateTime_upper = getCDateTime();
				var cDateTime_lower = getCDateTime();
				var eleObject = addInterval(cDateTime_upper, cDateTime_lower, "DV_DATE_TIME");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add display Object
				var disObject = getBaseTypeObject([], nodeId, "DV_INTEVAL<DV_DATE_TIME>", eleObject, node, node.chidrenAttribute,false);
				node.children.push(disObject);

				//synchronize ontology
				synchronizeOntology(nodeId,"New Element");
			}

			function addInterval_count(node) {
				var nodeId = getTermDefinitionNodeId($scope.ontology);
				var count_upper = getCComplexObject(undefined, "", getDefaultOccurrences(1, 1), "DV_COUNT");
				var count_lower = getCComplexObject(undefined, "", getDefaultOccurrences(1, 1), "DV_COUNT");
				var eleObject = addInterval(count_upper, count_lower, "DV_COUNT");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add display object
				var disObject = getBaseTypeObject([], nodeId, "DV_INTEVAL<DV_DATE_TIME>", eleObject, node, node.childrenAttribue,false);
				node.children.push(disObject);

				//synchronize ontology
				synchronizeOntology(nodeId,"New Element");
			}

			function addInterval(upper, lower, type) {
				var objectName = "DV_INTERVAL<" + type + ">";
				var upperAttribute = getCSingleAttribute(lower, getDefaultExistence(1, 1), "lower");
				var lowerAttribute = getCSingleAttribute(upper, getDefaultExistence(1, 1), "upper");
				var attributes = [upperAttribute, lowerAttribute];
				var intervalObject = getCComplexObject(attributes, undefined, getDefaultOccurrences(1, 1), objectName);
				var topAttribute = getCSingleAttribute(intervalObject, getDefaultExistence(1, 1), "value");
				var eleObject = getCComplexObject(topAttribute, nodeId, getDefaultOccurrences(0, 1), "ELEMENT");

				//add display object
				return eleObject;

			}

			function addMultimedia(node) {
				var nodeId = getTermDefinitionNodeId($scope.ontology);
				var cCodePhrase = getCCodePhrase();
				cCodePhrase.terminology_id = {};
				cCodePhrase.terminology_id.value = "openEHR";
				var bottomAttribute = getCSingleAttribute(cCodePhrase, getDefaultExistence(1, 1), "media_type");
				var mediaObject = getCComplexObject(bottomAttribute, "", getDefaultOccurrences(0, 1), "DV_MULTIMEDIA");
				var topAttribute = getCSingleAttribute(mediaObject, getDefaultExistence(1, 1), "value");
				var eleObject = getCComplexObject(topAttribute, nodeId, getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add to display object
				var disObject = getBaseTypeObject([],nodeId, "DV_MULTIMEDIA", eleObject, node, node.childrenAttribute,false);
				node.children.push(disObject);

				//synchronize ontology
				synchronizeOntology(nodeId,"New Element");

			}

			function addUri(node) {
				addElement(node, "DV_URI");
			}

			function addIdentifier(node) {
				addElement(node, "DV_IDENTIFIER");
			}

			function addProportion(node) {
				addElement(node, "DV_PROPORTION");
			}

			function addCluster(node) {
				var nodeId = getTermDefinitionNodeId($scope.ontology);
				var eleObject = getCComplexObject("", nodeId, getDefaultOccurrences(0, 1), "CLUSTER");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add to display object
				var disObjcet = getBaseTypeObject([],nodeId, "CLUSTER", eleObject, node, node.childrenAttribute,false);
				node.children.push(disObjcet);

				//shchronize ontology
				synchronizeOntology(nodeId,"New Cluster");
				
				console.log(node);
			}

			function addParsable(node) {
				addElement(node, "DV_PARSABLE");
			}
			
			
		
           function addSlot(node,type){
           	 var nodeId = getTermDefinitionNodeId($scope.ontology);
           	 var slotObject = getArchetypeSlot(type,nodeId,getDefaultOccurrences(0,1));
           	 node.oriNodeRef.attributes.children.push(slotObject);
           	 
           	 //add to display object
           	 var disObject = getBaseTypeObject(undefined,nodeId,type,slotObject,node,node.childrenAttribute,ture);
           	 node.children.push(disObject);
           	 //synchronize ontology
           	 synchronizeOntology(nodeId,type);
           }
			//this function can be used to add element:	'DV_TEXT', 'DV_CODED_TEXT', 'DV_QUANTITY'?, 'DV_ORDINAL?', 'DV_DATE_TIME', 'DV_DATE', 'DV_TIME', 'DV_BOOLEAN', 'DV_COUNT', 'DV_DURATION', 'DV_INTERVAL<DV_DATE>', 'DV_INTERVAl<DV_TIME>', 'DV_INTERVAL<DV_DATE_TIME>', 'DV_INTERVAL<COUNT>', 'DV_INTERVAL<QUANTITY>', 'DV_MULTIMEDIA', 'DV_URI', 'DV_EHR_URI', 'DV_PROPORTION', 'DV_IDENTIFIER', 'DV_PARSABLE', 'DV_BOOLEAN'];

			//delete Element
			$scope.deleteElement = function() {
			};
			//console.log("this is attrs");
			//console.log($attrs);

		},
		link : function($scope, element, attrs) {

			$scope.contentHeight = angular.isDefined(attrs.maxHeight) ? $scope.$parent.$eval(attrs.maxHeight) : undefined;
			console.log($scope.contentHeight);
		}
	};

});

