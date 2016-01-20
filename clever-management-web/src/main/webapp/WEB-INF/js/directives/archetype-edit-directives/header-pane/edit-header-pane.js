angular.module('clever.management.directives.editHeaderPane', []).directive('editHeaderPane', function() {
    return {
        restrict : 'E',
        transclude : true,
        scope : {
            header : '=',
            languages : "=",
            ontology : "=",
            maxHeight : "=",

        },
        templateUrl : 'js/directives/archetype-edit-directives/header-pane/edit-header-pane.html',

        controller : function($scope, toaster) {
      

            $scope.language = "en";
            
            
            $scope.quotaCheckRegx = /[^"]/g;
            
           console.log( $scope.quotaCheckRegx.test("ahhah"));

            function processHeader(header) {
                // assume archetype id and concept have defined
                //assume that details is defined
                processDetail(getDetail());
                //  processOriAuthor(header.description.original_author);
                $scope.conceptItem = getConceptItem();
                processBaseInfo($scope.conceptItem);
                processOriAuthor(header);
            }
            
            function getDetail() {
                var details = $scope.header.description.details;
                var matchDetail;
                if (details) {
                    if (angular.isArray(details)) {
                        angular.forEach(details, function(detail) {
                            if (detail.language.code_string == $scope.language) {
                                matchDetail = detail;
                            }
                        });
                    } else {
                        if (details.language.code_string == $scope.language) {
                            matchDetail = details;
                        }
                    }
                } else {
                    throw "details is not defined, the archetype content must be uncompleted";
                }

                if (matchDetail) {
                    //  processDetail(matchDetail);
                    return matchDetail;
                } else {
                    throw "detail in language :" + $scope.language + "is not defined, the archetype content must be uncompleted";
                }
            }

            function processDetail(detail) {
                //attributes that a detail should have
                var attributeList = ['copyright', 'misuse', 'purpose', 'use', 'keywords'];
                for (var i = 0; i < 4; i++) {
                    if (detail[attributeList[i]] == undefined || detail[attributeList[i]] == null) {
                        detail[attributeList[i]] = "";
                    }
                }
            }

            // base informations
            function processBaseInfo(conceptItem) {
                var attributeList = ['text', 'description', 'comment'];
                var existAttributes = [];
                angular.forEach(conceptItem, function(item) {
                    existAttributes.push(item._id);
                });
                angular.forEach(attributeList, function(attribute) {
                    if (existAttributes.indexOf(attribute) == -1) {
                        var temp = {
                            _id : attribute,
                            __text : '',
                        };
                        conceptItem.push(temp);
                    }
                });
            }

            function getBaseInfo(conceptItem) {
                var baseInformation = {};
                angular.forEach(conceptItem, function(item) {
                    baseInformation[item._id] = item;
                });
                baseInformation.archetypeId = $scope.header.archetype_id;
                return baseInformation;
            }

            function getConceptItem() {

                var conceptItem;
                var termDefinitions = $scope.header.ontology.term_definitions;
                if (angular.isArray(termDefinitions)) {
                    angular.forEach(termDefinitions, function(definition) {
                        if(definition._language == $scope.language){
                             conceptItem = getItemByCode(definition,  $scope.header.concept);
                        }
                      
                    });
                } else {
                    if (termDefinitions._language == $scope.language) {
                      conceptItem = getItemByCode(termDefinitions, $scope.header.concept);
                    }
                }

                if (conceptItem) {
                    return conceptItem;
                } else {
                    throw "concept is undefined";
                }
            }
         
            function getItemByCode(definition, code) {
                var matchItem;

                if (angular.isArray(definition.items)) {
                    angular.forEach(definition.items, function(item) {
                        if (item._code == code)
                            matchItem = item.items;
                    });
                } else {
                    if (definition.items._code == code) {
                        matchItem = definition.items.items;
                    }

                }
                return matchItem;
            }

            // original author info

            function processOriAuthor(header) {
                if (!header.description.original_author) {
                    header.description.original_author = [{
                        _id : 'date',
                        __text : ''
                    }, {
                        _id : 'name',
                        __text : ''
                    }, {
                        _id : 'organisation',
                        __text : ''
                    }, {
                        _id : 'email',
                        __text : ''
                    }];
                } else {
                    processOriAuthorArray(header.description);
                };
            }

            function processOriAuthorArray(description) {
                var array = description.original_author;
                var neededAttributes = ['date', 'name', 'organisation', 'email'];
                var existAttributes = [];
                if (angular.isArray(array)) {
                    angular.forEach(array, function(value) {
                        existAttributes.push(value._id);
                    });
                } else {
                    array = [{
                        _id : array._id,
                        __text : array.text ? array.text : ''
                    }];
                    existAttributes.push(array[0]._id);
                }
                angular.forEach(neededAttributes, function(attribute) {
                    if (existAttributes.indexOf(attribute) == -1) {
                        var temp = {
                            _id : attribute,
                            __text : '',
                        };
                        array.push(temp);
                    }
                });
                description.original_author = array;
            }

            function isExisted(value) {
                return value != null && value != undefined;
            }

            function getOriAuthorInfo() {
                var oriAuthorInfo = {};
                angular.forEach($scope.header.description.original_author, function(authorInfo) {
                    oriAuthorInfo[authorInfo._id] = authorInfo;
                });
                //$scope.oriAuthorInfo = oriAuthorInfo;
                $scope.oriAuthorDate = {
                    value : new Date(oriAuthorInfo.date.__text),
                };
               
                return oriAuthorInfo;
            }


            $scope.$watch("header", function(newValue) {
                if (newValue) { 
                    processHeader(newValue);
                    $scope.baseInformation = getBaseInfo($scope.conceptItem);
                    $scope.oriAuthorInfo = getOriAuthorInfo(); 
                    $scope.detail = getDetail();
                    $scope.otherContributors = getOtherContributors();                 
                }
            });
            
            
            
            
            function getOtherContributors() {
                var contributors = $scope.header.description.other_contributors;
                if (contributors) {
                    if (angular.isArray(contributors)) {
                       return contributors;
                    } else {
                        $scope.header.description.other_contributors = [contributors];
                        return  $scope.header.description.other_contributors;
                    }
                } else {
                   return  undefined;
                }
            }

            $scope.addContributor = function() {
                if ($scope.otherContributors) {
                    var contributor = "new contributor";
                    $scope.otherContributors.push(contributor);
                    $scope.selectContributor(contributor, $scope.otherContributors.length - 1);
                } else {
                    $scope.header.description.other_contributors = ['new contributor'];
                    $scope.otherContributors = $scope.header.description.other_contributors;
                    $scope.selectContributor($scope.otherContributors[0], 0);
                }
            };
                                        
            $scope.selectContributor = function(value, index) { 
                $scope.currentContributor = {
                    value : value,
                    index : index,      
                };
            };
            $scope.isSelected = function(index){
                if(index == $scope.currentContributor.index){
                    return 'selected';
                   
                }else{
                    return '';
                }
            };

           
            $scope.$watch('currentContributor.value', function(newValue, oldValue) {
                if (newValue && oldValue) {
                    $scope.otherContributors[$scope.currentContributor.index] = newValue;
                    
                }
            });

            $scope.removeContributor = function() {
                var temp = $scope.currentContributor;
                if (temp) {
                    $scope.otherContributors.splice(temp.index, 1);

                }

            };


            $scope.$watch('oriAuthorDate.value', function(newValue) {
                if ($scope.oriAuthorInfo) {
                    var dateInDec = Date.parse(newValue);
                    var date = new Date();
                    date.setTime(dateInDec);
                    $scope.oriAuthorInfo.date.__text = date.format('yyyy-MM-dd');
                }
            });

          
         
        },
        link : function(scope, elemetn, attr) {
            scope.contentHeight = angular.isDefined(attr.maxHeight) ? scope.$parent.$eval(attr.maxHeight) : undefined;
        }
    };
});

