angular.module('clever.management.controllers.app', []).controller('appCtrl', function($scope, $translate, $state, $window, $timeout, authenticationService) {

	$scope.isAuthenticated = false;
	$scope.$watch(function() {
		return authenticationService.isAuthenticated();
	}, function(newValue) {
		$scope.isAuthenticated = newValue;
	});

	$scope.selectLanguage = function(key) {
		$translate.use(key);
	};

	$scope.getCurrentLanguage = function() {
		var language = $translate.use();
		if (language == 'zh') {
			return 'LANGUAGE_ZH';
		} else if (language == 'en') {
			return 'LANGUAGE_EN';
		}
	};

	// Breadcrumb tree initial
	$scope.menus = [];
	$scope.stateMenuMap = {};
	// Archetype management
	var archetype = {
		title : 'MENU_MANAGEMENT_ARCHETYPE',
		state : 'management.archetype.list',
		icon : 'icon-th',
		info : 'MENU_MANAGEMENT_ARCHETYPE_INFO',
		isOpen : false,
		subMenus : [
			// View
			{
				title : 'MENU_MANAGEMENT_ARCHETYPE_VIEW',
				state : 'management.archetype.view',
				icon : 'icon-film',
				info : 'MENU_MANAGEMENT_ARCHETYPE_VIEW_INFO',
			},
			// Upload
			{
				title : 'MENU_MANAGEMENT_ARCHETYPE_UPLOAD',
				state : 'management.archetype.upload',
				icon : 'icon-upload-alt',
				info : 'MENU_MANAGEMENT_ARCHETYPE_UPLOAD_INFO',
			},
			// Edit
			{
				title : 'MENU_MANAGEMENT_ARCHETYPE_EDIT',
				state : 'management.archetype.edit',
				icon : 'icon-edit',
				info : 'MENU_MANAGEMENT_ARCHETYPE_EDIT_INFO',
			},
			// Verify
			{
				title : 'MENU_MANAGEMENT_ARCHETYPE_VERIFY',
				state : 'management.archetype.verify',
				icon : 'icon-tags',
				info : 'MENU_MANAGEMENT_ARCHETYPE_VERIFY_INFO',
			},
		],
	};
	
	// Storage management
	var storage = {
		title : 'MENU_MANAGEMENT_STORAGE',
		state : 'management.storage.list',
		icon : 'icon-cog',
		info : 'MENU_MANAGEMENT_STORAGE_INFO',
		isOpen : false,
		subMenus : [
			{
				title : 'MENU_MANAGEMENT_STORAGE_VIEW',
				state : 'management.storage.view',
				icon : 'icon-cog',
			},
			{
				title : 'MENU_MANAGEMENT_STORAGE_UPLOAD',
				state : 'management.storage.upload',
				icon : 'icon-cog',
			},
			{
				title : 'MENU_MANAGEMENT_STORAGE_EDIT',
				state : 'management.storage.edit',
				icon : 'icon-cog',
			},
			{
				title : 'MENU_MANAGEMENT_STORAGE_VERIFY',
				state : 'management.storage.verify',
				icon : 'icon-cog',
			},
			{
				title : 'MENU_MANAGEMENT_STORAGE_DEPLOY',
				state : 'management.storage.deploy',
				icon : 'icon-cog',
			},
		],
	};
	
	// Application management
	var application = {
		title : 'MENU_MANAGEMENT_APPLICATION',
		state : 'management.application.list',
		icon : 'icon-list-alt',
		info : 'MENU_MANAGEMENT_APPLICATION_INFO',
		isOpen : false,
		subMenus : [
			{
				title : 'MENU_MANAGEMENT_APPLICATION_DESIGN',
				state : 'management.application.design',
				icon : ' icon-magic',
				info : 'MENU_MANAGEMENT_APPLICATION_DESIGN_INFO',
			},
			{
				title : 'MENU_MANAGEMENT_APPLICATION_VIEW',
				state : 'management.application.view',
				icon : 'icon-picture',
				info : 'MENU_MANAGEMENT_APPLICATION_VIEW_INFO',
			},
			{
				title : 'MENU_MANAGEMENT_APPLICATION_EDIT',
				state : 'management.application.edit',
				icon : 'icon-wrench',
				info : 'MENU_MANAGEMENT_APPLICATION_EDIT_INFO',
			},
		],
	};
	
	// Integration management
	var integration = {
		title : 'MENU_MANAGEMENT_INTEGRATION',
		state : 'management.integration.list',
		icon : 'icon-screenshot',
		info : 'MENU_MANAGEMENT_INTEGRATION_INFO',
		isOpen : false,
	};
	$scope.menus.push(archetype);
	$scope.menus.push(storage);
	$scope.menus.push(application);
	$scope.menus.push(integration);

	// Construct menu map
	angular.forEach($scope.menus, function(menu, index) {
		$scope.stateMenuMap[menu.state] = menu;
		angular.forEach(menu.subMenus, function(subMenu, key) {
			$scope.stateMenuMap[subMenu.state] = subMenu;
		});
	});

	$scope.selectMenu = function(menu) {
		$state.go(menu.state);
	};

	$scope.containerHeight = $window.innerHeight - 100;

	angular.element($window).bind('resize', function() {
		$scope.containerHeight = $window.innerHeight - 100 < 400 ? 400 : $window.innerHeight - 100;
		$scope.$apply();
	});

});
