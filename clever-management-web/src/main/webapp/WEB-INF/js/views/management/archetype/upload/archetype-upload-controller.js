function UploadCtrl($scope, resourceService, ARCHETYPE_VALIDATION_URL) {
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
			file.status = 'UPLOADING';
		});
		resourceService.post(ARCHETYPE_VALIDATION_URL, formData, {
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

	$scope.reset = function() {
		$scope.fileList = [];
		$scope.status = pageStatus.ToAddFile;
	};
}