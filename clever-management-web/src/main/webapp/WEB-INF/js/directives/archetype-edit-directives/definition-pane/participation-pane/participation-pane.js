angular.module('clever.management.directives.participationPane', []).directive('participationPane', function(archetypeEditService) {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			participation:"=",
			
		},
		templateUrl : 'js/directives/archetype-edit-directives/definition-pane/participation-pane/participation-pane.html',

		controller : function($scope, $element, $attrs) {
			var editor = archetypeEditService;
			$scope.performerTypes=["PARTY_SELF","PARTY_IDENTIFIED","PARTY_RELATED"];
			$scope.performerType ={};
			$scope.$watch('participation', function(newValue){
			console.log(newValue);
			   processParticipation($scope.participation);
			});
			$scope.$watch('performerType.value', function(newValue){
				if(newValue){
					changePerformerType(newValue);
				}
			});
			
			$scope.hasExternalRef = false;
		
			function changePerformerType(type){
				if($scope.performerType){
					switch($scope.performerType.value){
						case 'PARTY_SELF':
						addPartySelf();
						break;
						case 'PARTY_IDENDITFIED':
						addPartyIdentified();
						break;
						case 'PARTY_RELATED':
						addPartyRelated();
						break;
					}
				}
			}
			
			function addPartySelf() {
				//clean the performer attribute children
				$scope.attributes.performer.children = undefined;
				//add the new type
				var partySelf = editor.getCComplexObject([], '', editor.getDefaultOccurrences(1, 1), "PARTY_SELF");
				$scope.attributes.performer.children = partySelf;
			}

			function addPartyIdentified(){
			    $scope.attributes.performer.children = undefined;
			    var partyIdentified  = editor.getCComplexObject([], '', editor.getDefaultOccurrences(1,1), "PARTY_IDENTIFIED");
			    $scope.attributes.performer.children = partyIdentified;
			    
			}
			
			function addPartyRelated(){
				$scope.attributes.performer.children = undefined;
				var definingCode = editor.getCSingleAttribute([], editor.getDefaultExistence(1,1), "defining_code"); 
				var DV_CODED_TEXT = editor.getCComplexObject(definingCode, '', editor.getDefaultOccurrences(1,1),"DV_CODED_TEXT");
				var relationship = editor.getCSingleAttribute(DV_CODED_TEXT, editor.getDefaultExistence(1,1), "relationship");
			    var partyRelated  = editor.getCComplexObject([], '', editor.getDefaultOccurrences(1,1), "PARTY_REALTED");
			    partyRelated.attributes.push(relationship);
			    $scope.attributes.performer.children = partyRelated;
			    
			}
		    $scope.$watch('hasExternalRef', function(newValue){
		    	if(newValue!= undefined){
		    		if(newValue == true){
		    		addExternalRef();
		    		}else{
		    		 deleteExternalRef();
		    		}
		    	}
		    });
		    function addExternalRef(){
		    	var GENERIC_ID = editor.getCComplexObject([],'', editor.getDefaultOccurrences(1,1), "GENERIC_ID");
		    	
		    	var id = editor.getCSingleAttribute(GENERIC_ID, editor.getDefaultExistence(1,1), "id");
		    	var namespace = editor.getCSingleAttribute([],editor.getDefaultExistence(1,1), "namespace");
		    	var type = editor.getCSingleAttribute([],editor.getDefaultExistence(1,1), "type");
		    	
		    	var externalRef = editor.getCComplexObject([id, namespace, type], "", editor.getDefaultOccurrences(1,1), "externalRef");
		    	pushTo(externalRef, $scope.attributes.performer.children.attribtues);
		    	
		    }
		    function deleteExternalRef(){
		    	var attributes = $scope.attributes.performer.children.attributes;
		    	if(angular.isArray(attributes)){
		    		angular.forEach(attributes, function(attribute){
		    			if(attribute.rm_attribute_name == "externalRef"){
		    				attribtue = undefined;
		    			}
		    		});
		    	}
		    }
		    
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
			$scope.attributes = {};
			//process participation and initial the attributes object
			function processParticipation(participation){
				var attributes = participation.oriNodeRef.attributes;
	     		if(angular.isArray(attributes)){
	     			angular.forEach(attributes, function(attribute){
	     				if(attribute.rm_attribute_name == "performer"){
	     					$scope.attributes.performer = attribute;
	     				
	     					$scope.performerType.value = attribute.children.rm_type_name;
	     					var tempAttributes = attribute.children.attributes;
	     					
	     					if(tempAttributes){
	     						if(angular.isArray(tempAttributes)){
	     							angular.forEach(tempAttributes, function(value){
	     								if(value.rm_attribute_name == "externalRef"){
	     								   $scope.hasExternalRef = true;
	     								}
	     								if(value.rm_attribute_name =="name"){
	     									$scope.hasName = true;
	     								}
	     								if(value.rm_attribute_name =="identifiers"){
	     									$scope.hasIdentifiers = true;
	     								}
	     							});
	     						}
	     					}
	     				}
	     				if(attribute.rm_attribute_name == "mode"){
	     					$scope.attributes.mode = attribute;
	     				}
	     				if(attribute.rm_attribute_name == "function"){
	     					$scope.attributes.functioin = attribute;
	     				}
	     				if(attribute.rm_attribute_name == "time"){
	     					$scope.attributes.time = attribute;
	     				}
	     			});
	     		}
			}
		}
	};
});