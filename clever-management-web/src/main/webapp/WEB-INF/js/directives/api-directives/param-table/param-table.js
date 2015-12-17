angular.module('clever.management.directives.paramTable', []).directive('paramTable', function() {
	return {
		restrict : 'E',
		transclude : true,
		scope : {
			paramList:'=',
			selectParamCallback:'&',
			paramType:'@',
			language:'=',
		},
		templateUrl : 'js/directives/api-directives/param-table/param-table.html',
		controller : function($scope) {	 
    	var baseTypeList = ['string', 'int', 'datetime'];
	    $scope.getFixClass = function(type) {
		var temp = type.slice(type.indexOf(":") + 1, type.length).toLowerCase();
		if (baseTypeList.indexOf(temp) != -1) {
			return temp;
		} else {
			return 'others';
		};
	};
	
	$scope.getFixTypeName = function(type) {
		return type.slice(type.indexOf(":") + 1, type.length);
	};
		 $scope.getParamDetails = function(param){
		  $scope.selectParamCallback({
		  value : param})
		 }
	}
}
})