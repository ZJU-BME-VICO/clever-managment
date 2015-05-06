function StorageTemplateVerifyCtrl($scope, $modal, resourceService, msgboxService, documentDiffModalService, STORAGE_TEMPLATE_LIST_VERIFY_URL, STORAGE_TEMPLATE_APPROVE_BY_ID_URL, STORAGE_TEMPLATE_REJECT_BY_ID_URL, STORAGE_TEMPLATE_REMOVE_BY_ID_URL) {

    $scope.templateFiles = [];
    $scope.modalHeight = {};

    resourceService.get(STORAGE_TEMPLATE_LIST_VERIFY_URL).then(function(list) {
        $scope.templateFiles = list;
        console.log(list);
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
    			resourceService.get(STORAGE_TEMPLATE_REJECT_BY_ID_URL + templateFile.id).then(function(result){
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

    $scope.modalHeight.modalHeight = $scope.containerHeight - 50;
    $scope.$watch('containerHeight', function(newValue) {
        $scope.modalHeight.modalHeight = newValue - 50;
    });

    $scope.oetTemplateFile = function(templateFile) {
        if (templateFile.lastTemplateFile == null) {
            documentDiffModalService.open("OET Diff", null, templateFile.oet, $scope.modalHeight);
        } else {
            documentDiffModalService.open("OET Diff", templateFile.lastTemplateFile.oet, templateFile.oet, $scope.modalHeight);
        }
    }
}
