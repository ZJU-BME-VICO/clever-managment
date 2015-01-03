function ApplicationViewCtrl($scope, $state, resourceService, WEBSITE_DOMAIN, APPLICATION_LIST_URL){

	$scope.websiteDomain = WEBSITE_DOMAIN;
	$scope.currentUrl = WEBSITE_DOMAIN + '/#/management/application/view'
	$scope.applications = [];

	resourceService.get(APPLICATION_LIST_URL).then(function(result){
		$scope.applications = result;
	});

	$scope.gotoEditPage = function(application){
		$state.go('management.application.edit.detail', {
			id : application.id,
		});
	};

	$scope.selectApp = function(id){
		$scope.selectedAppId = id;
	}
}