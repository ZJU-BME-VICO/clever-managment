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
            var code = "0003";
            console.log(parseInt(code));
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
					if (ontology.terms) {
						angular.forEach(ontology.terms, function(term) {
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
				menuHtml += '<li  ng-repeat = "item in nodeMenu.' + node.label.picType + '"><a class="pointer" role="menuitem"  ng-click="editNodeByMenu(' + aliasName + ',item)">{{item}}</a></li>';
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

			$scope.editArchetype = function(node,type) {
				console.log("this is value pass to edit definition pane");
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
				//   "DURATION","ORDINARY","BOOLEAN","INTERVAL","MULTIMEDIA","URI",
				//   "IDENTIFIER","PROPERTION","CLUSTER"],

				case "text":
					addText(node);
					break;
				case "code_text":
					addCodeText(node);
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
				case "ordinary":
					addOrdinary(node);
					break;
				case "boolean":
					addBoolean(node);
					break;
				case "interval":
					addInterval(node);
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
					addPropertion(node);
					break;
				case "cluster":
					addCluster(node);
					break;
				}

			};
			//==========================edit function==================================

			//--------------------------addElement function-------------------------

			function getNdodeLbel() {

			}

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
             
          //code logic              
           function getDotNumber(code){
           	var number = 0;
           	while(code.indexOf(".")!=-1){
           		code = code.slice(code.indexOf('.')+1,code.length);
           		number++;
           	}
           	return number;
           }
			function getMaxDotNumber(codeArray) {
				var maxDotNumber = 0;
				var tempDotNumber = 0;
				angular.forEach(codeArray,function(code){
					tempDotNumber = getDotNumber(code);
					if(tempDotNumber>maxDotNumber){
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
					lastString = code.slice(code.lastIndexOf('.')+1, code.length);
				} else {
					lastString = code;
				}
				return parseInt(lastString);

			}

           function sortNumber(a,b){
           	return b-a;
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
								if(maxDotNumer==0){
									return {
										maxNumber:1,
										dotNumber:0,
						
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
				var termDefinition = ontology.terms;
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
						nodeId = '0.'+nodeId;
						dotNumber--;
					}
				}
				nodeId = "at"+nodeId;
				return nodeId;

			}


			function addText(node) {
				console.log($scope.ontology);
				var nodeId = getTermDefinitionNodeId($scope.ontology);
				console.log("this is my node id ");
				console.log(nodeId);
				var dv_text = getCComplexObject(undefined, "", getDefaultOccurrences(1, 1), "DV_TEXT");
				var attribute_value = getCSingleAttribute(dv_text, getDefaultExistence(1, 1), "value");
				var object_element = getCComplexObject(attribute_value, nodeId, getDefaultOccurrences(0, 1), "ELEMENT");
				node.oriNodeRef.attributes.children.push(object_element);
				//console.log(node.oriNodeRef);
			}

			//function for edit
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

