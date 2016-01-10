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

	// Archetype management
	var archetype = {
		title : 'MENU_MANAGEMENT_ARCHETYPE',
		state : 'management.archetype.list',
		icon : 'icon-th',
		info : 'MENU_MANAGEMENT_ARCHETYPE_INFO',
		isOpen : false,
		subMenus : [
			// Brief
			{
				title : 'MENU_MANAGEMENT_BRIEF',
				info : 'MENU_MANAGEMENT_ARCHETYPE_INFO',
				introductionState : 'management.archetype.list.breif',
				authority: 'PERMIT_ALL',
			},
			// View
			{
				title : 'MENU_MANAGEMENT_ARCHETYPE_VIEW',
				state : 'management.archetype.view',
				introductionState : 'management.archetype.list.view',
				icon : 'icon-film',
				info : 'MENU_MANAGEMENT_ARCHETYPE_VIEW_INFO',
				authority: 'ROLE_ARCHETYPE_VIEW',
			},
			// Upload
			{
				title : 'MENU_MANAGEMENT_ARCHETYPE_UPLOAD',
				state : 'management.archetype.upload',
				introductionState : 'management.archetype.list.upload',
				icon : 'icon-upload-alt',
				info : 'MENU_MANAGEMENT_ARCHETYPE_UPLOAD_INFO',
				authority: 'ROLE_ARCHETYPE_UPLOAD',
			},
			// Edit
			{
				title : 'MENU_MANAGEMENT_ARCHETYPE_EDIT',
				state : 'management.archetype.edit',
				introductionState : 'management.archetype.list.edit',
				icon : 'icon-edit',
				info : 'MENU_MANAGEMENT_ARCHETYPE_EDIT_INFO',
				pane : 'archetype-edit-introduction',
				authority: 'ROLE_ARCHETYPE_EDIT',
			},
			// Verify
			{
				title : 'MENU_MANAGEMENT_ARCHETYPE_VERIFY',
				state : 'management.archetype.verify',
				introductionState : 'management.archetype.list.verify',
				icon : 'icon-tags',
				info : 'MENU_MANAGEMENT_ARCHETYPE_VERIFY_INFO',
				authority: 'ROLE_ARCHETYPE_VERIFY',
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
			// Brief
			{
				title : 'MENU_MANAGEMENT_BRIEF',
				info : 'MENU_MANAGEMENT_STORAGE_INFO',
				pane : 'archetype-edit-introduction',
				introductionState : 'management.storage.list.breif',
				authority: 'PERMIT_ALL',
			},
			{
				title : 'MENU_MANAGEMENT_STORAGE_VIEW',
				state : 'management.storage.view',
				introductionState : 'management.storage.list.view',
				icon : 'icon-cog',
				info : 'MENU_MANAGEMENT_STORAGE_VIEW_INFO',
				authority: 'ROLE_TEMPLATE_VIEW',
			},
			{
				title : 'MENU_MANAGEMENT_STORAGE_UPLOAD',
				state : 'management.storage.upload',
				introductionState : 'management.storage.list.upload',
				icon : 'icon-cog',
				info : 'MENU_MANAGEMENT_STORAGE_UPLOAD_INFO',
				authority: 'ROLE_TEMPLATE_UPLOAD',
			},
			{
				title : 'MENU_MANAGEMENT_STORAGE_EDIT',
				state : 'management.storage.edit',
				introductionState : 'management.storage.list.edit',
				icon : 'icon-cog',
				info : 'MENU_MANAGEMENT_STORAGE_EDIT_INFO',
				authority: 'ROLE_TEMPLATE_EDIT',
			},
			{
				title : 'MENU_MANAGEMENT_STORAGE_VERIFY',
				state : 'management.storage.verify',
				introductionState : 'management.storage.list.verify',
				icon : 'icon-cog',
				info : 'MENU_MANAGEMENT_STORAGE_VERIFY_INFO',
				authority: 'ROLE_TEMPLATE_VERIFY',
			},
			{
				title : 'MENU_MANAGEMENT_STORAGE_DEPLOY',
				state : 'management.storage.deploy',
				introductionState : 'management.storage.list.deploy',
				icon : 'icon-cog',
				info : 'MENU_MANAGEMENT_STORAGE_DEPLOY_INFO',
				authority: 'ROLE_TEMPLATE_DEPLOY',
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
			// Brief
			{
				title : 'MENU_MANAGEMENT_BRIEF',
				info : 'MENU_MANAGEMENT_APPLICATION_INFO',
				introductionState : 'management.application.list.breif',
				authority: 'PERMIT_ALL',
			},
			
			{
				title : 'MENU_MANAGEMENT_APPLICATION_VIEW',
				state : 'management.application.view',
				introductionState : 'management.application.list.view',
				icon : 'icon-picture',
				info : 'MENU_MANAGEMENT_APPLICATION_VIEW_INFO',
				authority: 'ROLE_APPILCATION_VIEW',
			},
			{
				title : 'MENU_MANAGEMENT_APPLICATION_EDIT',
				state : 'management.application.edit',
				introductionState : 'management.application.list.edit',
				icon : 'icon-wrench',
				info : 'MENU_MANAGEMENT_APPLICATION_EDIT_INFO',
				authority: 'ROLE_APPILCATION_EDIT',
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
		subMenus : [
			// Brief
			{
				title : 'MENU_MANAGEMENT_BRIEF',
				info : 'MENU_MANAGEMENT_INTEGRATION_INFO',
				introductionState : 'management.integration.list.breif',
				authority: 'PERMIT_ALL',
			},
		],
	};
	
	var development = {
		title : 'MENU_MANAGEMENT_DEVELOPMENT',
		state : 'management.development.list',
		icon : 'icon-asterisk',
		info : 'MENU_MANAGEMENT_DEVELOPMENT_INFO',
		isOpen : false,
		subMenus : [
			// Brief
			{
				title : 'MENU_MANAGEMENT_BRIEF',
				info : 'MENU_MANAGEMENT_DEVELOPMENT_INFO',
				introductionState : 'management.development.list.breif',
				authority: 'PERMIT_ALL',
				
			},
			{
				title : 'MENU_MANAGEMENT_DEVELOPMENT_DESIGN',
				state : 'management.development.design',
				introductionState : 'management.development.list.design',
				icon :  'icon-magic',
				info : 'MENU_MANAGEMENT_DEVELOPMENT_DESIGN_INFO',
				authority: 'PERMIT_ALL',
			},
			{
				title : 'MENU_MANAGEMENT_DEVELOPMENT_API_DISPLAY',				   
				state : 'management.development.api.view',
				introductionState : 'management.development.list.api',
				icon : 'icon-magic',
				info : 'MENU_MANAGEMENT_DEVELOPMENT_API_INFO',
				authority: 'ROLE_API_VIEW',
			},
			{
				title : 'MENU_MANAGEMENT_DEVELOPMENT_API_EDIT',				   
				state : 'management.development.api.edit',
				introductionState : 'management.development.list.api',
				icon : 'icon-magic',
				info : 'MENU_MANAGEMENT_DEVELOPMENT_API_INFO',
				authority: 'ROLE_API_MAINTAIN',
			
			},
			// {
				// title : 'MENU_MANAGEMENT_DEVELOPMENT_CDR',
				// state : 'management.development.cdr',
				// introductionState : 'management.development.list.cdr',
				// icon : 'icon.magic',
				// info : 'MENU_MANAGEMENT_DEVELOPMENT_CDR_INFO',
			// }
		],
	};
	
	var developerItem = {
		title : 'MENU_MANAGEMENT_DEVELOPER',
		state : 'management.developer.list',
		icon : 'icon-screenshot',
		info : 'MENU_MANAGEMENT_DEVELOPER_INFO',
		isOpen : false,
		subMenus : [
		{
				title : 'MENU_MANAGEMENT_BRIEF',
				info : 'MENU_MANAGEMENT_DEVELOPER_INFO',
				introductionState : 'management.developer.list.breif',
				authority: 'ROLE_AUTHORIZE',
		},
		{
			    title : 'MENU_MANAGEMETN_DEVELOPER_AUTHORITY',				   
				state : 'management.developer.authority',
				introductionState : 'management.developer.list.authority',
				icon : 'icon-magic',
				info : 'MENU_MANAGEMENT_DEVELOPER_AUTHORITY_INFO',
				authority: 'ROLE_AUTHORIZE',
		}],
	
	};
	
	
	$scope.menus = [archetype,storage,application,integration, development, developerItem];//integration,
	
	$scope.stateMenuMap = {};
	

	// Construct menu map
	angular.forEach($scope.menus, function(menu, index) {
		$scope.stateMenuMap[menu.state] = menu;
		angular.forEach(menu.subMenus, function(subMenu, key) {
			if(subMenu.introductionState){
				$scope.stateMenuMap[subMenu.introductionState] = menu;	
			}
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
