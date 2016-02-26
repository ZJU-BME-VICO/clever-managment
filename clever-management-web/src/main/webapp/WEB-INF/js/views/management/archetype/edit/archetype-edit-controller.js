function ArchetypeEditCtrl($scope, $modal, $log, $q, $timeout, msgboxService, busyService, archetypeEditService, documentDiffModalService, resourceService, archetypeParseEditService, templateParseToEditService, archetypeSerializeService, archetypeParseService, treeDataFormatService, ARCHETYPE_BY_NAME_URL, ARCHETYPE_LIST_EDIT_DRAFT_URL, ARCHETYPE_LIST_EDIT_PUBLISHED_URL, ARCHETYPE_CREATE_BY_URL, AECHETYPE_FALLBACK_BY_ID_URL, ARCHETYPE_EDIT_BY_ID_URL, ARCHETYPE_SUBMIT_BY_ID_URL, ARCHETYPE_REMOVE_BY_ID_URL) {


    $scope.treeControl = {};

    $scope.isCollapse = true;

    $scope.isArchetypeListHidden = false;

    var editor = archetypeEditService;

    $scope.definitionExpandedAll = {
        value: false,
    };

    $scope.tabContainerHeight = {
        value: $scope.$parent.containerHeight - 35
    };
    $scope.$watch(function() {
        return $scope.$parent.containerHeight;
    }, function(newValue) {
        $scope.tabContainerHeight.value = newValue - 35;
    });


/**
 * SearchKeyMapper callback function for tree view
 * @param {object} node An archetype node in archetype tree
 * @return {string} Node name if node is a directory, node conceptName with node latestArchetypeVersion if node is a archetype 
 */
    $scope.searchKeyMapper = function(node) {
        if (node.isDirectory) {
            return node.name;
        } else {
            return node.conceptName + ' (' + node.latestArchetypeVersion + ')';
        }
    };

    $scope.$watch('archetypeListFilter', function(newValue) {
        if (newValue != undefined) {
            $scope.treeControl.search(newValue);
        }
    });
    
	$scope.collapseAll = function() {
		$scope.treeControl.collapseAll();
	};
	$scope.expandAll = function() {
		$scope.treeControl.expandAll();
	}; 

	/**
	 * load archetype list from server, run immediately
	 */
	$scope.loadArchetypeList = function() {
		var busyId = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(ARCHETYPE_LIST_EDIT_DRAFT_URL).then(function(list) {
			$scope.draftArchetypeList = list;
			formatArchetypeSpecialiseRelation(list);
			$scope.draftLoadOver = true;
			generateTreeData();
			busyService.popBusy(busyId);
		});
		var busyId = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(ARCHETYPE_LIST_EDIT_PUBLISHED_URL).then(function(list) {
			$scope.publishedArchetypeList = list;
			formatArchetypeSpecialiseRelation(list);
			$scope.publishedLoadOver = true;
			console.log(list);
			generateTreeData();
			busyService.popBusy(busyId);
		});

	}; 
	$scope.loadArchetypeList();


	/**
	 *  Concat draft and published archetype list,
	 *  use formatTreeData service generate a foramted tree data which can be used as tree view data,
	 *  if archetype name need located is not null ,locate this archetype.
	 */
	function generateTreeData() {
		if ($scope.draftLoadOver && $scope.publishedLoadOver) {
			$scope.draftLoadOver = false;
			$scope.publishedLoadOver = false;
			var list = $scope.draftArchetypeList.concat($scope.publishedArchetypeList);
			$scope.originalArchetypeList = list;

			$scope.formatedObject = treeDataFormatService.formatTreeData(list, 'specialiseArchetype');

			$scope.archetypeList = $scope.formatedObject.formatedList;

			var name = $scope.needLoactedArchetypeName;
			if (name) {
				/* after tree view digest */
				$timeout(function() {
					$scope.locateArchetype(findArchetypeByName($scope.originalArchetypeList, name));
					$scope.needLoactedArchetypeName = undefined;
				}, 0);
			}
		}
	}


	/**
	 * Find a archetype from a archetype list
	 * @param {array} list Archetype list
	 * @param {string} name Archetype id
	 * @return {object | undefined} A archetype object with archetype id equals to name or undefined if find failure
	 */
	function findArchetypeByName(list, name) {
		var matchArchetype;
		if (list && name) {
			if (angular.isArray(list)) {
				return list.find(function(element) {
					return element.name == name;
				});
			}
			return list.name == name ? list : undefined;
		}
	}

	/**
	 * Change null|undefined specialize archetype to a null array []
	 * @param {array | object} list An archetype list
	 */
	function formatArchetypeSpecialiseRelation(list) {
		if (angular.isArray(list)) {
			angular.forEach(list, function(archetype) {
				if ((!archetype.specialiseArchetype) || (!archetype.specialiseArchetype.adl)) {
					archetype.specialiseArchetype = [];
				}
			});
		} else {
			var archetype = list;
			if ((!archetype.specialiseArchetype) || (!archetype.specialiseArchetype.adl)) {
				archetype.specialiseArchetype = [];
			}
		}
	}

    /**
     * local api for refreshFormatList in foramtTreeData service
     * @param {array} list An archetype list
     */
    function refreshArchetypeList(list) {
        $scope.formatedArchetypeList.refreshFormatList(list);
    }

    /**
     * local api for locateNode in tree view directive, find and hightlight the archetype node in archetype tree
     * @param {object} arc An archetype node object in archetype tree 
     */
    $scope.locateArchetype = function(arc) {
        $scope.treeControl.locateNode(arc);
    };


	/**
	 *  shorten the archetype name appropriatly
	 * @param {string} title Archetype name string
	 * @param {length} length Max archetype name length
	 * @return {string} return title if title length is lower than length, or return a shorten one with '...' inside
	 *
	 */
	$scope.getFixedTitle = function(title, length) {
		if (title) {
			var titleLength = length || 40;
			if (title.length > titleLength) {
				return title.substring(0, titleLength / 2) + '...' + title.substring(title.length - titleLength / 2, title.length);
			} else
				return title;
		}
	};

	/**
	 * callback function for click tree view node, select node if the selected archetype is undefined,
	 * or check original adl and current adl, if there is difference between them, alert a save ask dialog, or select node
	 * @param {object} node archetype node in tree view
	 */
	$scope.selectArchetype = function(node) {
		if ($scope.selectedArchetype) {
			if (originalEqualToEdited()) {
				selectArchetype(node);
			} else {
				alertSaveAskDialog(node);
			}
		} else {
			selectArchetype(node);
		}
	};

	/**
	 * check the if original adl equals to the adl after edit
	 * @return true if equal, or false
	 */
	function originalEqualToEdited() {
		var currentSmAdl = trim(archetypeSerializeService.serializeArchetype($scope.oriArchetype));
	//	console.log(currentSmAdl);

		var originalSmAdl = trim($scope.selectedArchetype.adl);
		//console.log(originalSmAdl);
		return currentSmAdl == originalSmAdl;
	}

	/**
	 * alert a dialog to ask if the user want to save change on adl
	 * @param {object} node archetype node in tree view
	 */
	function alertSaveAskDialog(node) {
		msgboxService.createMessageBox("OPERATE_PROMPT_HINT", "ARCHETYPE_EDIT_SAVEASK_HINT", {
			archetypeName : node.name
		}, "question", "yesOrNo").result.then(function(confirm) {
			if (confirm) {
				var bid = busyService.pushBusy('BUSY_LOADING');
				saveSelectedArchetype().then(function(result) {
					busyService.popBusy(bid);
					processSaveResult(result);
					selectArchetype(node);
				});
			}
		}, function() {
			selectArchetype(node);
		});

	}

	/**
	 * trim the string, delete the  Newline character and Tabs and whitespace
	 * @param {String} str The string need to be trimed
	 */
	function trim(str) {
		return str.replace(/[\r\n]/g, '').replace(/\s+/g, '');
	}

	/**
	 * Callback function for click archetype node in archetype tree,
	 * do nothing if node is a directory, or:
	 * collapse definition tree, assign archetype to selectedArchetype, save original adl for generating difference
	 * initialize originial Archetype and result json, the result json is used to display especially in definition pane
	 * and original archetype is the target of the editor, all change should apply to original archetype and it will
	 * be serialized to adl when a save operate is executed.
	 */
	var selectArchetype = function(archetype) {
		$scope.batchStatus = false;
		if (archetype.isDirectory) {
			$scope.selectedArchetype = undefined;
			return;
		} else {
			/* @For test */
			console.log('this is the selected archetype');
			console.log(archetype);

			/* collapse deifnition tree when select a new archetype */
			$scope.definitionExpandedAll.value = false;

			$scope.selectedArchetype = archetype;
            
            console.log(archetype.xml);
			resourceService.get(ARCHETYPE_BY_NAME_URL + archetype.name + '/adl').then(function(result) {
				if (result) {
					$scope.selectedArchetype.adl = result.adl;
				} else {
					alert("can not get adl!");
				}
			});
           	var bid = busyService.pushBusy('BUSY_LOADING');
			resourceService.get(ARCHETYPE_BY_NAME_URL + archetype.name + '/xml').then(function(result) {
				if (result) {			
					
					$scope.selectedArchetype.xml = result.xml;
					busyService.popBusy(bid);
					var busyId = busyService.pushBusy('BUSY_LOADING');
					$q(function(resolve, reject) {
						setTimeout(function() {
							var oriArchetype = archetypeParseEditService.getOriginalArchetype($scope.selectedArchetype.xml);
							var resultJson = archetypeParseEditService.parseArchetypeJson(oriArchetype);
							if (oriArchetype && resultJson) {
								resolve({
									oriArchetype : oriArchetype,
									resultJson : resultJson,
								});
							} else {
								reject("Something went wrong when parse archetype!");
							}
						}, 0);
					}).then(function(data) {
						var oriArchetype = data.oriArchetype;
						var resultJson = data.resultJson;

						console.log('this is archetype object after parse (form xml to json)');
						console.log(oriArchetype);
						console.log('this is archetype object after parse to edit (form json to json)');
						console.log(resultJson);

						$scope.oriArchetype = oriArchetype;

						/*  initial every parts */
						$scope.ontology = resultJson.terminologies;
						$scope.definition = resultJson.definitions;
						$scope.languages = resultJson.languages;

						var languages = $scope.languages.languages;
						if (angular.isArray(languages)) {
							$scope.languages.originalLanguage = languages.find(function(value) {
								return value.code == $scope.languages.originalLanguage.code;
							});
						}
						$scope.currentLanguage = $scope.languages.originalLanguage;

						/* get the header from the original archetype directly */
						$scope.header = initializeHeader(oriArchetype);

						busyService.popBusy(busyId);
					}, function(reason) {
						alert("Parse archetype failed :" + reason);
					});

				}
			});
		}

	};


	/**
	 * initialize header information use original archetype.
	 */
	function initializeHeader(oriArchetype) {
		var header = {};
		header.archetype_id = oriArchetype.archetype_id;
		header.concept = oriArchetype.concept;
		header.description = oriArchetype.description;
		header.original_language = oriArchetype.original_language;
		header.translations = oriArchetype.translations;
		header.ontology = oriArchetype.ontology;
		return header;
	}

	/**
	 * callback function for display tab clicked, serialize the original archetype to adl and xml to display the edit result
	 */
	$scope.refreshAdlAndXml = function() {
		var bid = busyService.pushBusy("BUSY_LOADING");
		$q(function(resolve, reject) {
			setTimeout(function() {
				var adl = archetypeSerializeService.serializeArchetype($scope.oriArchetype);
				var xml = archetypeSerializeService.serializeArchetypeToXml($scope.oriArchetype);
				if (adl) {
					resolve({
						adl : adl,
						xml : xml,
					});
				} else {
					resolve("Error : something went wrong when parse the original archetype to adl and xml!");
				}
			}, 0);

		}).then(function(result) {
			$scope.selectedArchetype.adl = result.adl;
			$scope.selectedArchetype.xml = completeXml(result.xml);
			busyService.popBusy(bid);
		}, function(error) {
			alert(error);
		});

	};

	$scope.createNewVersionArchetype = function() {
		createNewVersionArchetype($scope.selectedArchetype);
	};

	$scope.createNewRevisionArchetype = function() {
		createNewRevisionArchetype($scope.selectedArchetype);
	};

	/**
	 * parse xml to json object and process its archetypeId to a new reivision one (eg. v1.1 to v1.2)
	 * push the result json to archetype list, the pushToArchetypeList will process the remaining work
	 * @param {object} archetype The selected archetype which will be process and generate a new one
	 */
	function createNewRevisionArchetype(archetype) {
		var jsonArchetype = archetypeParseEditService.getOriginalArchetype(archetype.xml);
		var archetypeId = jsonArchetype.archetype_id.value;
		var frontString = archetypeId.slice(0, archetypeId.lastIndexOf('v1') + 3);
		var lastString = archetypeId.slice(archetypeId.lastIndexOf('v1') + 3, archetypeId.length);
		var newVersion = parseInt(lastString) + 1;
		jsonArchetype.archetype_id.value = upsizingRevision(jsonArchetype.archetype_id.value);
		pushToArchetypeList(jsonArchetype);
	}

	/**
	 * upsize the revision.
	 * get revision string and parse it to Int, upsize the result and add it to body string
	 * @param {string} archetypeId
	 */
	function upsizingRevision(archetypeId) {
		//  e.g. "openEhr-aaaa-bbb.v3.5"

		//  this match get 'v3.5'
		var matchInfo = archetypeId.match(/v\d*\.\d*/);
		//get index of '.'
		var dotIndex = matchInfo[0].indexOf('.') + matchInfo.index;
		//get body string expect form  revision string
		var bodyString = archetypeId.slice(0, dotIndex + 1);
		//  get revision string
		var revisionString = archetypeId.slice(dotIndex + 1, archetypeId.length);
		var newRevision = parseInt(revisionString) + 1;

		return bodyString + newRevision;
	}

	/**
	 *upsize the version.
	 * get version string and parse it to Int, replace the number in original string.
	 * @param {object}  archetypeId
	 */
	function upsizingVersion(archetypeId) {
		//  e.g. "openEhr-aaaa-bbb.v3.5"

		//  this match get 'v3.5'
		var matchInfo = archetypeId.match(/v\d*\.\d*/);
		//  this match get 'v3'
		var versionMatchInfo = matchInfo[0].match(/v\d*/);
		//  get '3' and parse to int
		var version = parseInt(versionMatchInfo[0].slice(1, versionMatchInfo[0].length));

		var nextVersion = version + 1;
		var nextVersionString = 'v' + nextVersion;
		// replace 'v3' with 'v4' and return
		return archetypeId.replace(/v\d*/, nextVersionString);
	}

	/**
	 *push a element to an array, if array is not an array, create a new one, and push the array and node into it.
	 * @param {object} node Any type element
	 * @param {object} array May be an array or an Obejct
	 * @return the array after push
	 */
	function pushTo(node, array) {
		if (array) {
			if (isArray(array)) {
				array.push(node);
			} else {
				var temp = array;
				array = [temp];
				array.push(node);
			}
		} else {
			array = [node];
		}
		return array;
	}



    //-------------create action ---------------------
    function createAction(info) {
        var jsonAction = createBaseArchetype(info);
        pushToArchetypeList(jsonAction, info);
    }

    //-----------create instruction-------------------
    function createInstruction(info) {
        var jsonInstruction = createBaseArchetype(info);
        //add default element here
        addActivityToInstruction(jsonInstruction);
        pushToArchetypeList(jsonInstruction, info);
    }

    function addActivityToInstruction(instruction) {
        var ItemTree = editor.getCComplexObject(undefined, "at0002", editor.getDefaultOccurrences(1, 1), "ITEM_TREE");
        var description = editor.getCSingleAttribute(ItemTree, editor.getDefaultExistence(1, 1), "description");
        var activityObject = editor.getCComplexObject(description, "at0001", editor.getDefaultOccurrences(0, 1), "ACTIVITY");
        var activitiesAttribute = editor.getCMultipleAttribute(activityObject, editor.getDefaultCardinality(0), editor.getDefaultExistence(1, 1), "activities");

        instruction.definition.attributes = pushTo(activitiesAttribute, instruction.definition.attributes);

        editor.synchronizeOriOntology("at0002", "Tree", "@internal@", instruction.ontology);
        editor.synchronizeOriOntology("at0001", "Current Activity", "Current Activity", instruction.ontology);
    }

    //------------create observation-------------------
    function createObservation(info) {
        var jsonObservation = createBaseArchetype(info);
        //add default element here
        addDataToObservation(jsonObservation);
        pushToArchetypeList(jsonObservation, info);
    }

    function getEvent() {
        var ItemTree = editor.getCComplexObject(undefined, "at0003", editor.getDefaultOccurrences(1, 1), "ITEM_TREE");
        var dataAttribute = editor.getCSingleAttribute(ItemTree, editor.getDefaultExistence(1, 1), "data");
        var eventObject = editor.getCComplexObject(dataAttribute, "at0002", editor.getDefaultOccurrences(0, 1), "EVENT");
        return eventObject;
    }

    function addDataToObservation(observation) {
        var eventObject = getEvent();
        var eventsAttribute = editor.getCMultipleAttribute(eventObject, editor.getDefaultCardinality(1), editor.getDefaultExistence(1, 1), "events");
        var historyObject = editor.getCComplexObject(eventsAttribute, "at0001", editor.getDefaultOccurrences(1, 1), "HISTORY");
        var dataAttribute = editor.getCSingleAttribute(historyObject, editor.getDefaultExistence(1, 1), "data");
        //observation.definition.attributes.push(dataAttribute);
        observation.definition.attributes = pushTo(dataAttribute, observation.definition.attributes);
        editor.synchronizeOriOntology("at0001", "Event Series", "@ internal @", observation.ontology);
        editor.synchronizeOriOntology("at0002", "Any event", "*", observation.ontology);
        editor.synchronizeOriOntology("at0003", "Tree", "@ internal @", observation.ontology);
    }
    //end

    //--------------create evaluation----------------------
    function createEvaluation(info) {
        var jsonEvaluation = createBaseArchetype(info);
        //add default element here
        var itemTree = editor.getCComplexObject(undefined, "at0001", editor.getDefaultOccurrences(1, 1), "ITEM_TREE");
        editor.synchronizeOriOntology("at0001", "Tree", "@ internal @", jsonEvaluation.ontology);
        var dataAttribute = editor.getCSingleAttribute(itemTree, editor.getDefaultExistence(1, 1), "data");
        //jsonEvaluation.definition.attributes.push(dataAttribute);
        jsonEvaluation.definition.attributes = pushTo(dataAttribute, jsonEvaluation.definition.attributes);
        pushToArchetypeList(jsonEvaluation, info);
    }

    //----------create admin_entry------------------------
    function createAdminEntry(info) {
        var jsonAdminEntry = createBaseArchetype(info);
        //add default element here
        var ItemTree = editor.getCComplexObject(undefined, "at0001", editor.getDefaultOccurrences(1, 1), "ITEM_TREE");
        var dataAttribut = editor.getCSingleAttribute(ItemTree, editor.getDefaultExistence(1, 1), "data");
        //jsonAdminEntry.definition.attributes.push(dataAttribut);
        jsonAdminEntry.definition.attributes = pushTo(dataAttribut, jsonAdminEntry.definition.attributes);
        //synchronize the ontology
        editor.synchronizeOriOntology("at0001", "Tree", "@ internal @", jsonAdminEntry.ontology);
        pushToArchetypeList(jsonAdminEntry, info);
    }

    //---------create section---------------------------
    function createSection(info) {
        var jsonSection = createBaseArchetype(info);
        //editor.synchronizeOriOntology("at0001","Tree","@ internal @",jsonAdminEntry.ontology);
        pushToArchetypeList(jsonSection, info);
    }

    //---------create conposition-----------------------
    function createComposition(info) {
        var jsonCompositon = createBaseArchetype(info);
        var codePhrase = editor.getCCodePhraseWithPara("openehr", ['433'], undefined);
        var definingCode = editor.getCSingleAttribute(codePhrase, editor.getDefaultExistence(1, 1), "defining_code");
        var codeText = editor.getCComplexObject(definingCode, undefined, editor.getDefaultOccurrences(1, 1), "DV_CODED_TEXT");
        var category = editor.getCSingleAttribute(codeText, editor.getDefaultExistence(1, 1), "category");

        //jsonCompositon.definition.attributes.push(category);
        jsonCompositon.definition.attributes = pushTo(category, jsonCompositon.definition.attributes);

        pushToArchetypeList(jsonCompositon, info);
    }

    //-----create item tree---------------
    function createItemTree(info) {
        var jsonItemTree = createBaseArchetype(info);
        pushToArchetypeList(jsonItemTree, info);
    }

    //------create item list-----
    function createItemList(info) {
        var jsonItemList = createBaseArchetype(info);
        pushToArchetypeList(jsonItemList, info);
    }

    //----create item single----------
    function createItemSingle(info) {
        var jsonItemSingle = createBaseArchetype(info);
        pushToArchetypeList(jsonItemSingle, info);
    }

    //-----create item table--------
    function createItemTable(info) { //not absolutely right
        var jsonItemTable = createBaseArchetype(info);

        var rotated = editor.getCSingleAttribute([], editor.getDefaultExistence(1, 1), "rotated");
        var cluster = editor.getCComplexObject([], "at0002", editor.getDefaultOccurrences(0, 1), "CLUSTER");
        var rows = editor.getCMultipleAttribute(cluster, editor.getDefaultCardinality(1), editor.getDefaultExistence(1, 1), "rows");

        //jsonItemTable.definition.attributes.push(rows);
        jsonItemTable.definition.attributes = pushTo(rows, jsonItemTable.definition.attributes);
        jsonItemTable.definition.attributes.push(rotated);

        editor.synchronizeOriOntology("at0002", "row", "@interval@", jsonItemTable.ontology);
        editor.synchronizeOriOntology("at0001", "Table", "@interval@", jsonItemTable.ontology);
        pushToArchetypeList(jsonItemTable, info);
    }

    function createCluster(info) {
        var jsonCluster = createBaseArchetype(info);
        pushToArchetypeList(jsonCluster, info);
    }

    function createElement(info) {
        var jsonElement = createBaseArchetype(info);
        pushToArchetypeList(jsonElement, info);
    }

    //-----archetype create auxiliary function---------------

    function createBaseArchetype(info) {
        var archetypeId = getArchetypeId(info);
        info.archetypeId = archetypeId;
        var jsonObj = {
            adl_version: "1.4",
            archetype_id: {
                value: archetypeId
            },
            concept: "at0000",
            definition: {
                attributes: undefined,
                node_id: "at0000",
                occurrences: editor.getDefaultOccurrences(0, 1),
                rm_type_name: info.entityType,
            },
            description: getDefaultDescription(),
            ontology: getDefaultOntology(info),
            original_language: getLanguage("en", "ISO_639-1"),
        };
        return jsonObj;
    }


    function pushToArchetypeList(jsonObj) {
        var adl = archetypeSerializeService.serializeArchetype(jsonObj);
        var bid = busyService.pushBusy('BUSY_LOADING');
        console.log(adl);
        resourceService.post(ARCHETYPE_CREATE_BY_URL, {
            adl: adl,
        }).then(function(result) {
            busyService.popBusy(bid);
            if (result.succeeded) {
                $scope.needLoactedArchetypeName = jsonObj.archetype_id.value;
                $scope.loadArchetypeList();
                msgboxService.createMessageBox('ARCHETYPE_EDIT_SUCCEEDED', 'ARCHETYPE_EDIT_ADD_SUCCEEDED_HINT', {}, 'success');
            } else {
                msgboxService.createMessageBox('ARCHETYPE_EDIT_FAILED', 'ARCHETYPE_EDIT_ADD_FAILED_HINT', {
                    errorMsg: result.message
                }, "error");
            }

        });
    }





    function getArchetypeId(info) {
        return info.organization + "-" + info.referenceModel + '-' + info.entityType + "." + info.concept + ".v1.1";
    }

    function getLanguage(codeString, terminologyId) {
        return {
            code_string: codeString,
            terminology_id: {
                value: terminologyId,
            },
        };
    }

    function getDefaultDescription() {
        return {
            original_author: {
                _id: "name"
            },
            lifecycle_state: "0",
            details: {
                copyright: "",
                missue: "",
                purpose: "",
                use: "",
                language: getLanguage("en", "ISO_639-1"),
            },

            other_details: {
                _id: "",
                __text: "",
            }
        };
    }

    function getDefaultOntology(info) {
        return {
            term_definitions: [{
                _language: "en",
                items: [{
                    _code: "at0000",
                    items: [{
                        _id: "text",
                        __text: info.concept,
                    }, {
                        _id: "description",
                        __text: "*"
                    }]
                }, ]
            }]
        };
    }

    //-----------------auxiliary function end---------------------------
    // $scope.organizations =["openEHR","ZJU"];
    $scope.organizations = ["openEHR"];
    $scope.referenceModels = ['EHR', 'DEMOGRAPHIC'];
    //  $scope.referenceModels = ['EHR'];
    var ehrEntity = ["OBSERVATION", "EVALUATION", "INSTRUCTION", "COMPOSITION", "ADMIN_ENTRY", "ACTION", "ELEMENT", "ITEM_LIST",
        "ITEM_SINGLE", "ITEM_TREE", "ITEM_TABLE", "CLUSTER", "SECTION"
    ];
    var demograEntity = ['ADDRESS', 'AGENT', 'CAPABILITY', 'CLUSTER', 'CONTACT', 'ELEMENT', 'GROUP',
        'ITEM_LIST', 'ITEM_SINGLE', 'ITEM_TABLE', 'ITEM_TREE', 'ORGANISATION', 'PARTY_IDENTIFIED', 'PARTY_RELATIONSHIP', 'PERSON', 'ROLE'
    ];


    $scope.entityMap = {
        EHR: ehrEntity,
        DEMOGRAPHIC: demograEntity,
    };

    // archetype create modal-----------------
    $scope.openCreate = function() {
        var modalInstance = $modal.open({
            animation: true, //animations on
            templateUrl: 'archetypeCreate.html',
            controller: function ArchetypeCreateCtrl($scope, $modalInstance, organizations, referenceModels, entityMap) {
                $scope.organizations = organizations;
                $scope.referenceModels = referenceModels;
                $scope.entityMap = entityMap;
                $scope.organization = "";
                $scope.referenceModel = "";
                $scope.entityType = "";

                $scope.concept = "";
                $scope.$watch('referenceModel', function(newValue) {
                    if (newValue) {
                        $scope.entityTypes = $scope.entityMap[newValue];
                    }
                });

                $scope.ok = function() {
                    $modalInstance.close({
                        organization: $scope.organization,
                        referenceModel: $scope.referenceModel,
                        entityType: $scope.entityType,
                        concept: $scope.concept,
                    });
                };
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            },
            size: 'lg',
            resolve: {
                organizations: function() {
                    return $scope.organizations;
                },
                referenceModels: function() {
                    return $scope.referenceModels;
                },
                entityMap: function() {
                    return $scope.entityMap;
                }
            }
        });
        modalInstance.result.then(function(message) { // modal message back
            // $scope.newArchetypeBaseInfo = message;
            message.concept = message.concept.replace(/\s+/g, "_");
            if (message.referenceModel == 'EHR') {
                createEhrArchetype(message);
            } else if (message.referenceModel == 'DEMOGRAPHIC') {
                createDemogrArchetype(message);
            }
        });
    };

    function createEhrArchetype(info) {
        if (info) {
            switch (info.entityType) {
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

    function createDemogrArchetype(info) {
        pushToArchetypeList(editor.createArchetype(info), info);
    }

    function createCluster(info) {
        var jsonCluster = createBaseArchetype(info);
        pushToArchetypeList(jsonCluster, info);
    }


    function createPerson(info) {
        var jsonPerson = createBaseArchetype(info);
        pushToArchetypeList(jsonPerson, info);
    }
    $scope.specialiseArchetype = function() {
        $scope.specialisedArchetype = $scope.selectedArchetype;
        $scope.openSpecialise('lg');
    };
    //--------specialise logic---------------

    var specialiseArchetype = function(value, conceptName) {
        var name = value.name;
        var length = name.length;
        var fontString = name.slice(0, name.indexOf('.') + 1);
        var tempString = name.slice(name.indexOf('.') + 1, length);
        var midString = tempString.slice(1, tempString.indexOf('.'));
        var lastString = tempString.slice(tempString.indexOf('.'), tempString.length);
        var result = fontString + midString + "-" + conceptName + lastString;
        //new implementation needed
    };


    $scope.openSpecialise = function(size) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'archetypeSpecialise.html',
            controller: function ArchetypeSpecialiseCtrl($scope, $modalInstance, specialisingArchetypeName) {
                $scope.archetypeName = specialisingArchetypeName;
                $scope.newConceptName = '';
                $scope.ok = function() {
                    $modalInstance.close({
                        newConceptName: $scope.newConceptName,
                    });
                };
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            },
            size: size,
            resolve: {
                specialisingArchetypeName: function() {
                    return $scope.specialisingArchetypeName;
                }
            }
        });
        modalInstance.result.then(function(message) {
            specialiseArchetype($scope.specialisedArchetype, message.newConceptName);
            $scope.locateArchetype($scope.specialisingArchetype);

        });

    };

    /*
     * function open the difference modal, check the difference between edited archetype and original archetype
     */
    $scope.generateDiff = function() {
        var editedArchetype = archetypeSerializeService.serializeArchetype($scope.oriArchetype);
        documentDiffModalService.open('Modify records', editedArchetype, $scope.selectedArchetype.adl);
    };


    $scope.batchStatus = false;
    $scope.batchSubmit = function() {
        $scope.batchStatus = !$scope.batchStatus;
        $scope.selectedArchetype = undefined;
    };


    $scope.submitSelectedArchetype = function() {
        var bid = busyService.pushBusy('BUSY_LOADING');
        var archetype = archetypeSerializeService.serializeArchetype($scope.oriArchetype);
        resourceService.get(ARCHETYPE_SUBMIT_BY_ID_URL + $scope.selectedArchetype.id).then(function(result) {
            busyService.popBusy(bid);
            if (result.succeeded) {
                $scope.selectedArchetype.lifecycleState = 'Teamreview';
                $scope.selectedArchetype = undefined;
                msgboxService.createMessageBox('ARCHETYPE_EDIT_SUCCEEDED', 'ARCHETYPE_EDIT_SUBMIT_SUCCEEDED_HINT', {}, 'success');
            } else {
                msgboxService.createMessageBox('ARCHETYPE_EDIT_FAILED', 'ARCHETYPE_EDIT_SUBMIT_FAILED_HINT', {
                    errorMsg: result.message
                }, "error");
            }
        });
    };

	function saveSelectedArchetype() {
		var adl = archetypeSerializeService.serializeArchetype($scope.oriArchetype);
		$scope.selectedArchetype.adl = adl;
		console.log(adl);
		return resourceService.post(ARCHETYPE_EDIT_BY_ID_URL + $scope.selectedArchetype.id, {
			adl : adl,
		});
	}

	$scope.saveSelectedArchetype = function() {
		var bid = busyService.pushBusy('BUSY_LOADING');
		saveSelectedArchetype().then(function(result) {
			busyService.popBusy(bid);
			processSaveResult(result);
		});
	};

	function processSaveResult(result) {
		if (result.succeeded) {
			msgboxService.createMessageBox('ARCHETYPE_EDIT_SUCCEEDED', 'ARCHETYPE_EDIT_SAVE_SUCCEEDED_HINT', {}, 'success');
		} else {
			msgboxService.createMessageBox('ARCHETYPE_EDIT_FAILED', 'ARCHETYPE_EDIT_SAVE_FAILED_HINT', {
				errorMsg : result.message
			}, "error");
		}
	}


    $scope.fallbackArchetype = function() {
        var bid = busyService.pushBusy('BUSY_LOADING');
        resourceService.get(AECHETYPE_FALLBACK_BY_ID_URL + $scope.selectedArchetype.id).then(function(result) {
            busyService.popBusy(bid);
            if (result.succeeded) {
                msgboxService.createMessageBox('ARCHETYPE_EDIT_SUCCEEDED', 'ARCHETYPE_FALLBACK_SUCCEEDE_HINT', {}, 'success');
                $scope.selectedArchetype.lifecycleState = "Teamreview";
            } else {
                msgboxService.createMessageBox('ARCHETYPE_EDIT_FAILED', 'ARCHETYPE_FALLBACK_FAILED_HINT', {
                    errorMsg: result.message
                }, "error");
            }
        });
    };





    var ArchetypeLifecycleStateFilter = function(lifecycleState) {
        if (lifecycleState == "All") {
            return true;
        }
        if (lifecycleState == "Any") {
            return $scope.selectedArchetype ? true : false;

        }
        if ($scope.selectedArchetype) {
            return $scope.selectedArchetype.lifecycleState == lifecycleState;
        } else {
            return false;
        }
    };
    $scope.toolMenus = [
        //create
        {
            access: 'ROLE_ARCHETYPE_CREATE',
            ifLifecycleState: 'All',
            ngIf: ArchetypeLifecycleStateFilter,
            clickCallback: $scope.openCreate,
            tooltip: 'MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_CREATE_ARCHETYPE',
            name: 'ARCHETYPE_EDIT_CREATE',

        },
        //save
        {
            access: 'ROLE_ARCHETYPE_SAVE',
            ifLifecycleState: 'Draft',
            ngIf: ArchetypeLifecycleStateFilter,
            clickCallback: $scope.saveSelectedArchetype,
            tooltip: 'MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_SAVE_ARCHETYPE',
            name: 'ARCHETYPE_EDIT_SAVE',
        },
        //submit
        {
            access: 'ROLE_ARCHETYPE_SUBMIT',
            ifLifecycleState: 'Draft',
            ngIf: ArchetypeLifecycleStateFilter,
            clickCallback: $scope.submitSelectedArchetype,
            tooltip: 'MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_SUBMIT_ARCHETYPE',
            name: 'ARCHETYPE_EDIT_SUBMIT',
        },
        //generate diff
        {
            access: 'PERMIT_ALL',
            ifLifecycleState: 'Draft',
            ngIf: ArchetypeLifecycleStateFilter,
            clickCallback: $scope.generateDiff,
            tooltip: 'MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_CONTRAST_ADL',
            name: 'ARCHETYPE_EDIT_DIFF',
        },
        //createNewRevisionArchetype
        {
            access: 'ROLE_TEMPLATE_NEW_REVISION',
            ifLifecycleState: 'Published',
            ngIf: ArchetypeLifecycleStateFilter,
            clickCallback: $scope.createNewRevisionArchetype,
            tooltip: 'MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_NEW_VERSION',
            name: 'ARCHETYPE_EDIT_NEWVERSION',
        },
        //specialize
        {
            access: 'ROLE_ARCHETYPE_SPECIALIZE',
            ifLifecycleState: 'Any',
            ngIf: ArchetypeLifecycleStateFilter,
            clickCallback: $scope.specialiseArchetype,
            tooltip: 'MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_SPECIALISE_THIS_ARCHETYPE',
            name: 'ARCHETYPE_EDIT_SPECIALISE',
        },
        //batch submit
        {
            access: 'ROLE_ARCHETYPE_BATCH_SUBMIT',
            ifLifecycleState: 'All',
            ngIf: ArchetypeLifecycleStateFilter,
            clickCallback: $scope.batchSubmit,
            tooltip: 'MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_BATCHPROCESS',
            name: 'ARCHETYPE_EDIT_BATCHSUBMIT',
        },
        //fallback
        {
            access: 'ROLE_ARCHETYPE_CREATE',
            ifLifecycleState: 'Published',
            ngIf: ArchetypeLifecycleStateFilter,
            clickCallback: $scope.fallbackArchetype,
            tooltip: 'MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_FALLBACK',
            name: 'ARCHETYPE_EDIT_FALLBACK',
        },
    ];


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

    function completeXml(xml) {
        return '<?xml version="1.0" encoding="UTF-8"?>' + '\n' + '<archetype xmlns="http://schemas.openehr.org/v1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' + '\n' + formatXml(xml) + '</archetype>';
    }
};
