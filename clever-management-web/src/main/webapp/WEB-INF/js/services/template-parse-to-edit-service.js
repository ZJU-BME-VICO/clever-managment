angular.module('clever.management.services.templateParseToEdit', []).service('templateParseToEditService', function(resourceService, $q, archetypeParseService, ARCHETYPE_BY_NAME_URL) {

    this.parseTemplate = function(template) {
        var id = template.id;
        var name = template.name;
        var parseResult = this.parseDefinition(template);
        return {
            id: id,
            name: name,
            definition: parseResult.optTree,
            terminologies: parseResult.terms
        }
    }

    this.parseDefinition = function(template) {
        var optTree = [];
        var terms = {};
        processOet(template.definition, optTree, terms);
        return {
            optTree: optTree,
            terms: terms
        }
    }

    function processOet(oet, optTree, terms) {
        if (angular.isArray(oet)) {
            angular.forEach(oet, function(value) {
                var parseResult;
                $.ajax({
                    url: ARCHETYPE_BY_NAME_URL + value._archetype_id,
                    type: 'GET',
                    async: false,
                    success: function(archetype) {
                        parseResult = archetypeParseService.parseArchetypeXml(archetype.xml);
                    }
                });
                terms[value._archetype_id] = parseResult.terminologies.terms;
                var allowArchetypeNode = {
                    value: undefined
                };
                if (value._path) {
                    findAllowArchetypeNode(optTree, value._path, allowArchetypeNode);
                    if (allowArchetypeNode.value) {
                        allowArchetypeNode.value.children = [];
                        processArchetypeNodes(parseResult.definitions.treeItems, allowArchetypeNode.value, allowArchetypeNode.value.children, value);
                    }
                } else {
                    processArchetypeNodes(parseResult.definitions.treeItems, undefined, optTree, value);
                }
                if (value.Items) {
                    if (allowArchetypeNode.value) {
                        processOet(value.Items, allowArchetypeNode.value.children, terms);
                    } else {
                        processOet(value.Items, optTree, terms);
                    }
                }
            });
        } else {
            var parseResult;
            $.ajax({
                url: ARCHETYPE_BY_NAME_URL + oet._archetype_id,
                type: 'GET',
                async: false,
                success: function(archetype) {
                    parseResult = archetypeParseService.parseArchetypeXml(archetype.xml);
                }
            });
            terms[oet._archetype_id] = parseResult.terminologies.terms;
            var allowArchetypeNode = {
                value: undefined
            };
            if (oet._path) {
                findAllowArchetypeNode(optTree, oet._path, allowArchetypeNode);
                if (allowArchetypeNode.value) {
                    allowArchetypeNode.value.children = [];
                    processArchetypeNodes(parseResult.definitions.treeItems, allowArchetypeNode.value, allowArchetypeNode.value.children, oet);
                }
            } else {
                processArchetypeNodes(parseResult.definitions.treeItems, undefined, optTree, oet);

            }
            if (oet.Items) {
                if (allowArchetypeNode.value) {
                    processOet(oet.Items, allowArchetypeNode.value.children, terms);
                } else {
                    processOet(oet.Items, optTree, terms);
                }
            }
        }
    }

    function findAllowArchetypeNode(optNode, path, node) {
        if (angular.isArray(optNode)) {
            angular.forEach(optNode, function(value) {
                if (value.label.path == path) {
                    node.value = value;
                } else {
                    if (value.children) {
                        findAllowArchetypeNode(value.children, path, node);
                    }
                }
            });
        } else {
            if (optNode.label.path == path) {
                node.value = optNode;
            } else {
                if (optNode.children) {
                    findAllowArchetypeNode(optNode.children, path, node);
                }
            }
        }
    }

    function processArchetypeNodes(archetypeTree, parent, optTree, oet) {
        angular.forEach(archetypeTree, function(value) {
            var label = {
                archetypeNode: true,
                text: undefined,
                code: value.label.code,
                picType: value.label.picType,
                path: oet._archetype_id,
                occurrences: {
                    lower: value.label.occurrences.lower,
                    upper: value.label.occurrences.upper,
                    max: undefined
                },
                max: 1
            }
            var optNode = {
                label: label
            }
            optNode.parent = parent;
            optNode.referencedArchetype = oet;
            if (value.children) {
                optNode.children = [];
                extractArchetype(value.children, optNode, optNode.children, oet, archetypeTree);
            }
            optTree.push(optNode);
        });
    }

    function extractArchetype(archetypeNode, optParent, optTree, oet, archetypeTree) {
        angular.forEach(archetypeNode, function(value) {
            if (stopTraverseAttributeList.indexOf(value.label.text) == -1 && value.children) {
                for (var i = 0; i < value.children.length; i++) {
                    if (value.children[i].label.targetPath) {
                        var targetNode = {
                            value: undefined
                        };
                        var reg = /\[|\]|\//;
                        var codeId = value.children[i].label.targetPath.split(reg).slice(-2, -1)[0];
                        findNodeFromParsedArchetype(archetypeTree, codeId, targetNode);
                        value.children[i] = targetNode.value;
                    }
                }
                angular.forEach(value.children, function(item) {
                    if (stopTraverseTypeList.indexOf(item.label.text) == -1) {
                        var optNode = constructNode(value, item, optParent, oet);
                        if (item.children) {
                            optNode.children = [];
                            extractArchetype(item.children, optNode, optNode.children, oet, archetypeTree);
                        }
                        optTree.push(optNode);
                    }
                });
            }
        });
    }

    var stopTraverseAttributeList = ['subject', 'ism_transition', 'other_participations'];
    var stopTraverseTypeList = ['DV_TEXT', 'DV_CODED_TEXT', 'DV_QUANTITY', 'DV_ORDINAL', 'DV_DATE_TIME', 'DV_DATE', 'DV_TIME', 'DV_BOOLEAN', 'DV_COUNT', 'DV_DURATION', 'DV_INTERVAL<DV_DATE>', 'DV_INTERVAl<DV_TIME>', 
                                'DV_INTERVAL<DV_DATE_TIME>', 'DV_INTERVAL<COUNT>', 'DV_INTERVAL<QUANTITY>', 'DV_MULTIMEDIA', 'DV_URI', 'DV_PROPORTION', 'DV_IDENTIFIER', 'DV_PARSABLE', 'DV_BOOLEAN'];
    var typeList = ['ITEM_LIST', 'ITEM_TREE', 'HISTORY'];


    var picTypes = {
        'DV_TEXT': 'text',
        'DV_CODED_TEXT': 'text',
        'SLOT': 'slot',
        'DV_QUANTITY': 'quantity',
        'DV_ORDINAL': 'ordinal',
        'ANY': 'any',
        'DV_DATE_TIME': 'datetime',
        'DV_DATE': 'datetime',
        'DV_TIME': 'datetime',
        'DV_COUNT': 'count',
        'DV_DURATION': 'duration',
        'DV_INTERVAL<DV_DATE>': 'interval_datetime',
        'DV_INTERVAl<DV_TIME>': 'interval_datetime',
        'DV_INTERVAL<DV_DATE_TIME>': 'interval_datetime',
        'DV_INTERVAL<COUNT>': 'interval_count',
        'DV_INTERVAL<QUANTITY>': 'interval_quantity',
        'CHOICE': 'choice',
        'DV_MULTIMEDIA': 'multimedia',
        'DV_URI': 'uri',
        'DV_PROPORTION': 'radio',
        'DV_IDENTIFIER': 'id',
        'DV_PARSABLE': 'parseable',
        'DV_BOOLEAN': 'truefalse',

        'EVENT': 'any',
        'POINT_EVENT': 'pointintime',
        'INTERVAL_EVENT': 'interval',

        'ITEM_LIST': 'structure',
        'ITEM_TREE': 'structure'
    }

    function findNodeFromParsedArchetype(archetypeTree, codeId, targetNode) {
        if (angular.isArray(archetypeTree)) {
            angular.forEach(archetypeTree, function(value) {
                if (value.label.code &&  value.label.code == codeId) {
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

    function constructNode(attributeNode, typeNode, optParent, oet) {

        var text, code, max, path, picType, occurrences;
        var attributeText = attributeNode.label.text;
        var typeText = typeNode.label.text
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
            lower: typeNode.label.occurrences.lower,
            upper: typeNode.label.occurrences.upper
        };

        if (occurrences.lower == 0) {
            if (occurrences.upper) {
                occurrences.max = occurrences.upper;
                max = occurrences.upper;
            } else {
                occurrences.max = '*';
                max = '*';
            }
        } else if (occurrences.lower == 1 && occurrences.upper == 1){
            occurrences.max = undefined;
            max = undefined;
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
                        max = rules[i]._max;
                        break;
                    }
                }
            } else {
                var cmp;
                if (path.indexOf(rules._path) != -1) {
                    cmp = path.length - rules._path.length;
                }
                if (cmp == 0 || (cmp > 0 && rules._max == 0)) {
                    max = rules._max;
                }
            }
        }
        if (max == undefined) {
            max = 1;
        }

        if (typeNode.label.slot) {
            return {
                label: {
                    text: text,
                    code: code,
                    path: path,
                    max: max,
                    picType: picType,
                    slot: typeNode.label.slot,
                    includes: typeNode.label.includes,
                    excludes: typeNode.label.excludes,
                    occurrences: occurrences
                },
                parent: optParent,
                referencedArchetype: oet
            };
        } else {
            return {
                label: {
                    text: text,
                    code: code,
                    path: path,
                    max: max,
                    picType: picType,
                    archetypeNode: false,
                    occurrences: occurrences
                },
                parent: optParent,
                referencedArchetype: oet
            }
        }
    }

});
