function StorageTemplateEditCtrl($scope, $modal, $stateParams, $timeout, treeDataFormatService, resourceService, busyService, msgboxService, treeDataFormatService, templateCreateService, templateParseToEditService, archetypeParseService, documentDiffModalService, STORAGE_TEMPLATE_LIST_EDIT_DRAFT_URL, STORAGE_TEMPLATE_LIST_EDIT_PUBLISHED_URL, STORAGE_TEMPLATE_SUBMIT_BY_ID_URL, STORAGE_TEMPLATE_EDIT_BY_ID_URL, ARCHETYPE_LIST_REFERENCE_URL, STORAGE_TEMPLATE_BY_ID_URL, STORAGE_TEMPLATE_CREATE_URL) {

	$scope.treeControl = {};
//	$scope.arcTreeControl = {};
	$scope.templateFiles = {
		draft : [],
		published : []
	};
	$scope.tabControl = {};
    $scope.arcTreeControl= {
    	value : {},
    };
	$scope.locateTemplate = function(tem) {
		$scope.treeControl.locateNode(tem);
	};

	$scope.isTemplateListHidden = false;

	$scope.initData = function() {
		var busyDraft = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(STORAGE_TEMPLATE_LIST_EDIT_DRAFT_URL).then(function(list) {
			$scope.templateFiles.draft = list;
			$scope.templateFiles.draftReady = true;
			generateTreeData();
			busyService.popBusy(busyDraft);
		});

		var busyPublished = busyService.pushBusy('BUSY_LOADING');
		resourceService.get(STORAGE_TEMPLATE_LIST_EDIT_PUBLISHED_URL).then(function(list) {
			$scope.templateFiles.published = list;
			$scope.templateFiles.publishedReady = true;
			generateTreeData();
			busyService.popBusy(busyPublished);
		});
	};

	function generateTreeData() {
		if ($scope.templateFiles.draftReady && $scope.templateFiles.publishedReady) {
			$scope.templateFiles.draftReady = false;
			$scope.templateFiles.publishedReady = false;
			var list = $scope.templateFiles.draft.concat($scope.templateFiles.published);
			$scope.originalTemplateList = list;
			$scope.formatedObject = treeDataFormatService.formatTreeData(list, 'children');
			$scope.templateList = $scope.formatedObject.formatedList;
			//console.log($scope.templateList);
			if ($scope.needLocatedObjectName) {

				$timeout(function() {
					$scope.locateTemplate(findTemplateByName($scope.needLocatedObjectName));
					$scope.needLocatedObjectName = undefined;
				}, 0);
			}
		}

	}


	$scope.initData();

	var busyId = busyService.pushBusy('BUSY_LOADING');
	$scope.archetypeList = [];
	resourceService.get(ARCHETYPE_LIST_REFERENCE_URL).then(function(list) {
		angular.forEach(list, function(value) {
			if (value) {
				$scope.archetypeList.push(value);
			}
		});
		busyService.popBusy(busyId);
	});

	$scope.searchKeyMapper = function(node) {
		if (node.isDirectory) {
			return node.name;
		} else {
			return node.conceptName + ' (' + node.version + ')';
		}
	};

	$scope.$watch('templateListFilter', function(newValue) {
		if (newValue != undefined) {
			$scope.treeControl.search(newValue);
		}

	});

	$scope.getFixedTitle = function(title, length) {
		if (title) {
			var titleLength = length || 40;
			if (title.length > titleLength) {
				return title.substring(0, titleLength / 2) + '...' + title.substring(title.length - titleLength / 2, title.length);
			} else
				return title;
		}
	};

	var x2js = new X2JS({
		escapeMode : false,
		emptyNodeForm : 'object',
	});
	$scope.oetObj = {};

	$scope.isCollapse = true;
	
	$scope.isExpandedAll = {
		value: false,
	};


	$scope.$watch('isExpandedAll.value', function(newValue, oldValue) {
		if ($scope.arcTreeControl.value.expandAll) {
			if (newValue) {
				$scope.arcTreeControl.value.expandAll();
			} else {
				$scope.arcTreeControl.value.collapseAll();
			}
		}

	}); 


	
	

	$scope.selectTemplate = function(template) {
		var bid = busyService.pushBusy('BUSY_LOADING');
		console.log(template);
		//template.lifecycleState = true;
		if (!template.isDirectory) {
			//if (template.lifecycleState != 'Draft') {
           //     msgboxService.createMessageBox('STORAGE_TEMPLATE_FAILED', 'STORAGE_TEMPLATE_NEW_VERSION_INSTRUCTION', {}, 'error');
			//    $scope.selectedTemplate = undefined;
			//} else {
				$scope.selectedTemplate = template;
				$scope.selectedTemplate.oet = formatXml($scope.selectedTemplate.oet);
				//	try {
				$scope.oetObj = x2js.xml_str2json(template.oet);
				console.log($scope.oetObj);
				$scope.parsedTemplate = templateParseToEditService.parseTemplate($scope.oetObj.template);
				//} catch(ex) {
				//	console.log(ex);
				//}
				$scope.isExpandedAll.value = false;

			//}

		}
		busyService.popBusy(bid);
	}; 

	$scope.selectNode = function(node) {
		$scope.selectedNode = node;
		//var path;
		var path = constructNodePath(node);
		console.log(path);
		console.log("this is the node you just choose");
		console.log(node);
		$scope.path = path;
	};
    
    function constructNodePath(node){
    	var resultNode;
    	var parent = node.parent;
    	while(parent){
    		if(parent.label.archetypeNode){
    			resultNode = parent;
    			break;
    		}else{
    			parent = parent.parent;
    		}
    	}
  
		if (resultNode) {
			if (resultNode.parent) {
				var topPath = constructNodePath(resultNode.parent);
				var lowPath = node.path;
				var archetypeId = resultNode.label.path.slice(0, resultNode.label.path.lastIndexOf('v') + 2);
				var resultPath = topPath.slice(0, topPath.lastIndexOf(']')) + ' and archetype_id/value='+archetypeId + ']' + node.label.path;
				return resultPath;
			} else {
				return node.label.path;
			}

		} else {
			return '';
		}    	    	
    }
    
	$scope.generateOetDiff = function() {
		var xmlDocStr = x2js.json2xml_str($scope.oetObj);
		documentDiffModalService.open('Modify records', $scope.selectedTemplate.oet, formatXml(xmlDocStr));
	};

	$scope.getOet = function() {
		return formatXml(x2js.json2xml_str($scope.oetObj));
	};
	

	$scope.clickListNodeMenu = function(node, type) {
		//console.log(node);
		//console.log(type);
		switch(type) {
		case 'newVersion':
			createNewVersionTemplate(node);
			break;
		default :
			break;
		}
	}; 
 
	$scope.createNewVersionTemplate = function() {
		createNewVersionTemplate($scope.selectedTemplate);
	}; 

  
	function createNewVersionTemplate(node) {
		console.log(node);
		var template = {
			name : '',
			oet : '',
			arm : '',
		};
		var oetObj = x2js.xml_str2json(node.oet);
		var armObj = x2js.xml_str2json(node.arm);
		console.log(oetObj);
		console.log(armObj);
		var name = oetObj.template.name;
		var frontString = name.slice(0, name.lastIndexOf('v1') + 3);
		var lastString = name.slice(name.lastIndexOf('v1') + 3, name.length);
		var newVersion = parseInt(lastString) + 1;
		oetObj.template.name = frontString + newVersion;
		armObj['archetype-relationship-mapping'].template['_template-id'] = oetObj.template.name;
		template.oet = x2js.json2xml_str(oetObj);
		template.arm = x2js.json2xml_str(armObj);
		template.name = oetObj.template.name;

		$scope.createTemplateFile(template);
	}

 
	$scope.getTreeNodeLabel = function(node, aliasName) {
		var label = '';

		if (node.label.occurrences.upper != 0) {
			label += '<span class="clever-icon list ' + node.label.picType.toLowerCase() + '" style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<span class="node-label-max">';
		} else {
			label += '<span class="clever-icon list ' + node.label.picType.toLowerCase() + '" style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<span>';

		}

		if (node.label.text) {
			label += '<span style="color: brown;">' + node.label.text;
		}

		if (node.label.code) {
			if (node.label.archetypeNode) {
				label += '<span style="color: black;font-weight: bold;">';
			} else {
				label += '<span style="color: brown;">';
			}
			label += getOntologyByNode(node);
		}

		if (node.label.occurrences.upper != 0) {
			label += '<span>&nbsp&nbsp[' + node.label.occurrences.lower + '..' + node.label.occurrences.upper + ']</span>';
			if (node.label.occurrenceType == "*" && node.label.occurrences.upper == 1) {
				label += '<span>&nbsp&nbsp&nbsp<em>[0..*] to [0..1]</em></span>';
			}
		}
		label += '</span>' + '</span>';
		return label;
	};

	function getOntologyByNode(node) {
		var ontologies = node.referencedOntologies;
		var matchedOntology;
		var matchedTerms;
		if (ontologies) {
			for (var i = 0; i < ontologies.length; i++) {
				if (ontologies[i].language == 'en') {
					matchedTerms = ontologies[i].items;
					break;
				}
			}
			for (var i = 0; i < matchedTerms.length; i++) {
				if (matchedTerms[i].code == node.label.code) {
					matchedOntology = matchedTerms[i].text;
					break;
				}
			}
		}
		return matchedOntology;
	}


	$scope.getTreeNodeMenu = function(node, aliasName) {
		var menuHtml = '<ul class="dropdown-menu" role="menu" ng-if="' + aliasName + '.parent.label.occurrences.upper != 0">';
		if (node.label.archetypeNode) {
			if (node.parent) {
				menuHtml += '<li><a class="pointer" role="menuitem" tabindex="1" ng-click="operateNodeByContextMenu(' + aliasName + ', 3)">Delete archetype</a></li>';
			} else {
				menuHtml = '';
			}
		} else if (node.label.slot) {
			menuHtml += constructSlotMenu(node, aliasName);
		} else {
			if (node.label.occurrenceType) {
				if (node.label.occurrenceType == 1) {
					menuHtml += '<li><a class="pointer" role="menuitem" tabindex="1" ng-click="operateNodeByContextMenu(' + aliasName + ', 1, 0)">Zero Occurrence</a></li>' + '<li><a class="pointer" role="menuitem" tabindex="2" ng-click="operateNodeByContextMenu(' + aliasName + ', 1, 1)">Single Occurrence</a></li>';
				} else if (node.label.occurrenceType == '*') {
					menuHtml += '<li><a class="pointer" role="menuitem" tabindex="3" ng-click="operateNodeByContextMenu(' + aliasName + ', 1, 0)">Zero Occurrence</a></li>' + '<li><a class="pointer" role="menuitem" tabindex="4" ng-click="operateNodeByContextMenu(' + aliasName + ', 1, 1)">Single Occurrence</a></li>' + '<li><a class="pointer" role="menuitem" tabindex="5" ng-click="setNodeByContextMenu(' + aliasName + ', 1, \'*\')">Unlimited Occurrence</a></li>';
				}
			} else {
				menuHtml = '';
			}
		}

		if (menuHtml == '') {
			return menuHtml;
		} else {
			return menuHtml += '</ul>';
		}
	};
   
	function getRegExpsBySlotExpression(slotExpression) {
		var regExps = [];
		var expression;
		if (angular.isArray(slotExpression)) {
			angular.forEach(slotExpression, function(item) {
				expression = item.string_expression;
				expression = expression.substring(expression.indexOf('{/') + 2, expression.lastIndexOf('/}'));
				regExps.push(new RegExp(expression));
			});
		} else {
			expression = slotExpression.string_expression;
			expression = expression.substring(expression.indexOf('{/') + 2, expression.lastIndexOf('/}'));
			regExps.push(new RegExp(expression));
		}
		return regExps;
	}

	function constructSlotMenu(node, aliasName) {
		var slotMenu = '';
		var reg = /\{|\}/;
		var matchedArchetypes = [];
		if (node.label.includes) {
			var regExps = getRegExpsBySlotExpression(node.label.includes);
			angular.forEach($scope.archetypeList, function(value) {
				angular.forEach(regExps, function(item) {
					if (item.test(value.name)) {
						matchedArchetypes.push(value);
					}
				});
			});
		}
		if (node.label.excludes) {
			var regExps = getRegExpsBySlotExpression(node.label.excludes);
			if (matchedArchetypes.length > 0) {
				for (var i = 0; i < matchedArchetypes.length; i++) {
					angular.forEach(regExps, function(item) {
						if (item.test(matchedArchetypes[i]).name) {
							matchedArchetypes.splice(i, 1);
							i--;
						}
					});
				}
			} else {
				var isExclude;
				angular.forEach($scope.archetypeList, function(value) {
					isExclude = false;
					for (var i = 0; i < regExps.length; i++) {
						if (regExps[i].test(value.name)) {
							isExlude = true;
							break;
						}
					}
					if (!isExclude) {
						matchedArchetypes.push(value);
					}
				});
			}
		}
		if (matchedArchetypes.length > 0) {
			angular.forEach(matchedArchetypes, function(value, index) {
				slotMenu += '<li><a class="pointer" role="menuitem" tabindex="' + (index + 1) + '" ng-click="operateNodeByContextMenu(' + aliasName + ', 2, \'' + value.name + '\')">' + value.name + '</a></li>';
			});
		} else {
			slotMenu += '<li><a class="pointer" role="menuitem" tabindex="1" ng-click="">No archetypes match the slot constraint</a></li>';
		}
		return slotMenu;
	}


	$scope.setNodeByContextMenu = function(node, type, value) {
		switch (type) {
		case 1:
			setDefinitionPath(node, value);
			break;
		case 2:
			setDefinitionItemOnSlotArchetype(node, value);
			break;
		case 3:
			setDefinitionItemOnSlitArchetype(node, value);
			break;
		}
		$scope.selectedTemplate.oet = $scope.getOet();
	};

	function setNodeMax(nodeTree, value) {
		if (angular.isArray(nodeTree)) {
			angular.forEach(nodeTree, function(node) {
				if (value == '*' || value == 1) {
					node.label.occurrences.upper = node.label.occurrenceType;
				} else {
					node.label.occurrences.upper = value;
				}
				if (node.children && node.children.length > 0) {
					setNodeMax(node.children, value);
				}
			});
		} else {
			if (value == '*' || value == 1) {
				nodeTree.label.occurrences.upper = nodeTree.label.occurrenceType;
			} else {
				nodeTree.label.occurrences.upper = value;
			}
			if (nodeTree.children && nodeTree.children.length > 0) {
				setNodeMax(nodeTree.children, value);
			}
		}
	}

	function setDefinitionPath(node, value) {
		var rules = node.referencedArchetype.Rule;
		if (rules) {
			if (!angular.isArray(rules)) {
				var newRules = [];
				newRules.push(rules);
				rules = newRules;
			}
		} else {
			rules = [];
		}

		if (value == '*') {
			if (node.label.occurrences.upper == 1) {
				node.label.occurrences.upper = value;
				for (var i = 0; i < rules.length; i++) {
					if (node.label.path == rules[i]._path) {
						rules.splice(i, 1);
					}
				}
			} else if (node.label.occurrences.upper == 0) {
				setNodeMax(node, value);
				for (var i = 0; i < rules.length; i++) {
					if (rules[i]._path.indexOf(node.label.path) != -1) {
						rules.splice(i, 1);
						i--;
					}
				}
			}
		} else if (value == 1) {
			if (node.label.occurrences.upper == 0) {
				if (node.label.occurrenceType == 1) {
					setNodeMax(node, value);
					for (var i = 0; i < rules.length; i++) {
						if (rules[i]._path == node.label.path) {
							rules.splice(i, 1);
							break;
						}
					}
				} else if (node.label.occurrenceType == '*') {
					node.label.occurrences.upper = 1;
					setNodeMax(node.children, value);
					for (var i = 0; i < rules.length; i++) {
						if (rules[i]._path == node.label.path) {
							rules[i]._max = value;
							break;
						}
					}
				}
			} else if (node.label.occurrences.upper == '*') {
				node.label.occurrences.upper = 1;
				rules.push({
					_path : node.label.path,
					_max : value
				});
			}
		} else if (value == 0) {
			if (node.label.occurrences.upper == 1 || node.label.occurrences.upper == '*') {
				setNodeMax(node, value);
				for (var i = 0; i < rules.length; i++) {
					if (rules[i]._path.indexOf(node.label.path) != -1) {
						rules.splice(i, 1);
						i--;
					}
				}
				rules.push({
					_path : node.label.path,
					_max : value
				});
			}
		}

		node.referencedArchetype.Rule = rules;
	}

	function setDefinitionItemOnSlotArchetype(node, value) {
		for (var i = 0; i < $scope.archetypeList.length; i++) {
			if ($scope.archetypeList[i].name == value) {
				var parsedArchetype = archetypeParseService.parseArchetypeXml($scope.archetypeList[i].xml);
				var items = node.referencedArchetype.Items;
				var conceptName;
				var terms = parsedArchetype.terminologies.terms;
				for (var i = 0; i < terms.length; i++) {
					if (terms[i].language == 'en') {
						for (var j = 0; j < terms[i].items.length; j++) {
							if (terms[i].items[j].code == parsedArchetype.header.concept) {
								conceptName = terms[i].items[j].text;
								break;
							}
						}
						break;
					}
				}
				var newItem = {
					'_xsi:type' : parsedArchetype.definitions.treeItems[0].label.text,
					_archetype_id : parsedArchetype.header.id,
					_concept_name : conceptName,
					_path : node.label.path
				};
				if (items) {
					if (!angular.isArray(items)) {
						var newItems = [];
						newItems.push(items);
						items = newItems;
					}
					items.push(newItem);
				} else {
					items = newItem;
				}
				node.referencedArchetype.Items = items;
				templateParseToEditService.processArchetypeNodes(parsedArchetype.definitions.treeItems, node, node.children, newItem, parsedArchetype.terminologies.terms);
				break;
			}
		}
	}

	function setDefinitionItemOnSlitArchetype(node, value) {
		console.log(node);
		var children = node.parent.children;
		children.splice(node.label.index, 1);
		for (var i = 0; i < children.length; i++) {
			children[i].label.index = i;
		}

		var items = node.parent.referencedArchetype.Items;
		if (!angular.isArray(items)) {
			var newItems = [];
			newItems.push(items);
			items = newItems;
		}
		for (var i = 0, index = -1; i < items.length; i++) {
			if (node.label.path == items[i]._archetype_id) {
				if (++index == node.label.index) {
					items.splice(i, 1);
					break;
				}
			}
		}
		if (items.length > 0) {
			node.parent.referencedArchetype.Items = items;
		} else {
			delete node.parent.referencedArchetype.Items;
		}
	}


	$scope.createTemplate = function() {
		$scope.createdTemplate = templateCreateService.openCreate($scope.archetypeList, $scope);
		$scope.createdTemplate.then(function(message) {
			var template = new Template(message.archetype);
			//pushToTemplateList(template);
			$scope.createTemplateFile(template);
		});
	};

	function Template(archetype) {
		this.arm = getArm(archetype);
		this.name = archetype.name;
		this.oet = getOet(archetype);
	}

	function createTemplate(archetype) {
		console.log(archetype);
		return new Template(archetype);
	}

	function getArm(archetype) {
		var arm = {
			'archetype-relationship-mapping' : {
				_xmlns : "http://schemas.clever.bme.zju.edu",
				template : {
					'_template-id' : archetype.name,
				}
			}
		};

		console.log(arm);
		var x2js = new X2JS();
		var xml = formatXml(x2js.json2xml_str(arm));
		console.log(xml);
		return xml;
	}

	function getOet(archetype) {
		console.log(archetype);
		var oet;
		oet = {
			template : {
				'_xmlns:xsi' : "http://www/w3.org/2001/XMLSchema-instance",
				'_xmlns:xsd' : "http://www.w3.org/2001/XMLSchema",
				'_xmlns' : "openEHR/v1/Template",
				id : "48d3ea45-b2b5-42aa-8031-b18f68203d97",
				name : archetype.name,
				description : getDescription(archetype),
				definition : getDefinition(archetype),
			}
		};

		console.log(oet);
		var x2js = new X2JS();
		var xml = formatXml(x2js.json2xml_str(oet));
		return xml;

	}

	function getDefinition(archetype) {
		return {
			'_xsi:type' : archetype.rmEntity,
			_archetype_id : archetype.name,
			_concept_name : archetype.conceptName,
		};
	}

	function getDescription(archetype) {

		var archetypeDesc = archetype.parsedResult.header.description;
		var details = getDetailsInEn(archetypeDesc);

		var otherDetails = getOtherDetails(archetypeDesc);
		var description = {
			details : {
				misuse : details.misuse,
				purpose : details.purpose,
				use : details.use ? details.use : undefined,
			},
			lifecycle_state : "Initial",
			other_details : otherDetails,
		};
		return description;
	}

	function getOtherDetails(description) {

		var otherDetails = {
			item : [{
				key : "MetaDataSet:Sample Set",
				value : {}
			}, {
				key : "Acknowledgements",
				value : {}
			}, {
				key : "Business Process Level",
				value : {}
			}, {
				key : "Care setting",
				value : {}
			}, {
				key : "Client group",
				value : {}
			}, {
				key : "Clinical Record Element",
				value : {}
			}, {
				key : "Copyright",
				value : {}
			}, {
				key : "Issues",
				value : {}
			}, {
				key : "Owner",
				value : {}
			}, {
				key : "Sign off",
				value : {}
			}, {
				key : "Speciality",
				value : {}
			}, {
				key : "User roles",
				value : {}
			}],
		};
		return otherDetails;
	}

	function getDetailsInEn(description) {
		var details = getDetails(description, 'en');
		if (details) {
			return details;
		} else {
			return getFirstDetails(description);
		}
	}

	function getFirstDetails(description) {
		var details = description.details;
		if (details) {
			if (angular.isArray(details)) {
				return details[0];
			} else {
				return details;
			}
		}

	}

	function getDetails(description, language) {
		var returnDet;
		var arcDetails = description.details;
		if (arcDetails) {
			try {
				if (angular.isArray(description.detials)) {

					angular.forEach(arcDetails, function(detail) {
						if (detail.language == language) {
							returnDet = detail;
						}
					});
					if (!returnDet) {
						//	throw new Error('Can not find the details in ' + language);
					}

				} else {

					if (arcDetails.language == language) {
						returnDet = arcDetails;
					} else {
						//	throw new Error('Can not find the details in ' + language);
					}

				}
			} catch(e) {
				alert(e.message);
			}

		}
		return returnDet;
	}

	function pushToTemplateList(template) {
		$scope.originalTemplateList.push(template);
		$scope.formatObject.refreshFormatList($scope.originalTemplateList);
		$scope.locateTemplate(template);
	}

	function getTemplateId() {
		var drafMax = getMaxId($scope.templateFiles.draft);
		var publishedMax = getMaxId($scope.templateFiles.published);
		return drafMax > publishedMax ? drafMax : publishedMax;

	}

	function getMaxId(list) {
		var max = -1;
		if (list) {
			if (angular.isArray(list)) {
				angular.forEach(list, function(item) {
					if (item.id > max) {
						max = item.id;
					}
				});
			} else {
				max = list.id;
			}
		}
		return max + 1;
	}


	$scope.createTemplateFile = function(template) {
		resourceService.post(STORAGE_TEMPLATE_CREATE_URL, {
			oet : template.oet,
			arm : template.arm,
			name : template.name,
		}).then(function(result) {
			if (result.succeeded) {
				$scope.needLocatedObjectName = template.name;
			    $scope.initData();
				msgboxService.createMessageBox('STORAGE_TEMPLATE_SUCCEEDED', 'STORAGE_TEMPLATE_ADD_SUCCEEDED_HINT', {}, 'success');
			} else {
				msgboxService.createMessageBox('STORAGE_TEMPLATE_FAILED', 'STORAGE_TEMPLATE_ADD_FAILED_HINT', {
					errorMsg : result.message
				}, "error");
			}
			
		});
	};

	function findTemplateByName(name) {
		var list = $scope.originalTemplateList;
		var matchTemplate;
		if (list) {
			if (angular.isArray(list)) {
				angular.forEach(list, function(template) {
					if (template.name == name) {
						matchTemplate = template;
					}
				});
			}
		}
		return matchTemplate;
	}

	function getTemplateById(id) {
		resourceService.get(STORAGE_TEMPLATE_BY_ID_URL + id).then(function(template) {
			pushToTemplateList(template);
		});
	}


	$scope.submitTemplateFile = function() {
		resourceService.get(STORAGE_TEMPLATE_SUBMIT_BY_ID_URL + $scope.selectedTemplate.id).then(function(result) {
			if (result.succeeded) {
				msgboxService.createMessageBox('STORAGE_TEMPLATE_SUCCEEDED', 'STORAGE_TEMPLATE_SUBMIT_SUCCEEDED_HINT', {}, 'success');
				$scope.templateFiles.draft.splice($scope.templateFiles.draft.indexOf($scope.selectedTemplate), 1);
				$scope.selectedTemplate.lifecycleState = 'Teamreview';
				$scope.selectedTemplate = undefined;
				$scope.oetObj = undefined;
				$scope.parsedTemplate = undefined;
			} else {
				msgboxService.createMessageBox('STORAGE_TEMPLATE_FAILED', 'STORAGE_TEMPLATE_SUBMIT_FAILED_HINT', {
					errorMsg : result.message
				}, "error");
			}
		});
	};

	$scope.saveTemplateFile = function() {
		$scope.selectedTemplate.oet = x2js.json2xml_str($scope.oetObj);
		resourceService.post(STORAGE_TEMPLATE_EDIT_BY_ID_URL + $scope.selectedTemplate.id, {
			name : $scope.selectedTemplate.name,
			oet : $scope.selectedTemplate.oet,
			arm : $scope.selectedTemplate.arm,
		}).then(function(result) {
			if (result.succeeded) {
				msgboxService.createMessageBox('STORAGE_TEMPLATE_SUCCEEDED', 'STORAGE_TEMPLATE_EDIT_SUCCEEDED_HINT', {}, 'success');
			} else {
				msgboxService.createMessageBox('STORAGE_TEMPLATE_FAILED', 'STORAGE_TEMPLATE_EDIT_FAILED_HINT', {
					errorMsg : result.message
				}, "error");
			}
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

}
