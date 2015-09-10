function StorageTemplateEditCtrl($scope, resourceService, busyService, msgboxService, templateParseToEditService, archetypeParseService, documentDiffModalService, STORAGE_TEMPLATE_LIST_EDIT_DRAFT_URL, STORAGE_TEMPLATE_LIST_EDIT_PUBLISHED_URL, STORAGE_TEMPLATE_SUBMIT_BY_ID_URL, STORAGE_TEMPLATE_EDIT_BY_ID_URL, ARCHETYPE_LIST_REFERENCE_URL) {

	$scope.treeControl = {};
	$scope.listTreeControl = {};
	$scope.templateFiles = {
		draft : [],
		published : []
	};

	$scope.selectedLifecycle = 'Draft';

	$scope.isTemplateListHidden = false;

	var cluster = {
		isDirectory : true,
		type : 'cluster',
		name : 'Cluster',
		children : [],
	};
	var composition = {
		isDirectory : true,
		type : 'composition',
		name : 'Composition',
		children : [],
	};
	var element = {
		isDirectory : true,
		type : 'element',
		name : 'Element',
		children : [],
	};
	var action = {
		isDirectory : true,
		type : 'action',
		name : 'Action',
		children : [],
	};
	var evaluation = {
		isDirectory : true,
		type : 'evaluation',
		name : 'Evaluation',
		children : [],
	};
	var observation = {
		isDirectory : true,
		type : 'observation',
		name : 'Observation',
		children : [],
	};
	var instruction = {
		isDirectory : true,
		type : 'instruction',
		name : 'Instruction',
		children : [],
	};
	var admin = {
		isDirectory : true,
		type : 'admin',
		name : 'Admin',
		children : [],
	};
	var entry = {
		isDirectory : true,
		type : 'folder',
		name : 'Entry',
		collapsed : false,
		children : [action, evaluation, observation, instruction, admin],
	};
	var section = {
		isDirectory : true,
		type : 'section',
		name : 'Section',
		children : [],
	};
	var stucture = {
		isDirectory : true,
		type : 'ehr-structure',
		name : 'Stucture',
		children : [],
	};
	var demographic = {
		isDirectory : true,
		type : 'folder',
		name : 'Demographic Model Archetypes',
		children : [],
	};
	var templateList = [{
		isDirectory : true,
		type : 'folder',
		name : 'EHR Archetypes',
		collapsed : false,
		children : [cluster, composition, element, entry, section, stucture],
	}, demographic];
	var templateListMap = {
		cluster : cluster.children,
		composition : composition.children,
		element : composition.children,
		action : action.children,
		evaluation : evaluation.children,
		observation : observation.children,
		instruction : instruction.children,
		admin_entry : admin.children,
		section : section.children,
		stucture : stucture.children,
		demographic : demographic.children,
	};

	var busyDraft = busyService.pushBusy('BUSY_LOADING');
	resourceService.get(STORAGE_TEMPLATE_LIST_EDIT_DRAFT_URL).then(function(list) {
		$scope.templateFiles.draft = list;
		// console.log(list);
		$scope.refreshTemplateList($scope.templateFiles.draft);
		busyService.popBusy(busyDraft);
	});

	var busyPublished = busyService.pushBusy('BUSY_LOADING');
	resourceService.get(STORAGE_TEMPLATE_LIST_EDIT_PUBLISHED_URL).then(function(list) {
		$scope.templateFiles.published = list;
		// console.log(list);
		busyService.popBusy(busyPublished);
	});

	$scope.searchKeyMapper = function(node) {
		return node.conceptName + ' (' + node.version + ')';
	};

	$scope.$watch('templateListFilter', function(newValue) {
		if (newValue != undefined) {
			$scope.listTreeControl.search(newValue);
		}

	});

	$scope.refreshTemplateList = function(list) {
		angular.forEach(templateListMap, function(value, key) {
			value.length = 0;
		});
		angular.forEach(list, function(template, index) {
			if (template.rmName == 'DEMOGRAPHIC') {
				templateListMap['demographic'].push(template);
			} else {
				var templates = templateListMap[template.rmEntity.toLowerCase()];
				if (template == undefined) {
					console.log('Cannot classify template ' + template.name);
				} else {
					templates.push(template);
				}
			}
		});
		$scope.templateList = [];
		$scope.templateList = templateList;
	};

	var x2js = new X2JS({
		escapeMode : false,
		emptyNodeForm : 'object',
	});
	$scope.oetObj = {};

	$scope.isExpandedAll = false;
	$scope.$watch('isExpandedAll', function(newValue, oldValue) {

		if ($scope.treeControl.value && newValue) {
			$scope.treeControl.value.expandAll();
		} else if ($scope.treeControl.value && !newValue) {
			$scope.treeControl.value.collapseAll();
		}
	});

	$scope.archetypeList = [];
	resourceService.get(ARCHETYPE_LIST_REFERENCE_URL).then(function(list) {
		angular.forEach(list, function(value) {
			if (value) {
				$scope.archetypeList.push(value);
			}
		});
		console.log($scope.archetypeList);
	});

	$scope.selectTemplate = function(template) {
		if (!template.isDirectory) {
			var bid = busyService.pushBusy('BUSY_LOADING');
			$scope.selectedTemplate = template;
			//console.log("this is selected template");
			//console.log($scope.selectedTemplate);
			$scope.selectedTemplate.oet = formatXml($scope.selectedTemplate.oet);
			try {
				$scope.oetObj = x2js.xml_str2json(template.oet);

				//console.log("this is the oet object---------------------------------------------------------");
				//console.log($scope.oetObj);
				$scope.parsedTemplate = templateParseToEditService.parseTemplate($scope.oetObj.template);
				console.log("----------------------this is the parsedTemplate definition");
				console.log($scope.parsedTemplate.definition);
			} catch(ex) {
				console.log(ex);
			}
			console.log($scope.oetObj);
			console.log($scope.parsedTemplate);
			$scope.isExpandedAll = false;
			busyService.popBusy(bid);
		}
	};

	$scope.generateOetDiff = function() {
		// console.log(definition);
		var xmlDocStr = x2js.json2xml_str($scope.oetObj);
		// console.log($scope.selectedTemplate.oet);
		// console.log(formatXml(xmlDocStr));
		documentDiffModalService.open('Modify records', $scope.selectedTemplate.oet, formatXml(xmlDocStr));
	};

	$scope.getOet = function() {
		return formatXml(x2js.json2xml_str($scope.oetObj));
	};

	$scope.getTreeNodeLabel = function(node, aliasName) {
		var label = '';
		//label += '<span class="clever-icon ' + node.label.picType.toLowerCase() + '" style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<span ng-class="{\'node-label-max\': ' + aliasName + '.label.occurrences.upper != 0}"';

		if (node.label.occurrences.upper != 0) {
			label += '<span class="clever-icon ' + node.label.picType.toLowerCase() + '" style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<span ng-class="{\'node-label-max\': true}"';
		} else {
			label += '<span class="clever-icon ' + node.label.picType.toLowerCase() + '" style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<span ng-class="{\'node-label-max\': false}"';

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
		//label += '<span ng-if="' + aliasName + '.label.occurrences.upper != 0">&nbsp&nbsp[{{' + aliasName + '.label.occurrences.lower}}..{{' + aliasName + '.label.occurrences.upper}}]' + '<span ng-if="' + aliasName + '.label.occurrenceType == \'*\' && ' + aliasName + '.label.occurrences.upper == 1">&nbsp&nbsp&nbsp<em>[0..*] to [0..1]</em></span>' + '</span>' + '</span>' + '</span>';

		if (node.label.occurrences.upper != 0) {
			label += '<span>&nbsp&nbsp[' + node.label.occurrences.lower + '..' + node.label.occurrences.upper + ']';
			if (node.label.occurrenceType == "*" && node.label.occurrences.upper == 1) {
				label += '<span>&nbsp&nbsp&nbsp<em>[0..*] to [0..1]</em></span>' + '</span>' + '</span>' + '</span>';
			}
		}

		return label;
		// return label + '<span>[' + node.label.path + ']</span>'
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
				menuHtml += '<li><a class="pointer" role="menuitem" tabindex="1" ng-click="setNodeByContextMenu(' + aliasName + ', 3)">Delete archetype</a></li>';
			} else {
				menuHtml = '';
			}
		} else if (node.label.slot) {
			menuHtml += constructSlotMenu(node, aliasName);
		} else {
			if (node.label.occurrenceType) {
				if (node.label.occurrenceType == 1) {
					menuHtml += '<li><a class="pointer" role="menuitem" tabindex="1" ng-click="setNodeByContextMenu(' + aliasName + ', 1, 0)">Zero Occurrence</a></li>' + '<li><a class="pointer" role="menuitem" tabindex="2" ng-click="setNodeByContextMenu(' + aliasName + ', 1, 1)">Single Occurrence</a></li>';
				} else if (node.label.occurrenceType == '*') {
					menuHtml += '<li><a class="pointer" role="menuitem" tabindex="1" ng-click="setNodeByContextMenu(' + aliasName + ', 1, 0)">Zero Occurrence</a></li>' + '<li><a class="pointer" role="menuitem" tabindex="2" ng-click="setNodeByContextMenu(' + aliasName + ', 1, 1)">Single Occurrence</a></li>' + '<li><a class="pointer" role="menuitem" tabindex="3" ng-click="setNodeByContextMenu(' + aliasName + ', 1, \'*\')">Unlimited Occurrence</a></li>';
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
				slotMenu += '<li><a class="pointer" role="menuitem" tabindex="' + (index + 1) + '" ng-click="setNodeByContextMenu(' + aliasName + ', 2, \'' + value.name + '\')">' + value.name + '</a></li>';
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


	$scope.submitTemplateFile = function() {
		resourceService.get(STORAGE_TEMPLATE_SUBMIT_BY_ID_URL + $scope.selectedTemplate.id).then(function(result) {
			if (result.succeeded) {
				msgboxService.createMessageBox('STORAGE_TEMPLATE_SUCCEEDED', 'STORAGE_TEMPLATE_SUBMIT_SUCCEEDED_HINT', {}, 'success');
				$scope.templateFiles.draft.splice($scope.templateFiles.draft.indexOf($scope.selectedTemplate), 1);
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
		resourceService.post(STORAGE_TEMPLATE_EDIT_BY_ID_URL + $scope.selectedTemplate.id, $scope.selectedTemplate).then(function(result) {
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
