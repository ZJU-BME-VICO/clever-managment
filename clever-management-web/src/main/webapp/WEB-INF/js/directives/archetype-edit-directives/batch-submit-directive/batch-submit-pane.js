angular.module('clever.management.directives.batchSubmitPane', []).directive('batchSubmitPane', function(resourceService, ARCHETYPE_SUBMIT_BY_ID_URL, STORAGE_TEMPLATE_SUBMIT_BY_ID_URL) {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			fileList : '=',
			type : '@',
			maxHeight : '=',
		},
		templateUrl : 'js/directives/archetype-edit-directives/batch-submit-directive/batch-submit-pane.html',

		controller : function($scope, $element, $attrs) {
			$scope.pageStatus = 'beforeSubmit';
			console.log($scope.fileList);
			console.log($scope.type);
			$scope.checkedCount = 0;
			$scope.checkFile = function(file) {
				file.checked = !file.checked;
				if (file.checked) {
					$scope.checkedCount++;
				} else {
					$scope.checkedCount--;
				}
				console.log($scope.checkedCount);
				if ($scope.checkedCount == $scope.fileList.length) {
					$scope.checkedAll = true;
				} else {
					$scope.checkedAll = false;
				}
			};
			$scope.checkedAll = false;
			$scope.checkAll = function() {
				$scope.checkedAll = !$scope.checkedAll;
				$scope.checkedCount = $scope.checkedAll ? $scope.fileList.length : 0;
				angular.forEach($scope.fileList, function(file) {
					file.checked = $scope.checkedAll;
				});
			};

			$scope.submitResult = {
				successful : [],
				failed : [],
			};

			function processResult(result, file) {
				if (result.succeeded) {
					file.lifecycleState = 'Teamreview';
					file.submited = true;
					$scope.submitResult.successful.push(file);
				} else {
					file.message = result.message;
					$scope.submitResult.failed.push(file);
				}
			}

			var typeUrlMap = {
				archetype : ARCHETYPE_SUBMIT_BY_ID_URL,
				template : STORAGE_TEMPLATE_SUBMIT_BY_ID_URL,
			};
			$scope.submitChecked = function() {
				var fileCount = $scope.fileList.length;
				angular.forEach($scope.fileList, function(file) {
					fileCount--;
					if (file.checked) {
						resourceService.get(typeUrlMap[$scope.type] + file.id).then(function(result) {
							processResult(result, file);
						});
					}
					if (fileCount == 0) {
						$scope.pageStatus = "afterSubmit";
					}
				});
			};

		}
	};

});
