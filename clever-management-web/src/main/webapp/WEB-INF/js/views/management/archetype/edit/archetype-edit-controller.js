function ArchetypeEditCtrl($scope, $modal,$log,msgboxService, resourceService,archetypeParseEditService, archetypeParseToEditService ,templateParseToEditService,archetypeSerializeService, archetypeParseService,ARCHETYPE_LIST_EDIT_DRAFT_URL, ARCHETYPE_LIST_EDIT_PUBLISHED_URL,ARCHETYPE_CREATE_URL, ARCHETYPE_EDIT_BY_ID_URL, ARCHETYPE_SUBMIT_BY_ID_URL) {

	
	$scope.editId = 0;
	$scope.focusTab = "ARCHETYPE_EDIT_SUBMIT";

	
	
	
	resourceService.get(ARCHETYPE_LIST_EDIT_DRAFT_URL).then(function(list) {
		$scope.draftArchetypeList = list;
		$scope.draftArchetypeList[2].specialiseArchetype = [], $scope.draftArchetypeList[2].specialiseArchetype.push($scope.draftArchetypeList[4]);
		if (angular.isArray($scope.draftArchetypeList)) {
			angular.forEach($scope.draftArchetypeList, function(archetype) {
				if (angular.isArray(archetype.specialiseArchetype)) {
				} else if ((!archetype.specialiseArchetype) || (!archetype.specialiseArchetype.adl)) {
					archetype.specialiseArchetype = [];
				}
			});
		} else {
			var archetype = $scope.draftArchetypeList;
			if (angular.isArray(archetype.specialiseArchetype)) {
			} else if ((!archetype.specialiseArchetype) || (!archetype.specialiseArchetype.adl)) {
				archetype.specialiseArchetype = [];
			}
		}
		//console.log($scope.draftArchetypeList);
	}); 


	resourceService.get(ARCHETYPE_LIST_EDIT_PUBLISHED_URL).then(function(list) {
		$scope.publishedArchetypeList = list;
		//console.log($scope.publishedArchetypeList);
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
		$scope.selectedArchetype = archetype;

		//parse achetype edit service test
		var result = archetypeParseEditService.parseArchetypeXml($scope.selectedArchetype.xml);
		//console.log("this is result archetype ==============================================");
		//parse archetype edit service test end
		//console.log(result);
		//$scope.resultDefinition = result.definitions.treeItems;

		//console.log($scope.selectedArchetype);
		var oriArchetype = archetypeParseService.getOriginalArchetype($scope.selectedArchetype.xml);
		//console.log("==================this is the original archetype=================");
		//console.log(oriArchetype);
		var serializedArchetype = archetypeSerializeService.serializeArchetype(oriArchetype);
		//console.log(serializedArchetype);
		
		var archetype = archetypeParseService.parseArchetypeXml($scope.selectedArchetype.xml);
		//console.log("================this is editable definition==============");
		//console.log(archetype);
		$scope.editableDefinition = archetypeParseToEditService.parseDefinitionToEdit(archetype);

		//console.log("=========================this is editable archetype==========================");
		//console.log($scope.editableDefinition);
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
		//console.log("=======================this is the definition==================");
		//console.log($scope.definition);

		$scope.header = archetype.header;

		//console.log("------------------this is the archetype after edit--------------");
		//console.log(oriArchetype);
		$scope.languages = archetype.languages;
		$scope.languages.selectedLanguage = archetype.languages.originalLanguage;
		//$scope.selectedLanguage = archetype.languages.originalLanguage;
		//console.log($scope.selectedLanguage);
		//console.log("parse over");

		//console.log(archetype);
	};
	  
	$scope.getTreeNodeMenu = function(node,aliasName){
		if(node){
			console.log(aliasName);
			var menuHtml = '<ul class="dropdown-menu"  role="menu" ng-if = "true">';
			menuHtml+='<li><a class="pointer" role= "menuitem" ng-click="specialiseNodeByMenu('+aliasName+')" >Specialise</a></li>';
			menuHtml+='<li><a class="pointer" role="menuitem" ng-click="deleteNodeByMenu('+aliasName+')">Delete</a></li>';
			menuHtml+='</ul>';
			return menuHtml;
			
		}
	};
	
	
	
  
	$scope.specialiseArchetype = function(value) {
		console.log("specialise archetype in eidt pane");
		//console.log(value);

		$scope.specialisingArchetype = {};
		angular.copy(value, $scope.specialisingArchetype);
		//console.log($scope.specialisingArchetype);
		$scope.specialisingArchetype.specialiseArchetype = [];
		$scope.specialisingArchetypeName = $scope.specialisingArchetype.name;
		value.specialiseArchetype.push($scope.specialisingArchetype);
		$scope.openSpecialise('lg');
		//for first step parse to a js object then edit the firs
		var originalArchetype = archetypeParseEditService.getOriginalArchetype($scope.specialisingArchetype.xml);
		// console.log(originalArchetype);
		var oriCode = originalArchetype.concept;
		var resultCode = oriCode + '.1';
		originalArchetype.concept = resultCode;
		originalArchetype.parent_archetype_id.value = value.name;
		originalArchetype.definition.node_id = resultCode;
		var termDefinition = originalArchetype.ontology.term_definitions;

		if (angular.isArray(termDefinition)) {
			angular.forEach(termDefinition, function(term) {
				angular.forEach(term.items, function(item) {
					if (item._code == oriCode) {
						item._code = resultCode;
					}
				});
			});

		} else {
			angular.forEach(termDefinition.items, function(item) {
				if (item._code == oriCode) {
					item._code = resultCode;
				}
			});
		}

		var adl = archetypeSerializeService.serializeArchetype(originalArchetype);
		var xml = archetypeSerializeService.serializeArchetypeToXml(originalArchetype);
		console.log(xml);
		$scope.specialisingArchetype.xml = xml;
		$scope.specialisingArchetype.adl = adl;
		// console.log(serializedArchetype);
		// console.log($scope.specialisingArchetype);
	};

	$scope.deleteArchetype = function(value) {
		//console.log("delete archetype in edit pane");
		//console.log(value);
		if (value.parent) {
			value.parent.specialiseArchetype.splice(value.parent.specialiseArchetype.indexOf(value), 1);
			$scope.draftArchetypeList.splice($scope.draftArchetypeList.indexOf(value), 1);
		} else {
			$scope.draftArchetypeList.splice($scope.draftArchetypeList.indexOf(value), 1);
		}
	};

	$scope.saveSelectedArchetype = function() {

	};
	$scope.submitSelectedAtrchetype = function() {

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
	

	$scope.openCreate = function(size) {
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
			//console.log($scope.newArcehtypeBaseInfo);
		});

	};

	$scope.openSpecialise = function(size) {
		var modalInstance = $modal.open({
			animation : true, //animations on
			templateUrl : 'archetypeSpecialise.html',
			controller : function ArchetypeSpecialiseCtrl($scope, $modalInstance, specialisingArchetypeName) {
				$scope.archetypeName = specialisingArchetypeName;
				$scope.newConceptName = '';
				$scope.ok = function() {
					$modalInstance.close({
						newConceptName : $scope.newConceptName,
					});
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			},
			size : size,
			resolve : {
				specialisingArchetypeName : function() {
					return $scope.specialisingArchetypeName;
				}
			}
		});
		modalInstance.result.then(function(message) {// modal message back
			$scope.specialisingArchetype.name += "-";
			$scope.specialisingArchetype.name += message.newConceptName;
		});

	};
	//---open end----

	
	
};


//for creat a new archetype ---use the angular modals




















