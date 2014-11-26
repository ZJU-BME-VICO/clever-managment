var prefix = '/clever-management-web';
var config = {
	'WEBSITE_DOMAIN' : prefix,
};
var configModel = angular.module('clever.management.config', []);
angular.forEach(config, function(value, key) {
	configModel.constant(key, value);
});
