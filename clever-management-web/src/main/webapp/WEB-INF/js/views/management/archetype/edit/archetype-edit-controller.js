function ArchetypeEditCtrl($scope, $modal,$log,msgboxService, resourceService,archetypeParseEditService, archetypeParseToEditService ,templateParseToEditService,archetypeSerializeService, archetypeParseService,ARCHETYPE_LIST_EDIT_DRAFT_URL, ARCHETYPE_LIST_EDIT_PUBLISHED_URL,ARCHETYPE_CREATE_URL, ARCHETYPE_EDIT_BY_ID_URL, ARCHETYPE_SUBMIT_BY_ID_URL) {

	
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
	//create a new archetype test
	$scope.createArchetypePost = function() {
		resourceService.post(ARCHETYPE_CREATE_URL, {
			orgnization : $scope.newArchetypeBaseInfo.orgnization,
			type : $scope.newArchetypeBaseInfo.type,
		}).then(function() {
		});
	}; 

	
	$scope.selectArchetype = function(archetype) {

		//test
		var array = [];
		array.push({
			af : 'dsf'
		});
		array.push({
			sd : 'dsfa'
		});
		array.ref = "sadf";
		console.log(array);
		angular.forEach(array, function(item) {
			console.log(item);
		});

		$scope.selectedArchetype = archetype;

		//parse achetype edit service test
		var result = archetypeParseEditService.parseArchetypeXml($scope.selectedArchetype.xml);
		console.log("this is result archetype ==============================================");
		//parse archetype edit service test end
		console.log(result);
		//$scope.resultDefinition = result.definitions.treeItems;

		//console.log($scope.selectedArchetype);
		var oriArchetype = archetypeParseService.getOriginalArchetype($scope.selectedArchetype.xml);
		console.log("==================this is the original archetype=================");
		console.log(oriArchetype);
		var archetype = archetypeParseService.parseArchetypeXml($scope.selectedArchetype.xml);
		console.log("================this is editable definition==============");
		console.log(archetype);
		$scope.editableDefinition = archetypeParseToEditService.parseDefinitionToEdit(archetype);

		console.log("=========================this is editable archetype==========================");
		console.log($scope.editableDefinition);
		//	var editTemplate = templateParseToEditService.parseDefinition(archetype);
		//	console.log("===========this is eidtable template============");
		//console.log(editTemplate);

		$scope.ontology = archetype.terminologies;
		var temp = {};

		temp.oriDefinition = archetype.definitions;
		//var addItem = {asdf:'dfa',};
		//	$scope.definition.oriDefinition.treeItems[0].children.push(addItem);
		//temp.editableDefinition = $scope.editableDefinition;
		temp.editableDefinition = result.definitions;
		$scope.definition = temp;
		console.log("=======================this is the definition==================");
		console.log($scope.definition);

		$scope.header = archetype.header;

		console.log("------------------this is the archetype after edit--------------");
		console.log(oriArchetype);
		$scope.languages = archetype.languages;
		$scope.languages.selectedLanguage = archetype.languages.originalLanguage;
		//$scope.selectedLanguage = archetype.languages.originalLanguage;
		//console.log($scope.selectedLanguage);
		//console.log("parse over");

		//console.log(archetype);
	}; 

   $scope.saveSelectedArchetype = function(){
   	
   };
   $scope.submitSelectedAtrchetype=function(){
   	
   };   
   
   
   
   
  
	/*
	$scope.$("#draft").hover(function() {
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
	
	$scope.open = function(size) {
		var modalInstance = $modal.open({
			animation : true, //animations on
			templateUrl : 'archetypeCreate.html',
			controller : function ArchetypeCreatCtrl($scope, $modalInstance, orgnizationList, archetypeTypeList) {
				$scope.orgnizationList = orgnizationList;
				$scope.archetypeTypeList = archetypeTypeList;
				//$scope.archetypeInfo = archetypeInfo;
				$scope.archetypeType = "";
				$scope.archetypeOrgnization = "";

				$scope.ok = function() {
					$modalInstance.close({
						orgnization : $scope.archetypeOrgnization,
						type : $scope.archetypeType,
					});
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			},
			size : size,
			resolve : {
				orgnizationList : function() {
					return $scope.orgnizationList;
				},
				archetypeTypeList : function() {
					return $scope.archetypeTypeList;
				}
			}
		});
		modalInstance.result.then(function(message) {// modal message back
			$scope.newArchetypeBaseInfo = message;
			$scope.createArchetypePost();
			console.log($scope.newArcehtypeBaseInfo);
		});

	};
	//---open end----
	
	
};


//for creat a new archetype ---use the angular modals




















