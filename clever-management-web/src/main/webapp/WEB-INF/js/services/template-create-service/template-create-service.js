angular.module('clever.management.services.templateCreate', []).service('templateCreateService', function($modal, busyService, treeDataFormatService) {

	var self = this;
	self.openCreate = function(archetypeList, scope) {
		self.archetypeList = archetypeList;
		var modalInstance = $modal.open({
			animation : true,
			templateUrl : 'js/services/template-create-service/template-create-service.html',
			controller : function templateCreateCtr($scope, $modalInstance, treeDataFormatService, archetypeParseEditService, archetypeList) {		
                $scope.treeControl ={};  
				function initArchetypeSpecialise(list) {
					if (angular.isArray(list)) {
						angular.forEach(list, function(archetype) {
							if (angular.isArray(archetype.specialiseArchetype)) {
							} else if ((!archetype.specialiseArchetype) || (!archetype.specialiseArchetype.adl)) {
								archetype.specialiseArchetype = [];
							}
						});
					} else {
						var archetype = list;
						if (angular.isArray(archetype.specialiseArchetype)) {
						} else if ((!archetype.specialiseArchetype) || (!archetype.specialiseArchetype.adl)) {
							archetype.specialiseArchetype = [];
						}
					}
				}

				function removeSelected(archetypeList) {
					if (archetypeList) {
						if (angular.isArray(archetypeList)) {
							angular.forEach(archetypeList, function(archetype) {
								archetype.selected = undefined;
							});

						} else {
							archetypeList.selected = undefined;
						}
					}

				}
				removeSelected(archetypeList);

                initArchetypeSpecialise(archetypeList);
                $scope.formatedObject = treeDataFormatService.formatTreeData(archetypeList, "specialiseArchetype");
                $scope.archetypeList = $scope.formatedObject.formatedList; 
				$scope.$watch('archetypeListFilter', function(newValue) {
					if (newValue != undefined) {
						$scope.treeControl.search(newValue);
					}
				}); 

				
                $scope.selectArchetype = function(archetype){
                	if(archetype.isDirectory){
                		$scope.currentArchetype = undefined;
                		return ;
                	}
                	$scope.currentArchetype = archetype;
                	$scope.currentArchetype.parsedResult = archetypeParseEditService.parseArchetypeXml($scope.currentArchetype.xml);
                    $scope.currentArchetype.purpose = getPurpose($scope.currentArchetype);
                };
                
				$scope.searchKeyMapper = function(node) {
					if (node.isDirectory) {
						return node.name;
					} else {
						return node.conceptName + ' (' + node.latestArchetypeVersion + ')';
					}
				};

				function getPurpose(archetype) {
					if (archetype.purpose) {
						return archetype.purpose;
					}
					var details = archetype.parsedResult.header.description.details;
					var purpose;
					if (details) {
						if (angular.isArray(details)) {
							angular.forEach(details, function(detail) {
								if (detail.language == 'en') {
									purpose = detail.purpose;
								}
							});
							if (purpose == undefined) {
								purpose = details[0].purpose;
							}
						} else {
							if (details.language == 'en') {
								purpose = details.purpose;
							}
						}
					}
					return purpose;
				}


				$scope.ok = function() {
					$modalInstance.close({
						archetype : $scope.currentArchetype,
					});
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};

			},
			size : 'lg',
			resolve : {
				archetypeList : function() {
					return self.archetypeList;
				}
			},

		});
		return modalInstance.result;
	};
	

});
