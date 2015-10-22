angular.module('clever.management.directives', ['clever.management.directives.commons', 'clever.management.directives.templateDesign', 'clever.management.directives.editor','clever.management.directives.archetypeListTree', 'clever.management.directives.archetypeListTreeNode', 'clever.management.directives.archetypeMasterPane', 'clever.management.directives.archetypePane', 'clever.management.directives.headerPane', 'clever.management.directives.participationPane','clever.management.directives.definitionPane', 'clever.management.directives.terminologyPane', 'clever.management.directives.treeView', 'clever.management.directives.treeViewNode', 'clever.management.directives.introduction']);
angular.module('clever.management.directives.commons', ['ui.bootstrap.accordion','toggle-switch', 'clever.management.directives.filesModel', 'clever.management.directives.busyModel', 'clever.management.directives.splitter', 'clever.management.drectives.documentDiff']);
angular.module('clever.management.directives.templateDesign', ['clever.management.directives.templateListTree','clever.management.directives.storagetemplateListTree', 'clever.management.directives.templateListTreeNode','clever.management.directives.storagetemplateListTreeNode', 'clever.management.directives.DVTEXT', 'clever.management.directives.longPress', 'clever.management.directives.DVQUANTITY', 
                'clever.management.directives.dragable', 'clever.management.directives.DVORDINAL', 'clever.management.directives.DVBOOLEAN', 'clever.management.directives.DVCOUNT', 'clever.management.directives.DVDATETIME','clever.management.directives.groupNodeView','clever.management.directives.controlBox','clever.management.directives.templateDesigner','clever.management.directives.cluster','clever.management.directives.rightClick','clever.management.directives.ngContextMenu','clever.management.directives.dvbutton','clever.management.directives.dvLabel']);
angular.module('clever.management.directives.editor', ['clever.management.directives.subjectPane', 'clever.management.directives.linksPane', 'clever.management.directives.editDefinitionPane','clever.management.directives.editHeaderPane','clever.management.directives.editOntologyPane']);
angular.module('clever.management.directives.introduction', ['clever.management.directives.introductionPane']);
angular.module('clever.management.services', ['clever.management.services.treeDataFormat','clever.management.services.templateCreate','clever.management.services.resource','clever.management.service.archetypeEdit','clever.management.service.archetypeParseEdit','clever.management.service.archetypeSerialize', 'clever.management.services.authentication', 'clever.management.services.busy', 'clever.management.services.msgbox', 'clever.management.services.templateParse', 'clever.management.services.templateParseToEdit', 'clever.management.services.archetypeParse', 'clever.management.services.documentDiffModal']);
angular.module('clever.management.filters', ['clever.management.filters.unsafe']);
angular.module('clever.management.controllers', ['clever.management.controllers.app']);
angular.module('clever.management.i18n', ['clever.management.i18n.zh']);
angular.module('cleverManagementApp', ['ngAnimate', 'ui.bootstrap.typeahead', 'ngVisible', 'ui.bootstrap', 'pascalprecht.translate', 'dndLists', 'ui.router', 'ui.utils', 'ng-context-menu', 'clever.management.i18n', 'clever.management.directives', 'clever.management.controllers', 'clever.management.services', 'clever.management.filters', 'clever.management.config']).config(function($stateProvider, $urlRouterProvider, $translateProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

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
	})
	// Archetype
	.state('management.archetype', {
		abstract : true,
		url : '/archetype',
		templateUrl : 'js/views/universal-ui-view.html',
	}).state('management.archetype.list', {
		url : '',
		//templateUrl : 'js/views/management/archetype/management.archetype.list.html',
		templateUrl : 'js/views/management/universal-management-list-view.html',
		controller : UniversalManagementListCtrl,
		data : {
			title : 'MENU_MANAGEMENT_ARCHETYPE',
		},
		params : {
			isHeader : true,
		}
	
	}).state( 'management.archetype.list.breif', {
		url: 'list/breif',
		templateUrl : 'js/views/management/archetype/introduction/breif.html'
		
	}).state('management.archetype.list.view', {
		url :'/list/view',
		templateUrl : 'js/views/management/archetype/introduction/view.html',
		//controller: viewCtr,
	    
	}).state('management.archetype.list.edit', {
		url :'/list/edit',
		templateUrl : 'js/views/management/archetype/introduction/edit.html',
		
	}).state('management.archetype.list.verify',{
		url:'/list/verify',
		templateUrl : 'js/views/management/archetype/introduction/verify.html'
		
	}).state('management.archetype.list.upload',{
		url:'/list/upload',
		templateUrl : 'js/views/management/archetype/introduction/upload.html'
		
	}).state('management.archetype.view', {
		url : '/view',
		data : {
			title : 'MENU_MANAGEMENT_ARCHETYPE_VIEW',
		},
		templateUrl : 'js/views/management/archetype/view/management.archetype.view.html',
		controller : ArchetypeViewCtrl,
	}).state('management.archetype.upload', {
		url : '/upload',
		data : {
			title : 'MENU_MANAGEMENT_ARCHETYPE_UPLOAD',
		},
		templateUrl : 'js/views/management/archetype/upload/management.archetype.upload.html',
		controller : ArchetypeUploadCtrl,
	}).state('management.archetype.edit', {
		url : '/edit',
		data : {
			title : 'MENU_MANAGEMENT_ARCHETYPE_EDIT',
		},
		templateUrl : 'js/views/management/archetype/edit/management.archetype.edit.html',
		controller : ArchetypeEditCtrl,
	}).state('management.archetype.verify', {
		url : '/verify',
		data : {
			title : 'MENU_MANAGEMENT_ARCHETYPE_VERIFY',
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
			title : '',
		},
		templateUrl : 'js/views/universal-ui-view.html',
	}).state('management.storage.list', {
		url : '',
		templateUrl : 'js/views/management/universal-management-list-view.html',
		controller : UniversalManagementListCtrl,
		data : {
			title : 'MENU_MANAGEMENT_STORAGE',
		},
		params : {
			isHeader : true,
		},
	}).state('management.storage.list.breif', {
		url: '/list/breif',
		templateUrl : 'js/views/management/storage/introduction/breif.html',
	}).state('management.storage.list.view', {
		url: '/list/view',
		templateUrl : 'js/views/management/storage/introduction/view.html',
	}).state('management.storage.list.upload', {
		url: '/list/upload',
		templateUrl : 'js/views/management/storage/introduction/upload.html',
	}).state('management.storage.list.edit', {
		url: '/list/edit',
		templateUrl : 'js/views/management/storage/introduction/edit.html',
	}).state('management.storage.list.verify', {
		url: '/list/verify',
		templateUrl : 'js/views/management/storage/introduction/verify.html',
	}).state('management.storage.list.deploy', {
		url: '/list/deploy',
		templateUrl : 'js/views/management/storage/introduction/deploy.html',
	})
	.state('management.storage.view', {
		url : '/view',
		controller : 'StorageTemplateViewCtrl',
		data : {
			title : 'MENU_MANAGEMENT_STORAGE_VIEW',
		},	
		params : { template:null,
		},
		resolve : {
			load : function(resourceService) {
				return resourceService.load(['js/views/management/storage/view/storage-template-view-controller.js', 'js/directives/template-master-pane/template-master-pane-directive.js', 'js/directives/storage-template-pane/storage-template-pane-directive.js']);
			},
		},
		templateUrl : 'js/views/management/storage/view/management.storage.view.html',
	}).state('management.storage.upload', {
		url : '/upload',
		data : {
			title : 'MENU_MANAGEMENT_STORAGE_UPLOAD',
		},
		controller : StorageTemplateUploadCtrl,
		templateUrl : 'js/views/management/storage/upload/management.storage.upload.html',
	}).state('management.storage.edit', {
		url : '/edit',
		controller : StorageTemplateEditCtrl,
		templateUrl : 'js/views/management/storage/edit/management.storage.edit.html',
		data : {
			title : 'MENU_MANAGEMENT_STORAGE_EDIT',
		}
	}).state('management.storage.verify', {
		url : '/verify',
		controller : StorageTemplateVerifyCtrl,
		templateUrl : 'js/views/management/storage/verify/management.storage.verify.html',
		data : {
			title : 'MENU_MANAGEMENT_STORAGE_VERIFY',
		}
	}).state('management.storage.deploy', {
		url : '/deploy',
		controller : StorageTemplateDeployCtrl,
		templateUrl : 'js/views/management/storage/deploy/management.storage.deploy.html',
		data : {
			title : 'MENU_MANAGEMENT_STORAGE_DEPLOY',
		}
	})
	// Application
	.state('management.application', {
		abstract : true,
		url : '/application',
		templateUrl : 'js/views/universal-ui-view.html',
	}).state('management.application.list', {
		url : '',
		templateUrl : 'js/views/management/universal-management-list-view.html',
		controller : UniversalManagementListCtrl,
		data : {
			title : 'MENU_MANAGEMENT_APPLICATION',
		},
		params : {
			isHeader : true,
		},
	}).state('management.application.list.breif', {
		url : '/list/breif',
		templateUrl : 'js/views/management/application/introduction/breif.html',
	}).state('management.application.list.view', {
		url : '/list/view',
		templateUrl : 'js/views/management/application/introduction/view.html',
	}).state('management.application.list.edit', {
		url : '/list/edit',
		templateUrl : 'js/views/management/application/introduction/edit.html',
	}).state('management.application.view', {
		url : '/view',
		data : {
			title : 'MENU_MANAGEMENT_APPLICATION_VIEW',
		},
		templateUrl : 'js/views/management/application/view/management.application.view.html',
		controller : ApplicationViewCtrl,
	}).state('management.application.edit', {
		url : '/edit',
		data : {
			title : 'MENU_MANAGEMENT_APPLICATION_EDIT',
		},
		templateUrl : 'js/views/management/application/edit/management.application.edit.list.html',
		controller : ApplicationEditListCtrl,
	}).state('management.application.edit.detail', {
		url : '/id/:id',
		templateUrl : 'js/views/management/application/edit/detail/management.application.edit.detail.html',
		controller : ApplicationEditDetailCtrl,
		data : {
			title : 'MENU_MANAGEMENT_APPLICATION_EDIT',
		},
	})
	// Integration
	.state('management.integration', {
		abstract : true,
		url : '/integration',
		templateUrl : 'js/views/universal-ui-view.html',
	}).state('management.integration.list', {
		url : '',
		templateUrl : 'js/views/management/universal-management-list-view.html',
		controller : UniversalManagementListCtrl,
		data : {
			title : 'MENU_MANAGEMENT_INTEGRATION',
		},
		params : {
			isHeader : true,
		},
	}).state('management.integration.list.breif', {
		url : '/list/breif',
		templateUrl : 'js/views/management/integration/introduction/breif.html',
		
	})
	.state('management.development', {
		abstract : true,
		url : '/development',
		templateUrl : 'js/views/universal-ui-view.html',
	})
	.state('management.development.list', {
		url : '',
		templateUrl : 'js/views/management/universal-management-list-view.html',
		controller : UniversalManagementListCtrl,
		data : {
			title : 'MENU_MANAGEMENT_DEVELOPMENT',
		},
		params : {
			isHeader : true,
		},
	}).state('management.development.list.breif', {
		url : '/list/breif',
		templateUrl : 'js/views/management/development/introduction/breif.html',
	}).state('management.development.list.design', {
		url : '/list/design',
		templateUrl : 'js/views/management/development/introduction/design.html',
		
	}).state('management.development.list.api', {
		url : '/list/api',
		templateUrl : 'js/views/management/development/introduction/api.html',
	})
	.state('management.development.design', {
		url : '/design',
		data : {
			title : 'MENU_MANAGEMENT_DEVELOPMENT_DESIGN',
		},
		templateUrl : 'js/views/management/development/designer/management.development.designer.html',
		controller : DesignerCtrl,
	}).state('management.development.api', {
		url : '/api',
		data : {
			title : 'MENU_MANAGEMENT_DEVELOPMENT_API_DISPLAY',
		},
		templateUrl : 'js/views/management/development/api/management.development.api.html',
		controller : ApiCtr,
	}).state('management.development.cdr', {
		url : '/cdr',
		data : {
			title : 'MENU_MANAGEMENT_DEVELOPMENT_CDR',
		},
		templateUrl : 'js/views/management/development/cdr/management.development.cdr.html',
		controller : CdrCtr,
	});
     
	// Translate config
	$translateProvider.preferredLanguage('zh');

}).run(function($rootScope, $state, $stateParams, authenticationService, busyService, WEBSITE_DOMAIN) {

	$rootScope.WEBSITE_DOMAIN = WEBSITE_DOMAIN;
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;

	var authenticateWhiteList = ['home', 'login', 'management.archetype.list', 'management.storage.list', 'management.application.list', 'management.integration.list'];

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

