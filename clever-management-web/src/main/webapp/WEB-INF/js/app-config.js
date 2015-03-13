var prefix = '/clever-management-web';
var config = {
	'WEBSITE_DOMAIN' : prefix,
	'AUTHENTICATION_URL' : prefix + '/authentication',
	'ARCHETYPE_VALIDATE_URL' : prefix + '/archetypes/action/validate',
	'ARCHETYPE_UPLOAD_URL' : prefix + '/archetypes/action/upload',
	'ARCHETYPE_LIST_URL' : prefix + '/archetypes/list',
	'ARCHETYPE_MASTER_BY_ID_URL' : prefix + '/archetypes/master/id/',
	'ARCHETYPE_BY_ID_URL' : prefix + '/archetypes/id/',
	'ARCHETYPE_BY_NAME_URL' : prefix + '/archetypes/name/',
	'STORAGE_TEMPLATE_LIST_URL' :prefix +'/templates/storage/list',
	'STORAGE_TEMPLATE_MASTER_BY_ID_URL' : prefix + '/templates/storage/master/id/',
	'STORAGE_TEMPLATE_BY_NAME_URL' : prefix + '/templates/storage/name/',
	'STORAGE_TEMPLATE_BY_ID_URL' : prefix + '/templates/storage/id/',
	'STORAGE_TEMPLATE_VALIDATE_URL' : prefix + '/templates/storage/action/validate',
	'STORAGE_TEMPLATE_UPLOAD_URL' : prefix + '/templates/storage/action/upload',
	'APPLICATION_LIST_URL' : prefix + '/applications/list',
	'APPLICATION_UPLOAD_URL' : prefix + '/applications/application',
	'APPLICATION_BY_ID_URL' : prefix + '/applications/application/id/',
	'TEMP_URL' : prefix + '/temp',
};
var configModel = angular.module('clever.management.config', []);
angular.forEach(config, function(value, key) {
	configModel.constant(key, value);
});
