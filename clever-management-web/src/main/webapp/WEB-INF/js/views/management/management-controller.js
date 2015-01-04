function ManagementCtrl($scope, $state) {
	var undefined;
	$scope.$watch(function() {
		return $scope.$parent.containerHeight;
	}, function(newValue) {
		$scope.containerHeight = newValue - 110;
	});
	$scope.breadcrumbs = [];
	$scope.menus = [];
	// Breadcrumb tree initial
	$scope.breadcrumbTree = {};
	var management = $scope.breadcrumbTree.management = {
		title : 'MENU_MANAGEMENT',
		href : '#/management',
		state : 'management.list',
	};
	// Archetype management
	var archetype = management.archetype = {
		title : 'MENU_MANAGEMENT_ARCHETYPE',
		href : '#/management/archetype',
		state : 'management.archetype.list',
	};
	archetype.view = {
		title : 'MENU_MANAGEMENT_ARCHETYPE_VIEW',
		href : '#/management/archetype/view',
		state : 'management.archetype.view',
	};
	archetype.upload = {
		title : 'MENU_MANAGEMENT_ARCHETYPE_UPLOAD',
		href : '#/management/archetype/upload',
		state : 'management.archetype.upload',
	};
	// Storage management
	var storage = management.storage = {
		title : 'MENU_MANAGEMENT_STORAGE',
		href : '#/management/storage',
		state : 'management.storage.list',
	};
	// Application management
	var application = management.application = {
		title : 'MENU_MANAGEMENT_APPLICATION',
		href : '#/management/application',
		state : 'management.application.list',
	};
	application.design = {
		title : 'MENU_MANAGEMENT_APPLICATION_DESIGN',
		href : '#/management/application/design',
		state : 'management.application.design',
	};
	application.view = {
		title : 'MENU_MANAGEMENT_APPLICATION_VIEW',
		href : '#/management/application/view',
		state : 'management.application.view',
	};
	application.edit = {
		title : 'MENU_MANAGEMENT_APPLICATION_EDIT',
		href : '#/management/application/edit',
		state : 'management.application.edit',
	};
	// Integration management
	var integration = management.integration = {
		title : 'MENU_MANAGEMENT_INTEGRATION',
		href : '#/management/integration',
		state : 'management.integration.list',
	};

	$scope.selectMenu = function(menu) {
		$state.go(menu.state);
	};

	$scope.setBreadcrumbs = function(breadcrumbs) {
		$scope.breadcrumbs = breadcrumbs;
	};

	$scope.$watch('$state.current.name', function(newValue) {
		// Construct breadcrumbs
		$scope.breadcrumbs = [];
		var breadcrumbTree = $scope.breadcrumbTree;
		var stateChain = $scope.$state.current.name.split('.');
		angular.forEach(stateChain, function(path) {
			if (breadcrumbTree[path] != undefined) {
				breadcrumbTree = breadcrumbTree[path];
				$scope.breadcrumbs.push(breadcrumbTree);
			}
		});
		// Construct dock menu
		$scope.menus = [];
		var lastState = stateChain.pop();
		var menu = $scope.breadcrumbTree;
		angular.forEach(stateChain, function(path) {
			if (menu[path] != undefined) {
				menu = menu[path];
			}
		});
		angular.forEach(menu, function(value) {
			if (angular.isObject(value)) {
				$scope.menus.push({
					title : value.title,
					imgUrl : 'img/logo.png',
					state : value.state,
				});
			}
		});
		if (stateChain.length > 1) {
			$scope.menus.push({
				title : 'MENU_RETURN',
				imgUrl : 'img/logo.png',
				state : $state.current.data.parent,
			});
		}
	});

}