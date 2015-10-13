angular.module('clever.management.directives.subjectPane', []).directive('subjectPane', function(archetypeEditService) {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			subject : "=",

		},
		templateUrl : 'js/directives/archetype-edit-directives/definition-pane/subject-pane/subject-pane.html',

		controller : function($scope, $element, $attrs) {
		   var editor = archetypeEditService;
		   $scope.$watch('subject', function(newValue){
		   	console.log("thisi  is   subject");
		   	console.log(newValue);
		   });
		   
        	$scope.partyTypeList = ["PARTY_SELF", "PARTY_IDENTIFIED", "PARTY_RELATED"];
			
			$scope.partyType = {};
			$scope.hasExternalRef = {};
			$scope.hasName = {};
			$scope.hasIdentifiers = {}; 

			$scope.$watch('subject', function(newValue) {
				console.log(newValue);
				$scope.oriSubject = $scope.subject.oriNodeRef;
				processSubject($scope.oriSubject);
			});
			$scope.$watch('partyType.value', function(newValue, oldValue) {
				if ((newValue != undefined && newValue != oldValue) ) {
					changePartyType(newValue);
				}
			});

			//---------------------------Performer edit function ---------------------------------------------------------------------------------
			function changePartyType(type) {
				if ($scope.partyType) {
					switch($scope.partyType.value) {
					case 'PARTY_SELF':
						addPartySelf();
						break;
					case 'PARTY_IDENTIFIED':
						addPartyIdentified();
						break;
					case 'PARTY_RELATED':
						addPartyRelated();
						break;
					}

					//processParticipation($scope.participation);
				}
			}

			function addPartySelf() {
				resetState();
			    var partySelf = editor.getPARTY_SELF();
				$scope.oriSubject.children = partySelf;
			}

			function addPartyIdentified() {
				resetState();
			    var partyIdentified = editor.getPARTY_IDENTIFIED();
				$scope.oriSubject.children = partyIdentified;

			}

			function addPartyRelated() {
				resetState();		
				var partyRelated = editor.getPARTY_RELATED();		
				$scope.oriSubject.children = partyRelated;

			}
			
			
			function resetState() {
				$scope.oriSubject.children = undefined;
				if($scope.hasExternalRef){
					$scope.hasExternalRef.value = undefined;
				}
				
				if($scope.hasName){
					$scope.hasName.value = undefined;
				}
				if($scope.hasIdentifiers){
					$scope.hasIdentifiers.value = undefined;
				}
			}

			//externalRef edit function

			$scope.$watch('hasExternalRef.value', function(newValue, oldValue) {
				if (newValue != undefined && newValue != oldValue) {
					if (newValue == true) {
						addExternalRef();
					} else {
						//deleteExternalRef();
						deleteAttribute($scope.oriSubject.children, 'externalRef');
					}
				}
			});

			function addExternalRef() {
				var PARTY_REF = editor.getPARTY_REF();
			//	var externalRef = editor.getCSingleAttribute(PARTY_REF, editor.getDefaultExistence(1, 1), "externalRef");
			    var externalRef = editor.getSingleAttr(PARTY_REF, [1,1], 'externalRef');
				$scope.oriSubject.children.attributes = pushTo(externalRef, $scope.oriSubject.children.attributes);

			}

			//name edit function
			$scope.$watch('hasName.value', function(newValue, oldValue) {
				if (newValue != undefined && newValue != oldValue) {
					if (newValue) {
						addName();
					} else {
						//deleteName();
						deleteAttribute($scope.oriSubject.children, 'name');
					}
				}
			});
			function addName() {				
				var name = editor.getSingleAttr([], [1,1], "name");
				$scope.oriSubject.children.attributes = pushTo(name, $scope.oriSubject.children.attributes);
			}

			function deleteName() {
				deletePerformerAttribtue('name');

			}

			//identifiers edit functio
			$scope.$watch('hasIdentifiers.value', function(newValue, oldValue) {
				if (newValue != undefined && newValue != oldValue) {
					if (newValue == true) {
						addIdentifiers();
					} else {
						//deleteIdentifiers();
						deleteAttribute($scope.oriSubject.children, 'identifiers');
					}
				}
			});
			function addIdentifiers() {
				var DV_IDENTIFIER = editor.getDV_IDENTIFIER();
				
				var identifiers = editor.getSingleAttr(DV_IDENTIFIER, [1,1],  "identifiers");
				$scope.oriSubject.children.attributes = pushTo(identifiers, $scope.oriSubject.children.attributes);
			}

			function deleteIdentifiers() {
				deletePerformerAttribtue('identifiers');
			}

			//----------------------------------------performer edit function end-------------------------------------------------------

			//----------------------------------------participation attribute edit function--------------------------------------------
		
          
			//---------------------------------------participation attribute edit function end-----------------------------------------

			//------------------------------------------auxilary function --------------------------------------------------------------
			function pushTo(node, Array) {

				if (angular.isArray(Array)) {
					Array.push(node);
				} else {
					var tempNode = Array;
					Array = [];
					if (tempNode) {
						Array.push(tempNode);
					};
					Array.push(node);
				}
				return Array;

			};
		
			function deleteAttribute(children, attributeName) {
				var attributeArray = children.attributes;
				
				if (angular.isArray(attributeArray)) {
					angular.forEach(attributeArray, function(attribute) {
						if (attribute.rm_attribute_name == attributeName) {
							attributeArray.splice(attributeArray.indexOf(attribute), 1);
						}
					});
				} else {
					if (attributeArray.rm_attribute_name == attributeName) {
						children.attributes = undefined;
					}
				}
			}

			
		
			
		
			
			function processSubject(subject) {

				if (subject.children) {
					if (angular.isArray(subject.children)) {
						subject.children = scope.subject.children[0];
					}
					$scope.partyType.value = subject.children.rm_type_name;

					var attributes = subject.children.attributes;

					if (angular.isArray(attributes)) {
						angular.forEach(attributes, function(attribute) {
							processAttribute(attribute);
						});
					} else {
						processAttribute(attributes);
					}
				}
			}

			
			
			function processAttribute(attribute) {

				
				if (attribute.rm_attribute_name == "name") {
					$scope.hasName = {
						value : true
					};
				}
				if (attribute.rm_attribute_name == "identifiers") {
					$scope.hasIdentifiers = {
						value : true
					};
				}
				if(attribute.rm_attribute_name == 'externalRef'){
					$scope.hasExternalRef = {
						value : true
					};
				}
			}


			


		}
	};
	});