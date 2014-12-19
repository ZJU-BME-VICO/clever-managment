function ManagementCtrl($scope) {
	var undefined;
	$scope.breadcrumbs = [];
	// Breadcrumb tree initial
	$scope.breadcrumbTree = {};
	var management = $scope.breadcrumbTree.management = {
		title : '管理功能',
		href : '#/management',
	};
	// Archetype management
	var archetype = management.archetype = {
		title : '原型管理',
		href : '#/management/archetype'
	};
	archetype.view = {
		title : '原型查看',
		href : '#/management/archetype/view',
	};
	archetype.upload = {
		title : '原型上传',
		href : '#/management/archetype/upload',
	};
	// Storage management
	var storage = management.storage = {
		title : '存储管理',
		href : '#/management/storage'
	};
	// Application management
	var application = management.application = {
		title : '应用管理',
		href : '#/management/application'
	};
	application.designer = {
		title : '设计器',
		href : '#/management/application/designer'
	};
	application.view = {
		title : '应用查看',
		href : '#/management/application/view',
	};
	application.edit = {
		title : '应用编辑',
		href : '#/management/application/edit',
	};
	// Integration management
	var integration = management.integration = {
		title : '集成管理',
		href : '#/management/archetype'
	};
	$scope.setBreadcrumbs = function(breadcrumbs) {
		$scope.breadcrumbs = breadcrumbs;
	};
	$scope.$watch('$state.current.name', function(newValue) {
		$scope.breadcrumbs = [];
		var breadcrumbTree = $scope.breadcrumbTree;
		angular.forEach($scope.$state.current.name.split('.'), function(path) {
			if (breadcrumbTree[path] != undefined) {
				breadcrumbTree = breadcrumbTree[path];
				$scope.breadcrumbs.push(breadcrumbTree);
			}
		});
	});

}