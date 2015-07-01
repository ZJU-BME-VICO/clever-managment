angular.module('clever.management.directives', ['clever.management.directives.commons', 'clever.management.directives.templateDesign', 'clever.management.directives.archetypeListTree', 'clever.management.directives.archetypeListTreeNode', 'clever.management.directives.archetypeMasterPane', 'clever.management.directives.archetypePane', 'clever.management.directives.headerPane', 'clever.management.directives.definitionPane', 'clever.management.directives.terminologyPane', 'clever.management.directives.treeView', 'clever.management.directives.treeViewNode']);
angular.module('clever.management.directives.commons', ['toggle-switch', 'clever.management.directives.filesModel', 'clever.management.directives.busyModel', 'clever.management.directives.splitter', 'clever.management.directives.fisheyeMenu','clever.management.directives.unfoldMenu', 'clever.management.drectives.documentDiff']);
angular.module('clever.management.directives.templateDesign', ['clever.management.directives.templateListTree','clever.management.directives.storagetemplateListTree', 'clever.management.directives.templateListTreeNode','clever.management.directives.storagetemplateListTreeNode', 'clever.management.directives.DVTEXT', 'clever.management.directives.longPress', 'clever.management.directives.DVQUANTITY', 'clever.management.directives.dragable', 'clever.management.directives.DVORDINAL', 'clever.management.directives.DVBOOLEAN', 'clever.management.directives.DVCOUNT', 'clever.management.directives.DVDATETIME']);
angular.module('clever.management.services', ['clever.management.services.resource', 'clever.management.services.authentication', 'clever.management.services.busy', 'clever.management.services.msgbox', 'clever.management.services.templateParse', 'clever.management.services.templateParseToEdit', 'clever.management.services.archetypeParse', 'clever.management.services.documentDiffModal']);
angular.module('clever.management.filters', ['clever.management.filters.unsafe']);
angular.module('clever.management.controllers', ['clever.management.controllers.app']);
angular.module('clever.management.i18n', ['clever.management.i18n.zh']);
angular.module('cleverManagementApp', ['ngAnimate', 'ngVisible', 'ui.bootstrap', 'pascalprecht.translate', 'ui.router', 'ui.utils', 'ng-context-menu', 'clever.management.i18n', 'clever.management.directives', 'clever.management.controllers', 'clever.management.services', 'clever.management.filters', 'clever.management.config']).config(function($stateProvider, $urlRouterProvider, $translateProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

	define('lazyLoader', function() {
		return {
			controller : $controllerProvider.register,
			directive : $compileProvider.directive,
			filter : $filterProvider.register,
			factory : $provide.factory,
			service : $provide.service
		};
	});
	
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|data|mias-iv|mias-cpoe|shine):/);
	
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
		data : {
			parent : 'management.list',
		},
		templateUrl : 'js/views/universal-ui-view.html',
		controller : ArchetypePageCtrl,
	}).state('management.archetype.list', {
		url : '',
		templateUrl : 'js/views/management/archetype/management.archetype.list.html',
	}).state('management.archetype.view', {
		url : '/view',
		data : {
			parent : 'management.archetype.list',
		},
		templateUrl : 'js/views/management/archetype/view/management.archetype.view.html',
		controller : ArchetypeViewCtrl,
	}).state('management.archetype.upload', {
		url : '/upload',
		data : {
			parent : 'management.archetype.list',
		},
		templateUrl : 'js/views/management/archetype/upload/management.archetype.upload.html',
		controller : ArchetypeUploadCtrl,
	}).state('management.archetype.edit', {
		url : '/edit',
		data : {
			parent : 'management.archetype.list',
		},
		templateUrl : 'js/views/management/archetype/edit/management.archetype.edit.html',
		controller : ArchetypeEditCtrl,
	}).state('management.archetype.verify', {
		url : '/verify',
		data : {
			parent : 'management.archetype.list',
		},
		templateUrl : 'js/views/management/archetype/verify/management.archetype.verify.html',
		controller : ArchetypeVerifyCtrl,
	})
	// Storage
	.state('management.storage', {
		abstract : true,
		url : '/storage',
		data : {
			parent : 'management.list',
		},
		templateUrl : 'js/views/universal-ui-view.html',
	}).state('management.storage.list', {
		url : '',
		templateUrl : 'js/views/management/storage/management.storage.list.html',
	}).state('management.storage.view', {
		url : '/view',
		controller : 'StorageTemplateViewCtrl',
		data : {
			parent : 'management.storage.list',
		},
		resolve : {
			load : function(resourceService) {
				return resourceService.load([
					'js/views/management/storage/view/storage-template-view-controller.js',
					'js/directives/template-master-pane/template-master-pane-directive.js',
					'js/directives/storage-template-pane/storage-template-pane-directive.js'
				]);
			},
		},
		templateUrl : 'js/views/management/storage/view/management.storage.view.html',
	}).state('management.storage.upload', {
		url : '/upload',
		data : {
			parent : 'management.storage.list',
		},
		controller : StorageTemplateUploadCtrl,
		templateUrl : 'js/views/management/storage/upload/management.storage.upload.html',
	}).state('management.storage.edit', {
		url : '/edit',
		controller : StorageTemplateEditCtrl,
		templateUrl : 'js/views/management/storage/edit/management.storage.edit.html',
	}).state('management.storage.verify', {
		url : '/verify',
		controller : StorageTemplateVerifyCtrl,
		templateUrl : 'js/views/management/storage/verify/management.storage.verify.html',
	}).state('management.storage.deploy', {
		url : '/deploy',
		controller : StorageTemplateDeployCtrl,
		templateUrl : 'js/views/management/storage/deploy/management.storage.deploy.html',
	})
	// Application
	.state('management.application', {
		abstract : true,
		url : '/application',
		data : {
			parent : 'management.list',
		},
		templateUrl : 'js/views/universal-ui-view.html',
	}).state('management.application.list', {
		url : '',
		templateUrl : 'js/views/management/application/management.application.list.html',
	}).state('management.application.design', {
		url : '/design',
		data : {
			parent : 'management.application.list',
		},
		templateUrl : 'js/views/management/application/designer/management.application.designer.html',
		controller : DesignerCtrl,
	}).state('management.application.view', {
		url : '/view',
		data : {
			parent : 'management.application.list',
		},
		templateUrl : 'js/views/management/application/view/management.application.view.html',
		controller : ApplicationViewCtrl,
	}).state('management.application.edit', {
		url : '/edit',
		data : {
			parent : 'management.application.list',
		},
		templateUrl : 'js/views/management/application/edit/management.application.edit.list.html',
		controller : ApplicationEditListCtrl,
	}).state('management.application.edit.detail', {
		url : '/id/:id',
		templateUrl : 'js/views/management/application/edit/detail/management.application.edit.detail.html',
		controller : ApplicationEditDetailCtrl,
	})
	// Integration
	.state('management.integration', {
		abstract : true,
		url : '/integration',
		data : {
			parent : 'management.list',
		},
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

