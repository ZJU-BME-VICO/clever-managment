angular.module('clever.management.directives.editHeaderPane', []).directive('editHeaderPane', function() {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			header : '=',
			languages : "=",
			ontology : "=",
			maxHeight: "=",

		},
		templateUrl : 'js/directives/archetype-edit-directives/header-pane/edit-header-pane.html',

		controller : function($scope) {

			$scope.$watch("header", function(newValue) {
				if (newValue) {
					//console.log(newValue);
					$scope.archetypeId = $scope.header.archetype_id;
					// $scope.baseInfo =  getBaseInfo();
					$scope.selectedLanguage = {
						code : "en",
					};
					getBaseInfo();
					//console.log("this is baseInfo");
					//console.log($scope.baseInfo);

					//$scope.concept = $scope.baseInfo[0].__text;
					// console.log($scope.concept);
					//console.log($scope.languages);
					getLanguageList();

					getOriAuthorInfo();
					getContributorList();
					$scope.lifecycleState = {
						state : $scope.header.description.lifecycle_state,
					};
					getDetail();

				}
			});
			$scope.$watch('lifecycleState.state', function(newValue, oldValue) {
				if (newValue && oldValue) {
					$scope.header.description.lifecycle_state = newValue;
				}
			});
			$scope.archetypeLifeCycleList = ["AuthorDraft", "AuthorPublished"];
			function getLanguageList() {
				var languages = $scope.languages.languages;
				$scope.languageList = [];
				if (angular.isArray(languages)) {
					angular.forEach(languages, function(language) {
						$scope.languageList.push(language.code);
					});
				} else {
					$scope.languageList.push(languages.code);
				}

			}


			$scope.$watch('selectedLanguage.code', function(newValue, oldValue) {
				if (newValue && oldValue) {
					getBaseInfo();
					getDetail();
				}
			});

			function getBaseInfo() {
				var termDefinitons = $scope.header.ontology.term_definitions;
				if (angular.isArray(termDefinitons)) {
					angular.forEach(termDefinitons, function(definition) {
						if (definition._language == $scope.selectedLanguage.code) {
							angular.forEach(definition.items, function(item) {
								if (item._code == $scope.header.concept) {
									$scope.baseInfo = item.items;
								}
							});
						}
					});
				} else {
					if (termDefinitons._language == $scope.selectedLanguage.code) {
						angular.forEach(termDefinitons.items, function(item) {
							if (item._code == $scope.header.concept) {
								$scope.baseInfo = item.items;
							}
						});
					}
				}
			}

			function getOriAuthorInfo() {
				var oriAuthorInfo = {};
				angular.forEach($scope.header.description.original_author, function(authorInfo) {
					if (authorInfo._id == 'date') {
						oriAuthorInfo.date = authorInfo;
					}
					if (authorInfo._id == 'name') {
						oriAuthorInfo.name = authorInfo;
					}
					if (authorInfo._id == 'organisation') {
						oriAuthorInfo.organisation = authorInfo;
					}
					if (authorInfo._id == 'email') {
						oriAuthorInfo.email = authorInfo;
					}
				});
				$scope.oriAuthorInfo = oriAuthorInfo;
			}


			$scope.otherContributorList = [];
			$scope.selectContributor = function(contributor) {
				$scope.selectedContributor = contributor;
			};
		
			function getContributorList() {
				$scope.otherContributorList = [];
				if ($scope.header.description.other_contributors) {
					var contributors = $scope.header.description.other_contributors;
					if (angular.isArray(contributors)) {
						angular.forEach(contributors, function(contributor) {
							var temp = {
								name : contributor,
							};
							$scope.otherContributorList.push(temp);
						});
					}else{
						$scope.otherContributorList.push({
							name:contributors,
						});
					}
					//console.log($scope.header.other_contributors);

				}
			}


			$scope.deleteContributor = function() {
				if ($scope.otherContributorList && $scope.selectContributor) {
					var index = $scope.otherContributorList.indexOf($scope.selectedContributor);
					$scope.otherContributorList.splice(index, 1);
				};
			};

			$scope.addContributor = function() {
				$scope.selectedContributor = {
					name : "New Contributor",
				};
				$scope.otherContributorList.push($scope.selectedContributor);
			};
			$scope.saveContributors = function() {
				$scope.header.description.other_contributors = [];
				angular.forEach($scope.otherContributorList, function(contributor) {

					$scope.header.description.other_contributors.push(contributor.name);

				});
			};

			function getDetail() {
				var details = $scope.header.description.details;
				if (details) {
					if (angular.isArray(details)) {
						angular.forEach(details, function(detail) {
							if (detail.language.code_string == $scope.selectedLanguage.code) {
								$scope.detail = detail;
							}
						});
					} else {
						if (details.language.code_string == $scope.selectedLanguage.code) {
							$scope.detail = details;
						}
					}
				}
			}

			//$scope.concept = "sda";
			$scope.oneAtATime = false;
			$scope.status = {
				isBaseInfoOpen : true,
				isBaseInfoDisabled : false,

				isAuthorShipOpen : true,
				isAuthorShipDisabled : false,

				isDetailsOpen : true,
				isDetailsDisabled : false,
			};

			//datepicker logic
			$scope.today = function() {
				$scope.dt = new Date();
			};
			$scope.today();

			$scope.clear = function() {
				$scope.dt = null;
			};

			// Disable weekend selection
			$scope.disabled = function(date, mode) {
				return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6 ) );
			};

			$scope.toggleMin = function() {
				$scope.minDate = $scope.minDate ? null : new Date();
			};
			$scope.toggleMin();

			$scope.open = function($event) {
				$scope.opened = true;
			};

			$scope.dateOptions = {
				formatYear : 'yy',
				startingDay : 1
			};

			$scope.formats = ['-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
			$scope.format = $scope.formats[0];

			var tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			var afterTomorrow = new Date();
			afterTomorrow.setDate(tomorrow.getDate() + 2);
			$scope.events = [{
				date : tomorrow,
				status : 'full'
			}, {
				date : afterTomorrow,
				status : 'partially'
			}];

			$scope.getDayClass = function(date, mode) {
				if (mode === 'day') {
					var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

					for (var i = 0; i < $scope.events.length; i++) {
						var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

						if (dayToCheck === currentDay) {
							return $scope.events[i].status;
						}
					}
				}

				return '';

			};

		},
		link : function(scope, elemetn, attr) {
			 console.log(attr.maxHeight);
             scope.contentHeight = angular.isDefined(attr.maxHeight) ? scope.$parent.$eval(attr.maxHeight) : undefined;
             console.log("height in header pane");
			 console.log(scope.contentHeight);
		}
	};
});

