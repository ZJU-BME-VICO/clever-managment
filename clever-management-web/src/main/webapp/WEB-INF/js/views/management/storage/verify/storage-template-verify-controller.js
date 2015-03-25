function StorageTemplateVerifyCtrl($scope, resourceService, msgboxService, STORAGE_TEMPLATE_VERIFY_LIST_URL, STORAGE_TEMPLATE_APPROVE_BY_ID_URL, STORAGE_TEMPLATE_REJECT_BY_ID_URL, STORAGE_TEMPLATE_REMOVE_BY_ID_URL){

	$scope.templateFiles = [];

	resourceService.get(STORAGE_TEMPLATE_VERIFY_LIST_URL).then(function(list){
		$scope.templateFiles = list;
	});

	$scope.approveTemplateFile = function(templateFile){
		resourceService.get(STORAGE_TEMPLATE_APPROVE_BY_ID_URL + templateFile.id).then(function(result){
			if(result.succeeded){
				msgboxService.createMessageBox("prompt", "approve succeeded", {}, "success");
				$scope.templateFiles.pop(templateFile);
			}else{
				msgboxService.createMessageBox("prompt", result.message, {}, "error");
			}
		});
	}

	$scope.rejectTemplateFile = function(templateFile){
		msgboxService.createMessageBox("prompt", "reject ?", {}, "question", "yesOrNo").result.then(function(confirm){
			if(confirm){
				resourceService.get(STORAGE_TEMPLATE_REJECT_BY_ID_URL + template.id).then(function(result){
					if(result){
						$scope.templateFiles.pop(templateFile);
					}else{
						msgboxService.createMessageBox("prompt", result.message, {}, "error");
					}
				});
			}
		});
	}

	$scope.removeTemplateFile = function(templateFile){
		msgboxService.createMessageBox("prompt", "reject and remove ?", {}, "question", "yesOrNo").result.then(function(confirm){
			if(confirm){
				resourceService.get(STORAGE_TEMPLATE_REMOVE_BY_ID_URL + templateFile.id).then(function(result){
					if(result){
						$scope.templateFiles.pop(templateFile);
					}else{
						msgboxService.createMessageBox("prompt", result.message, {}, "error");
					}
				});
			}
		});
	}
}