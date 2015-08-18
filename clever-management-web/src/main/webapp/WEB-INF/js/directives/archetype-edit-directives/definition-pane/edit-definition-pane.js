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
				return'<ul class="dropdown-menu" role= "menu" ng-if = "true">'+
				'<li>afsdasf</li>'+
				'</ul>';
				
			};
			
		
			
			
			
			
			
			
			
			
			//function for edit
			//delete Element
			$scope.deleteElement = function(){
				
			};

		}, links: function($scope,element,attrs){

		}
		};


	
});




