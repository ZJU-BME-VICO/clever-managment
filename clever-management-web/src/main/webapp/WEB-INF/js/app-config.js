var prefix = '/clever-management-web';
var config = {
	'WEBSITE_DOMAIN' : prefix,
	'AUTHENTICATION_URL' : prefix + '/authentication',
	'ARCHETYPE_VALIDATE_URL' : prefix + '/archetypes/action/validate',
	'ARCHETYPE_UPLOAD_URL' : prefix + '/archetypes/action/upload',
	'ARCHETYPE_LIST_URL' : prefix + '/archetypes/list',
	'ARCHETYPE_LIST_REFERENCE_URL' : prefix + '/archetypes/list/reference',
	'ARCHETYPE_LIST_EDIT_DRAFT_URL' : prefix + '/archetypes/list/edit/draft',
	'ARCHETYPE_LIST_EDIT_PUBLISHED_URL' : prefix + '/archetypes/list/edit/published',
	'ARCHETYPE_CREATE_BY_URL' : prefix + '/archetypes/action/create',
	'ARCHETYPE_EDIT_BY_ID_URL' : prefix + '/archetypes/action/edit/id/',
	'ARCHETYPE_SUBMIT_BY_ID_URL' : prefix + '/archetypes/action/submit/id/',
	'ARCHETYPE_LIST_VERIFY_URL' : prefix + '/archetypes/list/verify',
	'ARCHETYPE_APPROVE_BY_ID_URL' : prefix + '/archetypes/action/approve/id/',
	'ARCHETYPE_REJECT_BY_ID_URL' : prefix + '/archetypes/action/reject/id/',
	'ARCHETYPE_REMOVE_BY_ID_URL' : prefix + '/archetypes/action/remove/id/',
	'AECHETYPE_FALLBACK_BY_ID_URL' : prefix + '/archetypes/action/fallback/id/',
	'ARCHETYPE_MASTER_BY_ID_URL' : prefix + '/archetypes/master/id/',
	'ARCHETYPE_BY_ID_URL' : prefix + '/archetypes/id/',
	'ARCHETYPE_BY_NAME_URL' : prefix + '/archetypes/name/',
	'ARCHETYPE_BY_VERSION_MASTER_NAME_URL' : prefix + '/archetypes/versionmastername/',
	'STORAGE_TEMPLATE_LIST_URL' : prefix + '/templates/storage/list',
	'STORAGE_TEMPLATE_MASTER_BY_ID_URL' : prefix + '/templates/storage/master/id/',
	'STORAGE_TEMPLATE_BY_NAME_URL' : prefix + '/templates/storage/name/',
	'STORAGE_TEMPLATE_BY_ID_URL' : prefix + '/templates/storage/id/',
	'STORAGE_TEMPLATE_LIST_EDIT_DRAFT_URL' : prefix + '/templates/storage/list/edit/draft',
	'STORAGE_TEMPLATE_LIST_EDIT_PUBLISHED_URL' : prefix + '/templates/storage/list/edit/published',
	'STORAGE_TEMPLATE_CREATE_URL' : prefix + '/templates/storage/action/create',
	'STORAGE_TEMPLATE_SUBMIT_BY_ID_URL' : prefix + '/templates/storage/action/submit/id/',
	'STORAGE_TEMPLATE_FALLBACK_BY_ID_URL' : prefix + '/templates/storage/action/fallback/id/',
	'STORAGE_TEMPLATE_EDIT_BY_ID_URL' : prefix + '/templates/storage/action/edit/id/',
	'STORAGE_TEMPLATE_LIST_VERIFY_URL' : prefix + '/templates/storage/list/verify',
	'STORAGE_TEMPLATE_APPROVE_BY_ID_URL' : prefix + '/templates/storage/action/approve/id/',
	'STORAGE_TEMPLATE_REJECT_BY_ID_URL' : prefix + '/templates/storage/action/reject/id/',
	'STORAGE_TEMPLATE_REMOVE_BY_ID_URL' : prefix + '/templates/storage/action/remove/id/',
	'STORAGE_TEMPLATE_UPGRADE_BY_ID_URL' : prefix + '/templates/storage/action/upgrade/id/',
	'STORAGE_TEMPLATE_LIST_DEPLOY_URL' : prefix + '/templates/storage/list/deploy',
	'STORAGE_TEMPLATE_LIST_DEPLOYED_URL' : prefix + '/templates/storage/list/deployed',
	'STORAGE_TEMPLATE_DEPLOY_URL' : prefix + '/templates/storage/action/deploy',
	'STORAGE_TEMPLATE_VALIDATE_URL' : prefix + '/templates/storage/action/validate',
	'STORAGE_TEMPLATE_UPLOAD_URL' : prefix + '/templates/storage/action/upload',
	'DEPLOY_RECORDS_LIST_URL' : prefix + '/deployRecords/list',
	'APPLICATION_LIST_URL' : prefix + '/applications/list',
	'APPLICATION_UPLOAD_URL' : prefix + '/applications/application',
	'APPLICATION_BY_ID_URL' : prefix + '/applications/application/id/',

	

	'DEVELOPMENT_API_MAINTAIN_OVERALL_URL' : prefix + "/development/api/maintain/overall",
	'DEVELOPMENT_API_REMOVE_BY_VERSIONID_URL' : prefix + '/development/api/maintain/remove/version/id/',
	'DEVELOPMENT_API_REMOVE_BY_MASTER_URL' : prefix + '/development/api/maintain/remove/master/', 
	'DEVELOPMENT_API_MAINTAIN_SAVE_ROOTURL_URL' : prefix + '/development/api/maintain/save/rooturl',
	'DEVELOPMENT_API_MAINTAIN_SAVE_API_URL' : prefix + '/development/api/maintain/save/api',
	'DEVELOPMENT_API_MAINTAIN_SAVE_PARAMS_URL' : prefix + '/development/api/maintain/save/params',
	'DEVELOPMENT_API_MAINTAIN_CLASSMASTER_URL' : prefix + '/development/api/maintain/classmaster/versionid/',
	'DEVELOPMENT_API_MAINTAIN_CLASSMASTER_ADD_URL' : prefix + '/development/api/maintain/classmaster/add',
	'DEVELOPMENT_API_MAINTAIN_ADD_PARAM_URL' : prefix + '/development/api/maintain/add/param/',
	'DEVELOPMENT_API_MAINTAIN_CLASSATTRIBUTE_URL' : prefix + '/development/api/maintain/classattributes',
	'DEVELOPMENT_API_MAINTAIN_ROOTURL_BY_VERSIONMASTER_ID_URL': prefix + '/development/api/maintain/rooturl/versionmaster/id/',
	
	'DEVELOPMENT_API_DISPLAY_MASTER_URL' : prefix + '/development/api/display',
	'DEVELOPMENT_API_DISPLAY_RETURNPARAMS_URL' : prefix + '/development/api/display/returnparam/',
	'DEVELOPMENT_API_DISPLAY_REQUESTPARAMS_URL' : prefix + '/development/api/display/requestparam/',
	'DEVELOPMENT_API_DISPLAY_PARAM_DETAILS_URL' : prefix + '/development/api/display/param/details/',
	'DEVELOPMENT_API_DISPLAY_APIINFOMATION_URL' : prefix + '/development/api/display/apiinfo/id/',
	'DEVELOPMENT_API_DISPLAY_VERSIONMASTER_BY_ID_URL' : prefix + '/development/api/display/versionmaster/id/'
	

};
var configModel = angular.module('clever.management.config', []);
angular.forEach(config, function(value, key) {
	configModel.constant(key, value);
});
