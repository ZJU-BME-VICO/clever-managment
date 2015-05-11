function StorageTemplateDeployCtrl($scope, resourceService, STORAGE_TEMPLATE_LIST_DEPLOY_URL) {
    $scope.templateMasterList = [];

    resourceService.get(STORAGE_TEMPLATE_LIST_DEPLOY_URL).then(function(list) {
        $scope.templateMasterList = list;

        angular.forEach($scope.templateMasterList, function(master) {
            master.isSelected = false;
            master.selectedTemplate = master.templates[0];
        });
    });

    $scope.getFixedTitle = function(title, length) {
        var titleLength = length || 35;
        if (title.length > titleLength) {
            return title.substring(0, titleLength / 2) + '....' + title.substring(title.length - titleLength / 2, title.length);
        }else{
            return title;
        }
    };

}
