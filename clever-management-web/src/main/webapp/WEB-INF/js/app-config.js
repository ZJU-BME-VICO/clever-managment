var prefix = '/clever-management-web';
var config = {
	'WEBSITE_DOMAIN' : prefix,
	'AUTHENTICATION_URL' : prefix + '/authentication',
	'ARCHETYPE_VALIDATE_URL' : prefix + '/archetypes/action/validate',
	'ARCHETYPE_UPLOAD_URL' : prefix + '/archetypes/action/upload',
	'ARCHETYPE_LIST_URL' : prefix + '/archetypes/list',
	'ARCHETYPE_MASTER_BY_ID_URL' : prefix + '/archetypes/master/id/',
	'ARCHETYPE_BY_ID_URL' : prefix + '/archetypes/id/',
	'APPLICATION_LIST_URL' : prefix + '/applications/list',
	'APPLICATION_UPLOAD_URL' : prefix + '/applications/application',
	'APPLICATION_BY_ID_URL' : prefix + '/applications/application/id/',
	'TEMP_URL' : prefix + '/temp'
};
var configModel = angular.module('clever.management.config', []);
angular.forEach(config, function(value, key) {
	configModel.constant(key, value);
});
