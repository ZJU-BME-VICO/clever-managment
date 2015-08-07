function ArchetypeEditCtrl($scope, $modal,$log,msgboxService, resourceService, ARCHETYPE_LIST_EDIT_DRAFT_URL, ARCHETYPE_LIST_EDIT_PUBLISHED_URL, ARCHETYPE_EDIT_BY_ID_URL, ARCHETYPE_SUBMIT_BY_ID_URL) {

	$scope.editId = 0;
	$scope.focusTab = "ARCHETYPE_EDIT_SUBMIT";

	resourceService.get(ARCHETYPE_LIST_EDIT_DRAFT_URL).then(function(list) {
		$scope.draftArchetypeList = list;
		console.log($scope.draftArchetypeList);
	});

	resourceService.get(ARCHETYPE_LIST_EDIT_PUBLISHED_URL).then(function(list) {
		$scope.publishedArchetypeList = list;
		console.log($scope.publishedArchetypeList);
	});
	
	

   $scope.selectArchetype = function(archetype){
   	  $scope.selectedArchetype = archetype;
   	  //console.log($scope.selectedArchetype);
   };
   $scope.saveSelectedArchetype = function(){
   	
   };
   $scope.submitSelectedAtrchetype=function(){
   	
   };   
   
   
   
   
  /* $scope.
   
	$("#draft").hover(function() {
		draft.style.borderBottom = "3px solid red";
		published.style.borderBottom = "";
		$scope.$apply(function() {
			$scope.editId = 0;
			$scope.focusTab = "ARCHETYPE_EDIT_SUBMIT";
		});
	});

	$("#published").hover(function() {
		draft.style.borderBottom = "";
		published.style.borderBottom = "3px solid red";
		$scope.$apply(function() {
			$scope.editId = 0;
			$scope.focusTab = "ARCHETYPE_EDIT_EDIT";
		});
	});
	*/
	$scope.isArchetypeListHidden = false;
	
	$scope.archetypeInfo="asdfa";
	 $scope.orgnizationList =["CEN","Open_EHR",];
	//for creat a new archetype ---use angular modals
	$scope.open=function(size){
		var modalInstance=$modal.open({
			animation: true,
			templateUrl: 'archetypeCreate.html',
			controller: function ArchetypeCreatCtrl($scope,$modalInstance,orgnizationList){
				              $scope.orgnizationList=orgnizationList;
	                           //$scope.archetypeInfo = archetypeInfo;
	                           $scope.okMessage = "successfull";
	                           $scope.ok = function(){
		                            $modalInstance.close($scope.okMessage);
	                             };
	                           $scope.cancel = function(){
		                             $modalInstance.dismiss('cancel');
	                              };
                                },
			size:size,
			resolve:{
				orgnizationList:function(){
					return $scope.orgnizationList;
				}
			}
		});
		modalInstance.result.then(function (message) {
        console.log(message);
        });
  
	};//---open end----
	
	
	
};


//for creat a new archetype ---use the angular modals




















