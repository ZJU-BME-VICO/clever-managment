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
                btn1: 'MESSAGE_BOX_BTN_YES',
                btn2: 'MESSAGE_BOX_BTN_NO'
            },
            okOrCancel: {
                btn1: 'MESSAGE_BOX_BTN_OK', 
                btn2: 'MESSAGE_BOX_BTN_CANCEL'
            }
        };

    this.createMessageBox = function(title, content, values, icon, button) {

        return msgInstance = $modal.open({
            template: '<div class="modal-header">' + 
                            '<button type="button" class="close" ng-click="cancel()" style="font-size: 35px;">' +
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
                        '<div class="modal-footer">' +
                            '<button ng-if="button" class="btn btn-primary" ng-click="ok()">' +
                                '{{button.btn1 | translate}}' +
                            '</button>' +
                            '<button ng-if="button" class="btn btn-warning" ng-click="cancel()">' +
                                '{{button.btn2 | translate}}' +
                            '</button>' +
                            '<button ng-if="!button" class="btn btn-primary" ng-click="ok()">{{"MESSAGE_BOX_BTN_OK" | translate}}</button>' +
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
                        'font-size': '28px',
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