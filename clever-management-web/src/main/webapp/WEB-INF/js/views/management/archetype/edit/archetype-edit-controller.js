function ArchetypeEditCtrl($scope, $modal,$log,msgboxService,busyService,archetypeEditService,documentDiffModalService, resourceService,archetypeParseEditService, archetypeParseToEditService ,templateParseToEditService,archetypeSerializeService, archetypeParseService,ARCHETYPE_LIST_EDIT_DRAFT_URL, ARCHETYPE_LIST_EDIT_PUBLISHED_URL,ARCHETYPE_CREATE_URL, ARCHETYPE_EDIT_BY_ID_URL, ARCHETYPE_SUBMIT_BY_ID_URL) {

	
	$scope.editId = 0;
	$scope.focusTab = "ARCHETYPE_EDIT_SUBMIT";
    var editor = archetypeEditService;
	$scope.isArchetypeListHidden = false;
	
	var busyId = busyService.pushBusy('BUSY_LOADING');

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
		busyService.popBusy(busyId);
		console.log("empty list");
		console.log($scope.draftArchetypeList);
	}); 


	resourceService.get(ARCHETYPE_LIST_EDIT_PUBLISHED_URL).then(function(list) {
		$scope.publishedArchetypeList = list;
		//console.log($scope.publishedArchetypeList);
	});
   
   
   $scope.tabContainerHeight = {
		value : $scope.$parent.containerHeight - 35
	};
	$scope.$watch(function() {
		return $scope.$parent.containerHeight;
	}, function(newValue) {
		$scope.tabContainerHeight.value = newValue - 35;
	});
    
     
     
    $scope.searchKeyMapper = function(node) {
		return node.conceptName + ' (' + node.latestArchetypeVersion + ')';
	};

	$scope.$watch('archetypeListFilter', function(newValue) {
		if (newValue != undefined) {
			$scope.treeControl.search(newValue);
		}
	});

	$scope.generatorDiff = function(){
	
		var editedArchetype = archetypeSerializeService.serializeArchetype($scope.oriArchetype);		
		console.log($scope.definition);
		documentDiffModalService.open('Modify records',editedArchetype, $scope.originalAdl);
		
	};
	
	$scope.selectArchetype = function(archetype) {
				
		$scope.selectedArchetype = archetype;		
		$scope.originalAdl = archetype.adl;
		
		//-----get original archetype(json) and then parse it, a display object can be get			
		var oriArchetype = archetypeParseEditService.getOriginalArchetype($scope.selectedArchetype.xml);
		var result = archetypeParseEditService.parseArchetypeJson(oriArchetype);	
		
				
		//var archetype = archetypeParseService.parseArchetypeXml($scope.selectedArchetype.xml);
	
		$scope.editableArchetype = result;
		$scope.oriArchetype = oriArchetype;
		
	
		$scope.ontology = result.terminologies;
		
		$scope.definition = result.definitions;

		//$scope.header = result.header;
	
		$scope.languages = result.languages;
		$scope.languages.selectedLanguage = result.languages.originalLanguage;
		
		
		//---get the header from the original archetype directly---
		$scope.header = {};
		$scope.header.archetype_id = oriArchetype.archetype_id;
		$scope.header.concept = oriArchetype.concept;
		$scope.header.description = oriArchetype.description;
		$scope.header.original_language = oriArchetype.original_language;
		$scope.header.translations = oriArchetype.translations;
		$scope.header.ontology = oriArchetype.ontology;
		
		/*
		console.log("==========this is oriArchetype===========");
		console.log(oriArchetype);
		console.log("==========this is parsedResult Archetype===========");
		console.log(result);
	
		console.log("==========this is definition===========");
		console.log($scope.definition);
		console.log("==========this is header===========");
		console.log($scope.header);		*/
		console.log("==========this is languages===========");
		console.log($scope.languages);
		
		console.log("==========this is ontology===========");
		console.log($scope.ontology);
	};
	  
	$scope.getTreeElementMenu = function(node,aliasName){
		if(node){
			console.log(aliasName);
			var menuHtml = '<ul class="dropdown-menu"  role="menu" ng-if = "true">';
			menuHtml+='<li><a class="pointer" role= "menuitem" ng-click="specialiseNodeByMenu('+aliasName+')" >Specialise</a></li>';
			menuHtml+='<li><a class="pointer" role="menuitem" ng-click="deleteNodeByMenu('+aliasName+')">Delete</a></li>';
			menuHtml+='</ul>';
			return menuHtml;
			
		}
	};
	
	
	
	
	//--------specialise logic---------------
	
	$scope.specialiseArchetype = function(value) {
		console.log("specialise archetype in eidt pane");
	
		$scope.specialisingArchetype = {};
		angular.copy(value, $scope.specialisingArchetype);// is the $$hash key is copied? 
	    console.log(value);
	    console.log($scope.specialisingArchetype);
	    var archetypeListId =getArchetypeListId();
	    $scope.specialisingArchetype.id = archetypeListId;
		$scope.specialisingArchetype.specialiseArchetype = [];
		$scope.specialisingArchetypeName = $scope.specialisingArchetype.name;
		
		$scope.openSpecialise("lg");
		//parse to a js object then edit it 
		var originalArchetype = archetypeParseEditService.getOriginalArchetype($scope.specialisingArchetype.xml);
		
		
		// code change logic
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
       //logic end
       
       //---------serialise to adl and xml,and replace the original adl ang xml----------- 
		var adl = archetypeSerializeService.serializeArchetype(originalArchetype);
		var xml = archetypeSerializeService.serializeArchetypeToXml(originalArchetype);
	//	console.log(xml);
		$scope.specialisingArchetype.xml =  '<?xml version="1.0" encoding="UTF-8"?>' + '\n' + '<archetype xmlns="http://schemas.openehr.org/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
                                            +formatXml(xml)+'</archetype>';
		$scope.specialisingArchetype.adl = adl;
		value.specialiseArchetype.push($scope.specialisingArchetype);
		
		return $scope.specialisingArchetype;
	};
	

	$scope.deleteArchetype = function(value) {
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

  
	 function createArchetype(info) {
		if (info) {
			
			switch(info.type) {
			case "INSTRUCTION":
				createInstruction(info);
				break;
			case "OBSERVATION":
				createObservation(info);
				break;
			case "EVALUATION":
				createEvaluation(info);
				break;
			case "COMPOSITION":
				createComposition(info);
				break;
			case "ADMIN_ENTRY":
				createAdminEntry(info);
				break;
			case "ACTION":
				createAction(info);
				break;
			case "SECTION":
			    createSection(info);
                break;
            case "ITEM_TREE":
                createItemTree(info);
                break;
            case "ITEM_LIST":
                createItemList(info);
                break;
            case "ITEM_SINGLE":
                createItemSingle(info);
                break;
            case "ITEM_TABLE":
                createItemTable(info);
                break;
            case "CLUSTER":
                createCluster(info);
                break;
            case "ELEMENT":
                createElement(info);
                break;
			}

		}
    }
	
	

   //-------------create action ---------------------
   function createAction(info){
   	  var jsonAction = createBaseArchetype(info);
   	  pushToArchetypeList(jsonAction,info);
   }
   
   //-----------create instruction-------------------
    function createInstruction(info){
   	 var jsonInstruction = createBaseArchetype(info);
   	 //add default element here
   	 addActivityToInstruction(jsonInstruction);
   	 pushToArchetypeList(jsonInstruction,info);
   }
   
   function addActivityToInstruction(instruction){
   //	var editor = archetypeEditService;
   	 var ItemTree = editor.getCComplexObject([],"at0002",editor.getDefaultOccurrences(1,1),"ITEM_TREE");
   	 var description = editor.getCSingleAttribute(ItemTree,editor.getDefaultExistence(1,1),"description");
   	 var activityObject = editor.getCComplexObject(description,"at0001",editor.getDefaultOccurrences(0,1),"ACTIVITY");
   	 var activitiesAttribute = editor.getCMultipleAttribute(activityObject,editor.getDefaultCardinality(0),editor.getDefaultExistence(1,1),"activities");
     instruction.definition.attributes.push(activitiesAttribute);
     
     editor.synchronizeOriOntology("at0002","Tree","@internal@",instruction.ontology);
     editor.synchronizeOriOntology("at0001","Current Activity","Current Activity",instruction.ontology);
   }
   
   //------------create observation-------------------
   function createObservation(info){
   	 var jsonObservation = createBaseArchetype(info);
   	 //add default element here
   	 addDataToObservation(jsonObservation);
   	 pushToArchetypeList(jsonObservation,info);
   }
   
   function getEvent(){
   	  var ItemTree = editor.getCComplexObject([],"at0003",editor.getDefaultOccurrences(1,1),"ITEM_TREE");
      var dataAttribute = editor.getCSingleAttribute(ItemTree,editor.getDefaultExistence(1,1),"data");
      var eventObject = editor.getCComplexObject(dataAttribute,"at0002",editor.getDefaultOccurrences(0,1),"EVENT");
      return eventObject;
   }
   function addDataToObservation(observation){
   	  var eventObject = getEvent();
   	  var eventsAttribute = editor.getCMultipleAttribute(eventObject,editor.getDefaultCardinality(1),editor.getDefaultExistence(1,1),"events");
   	  var historyObject = editor.getCComplexObject(eventsAttribute,"at0001",editor.getDefaultOccurrences(1,1),"HISTORY");
   	  var dataAttribute = editor.getCSingleAttribute(historyObject,editor.getDefaultExistence(1,1),"data");
   	  observation.definition.attributes.push(dataAttribute);
   	  
   	  editor.synchronizeOriOntology("at0001","Event Series","@ internal @",observation.ontology);
   	  editor.synchronizeOriOntology("at0002","Any event","*",observation.ontology);
   	  editor.synchronizeOriOntology("at0003","Tree","@ internal @",observation.ontology);
   }
   //end
   
   //--------------create evaluation----------------------
   function createEvaluation(info){
   	var jsonEvaluation = createBaseArchetype(info);
   	//add default element here
   	var itemTree = editor.getCComplexObject([],"at0001",editor.getDefaultOccurrences(1,1),"ITEM_TREE");
    editor.synchronizeOriOntology("at0001","Tree","@ internal @",jsonEvaluation.ontology);
   	var dataAttribute = editor.getCSingleAttribute(itemTree,editor.getDefaultExistence(1,1),"data");
   	jsonEvaluation.definition.attributes.push(dataAttribute);
   	pushToArchetypeList(jsonEvaluation,info);
   }
   
   //----------create admin_entry------------------------
   function createAdminEntry(info){
   	var jsonAdminEntry = createBaseArchetype(info);
   	//add default element here
   	var ItemTree = editor.getCComplexObject([],"at0001",editor.getDefaultOccurrences(1,1),"ITEM_TREE");
   	var dataAttribut = editor.getCSingleAttribute(ItemTree,editor.getDefaultExistence(1,1),"data");
   	jsonAdminEntry.definition.attributes.push(dataAttribut);
   	//synchronize the ontology
   	editor.synchronizeOriOntology("at0001","Tree","@ internal @",jsonAdminEntry.ontology);
   	pushToArchetypeList(jsonAdminEntry,info);
   }
   
   //---------create section---------------------------
   function createSection(info){
   	var jsonSection = createBaseArchetype(info);
   	pushToArchetypeList(jsonSection,info);
   }
   
   //---------create conposition-----------------------
   function createComposition(info){
   	var jsonCompositon = createBaseArchetype(info);
   	var codePhrase = editor.getCCodePhraseWithPara("openehr",['433'],undefined);
   	var definingCode = editor.getCSingleAttribute(codePhrase,editor.getDefaultExistence(1,1),"defining_code");
    var codeText =editor.getCComplexObject(definingCode,undefined,editor.getDefaultOccurrences(1,1),"DV_CODED_TEXT");
    var category = editor.getCSingleAttribute(codeText,editor.getDefaultExistence(1,1),"category");
     
    jsonCompositon.definition.attributes.push(category);
    
    pushToArchetypeList(jsonCompositon,info);
   }
   
   //-----create item tree---------------
   function createItemTree(info){
   	var jsonItemTree = createBaseArchetype(info);
    pushToArchetypeList(jsonItemTree,info);
   } 
   
   //------create item list-----
   function createItemList(info){
   	var jsonItemList = createBaseArchetype(info);
   	pushToArchetypeList(jsonItemList,info);
   }
   
   //----create item single----------
   function createItemSingle(info){
     var jsonItemSingle = createBaseArchetype(info);
     pushToArchetypeList(jsonItemSingle,info);
   }
   
   //-----create item table--------
   function createItemTable(info){//not absolutely right
   	var jsonItemTable = createBaseArchetype(info);
   	
   	var rotated = editor.getCSingleAttribute([],editor.getDefaultExistence(1,1),"rotated");
   	var cluster = editor.getCComplexObject([],"at0002",editor.getDefaultOccurrences(0,1),"CLUSTER");
   	var rows = editor.getCMultipleAttribute(cluster,editor.getDefaultCardinality(1),editor.getDefaultExistence(1,1),"rows");
  
    jsonItemTable.definition.attributes.push(rows);
    jsonItemTable.definition.attributes.push(rotated);
   
    editor.synchronizeOriOntology("at0002","row","@interval@",jsonItemTable.ontology);
    editor.synchronizeOriOntology("at0001","Table","@interval@",jsonItemTable.ontology);
    pushToArchetypeList(jsonItemTable,info);
   }
   
   //-----archetype create auxiliary function---------------
   function createBaseArchetype(info){
   	 console.log("create action archetype here");
   	  var archetypeId = getArchetypeId(info);
   	  info.archetypeId = archetypeId;
   	  var jsonObj = {
   	  	adl_version:"1.4",
   	  	archetype_id:{value:archetypeId},
   	  	concept:"at0000",
   	  	definition:{
   	  		attributes:[],
   	  		node_id:"at0000",
   	  		occurrences:editor.getDefaultOccurrences(0,1),
   	  		rm_type_name:info.type,
   	  	},
   	  	description:getDefaultDescription(),
   	  	ontology:getDefaultOntology(info),
   	  	original_language:getLanguage("en","ISO_639_1"),
   	  };
   	  
   	  return jsonObj;
   	   	 
   }
  
   
   function pushToArchetypeList(jsonObj,info){
   	  var adl = archetypeSerializeService.serializeArchetype(jsonObj);
	  var xml = archetypeSerializeService.serializeArchetypeToXml(jsonObj);
	  xml =  '<?xml version="1.0" encoding="UTF-8"?>' + '\n' + '<archetype xmlns="http://schemas.openehr.org/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
                                            +formatXml(xml)+'</archetype>';
	  var oriObj = getOriArchetype(adl,xml,info);
	  console.log(oriObj);
	  oriObj.selected="selected";
	  $scope.draftArchetypeList.push(oriObj);
   }
  
	
	function getArchetypeListId() {
		var i, id = 0;

		for ( i = 0; i < $scope.draftArchetypeList.length; i++) {
			if ($scope.draftArchetypeList[i].id > id) {
				id = $scope.draftArchetypeList[i].id;
			}
		}
		if ($scope.publishedArchetypeList) {
			for ( i = 0; i < $scope.publishedArchetypeList.length; i++) {
				if ($scope.publishedArchetypeList[i].id > id) {
					id = $scope.publishedArchetypeList[i].id;
				}
			}
		}
		return id;
	}


   function getOriArchetype(adl,xml,info){
   	return {
   		 adl:adl,
	  	 collapsed:true,
	  	 conceptName:info.concept,
	  	 editorId:1,
	  	 editorName:"admin",
	  	 id:getArchetypeListId(),
	  	 lastRevisionArchetype:null,
	  	 lifecycleState:"Draft",
	  	 name:info.archetypeId,
	  	 rmEntity:info.type,
	  	 rmName:"EHR",
	  	 rmOriginator:info.organisation,
	  	 serialVersion:1,
	  	 show:true,
	  	 specialiseArchetype:[],
	  	 version:null,
	  	 versionMasterName:info.archetypeId,
	  	 xml:xml
   	};
   }
   
	function getArchetypeId(info){
		return info.organisation+"-"+info.type+"."+info.concept+".v1";
	}

   function getLanguage(codeString,terminologyId){
   	    return {
   	    	code_string:codeString,
   	    	terminology_id:{
   	    		value:terminologyId,
   	    	},
   	    };
   }
   function getDefaultDescription(){
   	return {
   		original_author:{_id:"name"},
   		lifecycle_state:"0",
   		details:{
   			copyright:"",
   			missue:"",
   			purpose:"",
   			use:"",
   			language:getLanguage("en","ISO_639_1"),  			
   		},
   		  
   		other_details:{
   			_id:"",
   			__text:"",
   		}
   	};
   }
  
   function getDefaultOntology(info){
   	    return {
   	    	term_definitions:[{
   	    		_language:"en",
   	    		items:[{
   	    			_code:"at0000",
   	    			items:[{_id:"text", __text:info.concept,},
   	    			       {_id:"description",__text:"*"}]
   	    		},]
   	    	}]
   	    };
   }
  
  //-----------------auxiliary function end---------------------------
	
	
	
	

    $scope.orgnizationList =["CEN","OpenEHR-EHR","ZJU"];
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
    // archetype create modal-----------------
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
				$scope.concept = "";

				$scope.ok = function() {
					$modalInstance.close({
						organisation : $scope.archetypeOrgnization,
						type : $scope.archetypeType, 
						concept : $scope.concept,
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
			createArchetype(message);
		});

	};
    // archetype specialize modal
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
	
	function formatXml(xml) {
		var formatted = '';
		var reg = /(>)(<)(\/*)/g;
		xml = xml.replace(reg, '$1\r\n$2$3');
		var pad = 0;
		jQuery.each(xml.split('\r\n'), function(index, node) {
			var indent = 0;
			if (node.match(/.+<\/\w[^>]*>$/)) {
				indent = 0;
			} else if (node.match(/^<\/\w/)) {
				if (pad != 0) {
					pad -= 1;
				}
			} else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
				indent = 1;
			} else {
				indent = 0;
			}

			var padding = '';
			for (var i = 0; i < pad; i++) {
				padding += '  ';
			}

			formatted += padding + node + '\r\n';
			pad += indent;
		});
		formatted = formatted.replace(/\n$/, '');

		return formatted;
	}



	
	
};


//for creat a new archetype ---use the angular modals




















