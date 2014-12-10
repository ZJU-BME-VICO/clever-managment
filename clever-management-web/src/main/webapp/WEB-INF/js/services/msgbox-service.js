angular.module('msgboxModule', []).service('msgboxService', ['$modal', function($modal) {
var icons = {
            question: 'glyphicon glyphicon-question-sign',
            error: 'glyphicon glyphicon-remove-sign',
            success: 'glyphicon glyphicon-ok-sign',
            info: 'glyphicon glyphicon-info-sign',
            warning: 'glyphicon glyphicon-exclamation-sign'
        };

        var colors = {
            question: '#428bca',
            error: '#cc4036',
            success: '#5bb75b',
            info: '#2f96b4',
            warning: '#f0ad4e'
        };
    this.createMessageBox = function(title, content, icon, button) {

        

        var buttons ={
            yesOrNo: ['Yes', 'No'],
            okOrCancel: ['Ok', 'Cancel']
        };

        return msgInstance = $modal.open({
            template: '<div class="modal-header">' + 
                            '<button type="button" class="close" ng-click="cancel()">' +
                                '&times;' +
                            '</button>' +
                            '<h3 class="modal-title">{{title}}</h3>' +
                         '</div>' +
                         '<div class="modal-body">' +
                            '<div class="content-container">' +
                                '<div class="row">' +
                                    '<div class="col-sm-2" ng-if="icon">' +
                                        '<span ng-class="icon" ng-style="iconStyle">' +
                                        '</span>' +
                                    '</div>' +
                                    '<div class="col-sm-10" ng-if="icon">' +
                                        '<p style="word-wrap:break-word;">{{content}}</p>' +
                                    '</div>' +
                                    '<div class="col-sm-12" ng-if="icon == null">' +
                                        '<p style="word-wrap:break-word;">{{content}}</p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="modal-footer" ng-if="button != null">' +
                            '<button class="btn btn-primary" ng-click="ok()">' +
                                '{{button[0]}}' +
                            '</button>' +
                            '<button class="btn btn-warning" ng-click="cancel()">' +
                                '{{button[1]}}' +
                            '</button>' +
                        '</div>' +
                        '<div class="modal-footer" ng-if="button == null">' +
                            '<button class="btn btn-primary" ng-click="ok()">Ok' +
                                '</button>' +
                        '</div>',

            controller: function($scope, $modalInstance) {
                $scope.ok = function() {
                    $modalInstance.close(true);
                };
                $scope.cancel = function() {
                    $modalInstance.dismiss();
                };
                $scope.title = title;
                $scope.content = content;
                $scope.icon = icons[icon];
                $scope.iconStyle = {
                    'font-size': '30px',
                    'color': colors[icon]
                };
                $scope.button = buttons[button];
            },
            backdrop: 'static',
            size: 'sm',
        });
    };
}]);