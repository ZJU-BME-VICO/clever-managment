function ArchetypeEditCtrl($scope, $modal,$log,msgboxService, resourceService, archetypeSerializeService, archetypeParseService,ARCHETYPE_LIST_EDIT_DRAFT_URL, ARCHETYPE_LIST_EDIT_PUBLISHED_URL,ARCHETYPE_CREATE_URL, ARCHETYPE_EDIT_BY_ID_URL, ARCHETYPE_SUBMIT_BY_ID_URL) {

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
	
	//call to background
	//create a new archetype
	$scope.createArchetypePost=function(){
		resourceService.post(ARCHETYPE_CREATE_URL,{
		 	orgnization:$scope.newArchetypeBaseInfo.orgnization,
			type:$scope.newArchetypeBaseInfo.type,
		}).then(function(){});
	};
	
	
	
	
      $scope.$watch('selectedArchetype', function(newValue) {
				if (newValue) {
					var oriArchetype = archetypeParseService.getOriginalArchetype($scope.selectedArchetype.xml);
					console.log("this is the original archetype");
					console.log(oriArchetype);
					console.log("--------------this is my serialize---------------------");
						
					var serializedArchetype = archetypeSerializeService.serializeArchetype(oriArchetype);
					console.log(serializedArchetype);
					
					var archetype = archetypeParseService.parseArchetypeXml($scope.selectedArchetype.xml);
					$scope.header = archetype.header;
					$scope.ontology = archetype.terminologies;
					$scope.definition = archetype.definitions;
					console.log("this is the definition");
					console.log($scope.definition);
					$scope.languages = archetype.languages;
					$scope.languages.selectedLanguage = archetype.languages.originalLanguage;
					//$scope.selectedLanguage = archetype.languages.originalLanguage;
					//console.log($scope.selectedLanguage);
					console.log("parse over");
					console.log(archetype);
					
				}
			});
	
     
	
	
	
   $scope.selectArchetype = function(archetype){
   	  $scope.selectedArchetype = archetype;
   	  console.log($scope.selectedArchetype);
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
    $scope.orgnizationList =["CEN","Open_EHR","ZJU"];
	$scope.archetypeTypeList=[
	    "OBSERVATION",
	    "EVALUATION",
	    "INSTRUCTION",
	    "COMPOSITION",
	    "ADMIN_ENTRY",
	    "ACTION",
	    "ELEMENT",
	    "ITEM_LIST",
	    "ITEM_SINGLE",
	    "ITEM_TREE",
	    "ITEM_TABLE",
	    "CLUSTER",
	    "DEMOGRAPHIC",
	    "SECTION",
	 ];
	//for creat a new archetype ---use angular modals
	$scope.open=function(size){
		var modalInstance=$modal.open({
			animation: true,   //animations on
			templateUrl: 'archetypeCreate.html',
			controller: function ArchetypeCreatCtrl($scope,$modalInstance,orgnizationList,archetypeTypeList){
				              $scope.orgnizationList=orgnizationList;
				              $scope.archetypeTypeList=archetypeTypeList;
	                           //$scope.archetypeInfo = archetypeInfo;
	                           $scope.archetypeType="";
	                           $scope.archetypeOrgnization="";
	                           
	                           $scope.ok = function(){
		                            $modalInstance.close({
	                           	   orgnization:$scope.archetypeOrgnization,
	                           	   type:$scope.archetypeType,
	                           });
	                             };
	                           $scope.cancel = function(){
		                             $modalInstance.dismiss('cancel');
	                              };
                                },
			size:size,
			resolve:{
				orgnizationList:function(){
					return $scope.orgnizationList;
				},
				archetypeTypeList: function(){
					return $scope.archetypeTypeList;
				}
			}
		});
		modalInstance.result.then(function (message) {// modal message back
           $scope.newArchetypeBaseInfo=message;
           $scope.createArchetypePost();
           console.log($scope.newArcehtypeBaseInfo);
        });
  
	};//---open end----
	
	
	
};


//for creat a new archetype ---use the angular modals




















