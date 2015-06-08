angular.module('clever.management.directives.ngContextMenu', []).directive('ngContextMenu', function() {
    contextMenu = {replace: false};
    contextMenu.restrict = "AE";   
    contextMenu.scope = {};
    contextMenu.link = function( $scope, lElem, lAttr ){
        
        lElem.on("contextmenu", function (e) {           
                //e.preventDefault();
               if(e.button==2){
                console.log("Element right clicked."); 
                var oMenu = document.getElementById("menu");
                var aLi = oMenu.getElementsByTagName("li");
                this.className = "active";
                var style = oMenu.style;
                style.display = "block";
                style.top = e.screenY + "px";
                style.left = e.screenX + "px";                
            
               /* $scope.$apply(function () {
                     $scope.visible = true;
                });*/
            }
        });
        lElem.on("mouseleave", function(e){
               var oMenu = document.getElementById("menu");
               oMenu.style.display = "none" ;  
                console.log("Leaved the div");
                console.log("Element right clicked.");
               /* $scope.$apply(function () {
                     $scope.visible = false;
                });*/
         
        });
    };
    return contextMenu;
});