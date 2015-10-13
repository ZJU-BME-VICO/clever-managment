function CdrCtr($scope, $http, $httpParamSerializer){
	$scope.selects = [{
		value : ''
	}];
	$scope.from = '';
	$scope.customWhere = true;
	$scope.whereExpr = '';
	$scope.wheres = [{
		value : ''
	}];
	$scope.aql = '';
	$scope.queryable = false;
	$scope.results = [];
	$scope.availableTemplates = [];

	$scope.targetTemplate = '';
	$scope.node = '';
	$scope.column = '';

	$scope.availableTables = [];
	$scope.targetTable = '';
	$scope.column1 = '';
	$scope.node1 = '';
   
 
	var temp = {
		name : 'AQL',
		url : AQL_URL
	};
	$scope.aqlTypes = [temp, {
		name : 'Limited AQL',
		url : LIMITED_AQL_URL
	}];
	$scope.aqlType = temp;
	
	// 'WEBSITE_DOMAIN' : prefix,
	// 'AVAILABLE_TEMPLATES_URL' : prefix + '/cdr/templates',
	// 'TEMPLATE_NODEPATHS_URL' : prefix + '/cdr/template/',
	// 'AQL_URL' : prefix + '/cdr/aql',
	// 'LIMITED_AQL_URL' : prefix + '/cdr/limitedAql',
	// 'COLUMN_NAME_URL' : prefix + '/cdr/template/',
	// 'TABLES_URL' : prefix + '/cdr/tables',
	// 'COLUMNS_URL' : prefix + '/cdr/table/',
	// 'NODE_PATH_URL' : prefix + '/cdr/table/',
	function getCompleteUrl(partUrl){
		// if(partUrl.indexOf('?') == -1){
		   // return "http://localhost:8090/clever-cdr-service" + partUrl + "?callback=JSON_CALLBACK";
		// }else{
			// return "http://localhost:8090/clever-cdr-service" + partUrl + "&callback=JSON_CALLBACK";
		// }	
		return "http://localhost:8090/clever-cdr-service" + partUrl + (partUrl.indexOf('?') == -1 ? "?" : "&") + "callback=JSON_CALLBACK";
	}
	var AVAILABLE_TEMPLATES_URL = '/cdr/templates';
	var AQL_URL = '/cdr/aql';
	var LIMITED_AQL_URL = '/cdr/limitedAql';
	var WEBSITE_DOMAIN = '';
	var TABLES_URL = '/cdr/tables';
    var TEMPLATE_NODEPATHS_URL = '/cdr/template/';
	var COLUMN_NAME_URL = '/cdr/template/';
	var NODE_PATH_URL = '/cdr/table/';
	var COLUMNS_URL = '/cdr/table/';
		
		
	
	$http.jsonp(getCompleteUrl(AVAILABLE_TEMPLATES_URL)).success(function(data, status, headers, config) {
		if (angular.isArray(data)) {
			$scope.availableTemplates = data;
		} else {
			$scope.availableTemplates = [data];
		}
	}).error(function(data, status, headers, config) {

	});

    //-----------------------down-----------------------
	// $http.get(AVAILABLE_TEMPLATES_URL).success(function(data, status, headers, config) {
		// if (angular.isArray(data)) {
			// $scope.availableTemplates = data;
		// } else {
			// $scope.availableTemplates = [data];
		// }
	// }).error(function(data, status, headers, config) {
// 
	// });


   $http.jsonp(getCompleteUrl(TABLES_URL)).success(function(data, status, headers, config) {
   	    console.log("get tables successfully :" + data);
   	    
		if (angular.isArray(data)) {
			$scope.availableTables = data;
		} else {
			$scope.availableTables = [data];
		}
	}).error(function(data, status, headers, config) {
          console.log("get tables failed");
	});
	//-----------------------down---------------------------
	// $http.get(TABLES_URL).success(function(data, status, headers, config) {
		// if (angular.isArray(data)) {
			// $scope.availableTables = data;
		// } else {
			// $scope.availableTables = [data];
		// }
	// }).error(function(data, status, headers, config) {
// 
	// });


	$scope.$watch('from', function(newValue, oldValue) {
		if (newValue != oldValue) {
			$http.jsonp(getCompleteUrl(TEMPLATE_NODEPATHS_URL + $scope.from + '/paths')).success(function(data, status, headers, config) {
				console.log("get template with node path (in form) successfully ");
				$scope.nodePaths = data;
			}).error(function(data, status, headers, config) {
                console.log("failed in form");
			});
			$scope.selects = [{
				value : ''
			}];
			$scope.wheres = [{
				value : ''
			}];
		}
	});
	
	// $scope.$watch('from', function(newValue, oldValue) {
		// if (newValue != oldValue) {
			// $http.get(TEMPLATE_NODEPATHS_URL + $scope.from + '/paths').success(function(data, status, headers, config) {
				// $scope.nodePaths = data;
			// }).error(function(data, status, headers, config) {
// 
			// });
			// $scope.selects = [{
				// value : ''
			// }];
			// $scope.wheres = [{
				// value : ''
			// }];
		// }
	// });



	$scope.$watch('targetTemplate', function(newValue, oldValue) {
		if (newValue != oldValue) {	
			$http.jsonp(getCompleteUrl(TEMPLATE_NODEPATHS_URL + $scope.targetTemplate + '/paths')).success(function(data, status, headers, config) {
				console.log("get template with node path (in targetTemplate ) successfully ");
				$scope.targetTemplateNodePaths = data;
			}).error(function(data, status, headers, config) {
                console.log("failed in targetTemplate");
			});
			$scope.node = '';
			$scope.column = '';
		}
	});

	// $scope.$watch('targetTemplate', function(newValue, oldValue) {
		// if (newValue != oldValue) {
			// $http.get(TEMPLATE_NODEPATHS_URL + $scope.targetTemplate + '/paths').success(function(data, status, headers, config) {
				// $scope.targetTemplateNodePaths = data;
			// }).error(function(data, status, headers, config) {
// 
			// });
			// $scope.node = '';
			// $scope.column = '';
		// }
	// });
// 

     $scope.$watch('node', function(newValue, oldValue) {
		if (newValue != oldValue && newValue != '') {
			$http.jsonp(getCompleteUrl(COLUMN_NAME_URL + encodeURI($scope.targetTemplate) + "/column?" + $httpParamSerializer({
				path : $scope.node
			}))).success(function(data, status, headers, config) {
					console.log("successfully in node request");
				$scope.column = 'Table: ' + data.tableName + ', Column: ' + data.columnName;
			}).error(function(data, status, headers, config) {
				console.log("failed in node");
				$scope.column = 'Not found';
			});
		}
	 });

	// $scope.$watch('node', function(newValue, oldValue) {
		// if (newValue != oldValue && newValue != '') {
			// $http.get(COLUMN_NAME_URL + encodeURI($scope.targetTemplate) + "/column?" + $httpParamSerializer({
				// path : $scope.node
			// })).success(function(data, status, headers, config) {
				// $scope.column = 'Table: ' + data.tableName + ', Column: ' + data.columnName;
			// }).error(function(data, status, headers, config) {
				// $scope.column = 'Not found';
			// });
		// }
	// });
// 
    $scope.$watch('targetTable', function(newValue, oldValue) {
		if (newValue != oldValue) {
			$http.jsonp(getCompleteUrl(COLUMNS_URL + $scope.targetTable + '/columns')).success(function(data, status, headers, config) {
				console.log("successful in target tables");
				$scope.targetTableColumns = data;
			}).error(function(data, status, headers, config) {
                console.log("failed in target table");
			});
			$scope.node1 = '';
			$scope.column1 = '';
		}
	});


	// $scope.$watch('targetTable', function(newValue, oldValue) {
		// if (newValue != oldValue) {
			// $http.get(COLUMNS_URL + $scope.targetTable + '/columns').success(function(data, status, headers, config) {
				// $scope.targetTableColumns = data;
			// }).error(function(data, status, headers, config) {
// 
			// });
			// $scope.node1 = '';
			// $scope.column1 = '';
		// }
	// });
// 
    $scope.$watch('column1', function(newValue, oldValue) {
		if (newValue != oldValue && newValue != '') {
			$http.jsonp(getCompleteUrl(NODE_PATH_URL + $scope.targetTable + '/column/' + $scope.column1)).success(function(data, status, headers, config) {
				console.log("success in colum1");
				$scope.node1 = data.nodePath;
			}).error(function(data, status, headers, config) {
				console.log("failed in colum1");
				$scope.node1 = 'Not found';
			});
		}
	});


	// $scope.$watch('column1', function(newValue, oldValue) {
		// if (newValue != oldValue && newValue != '') {
			// $http.get(NODE_PATH_URL + $scope.targetTable + '/column/' + $scope.column1).success(function(data, status, headers, config) {
				// $scope.node1 = data.nodePath;
			// }).error(function(data, status, headers, config) {
				// $scope.node1 = 'Not found';
			// });
		// }
	// });
// 

	$scope.startsWith = function(state, viewValue) {
		return state.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase();
	};

	$scope.addSelect = function() {
		if ($scope.selects.length == 0 || $scope.selects[$scope.selects.length - 1].value != '') {
			$scope.selects.push({
				value : ''
			});
		}
	};

	$scope.deleteSelect = function(select) {
		$scope.selects.splice($scope.selects.indexOf(select), 1);
		if ($scope.selects.length == 0) {
			$scope.addSelect();
		}
	};

	$scope.addWhere = function() {
		if ($scope.wheres.length == 0 || $scope.wheres[$scope.wheres.length - 1].value != '') {
			$scope.wheres.push({
				value : ''
			});
		}
	};

	$scope.deleteWhere = function(where) {
		$scope.wheres.splice($scope.wheres.indexOf(where), 1);
		if ($scope.wheres.length == 0) {
			$scope.addWhere();
		}
	};
	
	
	$scope.query = function() {
		if ($scope.queryable) {
			$http.jsonp(getCompleteUrl($scope.aqlType.url + '?' + $httpParamSerializer({
				aql : $scope.getAql()
			})))
			.success(function(data, status, headers, config) {
				$scope.results = data;
				$scope.lastQueryTime = new Date();
				if ($scope.results.length > 0) {
					$scope.selectedResult = $scope.results[0];
				} else {
					$scope.selectedResult = '';
				}
			}).error(function(data, status, headers, config) {
				$scope.results = [{
					uid : 'error',
					value : data
				}];
				$scope.selectedResult = $scope.results[0];
			});
		}
	};


	// $scope.query = function() {
		// if ($scope.queryable) {
			// $http.get($scope.aqlType.url + '?' + $httpParamSerializer({
				// aql : $scope.getAql()
			// })).success(function(data, status, headers, config) {
				// $scope.results = data;
				// $scope.lastQueryTime = new Date();
				// if ($scope.results.length > 0) {
					// $scope.selectedResult = $scope.results[0];
				// } else {
					// $scope.selectedResult = '';
				// }
			// }).error(function(data, status, headers, config) {
				// $scope.results = [{
					// uid : 'error',
					// value : data
				// }];
				// $scope.selectedResult = $scope.results[0];
			// });
		// }
	// };
// 
	 var ctrlDown = false;
	$scope.keyDown = function(event) {
		if (event.keyCode == 17) {
			ctrlDown = true;
		}
		if (ctrlDown && event.keyCode == 81) {
			$scope.query();
		}
		if (ctrlDown && event.keyCode == 38) {
			if ($scope.results.length > 0) {
				var nextIndex = $scope.results.indexOf($scope.selectedResult) + 1;
				if (nextIndex >= $scope.results.length) {
					nextIndex = 0;
				}
				$scope.selectedResult = $scope.results[nextIndex];
			}
			event.preventDefault();
		}
		if (ctrlDown && event.keyCode == 40) {
			if ($scope.results.length > 0) {
				var nextIndex = $scope.results.indexOf($scope.selectedResult) - 1;
				if (nextIndex < 0) {
					nextIndex = $scope.results.length - 1;
				}
				$scope.selectedResult = $scope.results[nextIndex];
			}
			event.preventDefault();
		}
	};
	$scope.selectKeyDown = function(event, select) {
		if (ctrlDown && event.keyCode == 187) {
			$scope.addSelect();
			event.preventDefault();
		}
		if (ctrlDown && event.keyCode == 189) {
			$scope.deleteSelect(select);
			event.preventDefault();
		}
	};

	$scope.whereKeyDown = function(event, where) {
		if (ctrlDown && event.keyCode == 187) {
			$scope.addWhere();
			event.preventDefault();
		}
		if (ctrlDown && event.keyCode == 189) {
			$scope.deleteWhere(where);
			event.preventDefault();
		}
	};

	$scope.whereExprKeyDown = function() {
		if (ctrlDown && event.keyCode == 39) {
			$scope.whereExpr += 'var' + $scope.whereSegment;
			$scope.whereSegment = '';
		}
	};

	$scope.columnKeyDown = function() {
		if (event.keyCode == 13) {
			$http.jsonp(getCompleteUrl(COLUMN_NAME_URL + encodeURI($scope.targetTemplate) + "/column?" + $httpParamSerializer({
				path : $scope.node
			}))).success(function(data, status, headers, config) {
				$scope.column = 'Table: ' + data.tableName + ', Column: ' + data.columnName;
			}).error(function(data, status, headers, config) {
				$scope.column = 'Not found';
			});
		}
	};


	// $scope.columnKeyDown = function() {
		// if (event.keyCode == 13) {
			// $http.get(COLUMN_NAME_URL + encodeURI($scope.targetTemplate) + "/column?" + $httpParamSerializer({
				// path : $scope.node
			// })).success(function(data, status, headers, config) {
				// $scope.column = 'Table: ' + data.tableName + ', Column: ' + data.columnName;
			// }).error(function(data, status, headers, config) {
				// $scope.column = 'Not found';
			// });
		// }
	// };
// 
	$scope.keyUp = function(event) {
		if (event.keyCode == 17) {
			ctrlDown = false;
		}
	};

	var pattern = /\w+-\w+-(\w+)\..+/;
	$scope.getAql = function() {
		if ($scope.from != '' && $scope.selects.length > 0 && $scope.selects[$scope.selects.length - 1].value != '' && ((!$scope.customWhere && $scope.wheres.length > 0 && $scope.wheres[$scope.wheres.length - 1].value != '') || ($scope.customWhere && $scope.whereExpr != ''))) {
			var aql = 'select ';
			angular.forEach($scope.selects, function(value, index) {
				if (index > 0) {
					aql += ', ';
				}
				aql += 'var' + value.value;
			});
			aql += ' from ' + pattern.exec($scope.from)[1] + ' var[' + $scope.from + '] where ';
			if ($scope.customWhere) {
				aql += $scope.whereExpr;
			} else {
				angular.forEach($scope.wheres, function(value, index) {
					if (index > 0) {
						aql += ' and ';
					}
					aql += 'var' + value.value;
				});
			}
			$scope.queryable = true;
			return aql;
		} else {
			$scope.queryable = false;
		}
	};
}
