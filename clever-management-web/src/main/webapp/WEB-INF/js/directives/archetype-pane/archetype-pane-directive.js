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
					console.log($scope.archetypeInfo);
					var archetype = archetypeParseService.parseArchetypeXml($scope.archetypeInfo.xml);
					console.log(archetype);
					$scope.header = archetype.header;
					$scope.terminologies = archetype.terminologies;
					$scope.definition = archetype.definitions;
					$scope.languages = archetype.languages.languages;
					$scope.selectedLanguage = archetype.languages.originalLanguage;
					console.log($scope.languages);
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
					angular.forEach($scope.header.description.details, function(detail) {
						if (detail.language == language.code) {
							$scope.currentDescription = detail;
						}
					});
				}
			});

			$scope.generateDownloadHref = function(content) {
				return 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
			};

			$scope.selectSpecialiseArchetype = function() {
				$scope.selectArchetypeCallback({
					value : $scope.archetypeInfo.specialiseArchetype
				});
			};

			$scope.selectArchetypeMaster = function() {
				$scope.selectMasterCallback({
					value : {
						id : $scope.archetypeInfo.versionMasterId,
						name : $scope.archetypeInfo.versionMasterName,
					},
				});
			};
		},
		link : function(scope, elm, attrs) {
			var heightObj = scope.$parent.$eval(attrs.maxHeight);
			if(angular.isDefined(attrs.maxHeight)) {
				scope.paneHeight = {
					value : heightObj.value - 95
				};
				scope.$watch(function() {
					return heightObj.value;
				}, function(newValue) {
					scope.paneHeight.value = heightObj.value - 95;
				});
			} else {
				scope.paneHeight = undefined;
			}
			scope.tableTitleWidth = angular.isDefined(attrs.tableTitleWidth) ? scope.$parent.$eval(attrs.tableTitleWidth) : 200;
		},
	};
});
