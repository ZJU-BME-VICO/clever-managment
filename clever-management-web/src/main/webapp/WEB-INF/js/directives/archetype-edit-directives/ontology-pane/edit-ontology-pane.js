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
		controller : function($scope, $element, $filter) {
			$scope.$watch('ontology', function(newValue, oldValue) {
				if (newValue) {	
					$scope.currentLanguage = $scope.languages.originalLanguage;
					$scope.currentTermDefinition = getTermDefinitionByLanguage($scope.ontology.term_definitions, $scope.currentLanguage.code);	
				}
			});

			function getTermDefinitionByLanguage(termDefinitions, language) {
				function languageFileterCallback(value) {
					if (value.language == language) {
						return true;
					} else {
						return false;
					}
				}

				var match;
				if (!termDefinitions) {
					return;
				}

				if (angular.isArray(termDefinitions)) {
					var temp = termDefinitions.filter(languageFileterCallback);
					if (temp) {
						match = temp[0];
					}
				} else {
					if (termDefinitions.language == language) {
						match = termDefinitions;
					}
				}
				return match;

			}

		},
		link : function($scope, element, attrs) {
			$scope.contentHeight = angular.isDefined(attrs.maxHeight) ? $scope.$parent.$eval(attrs.maxHeight) : undefined;

		},
	};
});
