function ArchetypeVerifyCtrl($scope, msgboxService, resourceService, documentDiffModalService, ARCHETYPE_LIST_VERIFY_URL, ARCHETYPE_APPROVE_BY_ID_URL, ARCHETYPE_REJECT_BY_ID_URL, ARCHETYPE_REMOVE_BY_ID_URL) {

    $scope.archetypeFiles = [];
    $scope.modalHeight = {};

    resourceService.get(ARCHETYPE_LIST_VERIFY_URL).then(function(list) {
        $scope.archetypeFiles = list;
        console.log(list);
    });

    $scope.approveArchetypeFile = function(archetypeFile) {
        resourceService.get(ARCHETYPE_APPROVE_BY_ID_URL + archetypeFile.id).then(function(result) {
            if (result.succeeded) {
                msgboxService.createMessageBox("ARCHETYPE_VERIFY_SUCCEEDED", "ARCHETYPE_VERIFY_APPROVE_SUCCEEDED_HINT", {}, 'success');
            } else {
                msgboxService.createMessageBox("ARCHETYPE_VERIFY_FAILED", "ARCHETYPE_VERIFY_APPROVE_FAILED_HINT", {
                    errorMsg: result.message
                }, 'error');
            }
        });
    };

    $scope.rejectArchetypeFile = function(archetypeFile) {
        resourceService.get(ARCHETYPE_REJECT_BY_ID_URL + archetypeFile.id).then(function(result) {
            if (result.succeeded) {
                msgboxService.createMessageBox("ARCHETYPE_VERIFY_SUCCEEDED", "ARCHETYPE_VERIFY_REJECT_SUCCEEDED_HINT", {}, 'success');
            } else {
                msgboxService.createMessageBox("ARCHETYPE_VERIFY_FAILED", "ARCHETYPE_VERIFY_REJECT_FAILED_HINT", {
                    errorMsg: result.message
                }, 'error');
            }
        });
    };

    $scope.removeArchetypeFile = function(archetypeFile) {
        resourceService.get(ARCHETYPE_REMOVE_BY_ID_URL + archetypeFile.id).then(function(result) {
            if (result.succeeded) {
                msgboxService.createMessageBox("ARCHETYPE_VERIFY_SUCCEEDED", "ARCHETYPE_VERIFY_REJECT_AND_REMOVE_SUCCEEDED_HINT", {}, 'success');
            } else {
                msgboxService.createMessageBox("ARCHETYPE_VERIFY_FAILED", "ARCHETYPE_VERIFY_REJECT_AND_REMOVE_FAILED_HINT", {
                    errorMsg: result.message
                }, 'error');
            }
        });
    };

    $scope.modalHeight.modalHeight = $scope.containerHeight - 50;
    $scope.$watch('containerHeight', function(newValue){
        $scope.modalHeight.modalHeight = newValue - 50;
    });

    $scope.adlArchetypeFile = function(archetypeFile) {
        if(archetypeFile.lastRevisionArchetype == null){
            documentDiffModalService.open("ADL Diff", null, archetypeFile.adl, $scope.modalHeight);
        }else{
            documentDiffModalService.open("ADL Diff", archetypeFile.lastRevisionArchetype.adl, archetypeFile.adl, $scope.modalHeight);
        }
    }
}
