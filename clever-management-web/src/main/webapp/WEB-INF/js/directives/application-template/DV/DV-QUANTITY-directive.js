angular.module('clever.management.directives.DVQUANTITY', []).directive('dvQuantity',//驼峰式命名
function($document) {
	return {	
	    transclude:true,   
		restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
		scope : {//配置    绑定不同的数据到指令内部的作用域
	      UIData:'=guiData',	      
		},		
		
        /*template: '<div dragable>'+'<a>'+'{{UIData.label.labelContent}}'+'</a>'+'&nbsp;&nbsp:&nbsp;&nbsp&nbsp'+'<input placeholder="{{UIData.label.dataValue[0].range}}">'+
			      '{{UIData.label.dataValue[0].unit}}'+
			       '</div>',*/
			        template: '<div dragable>'+'<a>'+'{{UIData.label.labelContent}}'+'</a>'
			        +'&nbsp;&nbsp:&nbsp;&nbsp&nbsp'+'<input placeholder="{{UIData.magnitude}}">'
			        +'{{UIData.units}}'+
                   '</div>',
	    controller:function($scope){
	    	
	    	$scope.dvquantityControl={};
	    },
		link : function(scope, element, attrs) { 
		    //previous process
		    var indexData=scope.UIData.label.dataInfo;
		    if(indexData){
		        if(indexData[0].dataValue){
		            if(indexData[0].dataValue.list){
    		            if(indexData[0].dataValue.list.magnitude)
    		                scope.UIData.magnitude=indexData[0].dataValue.list.magnitude.lower+"..."+indexData[0].dataValue.list.magnitude.upper;
    		            }
        		        if(indexData[0].dataValue.list.units){
        		            scope.UIData.units=indexData[0].dataValue.list.units;
        		        }
		        }
		    }		                 
	},
	};
});