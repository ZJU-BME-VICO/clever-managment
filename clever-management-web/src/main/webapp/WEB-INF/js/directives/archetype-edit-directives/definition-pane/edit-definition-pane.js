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

//        /**
//         * collect all inherit object of the rmObject which is a 'type'. and use a recursion
//         * to get the inherit object of the inherit object
//         *
//         * eg. With the 'ITEM' as a type, we can get the object array [ELEMENT, CLUSTER]
//         *
//         * @param {object} type The type of the rmObejct
//         * @return An array consist of all inherit object and the grandInherit object and ...
//         */
//        function collectInheritObjectWithType(type) {
//
//          var array = [];
//          var inheritArray = rmFactoryService.inheritMap[type];
//          if (inheritArray) {
//            var temp = createRmObejct(type);
//            if (temp && temp.isAbstract != true) {
//              array.push(temp);
//            }
//            angular.forEach(inheritArray, function(inheritType) {
//              angular.forEach(collectInheritObjectWithType(inheritType), function(value) {
//                array.push(value);
//              })
//            })
//          } else {
//            var grandChildren = createRmObejct(type);
//            array.push(grandChildren);
//          }
//          return array;
//        }
//        /**
//         * use objects to generate an array consist of all the inherit type of the obejcts's attribute type.
//         * Firstly, get the attribute's children type as TYPE. It can be infer that the attributes of an object
//         * who's parent's menuType is LEAPFROG, the parent's attributes length should be one, and the attributes
//         * length of the object should be one too.
//         * Secondly, use TYPE to call collectInheritContentWithType to generate the inherit types.
//         *
//         * eg. We get the objects [ELEMENT, CLUSTER]. We get the attribute type of each object and use the types to
//         * generate its inherit type with a string array, then add all type to a set(make sure that the type in this
//         * set is unique)
//         *
//         * @param {Obejct} objects The object array or an object used to generate its inherit type
//         */
//        function collectInheritContentWithObjects(objects) {
//
//          var inheritSet = new Set();
//          if (angular.isArray(objects)) {
//            angular.forEach(objects, function(obj) {
//              if (obj.attributes.length == 1) {
//                angular.forEach(collectInheritContentWithType(obj.attributes[0]['@children'].type), function(value) {
//                  inheritSet.add(value);
//                })
//
//              } else {
//                console.log('for LEAPFROG menuType, the attributes of object should have only one item');
//              }
//            })
//          } else {
//            inheritSet = collectInheritContentWithObjects([obejects]);
//          }
//          return inheritSet;
//        }
        
        function collectLeapfrogMenuContentWithType(type){
        	var childrenTypeSet = collectInheritContentWithType(type);
        	var tempSet = new Set();
            angular.forEach(childrenTypeSet, function(val){
        		var rmObject = createRmObejct(val);
        	    angular.forEach(collectInheritContentWithType(rmObject.attributes[0]['@children'].type), function(grandChildType){
        		  tempSet.add(grandChildType);
        	    });
        	});
        	angular.forEach(childrenTypeSet, function(childrenType){
        		tempSet.add(childrenType);
        	})
        	return tempSet;
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
        //  console.log(type);
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
//                  var childrenArray = collectInheritObjectWithType(childrenType);
//                  var menuItemArray = collectInheritContentWithObjects(childrenArray);
                	var menuItemArray = collectLeapfrogMenuContentWithType(childrenType);
                  menuHtml += generateTypeMenu(menuItemArray, aliasName);
                } else {
                  console.log("error: if the obejct's menuType is LEAPFROG, it should have only one attribute");
                }
              }
             else if(rmObject.menuType == 'TYPE'){
            	if(rmObject.attributes.length == 1){
            		var childrenType = rmObject.attributes[0]['children'].type;
            		var menuItemArray = collectInheritContentWithType(childrenType);
            		menuHtml += generateTypeMenu(menuItemArray, aliasName);
            	}
            }
           }
            else {
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
          $scope.treeControl
            .locateNode(parser.processAttribute(attribute, node, node.children, $scope.ontology.term_definitions, parser.KEEPATTRIBUTE));
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
