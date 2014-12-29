angular.module('clever.management.directives', ['clever.management.directives.commons', 'clever.management.directives.templateDesign', 'clever.management.directives.archetypeListTree', 'clever.management.directives.archetypeListTreeNode']);
angular.module('clever.management.directives.commons', ['clever.management.directives.filesModel', 'clever.management.directives.busyModel', 'clever.management.directives.splitter', 'clever.management.directives.fisheyeMenu']);
angular.module('clever.management.directives.templateDesign', ['clever.management.directives.templateListTree', 'clever.management.directives.templateListTreeNode', 'clever.management.directives.DVTEXT', 'clever.management.directives.longPress','clever.management.directives.DVQUANTITY','clever.management.directives.dragable','clever.management.directives.DVORDINAL']);
angular.module('clever.management.services', ['clever.management.services.resource', 'clever.management.services.authentication', 'clever.management.services.busy', 'clever.management.services.msgbox', 'clever.management.services.templateParse']);
angular.module('clever.management.filters', ['clever.management.filters.unsafe']);
angular.module('clever.management.controllers', ['clever.management.controllers.app']);
angular.module('clever.management.i18n', ['clever.management.i18n.zh']);
angular.module('cleverManagementApp', ['ngAnimate', 'ui.bootstrap', 'pascalprecht.translate', 'ui.router', 'ui.utils', 'clever.management.i18n', 'clever.management.directives', 'clever.management.controllers', 'clever.management.services', 'clever.management.filters', 'clever.management.config'])
.config(function($stateProvider, $urlRouterProvider, $translateProvider) {

	// UI router config
	$urlRouterProvider.otherwise('/');
	// Home
	$stateProvider.state('home', {
		url : '/',
		templateUrl : 'js/views/home/home.html',
	})
	// Login
	.state('login', {
		url : '/login?errorType',
		templateUrl : 'js/views/login/login.html',
		controller : function($scope, $stateParams) {
			$scope.errorType = $stateParams.errorType;
			$scope.isErrorType = function(errorType) {
				return $scope.errorType == errorType;
			};
		},
	})
	// Management
	.state('management', {
		abstract : true,
		url : '/management',
		templateUrl : 'js/views/management/management.html',
		controller : ManagementCtrl,
	}).state('management.list', {
		url : '',
		templateUrl : 'js/views/management/management.list.html',
	})
	// Archetype
	.state('management.archetype', {
		abstract : true,
		url : '/archetype',
		templateUrl : 'js/views/universal-ui-view.html',
		controller : ArchetypePageCtrl,
	}).state('management.archetype.list', {
		url : '',
		templateUrl : 'js/views/management/archetype/management.archetype.list.html',
	}).state('management.archetype.view', {
		url : '/view',
		templateUrl : 'js/views/management/archetype/view/management.archetype.view.html',
		controller : ArchetypeViewCtrl,
	}).state('management.archetype.upload', {
		url : '/upload',
		templateUrl : 'js/views/management/archetype/upload/management.archetype.upload.html',
		controller : ArchetypeUploadCtrl,
	})
	// Storage
	.state('management.storage', {
		abstract : true,
		url : '/storage',
		templateUrl : 'js/views/universal-ui-view.html',
	}).state('management.storage.list', {
		url : '',
		templateUrl : 'js/views/management/storage/management.storage.list.html',
	})
	// Application
	.state('management.application', {
		abstract : true,
		url : '/application',
		templateUrl : 'js/views/universal-ui-view.html',
	}).state('management.application.list', {
		url : '',
		templateUrl : 'js/views/management/application/management.application.list.html',
	}).state('management.application.design', {
		url : '/design',
		templateUrl : 'js/views/management/application/designer/management.application.designer.html',
		controller : DesignerCtrl,
	}).state('management.application.view', {
		url : '/view',
		templateUrl : 'js/views/management/application/view/management.application.view.html',
		controller : ApplicationViewCtrl,
	}).state('management.application.edit', {
		url : '/edit',
		templateUrl : 'js/views/management/application/edit/management.application.edit.html',
		controller : ApplicationEditCtrl,
	})
	// Integration
	.state('management.integration', {
		abstract : true,
		url : '/integration',
		templateUrl : 'js/views/universal-ui-view.html',
	}).state('management.integration.list', {
		url : '',
		templateUrl : 'js/views/management/integration/management.integration.list.html',
	});

	// Translate config
	$translateProvider.preferredLanguage('zh');

}).run(function($rootScope, $state, $stateParams, authenticationService, busyService, WEBSITE_DOMAIN) {

	$rootScope.WEBSITE_DOMAIN = WEBSITE_DOMAIN;
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;

	var authenticateWhiteList = ['home', 'login', 'management.archetype.list', 'management.storage.list', 'management.application.list', 'managment.integration.list'];

	var id;

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		if (id) {
			busyService.popBusy(id);
		}
		id = busyService.pushBusy('BUSY_LOADING');
		if (authenticateWhiteList.indexOf(toState.name) < 0) {
			authenticationService.validateAuthentication().then(function(result) {
				if (!result.isAuthenticated) {
					event.preventDefault();
					if (result.previousIsAuthenticated) {
						$state.go('login', {
							errorType : 'SessionExpired'
						});
					} else {
						$state.go('login', {
							errorType : 'Unauthorized'
						});
					}
				}
			});
		}
	});

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		if (id) {
			busyService.popBusy(id);
		}
	});

});

