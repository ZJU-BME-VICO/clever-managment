function DesignerCtrl($scope,resourceService,templateParseService){
	$scope.language = [];
	$scope.defination={};
	var url='js/views/management/application/designer/111.xml';
	//var url='js/views/management/application/designer/HeartFailure.xml';
	resourceService.get(url).then(function(result){
		var x2js = new X2JS();
	    var tmp = x2js.xml_str2json(result).template;//对象里 有没有template属性？
	    var parseResult=templateParseService.parseTemplate(tmp);
	    $scope.archetypeList=parseResult;
	});

	$scope.treeControl = {};

	$scope.selectNode = function(node) {
		var a;
	};

	$scope.collapse = function() {
		$scope.treeControl.collapseAll();
	};

	$scope.expand = function() {
		$scope.treeControl.expandAll();
	};

	$scope.changeTree = function() {
		if ($scope.archetypeList == list1) {
			$scope.archetypeList = list2;
		} else {
			$scope.archetypeList = list1;
		}

	};
}

