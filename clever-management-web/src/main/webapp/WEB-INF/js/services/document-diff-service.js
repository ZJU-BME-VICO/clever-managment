angular.module('clever.management.services.documentDiffModal', []).service('documentDiffModalService', function($modal) {

    this.open = function(title, baseDoc, newDoc, modalHeight) {
        $modal.open({
            template: '<div class="modal-content">' +
                		'<div class="modal-header" style="font-size: 1.2em;">{{title | translate:values}}' +   
                            '<button type="button" class="close" ng-click="ok()" style="font-size: 2em;">&times;</button>' +
                            '<div class="btn-group" role="group" style="margin-left:50px;">' +
                                 '<button class="btn" ng-class="{\'btn-primary\': viewMode == 0, \'btn-default\': viewMode == 1}" ng-click="viewMode = 0">{{"DOCUMENT_DIFF_SERVICE_SIDE_BY_SIDE" | translate}}</button>' +
                                 '<button class="btn" ng-class="{\'btn-primary\': viewMode == 1, \'btn-default\': viewMode == 0}" ng-click="viewMode = 1">{{"DOCUMENT_DIFF_SERVICE_INLINE" | translate}}</button>' +
                            '</div>' +
                        '</div>' +
                		'<div class="modal-body" ng-style="{height: modalHeight.value}" style="\'min-height\': 200px; overflow: auto;">' +
                			'<document-diff base-file="baseDoc" new-file="newDoc" view-mode="viewMode"></document-diff>' +
                		'</div>' +
                		'<div class="modal-footer">' +
                			'<button class="btn btn-primary" ng-click="ok()">{{"DOCUMENT_DIFF_SERVICE_BTN_OK" | translate}}</button>' +
                		'</div>' +
                	  '</div>',
            controller: function($scope, $modalInstance) {
                $scope.title = title;
                $scope.baseDoc = baseDoc || '';
                $scope.newDoc = newDoc || '';
                $scope.viewMode = 0;
                $scope.modalHeight = modalHeight || {
                    value : 400,
                };
                $scope.ok = function() {
                    $modalInstance.close();
                }
            },
            windowClass: 'app-modal-window', //this CSS class is in the diffview.css file
            // size: 'lg',
     });

     }

});
