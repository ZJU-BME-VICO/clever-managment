angular.module('clever.management.directives.editDefinitionPane', []).directive('editDefinitionPane',
  function(archetypeSerializeService, archetypeEditService, archetypeParseEditService, rmFactoryService, $timeout, toaster) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        definition: '=',
        ontology: '=',
        language: '=',
        maxHeight: '=',
        isExpandedAll: '=',
        currentArchetypeId: '=',

      },
      templateUrl: 'js/directives/archetype-edit-directives/definition-pane/edit.definition.pane.html',

      controller: function($scope, $element, $attrs) {

        var editor = archetypeEditService;
        var parser = archetypeParseEditService;
        $scope.treeControl = {};
        $scope.isCollapse = true;
        $scope.$watch('isExpandedAll.value', function(newValue, oldValue) {
          if ($scope.treeControl.expandAll) {
            if (newValue) {
              $scope.treeControl.expandAll();
            } else {
              $scope.treeControl.collapseAll();
            }
          }
        });

        $scope.$watch('currentArchetypeId', function(
          newValue) {
          $scope.currentNode = undefined;
          $scope.ontologyItem = undefined;
        });

        $scope.$watch('archetypeTreeNodeFilter', function(newValue) {
          if (newValue != undefined) {
            $scope.treeControl.search(newValue);
          }
        });

        $scope.searchKeyMapper = function(node) {
          return $scope.getLabelContent(node);
        };
        $scope.selectNode = function(node) {
          $scope.currentNode = node;
          console
            .log("this is selected node in definition tree!");
          console.log(node);
          $scope.ontologyItem = getOntologyItemByCode(
            node.label.code, $scope.ontology);

        };

        /**
         * when display the type in this type list,we want
         * it to display the parentAttribue text
         */
        //  var typeWithSlot = ['ITEM_TREE', 'ITEM_LIST', 'CLUSTER'];
        //  var typeWithInterval = ['ITEM_TREE', 'ITEM_LIST', 'CLUSTER'];

        // $scope.getTreeNodeMenu = function(node, aliasName) {
        //     var menuList;
        //     var menuHtml = '<ul class="dropdown-menu" role="menu" ng-if="true" >';

        //     /**
        //      * if the node type is slot, it's pictype will be ITEM,CLUSTER...,so we should distinguish it with other CLUSTER and so on..
        //      */
        //     if (node.label.slot) {
        //         menuHtml += '<li class="menu-item ">' + '<span class="clever-icon list delete" style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<a class="pointer" role="menuitem"  ng-click="operateNodeByContextMenu(' + aliasName + ', ' + '\'delete\')" >Delete</a></li>';
        //     } else {
        //         if (typeWithSlot.indexOf(node.label.picType) != -1) {
        //             menuHtml += '<li class="menu-item dropdown dropdown-submenu"  style="margin-right:18px" ng-if="item==slot"><span class="clever-icon list slot" style="padding: 7px 10px; background-position-y: 10px;"></span><a class="dropdown-toogle" data-toogle="dropdown">Slot</a>' + '<ul class="dropdown-menu">';
        //             angular.forEach($scope.nodeMenu.baseSlotType, function(menuItem) {
        //                 menuHtml += '<li class="menu-item ">' + '<span class="clever-icon list" ng-class="\'' + menuItem
        //                     .toLowerCase() + '\'| typemap" style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<a class="pointer" role="menuitem"  ng-click="operateNodeByContextMenu(' + aliasName + ', ' + '\'' + 'BS_' + menuItem + '\')">' + menuItem + '</a></li>';
        //             });
        //             menuHtml += '</ul></li>';
        //         }

        //         /**
        //          * if the pictype if section, the sub menu
        //          * shoule be section slot type
        //          */
        //         if (node.label.picType == 'SECTION') {
        //             menuHtml += '<li class="menu-item dropdown dropdown-submenu" ng-if="item==slot"><a class="dropdown-toogle" data-toogle="dropdown">Slot</a>' + '<ul class="dropdown-menu">';
        //             angular
        //                 .forEach($scope.nodeMenu.sectionSlotType, function(menuItem) {
        //                     menuHtml += '<li class="menu-item ">' + '<span class="clever-icon list" ng-class="\'' + menuItem
        //                         .toLowerCase() + '\'| typemap" style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<a class="pointer" role="menuitem"  ng-click="operateNodeByContextMenu(' + aliasName + ', ' + '\'' + 'SS_' + menuItem + '\')">' + menuItem + '</a></li>';
        //                 });
        //             menuHtml += '</ul></li>';
        //         }
        //         /**
        //          * add the interval submenu
        //          */
        //         if (typeWithInterval
        //             .indexOf(node.label.picType) != -1) {
        //             menuHtml += '<li class="menu-item dropdown dropdown-submenu"  style="margin-right:18px"  ng-if="item==slot"><span class="clever-icon list interval" style="padding: 7px 10px; background-position-y: 10px;"></span><a class="dropdown-toogle" data-toogle="dropdown">Interval</a>' + '<ul class="dropdown-menu">';
        //             angular
        //                 .forEach($scope.nodeMenu.intervalType, function(menuItem) {
        //                     menuHtml += '<li class="menu-item ">' + '<span class="clever-icon list" ng-class="\'' + menuItem
        //                         .toLowerCase() + '\'| typemap" style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<a class="pointer" role="menuitem"  ng-click="operateNodeByContextMenu(' + aliasName + ', ' + '\'' + intervalTypeMap[menuItem] + '\')">' + menuItem + '</a></li>';
        //                 });
        //             menuHtml += '</ul></li>';
        //         }
        //         /**
        //          * add normal menu
        //          */
        //         angular
        //             .forEach($scope.nodeMenu[node.label.picType], function(menuItem) {
        //                 menuHtml += '<li class="menu-item ">' + '<span class="clever-icon list" ng-class="\'' + menuItem
        //                     .toLowerCase() + '\'| typemap" style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<a class="pointer" role="menuitem"  ng-click="operateNodeByContextMenu(' + aliasName + ', ' + '\'' + menuItem + '\')">' + menuItem + '</a></li>';
        //             });

        //         /**
        //          * if the node parent does not exist, so the
        //          * node should be archetype node, it can not
        //          * be delete
        //          */
        //         if (node.parent) {
        //             menuHtml += '<li class="menu-item ">' + '<span class="clever-icon list delete" style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<a class="pointer" role="menuitem"  ng-click="operateNodeByContextMenu(' + aliasName + ', ' + '\'delete\')" >Delete</a></li>';

        //         }

        //     }
        //     menuHtml += '</ul>';
        //     return menuHtml;
        // };

        /**
         * use the information in node, get a rm_object from
         * rmFactoryService, and use this object's menu
         * type to generate a menu array
         *
         * @param {object} type The type of the rmObeject
         */
        function createRmObejct(type) {
          if (rmFactoryService[type]) {
            return new rmFactoryService[type];
          } else {
            console.log('Can not create a rmObejct with type ' + type);
          }
        }

        /**
         * collect all inherit object of the rmObject which is a 'type'. and use a recursion
         * to get the inherit object of the inherit object
         *
         * eg. With the 'ITEM' as a type, we can get the object array [ELEMENT, CLUSTER]
         *
         * @param {object} type The type of the rmObejct
         * @return An array consist of all inherit object and the grandInherit object and ...
         */
        function collectInheritObjectWithType(type) {

          var array = [];
          var inheritArray = rmFactoryService.inheritMap[type];
          if (inheritArray) {
            var temp = createRmObejct(type);
            if (temp && temp.isAbstract != true) {
              array.push(temp);
            }
            angular.forEach(inheritArray, function(inheritType) {
              angular.forEach(collectInheritObjectWithType(inheritType), function(value) {
                array.push(value);
              })

            })
          } else {
            var grandChildren = createRmObejct(type);
            array.push(grandChildren);
          }
          return array;
        }
        /**
         * use objects to generate an array consist of all the inherit type of the obejcts's attribute type.
         * Firstly, get the attribute's children type as TYPE. It can be infer that the attributes of an object
         * who's parent's menuType is LEAPFROG, the parent's attributes length should be one, and the attributes
         * length of the object should be one too.
         * Secondly, use TYPE to call collectInheritContentWithType to generate the inherit types.
         *
         * eg. We get the objects [ELEMENT, CLUSTER]. We get the attribute type of each object and use the types to
         * generate its inherit type with a string array, then add all type to a set(make sure that the type in this
         * set is unique)
         *
         * @param {Obejct} objects The object array or an object used to generate its inherit type
         */
        function collectInheritContentWithObjects(objects) {

          var inheritSet = new Set();
          if (angular.isArray(objects)) {
            angular.forEach(objects, function(obj) {
              if (obj.attributes.length == 1) {
                angular.forEach(collectInheritContentWithType(obj.attributes[0]['@children'].type), function(value) {
                  inheritSet.add(value);
                })

              } else {
                console.log('for LEAPFROG menuType, the attributes of object should have only one item');
              }
            })
          } else {
            inheritSet = collectInheritContentWithObjects([obejcts]);
          }
          return inheritSet;
        }

        /**
         * collect a inherit array with type. use a recursion to get the inherit types of a inherit type and ..
         * add all types to a set(make sure that the element in set is unique)
         *
         * eg. With 'DATA_VALUE' as a type, we can get all its inherit type['DV_TEXT', 'DV_BOOLEAN'..] and add the
         * all inherit type of DV_TEXT: DV_CODED_TEXT. finally -->['DV_TEXT', 'DV_CODED_TEXT', 'DV_BOOLEAN'...]
         * @param {string} type The type used to generate the inherit type
         * @returns A set consist of all inherit type(a string) of type recursively
         */
        function collectInheritContentWithType(type) {
          var tempSet = new Set();
          var inheritArray = rmFactoryService.inheritMap[type];

          angular.forEach(inheritArray, function(value) {
            var tempArray = collectInheritContentWithType(value);
            angular.forEach(tempArray, function(val) {
              tempSet.add(val);
            });
          });
          angular.forEach(inheritArray, function(value) {
            var rmObject = rmFactoryService[value] && new rmFactoryService[value];
            if (rmObject && !rmObject.isAbstract) {
              tempSet.add(value);
            }
          })
          console.log(type);
          var typeObject = new rmFactoryService[type];
          if (!typeObject.isAbstract) {
            tempSet.add(type);
          }
          return tempSet;
        }

        function generateAttributeMenu(node, rmObject, aliasName) {
          var menuHtml = '';
          angular.forEach(rmObject.attributes, function(attribute) {
            if (!attribute['@required']) {
              menuHtml += '<li class="menu-item ">' + '<span class="clever-icon attribute"' + ' style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<a class="pointer" role="menuitem"  ng-click="operateNodeByContextMenu(' + aliasName + ', ' + '\'' + attribute.name + '\' , \'attribute\')">' + attribute.name + '</a></li>';
            }
          });
          return menuHtml;
        }

        function generateTypeMenu(menuItemArray, aliasName) {
          var menuHtml = '';
          angular.forEach(menuItemArray, function(menuItem) {
            var tempObject = rmFactoryService[menuItem] && new rmFactoryService[menuItem];
            if (tempObject) {
              if (tempObject.templateTypes) {
                //add submenu here
                menuHtml += '<li class="menu-item dropdown dropdown-submenu"  style="margin-right:18px"  ng-if="item==slot"><span class="clever-icon list "' + 'ng-class="\'' + menuItem + '\'| typemap"' + ' style="padding: 7px 10px; background-position-y: 10px;"></span><a class="dropdown-toogle" data-toogle="dropdown">' + '{{\'' + menuItem + '\'| typemap2display}}' + '</a><ul class="dropdown-menu">';
                angular.forEach(tempObject.templateTypes, function(submenuItem) {
                  menuHtml += '<li class="menu-item ">' + '<span class="clever-icon list" ng-class="\'' + submenuItem + '\'| typemap" style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<a class="pointer" role="menuitem"  ng-click="operateNodeByContextMenu(' + aliasName + ', ' + '\'' + submenuItem + '\' , \'type\')">' + '{{\'' + submenuItem + '\'| typemap2display}}' + '</a></li>';
                })
                menuHtml += '</ul></li>';
              } else {
                menuHtml += '<li class="menu-item ">' + '<span class="clever-icon list"' + 'ng-class=" \'' + menuItem + '\'| typemap "' + '" style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<a class="pointer" role="menuitem"  ng-click="operateNodeByContextMenu(' + aliasName + ', ' + '\'' + menuItem + '\' , \'type\')">' + '{{\'' + menuItem + '\'| typemap2display}}' + '</a></li>';
              }
            }
          })
          return menuHtml;
        }


        $scope.getTreeNodeMenu = function(node, aliasName) {
          var nodeText = node.label.picType;
          var menuHtml = '<ul class="dropdown-menu" role="menu">';
          if (node.label.type == 'type' && !node.label.slot) {
            /* create the reference object with type */
            var rmObject = rmFactoryService[nodeText] && new rmFactoryService[nodeText];
            if (rmObject) {
              if (rmObject.menuType == 'ATTRIBUTE') {
                menuHtml += generateAttributeMenu(node, rmObject, aliasName);
              }
              /**
               * for LEAPGROG menuType, firstly get the childrenType of attribtue(should have only one), and
               * find all inherit type of this type, return as a obejct array , then find all childrenType of these object's
               * attribute, if  the childrenType is not a Abstract type, add it to the menuHtml.
               */
              else if (rmObject.menuType == 'LEAPFROG') {
                if (rmObject.attributes.length == 1) {
                  var childrenType = rmObject.attributes[0]['@children'].type;
                  var childrenArray = collectInheritObjectWithType(childrenType);
                  var menuItemArray = collectInheritContentWithObjects(childrenArray);
                  menuHtml += generateTypeMenu(menuItemArray, aliasName);
                } else {
                  console.log("error: if the obejct's menuType is LEAPFROG, it should have only one attribute");
                }
              }
            } else {
              console.log('Can not create a rmObejct with type ' + nodeText);
            }

          } else if (node.label.type == 'attribute') {
            var nodeParent = node.parent;
            var rmObject = rmFactoryService[nodeParent.label.text] && new rmFactoryService[nodeParent.label.text];
            if (rmObject) {

              var attribute = rmFactoryService.getAttribute(rmObject, nodeText);
              /* find the attribute in rmObject */
              if (attribute) {
                /* generate menuHtml directly if the children of an attribute is an array*/
                if (attribute['@children'].isArray) {
                  var menuItemArray = collectInheritContentWithType(attribute['@children'].type);
                  menuHtml += generateTypeMenu(menuItemArray, aliasName);
                }
                /**
                 * if the children is not an array, check if its a abstract type(if it is, when we create an Archetype or add a node, we
                 *won't add children for this attritbue), add the menuHtml for true
                 */
                else {
                  var childrenType = attribute['@children'].type;
                  var tempObject = rmFactoryService[childrenType] && new rmFactoryService[childrenType];
                  if (tempObject && tempObject.isAbstract) {
                    var menuItemArray = collectInheritContentWithType(childrenType);
                    menuHtml += generateTypeMenu(menuItemArray, aliasName);
                  }
                }
              } else {
                console.log('can not find attribute ' + nodeText + ' from nodeParent :');
                console.log(node);
              }

            } else {
              console.log('Can not create a rmObejct with type ' + nodeParent.label.text);
            }

          }
          /* delete menu for node wchih is not a archetype node*/
          if (!node.label.archetypeNode) {
            menuHtml += '<li class="menu-item ">' + '<span class="clever-icon list delete "' + ' style="padding: 7px 10px; background-position-y: 10px;"></span>' + '<a class="pointer" role="menuitem"  ng-click="operateNodeByContextMenu(' + aliasName + ', ' + '\'delete\')">' + 'Delete' + '</a></li>';

          }
          menuHtml += '</ul>';
          return menuHtml;
        }




        /**
         * there would not a items attributs behind this
         * type, so when we add a type to this node , a
         * items attribute should be added;
         */
        $scope.editArchetype = function(node, menuContent, type) {
          console.log("edit Archetype node " + node.label.text + "with type " + menuContent + "which is a " + type);

          if (menuContent == 'delete') {
            if (isDeleteable(node)) {
              deleteNode(node);
            } else {
              toaster.pop('error', 'Eror', 'can not delete this node: ' + node.label.text + ', because this node is required!');
            }
          }

          if (type == 'attribute') {
            //  console.log($scope.ontology);
            if (!isAttributeAlreadyExist(menuContent, node)) {
              var attribute = editor.generateAttribtue(menuContent, node.label.picType);
              addAttributeToNode(node, attribute);
              //console.log(attribute);
            } else {
              toaster.pop('error', 'Eror', 'failure to add the attribute: ' + menuContent + ' Because it is already exist!');
            }
          }

          if (type == 'type') {
            if (node.label.type == 'attribute') {
              var rmObject = new rmFactoryService[node.parent.label.picType];
              var attribute = rmFactoryService.getAttribute(rmObject, node.label.text);
              console.log(attribute);
              if (attribute['@children'].isArray || node.children.length == 0 || !node.children) {
                var cobject = editor.generateCObjectWithParsedOntology(menuContent, $scope.ontology);
                addCObjectToAttributeNode(node, cobject);
              } else {
                toaster.pop('error', 'Eror', 'failure to add the object: ' + menuContent + ' Because the chidren of the' + attribute.name + 'already exist!');
              }
              /* menu type is LEAPGROG */
            } else if (node.label.type == 'type') {
              var parentType = node.label.picType;
              var parent = new rmFactoryService[parentType];
              var parentAttribtueType = parent.attributes[0]['@children'].type;
              /* get the childrenTypeArray */
              var childrenTypeSet = collectInheritContentWithType(parentAttribtueType);
              console.log(childrenTypeSet);
              // if (!(new rmFactoryService[parentAttribtueType]).isAbstract) {
              //   childrenTypeArray.push(parentAttribtueType);
              // }

              if (childrenTypeSet.has(menuContent)) {
                /* add element and cluster */
                var cobject = editor.generateCObjectWithParsedOntology(menuContent, $scope.ontology);
                addCObjectToTypeNode(node, cobject);

              } else {
                angular.forEach(childrenTypeSet, function(childrenType) {
                  var tempSet = collectInheritContentWithType((new rmFactoryService[childrenType]).attributes[0]['@children'].type);
                  console.log(tempSet);
                  if (tempSet.has(menuContent)) {
                    /* add element and dv_text here */
                    var childCObject = editor.generateCObjectWithParsedOntology(childrenType, $scope.ontology);
                    //  addCObjectToTypeNode(node, childCObject);

                    var grandChildCObject = editor.generateCObjectWithParsedOntology(menuContent, $scope.ontology);
                    childCObject.attributes[0].children.push(grandChildCObject);
                    addCObjectToTypeNode(node, childCObject);
                  }
                })
              }

              //  console.log(childrenTypeArray);

            }
          }

        }

        function addCObjectToAttributeNode(node, cobject) {
          //  node.oriNodeRef.children.push(cobject);
          node.oriNodeRef.children = editor.pushElementToArray(cobject, node.oriNodeRef.children);
          $scope.treeControl
            .locateNode(parser.myProcessNode(cobject, node, node.children, $scope.ontology.term_definitions, undefined));
        }

        function addCObjectToTypeNode(node, cobject) {
          var atttribute;
          if (angular.isArray(node.oriNodeRef.attributes)) {
            attribute = node.oriNodeRef.attributes[0];
          } else {
            attribute = node.oriNodeRef.attributes;
          }
          attribute.children = editor.pushElementToArray(cobject, attribute.children);
          $scope.treeControl
            .locateNode(parser.myProcessNode(cobject, node, node.children, $scope.ontology.term_definitions, node.childrenAttribute));
        }

        function addAttributeToNode(node, attribute) {
          var nodeAttributes = node.oriNodeRef.attributes;
          node.oriNodeRef.attributes = editor.pushElementToArray(attribute, node.oriNodeRef.attributes)
            // if (nodeAttributes) {
            //   if (angular.isArray(nodeAttributes)) {
            //     node.oriNodeRef.attributes.push(attribute);
            //   } else {
            //     var temp = [nodeAttributes, attribute];
            //     node.oriNodeRef.attributes = temp;
            //   }
            // } else {
            //   node.oriNodeRef.attributes = [attribute];
            // }
          parser.processAttribute(attribute, node, node.children, $scope.ontology.term_definitions, parser.KEEPATTRIBUTE);
        }

        function isAttributeAlreadyExist(attributeName, node) {
          return node.children.find(function(child) {
            return child.label.text == attributeName;
          }) ? true : false;
        }

        function isObjectAlreadyExist(node) {
          return node.children.length > 0;
        }

        function isDeleteable(node) {
          if (node.label.type == 'attribute') {
            var parentType = node.parent.label.picType;
            var parentObject = new rmFactoryService[parentType];

            var attribute = rmFactoryService.getAttribute(parentObject, node.label.text);
            if (attribute['@required']) {
              return false;
            } else {
              return true;
            }

          } else if (node.label.type == 'type') {
            return true;
          }
        }
        var needCheckedType = ['ITEM_TREE', 'ITEM_LIST',
          'ITEM_TABLE', 'CLUSTER', 'SECTION'
        ];
        var checkList = ['SECTION'];
        $scope.editArchetypes = function(node, type) {

          if (needCheckedType.indexOf(node.label.picType) != -1) {
            if (node.oriNodeRef.attributes && node.childrenAttribute) {
              // return;
            } else if ((!node.oriNodeRef.attributes || node.oriNodeRef.attributes.length == 0) && !node.childrenAttribute) {
              var multiAttribute = editor
                .getCMultipleAttribute(
                  null,
                  editor
                  .getDefaultCardinality(1),
                  editor
                  .getDefaultExistence(
                    1, 1),
                  "items");
              node.oriNodeRef.attributes = multiAttribute;
              parser
                .processAttribute(
                  multiAttribute,
                  node,
                  node.children,
                  $scope.ontology.term_definitions);
            }
          }

          type = type.toLowerCase();
          // normalize the type
          var resultNode;
          switch (type) {
            case "otherparticipations":
              resultNode = addOtherParticipations(node);
              break;
            case "participation":
              resultNode = addParticipation(node);
              break;
            case "subject":
              resultNode = addSubject(node);
              break;
              // subject:['PARTY_SELF','PARTY_IDENTIFIED','PARTY_RELATED'],
            case "party_self":
              resultNode = addPartySelf(node);
              break;
            case "party_identified":
              resultNode = addPartyIdentified(node);
              break;
            case "party_related":
              resultNode = addPartyRelated(node);
              break;
            case "links":
              resultNode = addLinks(node);
              break;
            case "link":
              resultNode = addLink(node);
              break;
            case "protocol":
              resultNode = addProtocol(node);
              break;

              // --------action--------
            case "ism_transitions":
              resultNode = addIsmTransitions(node);
              break;
            case "ism_transition":
              resultNode = addIsmTransition(node);
              break;

              // --------instruction-----
            case "activity":
              resultNode = addActivity(node);
              break;

              // --------observation--------
            case "data":
              resultNode = addData(node);
              break;
            case "state":
              resultNode = addState(node);
              break;
            case "event_state":
              resultNode = addStateToEvent(node);
              break;
            case "event":
              resultNode = addEvent(node);
              break;

              // ---------section---------
            case 'sub_section':
              resultNode = addSubSection(node);
              break;
              // ss means section slot
            case 'ss_action':
            case 'ss_observation':
            case 'ss_admin_entry':
            case 'ss_instruction':
            case 'ss_evaluation':
            case 'ss_entry':
            case 'ss_section':
              resultNode = addSectionSlot(node, type
                .slice(3, type.length)
                .toUpperCase());
              break;

              // ---------composition--------
            case 'context':
              resultNode = addContext(node);
              break;
            case 'content':
              resultNode = addContent(node);
              break;

              // ------------base type--------
            case "text":
              var element = addText(node);
              resultNode = element;
              break;

            case "coded text":
              resultNode = addCodedText(node);
              break;

            case "quantity":
              resultNode = addQuantity(node);
              break;

            case "count":
              resultNode = addCount(node);
              break;

            case "date time":
              resultNode = addDateTime(node);
              break;

            case "duration":
              resultNode = addDuration(node);
              break;

            case "ordinal":
              resultNode = addOrdinal(node);
              break;

            case "boolean":
              resultNode = addBoolean(node);
              break;

            case "interval_quantity":
              resultNode = addInterval_quantity(node);
              break;

            case "interval_count":
              resultNode = addInterval_integer(node);
              break;

            case "interval_datetime":
              resultNode = addInterval_dateTime(node);
              break;

            case "multimedia":
              resultNode = addMultimedia(node);
              break;

            case "uri":
              resultNode = addUri(node);
              break;

            case "identifier":
              resultNode = addIdentifier(node);
              break;

            case "proportion":
              resultNode = addProportion(node);
              break;
            case "parsable":
              resultNode = addParsable(node);
              break;
            case "cluster":
              resultNode = addCluster(node);
              break;
              // bs : base type slot
            case "bs_element":
            case "bs_cluster":
            case "bs_item":
              resultNode = addBaseSlot(node, type.slice(
                3, type.length).toUpperCase());
              break;
            case "delete":
              deleteNode(node);
              break;
              // -----------base type end--------------

          }

          if (resultNode) {
            console.log(resultNode);
            setTimeout(function() {
              $scope.treeControl
                .locateNode(resultNode);
              $scope.$digest();
            }, 0);
          }

        };

        function addSectionSlot(node, type) {
          var nodeId = getNextNodeId();

          var slot = editor.getArchetypeSlot(type,
            nodeId, editor.getDefaultOccurrences(0,
              '*'), editor.defaultIncludes,
            undefined);
          node.oriNodeRef.attributes.children = pushTo(
            slot,
            node.oriNodeRef.attributes.children);

          editor.synchronizeOntology($scope.ontology,
            nodeId, "SLOT_" + type, "*");
          return parser.myProcessNode(slot, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);
        }

        function addSubSection(node) {
          var nodeId = getNextNodeId();
          var subSection = editor.getCComplexObject(null,
            nodeId, editor.getDefaultOccurrences(0,
              1), "SECTION");
          node.oriNodeRef.attributes.children = pushTo(
            subSection,
            node.oriNodeRef.attributes.children);

          editor.synchronizeOntology($scope.ontology,
            nodeId, "sub_Section", "*");
          return parser.myProcessNode(subSection, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);

        }

        // -------------archetype common attribute added
        // function------
        // protocol function

        function addProtocol(node) {
          var nodeId = getNextNodeId();
          var Item_tree = getITEM_TREE(nodeId);
          var protocol = editor.getCSingleAttribute(
            Item_tree, editor.getDefaultExistence(
              1, 1), "protocol");
          node.oriNodeRef.attributes = pushTo(protocol,
            node.oriNodeRef.attributes);

          editor.synchronizeOntology($scope.ontology,
            nodeId, "Tree", "@ internal @");
          return parser.processAttribute(protocol, node,
            node.children,
            $scope.ontology.term_definitions);
        }

        function getITEM_TREE(nodeId) {
          return editor.getCComplexObject(null, nodeId,
            editor.getDefaultOccurrences(1, 1),
            "ITEM_TREE");
        }

        // subject function
        function addSubject(node) {
          var subjectAttribute = editor
            .getCSingleAttribute(null, editor
              .getDefaultExistence(1, 1),
              "subject");
          node.oriNodeRef.attributes = pushTo(
            subjectAttribute,
            node.oriNodeRef.attributes);

          return parser.processAttribute(
            subjectAttribute, node, node.children,
            $scope.ontology.term_definitions);
          // return subjectAttribute;
        }

        // children type node follow the subject
        // PARTY_SELF, PARTY_IDENTIFIED, PARTY_RELATED
        function addPartySelf(node) {
          var nodeId = getNextNodeId();
          var genericId = editor.getCComplexObject(null,
            "", editor.getDefaultOccurrences(1, 1),
            "GENERIC_ID");
          var id = editor.getCSingleAttribute(genericId,
            editor.getDefaultExistence(1, 1), "id");
          var PARTY_REF = editor.getCComplexObject(id,
            "", editor.getDefaultOccurrences(1, 1),
            "PARTY_REF");
          var externalRef = editor.getCSingleAttribute(
            PARTY_REF, editor.getDefaultExistence(
              1, 1), "externalRef");
          var PARTY_SELF = editor.getCComplexObject(
            externalRef, nodeId, editor
            .getDefaultOccurrences(1, 1),
            "PARTY_SELF");
          node.oriNodeRef.children = pushTo(PARTY_SELF,
            node.oriNodeRef.children);

          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Party_Self", "*");
          return parser.myProcessNode(PARTY_SELF, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);

        }

        function addPartyIdentified(node) {
          var PARTY_IDNENTIFIED = editor
            .getCComplexObject(null, "", editor
              .getDefaultOccurrences(0, 1),
              "PARTY_IDENTIFIED");
          node.oriNodeRef.children = pushTo(
            PARTY_IDNENTIFIED,
            node.oriNodeRef.children);

          return parser.myProcessNode(PARTY_IDNENTIFIED,
            node, node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);
        }

        function addPartyRelated(node) {
          var DV_CODED_TEXT = getDV_CODED_TEXT();
          var relationship = editor.getCSingleAttribute(
            DV_CODED_TEXT, editor
            .getDefaultExistence(1, 1),
            "relationship");
          var PARTY_RELATED = editor.getCComplexObject(
            relationship, "", editor
            .getDefaultOccurrences(1, 1),
            "PARTY_RELATED");

          node.oriNodeRef.children = pushTo(
            PARTY_RELATED, node.oriNodeRef.children);
          return parser.myProcessNode(PARTY_RELATED,
            node, node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);

        }

        // subject function end

        // -----------------participation
        // function--------------------------------

        function addOtherParticipations(node) {
          var nodeId = getNextNodeId();
          var parObject = editor.getCComplexObject(null,
            nodeId, editor.getDefaultOccurrences(0,
              1), "PARTICIPATION");
          var otherParAttribute = editor
            .getCMultipleAttribute(
              parObject,
              editor.getDefaultCardinality(1),
              editor
              .getDefaultExistence(1,
                1),
              "otherParticipations");

          node.oriNodeRef.attributes = pushTo(
            otherParAttribute,
            node.oriNodeRef.attributes);
          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Participation", "*");
          return parser.processAttribute(
            otherParAttribute, node, node.children,
            $scope.ontology.term_definitions);
        }

        function addParticipation(node) {
          var nodeId = getNextNodeId();
          var performer = editor.getCSingleAttribute(
            null, editor.getDefaultExistence(1, 1),
            "performer");
          var participation = editor.getCComplexObject(
            [performer], nodeId, editor
            .getDefaultOccurrences(0, 1),
            "PARTICIPATION");

          node.oriNodeRef.children = pushTo(
            participation, node.oriNodeRef.children);
          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Participation", "*");
          return parser.myProcessNode(participation,
            node, node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);
        }

        // participation function end

        // links function
        function addLinks(node) {
          // var links = editor.getCSingleAttribute(null,
          // editor.getDefaultExistence(0, 1), "links");
          var links = editor.getMultyAttr(null, 0, [0, 1], "links");
          node.oriNodeRef.attributes = pushTo(links,
            node.oriNodeRef.attributes);
          return parser.processAttribute(links, node,
            node.children,
            $scope.ontology.term_definitions);
        }

        function addLink(node) {
          var nodeId = getNextNodeId();
          var meaningString = editor.getPrimitiveString();
          var value = editor.getSingleAttr(meaningString, [1, 1], 'value');
          var DV_TEXT = getDV_TEXT(value);
          var meaning = editor.getCSingleAttribute(
            DV_TEXT, editor.getDefaultExistence(1,
              1), "meaning");
          var uriString = editor.getPrimitiveString();
          var value = editor.getSingleAttr(uriString, [
            1, 1
          ], 'value');
          var DV_EHR_URI = getDV_EHR_URI(value);
          var target = editor.getCSingleAttribute(
            DV_EHR_URI, editor.getDefaultExistence(
              0, 1), "target");
          var LINK = editor.getCComplexObject([meaning,
              target
            ], nodeId, editor
            .getDefaultOccurrences(0, "*"), "LINK");

          node.oriNodeRef.children = pushTo(LINK,
            node.oriNodeRef.children);
          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Link", "*");
          return parser.myProcessNode(LINK, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);

        }

        // link function end

        function addContext(node) {
          var nodeId = getNextNodeId();
          var itemTree = getITEM_TREE(nodeId);
          var otherContext = editor.getCSingleAttribute(
            itemTree, editor.getDefaultExistence(1,
              1), 'other_context');
          var EVENT_CONTEXT = editor.getCComplexObject(
            otherContext, '', editor
            .getDefaultOccurrences(1, 1),
            'EVENT_CONTEXT');
          var context = editor.getCSingleAttribute(
            EVENT_CONTEXT, editor
            .getDefaultExistence(1, 1),
            'context');

          editor.synchronizeOntology($scope.ontology,
            nodeId, "Tree", "*");
          node.oriNodeRef.attributes = pushTo(context,
            node.oriNodeRef.attributes);
          var returnObj = parser.processAttribute(
            context, node, node.children,
            $scope.ontology.term_definitions);
          return returnObj;
        }

        function addContent(node) {
          var content = editor.getCSingleAttribute(null,
            editor.getDefaultExistence(1, 1),
            'content');
          node.oriNodeRef.attributes = pushTo(content,
            node.oriNodeRef.attributes);

          return parser.processAttribute(content, node,
            node.children,
            $scope.ontology.term_definitions);
        }

        // ------------attribute for action
        // archetype--------------------

        function addIsmTransitions(node) {
          var ism_transition = editor
            .getCSingleAttribute(null, editor
              .getDefaultExistence(1, 1),
              "ism_transition");

          node.oriNodeRef.attributes = pushTo(
            ism_transition,
            node.oriNodeRef.attributes);
          return parser.processAttribute(ism_transition,
            node, node.children,
            $scope.ontology.term_definitions);
        }

        function addIsmTransition(node) {
          var nodeId = getNextNodeId();
          var DV_CODED_TEXT_1 = getDV_CODED_TEXT();
          var current_state = editor.getCSingleAttribute(
            DV_CODED_TEXT_1, editor
            .getDefaultExistence(1, 1),
            "current_state");
          var DV_CODED_TEXT_2 = getDV_CODED_TEXT();
          var careflow_step = editor.getCSingleAttribute(
            DV_CODED_TEXT_2, editor
            .getDefaultExistence(1, 1),
            "careflow_step");
          var ISM_TRANSITION = editor.getCComplexObject([
              current_state, careflow_step
            ], nodeId,
            editor.getDefaultOccurrences(1, 1),
            "ISM_TRANSITION");

          node.oriNodeRef.children = pushTo(
            ISM_TRANSITION,
            node.oriNodeRef.children);
          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Ism_Transition", "*");
          return parser.myProcessNode(ISM_TRANSITION,
            node, node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);
        }

        // -------------------instruction
        // archetype-----------------

        function addActivity(node) {
          var nodeId_tree = getNextNodeId();
          var ItemTree = getITEM_TREE(nodeId_tree);
          editor.synchronizeOntology($scope.ontology,
            nodeId_tree, "Tree", "*");
          var nodeId_acti = getNextNodeId();
          var description = editor.getCSingleAttribute(
            ItemTree, editor.getDefaultExistence(1,
              1), "description");
          var activityObject = editor.getCComplexObject(
            description, nodeId_acti, editor
            .getDefaultOccurrences(0, 1),
            "ACTIVITY");
          editor.synchronizeOntology($scope.ontology,
            nodeId_acti, "New Acitivity", "*");

          node.oriNodeRef.children = pushTo(
            activityObject,
            node.oriNodeRef.children);

          return parser.myProcessNode(activityObject,
            node, node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);
        }

        // -------------observation
        // archetype-----------------------------

        function getPath(event) {

          var dataPath;
          var statePath;
          if (angular.isArray(event.attributes)) {
            angular
              .forEach(
                event.attributes,
                function(attribute) {
                  if (attribute.rm_attribute_name == "data") {
                    dataPath = attribute.children.idPath;
                  }
                  if (attribute.rm_attribute_name == "state") {
                    statePath = attribute.children.idPath;
                  }
                });
          } else {
            attribute = event.attributes;
            if (attribute.rm_attribute_name == "data") {
              dataPath = attribute.children.idPath;
            }
            if (attribute.rm_attribute_name == "state") {
              statePath = attribute.children.idPath;
            }
          }
          return {
            dataPath: dataPath,
            statePath: statePath,
          };
        }

        function addEvent(node) {
          var path;
          var amiEvent;
          if (angular.isArray(node.oriNodeRef.children)) {
            aimEvent = node.oriNodeRef.children[0];
          } else {
            aimEvent = node.oriNodeRef.children;

          }

          path = getPath(aimEvent);

          var nodeId = getNextNodeId();
          var EVENT = editor.getCComplexObject(null,
            nodeId, editor.getDefaultOccurrences(1,
              1), "EVENT");
          if (path.dataPath) {
            var dataRef = editor
              .getArchetypeInternalRef(
                'ITEM_TREE',
                editor
                .getDefaultOccurrences(
                  1, 1),
                path.dataPath);
            var dataAttr = editor.getCSingleAttribute(
              dataRef, editor
              .getDefaultExistence(1, 1),
              "data");
            // EVENT.attributes.push(dataAttr);
            EVENT.attributes = pushTo(dataAttr,
              EVENT.attributes);
          }
          if (path.statePath) {
            var stateRef = editor
              .getArchetypeInternalRef(
                'ITEM_TREE',
                editor
                .getDefaultOccurrences(
                  1, 1),
                path.statePath);
            var stateAttr = editor.getCSingleAttribute(
              stateRef, editor
              .getDefaultExistence(1, 1),
              "state");
            // EVENT.attributes.push(stateAttr);
            EVENT.attributes = pushTo(dataAttr,
              EVENT.attributes);
          }

          editor.synchronizeOntology($scope.ontology,
            nodeId, "Any Events", "*");
          node.oriNodeRef.children = pushTo(EVENT,
            node.oriNodeRef.children);
          return parser.myProcessNode(EVENT, node,
            node.children,
            $scope.ontology.term_definitions);

        }

        function addState(node) {
          var HISTORY = getHISTORY($scope.ontology);
          var stateAttribute = editor
            .getCSingleAttribute(HISTORY, editor
              .getDefaultExistence(1, 1),
              "state");

          node.oriNodeRef.attributes = pushTo(
            stateAttribute,
            node.oriNodeRef.attributes);
          return parser.processAttribute(stateAttribute,
            node, node.children,
            $scope.ontology.term_definitions);
          // return stateAttribute;

        }

        function synchronizeOtherEvents(node) {
          var oriEvents = node.parent.oriNodeRef.children;
          var disEvents = node.parent.children;
          if (angular.isArray(oriEvents) && oriEvents.length > 1) {
            path = getPath(oriEvents[0]);
            for (var i = 1; i < oriEvents.length; i++) {
              if (path.statePath) {
                var stateRef = editor
                  .getArchetypeInternalRef(
                    'ITEM_TREE',
                    editor
                    .getDefaultOccurrences(
                      1,
                      1),
                    path.statePath);
                var stateAttr = editor
                  .getCSingleAttribute(
                    stateRef,
                    editor
                    .getDefaultExistence(
                      1,
                      1),
                    "state");
                // oriEvents[i].attributes.push(stateAttr);
                oriEvents[i].attributes = pushTo(
                  stateAttr,
                  oriEvents[i].attributes);
                parser
                  .processAttribute(
                    stateAttr,
                    disEvents[1],
                    disEvents[i].children,
                    $scope.ontology.term_definitions);
              }
            };
          }
        }

        function getEVENT(ontology) {
          var nodeId_itemTree = editor
            .getTermDefinitionNodeId(ontology.term_definitions.oriNodeRef);
          var ItemTree = getITEM_TREE(nodeId_itemTree);
          editor
            .synchronizeOntology(ontology,
              nodeId_itemTree, "Tree",
              "@ internal @");
          var dataAttribute = editor.getCSingleAttribute(
            ItemTree, editor.getDefaultExistence(1,
              1), "data");
          var nodeId_event = editor
            .getTermDefinitionNodeId(ontology.term_definitions.oriNodeRef);
          var eventObject = editor.getCComplexObject(
            dataAttribute, nodeId_event, editor
            .getDefaultOccurrences(0, 1),
            "EVENT");
          editor.synchronizeOntology(ontology,
            nodeId_event, "Any event", "*");
          return eventObject;
        }

        function getHISTORY(ontology) {
          var nodeId_history = editor
            .getTermDefinitionNodeId(ontology.term_definitions.oriNodeRef);
          var eventObject = getEVENT(ontology);
          var eventsAttribute = editor
            .getCMultipleAttribute(
              eventObject,
              editor.getDefaultCardinality(1),
              editor
              .getDefaultExistence(1,
                1), "events");
          var historyObject = editor.getCComplexObject(
            eventsAttribute, nodeId_history, editor
            .getDefaultOccurrences(1, 1),
            "HISTORY");
          editor.synchronizeOntology(ontology,
            nodeId_history, "state Event Series",
            "@ internal @");
          return historyObject;
        }

        function addStateToEvent(node) {
          var nodeId = getNextNodeId();
          var itemTree = getITEM_TREE(nodeId);
          editor.synchronizeOntology($scope.ontology,
            nodeId, "Tree", "@ internal @");
          var state = editor.getCSingleAttribute(
            itemTree, editor.getDefaultExistence(1,
              1), "state");
          node.oriNodeRef.attributes = pushTo(state,
            node.oriNodeRef.attributes);
          var returnedNode = parser.processAttribute(
            state, node, node.children,
            $scope.ontology.term_definitions);
          synchronizeOtherEvents(node);

          // parser.myProcessNode(node.parent.oriNodeRef.children,
          // node.parent, node.parent.children,
          // $scope.ontology.term_definitions);
          return returnedNode;
        }

        // ==========================add base type node
        // function==================================

        // this function can be used to add element which is
        // not special type ,just a CComplexObject and
        // attribute.no CType
        function addElement(node, type) {
          // attributeCheck(node);
          var nodeId = getNextNodeId();
          var baseObject = editor.getCComplexObject(
            undefined, "", editor
            .getDefaultOccurrences(1, 1),
            type);
          var attribute = editor.getCSingleAttribute(
            baseObject, editor.getDefaultExistence(
              1, 1), "value");
          var element = editor.getCComplexObject(
            attribute, nodeId, editor
            .getDefaultOccurrences(0, 1),
            "ELEMENT");
          node.oriNodeRef.attributes.children = pushTo(
            element,
            node.oriNodeRef.attributes.children);

          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Element", "*");

          return parser.myProcessNode(element, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);

        }

        function addText(node) {
          return addElement(node, "DV_TEXT");
          console.log(node);
        }

        function addCodedText(node) {
          var element = addElement(node, "DV_CODED_TEXT");
          var defining_code = editor.getCSingleAttribute(
            undefined, editor.getDefaultExistence(
              1, 1), "defining_code");
          element.oriNodeRef.attributes.children.attributes = defining_code;

          return element;

        }

        function addQuantity(node) {
          var nodeId = getNextNodeId();
          var cDvQuantity = editor.getCDvQuantity();
          var attribute = editor.getCSingleAttribute(
            cDvQuantity, editor
            .getDefaultExistence(1, 1),
            "value");
          var eleObject = editor.getCComplexObject(
            attribute, nodeId, editor
            .getDefaultOccurrences(0, 1),
            "ELEMENT");

          node.oriNodeRef.attributes.children = pushTo(
            eleObject,
            node.oriNodeRef.attributes.children);

          // synchronize ontology
          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Element", "*");
          // return disObject;
          return parser.myProcessNode(eleObject, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);
        }

        function addCount(node) {
          return addElement(node, "DV_COUNT");
        }

        function addDateTime(node) {
          var cDateTime = editor.getCDateTime();
          var primitiveObject = editor
            .getCPrimitiveObject(cDateTime, "",
              editor.getDefaultOccurrences(1,
                1), "DATE_TIME");
          var nodeId = getNextNodeId();
          var bottomAttribute = editor
            .getCSingleAttribute(primitiveObject,
              editor
              .getDefaultExistence(1,
                1), "value");
          var dateTimeObject = editor.getCComplexObject(
            bottomAttribute, undefined, editor
            .getDefaultOccurrences(0, 1),
            "DV_DATE_TIME");
          var topAttribute = editor.getCSingleAttribute(
            dateTimeObject, editor
            .getDefaultExistence(1, 1),
            "value");
          var eleObject = editor.getCComplexObject(
            topAttribute, nodeId, editor
            .getDefaultOccurrences(0, 1),
            "ELEMENT");
          node.oriNodeRef.attributes.children = pushTo(
            eleObject,
            node.oriNodeRef.attributes.children);

          // synchronize ontology
          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Element", "*");
          // return disObject;
          return parser.myProcessNode(eleObject, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);
        }

        function addDuration(node) {
          var cDuration = editor.getCDuration();
          var primitiveObject = editor
            .getCPrimitiveObject(cDuration, "",
              editor.getDefaultOccurrences(1,
                1), "DURATION");
          var nodeId = getNextNodeId();
          var bottomAttribute = editor
            .getCSingleAttribute(primitiveObject,
              editor
              .getDefaultExistence(1,
                1), "value");
          var durationObject = editor.getCComplexObject(
            bottomAttribute, undefined, editor
            .getDefaultOccurrences(0, 1),
            "DV_DURATION");
          var topAttribute = editor.getCSingleAttribute(
            durationObject, editor
            .getDefaultExistence(1, 1),
            "value");
          var eleObject = editor.getCComplexObject(
            topAttribute, nodeId, editor
            .getDefaultOccurrences(0, 1),
            "ELEMENT");
          node.oriNodeRef.attributes.children = pushTo(
            eleObject,
            node.oriNodeRef.attributes.children);

          // synchronize ontology
          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Element", "*");
          // return disObject;
          return parser.myProcessNode(eleObject, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);

        }

        function addOrdinal(node) {
          var cDvOrdinal = editor.getCDvOrdinal();
          var attribute = editor.getCSingleAttribute(
            cDvOrdinal, editor.getDefaultExistence(
              1, 1), "value");
          var nodeId = getNextNodeId();
          var eleObject = editor.getCComplexObject(
            attribute, nodeId, editor
            .getDefaultOccurrences(0, 1),
            "ELEMENT");
          node.oriNodeRef.attributes.children = pushTo(
            eleObject,
            node.oriNodeRef.attributes.children);

          // synchronize ontology
          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Element", "*");
          // return disObject;
          return parser.myProcessNode(eleObject, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);

        }

        function addBoolean(node) {
          var cBoolean = editor.getCBoolean();
          var primitiveObject = editor
            .getCPrimitiveObject(cBoolean, "",
              editor.getDefaultOccurrences(1,
                1), "BOOLEAN");
          var nodeId = getNextNodeId();
          var bottomAttribute = editor
            .getCSingleAttribute(primitiveObject,
              editor
              .getDefaultExistence(1,
                1), "value");
          var durationObject = editor.getCComplexObject(
            bottomAttribute, undefined, editor
            .getDefaultOccurrences(0, 1),
            "DV_BOOLEAN");
          var topAttribute = editor.getCSingleAttribute(
            durationObject, editor
            .getDefaultExistence(1, 1),
            "value");
          var eleObject = editor.getCComplexObject(
            topAttribute, nodeId, editor
            .getDefaultOccurrences(0, 1),
            "ELEMENT");
          node.oriNodeRef.attributes.children = pushTo(
            eleObject,
            node.oriNodeRef.attributes.children);

          // synchronize ontology
          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Element", "*");
          // return disObject;
          return parser.myProcessNode(eleObject, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);

        }

        function addInterval_quantity(node) {
          var nodeId = getNextNodeId();
          var cDvQuantity_upper = editor.getCDvQuantity();
          var cDvQuantity_lower = editor.getCDvQuantity();
          var eleObject = addInterval(cDvQuantity_upper,
            cDvQuantity_lower, "DV_QUANTITY",
            nodeId);
          node.oriNodeRef.attributes.children = pushTo(
            eleObject,
            node.oriNodeRef.attributes.children);

          // synchronize ontology
          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Element", "*");
          // return disObject;
          return parser.myProcessNode(eleObject, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);

        }

        function addInterval_dateTime(node) {
          var nodeId = getNextNodeId();
          var cDateTime_upper = editor.getCDateTime();
          var cDateTime_lower = editor.getCDateTime();
          var eleObject = addInterval(cDateTime_upper,
            cDateTime_lower, "DV_DATE_TIME", nodeId);
          node.oriNodeRef.attributes.children = pushTo(
            eleObject,
            node.oriNodeRef.attributes.children);

          // synchronize ontology
          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Element", "*");
          // return disObject;
          return parser.myProcessNode(eleObject, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);

        }

        function addInterval_integer(node) {
          var nodeId = getNextNodeId();
          var count_upper = editor.getCComplexObject(
            undefined, "", editor
            .getDefaultOccurrences(1, 1),
            "DV_COUNT");
          var count_lower = editor.getCComplexObject(
            undefined, "", editor
            .getDefaultOccurrences(1, 1),
            "DV_COUNT");
          var eleObject = addInterval(count_upper,
            count_lower, "DV_COUNT", nodeId);
          node.oriNodeRef.attributes.children = pushTo(
            eleObject,
            node.oriNodeRef.attributes.children);

          // synchronize ontology
          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Element", "*");
          // return disObject;
          return parser.myProcessNode(eleObject, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);

        }

        function addInterval(upper, lower, type, nodeId) {
          var objectName = "DV_INTERVAL<" + type + ">";
          var upperAttribute = editor
            .getCSingleAttribute(lower, editor
              .getDefaultExistence(1, 1),
              "lower");
          var lowerAttribute = editor
            .getCSingleAttribute(upper, editor
              .getDefaultExistence(1, 1),
              "upper");
          var attributes = [upperAttribute,
            lowerAttribute
          ];
          var intervalObject = editor.getCComplexObject(
            attributes, undefined, editor
            .getDefaultOccurrences(1, 1),
            objectName);
          var topAttribute = editor.getCSingleAttribute(
            intervalObject, editor
            .getDefaultExistence(1, 1),
            "value");
          var eleObject = editor.getCComplexObject(
            topAttribute, nodeId, editor
            .getDefaultOccurrences(0, 1),
            "ELEMENT");

          // add display object
          return eleObject;

        }

        function addMultimedia(node) {
          var nodeId = getNextNodeId();
          var cCodePhrase = editor.getCCodePhrase();
          cCodePhrase.terminology_id = {};
          cCodePhrase.terminology_id.value = "openEHR";
          var bottomAttribute = editor
            .getCSingleAttribute(cCodePhrase,
              editor
              .getDefaultExistence(1,
                1),
              "media_type");
          var mediaObject = editor.getCComplexObject(
            bottomAttribute, "", editor
            .getDefaultOccurrences(0, 1),
            "DV_MULTIMEDIA");
          var topAttribute = editor.getCSingleAttribute(
            mediaObject, editor
            .getDefaultExistence(1, 1),
            "value");
          var eleObject = editor.getCComplexObject(
            topAttribute, nodeId, editor
            .getDefaultOccurrences(0, 1),
            "ELEMENT");
          node.oriNodeRef.attributes.children = pushTo(
            eleObject,
            node.oriNodeRef.attributes.children);

          // synchronize ontology
          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Element", "*");
          // return disObject;
          return parser.myProcessNode(eleObject, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);

        }

        function addUri(node) {
          return addElement(node, "DV_URI");
        }

        function addIdentifier(node) {
          return addElement(node, "DV_IDENTIFIER");
        }

        function addProportion(node) {
          return addElement(node, "DV_PROPORTION");
        }

        function addCluster(node) {
          var nodeId = getNextNodeId();
          var eleObject = editor.getCComplexObject("",
            nodeId, editor.getDefaultOccurrences(0,
              1), "CLUSTER");
          node.oriNodeRef.attributes.children = pushTo(
            eleObject,
            node.oriNodeRef.attributes.children);
          // shchronize ontology
          editor.synchronizeOntology($scope.ontology,
            nodeId, "New Cluster", "*");
          return parser.myProcessNode(eleObject, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);

        }

        function addParsable(node) {
          return addElement(node, "DV_PARSABLE");
        }

        function addBaseSlot(node, type) {
          var nodeId = getNextNodeId();
          var slotObject = editor.getArchetypeSlot(type,
            nodeId, editor.getDefaultOccurrences(0,
              1), editor.defaultIncludes,
            undefined);
          node.oriNodeRef.attributes.children = pushTo(
            slotObject,
            node.oriNodeRef.attributes.children);

          // synchronize ontology
          editor.synchronizeOntology($scope.ontology,
            nodeId, type, "*");
          return parser.myProcessNode(slotObject, node,
            node.children,
            $scope.ontology.term_definitions,
            node.childrenAttribute);
        }

        // ['PARTY_REF','DV_TEXT', 'DV_CODED_TEXT',
        // 'DV_QUANTITY', 'DV_ORDINAL',
        // 'DV_DATE_TIME', 'DV_DATE', 'DV_TIME',
        // 'DV_BOOLEAN', 'DV_COUNT', 'DV_DURATION',
        // 'DV_INTERVAL<DV_DATE>', 'DV_INTERVAl<DV_TIME>',
        // 'DV_INTERVAL<DV_DATE_TIME>',
        // 'DV_INTERVAL<COUNT>', 'DV_INTERVAL<QUANTITY>',
        // 'DV_MULTIMEDIA', 'DV_URI', 'DV_EHR_URI',
        // 'DV_PROPORTION', 'DV_IDENTIFIER', 'DV_PARSABLE',
        // 'DV_BOOLEAN'];

        // function getDV_TEXT(){}
        // function getDV_CODED_TEXT(){}
        function getDV_QUANTITY() {}

        function getDV_ORDINAL() {}

        function getDV_DATE_TIME() {}

        function getDV_DATE() {}

        function getDV_TIME() {}

        function getDV_BOOLEAN() {}

        function getDV_COUNT() {}

        function getDV_DURATION() {}

        function getDV_INTERVAL(type) {}

        function getDV_MULTIMEDIA() {}

        function getDV_URI() {}

        // function getDV_EHR_URI(){}
        function getDV_PROPORTION() {}

        function getDV_IDENTIFIER() {}

        function getDV_PARSABLE() {}

        // -------------------auxiliary
        // function-----------------------

        function pushTo(node, Array) {

          if (angular.isArray(Array)) {
            Array.push(node);
          } else {
            var tempNode = Array;
            Array = [];
            if (tempNode) {
              Array.push(tempNode);
            };
            Array.push(node);
          }
          return Array;

        }

        function getNextNodeId() {
          return editor
            .getTermDefinitionNodeId($scope.ontology.term_definitions.oriNodeRef);
        }

        function getDV_CODED_TEXT() {

          var DV_CODED_TEXT = editor.getCComplexObject(
            null, "", editor.getDefaultOccurrences(
              1, 1), "DV_CODED_TEXT");
          return DV_CODED_TEXT;
        }

        function getDV_TEXT(value) {

          if (value) {
            var DV_TEXT = editor.getCComplexObject(
              value, "",
              editor.getDefaultOccurrences(1, 1),
              "DV_TEXT");
          } else {
            var DV_TEXT = editor.getCComplexObject(
              null, "",
              editor.getDefaultOccurrences(1, 1),
              "DV_TEXT");
          }

          return DV_TEXT;

        }

        function getDV_EHR_URI(value) {
          if (value) {
            var DV_EHR_URI = editor.getCComplexObject(
              value, "",
              editor.getDefaultOccurrences(1, 1),
              "DV_EHR_URI");
          } else {
            var DV_EHR_URI = editor.getCComplexObject(
              null, "",
              editor.getDefaultOccurrences(1, 1),
              "DV_EHR_URI");
          }
          return DV_EHR_URI;
        }

        /*
         * @Param node @Function delete a node from the
         * definition tree, there are many condition need to
         * be considered, view the details in function body
         */

        function deleteNode(node) {
          node.parent.children.splice(
            node.parent.children.indexOf(node), 1);

          if (node.label.type == "type") {
            if (node.parentAttribute) {
              var tempChildren = node.parentAttribute.oriNodeRef.children;
              if (angular.isArray(tempChildren)) {
                tempChildren.splice(tempChildren
                  .indexOf(node.oriNodeRef),
                  1);
              } else {
                node.parentAttribute.oriNodeRef.children = undefined;
              }

            } else if (node.parent) {
              var tempChildren = node.parent.oriNodeRef.children;
              if (angular.isArray(tempChildren)) {
                tempChildren.splice(tempChildren
                  .indexOf(node.oriNodeRef),
                  1);
              } else {
                node.parent.oriNodeRef.children = undefined;
              }
            }

            if (node.label.code) {
              deleteOntology(node.label.code);
            }

          }

          if (node.label.type == "attribute") {
            var tempAttributes = node.parent.oriNodeRef.attributes;
            if (angular.isArray(tempAttributes)) {
              tempAttribute.splice(tempAttributes
                .indexOf(node.oriNodeRef), 1);
            } else {
              node.parent.oriNodeRef.attributes = undefined;
            }
          }

        };

        /*
         * @Param code : code of the node which would be
         * delete @function delete the ontology be parsed
         * and delete the original ontology too
         */
        function deleteOntology(code) {
          var termDefinitions = $scope.ontology.term_definitions;
          if (angular.isArray(termDefinitions)) {
            angular.forEach(termDefinitions, function(
              termDefinition) {
              deleteTermDefinition(termDefinition,
                code);
            });
          } else {
            deleteTermDefinition(termDefinitions, code);
          }
          // var originalTermDefinitions =
          // $scope.ontology.term_definitions.oriNodeRef;
          // if (angular.isArray(originalTermDefinitions))
          // {
          // angular.forEach(originalTermDefinitions,
          // function(originalTermDefinition) {
          // deleteOriginalTermDefinition(originalTermDefinition,
          // code);
          // });
          // } else {
          // deleteOriginalTermDefinition(originalTermDefinitions,
          // code);
          // }
        }

        function deleteTermDefinition(termDefinition, code) {
          var items = termDefinition.items;
          var matchItem;
          if (items) {
            if (angular.isArray(items)) {
              matchItem = items.find(function(value) {
                return value.code == code;
              });

            } else {
              if (items.code == code) {
                matchItem = items;
              }
            }
            if (matchItem) {
              items.splice(items.indexOf(matchItem),
                1);
            }
          }
        }

        function deleteOriginalTermDefinition(
          termDefinition, code) {
          var items = termDefinition.items;
          var matchItem;
          if (items) {
            if (angular.isArray(items)) {
              angular.forEach(items, function(item) {
                if (item._code == code) {
                  matchItem = item;
                }
              });
            } else {
              if (items._code == code) {
                matchItem = items;
              }
            }
            if (matchItem) {
              items.splice(items.indexOf(matchItem),
                1);
            }
          }
        }

        // tree view node label generator callback
        $scope.getLabelContent = function(node) {
          if (node) {
            var temp = getOntologyItemByCode(
              node.label.code, $scope.ontology);
            if (temp) {
              return temp.text.__text;
            }
          }
        };

        function getOntologyItemByCode(code, ontology) {

          if (ontology && code) {
            if (ontology.term_definitions) {
              return ontology.term_definitions
                .filter(withLanguage)[0].items
                .filter(withCode)[0];
            }
          }

          function withLanguage(value) {
            // console.log($scope.language);
            return value.language == $scope.language.code;

          }

          function withCode(value) {
            return value.code == code;

          }

        }

        $scope.dragableIcons = ['dv_text', 'dv_quantity',
          'dv_count', 'dv_date_time', 'dv_duration',
          'dv_ordinal', 'dv_boolean',
          'interval_quantity', 'interval_count',
          'dv_multimedia', 'dv_uri'
        ];

      },
      link: function($scope, element, attrs) {
        $scope.contentHeight = angular
          .isDefined(attrs.maxHeight) ? $scope.$parent
          .$eval(attrs.maxHeight) : undefined;
      }
    };

  });
