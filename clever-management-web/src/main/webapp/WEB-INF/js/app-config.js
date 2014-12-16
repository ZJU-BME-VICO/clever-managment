var prefix = '/clever-management-web';
var config = {
	'WEBSITE_DOMAIN' : prefix,
	'AUTHENTICATION_URL' : prefix + '/authentication',
	'ARCHETYPE_VALIDATE_URL' : prefix + '/archetypes/action/validate',
	'ARCHETYPE_UPLOAD_URL' : prefix + '/archetypes/action/upload',
};
var configModel = angular.module('clever.management.config', []);
angular.forEach(config, function(value, key) {
	configModel.constant(key, value);
});
