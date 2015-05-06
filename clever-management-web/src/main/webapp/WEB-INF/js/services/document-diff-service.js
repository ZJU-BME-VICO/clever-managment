angular.module('clever.management.services.documentDiffModal', []).service('documentDiffModalService', function($modal) {

    // the modalHeight argument is an object.
    // which contains a modalHeight attribute expressing the modal's height.
    this.open = function(title, baseDoc, newDoc, modalHeight) {
        $modal.open({
            template: '<div class="modal-content">' +
                		'<div class="modal-header">{{title}}' +   
                            '<div class="btn-group" role="group" style="margin-left:50px;">' +
                                 '<button class="btn" ng-class="{\'btn-primary\': viewMode == 0, \'btn-default\': viewMode == 1}" ng-click="viewMode = 0">Side by Side</button>' +
                                 '<button class="btn" ng-class="{\'btn-primary\': viewMode == 1, \'btn-default\': viewMode == 0}" ng-click="viewMode = 1">Inline</button>' +
                            '</div>' +
                        '</div>' +
                		'<div class="modal-body" ng-style="{height: modalHeight.modalHeight}" style="min-height: 200px; overflow: auto;">' +
                			'<document-diff base-file="baseDoc" new-file="newDoc" view-mode="viewMode"></document-diff>' +
                		'</div>' +
                		'<div class="modal-footer">' +
                			'<button class="btn btn-primary" ng-click="ok()">OK</button>' +
                		'</div>' +
                	  '</div>',
            // templateUrl : 'js/services/yy.html',
            controller: function($scope, $modalInstance) {
             $scope.title = title;
             $scope.baseDoc = baseDoc || '';
             $scope.newDoc = newDoc || '';
             $scope.modalHeight = modalHeight;
             $scope.viewMode = 0;

             $scope.ok = function() {
                 $modalInstance.close();
             }
         }, windowClass: 'app-modal-window', //this CSS class is in the diffview.css file
         // size: 'lg',
     });

     }

});
