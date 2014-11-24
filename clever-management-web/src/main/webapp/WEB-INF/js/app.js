angular.module('clever.management.directives', []);
angular.module('clever.management.services', []);
angular.module('clever.management.filters', []);
angular.module('clever.management.controllers', ['clever.management.controllers.app']);
angular.module('clever.management.i18n', ['clever.management.i18n.zh']);
angular.module('cleverManagementApp', ['pascalprecht.translate', 'clever.management.i18n', 'clever.management.directives', 'clever.management.controllers', 'clever.management.services', 'clever.management.filters', 'clever.management.config'])
.config(function($translateProvider) {
	
	//translate config
	$translateProvider.preferredLanguage('zh');
	
})
.run(function() {
	
});
