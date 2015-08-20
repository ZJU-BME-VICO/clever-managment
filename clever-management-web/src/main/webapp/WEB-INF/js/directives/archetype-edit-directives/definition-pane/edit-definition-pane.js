angular.module('clever.management.directives.editDefinitionPane',[]).directive('editDefinitionPane', function(archetypeSerializeService){                                 
     return{
     	restrict: 'E',
     	transclude:true,
     	scope:{ 	
     		definition:'=',	     		
     		ontology:'=',
     		selectedLanguage:'=',
     	},
     	templateUrl:'js/directives/archetype-edit-directives/definition-pane/edit-definition-pane.html',
     	   
     	   
     	   
     	
		controller: function($scope, $element, $attrs) {

			$scope.getTreeNodeMessage = function(node) {

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
			
			
		
			$scope.getTreeNodeMenu = function(node,aliasName){
				
				var menuHtml = '<ul class="dropdown-menu" role="menu" ng-if="true">';
				menuHtml+='<li  ng-repeat = "item in nodeMenu.'+node.label.picType+'"><a class="pointer" role="menuitem"  ng-click="editNodeByMenu('+aliasName+',item)">{{item}}</a></li>';                 
				menuHtml+='</ul>';     
				return menuHtml;
				
				
			};
			
			
			$scope.nodeMenu = {
			 ACTION:["Time","Description","Ism_transition","Subject","Participation","Links"],
			 OBSERVATION:["Data","State","Subject","Participation","Links"],
			 EVALUATION:["Data","State","Subject","Participation","Links"],
			 INSTRUCTION:["Activity","Narrative","State","Subject","Participation","Links"],
			 ADMIN_ENTRY:["Data","State","Subject","Participation","Links"],			 
			};
		    $scope.testMenu = ["afd","adsffas","afsdaga"];
			
			
			
			
			
			
			
			$scope.editArchetype = function(value) {
				console.log("this is value pass to edit definition pane");
				var node = value.node;
				var type = value.type.toLowerCase();
            
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
          
            function getNdodeLbel(){
          	
            }
            function getOccurrences(lower,lower_included,lower_unbounded,upper,upper_included,upper_unbounded){
            	return {
            		lower:lower.toString(),
            		lower_included:lower_included.toString(),
            		lower_unbounded:lower_unbounded.toString(),
            		upper:upper.toString(),
            		upper_included:upper_included.toString(),
            		upper_unbounded:upper_unbounded.toString(),
         		
            	};
            }
            function getDefaultOccurrences(lower,upper){
            	return getOccurrences(lower,true,false,upper,true,false);
            }
            function getCComplexObject(attributes,nodeId,occurrences,rmTypeName){
            	return {
            		'_xsi:type':"C_COMPLEX_OBJECT",
            		attributes:attributes,
            		node_id:nodeId,
            		occurrences:occurrences,
            		rm_type_name:rmTypeName,
            	};
            }
            
            function getCSingleAttribute(children,existence,rmAttributeName){
            	return {
            		'_xsi:type':"C_SINGLE_ATTRIBUTE",
            		children:children,
            		existence:existence,
            		rm_attribute_name:rmAttributeName,
            	};
            }
            function getExistence(lower,lower_included,lower_unbounded,upper,upper_included,upper_unbounded){
            	return {
            		lower:lower.toString(),
            		lower_included:lower_included.toString(),
            		lower_unbounded:lower_unbounded.toString(),
            		upper:upper.toString(),
            		upper_included:upper_included.toString(),
            		upper_unbounded:upper_unbounded.toString(),
         		
            	};
            }      
            
            function getDefaultExistence(lower,upper){
            	return getExistence(lower,true,false,upper,true,false);
            }      
            function getCardinality(){
            	
            }
            function addText(node){
            	var nodeId = "at00000";
                var dv_text = getCComplexObject(undefined,"",getDefaultOccurrences(1,1),"DV_TEXT");        
                var attribute_value = getCSingleAttribute(dv_text,getDefaultExistence(1,1),"value");
                var object_element= getCComplexObject(attribute_value,nodeId,getDefaultOccurrences(0,1),"ELEMENT");
                node.oriNodeRef.attributes.children.push(object_element);  
                //console.log(node.oriNodeRef);
            }
			
			
			//function for edit
			//delete Element
			$scope.deleteElement = function(){
							};

		}, links: function($scope,element,attrs){

		}
		};


	
});




