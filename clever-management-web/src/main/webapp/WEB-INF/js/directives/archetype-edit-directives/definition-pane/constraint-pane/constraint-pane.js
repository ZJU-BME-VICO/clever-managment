angular.module('clever.management.directives.constraintPane', []).directive('constraintPane', function(archetypeEditService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            currentNode: '=',
        },
        templateUrl: 'js/directives/archetype-edit-directives/definition-pane/constraint-pane/constraint.pane.html',

        controller: function($scope, $element, $attrs, toaster) {

            $scope.getOccurrencesString = function() {

                return $scope.castedOccurrences.lower + '...' + ($scope.occurrences.upper_unbounded == 'true' ? '*' : $scope.castedOccurrences.upper);
            };

            $scope.getCardinalityString = function() {
                var temp = $scope.castedCardinality.lower + '...' + ($scope.cardinality.interval.upper_unbounded == 'true' ? '*' : $scope.castedCardinality.upper);
                temp += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                if ($scope.cardinality.is_ordered == 'true') {
                    temp += 'ordered';
                } else {
                    temp += 'unordered';
                }
                temp += '&nbsp;&nbsp;';
                if ($scope.cardinality.is_unique == 'true') {
                    temp += 'unique';
                }
                return temp;
            };


            $scope.EXISTENCE = ["REQUIRED", "OPTIONAL", "NOT_ALLOWED"];
            $scope.$watch('currentNode', function(newValue) {
                if (newValue) {
                    var node = newValue;
                    $scope.occurrences = node.oriNodeRef.occurrences;

                    $scope.cardinality = node.oriNodeRef.cardinality;
                    $scope.existence = node.oriNodeRef.existence;
                    if ($scope.occurrences) {
                        $scope.castedOccurrences = {
                            lower: parseInt($scope.occurrences.lower),
                            upper: isTrue($scope.occurrences.upper) ? parseInt($scope.occurrences.upper) : undefined,
                        };
                    }
                    if ($scope.existence) {
                        $scope.castedExistence = {
                            value: "",
                        };
                        if ($scope.existence.lower == "1") {
                            $scope.castedExistence.value = "REQUIRED";

                        } else if ($scope.existence.upper == "1" && $scope.existence.lower == "0") {
                            $scope.castedExistence.value = "OPTIONAL";
                        } else {
                            $scope.castedExistence.value = "NOT_ALLOWED";
                        }
                    }

                    if ($scope.cardinality) {
                        $scope.castedCardinality = {
                            lower: parseInt($scope.cardinality.interval.lower),
                            upper: isTrue($scope.cardinality.interval.upper) ? parseInt($scope.cardinality.interval.upper) : undefined,
                        };
                        console.log($scope.castedCardinality);
                    }

                }
            });



            $scope.$watch('castedOccurrences.lower', function(newValue, oldValue) {
                if (newValue != undefined) {
                    occurrencesValidCheck();
                    $scope.currentNode.oriNodeRef.occurrences.lower = newValue.toString();
                }
            });
            $scope.$watch('castedOccurrences.upper', function(newValue, oldValue) {
                if (newValue != undefined) {
                    occurrencesValidCheck();
                    $scope.currentNode.oriNodeRef.occurrences.upper = newValue.toString();
                }
            });

            function occurrencesValidCheck() {
                if ($scope.castedOccurrences.lower > $scope.castedOccurrences.upper) {
                    toaster.pop('error', 'Eror', 'The lower occurrence can not be larger than  upper')
                }
            }

            $scope.$watch('castedExistence.value', function(newValue, oldValue) {
                if (newValue != undefined) {
                    switch (newValue) {
                        case "REQUIRED":
                            $scope.existence.lower = "1";
                            $scope.existence.upper = "1";
                            break;
                        case "OPTIONAL":
                            $scope.existence.lower = "0";
                            $scope.existence.upper = "1";
                            break;
                        case "NOT_ALLOWED":
                            $scope.existence.lower = "0";
                            $scope.existence.upper = "0";
                            break;
                    }
                }
            });
            $scope.$watch('castedCardinality.upper', function(newValue, oldValue) {
                if (newValue != undefined) {
                    cardinalityValidCheck();
                    $scope.currentNode.oriNodeRef.cardinality.interval.upper = newValue.toString();
                }
            });
            $scope.$watch('castedCardinality.lower', function(newValue, oldValue) {
                if (newValue != undefined) {
                    cardinalityValidCheck();
                    $scope.currentNode.oriNodeRef.cardinality.interval.lower = newValue.toString();
                }
            });

            function cardinalityValidCheck() {
                if ($scope.castedCardinality.lower > $scope.castedCardinality.upper) {
                    toaster.pop('error', 'Eror', 'The lower cardinality can not be larger than  upper')
                }
            }

            function isTrue(value) {
                return value != undefined && value != null;
            }

        }
    };
});
