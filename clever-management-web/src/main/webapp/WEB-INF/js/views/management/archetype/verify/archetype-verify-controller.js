function ArchetypeVerifyCtrl($scope, busyService, msgboxService, resourceService, documentDiffModalService, ARCHETYPE_LIST_VERIFY_URL, ARCHETYPE_APPROVE_BY_ID_URL, ARCHETYPE_REJECT_BY_ID_URL, ARCHETYPE_REMOVE_BY_ID_URL) {

	$scope.archetypeFiles = [];

	$scope.modalContainerHeight = {
		value : $scope.$parent.containerHeight - 100
	};
	$scope.$watch(function() {
		return $scope.$parent.containerHeight - 100;
	}, function(newValue) {
		$scope.modalContainerHeight.value = $scope.$parent.containerHeight - 100;
	});

	var busyId = busyService.pushBusy('BUSY_LOADING');
	resourceService.get(ARCHETYPE_LIST_VERIFY_URL).then(function(list) {
		$scope.archetypeFiles = list;
		busyService.popBusy(busyId);
		//console.log(list);
	});

	$scope.approveAll = function() {
		angular.forEach($scope.archetypeFiles, function(file) {
			$scope.approveArchetypeFile(file);
		});
	};

	$scope.approveArchetypeFile = function(archetypeFile) {
		msgboxService.createMessageBox("ARCHETYPE_VERIFY_MSG_HINT", "ARCHETYPE_VERIFY_APPROVE_HINT", {
			archetypeName : archetypeFile.name
		}, "question", "yesOrNo").result.then(function(confirm) {
			if (confirm) {
				resourceService.get(ARCHETYPE_APPROVE_BY_ID_URL + archetypeFile.id).then(function(result) {
					if (result.succeeded) {
						msgboxService.createMessageBox("ARCHETYPE_VERIFY_MSG_HINT", "ARCHETYPE_VERIFY_APPROVE_SUCCEEDED_HINT", {}, 'success');
						$scope.archetypeFiles.splice($scope.archetypeFiles.indexOf(archetypeFile), 1);
					} else {
						msgboxService.createMessageBox("ARCHETYPE_VERIFY_FAILED", "ARCHETYPE_VERIFY_APPROVE_FAILED_HINT", {
							errorMsg : result.message
						}, 'error');
					}
				});
			}
		});
	};

	$scope.rejectArchetypeFile = function(archetypeFile) {
		msgboxService.createMessageBox("ARCHETYPE_VERIFY_MSG_HINT", "ARCHETYPE_VERIFY_REJECT_HINT", {
			archetypeName : archetypeFile.name
		}, "question", "yesOrNo").result.then(function(confirm) {
			if (confirm) {
				resourceService.get(ARCHETYPE_REJECT_BY_ID_URL + archetypeFile.id).then(function(result) {
					if (result.succeeded) {
						$scope.archetypeFiles.splice($scope.archetypeFiles.indexOf(archetypeFile), 1);
					} else {
						msgboxService.createMessageBox("ARCHETYPE_VERIFY_MSG_HINT", "ARCHETYPE_VERIFY_REJECT_FAILED_HINT", {
							errorMsg : result.message
						}, 'error');
					}
				});
			}
		});
	};

	$scope.removeArchetypeFile = function(archetypeFile) {
		msgboxService.createMessageBox("ARCHETYPE_VERIFY_MSG_HINT", "ARCHETYPE_VERIFY_REMOVE_HINT", {
			archetypeName : archetypeFile.name
		}, "question", "yesOrNo").result.then(function(confirm) {
			if (confirm) {
				resourceService.get(ARCHETYPE_REMOVE_BY_ID_URL + archetypeFile.id).then(function(result) {
					if (result.succeeded) {
						$scope.archetypeFiles.splice($scope.archetypeFiles.indexOf(archetypeFile), 1);
					} else {
						msgboxService.createMessageBox("ARCHETYPE_VERIFY_MSG_HINT", "ARCHETYPE_VERIFY_REMOVE_FAILED_HINT", {
							errorMsg : result.message
						}, 'error');
					}
				});
			}
		});
	};

	$scope.adlArchetypeFile = function(archetypeFile) {
		if (archetypeFile.lastRevisionArchetype == null) {
			documentDiffModalService.open("ARCHETYPE_VERIFY_ADL_DIFF", null, archetypeFile.adl, $scope.modalContainerHeight);
		} else {
			documentDiffModalService.open("ARCHETYPE_VERIFY_ADL_DIFF", archetypeFile.lastRevisionArchetype.adl, archetypeFile.adl, $scope.modalContainerHeight);
		}
	};
	
	$scope.getFormatedTime = function(time){
		var date = new Date();
		date.setTime(time);
		return date.format('yyyy-MM-dd hh:mm:ss');
	};
}
