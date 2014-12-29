function ApplicationViewCtrl($scope, $state, $stateParams, appLibraryService, WEBSITE_DOMAIN){

	$scope.websiteDomain = WEBSITE_DOMAIN;
	$scope.applications = [];

	getData();

	$scope.gotoEditPage = function(application){
		$state.go('management.application.edit', {
			id : application.id,
		});
	};

	function getData() {
		appLibraryService.getAllApplications().then(function(result) {
			$scope.applications = result;
		});
	}

}