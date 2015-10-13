function StorageTemplateVerifyCtrl($scope, $modal, resourceService, msgboxService, documentDiffModalService, STORAGE_TEMPLATE_LIST_VERIFY_URL, STORAGE_TEMPLATE_APPROVE_BY_ID_URL, STORAGE_TEMPLATE_REJECT_BY_ID_URL, STORAGE_TEMPLATE_REMOVE_BY_ID_URL) {

	$scope.templateFiles = [];
	$scope.modalHeight = {};

	$scope.modalContainerHeight = {
		value : $scope.$parent.containerHeight - 100
	};
	$scope.$watch(function() {
		return $scope.$parent.containerHeight - 100;
	}, function(newValue) {
		$scope.modalContainerHeight.value = $scope.$parent.containerHeight - 100;
	});

	resourceService.get(STORAGE_TEMPLATE_LIST_VERIFY_URL).then(function(list) {
		$scope.templateFiles = list;
		console.log(list);
	});
   
	$scope.approveTemplateFile = function(templateFile) {
		msgboxService.createMessageBox("STORAGE_TEMPLATE_VERIFY_MSG_HINT", "STORAGE_TEMPLATE_VERIFY_APPROVE_HINT", {
			templateName : templateFile.name
		}, "question", "yesOrNo").result.then(function(confirm) {
			if (confirm) {
				resourceService.get(STORAGE_TEMPLATE_APPROVE_BY_ID_URL + templateFile.id).then(function(result) {
					if (result.succeeded) {
						msgboxService.createMessageBox("STORAGE_TEMPLATE_VERIFY_MSG_HINT", "STORAGE_TEMPLATE_VERIFY_APPROVE_SUCCEEDED_HINT", {}, "success");
						$scope.templateFiles.splice($scope.templateFiles.indexOf(templateFile), 1);
					} else {
						msgboxService.createMessageBox("STORAGE_TEMPLATE_VERIFY_MSG_HINT", "STORAGE_TEMPLATE_VERIFY_APPROVE_FAILED_HINT", {
							errorMsg : result.message
						}, "error");
					}
				});

			}
		});
	};

	$scope.rejectTemplateFile = function(templateFile) {
		msgboxService.createMessageBox("STORAGE_TEMPLATE_VERIFY_MSG_HINT", "STORAGE_TEMPLATE_VERIFY_REJECT_HINT", {
			templateName : templateFile.name
		}, "question", "yesOrNo").result.then(function(confirm) {
			if (confirm) {
				resourceService.get(STORAGE_TEMPLATE_REJECT_BY_ID_URL + templateFile.id).then(function(result) {
					if (result) {
						$scope.templateFiles.splice($scope.templateFiles.indexOf(templateFile), 1);
					} else {
						msgboxService.createMessageBox("STORAGE_TEMPLATE_VERIFY_MSG_HINT", "STORAGE_TEMPLATE_VERIFY_REJECT_FAILED_HINT", {
							errorMsg : result.message
						}, "error");
					}
				});
			}
		});
	};

	$scope.removeTemplateFile = function(templateFile) {
		msgboxService.createMessageBox("STORAGE_TEMPLATE_VERIFY_MSG_HINT", "STORAGE_TEMPLATE_VERIFY_REMOVE_HINT", {
			templateName : templateFile.name
		}, "question", "yesOrNo").result.then(function(confirm) {
			if (confirm) {
				resourceService.get(STORAGE_TEMPLATE_REMOVE_BY_ID_URL + templateFile.id).then(function(result) {
					if (result) {
						$scope.templateFiles.splice($scope.templateFiles.indexOf(templateFile), 1);
					} else {
						msgboxService.createMessageBox("STORAGE_TEMPLATE_VERIFY_MSG_HINT", "STORAGE_TEMPLATE_VERIFY_REMOVE_FAILED_HINT", {
							errorMsg : result.message
						}, "error");
					}
				});
			}
		});
	};

	$scope.oetTemplateFile = function(templateFile) {
		if (templateFile.lastTemplateFile == null) {
			documentDiffModalService.open("STORAGE_TEMPLATE_VERIFY_OET_DIFF", undefined, templateFile.oet, $scope.modalContainerHeight);
		} else {
			documentDiffModalService.open("STORAGE_TEMPLATE_VERIFY_OET_DIFF", templateFile.lastTemplateFile.oet, templateFile.oet, $scope.modalContainerHeight);
		}
	};
	
	$scope.getFormatedTime = function(time){
		var date = new Date();
		date.setTime(time);
		return date.format('yyyy-MM-dd hh:mm:ss');
	};
}
