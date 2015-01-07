angular.module('clever.management.directives.archetypePane', []).directive('archetypePane', function(archetypeParseService) {
	return {
		restrict : 'E',
		scope : {
			archetypeInfo : '=',
			selectArchetypeCallback : '&',
			selectMasterCallback : '&',
		},
		templateUrl : 'js/directives/archetype-pane/archetype-pane.html',
		controller : function($scope) {

			$scope.languages = [];

			$scope.$watch('archetypeInfo', function(newValue) {
				if (newValue) {
					var archetype = archetypeParseService.parseArchetypeXml($scope.archetypeInfo.xml);
					$scope.header = archetype.header;
					$scope.terminologies = archetype.terminologies;
					$scope.definition = archetype.definitions;
					$scope.languages = archetype.languages.languages;
					$scope.selectedLanguage = archetype.languages.originalLanguage;
				}
			});

			$scope.selectLanguage = function(language) {
				$scope.selectedLanguage = language;
			};

			$scope.$watch('selectedLanguage', function(language) {
				if (language) {
					var currentTerm, currentConstraint;
					if ($scope.terminologies.terms) {
						angular.forEach($scope.terminologies.terms, function(term) {
							if (term.language == language.code) {
								currentTerm = term;
							}
						});
					}
					if ($scope.terminologies.constraints) {
						angular.forEach($scope.terminologies.constraints, function(constaint) {
							if (constaint.language == language.code) {
								currentConstraint = constaint;
							}
						});
					}
					$scope.currentTerminology = {
						term : currentTerm,
						constraint : currentConstraint
					};
					angular.forEach($scope.header.descriptions, function(description) {
						if (description.language == language.code) {
							$scope.currentDescription = description;
						}
					});
				}
			});

			$scope.selectArchetypeId = function(id) {
				$scope.selectArchetypeCallback({
					value : {
						id : id,
					},
				});
			};

			$scope.selectMasterId = function(id) {
				$scope.selectMasterCallback({
					value : {
						id : id,
					},
				});
			};
		},
		link : function(scope, elm, attrs) {
			scope.paneHeight = angular.isDefined(attrs.maxHeight) ? scope.$parent.$eval(attrs.maxHeight) - 95 : undefined;
			scope.tableTitleWidth = angular.isDefined(attrs.tableTitleWidth) ? scope.$parent.$eval(attrs.tableTitleWidth) : 200;
		},
	};
});
