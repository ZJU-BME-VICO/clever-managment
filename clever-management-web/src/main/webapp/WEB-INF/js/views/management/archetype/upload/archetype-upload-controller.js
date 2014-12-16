function UploadCtrl($scope, resourceService, msgboxService, ARCHETYPE_VALIDATE_URL, ARCHETYPE_UPLOAD_URL) {
	var pageStatus = {
		ToAddFile : 0,
		ToValidate : 1,
		Validating : 2,
		ValidationPast : 3,
		ValidationFailed : 4,
		ToUpload : 5,
		Uploading : 6,
	};

	$scope.fileList = [];
	$scope.status = pageStatus.ToAddFile;

	$scope.onStatus = function(status) {
		return $scope.status == pageStatus[status];
	};

	$scope.deleteFile = function(fileName) {
		for ( i = 0; i < $scope.fileList.length; i++) {
			if ($scope.fileList[i].name == fileName) {
				$scope.fileList.splice(i, 1);
			}
		}
	};

	$scope.validateFiles = function() {
		$scope.status = pageStatus.Validating;
		var formData = new FormData();
		angular.forEach($scope.fileList, function(file, index) {
			formData.append('files', file.file);
			file.status = 'VALIDATING';
		});
		resourceService.post(ARCHETYPE_VALIDATE_URL, formData, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function(results) {
			var isValidationPast = true;
			var isAllValid = true;
			angular.forEach(results, function(result) {
				if (result.status == 'INVALID') {
					isValidationPast = false;
				}
				angular.forEach($scope.fileList, function(file) {
					if (file.name == result.name) {
						file.status = result.status;
						file.message = result.message;
					}
				});
			});
			if (isValidationPast) {
				$scope.status = pageStatus.ValidationPast;
			} else {
				$scope.status = pageStatus.ValidationFailed;
			}
		});
	};

	$scope.uploadFiles = function() {
		$scope.status = pageStatus.Uploading;
		var formData = new FormData();
		angular.forEach($scope.fileList, function(file, index) {
			formData.append('files', file.file);
			file.status = 'UPLOADING';
		});
		resourceService.post(ARCHETYPE_UPLOAD_URL, formData, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function(result) {
			if (result.succeeded) {
				msgboxService.createMessageBox("ARCHETYPE_UPLOAD_SUCCEEDED", "ARCHETYPE_UPLOAD_SUCCEEDED_HINT").then(function() {
					$scope.reset();
				});
			} else {
				msgboxService("ARCHETYPE_UPLOAD_FAILED", "ARCHETYPE_UPLOAD_FAILED_HINT", {
					errorMsg : result.message
				}).then(function() {
					$scope.reset();
				});
			}
		});
	};

	$scope.reset = function() {
		$scope.fileList = [];
		$scope.status = pageStatus.ToAddFile;
	};
}