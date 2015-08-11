angular.module('clever.management.directives.editDefinitionPane',[]).directive('editDefinitionPane', function(archetypeSerializeService){                                 
     return{
     	restrict: 'E',
     //	transclude:true,
     	scope:{ 
     		definition:'=',
     		ontology:'=',
     		selectedLanguage:'=',
     		
     	},
     	templateUrl:'js/directives/archetype-edit-directives/definition-pane/edit-definition-pane.html',
     	   
     	   
     	   
     	controller: function($scope, $element, $attrs){
     		
     		
     		
     		$scope.$watch('ontology',function(newValue){
     	   	   if(newValue){
     	   	   	console.log("this is ontology----------------------------------------------------");
     	   	 //  	console.log(archetypeSerializeService.serializeArchetype());
     	   	   }
     	   });
     		     		     		     		
     		$scope.isExpandedAll = true;
			$scope.$watch('isExpandedAll', function(newValue, oldValue) {
			if ($scope.treeControl && newValue) {
				$scope.treeControl.expandAll();
			} else if ($scope.treeControl && !newValue) {
				$scope.treeControl.collapseAll();
			}
			});
			$scope.getTreeNodeLabel = function(node,aliasName) {
				var label = '';
				
				if (node.label.type == 'type') {
					 label +=  '<span class="archetype-edit-icon ' + node.label.picType.toLowerCase() + '" style="padding: 7px 10px; background-position-y: 10px;"></span>';
				     if(node.label.code){
				     	label+='<span style="color: brown;font-weight: bold;">&nbsp;' + getOntologyByCode(node.label.code, $scope.ontology).text + '</span>';
				     }else{
				     	label+='<span style="color: brown;font-weight: bold;">&nbsp;' +node.label.text + '</span>';
				     }
				     
				} else if (node.label.type == 'attribute') {
					label += '<span style="color: darkblue;">' + node.label.text + '</span>';
				}
				
				
				return label;
			};
			
			$scope.getOntologyByCode = function(code,ontology){
				return getOntoltogyByCode(node,ontology);
			};
	      function getOntologyByCode(code,ontology){
		       if (ontology && code) {
					var matchedOntology;
					if (ontology.terms) {
						angular.forEach(ontology.terms, function(term) {
						if(term.language=='en'){//$scope.selectedLanguage){
							angular.forEach(term.items,function(value){
								if(value.code==code)
								matchedOntology=value;
								return matchedOntology;
							});
						}
						});
					}					
					return matchedOntology;
				}
	      }
	      
	      //this is the base type array
	      $scope.dataTypeList=[
	      'DV_TEXT',
	      'DV_CODED_TEXT',
	      'DV_QUANTITY',
	      'DV_COUNT',
	      'DV_DATE_TIME',
	      'DV_DURATION',
	      'DV_ORDIANARY',
	      'DV_BOOLEAN',
	      'DV_INTERVAL',
	      'DV_MULTIMEDIA',
	      'DV_URI',
	      'DV_PROPORTION',
	      'DV_IDENTIFIER',];
	      
 //---------for dragable module------------------------
	    $scope.models = {
        selected: null,
        templates: [
            {type: "item", id: 2},
            {type: "container", id: 1, columns: [[], []]}
        ],
        dropzones: {
            "A": [
                {
                    "type": "container",
                    "id": 1,
                    "columns": [
                        [
                            {
                                "type": "item",
                                "id": "1"
                            },
                            {
                                "type": "item",
                                "id": "2"
                            }
                        ],
                        [
                            {
                                "type": "item",
                                "id": "3"
                            }
                        ]
                    ]
                },
                {
                    "type": "item",
                    "id": "4"
                },
                {
                    "type": "item",
                    "id": "5"
                },
                {
                    "type": "item",
                    "id": "6"
                }
            ],
            "B": [
                {
                    "type": "item",
                    "id": 7
                },
                {
                    "type": "item",
                    "id": "8"
                },
                {
                    "type": "container",
                    "id": "2",
                    "columns": [
                        [
                            {
                                "type": "item",
                                "id": "9"
                            },
                            {
                                "type": "item",
                                "id": "10"
                            },
                            {
                                "type": "item",
                                "id": "11"
                            }
                        ],
                        [
                            {
                                "type": "item",
                                "id": "12"
                            },
                            {
                                "type": "container",
                                "id": "3",
                                "columns": [
                                    [
                                        {
                                            "type": "item",
                                            "id": "13"
                                        }
                                    ],
                                    [
                                        {
                                            "type": "item",
                                            "id": "14"
                                        }
                                    ]
                                ]
                            },
                            {
                                "type": "item",
                                "id": "15"
                            },
                            {
                                "type": "item",
                                "id": "16"
                            }
                        ]
                    ]
                },
                {
                    "type": "item",
                    "id": 16
                }
            ]
        }
  
    };

    $scope.$watch('models.dropzones', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

    
     //-------for drag module end------------------------
     	},
     	links: function(scope,element,attrs){
     		
     	}
     };

	
});




