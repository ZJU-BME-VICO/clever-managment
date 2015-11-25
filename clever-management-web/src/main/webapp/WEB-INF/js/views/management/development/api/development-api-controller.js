function ApiCtr($scope, resourceService,DEVELOPMENT_API_URL) {
    $scope.getApiMaster = function() {
        resourceService.get(DEVELOPMENT_API_URL+"/1/1").then(function(list){
            console.log(list);
        });
    };
}
