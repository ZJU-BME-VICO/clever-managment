angular.module('clever.management.directives.participationPane', []).directive('participationPane', function(archetypeEditService) {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			participation : "=",

		},
		templateUrl : 'js/directives/archetype-edit-directives/definition-pane/participation-pane/participation-pane.html',

		controller : function($scope, $element, $attrs) {
			var editor = archetypeEditService;
			$scope.performerTypes = ["PARTY_SELF", "PARTY_IDENTIFIED", "PARTY_RELATED"];
		
			$scope.performerType = {};

			$scope.hasExternalRef = {};
			$scope.hasName = {};
			$scope.hasIdentifiers = {};
			$scope.hasMode = {};
			$scope.hasFunction = {};
			$scope.hasTime = {}; 

				

			$scope.$watch('participation', function(newValue) {
				console.log(newValue);
				processParticipation($scope.participation);
			});
			$scope.$watch('performerType.value', function(newValue) {
				if (newValue) {
					changePerformerType(newValue);
				}
			});

			//---------------------------Performer edit function ---------------------------------------------------------------------------------
			function changePerformerType(type) {
				if ($scope.performerType) {
					switch($scope.performerType.value) {
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
				$scope.attributes.performer.children = partySelf;
			}

			function addPartyIdentified() {
				resetState();
			    var partyIdentified = editor.getPARTY_IDENTIFIED();
				$scope.attributes.performer.children = partyIdentified;

			}

			function addPartyRelated() {
				resetState();		
				var PARTY_RELATED = editor.getPARTY_RELATED();		
				$scope.attributes.performer.children = PARTY_RELATED;

			}
			
			
			
			function resetState() {
				
				if ($scope.attributes.performer) {
					$scope.attributes.performer.children = undefined;
				}
				if ($scope.hasExternalRef) {
					$scope.hasExternalRef.value = undefined;
				}

				if ($scope.hasName) {
					$scope.hasName.value = undefined;
				}
				if ($scope.hasIdentifiers) {
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
						deleteAttribute($scope.attributes.performer.children.attributes, 'externalRef');
					}
				}
			});

			function addExternalRef() {
				var PARTY_REF = editor.getPARTY_REF();
			//	var externalRef = editor.getCSingleAttribute(PARTY_REF, editor.getDefaultExistence(1, 1), "externalRef");
			    var externalRef = editor.getSingleAttr(PARTY_REF, [1,1], 'externalRef');
				$scope.attributes.performer.children.attributes = pushTo(externalRef, $scope.attributes.performer.children.attributes);

			}

			//name edit function
			$scope.$watch('hasName.value', function(newValue, oldValue) {
				if (newValue != undefined && newValue != oldValue) {
					if (newValue) {
						addName();
					} else {
						//deleteName();
						deleteAttribute($scope.attributes.performer.children.attributes, 'name');
					}
				}
			});
			function addName() {				
				var name = editor.getSingleAttr([], [1,1], "name");
				$scope.attributes.performer.children.attributes = pushTo(name, $scope.attributes.performer.children.attributes);
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
						deleteAttribute($scope.attributes.performer.children.attributes, 'identifiers');
					}
				}
			});
			function addIdentifiers() {
				var DV_IDENTIFIER = editor.getDV_IDENTIFIER();
				
				var identifiers = editor.getSingleAttr(DV_IDENTIFIER, [1,1],  "identifiers");
				$scope.attributes.performer.children.attributes = pushTo(identifiers, $scope.attributes.performer.children.attributes);
			}

			function deleteIdentifiers() {
				deletePerformerAttribtue('identifiers');
			}

			//----------------------------------------performer edit function end-------------------------------------------------------

			//----------------------------------------participation attribute edit function--------------------------------------------
			$scope.$watch('hasMode.value', function(newValue, oldValue) {
				if (newValue != undefined && newValue != oldValue) {
					if (newValue == true) {
						addMode();
					} else {
					
						deleteAttribute($scope.participation.oriNodeRef.attributes, 'mode');
					}
				}
			});

			function addMode() {
				var DV_CODED_TEXT = editor.getDV_CODED_TEXT();
				var mode = editor.getSingleAttr(DV_CODED_TEXT, [1,1], "mode");
				$scope.participation.oriNodeRef.attributes = pushTo(mode, $scope.participation.oriNodeRef.attributes);

			}


			$scope.$watch("hasFunction.value", function(newValue, oldValue) {
				if (newValue != undefined && newValue != oldValue) {
					if (newValue == true) {
						addFunction();
					} else {
						
						deleteAttribute($scope.participation.oriNodeRef.attributes, 'function');
					}
				}
			});
			function addFunction() {
				var DV_TEXT = editor.getDV_TEXT();
				var func = editor.getSingleAttr(DV_TEXT, [1,1], "function");
				$scope.participation.oriNodeRef.attributes = pushTo(func, $scope.participation.oriNodeRef.attributes);
			}
          
           $scope.$watch("hasTime.value", function(newValue, oldValue) {
				if (newValue != undefined && newValue != oldValue) {
					if (newValue == true) {
						addTime();
					} else {
						
						deleteAttribute($scope.participation.oriNodeRef.attributes, 'time');
					}
				}
			});
			
			function addTime(){
				var time = editor.getSingleAttr([], [1,1], "time");
				$scope.participation.oriNodeRef.attributes = pushTo(time, $scope.participation.oriNodeRef.attributes);
			}
          
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
		
			function deleteAttribute(attributeArray, attributeName) {
				if (angular.isArray(attributeArray)) {
					angular.forEach(attributeArray, function(attribute) {
						if (attribute.rm_attribute_name == attributeName) {
							attributeArray.splice(attributeArray.indexOf(attribute), 1);
						}
					});
				} else {
					if (attributeArray.rm_attribute_name == attributeName) {
						attributeArray = undefined;
					}
				}
			}

			//------------------------------------participation process function--------------------------------------------------------------
			$scope.attributes = {};
			
			function processAttribute(attribute) {
				if (attribute.rm_attribute_name == "performer") {
					$scope.attributes.performer = attribute;
					if (attribute.children) {
						$scope.performerType.value = attribute.children.rm_type_name;
						var tempAttributes = attribute.children.attributes;

						if (tempAttributes) {
							if (angular.isArray(tempAttributes)) {
								angular.forEach(tempAttributes, function(value) {
									if (value.rm_attribute_name == "externalRef") {
										$scope.hasExternalRef = {
											value : true
										};
									}
									if (value.rm_attribute_name == "name") {
										$scope.hasName = {
											value : true
										};
									}
									if (value.rm_attribute_name == "identifiers") {
										$scope.hasIdentifiers = {
											value : true
										};
									}
								});
							}
						}
					}
				}

				if (attribute.rm_attribute_name == "mode") {
					$scope.hasMode = {
						value : true
					};
					$scope.attributes.mode = attribute;
				}
				if (attribute.rm_attribute_name == "function") {
					$scope.attributes.functioin = attribute;
					$scope.hasFunction = {
						value : true
					};
				}
				if (attribute.rm_attribute_name == "time") {
					$scope.hasTime = {
						value : true
					};
					$scope.attributes.time = attribute;
				}
			}

			//process participation and initial the attributes object
		
			function processParticipation(participation) {
	
				var attributes = participation.oriNodeRef.attributes;
				if (angular.isArray(attributes)) {
					angular.forEach(attributes, function(attribute) {
						processAttribute(attribute);

					});
				} else {
					processAttribute(attributes);
				}
			}

		}
	};
}); 