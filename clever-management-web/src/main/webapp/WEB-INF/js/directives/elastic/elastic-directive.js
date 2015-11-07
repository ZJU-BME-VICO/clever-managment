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



            // angular.element(element).ready(function() {
            // resize();
            // });

            // resize the area height when the page is download ,there must be a global event when the page is loaded.
            // I have try the $windows and $document and angular.element to listen the event ,but i failed.
            // this is the vialent way to do this,
            // $scope.watched = {
                // value : element[0],
            // };
// 
            // $scope.$watch('watched.value.textLength', function(newValue) {
                // if (newValue) {
                    // resize();
                // }
            // });
            
            element.on("input change", resize);      
            setTimeout(function(){
                 element[0].style.height = $scope.initialHeight;
                element[0].style.height = "" + element[0].scrollHeight + "px";
            }, 0);   
        }
    };
}); 

