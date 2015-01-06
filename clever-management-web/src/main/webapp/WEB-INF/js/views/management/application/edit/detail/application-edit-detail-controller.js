function ApplicationEditDetailCtrl($scope, $state, $stateParams, resourceService, msgboxService, WEBSITE_DOMAIN, APPLICATION_LIST_URL, APPLICATION_UPLOAD_URL, APPLICATION_BY_ID_URL, TEMP_URL) {

    var undefined;

    $scope.nameValidation = {
        validated: true,
        msg: undefined,
    };
    $scope.urlValidation = {
        validated: true,
        msg: undefined,
    };
    $scope.descriptionValidation = {
        validated: true,
        msg: undefined,
    };
    $scope.imgValidation = {
        validated: true,
        msg: undefined,
    };

    $scope.application = {
        id: undefined,
        name: undefined,
        description: undefined,
        url: undefined,
        img: {
            file: undefined,
            path: undefined,
        },
    };

    if ($stateParams.id) {
        if ($stateParams.id == 'add') {
            setAppAddMode();
        } else {
            resourceService.get(APPLICATION_BY_ID_URL + $stateParams.id).then(function(result) {
                if (result) {
                    setAppEditMode(result);
                } else {
                    $state.go("management.application.edit.detail", {
                        id : 'add',
                    });
                }
            });
        }
    } else {
        $state.go('management.application.edit');
    }

    $scope.deleteApp = function() {
        if ($scope.editMode) {
            msgboxService.createMessageBox('APPLICATION_EDIT_DELETE', 'APPLICATION_EDIT_DELETE_HINT', {
                appName: $scope.application.name
            }, 'question', 'yesOrNo').result.then(function(confirm) {
                if (confirm) {
                    resourceService.delete(APPLICATION_BY_ID_URL + $scope.application.id).then(function(result) {
                        refreshData();
                        $state.go("management.application.edit.detail", {
                            id : 'add',
                        });
                    })
                }
            })
        }
    };

    $scope.saveApp = function() {
        validate();
        if ($scope.nameValidation.validated && $scope.descriptionValidation.validated && $scope.urlValidation.validated && $scope.imgValidation.validated) {
            if (!$scope.editMode) {
                uploadNewApp($scope.application).then(function(result) {
                    if (result.succeeded) {
                        msgboxService.createMessageBox('APPLICATION_EDIT_SUCCEEDED', 'APPLICATION_EDIT_UPLOAD_SUCCEEDED_HINT', {}, 'success');
                        refreshData();
                        setAppAddMode();
                    } else {
                        msgboxService.createMessageBox('APPLICATION_EDIT_FAILED', 'APPLICATION_EDIT_UPLOAD_FAILED_HINT', {
                            errorMsg: result.message
                        }, 'error');
                    }
                });
            } else {
                updateApp($scope.application).then(function(result) {
                    if (result.succeeded) {
                        msgboxService.createMessageBox('APPLICATION_EDIT_SUCCEEDED', 'APPLICATION_EDIT_UPDATE_SUCCEEDED_HINT', {}, 'success');
                        refreshData();
                    } else {
                        msgboxService.createMessageBox('APPLICATION_EDIT_FAILED', 'APPLICATION_EDIT_UPDATE_FAILED_HINT', {
                            errorMsg: result.message
                        }, 'error');
                    }

                });
            }
            cleanInputImg();
        }
    };


    $scope.previewImg = function(img) {
        var formData = new FormData();
        formData.append('img', img.file);
        resourceService.post(TEMP_URL + '/img', formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function(result) {
            if (result.succeeded) {
                $scope.imgPath = WEBSITE_DOMAIN + result.message;
                $scope.imgValidation.validated = true;
            } else {
                $scope.imgValidation.validated = false;
                $scope.imgValidation.msg = result.message;
                $scope.imgPath = undefined;
            }
        });
    };

    function uploadNewApp(app) {
        var formData = new FormData();
        formData.append('name', app.name);
        formData.append('description', app.description);
        formData.append('url', app.url);
        formData.append('img', app.img.file);
        return resourceService.post(APPLICATION_UPLOAD_URL, formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function(result) {
            return result;
        });
    }

    function updateApp(app) {
        var formData = new FormData();
        formData.append('name', app.name);
        formData.append('description', app.description);
        formData.append('url', app.url);
        if (app.img.file) {
            formData.append('img', app.img.file);
        }
        return resourceService.post(APPLICATION_BY_ID_URL + $scope.application.id, formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function(result) {
            return result;
        });
    }

    function refreshData() {
        resourceService.get(APPLICATION_LIST_URL).then(function(result) {
            $scope.obj.applications = result;
        });
    }


    function validate() {
        if (!$scope.application.name || $scope.application.name == '') {
            $scope.nameValidation.validated = false;
            $scope.nameValidation.msg = "Name can not be empty.";
        } else {
            $scope.nameValidation.validated = true;
        }
        if (!$scope.application.description || $scope.application.description == '') {
            $scope.descriptionValidation.validated = false;
            $scope.descriptionValidation.msg = "Description can not be empty.";
        } else {
            $scope.descriptionValidation.validated = true;
        }
        if (!$scope.application.url || $scope.application.url == '') {
            $scope.urlValidation.validated = false;
            $scope.urlValidation.msg = "URL can not be empty.";
        } else {
            $scope.urlValidation.validated = true;
        }
        if (!$scope.editMode && !$scope.application.img.file) {
            $scope.imgValidation.validated = false;
            $scope.imgValidation.msg = "Please choose an image.";
        }
    }

    function setAppEditMode(app) {
        $scope.application.id = app.id;
        $scope.application.name = app.name;
        $scope.application.description = app.description;
        $scope.application.url = app.url;
        $scope.imgPath = WEBSITE_DOMAIN + app.imgPath;
        $scope.obj.selectedAppId = app.id;

        cleanInputImg();
        cleanValidateMessage();

        $scope.editMode = true;
        $scope.okText = 'APPLICATION_EDIT_BTN_UPDATE';
    }

    function setAppAddMode() {
        $scope.application.name = undefined;
        $scope.application.description = undefined;
        $scope.application.url = undefined;
        $scope.imgPath = undefined;
        $scope.obj.selectedAppId = undefined;

        cleanInputImg();
        cleanValidateMessage();

        $scope.editMode = false;
        $scope.okText = 'APPLICATION_EDIT_BTN_UPLOAD';
    }

    function cleanValidateMessage() {
        $scope.nameValidation.validated = true;
        $scope.descriptionValidation.validated = true;
        $scope.urlValidation.validated = true;
        $scope.imgValidation.validated = true;
    }

    function cleanInputImg() {
        $scope.application.img.path = undefined;
        $scope.application.img.file = undefined;
    }

}
