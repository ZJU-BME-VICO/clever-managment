function StorageTemplateDeployCtrl($scope, authenticationService, resourceService, busyService, msgboxService, STORAGE_TEMPLATE_LIST_DEPLOY_URL, STORAGE_TEMPLATE_LIST_DEPLOYED_URL, STORAGE_TEMPLATE_DEPLOY_URL, DEPLOY_RECORDS_LIST_URL) {
	$scope.templateMasterList = [];
	$scope.deployedTemplateList = [];
	$scope.selectedCount = 0;
	$scope.selectAll = false;
	$scope.selectIndeterminate = false;
	$scope.deployedRecords = [];

	function refreshTemplateList() {
		var busyId = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(STORAGE_TEMPLATE_LIST_DEPLOY_URL).then(function(list) {
			$scope.templateMasterList = list;

			angular.forEach($scope.templateMasterList, function(master) {
				master.isSelected = false;
				master.selectedTemplate = master.templates[0];
			});

			busyService.popBusy(busyId);
		});
	}

	refreshTemplateList();

	function refreshDeployRecords() {
		var busyId = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(DEPLOY_RECORDS_LIST_URL).then(function(list) {
			$scope.deployRecords = list;
			console.log(list);
			busyService.popBusy(busyId);
		});
	}

	refreshDeployRecords();

	/*resourceService.get(STORAGE_TEMPLATE_LIST_DEPLOYED_URL).then(function(list) {
	 if (angular.isArray(list)) {
	 $scope.deployedTemplateList = list;
	 } else {
	 $scope.deployedTemplateList = [list];
	 }
	 });*/

	$scope.checkAll = function() {
		if ($scope.selectIndeterminate) {
			$scope.selectAll = false;
		} else {
			$scope.selectAll = !$scope.selectAll;
		}
		$scope.selectIndeterminate = false;
		$scope.selectedCount = $scope.selectAll ? $scope.templateMasterList.length : 0;
		angular.forEach($scope.templateMasterList, function(master) {
			master.isSelected = $scope.selectAll;
		});
	};

	$scope.getFormatedTime = function(time) {
		var date = new Date();
		date.setTime(time);
		return date.format('yyyy-MM-dd hh:mm:ss');
	};

	$scope.getFixedTitle = function(title, length) {
		var titleLength = length || 35;
		if (title.length > titleLength) {
			return title.substring(0, titleLength / 2) + '....' + title.substring(title.length - titleLength / 2, title.length);
		} else {
			return title;
		}
	};

	$scope.selectTemplate = function(templateMaster) {
		templateMaster.isSelected = !templateMaster.isSelected;
		if (templateMaster.isSelected) {
			$scope.selectedCount++;
		} else {
			$scope.selectedCount--;
		}
		if ($scope.selectedCount == 0) {
			$scope.selectAll = false;
			$scope.selectIndeterminate = false;
		} else if ($scope.selectedCount == $scope.templateMasterList.length) {
			$scope.selectAll = true;
			$scope.selectIndeterminate = false;
		} else {
			$scope.selectIndeterminate = true;
		}
	};

	$scope.showErrorMessage = function(record) {
		msgboxService.createMessageBox('STORAGE_TEMPLATE_DEPLOY_ERROR_MSG', record.message, {}, 'error', undefined, 'lg');
	};

	$scope.deployTemplates = function() {
		var busyId = busyService.pushBusy('STORAGE_TEMPLATE_DEPLOY_FILE_DEPLOYING');
		var deployConfig = {};
		deployConfig.comment = 'Clever managment web deployed.';
		deployConfig.templateNames = [];
		deployConfig.userName = authenticationService.getUserName();
		angular.forEach($scope.templateMasterList, function(master) {
			if (master.isSelected) {
				deployConfig.templateNames.push(master.selectedTemplate.name);
			}
		});
		resourceService.post(STORAGE_TEMPLATE_DEPLOY_URL, deployConfig).then(function(result) {
			busyService.popBusy(busyId);
			if (result.succeeded) {
				msgboxService.createMessageBox('STORAGE_TEMPLATE_DEPLOY_MSG_HINI', 'STORAGE_TEMPLATE_DEPLOY_SUCCEEDED_HINI', {}, 'success').result.then(function() {
					$scope.deployedTemplateList = deployConfig.templateNames;
					
					refreshDeployRecords();
				});
			} else {
				msgboxService.createMessageBox('STORAGE_TEMPLATE_DEPLOY_MSG_HINI', 'STORAGE_TEMPLATE_DEPLOY_FAILED_HINI', {
					errorMsg : result.message
				}, 'error');
			}
		});
		
		//console.log(deployConfig);
	};
}
