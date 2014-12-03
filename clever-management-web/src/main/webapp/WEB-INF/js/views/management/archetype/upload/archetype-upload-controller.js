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

	$scope.isStatus = function(status) {
		return $scope.status == pageStatus[status];
	};
}