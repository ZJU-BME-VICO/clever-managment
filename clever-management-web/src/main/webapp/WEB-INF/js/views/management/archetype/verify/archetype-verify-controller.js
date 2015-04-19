function ArchetypeVerifyCtrl($scope, msgboxService, resourceService, ARCHETYPE_LIST_VERIFY_URL, ARCHETYPE_APPROVE_BY_ID_URL,
    ARCHETYPE_REJECT_BY_ID_URL, ARCHETYPE_REMOVE_BY_ID_URL) {

    $scope.verifyId = 0;

    resourceService.get(ARCHETYPE_LIST_VERIFY_URL).then(function(list) {
        $scope.teamreviewArchetypeList = list;
    });

    $scope.setVerifyId = function(ID) {
        $scope.verifyId = ID;
    };

    $scope.isValid = function() {
        if ($scope.verifyId == 0) {
            return "$invalid";
        } else {
            return false;
        }
    }

    $scope.reject = function() {
        var fileId;
        angular.forEach($scope.teamreviewArchetypeList, function(file) {
            if (file.id == $scope.verifyId) {
                fileId = file.id;
            }
        });
        msgboxService.createMessageBox("ARCHETYPE_VERIFY_REJECT_HINT", "ARCHETYPE_VERIFY_REJECT_HINT_INFO", {}, 'warning', "yesOrNo").result.then(function() {
            $scope.rejectAndremoveFile(fileId);
        }, function() {
            $scope.rejectFile(fileId);
        });
    };

    $scope.approveFile = function() {
    	var fileId;
        angular.forEach($scope.teamreviewArchetypeList, function(file) {
            if (file.id == $scope.verifyId) {
               fileId = file.id;
            }
        });
        resourceService.get(ARCHETYPE_APPROVE_BY_ID_URL + fileId).then(function(result) {
            if (result.succeeded) {
                msgboxService.createMessageBox("ARCHETYPE_VERIFY_SUCCEEDED", "ARCHETYPE_VERIFY_APPROVE_SUCCEEDED_HINT", {}, 'success').result.then(function() {
                    $scope.reset();
                });
            } else {
                msgboxService.createMessageBox("ARCHETYPE_VERIFY_FAILED", "ARCHETYPE_VERIFY_APPROVE_FAILED_HINT", {
                    errorMsg: result.message
                }, 'error').result.then(function() {
                    $scope.reset();
                });
            }
        });
    };

    $scope.rejectFile = function(fileId) {
        resourceService.get(ARCHETYPE_REJECT_BY_ID_URL + fileId).then(function(result) {
            if (result.succeeded) {
                msgboxService.createMessageBox("ARCHETYPE_VERIFY_SUCCEEDED", "ARCHETYPE_VERIFY_REJECT_SUCCEEDED_HINT", {}, 'success').result.then(function() {
                    $scope.reset();
                });
            } else {
                msgboxService.createMessageBox("ARCHETYPE_VERIFY_FAILED", "ARCHETYPE_VERIFY_REJECT_FAILED_HINT", {
                    errorMsg: result.message
                }, 'error').result.then(function() {
                    $scope.reset();
                });
            }
        });
    };

    $scope.rejectAndremoveFile = function(fileId) {
        resourceService.get(ARCHETYPE_REMOVE_BY_ID_URL + fileId).then(function(result) {
            if (result.succeeded) {
                msgboxService.createMessageBox("ARCHETYPE_VERIFY_SUCCEEDED", "ARCHETYPE_VERIFY_REJECT_AND_REMOVE_SUCCEEDED_HINT", {}, 'success').result.then(function() {
                    $scope.reset();
                });
            } else {
                msgboxService.createMessageBox("ARCHETYPE_VERIFY_FAILED", "ARCHETYPE_VERIFY_REJECT_AND_REMOVE_FAILED_HINT", {
                    errorMsg: result.message
                }, 'error').result.then(function() {
                    $scope.reset();
                });
            }
        });
    };

    $scope.reset = function() {
        $scope.verifyId = 0;
        resourceService.get(ARCHETYPE_LIST_VERIFY_URL).then(function(verList) {
            $scope.teamreviewArchetypeList = verList;
        });
    };
}
