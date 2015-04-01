function ArchetypeEditCtrl($scope, msgboxService, resourceService, ARCHETYPE_EDIT_URL,ARCHETYPE_EDIT_SUBMIT_URL){
	
	$scope.getFocusList="Draft";

	$scope.submitId=0;

	resourceService.get(ARCHETYPE_EDIT_URL).then(function(myList){
		
		$scope.archetypeList=myList;
		
	});

	$scope.tempOnFocus=function(temp){
		$scope.getFocusList=temp;
		$scope.submitId=0;
	};

	$scope.setSubmitId=function(temp){
		$scope.submitId=temp.id;
	};

	$scope.getSubmitId=function(){
		if($scope.submitId==0){
			return "$invalid";
		}else{
			return false;
		}
	}
	
	$scope.dpList=function(list){
		return list.lifecycleState==$scope.getFocusList;
	};
	
	$scope.submitFile=function(){
		var formData = new FormData();
		angular.forEach($scope.archetypeList, function(file) {
			if(file.id==$scope.submitId){
				formData.append('id',file.id);
				formData.append('name',file.name);
			}
		});
		resourceService.post(ARCHETYPE_EDIT_SUBMIT_URL,formData,{
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).then(function(result){
			if(result.succeeded){
				msgboxService.createMessageBox("ARCHETYPE_EDIT_SUBMIT_SUCCEEDED", "ARCHETYPE_EDIT_SUBMIT_SUCCEEDED_HINT",
				 {}, 'success').result.then(function() {
					$scope.reset();
				});
			}else{
				msgboxService.createMessageBox("ARCHETYPE_EDIT_SUBMIT_FAILED", "ARCHETYPE_EDIT_SUBMIT_FAILED_HINT", {
					errorMsg : result.message
				}, 'error').result.then(function() {
					$scope.reset();
				});
			}
		});
	};
		
	$scope.reset=function(){
		$scope.submitId=0;
		
		resourceService.get(ARCHETYPE_EDIT_URL).then(function(myList){
			
			$scope.archetypeList=myList;
			
		});
	};
}