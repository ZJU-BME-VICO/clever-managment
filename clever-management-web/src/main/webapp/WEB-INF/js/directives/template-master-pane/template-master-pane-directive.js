define(['lazyLoader'], function(lazyLoader) {
    lazyLoader.directive('templateMasterPane', function(containerService) {
        return {
            restrict: 'E',
            scope: {
                templateMasterInfo: '=',
                selectTemplateCallback: '&',
                selectArchetypeCallback: '&',
                selectMasterCallback: '&',
            },
            templateUrl: 'js/directives/template-master-pane/template-master-pane.html',
            controller: function($scope) {
                $scope.getFormatedTime = function(time) {
                    var date = new Date();
                    date.setTime(time);
                    return date.format('yyyy-MM-dd hh:mm:ss');
                };
                $scope.selectTemplate = function(archetype) {
                    $scope.selectTemplateCallback({
                        value: archetype,
                    });
                };
                $scope.selectSpecialiseMaster = function(master) {
                    $scope.selectMasterCallback({
                        value: master,
                    });
                };
                $scope.selectSpecialiseArchetype = function(archetype) {
                    $scope.selectArchetypeCallback({
                        value: archetype,
                    });
                };
            },
            link: function(scope, element, attr) {
                scope.tableMaxHeight = containerService.getHeight() - 280;
                scope.$watch(function() {
                    return containerService.getHeight()
                }, function(newValue) {
                    scope.tableMaxHeight = newValue - 280 < 180 ? 180 : newValue - 280;
                });
                // scope.tableMaxHeight = angular.isDefined(attr.maxHeight) ? scope.$parent.$eval(attr.maxHeight) - 90 : undefined;
                scope.tableTitleWidth = angular.isDefined(attr.tableTitleWidth) ? scope.$parent.$eval(attr.tableTitleWidth) : 200;
            },
        };
    });
});
