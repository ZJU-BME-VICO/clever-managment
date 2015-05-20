angular.module('clever.management.directives.DVTEXT', []).directive('dvText',//驼峰式命名
function($document) {
	return {	
	    replace:true,
	    transclude:true,	
		restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
		scope : {//配置    绑定不同的数据到指令内部的作用域
	      UIData:'=guiData',
	      selectedElement:'=',	      
		},		
		
        template: '<li dragable id={{UIData.label.labelContent+"_"+UIData.label.code}}>'
                  +'<img class={{UIData.label.picType}}></img>'+
                    '<span>'+'{{UIData.label.labelContent}}'+'</span>'+'&nbsp;&nbsp:&nbsp;&nbsp&nbsp'+'<input name={{UIData.label.labelContent}} id={{UIData.label.tableName+"/"+UIData.label.code}}>'+
			       '</li>',
	    controller:function($scope){
	    	
	    	$scope.dvtextControl={};
	    	
	    	$scope.$watch("selectedElement", function(newValue, oldValue) {
                if (newValue!=oldValue) {
                    $scope.selectedElement=$scope.UIData.label.labelContent+$scope.UIData.label.code;
                    //alert("directive");
                    //alert(newValue); 
                }
              });
	    },
		link : function(scope, element, attrs) {
		    element.on('mousedown',function(){	        
		        scope.selectedElement=scope.UIData.label.labelContent+scope.UIData.label.code;
                scope.$apply();
		    });
	}
	};
});