function ArchetypeVerifyCtrl($scope, msgboxService, resourceService, ARCHETYPE_VERIFY_URL, ARCHETYPE_VERIFY_APPROVE_URL, 
		ARCHETYPE_VERIFY_REJECT_URL, ARCHETYPE_VERIFY_REJECT_AND_REMOVE_URL){

	$scope.verifyId=0;
	
	resourceService.get(ARCHETYPE_VERIFY_URL).then(function(verList){
		
		$scope.archetypeList=verList;
		
	});
	
	$scope.setVerifyId=function(temp){
		$scope.verifyId=temp.id
	};
	
	$scope.getVerifyId=function(){
		if($scope.verifyId==0){
			return "$invalid";
		}else{
			return false;
		}
	}
	
	$scope.reject=function(){
		msgboxService.createMessageBox("ARCHETYPE_VERIFY_REJECT_HINT", "ARCHETYPE_VERIFY_REJECT_HINT_INFO",
				 {}, 'warning',"yesOrNo").result.then(function(){
						 $scope.rejectAndremoveFile();
				 	},function(){
				 		$scope.rejectFile();
				 	});
			
				 
	};

	$scope.approveFile=function(){
		var formData = new FormData();
		angular.forEach($scope.archetypeList, function(file) {
			if(file.id==$scope.verifyId){
				formData.append('id',file.id);
				formData.append('name',file.name);
			}
		});
		resourceService.post(ARCHETYPE_VERIFY_APPROVE_URL,formData,{
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function(result){
			if(result.succeeded){
				msgboxService.createMessageBox("ARCHETYPE_VERIFY_SUCCEEDED", "ARCHETYPE_VERIFY_APPROVE_SUCCEEDED_HINT",
				 {}, 'success').result.then(function() {
					$scope.reset();
				});
			}else{
				msgboxService.createMessageBox("ARCHETYPE_VERIFY_FAILED", "ARCHETYPE_VERIFY_APPROVE_FAILED_HINT", {
					errorMsg : result.message
				}, 'error').result.then(function() {
					$scope.reset();
				});
			}
		});
	};
	
	$scope.rejectFile=function(){
		var formData = new FormData();
		angular.forEach($scope.archetypeList, function(file) {
			if(file.id==$scope.verifyId){
				formData.append('id',file.id);
				formData.append('name',file.name);
			}
		});
		resourceService.post(ARCHETYPE_VERIFY_REJECT_URL,formData,{
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function(result){
			if(result.succeeded){
				msgboxService.createMessageBox("ARCHETYPE_VERIFY_SUCCEEDED", "ARCHETYPE_VERIFY_REJECT_SUCCEEDED_HINT",
						{}, 'success').result.then(function() {
							$scope.reset();
						});
			}else{
				msgboxService.createMessageBox("ARCHETYPE_VERIFY_FAILED", "ARCHETYPE_VERIFY_REJECT_FAILED_HINT", {
					errorMsg : result.message
				}, 'error').result.then(function() {
					$scope.reset();
				});
			}
		});
	};
	
	$scope.rejectAndremoveFile=function(){
		var formData = new FormData();
		angular.forEach($scope.archetypeList, function(file) {
			if(file.id==$scope.verifyId){
				formData.append('id',file.id);
				formData.append('name',file.name);
			}
		});
		resourceService.post(ARCHETYPE_VERIFY_REJECT_AND_REMOVE_URL,formData,{
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function(result){
			if(result.succeeded){
				msgboxService.createMessageBox("ARCHETYPE_VERIFY_SUCCEEDED", "ARCHETYPE_VERIFY_REJECT_AND_REMOVE_SUCCEED_HINT",
						{}, 'success').result.then(function() {
							$scope.reset();
						});
			}else{
				msgboxService.createMessageBox("ARCHETYPE_VERIFY_FAILED", "ARCHETYPE_VERIFY_REJECT_AND_REMOVE_FAILED_HINT", {
					errorMsg : result.message
				}, 'error').result.then(function() {
					$scope.reset();
				});
			}
		});
	};

	$scope.reset=function(){
		
		$scope.verifyId=0;
		
		resourceService.get(ARCHETYPE_VERIFY_URL).then(function(verList){
			
			$scope.archetypeList=verList;
			
		});
	};
}