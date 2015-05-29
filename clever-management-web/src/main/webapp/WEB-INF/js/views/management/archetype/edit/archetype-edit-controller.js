function ArchetypeEditCtrl($scope, msgboxService, resourceService, ARCHETYPE_LIST_EDIT_DRAFT_URL, ARCHETYPE_LIST_EDIT_PUBLISHED_URL, ARCHETYPE_EDIT_BY_ID_URL, ARCHETYPE_SUBMIT_BY_ID_URL) {

    $scope.editId = 0;
    $scope.focusTab = "ARCHETYPE_EDIT_SUBMIT";

    resourceService.get(ARCHETYPE_LIST_EDIT_DRAFT_URL).then(function(list) {
        $scope.draftArchetypeList = list;
    });

    resourceService.get(ARCHETYPE_LIST_EDIT_PUBLISHED_URL).then(function(list) {
        $scope.publishedArchetypeList = list;
    });

    $("#draft").hover(function() {
        draft.style.borderBottom = "3px solid red";
        published.style.borderBottom = "";
        $scope.$apply(function() {
            $scope.editId = 0;
            $scope.focusTab = "ARCHETYPE_EDIT_SUBMIT";
        });
    });

    $("#published").hover(function() {
        draft.style.borderBottom = "";
        published.style.borderBottom = "3px solid red";
        $scope.$apply(function() {
            $scope.editId = 0;
            $scope.focusTab = "ARCHETYPE_EDIT_EDIT";
        });
    });

    $scope.setEditId = function(ID) {
        $scope.editId = ID;
    };

    $scope.isValid = function() {
        if ($scope.editId == 0) {
            return "$invalid";
        } else {
            return false;
        }
    }

    $scope.operateFile = function() {
        if ($scope.focusTab == "ARCHETYPE_EDIT_EDIT") {
            angular.forEach($scope.publishedArchetypeList, function(file) {
                if ($scope.editId == file.id) {
                    editFile(file.id);
                }
            });
        } else {
            angular.forEach($scope.draftArchetypeList, function(file) {
                if ($scope.editId == file.id) {
                    submitFile(file.id);
                }
            });
        }
    }

    function editFile (fileId) {
        resourceService.get(ARCHETYPE_EDIT_BY_ID_URL + fileId).then(function(result) {
            if (result.succeeded) {
                msgboxService.createMessageBox("ARCHETYPE_EDIT_SUCCEEDED", "ARCHETYPE_EDIT_EDIT_SUCCEEDED_HINT", {}, 'success').result.then(function() {
                    $scope.reset();
                });
            } else {
                msgboxService.createMessageBox("ARCHETYPE_EDIT_FAILED", "ARCHETYPE_EDIT_EDIT_FAILED_HINT", {
                    errorMsg: result.message
                }, 'error').result.then(function() {
                    $scope.reset();
                });
            }
        });
    }

    function submitFile (fileId) {
        resourceService.get(ARCHETYPE_SUBMIT_BY_ID_URL + fileId).then(function(result) {
            if (result.succeeded) {
                msgboxService.createMessageBox("ARCHETYPE_EDIT_SUCCEEDED", "ARCHETYPE_EDIT_SUBMIT_SUCCEEDED_HINT", {}, 'success').result.then(function() {
                    $scope.reset();
                });
            } else {
                msgboxService.createMessageBox("ARCHETYPE_EDIT_FAILED", "ARCHETYPE_EDIT_SUBMIT_FAILED_HINT", {
                    errorMsg: result.message
                }, 'error').result.then(function() {
                    $scope.reset();
                });
            }
        });
    }

    $scope.reset = function() {
        $scope.editId = 0;

        resourceService.get(ARCHETYPE_LIST_EDIT_DRAFT_URL).then(function(list) {
            $scope.draftArchetypeList = list;
        });

        resourceService.get(ARCHETYPE_LIST_EDIT_PUBLISHED_URL).then(function(list) {
            $scope.publishedArchetypeList = list;
        });
    };
}
