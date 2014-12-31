function ApplicationEditCtrl($scope, appLibraryService, msgboxService, WEBSITE_DOMAIN){

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

	setAppAddMode();
	refreshData();
	
	if(appLibraryService.getCurrentApp()){
		setAppEditMode(appLibraryService.getCurrentApp());
		appLibraryService.setCurrentApp(null);
	}
	
	$scope.selectApp = function(app){
		setAppEditMode(app);
	};

	$scope.addNewApp = function() {
		setAppAddMode();
	};

	$scope.deleteApp = function() {
	    if ($scope.editMode) {
	        msgboxService.createMessageBox('APPLICATION_EDIT_DELETE', 'APPLICATION_EDIT_DELETE_HINT', {
	            appName : $scope.application.name
	        }, 'question', 'yesOrNo').result.then(function(confirm) {
	            if (confirm) {
	                appLibraryService.deleteApplication($scope.application).then(function(result) {
	                    refreshData();
	                    setAppAddMode();
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
	                    setAppAddMode();
	                } else {
	                    msgboxService.createMessageBox('APPLICATION_EDIT_FAILED', 'APPLICATION_EDIT_UPLOAD_FAILED_HINT', {
	                        errorMsg : result.message
	                    }, 'error');
	                }
	            });
	        } else {
	            appLibraryService.updateApplication($scope.application).then(function(result) {
	                if (result.succeeded) {
	                    msgboxService.createMessageBox('APPLICATION_EDIT_SUCCEEDED', 'APPLICATION_EDIT_UPDATE_SUCCEEDED_HINT', {}, 'success');
	                    refreshData();
	                } else {
	                    msgboxService.createMessageBox('APPLICATION_EDIT_FAILED', 'APPLICATION_EDIT_UPDATE_FAILED_HINT', {
	                    	errorMsg : result.message
	                    }, 'error');
	                }
	            });
	        }
	        cleanInputImg();
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
		appLibraryService.getAllApplications().then(function(result){
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

	function setAppEditMode(app){
		$scope.application.id = app.id;
		$scope.application.name = app.name;
		$scope.application.description = app.description;
		$scope.application.url = app.url;
		$scope.imgPath = WEBSITE_DOMAIN + app.imgPath;
		$scope.selectedAppId = app.id;

		cleanInputImg();
		cleanValidateMessage();

		$scope.editMode = true;
		$scope.okText = 'APPLICATION_EDIT_BTN_UPDATE';
	}

	function setAppAddMode(){
		$scope.application.name = undefined;
		$scope.application.description = undefined;
		$scope.application.url = undefined;
		$scope.imgPath = undefined;

		cleanInputImg();
		cleanValidateMessage();

		$scope.editMode = false;
		$scope.okText = 'APPLICATION_EDIT_BTN_UPLOAD';	
	}

	function cleanValidateMessage(){
		$scope.nameValidation.validated = true;
		$scope.descriptionValidation.validated = true;
		$scope.urlValidation.validated = true;
		$scope.imgValidation.validated = true;
	}

	function cleanInputImg(){
		$scope.application.img.path = undefined;
		$scope.application.img.file = undefined;
	}
}

