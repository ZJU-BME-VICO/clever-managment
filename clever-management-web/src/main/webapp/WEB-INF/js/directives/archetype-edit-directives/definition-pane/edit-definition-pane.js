angular.module('clever.management.directives.editDefinitionPane', []).directive('editDefinitionPane', function(archetypeSerializeService, archetypeEditService, archetypeParseEditService) {
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
			var editor = archetypeEditService;
			var parser = archetypeParseEditService;

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
				INSTRUCTION : ["Activity", "Narrative", "State", "Subject", "Participation", "Links", "Description", "Ism_transition"],
				ADMIN_ENTRY : ["Data", "State", "Subject", "Participation", "Links"],
			};
			$scope.testMenu = ["afd", "adsffas", "afsdaga"];
			$scope.baseTypeList = ["TEXT", "CODED_TEXT", "QUANTITY", "COUNT", "DATE_TIME", "DURATION", "ORDINAL", "BOOLEAN", "INTERVAL", "MULTIMEDIA", "URI", "IDENTIFIER", "PROPERTION", "CLUSTER"], $scope.editArchetype = function(node, type) {
				console.log("this is value pass to edit definition pane");
				if ($scope.baseTypeList.indexOf(type) != -1) {
					editor.attributeCheck(node);
				}
				console.log(node);
				console.log(type);
				type = type.toLowerCase();

				switch(type) {
				//commen attributes
				case "otherparticipations":
					return addOtherParticipations(node);

				case "participation":
					return addParticipation(node);

				case "subject":
					return addSubject(node);

				//  subject:['PARTY_SELF','PARTY_IDENTIFIED','PARTY_RELATED'],
				case"party_self":
					return addPartySelf(node);

				case"party_identified":
					return addPartyIdentified(node);

				case"party_related":
					return addPartyRelated(node);

				case "links":
					return addLinks(node);

				case "link":
					return addLink(node);

				//common attributes end

				//action attributes
				case "description":
					return addDescription(node);
				case "ism_transitions":
					return addIsmTransitions(node);
				case "ism_transition":
				return addIsmTransition(node);
				//action attributes end

				//instruction attributes
				//instruction attributes end

				//observation attributes
				//observation attributes end

				//evaluation attributes
				//evaluation attributes end

				//admin entry attributes
				//admin entry attributes end
				/*
				*
				*
				*
				*/
				//	 ITEM_TREE:["TEXT","CODE_TEXT","QUANTITY","COUNT","DATE_TIME",
				//   "DURATION","ORDINAL","BOOLEAN","INTERVAL","MULTIMEDIA","URI",
				//   "IDENTIFIER","PROPERTION","CLUSTER"],
				//base type
				case "text":
					var element = addText(node);
					return element;

				case "coded_text":
					return addCodedText(node);

				case "quantity":
					return addQuantity(node);

				case"count":
					return addCount(node);

				case"date_time":
					return addDateTime(node);

				case "duration":
					return addDuration(node);

				case "ordinal":
					return addOrdinal(node);

				case "boolean":
					return addBoolean(node);

				case "interval<quantity>":
					return addInterval_quantity(node);

				case "interval<integer>":
					return addInterval_integer(node);

				case "interval<date_time>":
					return addInterval_dateTime(node);

				case "multimedia":
					return addMultimedia(node);

				case "uri":
					return addUri(node);

				case "identifier":
					return addIdentifier(node);

				case"propertion":
					return addProportion(node);

				case "cluster":
					return addCluster(node);
				//base type end

				}
				console.log("=================this is new definition================ ");
				console.log($scope.definition);
			};

			/*	scope.nodeMenu = {
			ACTION : ["Time", "Description", "Ism_transition", "Subject", "Participation", "Links"],
			OBSERVATION : ["Data", "State", "Subject", "Participation", "Links"],
			EVALUATION : ["Data", "State", "Subject", "Participation", "Links"],
			INSTRUCTION : ["Activity", "Narrative", "State", "Subject", "Participation", "Links"],
			ADMIN_ENTRY : ["Data", "State", "Subject", "Participation", "Links"],
			COMPOSITION: ["Content","Context","Composer","Category","Language","Territory"],
			ITEM_TREE : ["TEXT", "CODED_TEXT", "QUANTITY", "COUNT", "DATE_TIME", "DURATION", "ORDINAL", "BOOLEAN", "INTERVAL", "MULTIMEDIA", "URI", "IDENTIFIER", "PROPERTION", "CLUSTER"],
			ITEM_LIST : ["TEXT", "CODED_TEXT", "QUANTITY", "COUNT", "DATE_TIME", "DURATION", "ORDINAL", "BOOLEAN", "INTERVAL", "MULTIMEDIA", "URI", "IDENTIFIER", "PROPERTION", "CLUSTER"],
			CLUSTER : ["TEXT", "CODED_TEXT", "QUANTITY", "COUNT", "DATE_TIME", "DURATION", "ORDINAL", "BOOLEAN", "INTERVAL", "MULTIMEDIA", "URI", "IDENTIFIER", "PROPERTION", "CLUSTER"],
			};

			*/
			// auxiliary function
			function pushTo(node, Array) {

				if (angular.isArray(Array)) {
					Array.push(node);
				} else {
					var tempNode = Array;
					Array = [];
					Array.push(tempNode);
					Array.push(node);
				}
				return Array;

			}

			//-------------archetype common attribute added function------

			//subject function
			function addSubject(node) {
				var subjectAttribute = editor.getCSingleAttribute([], editor.getDefaultExistence(1, 1), "subject");
				node.oriNodeRef.attributes = pushTo(subjectAttribute, node.oriNodeRef.attributes);

				return parser.processAttribute(subjectAttribute, node, node.children, $scope.ontology.termDefinitions);
				// return subjectAttribute;
			}

			//children type node follow the subject
			// PARTY_SELF, PARTY_IDENTIFIED, PARTY_RELATED
			function addPartySelf(node) {
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var genericId = editor.getCComplexObject([], "", editor.getDefaultOccurrences(1, 1), "GENERIC_ID");
				var id = editor.getCSingleAttribute(genericId, editor.getDefaultExistence(1, 1), "id");
				var PARTY_REF = editor.getCComplexObject(id, "", editor.getDefaultOccurrences(1, 1), "PARTY_REF");
				var externalRef = editor.getCSingleAttribute(PARTY_REF, editor.getDefaultExistence(1, 1), "externalRef");
				var PARTY_SELF = editor.getCComplexObject(externalRef, nodeId, editor.getDefaultOccurrences(1, 1), "PARTY_SELF");
				node.oriNodeRef.children = pushTo(PARTY_SELF, node.oriNodeRef.children);

				editor.synchronizeOntology($scope.ontology, nodeId, "New Party_Self", "*");
				return parser.myProcessNode(PARTY_SELF, node, node.children, $scope.ontology.termDefinitions);

			}

			function addPartyIdentified(node) {
				var PARTY_IDNENTIFIED = editor.getCComplexObject([], "", editor.getDefaultOccurrences(0, 1), "PARTY_IDENTIFIED");
				node.oriNodeRef.children = pushTo(PARTY_IDNENTIFIED, node.oriNodeRef.children);

				return parser.myProcessNode(PARTY_IDNENTIFIED, node, node.children, $scope.ontology.termDefinitions);
			}

			function addPartyRelated(node) {
				var DV_CODED_TEXT = getDV_CODED_TEXT();
				var relationship = editor.getCSingleAttribute(DV_CODED_TEXT, editor.getDefaultExistence(1, 1), "relationship");
				var PARTY_RELATED = editor.getCComplexObject(relationship, "", editor.getDefaultOccurrences(1, 1), "PARTY_RELATED");
				node.oriNodeRef.children = pushTo(PARTY_RELATED, node.oriNodeRef.children);
				return parser.myProcessNode(PARTY_RELATED, node, node.children, $scope.ontology.termDefinitions);

			}

			//subject function end

			//participation function

			function addOtherParticipations(node) {
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var parObject = editor.getCComplexObject([], nodeId, editor.getDefaultOccurrences(0, 1), "PARTICIPATION");
				var otherParAttribute = editor.getCMultipleAttribute(parObject, editor.getDefaultCardinality(1), editor.getDefaultExistence(1, 1), "otherParticipations");
				node.oriNodeRef.attributes = pushTo(otherParAttribute, node.oriNodeRef.attributes);
				// editor.getBaseTypeObject([], nodeId, type, element, node, node.childrenAttribute,false);
				editor.synchronizeOntology($scope.ontology, nodeId, "New Participation", "*");

				return parser.processAttribute(otherParAttribute, node, node.children, $scope.ontology.termDefinitions);
				//var disParticipation  = editor.getBaseAttribute([],node,otherParAttribute,"otherParticipations",editor.getDefaultCardinality(1));
				// node.children.push(disParticipation);

			}

			function addParticipation(node) {
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var participation = editor.getCComplexObject([], nodeId, editor.getDefaultOccurrences(0, 1), "PARTICIPATION");

				//node.oriNodeRef.children.push(participation);
				node.oriNodeRef.children = pushTo(participation, node.oriNodeRef.children);
				editor.synchronizeOntology($scope.ontology, nodeId, "New Participation", "*");
				return parser.myProcessNode(participation, node, node.children, $scope.ontology.termDefinitions);

			}

			//participation function end

			// links function
			function addLinks(node) {
				var links = editor.getCSingleAttribute([], editor.getDefaultExistence(0, 1), "links");
				node.oriNodeRef.attributes = pushTo(links, node.oriNodeRef.attributes);

				return parser.processAttribute(links, node, node.children, $scope.ontology.termDefinitions);
			}

			function addLink(node) {
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var DV_TEXT = getDV_TEXT("value");
				var meaning = editor.getCSingleAttribute(DV_TEXT, editor.getDefaultExistence(1, 1), "meaning");
				var DV_EHR_URI = getDV_EHR_URI("value");
				var target = editor.getCSingleAttribute(DV_EHR_URI, editor.getDefaultExistence(1, 1), "target");

				var LINK = editor.getCComplexObject([meaning, target], nodeId, editor.getDefaultOccurrences(0, 1), "LINK");

				node.oriNodeRef.children = pushTo(LINK, node.oriNodeRef.children);
				editor.synchronizeOntology($scope.ontology, nodeId, "New Link", "*");
				return parser.myProcessNode(LINK, node, node.children, $scope.ontology.termDefinitions);

			}

			//link function end

			//------------attribute for action archetype---------------------
			function addDescription(node) {
                
			}
			
			function addIsmTransitions(node){
				var ism_transition = editor.getCSingleAttribute([],editor.getDefaultExistence(1,1),"ism_transition");
				node.oriNodeRef.attributes = pushTo(ism_transition,node.oriNodeRef.attributes);
				return parser.processAttribute(ism_transition,node, node.children,$scope.ontology.termDefinitions);
			}

			function addIsmTransition(node) {
			   var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
               var DV_CODED_TEXT_1= getDV_CODED_TEXT();
               var current_state = editor.getCSingleAttribute(DV_CODED_TEXT_1,editor.getDefaultExistence(1,1),"current_state");
               var DV_CODED_TEXT_2 = getDV_CODED_TEXT();
               var careflow_step = editor.getCSingleAttribute(DV_CODED_TEXT_2,editor.getDefaultExistence(1,1),"careflow_step");
               var ISM_TRANSITION = editor.getCComplexObject([current_state,careflow_step],nodeId,editor.getDefaultOccurrences(1,1),"ISM_TRANSITION");
			   
			   node.oriNodeRef.children = pushTo(ISM_TRANSITION,node.oriNodeRef.children);
			   editor.synchronizeOntology($scope.ontology,nodeId,"New Ism_Transition","*");
			   return parser.myProcessNode(ISM_TRANSITION,node,node.children,$scope.ontology.termDefinitions);
			   
			}

			//==========================add base type node  function==================================

			//this function can be used to add element which is not special type ,just a ccomplexibject and attribute.no CType
			function addElement(node, type) {
				//attributeCheck(node);
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var baseObject = editor.getCComplexObject(undefined, "", editor.getDefaultOccurrences(1, 1), type);
				var attribute = editor.getCSingleAttribute(baseObject, editor.getDefaultExistence(1, 1), "value");
				var element = editor.getCComplexObject(attribute, nodeId, editor.getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(element);

				//var label = getBaseTypeDefaultLabel(nodeId, type);
				var textObject = editor.getBaseTypeObject([], nodeId, type, element, node, node.childrenAttribute, false);
				//if(!node.children){node.children = [];}
				node.children.push(textObject);

				editor.synchronizeOntology($scope.ontology, nodeId, "New Element", "*");
				console.log("ontology after edit");
				console.log($scope.ontology);
				//	 $scope.$apply();
				return textObject;

			}

			function addText(node) {
				return addElement(node, "DV_TEXT");
				console.log(node);
			}

			function addCodedText(node) {
				var element = addElement(node, "DV_CODED_TEXT");
				var CodePhrase = editor.getCCodePhrase();
				CodePhrase.terminology_id = {
					value : "local",
				};
				var defining_code = editor.getCSingleAttribute(CodePhrase, editor.getDefaultExistence(1, 1), "defining_code");
				element.oriNodeRef.attributes.children.attributes = defining_code;
				console.log(element);
				return element;
				//not right
			}

			function getDV_CODED_TEXT() {
				var CodePhrase = editor.getCCodePhrase();
				var defining_code = editor.getCSingleAttribute(CodePhrase, editor.getDefaultExistence(1, 1), "defining_code");
				var DV_CODED_TEXT = editor.getCComplexObject(defining_code, "", editor.getDefaultOccurrences(1, 1), "DV_CODED_TEXT");
				return DV_CODED_TEXT;
			}

			function getDV_TEXT(attribute) {
				var attr;
				if (attribute) {
					attr = editor.getCSingleAttribute([], editor.getDefaultExistence(1, 1), attribute);
					var DV_TEXT = editor.getCComplexObject(attribute, "", editor.getDefaultOccurrences(1, 1), "DV_TEXT");

				}
				var DV_TEXT = editor.getCComplexObject([], "", editor.getDefaultOccurrences(1, 1), "DV_TEXT");
				return DV_TEXT;

			}

			function getDV_EHR_URI(attribute) {
				if (attribute) {
					attr = editor.getCSingleAttribute([], editor.getDefaultExistence(1, 1), attribute);
					var DV_EHR_URI = editor.getCComplexObject(attribute, "", editor.getDefaultOccurrences(1, 1), "DV_TEXT");

				}
				var DV_EHR_URI = editor.getCComplexObject([], "", editor.getDefaultOccurrences(1, 1), "DV_EHR_URI");
				return DV_EHR_URI;
			}

			function addQuantity(node) {
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var cDvQuantity = editor.getCDvQuantity();
				var attribute = editor.getCSingleAttribute(cDvQuantity, editor.getDefaultExistence(1, 1), "value");
				var eleObject = editor.getCComplexObject(attribute, nodeId, editor.getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add display object
				var disObject = editor.getBaseTypeObject([], nodeId, "DV_QUANTITY", eleObject, node, node.childrenAttribute, false);
				node.children.push(disObject);

				//synchronize ontology
				editor.synchronizeOntology($scope.ontology, nodeId, "New Element", "*");
				return disObject;
			}

			function addCount(node) {
				return addElement(node, "DV_COUNT");
			}

			function addDateTime(node) {
				var cDateTime = {
					'_xsi:type' : "C_DATE_TIME",
					pattern : undefined,
					list : undefined,
					range : undefined,
					assumed_value : undefined,
				};
				var primitiveObject = editor.getCPrimitiveObject(cDateTime, "", editor.getDefaultOccurrences(1, 1), "DATE_TIME");
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var bottomAttribute = editor.getCSingleAttribute(primitiveObject, editor.getDefaultExistence(1, 1), "value");
				var dateTimeObject = editor.getCComplexObject(bottomAttribute, undefined, editor.getDefaultOccurrences(0, 1), "DV_DATE_TIME");
				var topAttribute = editor.getCSingleAttribute(dateTimeObject, editor.getDefaultExistence(1, 1), "value");
				var eleObject = editor.getCComplexObject(topAttribute, nodeId, editor.getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add to display object
				var disObject = editor.getBaseTypeObject([], nodeId, "DV_DATE_TIME", eleObject, node, node.childrenAttribute, false);
				node.children.push(disObject);
				//synchronize ontology
				editor.synchronizeOntology($scope.ontology, nodeId, "New Element", "*");
				return disObject;
			}

			function addDuration(node) {
				var cDuration = editor.getCDuration();
				var primitiveObject = editor.getCPrimitiveObject(cDuration, "", editor.getDefaultOccurrences(1, 1), "DURATION");
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var bottomAttribute = editor.getCSingleAttribute(primitiveObject, editor.getDefaultExistence(1, 1), "value");
				var durationObject = editor.getCComplexObject(bottomAttribute, undefined, editor.getDefaultOccurrences(0, 1), "DV_DURATION");
				var topAttribute = editor.getCSingleAttribute(durationObject, editor.getDefaultExistence(1, 1), "value");
				var eleObject = editor.getCComplexObject(topAttribute, nodeId, editor.getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add to display object
				var disObject = editor.getBaseTypeObject([], nodeId, "DV_DURATION", eleObject, node, node.childrenAttribute, false);
				node.children.push(disObject);

				//synchronize ontology
				editor.synchronizeOntology($scope.ontology, nodeId, "New Element", "*");
				return disObject;
			}

			function addOrdinal(node) {
				var cDvOrdinal = editor.getCDvOrdinal();
				var attribute = editor.getCSingleAttribute(cDvOrdinal, editor.getDefaultExistence(1, 1), "value");
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var eleObject = editor.getCComplexObject(attribute, nodeId, editor.getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add to display object
				var disObject = editor.getBaseTypeObject([], nodeId, "DV_ORDINAL", eleObject, node, node.childrenAttribute, false);
				node.children.push(disObject);
				//synchronize ontology
				editor.synchronizeOntology($scope.ontology, nodeId, "New Element", "*");
				return disObject;
			}

			function addBoolean(node) {
				var cBoolean = editor.getCBoolean();
				var primitiveObject = editor.getCPrimitiveObject(cBoolean, "", editor.getDefaultOccurrences(1, 1), "BOOLEAN");
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var bottomAttribute = editor.getCSingleAttribute(primitiveObject, editor.getDefaultExistence(1, 1), "value");
				var durationObject = editor.getCComplexObject(bottomAttribute, undefined, editor.getDefaultOccurrences(0, 1), "DV_BOOLEAN");
				var topAttribute = editor.getCSingleAttribute(durationObject, editor.getDefaultExistence(1, 1), "value");
				var eleObject = editor.getCComplexObject(topAttribute, nodeId, editor.getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add display object
				var disObject = editor.getBaseTypeObject([], nodeId, "DV_BOOLEAN", eleObject, node, node.childrenAttribute, false);
				node.children.push(disObject);
				//synchronize ontology
				editor.synchronizeOntology($scope.ontology, nodeId, "New Element", "*");
				return disObject;

			}

			function addInterval_quantity(node) {
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var cDvQuantity_upper = editor.getCDvQuantity();
				var cDvQuantity_lower = editor.getCDvQuantity();
				var eleObject = addInterval(cDvQuantity_upper, cDvQuantity_lower, "DV_QUANTITY");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add display object
				var disObject = editor.getBaseTypeObject([], nodeId, "DV_INTERVAL<DV_QUANTITY>", eleObject, node, node.childrenAttribute, false);
				node.children.push(disObject);

				//synchronize ontology
				editor.synchronizeOntology($scope.ontology, nodeId, "New Element", "*");
				return disObject;

			}

			function addInterval_dateTime(node) {
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var cDateTime_upper = editor.getCDateTime();
				var cDateTime_lower = editor.getCDateTime();
				var eleObject = addInterval(cDateTime_upper, cDateTime_lower, "DV_DATE_TIME");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add display Object
				var disObject = editor.getBaseTypeObject([], nodeId, "DV_INTEVAL<DV_DATE_TIME>", eleObject, node, node.chidrenAttribute, false);
				node.children.push(disObject);

				//synchronize ontology
				editor.synchronizeOntology($scope.ontology, nodeId, "New Element", "*");
				return disObject;
			}

			function addInterval_count(node) {
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var count_upper = editor.getCComplexObject(undefined, "", editor.getDefaultOccurrences(1, 1), "DV_COUNT");
				var count_lower = editor.getCComplexObject(undefined, "", editor.getDefaultOccurrences(1, 1), "DV_COUNT");
				var eleObject = addInterval(count_upper, count_lower, "DV_COUNT");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add display object
				var disObject = editor.getBaseTypeObject([], nodeId, "DV_INTEVAL<DV_DATE_TIME>", eleObject, node, node.childrenAttribue, false);
				node.children.push(disObject);

				//synchronize ontology
				editor.synchronizeOntology($scope.ontology, nodeId, "New Element", "*");
				return disObject;
			}

			function addInterval(upper, lower, type) {
				var objectName = "DV_INTERVAL<" + type + ">";
				var upperAttribute = editor.getCSingleAttribute(lower, editor.getDefaultExistence(1, 1), "lower");
				var lowerAttribute = editor.getCSingleAttribute(upper, editor.getDefaultExistence(1, 1), "upper");
				var attributes = [upperAttribute, lowerAttribute];
				var intervalObject = editor.getCComplexObject(attributes, undefined, editor.getDefaultOccurrences(1, 1), objectName);
				var topAttribute = editor.getCSingleAttribute(intervalObject, editor.getDefaultExistence(1, 1), "value");
				var eleObject = editor.getCComplexObject(topAttribute, nodeId, editor.getDefaultOccurrences(0, 1), "ELEMENT");

				//add display object
				return eleObject;

			}

			function addMultimedia(node) {
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var cCodePhrase = editor.getCCodePhrase();
				cCodePhrase.terminology_id = {};
				cCodePhrase.terminology_id.value = "openEHR";
				var bottomAttribute = editor.getCSingleAttribute(cCodePhrase, editor.getDefaultExistence(1, 1), "media_type");
				var mediaObject = editor.getCComplexObject(bottomAttribute, "", editor.getDefaultOccurrences(0, 1), "DV_MULTIMEDIA");
				var topAttribute = editor.getCSingleAttribute(mediaObject, editor.getDefaultExistence(1, 1), "value");
				var eleObject = editor.getCComplexObject(topAttribute, nodeId, editor.getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add to display object
				var disObject = editor.getBaseTypeObject([], nodeId, "DV_MULTIMEDIA", eleObject, node, node.childrenAttribute, false);
				node.children.push(disObject);

				//synchronize ontology
				editor.synchronizeOntology($scope.ontology, nodeId, "New Element", "*");
				return disObject;

			}

			function addUri(node) {
				return addElement(node, "DV_URI");
			}

			function addIdentifier(node) {
				return addElement(node, "DV_IDENTIFIER");
			}

			function addProportion(node) {
				return addElement(node, "DV_PROPORTION");
			}

			function addCluster(node) {
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var eleObject = editor.getCComplexObject("", nodeId, editor.getDefaultOccurrences(0, 1), "CLUSTER");
				node.oriNodeRef.attributes.children.push(eleObject);

				//add to display object
				var disObjcet = editor.getBaseTypeObject([], nodeId, "CLUSTER", eleObject, node, node.childrenAttribute, false);
				node.children.push(disObjcet);

				//shchronize ontology
				editor.synchronizeOntology($scope.ontology, nodeId, "New Cluster", "*");

				console.log(node);
				return disObjcet;
			}

			function addParsable(node) {
				return addElement(node, "DV_PARSABLE");
			}

			function addSlot(node, type) {
				var nodeId = editor.getTermDefinitionNodeId($scope.ontology);
				var slotObject = editor.getArchetypeSlot(type, nodeId, editor.getDefaultOccurrences(0, 1));
				node.oriNodeRef.attributes.children.push(slotObject);

				//add to display object
				var disObject = editor.getBaseTypeObject(undefined, nodeId, type, slotObject, node, node.childrenAttribute, ture);
				node.children.push(disObject);
				//synchronize ontology
				editor.synchronizeOntology($scope.ontology, nodeId, type, "*");
				return disObject;
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

