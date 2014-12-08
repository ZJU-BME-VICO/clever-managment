function UploadCtrl($scope) {
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

	};

	$scope.reset = function() {
		$scope.fileList = [];
		$scope.status = pageStatus.ToAddFile;
	};
}