angular.module('clever.management.directives.editOntologyPane', []).directive('editOntologyPane', function() {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			ontology : "=",
			languages : "=",
			maxHeight : '=',
		},
		templateUrl : 'js/directives/archetype-edit-directives/ontology-pane/edit-ontology-pane.html',
		controller : function($scope, $element,$filter) {
			
		//	$scope.ontologyList = ['Term definitions', 'Term bindings', 'Constraint definitions', 'Constraint bindings'];
            $scope.ontologyList = ['Term definitions'];
			$scope.$watch('ontology', function(newValue, oldValue) {
				if (newValue) {
					$scope.currentOntology = {
						value : 'Term definitions'
					};
					$scope.languageList = ['en'];
					$scope.currentLanguage = {
						code : 'en'
					};
					getLanguageList();
					var tempOntology = getOntologyContent();
					if (angular.isArray(tempOntology)) {
						$scope.ontologyContent = tempOntology;
					} else {
						$scope.ontologyContent = [];
						$scope.ontologyContent.push(tempOntology);
					}
				}
			}); 
			

			
		
			$scope.$watch('searchValue', function(newValue) {
				if (newValue != undefined) {
					$scope.search(newValue);
				}
			}); 

         
			$scope.search = function(value) {
				angular.forEach($scope.ontologyContent, function(content) {
					content.show = true;
				});
				if (value) {
					if ($scope.ontologyContent) {
						if (angular.isArray($scope.ontologyContent)) {
							angular.forEach($scope.ontologyContent, function(content) {
								content.show = true;
								if (content._code.indexOf(value) == -1 && getText(content).indexOf(value) == -1) {
									content.show = false;
								} else {
									content.show = true;
								}
							});
						} else {
							var content = $scope.ontologyContent;
							content.show = true;
							if (content._code.indexOf(value) == -1 && getText(content).indexOf(value) == -1) {
								content.show = false;
							} else {
								content.show = true;
							}
						}
					}
				}
			};


          function getText(content){
          	var text = '';
          	angular.forEach(content.items, function(item){
          		if(item._id == 'text'){
          			text = item.__text;
          		}
          	});
          	return text.toLowerCase();
          }
			$scope.ontologyContent;
			function getLanguageList() {
				$scope.languageList = [];
				if (angular.isArray($scope.languages.languages)) {
					angular.forEach($scope.languages.languages, function(language) {
						$scope.languageList.push(language.code);
					});
				} else {
					$scope.languageList.push($scope.languages.languages.code);
				}
			}
            

			$scope.currentItem;
			$scope.setCurrentItem = function(item) {
				if ($scope.currentItem && $scope.currentItem.selected) {
					$scope.currentItem.selected = undefined;
				}
				$scope.currentItem = item;
				item.selected = "selected";
			};
			function getContentByLanguage(content) {
				if (!content) {
					return undefined;
				}
				var oriContent = content.oriNodeRef;
				var matchContent;
				if (angular.isArray(oriContent)) {
					angular.forEach(oriContent, function(value) {
						if (value._language == $scope.currentLanguage.code) {
							matchContent = value.items;
						}
					});
				} else {
					if (oriContent._language == $scope.currentLanguage.code) {
						matchContent = oriContent.items;
					}
				}
				
				if (matchContent) {

					if (angular.isArray(matchContent)) {
						angular.forEach(matchContent, function(value) {
							if (value.show == undefined) {
								value.show = true;
							}
						});
					} else {
						if (matchContent.show == undefined) {
							matchContent.show = true;
						}
					}
				}


				return matchContent;
			}

			function getOntologyContent() {
				switch ($scope.currentOntology.value) {
				case 'Term definitions':
					return getContentByLanguage($scope.ontology.term_definitions);
				case 'Term bindings':
					return getContentByLanguage($scope.ontology.term_bindings);
				case 'Constraint definitions':
					return getContentByLanguage($scope.ontology.constraint_definitions);
				case 'Constraint bindings':
					return getContentByLanguage($scope.ontology.constraint_bindings);
				}

			}


		
			
			$scope.$watch(function() {
				if ($scope.ontology) {
					$scope.ontologyContent = getOntologyContent();
				}
				//console.log($scope.ontologyContent);
			});


			$scope.$watch('currentLanguage.code', function(newValue, oldValue) {
				if (newValue && oldValue) {
					$scope.ontologyContent = getOntologyContent();
				}
			});

		},
		link : function($scope, element, attrs) {
		      $scope.contentHeight = angular.isDefined(attrs.maxHeight) ? $scope.$parent.$eval(attrs.maxHeight) : undefined;
		      
		     
		},
	};
});
