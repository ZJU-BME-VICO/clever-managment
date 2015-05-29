function StorageTemplateDeployCtrl($scope, resourceService, busyService, msgboxService, STORAGE_TEMPLATE_LIST_DEPLOY_URL, STORAGE_TEMPLATE_DEPLOY_URL) {
    $scope.templateMasterList = [];
    $scope.selectedCount = 0;

    resourceService.get(STORAGE_TEMPLATE_LIST_DEPLOY_URL).then(function(list) {
        $scope.templateMasterList = list;

        angular.forEach($scope.templateMasterList, function(master) {
            master.isSelected = false;
            master.selectedTemplate = master.templates[0];
        });

        console.log($scope.templateMasterList);
    });

    $scope.getFixedTitle = function(title, length) {
        var titleLength = length || 35;
        if (title.length > titleLength) {
            return title.substring(0, titleLength / 2) + '....' + title.substring(title.length - titleLength / 2, title.length);
        }else{
            return title;
        }
    };

    $scope.selectTemplate = function(templateMaster) {
        templateMaster.isSelected = !templateMaster.isSelected;
        if(templateMaster.isSelected) {
            $scope.selectedCount ++;
        } else {
            $scope.selectedCount --;
        }
    }

    $scope.deployTemplates = function() {
        var busyId = busyService.pushBusy('STORAGE_TEMPLATE_DEPLOY_FILE_DEPLOYING');
        var formData = new FormData();
        angular.forEach($scope.templateMasterList, function(master) {
            if(master.isSelected) {
                formData.append('ids', master.selectedTemplate.id);
                formData.append('names', master.selectedTemplate.name);
            }
        });
        resourceService.post(STORAGE_TEMPLATE_DEPLOY_URL, formData, {
            transformRequest : angular.identity,
            headers : {
                'Content-Type' : undefined
            }
        }).then(function(result) {
            busyService.popBusy(busyId);
            if(result.succeeded) {
                msgboxService.createMessageBox('STORAGE_TEMPLATE_DEPLOY_MSG_HINI', 'STORAGE_TEMPLATE_DEPLOY_SUCCEEDED_HINI', {}, 'success').result.then(function() {
                    // Rest tempate list to be deployed  
                    console.log(result.message);
                });
            } else {
                msgboxService.createMessageBox('STORAGE_TEMPLATE_DEPLOY_MSG_HINI', 'STORAGE_TEMPLATE_DEPLOY_FIALED_HINI', {
                    errorMsg : result.message
                }, 'error');
            }
        });
    }

}
