function StorageTemplateEditCtrl($scope, resourceService, msgboxService, STORAGE_TEMPLATE_EDIT_LIST_URL, STORAGE_TEMPLATE_SUBMIT_BY_ID_URL, STORAGE_TEMPLATE_UPGRADE_BY_ID_URL) {

	$scope.templateFiles = {
		draft: [],
		published: []
	};

	refreshData();

	function refreshData() {
		$scope.templateFiles.draft = [];
		$scope.templateFiles.published = [];
		resourceService.get(STORAGE_TEMPLATE_EDIT_LIST_URL).then(function(result) {
			angular.forEach(result, function(templateFile) {
				if (templateFile.lifecycleState == 'Draft') {
					$scope.templateFiles.draft.push(templateFile);
				} else if (templateFile.lifecycleState == 'Published') {
					$scope.templateFiles.published.push(templateFile);
				}
			});

			console.log($scope.templateFiles.draft);
			console.log($scope.templateFiles.published);
		});
	}

	$scope.submitTemplateFile = function(templateFile) {
		resourceService.get(STORAGE_TEMPLATE_SUBMIT_BY_ID_URL + templateFile.id).then(function(result) {
			if (result.succeeded) {
				msgboxService.createMessageBox("prompt", "Submit succeeded", {}, "success");
				$scope.templateFiles.draft.pop(templateFile);
			} else {
				msgboxService.createMessageBox("prompt", result.message, {}, "error");
			}
		});
	}

	$scope.upgradeTemplateFile = function(templateFile) {
		resourceService.get(STORAGE_TEMPLATE_UPGRADE_BY_ID_URL + templateFile.id).then(function(result) {
			if (result.succeeded) {
				msgboxService.createMessageBox("prompt", "Upgrade succeeded", {}, "success")
				refreshData();
			} else {
				msgboxService.createMessageBox("prompt", result.message, {}, "error");
			}
		});
	}
}