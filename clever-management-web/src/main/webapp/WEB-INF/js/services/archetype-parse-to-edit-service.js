angular.module("clever.management.service.archetypeParseToEdit", []).service('archetypeParseToEditService', function() {

	this.parseDefinitionToEdit = function(archetype) {
		var definition = parseDefinitionTree(archetype.definitions.treeItems, archetype.terminologies);
		return {
			definition : definition,
		};
	};

	function parseDefinitionTree(treeItems, terminologies) {
		var resultTree = [];
		angular.forEach(treeItems, function(treeNode) {
			var label = {
				archetypeNode : true,
				text : undefined,
				code : treeNode.label.code,
				picType : treeNode.label.picType,
				path : undefined,
				occurrences : treeNode.label.occurrences,
				type : treeNode.label.type,
			};

			var optNode = {
				label : label,
			};
			if (treeNode.children) {
				optNode.children = [];
				extractArchetype(treeNode.children, optNode, optNode.children, terminologies);
			}
			resultTree.push(optNode);

		});

		return resultTree;

	}

	function extractArchetype(archetypeNode, nodeParent, aimTree, terminologies) {
		angular.forEach(archetypeNode, function(attributeNode) {
			if (noTraverseAttributeList.indexOf(attributeNode.label.text) != -1 && attributeNode.children) {

				var resultAttributeNode = constructAttributeNode(attributeNode, nodeParent);

				aimTree.push(resultAttributeNode);
				angular.forEach(attributeNode.children, function(typeNode) {
					if (noTraverseTypeList.indexOf(typeNode.label.text) == -1) {
						//var resultNode = {};
						var resultNode = constructNode(attributeNode, typeNode, nodeParent, terminologies);
						if (typeNode.children) {
							resultNode.children = [];
							extractArchetype(typeNode.children, resultNode, resultNode.children, terminologies);
						}

						resultAttributeNode.children.push(resultNode);
					}
				});
			} else if (attributeNode.children) {
				angular.forEach(attributeNode.children, function(typeNode) {
					if (noTraverseTypeList.indexOf(typeNode.label.text) == -1) {
						//var resultNode = {};
						var resultNode = constructNode(attributeNode, typeNode, nodeParent, terminologies);
						if (typeNode.children) {
							resultNode.children = [];
							extractArchetype(typeNode.children, resultNode, resultNode.children, terminologies);
						}

						aimTree.push(resultNode);
					}
				});
			}

		});
	}

	var noTraverseAttributeList = ['subject', 'ism_transition', 'otherParticipations', 'links'];
	//var noTraverseAttributeList =[];
	var baseTypeList = ['subject', 'ism_transition', 'otherParticipations', 'links'];

	var noTraverseTypeList = ['DV_TEXT', 'DV_CODED_TEXT', 'DV_QUANTITY', 'DV_ORDINAL', 'DV_DATE_TIME', 'DV_DATE', 'DV_TIME', 'DV_BOOLEAN', 'DV_COUNT', 'DV_DURATION', 'DV_INTERVAL<DV_DATE>', 'DV_INTERVAl<DV_TIME>', 'DV_INTERVAL<DV_DATE_TIME>', 'DV_INTERVAL<COUNT>', 'DV_INTERVAL<QUANTITY>', 'DV_MULTIMEDIA', 'DV_URI', 'DV_EHR_URI', 'DV_PROPORTION', 'DV_IDENTIFIER', 'DV_PARSABLE', 'DV_BOOLEAN'];

	var typeList = ['ITEM_LIST', 'ITEM_TREE', 'HISTORY'];

	function constructAttributeNode(attributeNode, nodeParent) {
		var text, picType;
		return {
			label : {
				text : attributeNode.label.text,
				//paretnt:nodeParent,
				picType : attributeNode.label.picType,
				code : undefined,
			},
			parent : nodeParent,
			children : [],
		};

	}

	function constructNode(attributeNode, typeNode, nodeParent, terminologies) {
		var text, code, path, picType, occurrences, type, baseType;
		//this base type can be subject ,paticipations, links

		var attributeText = attributeNode.label.text;
		var typeText = typeNode.label.text;

		/*	if(baseTypeList.indexOf(attributeText)!= -1){
		 baseType = attributeText;
		 }else
		 {
		 baseType = undefined;
		 }*/

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

		occurrences = typeNode.label.occurrences;
		picType = typeNode.label.picType;

		if (nodeParent.label.archetypeNode) {
			if (typeNode.label.code) {
				path = '/' + attributeText + '[' + typeNode.label.code + ']';
			} else {
				path = '/' + attributeText;

			}
		} else {
			if (typeNode.label.code) {
				path = nodeParent.label.path + "/" + attributeText + "[" + typeNode.label.code + "]";

			} else {
				path = nodeParent.label.path + "/" + attributeText;
			}
		}

		if (typeNode.label.slot) {
			return {
				label : {
					text : text,
					code : code,
					path : path,
					picType : picType,
					slot : typeNode.label.slot,
					includes : typeNode.label.includes,
					excludes : typeNode.label.excludes,
					occurrences : occurrences,
					baseType : baseType,
				},
				parent : nodeParent,
				children : [],
			};

		} else {
			return {
				label : {
					text : text,
					code : code,
					path : path,
					picType : picType,
					archetypeNode : false,
					occurrences : occurrences,
					baseType : baseType,
				},
				parent : nodeParent,
				children : [],
			};
		}

	}

});

