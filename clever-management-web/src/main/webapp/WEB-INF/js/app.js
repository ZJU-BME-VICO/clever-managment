angular.module('clever.management.directives', []);
angular.module('clever.management.services', []);
angular.module('clever.management.filters', []);
angular.module('clever.management.controllers', ['clever.management.controllers.app']);
angular.module('clever.management.i18n', ['clever.management.i18n.zh']);
angular.module('cleverManagementApp', ['ngAnimate', 'ui.bootstrap', 'pascalprecht.translate', 'ui.router', 'clever.management.i18n', 'clever.management.directives', 'clever.management.controllers', 'clever.management.services', 'clever.management.filters', 'clever.management.config']).config(function($stateProvider, $urlRouterProvider, $translateProvider) {

	$urlRouterProvider.otherwise('/');

	// UI router config
	$stateProvider.state('home', {
		url : '/',
		templateUrl : 'js/views/home/home.html',
	}).state('login', {
		url : '/login',
		templateUrl : 'js/views/login/login.html',

	})
	// Management
	.state('management', {
		abstract : true,
		url : '/management',
		templateUrl : 'js/views/management/management.html',
		controller : function($scope) {
			$scope.breadcrumbs = [];
			$scope.setBreadcrumbs = function(breadcrumbs) {
				$scope.breadcrumbs = breadcrumbs;
			};
		}
	}).state('management.list', {
		url : '',
		templateUrl : 'js/views/management/management.list.html',
		controller : function($scope) {
			var breadcrumbs = [];
			breadcrumbs.push({
				title : '管理',
				href : '#/management'
			});
			$scope.setBreadcrumbs(breadcrumbs);
		},
	})
	// Archetype
	.state('management.archetype', {
		abstract : true,
		url : '/archetype',
		views : {
			'' : {
				template : '<div class="row" ui-view></div>',
			},
			'menu' : {
				templateUrl : 'js/views/management/archetype/management.archetype.menu.html',
			}
		},

	}).state('management.archetype.list', {
		url : '',
		templateUrl : 'js/views/management/archetype/management.archetype.list.html',
		controller : function($scope) {
			var breadcrumbs = [];
			breadcrumbs.push({
				title : '管理',
				href : '#/management'
			});
			breadcrumbs.push({
				title : '原型 ',
				href : '#/management/archetype'
			});
			$scope.setBreadcrumbs(breadcrumbs);
		},
	});

	// Translate config
	$translateProvider.preferredLanguage('zh');

}).run(function($rootScope, $state, $stateParams, WEBSITE_DOMAIN) {
	$rootScope.WEBSITE_DOMAIN = WEBSITE_DOMAIN;
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
});

