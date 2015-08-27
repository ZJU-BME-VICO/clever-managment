function StorageTemplateEditCtrl($scope, resourceService, busyService, msgboxService, templateParseToEditService, archetypeParseService, documentDiffModalService, STORAGE_TEMPLATE_LIST_EDIT_DRAFT_URL, STORAGE_TEMPLATE_LIST_EDIT_PUBLISHED_URL, STORAGE_TEMPLATE_SUBMIT_BY_ID_URL, STORAGE_TEMPLATE_EDIT_BY_ID_URL, ARCHETYPE_LIST_REFERENCE_URL) {

	$scope.treeControl = {};
	$scope.templateFiles = {
		draft : [],
		published : []
	};

	$scope.selectedLifecycle = 'Draft';

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
		label += '<span class="clever-icon ' + node.label.picType.toLowerCase() + '" style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<span ng-class="{\'node-label-max\': ' + aliasName + '.label.occurrences.upper != 0}"';
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
		label += '<span ng-if="' + aliasName + '.label.occurrences.upper != 0">&nbsp&nbsp[{{' + aliasName + '.label.occurrences.lower}}..{{' + aliasName + '.label.occurrences.upper}}]' + '<span ng-if="' + aliasName + '.label.occurrenceType == \'*\' && ' + aliasName + '.label.occurrences.upper == 1">&nbsp&nbsp&nbsp<em>[0..*] to [0..1]</em></span>' + '</span>' + '</span>' + '</span>';
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

	refreshDraftTemplateData();
	refreshPublishedTemplateData();

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

	function refreshDraftTemplateData() {
		resourceService.get(STORAGE_TEMPLATE_LIST_EDIT_DRAFT_URL).then(function(list) {
			$scope.templateFiles.draft = list;
			// console.log(list);
		});
	}

	function refreshPublishedTemplateData() {
		resourceService.get(STORAGE_TEMPLATE_LIST_EDIT_PUBLISHED_URL).then(function(list) {
			$scope.templateFiles.published = list;
			// console.log(list);
		});
	}

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
