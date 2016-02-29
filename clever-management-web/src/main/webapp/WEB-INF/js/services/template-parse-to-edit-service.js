angular.module('clever.management.services.templateParseToEdit', []).service('templateParseToEditService', function(resourceService, $q, archetypeParseService, ARCHETYPE_BY_NAME_URL) {

	var rootThis = this;
	this.parseTemplate = function(template) {
		var id = template.id;
		var name = template.name;
		var definition = this.parseDefinition(template);
		return {
			id : id,
			name : name,
			definition : definition
		};
	};

	this.parseDefinition = function(template) {
		var optTree = [];
		processOet(template.definition, optTree);
		return optTree;
	};

	function processOet(oet, optTree) {
		if (angular.isArray(oet)) {
			angular.forEach(oet, function(value) {
				var parseResult;
				$.ajax({
					url : ARCHETYPE_BY_NAME_URL + value._archetype_id,
					type : 'GET',
					async : false,
					success : function(archetype) {
						parseResult = archetypeParseService.parseArchetypeXml(archetype.xml);
						// console.log("this is parse archetype result=================================");
						//  console.log(parseResult);
					}
				});
				var allowArchetypeNode = {
					value : undefined
				};
				if (value._path) {
					findAllowArchetypeNode(optTree, value._path, allowArchetypeNode);
					if (allowArchetypeNode.value) {
						rootThis.processArchetypeNodes(parseResult.definitions.treeItems, allowArchetypeNode.value, allowArchetypeNode.value.children, value, parseResult.terminologies.terms);
					}
				} else {
					rootThis.processArchetypeNodes(parseResult.definitions.treeItems, undefined, optTree, value, parseResult.terminologies.terms);
				}
				if (value.Items) {
					if (allowArchetypeNode.value) {
						processOet(value.Items, allowArchetypeNode.value.children);
					} else {
						processOet(value.Items, optTree);
					}
				}
			});
		} else {
			var parseResult;
			$.ajax({
				url : ARCHETYPE_BY_NAME_URL + oet._archetype_id,
				type : 'GET',
				async : false,
				success : function(archetype) {
					parseResult = archetypeParseService.parseArchetypeXml(archetype.xml);
				}
			});
			var allowArchetypeNode = {
				value : undefined
			};
			if (oet._path) {
				findAllowArchetypeNode(optTree, oet._path, allowArchetypeNode);
				if (allowArchetypeNode.value) {
					rootThis.processArchetypeNodes(parseResult.definitions.treeItems, allowArchetypeNode.value, allowArchetypeNode.value.children, oet, parseResult.terminologies.terms);
				}
			} else {
				rootThis.processArchetypeNodes(parseResult.definitions.treeItems, undefined, optTree, oet, parseResult.terminologies.terms);
			}
			if (oet.Items) {
				if (allowArchetypeNode.value) {
					processOet(oet.Items, allowArchetypeNode.value.children);
				} else {
					processOet(oet.Items, optTree);
				}
			}
		}
	}

	function findAllowArchetypeNode(optNode, path, node) {
		// if (angular.isArray(optNode)) {
		for (var i = 0; i < optNode.length; i++) {
			if (optNode[i].label.path == path) {
				node.value = optNode[i];
				break;
			} else {
				if (optNode[i].children && optNode[i].children.length > 0) {
					findAllowArchetypeNode(optNode[i].children, path, node);
				}
			}
		}
		// } else {
		//     if (optNode.label.path == path) {
		//         node.value = optNode;
		//         return;
		//     } else {
		//         if (optNode.children && optNode.children.length > 0) {
		//             findAllowArchetypeNode(optNode.children, path, node);
		//         }
		//     }
		// }
	}


	this.processArchetypeNodes = function(archetypeTree, parent, optTree, oet, terminologies) {
		angular.forEach(archetypeTree, function(value) {
			var label = {
				archetypeNode : true,
				text : undefined,
				code : value.label.code,
				picType : picTypes[value.label.picType] ? picTypes[value.label.picType] : value.label.picType,
				path : oet._archetype_id,
				occurrences : {
					lower : value.label.occurrences.lower,
					upper : value.label.occurrences.upper,
					max : undefined
				},
				max : 1,
				index : optTree.length
			};
			var optNode = {
				label : label
			};
			optNode.parent = parent;
			optNode.referencedArchetype = oet;
			optNode.referencedOntologies = terminologies;
			if (value.children) {
				optNode.children = [];
				extractArchetype(value.children, optNode, optNode.children, oet, archetypeTree, terminologies);
			}
			optTree.push(optNode);
		});
	};

	function extractArchetype(archetypeNode, optParent, optTree, oet, archetypeTree, terminologies) {
		angular.forEach(archetypeNode, function(value) {
			if (stopTraverseAttributeList.indexOf(value.label.text) == -1 && value.children) {
				for (var i = 0; i < value.children.length; i++) {
					if (value.children[i].label.targetPath) {
						var targetNode = {
							value : undefined
						};
						var reg = /\[|\]|\//;
						var codeId = value.children[i].label.targetPath.split(reg).slice(-2, -1)[0];
						findNodeFromParsedArchetype(archetypeTree, codeId, targetNode);
						value.children[i] = targetNode.value;
					}
				}
				angular.forEach(value.children, function(item) {
					if (stopTraverseTypeList.indexOf(item.label.text) == -1) {
						var optNode = constructNode(value, item, optParent, oet, terminologies);
						if (item.children) {
							optNode.children = [];
							extractArchetype(item.children, optNode, optNode.children, oet, archetypeTree, terminologies);
						}
						optTree.push(optNode);
					}
				});
			}
		});
	}

	var stopTraverseAttributeList = ['subject', 'ism_transition', 'other_participations'];
	var stopTraverseTypeList = ['DV_TEXT', 'DV_CODED_TEXT', 'DV_QUANTITY', 'DV_ORDINAL', 'DV_DATE_TIME', 'DV_DATE', 'DV_TIME', 'DV_BOOLEAN', 'DV_COUNT', 'DV_DURATION', 'DV_INTERVAL<DV_DATE>', 'DV_INTERVAl<DV_TIME>', 'DV_INTERVAL<DV_DATE_TIME>', 'DV_INTERVAL<COUNT>', 'DV_INTERVAL<QUANTITY>', 'DV_MULTIMEDIA', 'DV_URI', 'DV_PROPORTION', 'DV_IDENTIFIER', 'DV_PARSABLE', 'DV_BOOLEAN'];
	var typeList = ['ITEM_LIST', 'ITEM_TREE', 'HISTORY'];

	var picTypes = {
		'DV_TEXT' : 'text',
		'DV_CODED_TEXT' : 'text',
		'SLOT' : 'slot',
		'DV_QUANTITY' : 'quantity',
		'DV_ORDINAL' : 'ordinal',
		'ANY' : 'any',
		'DV_DATE_TIME' : 'datetime',
		'DV_DATE' : 'datetime',
		'DV_TIME' : 'datetime',
		'DV_COUNT' : 'count',
		'DV_DURATION' : 'duration',
		'DV_INTERVAL<DV_DATE>' : 'interval_datetime',
		'DV_INTERVAl<DV_TIME>' : 'interval_datetime',
		'DV_INTERVAL<DV_DATE_TIME>' : 'interval_datetime',
		'DV_INTERVAL<COUNT>' : 'interval_count',
		'DV_INTERVAL<QUANTITY>' : 'interval_quantity',
		'CHOICE' : 'choice',
		'DV_MULTIMEDIA' : 'multimedia',
		'DV_URI' : 'uri',
		'DV_PROPORTION' : 'ratio',
		'DV_IDENTIFIER' : 'id',
		'DV_PARSABLE' : 'parseable',
		'DV_BOOLEAN' : 'truefalse',

		'EVENT' : 'any',
		'POINT_EVENT' : 'pointintime',
		'INTERVAL_EVENT' : 'interval',

		'ITEM_LIST' : 'structure',
		'ITEM_TREE' : 'structure',
		'PARTY_INDENTITY' : 'party_identity',
		'ANDDRESS' : 'address',
		'PARTY_RELATIONSHIP' : 'party_relationship',
		'CAPABILITY' : 'capbliity',
		'ORGANISATION' : 'organisation',
		'CONTACT' : 'contact',
		'PERSON' : 'demographic',
		'ROLE' : 'role',
		'ADMIN_ENTRY' : 'admin',
		'PARTICIPATION' : 'participation',

	};

	function findNodeFromParsedArchetype(archetypeTree, codeId, targetNode) {
		if (angular.isArray(archetypeTree)) {
			angular.forEach(archetypeTree, function(value) {
				if (value.label.code && value.label.code == codeId) {
					targetNode.value = value;
				} else {
					if (value.children) {
						findNodeFromParsedArchetype(value.children, codeId, targetNode);
					}
				}
			});
		} else {
			if (archetypeTree.label.code && archetypeTree.label.code == codeId) {
				targetNode.value = value;
			} else {
				if (archetypeTree.children) {
					findNodeFromParsedArchetype(archetypeTree.children, codeId, targetNode);
				}
			}
		}

	}

	// Every node object has children attribute (array type), but in fact it has no sub note if the children's length == 0
	function constructNode(attributeNode, typeNode, optParent, oet, terminologies) {

		var text, code, max, path, picType, occurrenceType, occurrences;
		var attributeText = attributeNode.label.text;
		var typeText = typeNode.label.text;
		var rules = oet.Rule;

		if (typeList.indexOf(typeText) != -1) {
			text = attributeText;
			code = undefined;
		} else {
			if (typeNode.label.code) {
				text = undefined;
				code = typeNode.label.code;
			} else {
				text = typeText;
				code = undefined;
			}
		}

		occurrences = {
			lower : typeNode.label.occurrences.lower,
			upper : typeNode.label.occurrences.upper
		};

		if (occurrences.lower == 0) {
			if (occurrences.upper) {
				occurrenceType = occurrences.upper;
			} else {
				occurrences.upper = '*';
				occurrenceType = '*';
			}
		}
		// } else if (occurrences.lower == 1 && occurrences.upper == 1){
		//     occurrenceType = undefined;
		// }
		else if (occurrences.lower == 1) {
			occurrenceType = occurrences.upper;
			if (!occurrences.upper) {
				occurrences.upper = "*";
			}
		}

		if (typeNode.label.slot) {
			picType = picTypes['SLOT'];
		} else {
			picType = picTypes[typeNode.label.picType] || typeNode.label.picType;
		}

		if (optParent.label.archetypeNode) {
			if (typeNode.label.code) {
				path = '/' + attributeText + '[' + typeNode.label.code + ']';
			} else {
				path = '/' + attributeText;
			}
		} else {
			if (typeNode.label.code) {
				path = optParent.label.path + '/' + attributeText + '[' + typeNode.label.code + ']';
			} else {
				path = optParent.label.path + '/' + attributeText;
			}
		}

		if (rules) {
			if (angular.isArray(rules)) {
				var cmp;
				for (var i = 0; i < rules.length; i++) {
					if (path.indexOf(rules[i]._path) != -1) {
						cmp = path.length - rules[i]._path.length;
					}
					if (cmp == 0 || (cmp > 0 && rules[i]._max == 0)) {
						occurrences.upper = rules[i]._max;
						break;
					}
				}
			} else {
				var cmp;
				if (path.indexOf(rules._path) != -1) {
					cmp = path.length - rules._path.length;
				}
				if (cmp == 0 || (cmp > 0 && rules._max == 0)) {
					occurrences.upper = rules._max;
				}
			}
		}

		if (typeNode.label.slot) {
			return {
				label : {
					text : text,
					code : code,
					path : path,
					// max: max,
					picType : picType,
					slot : typeNode.label.slot,
					includes : typeNode.label.includes,
					excludes : typeNode.label.excludes,
					occurrenceType : occurrenceType,
					occurrences : occurrences
				},
				parent : optParent,
				referencedArchetype : oet,
				referencedOntologies : terminologies,
				children : [] // for rendering sub node located at 'ng-repeat' directive in the 'tree-view-node' directive in time after slot an archetype
			};
		} else {
			return {
				label : {
					text : text,
					code : code,
					path : path,
					// max: max,
					picType : picType,
					archetypeNode : false,
					occurrenceType : occurrenceType,
					occurrences : occurrences
				},
				parent : optParent,
				referencedArchetype : oet,
				referencedOntologies : terminologies
			};
		}
	}

});
