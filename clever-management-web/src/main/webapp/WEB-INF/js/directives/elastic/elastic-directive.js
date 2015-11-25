angular.module('clever.management.directives.elastic', []).directive('elastic', function($timeout) {

    return {
        restrict : 'A',
        require : 'ngModel',
        link : function($scope, element, attr, ngModelCtrl) {
           // console.log($document);
            console.log(element);
            $scope.initialHeight = $scope.initialHeight || element[0].style.height;

            var resize = function() {
                element[0].style.height = $scope.initialHeight;
                element[0].style.height = "" + element[0].scrollHeight + "px";
            }; 
   
            $scope.$watch(function() {
                return ngModelCtrl.$modelValue;
            }, 
            resize, 
            true // if deepwatch is required
            ); 

            
            element.on("input change", resize);      
            setTimeout(function(){
                 element[0].style.height = $scope.initialHeight;
                element[0].style.height = "" + element[0].scrollHeight + "px";
            }, 0);   
        }
    };
}); 

