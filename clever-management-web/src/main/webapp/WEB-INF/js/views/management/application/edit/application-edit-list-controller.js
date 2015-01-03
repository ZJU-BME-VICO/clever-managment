function ApplicationEditListCtrl($scope, $state, resourceService, APPLICATION_LIST_URL) {

    $scope.obj = {};
    $scope.obj.applications = [];

    resourceService.get(APPLICATION_LIST_URL).then(function(result) {
        $scope.obj.applications = result;
    });

    $scope.selectApp = function(application) {
        $state.go('management.application.edit.detail', {
            id: application.id,
        });
        $scope.obj.selectedAppId = application.id;
    };

    $scope.addNewApp = function() {
        $state.go('management.application.edit.detail', {
            id: 'add',
        });
    };
}
