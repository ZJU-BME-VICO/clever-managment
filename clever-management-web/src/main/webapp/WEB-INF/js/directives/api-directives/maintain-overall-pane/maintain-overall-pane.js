angular.module('clever.management.directives.maintainOverallPane', []).directive('maintainOverallPane', function(resourceService, msgboxService, busyService, $modal, DEVELOPMENT_API_MAINTAIN_OVERALL_URL, DEVELOPMENT_API_REMOVE_BY_MASTER_URL, DEVELOPMENT_API_REMOVE_BY_VERSIONID_URL, DEVELOPMENT_API_REMOVE_BY_VERSIONID_URL) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            masterList: '=',
            versionMasterId: '=',
            maxHeight: '=',
        },
        templateUrl: 'js/directives/api-directives/maintain-overall-pane/maintain.overall.pane.html',
        controller: function($scope) {

            $scope.deleteByVersion = function(versionId) {
                var bid = busyService.pushBusy('BUSY_LOADING');
                resourceService.get(DEVELOPMENT_API_REMOVE_BY_VERSIONID_URL + versionId).then(function(result) {
                    busyService.popBusy(bid);
                    if (result.succeeded) {
                        msgboxService.createMessageBox('API_MAINTAIN_SUCCEEDED', 'API_MAINTAIN_SUCCEEDED_HINT', {}, 'success');
                    } else {
                        msgboxService.createMessageBox('API_MAINTAIN_FAILED', 'API_MAINTAIN_FAILED_HINT', {
                            errorMsg: result.message
                        }, "error");
                    }
                });
            };
            $scope.deleteByMasterId = function(masterId) {
                var bid = busyService.pushBusy('BUSY_LOADING');
                resourceService.get(DEVELOPMENT_API_REMOVE_BY_MASTER_URL + masterId).then(function(result) {
                    busyService.popBusy(bid);
                    if (result.succeeded) {
                        msgboxService.createMessageBox('API_MAINTAIN_SUCCEEDED', 'API_MAINTAIN_SUCCEEDED_HINT', {}, 'success');
                    } else {
                        msgboxService.createMessageBox('API_MAINTAIN_FAILED', 'API_MAINTAIN_FAILED_HINT', {
                            errorMsg: result.message
                        }, "error");
                    }
                });
            };
            $scope.maintainOverallApi = function(masterName, url, version) {
                var bid = busyService.pushBusy('BUSY_LOADING');
                resourceService.post(DEVELOPMENT_API_MAINTAIN_OVERALL_URL, {
                    masterName: masterName,
                    url: url,
                    version: version,
                }).then(function(result) {
                    busyService.popBusy(bid);
                    if (result.succeeded) {
                        msgboxService.createMessageBox('API_MAINTAIN_SUCCEEDED', 'API_MAINTAIN_SUCCEEDED_HINT', {}, 'success');
                    } else {
                        msgboxService.createMessageBox('API_MAINTAIN_FAILED', 'API_MAINTAIN_FAILED_HINT', {
                            errorMsg: result.message
                        }, "error");
                    }
                });
            };

            $scope.openAddUpdateModal = function(size) {
                var modalInstance = $modal.open({
                    animation: true, // animations on
                    templateUrl: 'js/directives/api-directives/maintain-overall-pane/modal-html/api.add.update.html',
                    controller: function MaintainModelCtrl($scope, $modalInstance) {
                        $scope.masterName = '';
                        $scope.url = '';
                        $scope.version = '';
                        console.log($scope.inputMasterName);
                        $scope.ok = function() {
                            $modalInstance.close({
                                masterName: $scope.masterName,
                                url: $scope.url,
                                version: $scope.version,
                            });
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    size: size,
                    resolve: {}
                });
                modalInstance.result.then(function(message) { // modal message back
                    console.log(message);
                    $scope.maintainOverallApi(message.masterName, message.url, message.version);
                });
            };

            $scope.openDeleteModal = function(size) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'js/directives/api-directives/maintain-overall-pane/modal-html/api.delete.html',
                    controller: function DeleteModelCtrl($scope, $modalInstance, treeData) {
                        console.log(treeData);
                        //$scope.treeData = formatData(treeData);
                        $scope.treeData = treeData;

                        $scope.selectNode = function(value) {
                            if (value.name) {
                                $scope.returnValue = value;
                            } else if (value.version) {
                                value.masterId = value.parent.id;
                                $scope.returnValue = value;
                            }
                        };

                        // function formatData(masterList) {
                        // var treeData = [];
                        // if (masterList) {
                        // if (angular.isArray(masterList)) {
                        // angular.forEach(masterList, function(value) {
                        // var temp = {
                        // id : value.id,
                        // isMaster : true,
                        // label : value.name,
                        // children : formatVersionList(value.versionMasters),
                        // };
                        // treeData.push(temp);
                        // });
                        // } else {
                        // var temp = {
                        // isMaster : true,
                        // label : masterList.name,
                        // children : formatVersionList(masterList.versionMasters),
                        // };
                        // treeData.push(temp);
                        // }
                        // }
                        // return treeData;
                        // }
                        //
                        // function formatVersionList(list) {
                        // var returnList = [];
                        // if (list) {
                        // if (angular.isArray(list)) {
                        // angular.forEach(list, function(value) {
                        // var temp = {
                        // id : value.id,
                        // version : value.version,
                        // isVersion : true,
                        // label : 'version: ' + value.version,
                        // children : [],
                        // };
                        // returnList.push(temp);
                        // });
                        // } else {
                        // var temp = {
                        // id: list.id,
                        // version: list.version,
                        // isVersion : true,
                        // label : 'version: ' + list.version,
                        // children : [],
                        // };
                        // returnList.push(temp);
                        // }
                        // }
                        // return returnList;
                        // }

                        console.log($scope.treeData);
                        $scope.ok = function() {
                            $modalInstance.close({
                                value: $scope.returnValue,
                            });
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    size: size,
                    resolve: {
                        treeData: function() {
                            return $scope.masterList;
                        }
                    }
                });
                modalInstance.result.then(function(message) { // modal message back
                    var value = message.value;
                    if (value.version) { //delete by version master id
                        $scope.deleteByVersion(value.id);
                    } else if (value.name) { //delete by master id
                        $scope.deleteByMasterId(value.id);
                    }
                });
            };
        }
    };
});
