function ApiViewCtr($scope, resourceService, DEVELOPMENT_API_DISPLAY_MASTER_URL,treeDataFormatService,busyService) {
	
	
	$scope.initData = function(){
		resourceService.get(DEVELOPMENT_API_DISPLAY_MASTER_URL).then(function(list){
			$scope.list=list;
			console.log(list);

		});
	}
	
	$scope.initData();

		
	$scope.getApiListById = function(category,version){
		var bid = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(DEVELOPMENT_API_DISPLAY_MASTER_URL+"/"+category+"/"+version).then(function(apiList){
			$scope.apiList = apiList;
			console.log(apiList);
		});
		busyService.popBusy(bid);
	}
	
	$scope.searchKeyMapper = function(node) {
		if (node.isDirectory) {
			return node.name;
		} else {
			return node.conceptName + ' (' + node.version + ')';
		}
	}; 
	
	$scope.selectApi = function(api) {
		var bid = busyService.pushBusy('BUSY_LOADING');
		console.log(api);
		//template.lifecycleState = true;
		if (api.rootUrlName) {
		  $scope.selectedApi = undefined;
		}
		if(api.apiName){
			$scope.selectedApi = api;
		}
		busyService.popBusy(bid);
	}; 
	

}