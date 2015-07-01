function StorageTemplateEditCtrl($scope, resourceService, msgboxService, templateParseToEditService, documentDiffModalService, STORAGE_TEMPLATE_LIST_EDIT_DRAFT_URL, STORAGE_TEMPLATE_LIST_EDIT_PUBLISHED_URL, STORAGE_TEMPLATE_SUBMIT_BY_ID_URL, STORAGE_TEMPLATE_UPGRADE_BY_ID_URL) {

    $scope.templateFiles = {
        draft: [],
        published: []
    };

    $scope.selectedLifecycle = 'Draft';

    var x2js = new X2JS({
        escapeMode: false,
        emptyNodeForm: 'object',
    });
    $scope.oetObj;

    $scope.isExpandedAll = false;
    $scope.$watch('isExpandedAll', function(newValue, oldValue) {
        if ($scope.treeControl && newValue) {
            $scope.treeControl.expandAll();
        } else if ($scope.treeControl && !newValue) {
            $scope.treeControl.collapseAll();
        }
    });

    $scope.selectTemplate = function(template) {
        $scope.selectedTemplate = template;
        $scope.oetObj = x2js.xml_str2json(template.oet);
        $scope.parsedTemplate = templateParseToEditService.parseTemplate($scope.oetObj.template);
        console.log($scope.oetObj);
        console.log($scope.parsedTemplate);
        $scope.isExpandedAll = false;
    }

    $scope.generateOetDiff = function() {
        // console.log(definition);
        var xmlDocStr = x2js.json2xml_str($scope.oetObj);
        // console.log($scope.selectedTemplate.oet);
        // console.log(formatXml(xmlDocStr));
        documentDiffModalService.open('Modify records', $scope.selectedTemplate.oet, formatXml(xmlDocStr));
    }

    function setNodeMax(nodeTree, value) {
        if (angular.isArray(nodeTree)) {
            angular.forEach(nodeTree, function(node) {
                if (value == '*' || value == 1) {
                    node.label.max = node.label.occurrences.max;
                } else {
                    node.label.max = value;
                }
                if (node.children && node.children.length > 0) {
                    setNodeMax(node.children, value);
                }
            });
        } else {
            if (value == '*' || value == 1) {
                nodeTree.label.max = nodeTree.label.occurrences.max;
            } else {
                nodeTree.label.max = value;
            }
            if (nodeTree.children && nodeTree.children.length > 0) {
                setNodeMax(nodeTree.children, value);
            }
        }
    }

    $scope.setDefinitionItem = function(node, value) {
        var rules = node.referencedArchetype.Rule;
        if (value == '*') {
            if (node.label.max == 1) {
                node.label.max = value;
                for (var i = 0; i < rules.length; i++) {
                    if (node.label.path == rules[i]._path) {
                        rules.splice(i, 1);
                    }
                }
                if (rules.length == 0) {
                    node.referencedArchtype.Rule = undefined;
                }
            } else if (node.label.max == 0) {
                setNodeMax(node, value);
                for (var i = 0; i < rules.length; i++) {
                    if (rules[i]._path.indexOf(node.label.path) != -1) {
                       rules.splice(i, 1);
                       i--;
                    }
                }
                if (rules.length == 0) {
                    node.referencedArchetype.Rule = undefined;
                }
            }
        } else if (value == 1) {
            if (node.label.max == 0) {
                if (node.label.occurrences.max == 1) {
                    setNodeMax(node, value);
                    for (var i = 0; i < rules.length; i++) {
                        if (rules[i]._path == node.label.path) {
                            rules.splice(i, 1);
                            break;
                        }
                    }
                    if (rules.length == 0) {
                        node.referencedArchtype.Rule = undefined;
                    }
                } else if (node.label.occurrences.max == '*') {
                    node.label.max = 1;
                    setNodeMax(node.children, value);
                    for (var i = 0; i < rules.length; i++) {
                        if (rules[i]._path == node.label.path) {
                            rules[i]._max = value;
                            break;
                        }
                    }
                }
            } else if (node.label.max == '*') {
                node.label.max = 1;
                if (rules) {
                    rules.push({
                        _path: node.label.path,
                        _max: value
                    });
                } else {
                    var newRules = [];
                    newRules.push({
                        _path: node.label.path,
                        _max: value
                    });
                    node.referencedArchetype.Rule = newRules;
                }
            }
        } else if (value == 0) {
            if (node.label.max == 1 || node.label.max == '*') {
                setNodeMax(node, value);
                if (rules) {
                    for (var i = 0; i < rules.length; i++) {
                        if (rules[i]._path.indexOf(node.label.path) != -1) {
                            rules.splice(i, 1);
                            i--;
                        }
                    }
                    rules.push({
                        _path: node.label.path,
                        _max: value
                    });
                } else {
                    var newRules = [];
                    newRules.push({
                        _path: node.labe.path,
                        _max: value
                    })
                    node.referencedArchetype.Rule = newRules;
                }
            }
        }
    }

    $scope.getTreeNodeLabel = function(node, aliasName) {
        var label = '';
        label += '<span class="clever-icon ' + node.label.picType.toLowerCase() + '" style="padding: 7px 10px; background-position-y: 10px;"></span>' + 
            '<span ng-class="{\'node-label-max\': ' + aliasName + '.label.max != 0}"';
        if (node.label.text) {
            label += '<span style="color: darkblue;">' + node.label.text + '</span>' + 
                ' <span>[' + node.label.occurrences.max + '/' + node.label.max + ']</span> <span>[' + node.label.path + ']</span>';
        }
        if (node.label.code) {
            if (node.label.archetypeNode) {
                label += '<span style="color: black;font-weight: bold;">' + getOntologyByNode(node, $scope.parsedTemplate.terminologies) + '</span>' +
                    ' <span>[' + node.label.code + ']</span>';
            } else {
                label += '<span style="color: brown;">' + getOntologyByNode(node, $scope.parsedTemplate.terminologies) + '</span>' +
                    ' <span>[' + node.label.occurrences.max + '/' + node.label.max + ']</span> <span>[' + node.label.path + ']</span>';
            }
        }
        return label + '</span>';
    };

    function getOntologyByNode(node, terminologies) {
        if (terminologies) {
            var matchedOntology;
            var terms = terminologies[node.referencedArchetype._archetype_id];
            var matchedTerms;
            if (terms) {
                for (var i = 0; i < terms.length; i++) {
                    if (terms[i].language == 'en') {
                        matchedTerms = terms[i].items;
                        break;
                    }
                }
                for (var i = 0; i < matchedTerms.length; i++) {
                    if (matchedTerms[i].code == node.label.code) {
                        matchedOntology = matchedTerms[i].text;
                    }
                }
            }
            return matchedOntology;
        }
    }

    $scope.getTreeNodeMenu = function(node, aliasName) {
        var menuHtml = '';
        if (node.label.archetypeNode) {
            if (node.parent) {
                menuHtml += '<ul class="dropdown-menu" role="menu">' + 
                    '<li><a class="pointer" role="menuitem" tabindex="1" ng-click="">Delete archetype</a></li>' + '</ul>';
            }   
        } else if (node.label.slot) {
            menuHtml += '<ul class="dropdown-menu" role="menu">' + 
                '<li><a class="pointer" role="menuitem" tabindex="1" ng-click="">Add archetype</a></li>' + '</ul>';
        } else {
            if (node.label.occurrences.max) {
                if (node.label.occurrences.max == 1) {
                    menuHtml += '<ul class="dropdown-menu" role="menu">' + 
                        '<li><a class="pointer" role="menuitem" tabindex="1" ng-click="setNodeOccurrence(' + aliasName + ', 0)">Zero Occurrence</a></li>' +
                        '<li><a class="pointer" role="menuitem" tabindex="2" ng-click="setNodeOccurrence(' + aliasName + ', 1)">Single Occurrence</a></li>' + 
                        '</ul>';
                } else if (node.label.occurrences.max == '*') {
                    menuHtml += '<ul class="dropdown-menu" role="menu">' + 
                        '<li><a class="pointer" role="menuitem" tabindex="1" ng-click="setNodeOccurrence(' + aliasName + ', 0)">Zero Occurrence</a></li>' +
                        '<li><a class="pointer" role="menuitem" tabindex="2" ng-click="setNodeOccurrence(' + aliasName + ', 1)">Single Occurrence</a></li>' +
                        '<li><a class="pointer" role="menuitem" tabindex="3" ng-click="setNodeOccurrence(' + aliasName + ', \'*\')">Unlimited Occurrence</a></li>' +
                        '</ul>';
                }
            }
        }
        if (node.parent && node.parent.label.max == 0) {
            return '';
        } else {
            return menuHtml;
        }
    }

    refreshDraftTemplateData();
    refreshPublishedTemplateData();

    $scope.submitTemplateFile = function(templateFile) {
        resourceService.get(STORAGE_TEMPLATE_SUBMIT_BY_ID_URL + templateFile.id).then(function(result) {
            if (result.succeeded) {
                msgboxService.createMessageBox("prompt", "Submit succeeded", {}, "success");
                $scope.templateFiles.draft.pop(templateFile);
            } else {
                msgboxService.createMessageBox("prompt", result.message, {}, "error");
            }
        });
    }

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
