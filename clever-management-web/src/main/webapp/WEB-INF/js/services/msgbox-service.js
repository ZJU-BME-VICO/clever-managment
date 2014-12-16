angular.module('clever.management.services.msgbox', []).service('msgboxService', ['$modal', function($modal) {

        var icons = {
            question: {
                fort: 'glyphicon glyphicon-question-sign',
                color: '#428bca'
            },
            error: {
                fort: 'glyphicon glyphicon-remove-sign',
                color: '#cc4036'
            },
            success: {
                fort: 'glyphicon glyphicon-ok-sign',
                color: '#5bb75b'
            },
            info: {
                fort: 'glyphicon glyphicon-info-sign',
                color: '#2f96b4'
            },
            warning: {
                fort: 'glyphicon glyphicon-exclamation-sign',
                color: '#f0ad4e'
            }

        };

        var buttons ={
            yesOrNo: {
                bt1: 'Yes',
                bt2: 'No'
            },
            okOrCancel: {
                bt1: 'Ok', 
                bt2: 'Cancel'
            }
        };

    this.createMessageBox = function(title, content, values, icon, button) {

        return msgInstance = $modal.open({
            template: '<div class="modal-header">' + 
                            '<button type="button" class="close" ng-click="cancel()">' +
                                '&times;' +
                            '</button>' +
                            '<h3 class="modal-title">' +
                                '<span ng-class="icon" ng-style="iconStyle" ng-if= "icon">' +
                                '</span>' +
                                '&nbsp;{{title | translate:values}}' +
                            '</h3>' +
                        '</div>' +
                        '<div class="modal-body">' +
                            '<p style="word-wrap:break-word;">{{content | translate:values}}</p>' +
                        '</div>' +
                        '<div class="modal-footer" ng-if="button">' +
                            '<button class="btn btn-primary" ng-click="ok()">' +
                                '{{button.bt1}}' +
                            '</button>' +
                            '<button class="btn btn-warning" ng-click="cancel()">' +
                                '{{button.bt2}}' +
                            '</button>' +
                        '</div>' +
                        '<div class="modal-footer" ng-if="button == null">' +
                            '<button class="btn btn-primary" ng-click="ok()">Ok' +
                                '</button>' +
                        '</div>',

            controller: function($scope, $modalInstance) {
            	$scope.values = values;
            	
                $scope.ok = function() {
                    $modalInstance.close(true);
                };
                $scope.cancel = function() {
                    $modalInstance.dismiss();
                };
                $scope.title = title;
                $scope.content = content;

                if(icon == null){
                    $scope.icon = null;
                }
                else{
                    $scope.icon = icons[icon].fort;
                    $scope.iconStyle = {
                        'top': '5px',
                        'font-size': '30px',
                        'color': icons[icon].color,
                    };
                }

                $scope.button = buttons[button];
            },
            backdrop: 'static',
            size: 'sm',
        });
    };
}]);