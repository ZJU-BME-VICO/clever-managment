function ArchetypeUploadCtrl($scope, $timeout, resourceService, msgboxService, busyService, ARCHETYPE_VALIDATE_URL, ARCHETYPE_UPLOAD_URL) {
	// var pageStatus = {
	// ToAddFile : 0,
	// ToValidate : 1,
	// Validating : 2,
	// ValidationPast : 3,
	// ValidationFailed : 4,
	// ToUpload : 5,
	// Uploading : 6,
	// };
	var pageStatus = {
		ToAddFile : 0,
		Uploading : 1,
		Validating : 2,
		AfterUpload : 3,
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
			if ($scope.fileList.length == 0) {
				$scope.reset();
			}
		}
	};

	// function validateFiles() {
	// $scope.status = pageStatus.Validating;
	// var isValidationPast = true;
	// var count = $scope.fileList.length;
	// angular.forEach($scope.fileList, function(file, index) {
	// var formData = new FormData();
	// formData.append('file', file.file);
	// file.status = 'VALIDATING';
	// resourceService.post(ARCHETYPE_VALIDATE_URL, formData, {
	// transformRequest : angular.identity,
	// headers : {
	// 'Content-Type' : undefined
	// }
	// }).then(function(result) {
	// if (result.status == 'INVALID') {
	// isValidationPast = false;
	// }
	// file.status = result.status;
	// file.message = result.message;
	// count--;
	// if (count == 0) {
	// if (isValidationPast) {
	// $scope.status = pageStatus.ValidationPast;
	// } else {
	// $scope.status = pageStatus.ValidationFailed;
	// }
	// }
	// });
	// });
	// };

	$scope.validateResult = {
		successful : [],
		alreadyExist : [],
		others : [],
	};
	function validateFiles() {
		$scope.status = pageStatus.Validating;
		$scope.validFinished = false;
		$scope.status = pageStatus.Validating;
		var count = $scope.fileList.length;
		angular.forEach($scope.fileList, function(file, index) {

			var formData = new FormData();
			formData.append('file', file.file);
			resourceService.post(ARCHETYPE_VALIDATE_URL, formData, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
			}).then(function(result) {
				count--;
				file.status = result.status;
				file.message = result.message;
				if (result.status == 'ALREADYEXIST' || result.status == 'VERSIONNOTMATCH') {
					$scope.validateResult.alreadyExist.push(file);
				} else if (result.status == 'VALID') {
					$scope.validateResult.successful.push(file);
				} else {
					$scope.validateResult.others.push(file);
				}
				if (count == 0) {
					$scope.validFinished = true;
				}
			});
		});
	};
	$scope.validateFiles = function() {

		$scope.validateFinished = false;
		$scope.status = pageStatus.Validating;
		var count = $scope.fileList.length;
		angular.forEach($scope.fileList, function(file, index) {

			//	var bid = busyService.pushBusy('BUSY_LOADING');
			var formData = new FormData();
			formData.append('file', file.file);
			resourceService.post(ARCHETYPE_VALIDATE_URL, formData, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined
				}
			}).then(function(result) {
				//busyService.popBusy(bid);
				count--;
				file.status = result.status;
				file.message = result.message;
				if (result.status == 'VERSIONNOTMATCH') {
					$scope.validateResult.alreadyExist.push(file);
				} else if (result.status == 'VALID') {
					$scope.validateResult.successful.push(file);
				} else {
					$scope.validateResult.others.push(file);
				}
				if (count == 0) {
					$scope.validateFinished = true;
				}
			});
		});
	};

	$scope.$watch('validateFinished', function(newValue) {
		if (newValue) {
			uploadFiles();
			$scope.validateFinished = false;
		}
	});
	function uploadFiles() {
		console.log($scope.validateResult);
		$scope.status = pageStatus.Uploading;
		var formData = new FormData();
		angular.forEach($scope.validateResult.successful, function(file, index) {
			formData.append('files', file.file);
			file.status = 'UPLOADING';
		});
		var bid = busyService.pushBusy('BUSY_UPLOADING');
		resourceService.post(ARCHETYPE_UPLOAD_URL, formData, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function(result) {
			busyService.popBusy(bid);
			//$scope.status = pageStatus.AfterUpload;
			if (result.succeeded) {
				msgboxService.createMessageBox("ARCHETYPE_UPLOAD_SUCCEEDED", "ARCHETYPE_UPLOAD_SUCCEEDED_HINT", {}, 'success').result.then(function() {
					$scope.status = pageStatus.AfterUpload;

				});
			} else {
				msgboxService.createMessageBox("ARCHETYPE_UPLOAD_FAILED", "ARCHETYPE_UPLOAD_FAILED_HINT", {
					errorMsg : result.message
				}, 'error').result.then(function() {
					$scope.reset();
				});
			}
		});
	}


	$scope.reset = function() {
		$scope.validateResult = {
			successful : [],
			alreadyExist : [],
			others : [],
		};
		$scope.fileList = [];
		$scope.status = pageStatus.ToAddFile;
	};
}