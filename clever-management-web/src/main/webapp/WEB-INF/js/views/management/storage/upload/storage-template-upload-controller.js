function StorageTemplateUploadCtrl($scope, resourceService, busyService, msgboxService, STORAGE_TEMPLATE_VALIDATE_URL, STORAGE_TEMPLATE_UPLOAD_URL) {
	// var pageStatus = {
		// ToAddFile : 0,
		// ToValidate : 1,
		// Validating : 2,
		// ValidationPast : 3,
		// ValidationFailed : 4,
		// ToUpload : 5,
		// Uploading : 6,
	// };

	// $scope.templates = [];
	// $scope.status = pageStatus.ToAddFile;
// 
	// $scope.$watch('templates.length', function(newValue) {
		// if (newValue == 0) {
			// $scope.status = pageStatus.ToAddFile;
		// }
	// });
// 
	// $scope.addTemplate = function() {
		// if ($scope.templates.length == 0) {
			// pushNewTemplate();
		// } else {
			// var lastTemplate = $scope.templates[$scope.templates.length - 1];
			// $scope.validateOet(lastTemplate);
			// $scope.validateArm(lastTemplate);
			// lastTemplate.valid = lastTemplate.oetValid && lastTemplate.armValid ? undefined : false;
			// if (lastTemplate.valid == undefined) {
				// pushNewTemplate();
			// }
		// }
	// };
// 
	// function pushNewTemplate() {
		// $scope.templates.push({
			// templateName : '',
			// oet : {},
			// arm : {},
			// deleteEnabled : false,
			// oetValid : true,
			// armValid : true,
			// serverValid : undefined,
			// serverValidating : false,
			// serverUploading : false,
			// valid : undefined,
		// });
	// }
// 
// 
	// $scope.onStatus = function(status) {
		// return $scope.status == pageStatus[status];
	// };
// 
	// $scope.validateOet = function(template) {
		// template.oetValid = template.oet.file ? true : false;
		// template.valid = template.oetValid && template.armValid ? undefined : false;
	// };
// 
	// $scope.validateArm = function(template) {
		// template.armValid = template.arm.file ? true : false;
		// template.valid = template.oetValid && template.armValid ? undefined : false;
	// };
// 
	// $scope.deleteTemplate = function(template) {
		// $scope.templates.splice($scope.templates.indexOf(template), 1);
	// };
// 
	// $scope.reset = function() {
		// $scope.templates = [];
		// $scope.status = pageStatus.ToAddFile;
	// };
// 
	// $scope.validateTemplates = function() {
		// var allValid = true;
		// angular.forEach($scope.templates, function(template) {
			// $scope.validateOet(template);
			// $scope.validateArm(template);
			// template.valid = template.oetValid && template.armValid ? undefined : false;
			// allValid = template.valid == false ? false : true;
		// });
		// if (!allValid) {
			// $scope.status = pageStatus.ValidationFailed;
			// return;
		// }
		// $scope.status = pageStatus.Validating;
		// var count = $scope.templates.length;
		// var isValidationPast = true;
		// angular.forEach($scope.templates, function(template, index) {
			// template.serverValidating = true;
			// template.serverValid = undefined;
			// var formData = new FormData();
			// formData.append('name', index);
			// formData.append('oet', template.oet.file);
			// formData.append('arm', template.arm.file);
			// resourceService.post(STORAGE_TEMPLATE_VALIDATE_URL, formData, {
				// transformRequest : angular.identity,
				// headers : {
					// 'Content-Type' : undefined
				// }
			// }).then(function(result) {
				// template.serverValidating = false;
				// if (result.status == 'INVALID') {
					// template.serverValid = false;
					// template.valid = false;
					// template.message = result.message;
					// isValidationPast = false;
				// } else {
					// template.serverValid = true;
					// template.valid = true;
					// template.name = result.name;
				// }
				// count--;
				// if (count == 0) {
					// if (isValidationPast) {
						// $scope.status = pageStatus.ValidationPast;
					// } else {
						// $scope.status = pageStatus.ValidationFailed;
					// }
				// }
			// });
// 
		// });
	// };
// 
	// $scope.uploadTemplates = function() {
		// var busyId = busyService.pushBusy('BUSY_UPLOADING');
		// var formData = new FormData();
		// formData.append('count', $scope.templates.length);
		// angular.forEach($scope.templates, function(template, index) {
			// formData.append('oets', template.oet.file);
			// formData.append('arms', template.arm.file);
		// });
		// resourceService.post(STORAGE_TEMPLATE_UPLOAD_URL, formData, {
			// transformRequest : angular.identity,
			// headers : {
				// 'Content-Type' : undefined
			// }
		// }).then(function(result) {
			// busyService.popBusy(busyId);
			// if (result.succeeded) {
				// msgboxService.createMessageBox("STORAGE_TEMPLATE_UPLOAD_SUCCEEDED", "STORAGE_TEMPLATE_UPLOAD_SUCCEEDED_HINT", {}, 'success').result.then(function() {
					// $scope.reset();
				// });
			// } else {
				// msgboxService.createMessageBox("STORAGE_TEMPLATE_UPLOAD_FAILED", "STORAGE_TEMPLATE_UPLOAD_FAILED_HINT", {
					// errorMsg : result.message
				// }, 'error').result.then(function() {
					// $scope.reset();
				// });
			// }
		// });
	// };
	
  

	var pageStatus = {
		ToAddFile : 0,
		ToValidate : 1,
		Validating : 2,
		ValidationAccomplished : 3,
		ValidationFailed : 4,
		ToUpload : 5,
		Uploading : 6,
	}; 

    $scope.templateList = [];
    $scope.fileList = [];
    

	
	$scope.$watch('fileList.length', function(newValue, oldValue) {
		console.log("oldLength : " + oldValue);
		console.log("newLength : " + newValue);
		if ((newValue && !oldValue) || (newValue > oldValue )) {
			angular.forEach($scope.fileList, function(file) {
				matchPartner(file);
			});
			console.log($scope.templateList);
		}
	});

	var mirrorMap = {
		arm : "oet",
		oet : 'arm',
	};
	var realMap = {
		xml : "arm",
		oet : "oet",
	};
	
	function matchPartner(file) {

		if (isFresh(file)) {
			var findTemplate = false;
			var fileNameBody = getNameBody(file.name);
			var fileType = realMap[getNameSuffix(file.name)];
			angular.forEach($scope.templateList, function(template) {
				var mirrorFile = template[mirrorMap[fileType]];
				var mirrorNameBody;
				if (mirrorFile) {
					mirrorNameBody = getNameBody(template[mirrorMap[fileType]].name);

					if (fileNameBody == mirrorNameBody) {
						template[fileType] = file;
						findTemplate = true;
					}
				}

			});
			if (!findTemplate) {
				var temp = {
					name : fileNameBody,			
					status : 'TOUPLOAD',
				};
				temp[fileType] = file;
				temp[mirrorMap[fileType]] = undefined;
				$scope.templateList.push(temp);
			}
		}
	};
	function getNameBody(s) {
		return s.slice(0, s.lastIndexOf("."));
	}

	function getNameSuffix(s) {
		return s.slice(s.lastIndexOf(".") + 1, s.length);
	}

	function isFresh(file) {
		var isFresh = true;
		var type = realMap[getNameSuffix(file.name)];
		angular.forEach($scope.templateList, function(template) {
			if (template[type] && template[type].name == file.name) {
				isFresh = false;
			}
		});
		return isFresh;
	}

 
     $scope.status = pageStatus.ToAddFile;
     $scope.onStatus = function(status) {
		return $scope.status == pageStatus[status];
	};
	$scope.reset = function(){
		$scope.templateList = [];
		$scope.fileList = [];
		$scope.status = pageStatus.ToAddFile;
	};
	
	$scope.deleteTemplate = function(template) {
		$scope.fileList.splice($scope.fileList.indexOf(template.arm), 1);
		$scope.fileList.splice($scope.fileList.indexOf(template.oet), 1);
		$scope.templateList.splice($scope.templateList.indexOf(template), 1);
	};


   

	$scope.validateTemplates = function() {
		var allValid = true;
		angular.forEach($scope.templateList, function(template) {
			$scope.validateOet(template);
			$scope.validateArm(template);
			template.valid = template.oetValid && template.armValid ? true : false;
			//allValid = template.valid == false ? false : true;
		});
		// if (!allValid) {
		// $scope.status = pageStatus.ValidationFailed;
		// return;
		// }
		$scope.status = pageStatus.Validating;
		var count = $scope.templateList.length;
		var isValidationPast = true;
		angular.forEach($scope.templateList, function(template, index) {
			if (template.valid) {
				//template.serverValidating = true;
				//template.serverValid = undefined;
				var formData = new FormData();
				formData.append('name', index);
				formData.append('oet', template.oet.file);
				formData.append('arm', template.arm.file);
				template.status = "VALIDATING";
				resourceService.post(STORAGE_TEMPLATE_VALIDATE_URL, formData, {
					transformRequest : angular.identity,
					headers : {
						'Content-Type' : undefined
					}
				}).then(function(result) {
					template.serverValidating = false;
					if (result.status == 'INVALID') {
						template.status = "INVALID";
						//template.serverValid = false;
						template.valid = false;
						template.message = result.message;
						//isValidationPast = false;
					} else {
						template.status = "VALID";
						//template.serverValid = true;
						template.valid = true;
						template.name = result.name;
					}
					count--;
					if (count == 0) {
						//if (isValidationPast) {
						$scope.status = pageStatus.ValidationAccomplished;
						//} else {
						//	$scope.status = pageStatus.ValidationFailed;
						//}
						
					}
				});

			} else {
				count--;
				template.status = "INVALID";
				template.nameValid = false;
				template.valid = false;
				template.message = "oet or arm file is not find";
		
				if (count == 0) {
					$scope.status = pageStatus.ValidationAccomplished;
				}

			}

		});
	};
	
	
	$scope.uploadTemplates = function() {
		var allValid = true;
	    angular.forEach($scope.templateList, function(template){
	    	if(template.status == "INVALID"){
	    		allValid = false;
	    	}
	    });
	    if(allValid){
	    	
		var busyId = busyService.pushBusy('BUSY_UPLOADING');
		var formData = new FormData();
		formData.append('count', $scope.templateList.length);
		angular.forEach($scope.templateList, function(template, index) {
			formData.append('oets', template.oet.file);
			formData.append('arms', template.arm.file);
		});
		resourceService.post(STORAGE_TEMPLATE_UPLOAD_URL, formData, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function(result) {
			busyService.popBusy(busyId);
			if (result.succeeded) {
				msgboxService.createMessageBox("STORAGE_TEMPLATE_UPLOAD_SUCCEEDED", "STORAGE_TEMPLATE_UPLOAD_SUCCEEDED_HINT", {}, 'success').result.then(function() {
					$scope.reset();
				});
			} else {
				msgboxService.createMessageBox("STORAGE_TEMPLATE_UPLOAD_FAILED", "STORAGE_TEMPLATE_UPLOAD_FAILED_HINT", {
					errorMsg : result.message
				}, 'error').result.then(function() {
					$scope.reset();
				});
			}
		});
	    }else{
	    	msgboxService.createMessageBox("STORAGE_TEMPLATE_UPLOAD_FAILED", "STORAGE_TEMPLATE_UPLOAD_FAILED_SUGGESTION", {}, 'error').result.then(function() {
					//$scope.reset();
				});
	    }
	};



	$scope.validateOet = function(template) {
		template.oetValid = template.oet ? true : false && template.oet.file ? true : false;
	};

	$scope.validateArm = function(template) {
		template.armValid = template.arm ? true : false && template.arm.file ? true : false;
	}; 


};
