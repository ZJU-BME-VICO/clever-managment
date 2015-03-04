function StorageTemplateUploadCtrl($scope, resourceService, busyService, msgboxService, STORAGE_TEMPLATE_VALIDATE_URL, STORAGE_TEMPLATE_UPLOAD_URL) {
	var pageStatus = {
		ToAddFile : 0,
		ToValidate : 1,
		Validating : 2,
		ValidationPast : 3,
		ValidationFailed : 4,
		ToUpload : 5,
		Uploading : 6,
	};

	$scope.templates = [];
	$scope.status = pageStatus.ToAddFile;

	$scope.$watch('templates.length', function(newValue) {
		if (newValue == 0) {
			$scope.status = pageStatus.ToAddFile;
		}
	});

	$scope.addTemplate = function() {
		if ($scope.templates.length == 0) {
			pushNewTemplate();
		} else {
			var lastTemplate = $scope.templates[$scope.templates.length - 1];
			$scope.validateOet(lastTemplate);
			$scope.validateArm(lastTemplate);
			lastTemplate.valid = lastTemplate.oetValid && lastTemplate.armValid ? undefined : false;
			if (lastTemplate.valid == undefined) {
				pushNewTemplate();
			}
		}
	};

	function pushNewTemplate() {
		$scope.templates.push({
			templateName : '',
			oet : {},
			arm : {},
			deleteEnabled : false,
			oetValid : true,
			armValid : true,
			serverValid : undefined,
			serverValidating : false,
			serverUploading : false,
			valid : undefined,
		});
	}


	$scope.onStatus = function(status) {
		return $scope.status == pageStatus[status];
	};

	$scope.validateOet = function(template) {
		template.oetValid = template.oet.file ? true : false;
		template.valid = template.oetValid && template.armValid ? undefined : false;
	};

	$scope.validateArm = function(template) {
		template.armValid = template.arm.file ? true : false;
		template.valid = template.oetValid && template.armValid ? undefined : false;
	};

	$scope.deleteTemplate = function(template) {
		$scope.templates.splice($scope.templates.indexOf(template), 1);
	};

	$scope.reset = function() {
		$scope.templates = [];
		$scope.status = pageStatus.ToAddFile;
	};

	$scope.validateTemplates = function() {
		var allValid = true;
		angular.forEach($scope.templates, function(template) {
			$scope.validateOet(template);
			$scope.validateArm(template);
			template.valid = template.oetValid && template.armValid ? undefined : false;
			allValid = template.valid == false ? false : true;
		});
		if (!allValid) {
			$scope.status = pageStatus.ValidationFailed;
			return;
		}
		$scope.status = pageStatus.Validating;
		var count = $scope.templates.length;
		var isValidationPast = true;
		angular.forEach($scope.templates, function(template, index) {
			template.serverValidating = true;
			template.serverValid = undefined;
			var formData = new FormData();
			formData.append('name', index);
			formData.append('oet', template.oet.file);
			formData.append('arm', template.arm.file);
			resourceService.post(STORAGE_TEMPLATE_VALIDATE_URL, formData, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
			}).then(function(result) {
				template.serverValidating = false;
				if (result.status == 'INVALID') {
					template.serverValid = false;
					template.valid = false;
					template.message = result.message;
					isValidationPast = false;
				} else {
					template.serverValid = true;
					template.valid = true;
					template.name = result.name;
				}
				count--;
				if (count == 0) {
					if (isValidationPast) {
						$scope.status = pageStatus.ValidationPast;
					} else {
						$scope.status = pageStatus.ValidationFailed;
					}
				}
			});

		});
	};

	$scope.uploadTemplates = function() {
		var busyId = busyService.pushBusy('BUSY_UPLOADING');
		var formData = new FormData();
		formData.append('count', $scope.templates.length);
		angular.forEach($scope.templates, function(template, index) {
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
	};
}
