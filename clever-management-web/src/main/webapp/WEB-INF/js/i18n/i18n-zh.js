angular.module('clever.management.i18n.zh', ['pascalprecht.translate']).config(function($translateProvider) {
	$translateProvider.translations('zh', {
		TITLE_WEBSITE : 'CLEVER管理平台',
		LANGUAGE : '语言',
		LANGUAGE_ZH : '中文',
		LANGUAGE_EN : '英文',
		
		// Home
		ARCHETYPE_MANAGEMENT : '原型管理',
		STORAGE_MANAGEMENT : '存储管理',
		APPLICATION_MANAGEMENT : '应用管理',
		INTEGRATION_MANAGEMENT : '集成管理',
		
		// Header
		HEADER_HOME : '首页',
		HEADER_WELCOME : '欢迎您，',
		HEADER_LOGIN : '登录',
		HEADER_LOGOUT : '注销',
		
		// Login page
		LOGIN_TITLE : '请登录',
		LOGIN_USER_NAME : '用户名',
		LOGIN_PASSWORD : '密码',
		LOGIN_REMEMBER_ME : '记住我',
		LOGIN_BUTTON : '登录',
		LOGIN_INVALID : '用户名或密码错误',
		
		// Archetype upload
		ARCHETYPE_UPLOAD_ADD_FILE : '添加文件',
		ARCHETYPE_UPLOAD_VALIDATE : '验证',
	});
});
