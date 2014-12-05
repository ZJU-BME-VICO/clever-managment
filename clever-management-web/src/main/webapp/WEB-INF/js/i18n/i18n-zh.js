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
		LOGIN_WRONG_USERNAME_PASSWORD : '用户名或密码错误',
		LOGIN_UNAUTHORIZED : '请先登录再进行操作',
		LOGIN_SESSION_EXPIRED : '会话已过期，请重新登录',
		
		// Archetype upload
		ARCHETYPE_UPLOAD_ADD_FILE : '添加文件',
		ARCHETYPE_UPLOAD_VALIDATE : '验证',
		ARCHETYPE_UPLOAD_RESET : '重置',
		ARCHETYPE_UPLOAD_RETRY : '重试',
		ARCHETYPE_UPLOAD_UPLOAD : '上传',
		ARCHETYPE_UPLOAD_DELETE : '删除',
	});
});
