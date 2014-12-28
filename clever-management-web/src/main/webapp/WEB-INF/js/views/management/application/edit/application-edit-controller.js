function ApplicationEditCtrl($scope, $stateParams, appLibraryService, msgboxService, WEBSITE_DOMAIN){

	var undefined;

	$scope.nameValidation = {
		validated : true,
		msg : undefined,
	};
	$scope.urlValidation = {
		validated : true,
		msg : undefined,
	};
	$scope.descriptionValidation = {
		validated : true,
		msg : undefined,
	};
	$scope.imgValidation = {
		validated : true,
		msg : undefined,
	};

	$scope.application = {
		id : undefined,
		name : undefined,
		description : undefined,
		url : undefined,
		img : {
			file : undefined,
			path : undefined,
		},
	};

	$scope.apps = [];
	$scope.okText = 'APPLICATION_EDTI_BTN_UPLOAD';	

	refreshData();

	if($stateParams.id != 'all'){
		appLibraryService.getApplicationById($stateParams.id).then(function(result){
			setAppSelected(result);
		});
	}
	
	$scope.selectApp = function(app){
		setAppSelected(app);
	};

	$scope.addNewApp = function() {
		cleanInputArea();
	};

	$scope.deleteApp = function() {
	    if ($scope.editMode) {
	        msgboxService.createMessageBox('APPLICATION_EDIT_DELETE', 'APPLICATION_EDIT_DELETE_HINT', {
	            appName : $scope.application.name
	        }, 'question', 'yesOrNo').result.then(function(confirm) {
	            if (confirm) {
	                appLibraryService.deleteApplication($scope.application).then(function(result) {
	                    refreshData();
	                    cleanInputArea();
	                })
	            }
	        })
	    }
	};


	$scope.saveApp = function() {
	    validate();
	    if ($scope.nameValidation.validated && $scope.descriptionValidation.validated && $scope.urlValidation.validated && $scope.imgValidation.validated) {
	        if (!$scope.editMode) {
	            appLibraryService.uploadNewApplication($scope.application).then(function(result) {
	                if (result.succeeded) {
	                    msgboxService.createMessageBox('APPLICATION_EDIT_SUCCEEDED', 'APPLICATION_EDIT_UPLOAD_SUCCEEDED_HINT', {}, 'success');
	                    refreshData();
	                    cleanInputArea();
	                } else {
	                    msgboxService.createMessageBox('APPLICATION_EDIT_FAILED', 'APPLICATION_EDIT_UPLOAD_FAILED_HINT', {
	                        errorMsg : result.message
	                    }, 'error');
	                }
	            });
	        } else {
	            appLibraryService.updateApplication($scope.application).then(function(result) {
	                if (result.succeeded) {
	                    msgboxService.createMessageBox('APPLICATION_EDIT_SUCCEEDED', 'APPLICATION_EDIT_UPDATE_SUCCEEDED_HINI', {}, 'success');
	                    refreshData();
	                } else {
	                    msgboxService.createMessageBox('APPLICATION_EDIT_FAILED', 'APPLICATION_EDIT_UPDATE_FAILED_HINI', {
	                    	errorMsg : result.message
	                    }, 'error');
	                }
	            });
	        }
	    }

	};

	$scope.previewImg = function(file) {
		appLibraryService.uploadTempImage(file.file).then(function(result) {
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

	function refreshData() {
		appLibraryService.getAllApplications().then(function(result) {
			$scope.apps = result;
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

	function setAppSelected(app){
		$scope.application.id = app.id;
		$scope.application.name = app.name;
		$scope.application.description = app.description;
		$scope.application.url = app.url;
		$scope.imgPath = WEBSITE_DOMAIN + app.imgPath;
		$scope.application.img.path = undefined;

		cleanValidateMessage();

		$scope.editMode = true;
		$scope.okText = 'APPLICATION_EDTI_BTN_UPDATE';
	}

	function cleanInputArea(){
		$scope.application.name = undefined;
		$scope.application.description = undefined;
		$scope.application.url = undefined;
		$scope.application.img.path = undefined;
		$scope.imgPath = undefined;

		cleanValidateMessage();

		$scope.editMode = false;
		$scope.okText = 'APPLICATION_EDTI_BTN_UPLOAD';	
	}

	function cleanValidateMessage(){
		$scope.nameValidation.validated = true;
		$scope.descriptionValidation.validated = true;
		$scope.urlValidation.validated = true;
		$scope.imgValidation.validated = true;
	}
}

