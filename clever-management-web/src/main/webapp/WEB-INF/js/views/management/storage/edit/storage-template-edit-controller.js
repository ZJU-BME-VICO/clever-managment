function StorageTemplateEditCtrl($scope, resourceService, msgboxService, STORAGE_TEMPLATE_LIST_EDIT_DRAFT_URL, STORAGE_TEMPLATE_LIST_EDIT_PUBLISHED_URL, STORAGE_TEMPLATE_SUBMIT_BY_ID_URL, STORAGE_TEMPLATE_UPGRADE_BY_ID_URL) {

	$scope.templateFiles = {
		draft: [],
		published: []
	};

	refreshDraftTemplateData();
	refreshPublishedTemplateData();

	function refreshDraftTemplateData() {
		resourceService.get(STORAGE_TEMPLATE_LIST_EDIT_DRAFT_URL).then(function(list) {
			$scope.templateFiles.draft = list;

			console.log($scope.templateFiles.draft);
		});
	}

	function refreshPublishedTemplateData(){
		resourceService.get(STORAGE_TEMPLATE_LIST_EDIT_PUBLISHED_URL).then(function(list){
			$scope.templateFiles.published = list;

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
				refreshDraftTemplateData();
				$scope.templateFiles.published.pop(templateFile);
			} else {
				msgboxService.createMessageBox("prompt", result.message, {}, "error");
			}
		});
	}
}