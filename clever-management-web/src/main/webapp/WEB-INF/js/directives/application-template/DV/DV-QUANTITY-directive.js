angular.module('clever.management.directives.DVQUANTITY', []).directive('dvQuantity',//驼峰式命名
function($document) {
	return {	
	    replace:true,   
		restrict : 'AE',//A 仅匹配属性名字  E 仅匹配元素名字
		scope : {//配置    绑定不同的数据到指令内部的作用域
	      UIData:'=guiData',	      
		},		
		
        /*template: '<div dragable>'+'<a>'+'{{UIData.label.labelContent}}'+'</a>'+'&nbsp;&nbsp:&nbsp;&nbsp&nbsp'+'<input placeholder="{{UIData.label.dataValue[0].range}}">'+
			      '{{UIData.label.dataValue[0].unit}}'+
			       '</div>',*/
			        template: '<li dragable id={{UIData.label.enText+"_"+UIData.label.code}}>'
			                     +'<img ng-class="UIData.label.picType"></img>'
			                     +'<span>'+'{{UIData.label.labelContent}}'+'</span>'
			                     +'&nbsp;:&nbsp;'
			                     +'<input placeholder="{{UIData.dataValue[0].magnitude}}" name={{UIData.label.enText+"_"+UIData.label.tableName}} id={{UIData.label.enText+"_"+UIData.label.code}} style="width:80px;">'
            			         +'&nbsp;'+'{{UIData.label.dataInfo[0].dataValue.list.units}}'+
                               '</li>',
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