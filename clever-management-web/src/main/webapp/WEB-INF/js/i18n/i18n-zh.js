angular.module('clever.management.i18n.zh', ['pascalprecht.translate']).config(function($translateProvider) {
	$translateProvider.translations('zh', {
		TITLE_WEBSITE : 'CLEVER管理平台',
		LANGUAGE : '语言',
		LANGUAGE_ZH : '中文',
		LANGUAGE_EN : '英文',
		
		// Message box
		MESSAGE_BOX_BTN_YES : '是',
		MESSAGE_BOX_BTN_NO : '否',
		MESSAGE_BOX_BTN_OK : '确定',
		MESSAGE_BOX_BTN_CANCEL : '取消',
		
		// Busy service
		BUSY_LOADING : '加载中',

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
		ARCHETYPE_UPLOAD_UPLOADING_HINT : '正在上传，请耐心等待...',
		ARCHETYPE_UPLOAD_VALIDATING_HINT : '正在验证，请耐心等待...',
		ARCHETYPE_UPLOAD_VALIDATION_PAST_HINT : '验证通过，请点击上传按钮开始上传。',
		ARCHETYPE_UPLOAD_VALIDATION_FAILED_HINT : '验证失败，请点击具体信息查看错误内容。删除错误的原型后重新验证或者修改原型后重新上传。',
		ARCHETYPE_UPLOAD_DELETE : '删除',
		ARCHETYPE_UPLOAD_FILE_DETAILS : '详情',
		ARCHETYPE_UPLOAD_FILE_TO_UPLOAD : '待上传',
		ARCHETYPE_UPLOAD_FILE_UPLOADING : '上传中',
		ARCHETYPE_UPLOAD_FILE_VALIDATING : '验证中',
		ARCHETYPE_UPLOAD_FILE_VALID : '有效',
		ARCHETYPE_UPLOAD_FILE_INVALID : '无效',
		ARCHETYPE_UPLOAD_FILE_FAILED : '失败',
		ARCHETYPE_UPLOAD_SUCCEEDED : '操作成功',
		ARCHETYPE_UPLOAD_SUCCEEDED_HINT : '原型上传成功。',
		ARCHETYPE_UPLOAD_FAILED : '操作失败',
		ARCHETYPE_UPLOAD_FAILED_HINT : '原型上传失败，错误：{{errorMsg}}',

	});
});
