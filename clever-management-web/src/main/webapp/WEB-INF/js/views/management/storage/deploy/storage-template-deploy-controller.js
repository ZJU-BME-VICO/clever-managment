function StorageTemplateDeployCtrl($scope, authenticationService, resourceService, busyService, msgboxService, STORAGE_TEMPLATE_LIST_DEPLOY_URL, STORAGE_TEMPLATE_LIST_DEPLOYED_URL, STORAGE_TEMPLATE_DEPLOY_URL) {
	$scope.templateMasterList = [];
	$scope.deployedTemplateList = [];
	$scope.selectedCount = 0;

	resourceService.get(STORAGE_TEMPLATE_LIST_DEPLOY_URL).then(function(list) {
		$scope.templateMasterList = list;

		angular.forEach($scope.templateMasterList, function(master) {
			master.isSelected = false;
			master.selectedTemplate = master.templates[0];
		});
	});

	resourceService.get(STORAGE_TEMPLATE_LIST_DEPLOYED_URL).then(function(list) {
		if (angular.isArray(list)) {
			$scope.deployedTemplateList = list;
		} else {
			$scope.deployedTemplateList = [list];
		}
	});

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
				});
			} else {
				msgboxService.createMessageBox('STORAGE_TEMPLATE_DEPLOY_MSG_HINI', 'STORAGE_TEMPLATE_DEPLOY_FIALED_HINI', {
					errorMsg : result.message
				}, 'error');
			}
		});
	};
}
