angular.module('clever.management.directives.rightClick', []).directive('rightClick', function() {
    contextMenu = {replace: false};
    contextMenu.restrict = "AE";
    
    contextMenu.scope = {"visible": "="};
    contextMenu.link = function( $scope, lElem, lAttr ){
        lElem.on("contextmenu", function (e) {
                
                e.preventDefault();
            
                console.log("Element right clicked.");
                $scope.$apply(function () {
                     $scope.visible = true;
                });
            
                
      
        });
        lElem.on("mouseleave", function(e){
         
                console.log("Leaved the div");
                 console.log("Element right clicked.");
                $scope.$apply(function () {
                     $scope.visible = false;
                });
         
        });
    };
    return contextMenu;
});