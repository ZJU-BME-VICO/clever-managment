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
    			msgboxService.createMessageBox("STORAGE_TEMPLATE_VERIFY_MSG_HINT", "STORAGE_TEMPLATE_VERIFY_APPROVE_SUCCEEDED_HINT", {}, "success");
    			$scope.templateFiles.pop(templateFile);
    		}else{
    			msgboxService.createMessageBox("STORAGE_TEMPLATE_VERIFY_MSG_HINT", "STORAGE_TEMPLATE_VERIFY_APPROVE_FAILED_HINT", {
                     errorMsg: result.message
                }, "error");
    		}
    	});
    }

    $scope.rejectTemplateFile = function(templateFile){
    	msgboxService.createMessageBox("STORAGE_TEMPLATE_VERIFY_MSG_HINT", "STORAGE_TEMPLATE_VERIFY_REJECT_HINT", {}, "question", "yesOrNo").result.then(function(confirm){
    		if(confirm){
    			resourceService.get(STORAGE_TEMPLATE_REJECT_BY_ID_URL + templateFile.id).then(function(result){
    				if(result){
    					$scope.templateFiles.pop(templateFile);
    				}else{
    					msgboxService.createMessageBox("STORAGE_TEMPLATE_VERIFY_MSG_HINT", "STORAGE_TEMPLATE_VERIFY_REJECT_FAILED_HINT", {
                             errorMsg: result.message
                        }, "error");
    				}
    			});
    		}
    	});
    }

    $scope.removeTemplateFile = function(templateFile){
    	msgboxService.createMessageBox("STORAGE_TEMPLATE_VERIFY_MSG_HINT", "STORAGE_TEMPLATE_VERIFY_REMOVE_HINT", {}, "question", "yesOrNo").result.then(function(confirm){
    		if(confirm){
    			resourceService.get(STORAGE_TEMPLATE_REMOVE_BY_ID_URL + templateFile.id).then(function(result){
    				if(result){
    					$scope.templateFiles.pop(templateFile);
    				}else{
    					msgboxService.createMessageBox("STORAGE_TEMPLATE_VERIFY_MSG_HINT", "STORAGE_TEMPLATE_VERIFY_REMOVE_FAILED_HINT", {
                            errorMsg: result.message
                        }, "error");
    				}
    			});
    		}
    	});
    }

    $scope.oetTemplateFile = function(templateFile) {
        if (templateFile.lastTemplateFile == null) {
            documentDiffModalService.open("STORAGE_TEMPLATE_VERIFY_OET_DIFF", null, templateFile.oet);
        } else {
            documentDiffModalService.open("STORAGE_TEMPLATE_VERIFY_OET_DIFF", templateFile.lastTemplateFile.oet, templateFile.oet);
        }
    }
}
