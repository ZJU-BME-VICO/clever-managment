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
		BUSY_UPLOADING : '上传中',

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
		
		// Archetype edit
		ARCHETYPE_EDIT_EDIT : '编辑',
		ARCHETYPE_EDIT_SUBMIT : '提交',
		ARCHETYPE_EDIT_DRAFT : '我的草稿',
		ARCHETYPE_EDIT_PUBLISHED : '公共项',
		ARCHETYPE_EDIT_SUCCEEDED : '操作成功',
		ARCHETYPE_EDIT_FAILED : '操作失败',
		ARCHETYPE_EDIT_EDIT_SUCCEEDED_HINT : '成功编辑原型',
		ARCHETYPE_EDIT_EDIT_FAILED_HINT : '编辑原型失败,错误: {{errorMsg}}',
		ARCHETYPE_EDIT_SUBMIT_SUCCEEDED_HINT : '成功提交原型',
		ARCHETYPE_EDIT_SUBMIT_FAILED_HINT : '原型提交失败,错误: {{errorMsg}}',
		
		// Archetype verify
		ARCHETYPE_VERIFY : '所有待审核项',
		ARCHETYPE_VERIFY_ADL_DIFF : 'ADL对比',
		ARCHETYPE_VERIFY_APPROVE : '通过',
		ARCHETYPE_VERIFY_REJECT : '否决',
		ARCHETYPE_VERIFY_REMOVE : '删除',
		ARCHETYPE_VERIFY_MSG_HINT : '操作提示',
		ARCHETYPE_VERIFY_APPROVE_SUCCEEDED_HINT : '原型通过审核',
		ARCHETYPE_VERIFY_APPROVE_FAILED_HINT : '原型审核失败, 错误: {{errorMsg}}',
		ARCHETYPE_VERIFY_REJECT_HINT : '是否否决原型',	
		ARCHETYPE_VERIFY_REJECT_FAILED_HINT : '否决原型失败, 错误: {{errorMsg}}',
		ARCHETYPE_VERIFY_REMOVE_HINT : '是否否决并删除原型',
		ARCHETYPE_VERIFY_REMOVE_FAILED_HINT : '否决并删除原型失败, 错误: {{errorMsg}}',

		// Storage template upload
		STORAGE_TEMPLATE_UPLOAD_ADD : '添加',
		STORAGE_TEMPLATE_UPLOAD_BTN_BROWSE : '浏览',
		STORAGE_TEMPLATE_UPLOAD_BTN_DELETE : '删除',
		STORAGE_TEMPLATE_UPLOAD_BTN_RETRY : '重试',
		STORAGE_TEMPLATE_UPLOAD_BTN_UPLOAD : '上传',
		STORAGE_TEMPLATE_UPLOAD_BTN_RESET : '重置',
		STORAGE_TEMPLATE_UPLOAD_BTN_VALIDATE : '验证',
		STORAGE_TEMPLATE_UPLOAD_OET_HINT : '请选择OET文件...',
		STORAGE_TEMPLATE_UPLOAD_ARM_HINT : '请选择ARM文件...',
		STORAGE_TEMPLATE_UPLOAD_VALIDATING_HINT : '验证中...',
		STORAGE_TEMPLATE_UPLOAD_OET_ERROR_HINT : '请选择OET文件。',
		STORAGE_TEMPLATE_UPLOAD_ARM_ERROR_HINT : '请选择ARM文件。',
		STORAGE_TEMPLATE_UPLOAD_VALIDATE_ERROR_HINT : '验证失败。',
		STORAGE_TEMPLATE_UPLOAD_VALIDATE_DETAILS_HINT : '详情...',
		STORAGE_TEMPLATE_UPLOAD_SUCCEEDED : '操作成功',
		STORAGE_TEMPLATE_UPLOAD_SUCCEEDED_HINT : '存储模板上传成功。',
		STORAGE_TEMPLATE_UPLOAD_FAILED : '操作失败',
		STORAGE_TEMPLATE_UPLOAD_FAILED_HINT : '存储模板上传失败，错误：{{errorMsg}}',

		// Storage template edit

		// Storage template verify
		STORAGE_TEMPLATE_VERIFY_OET_DIFF : 'OET对比',
		STORAGE_TEMPLATE_VERIFY_APPROVE : '通过',
		STORAGE_TEMPLATE_VERIFY_REJECT : '否决',
		STORAGE_TEMPLATE_VERIFY_REMOVE : '删除',
		STORAGE_TEMPLATE_VERIFY_MSG_HINT : '操作提示',
		STORAGE_TEMPLATE_VERIFY_APPROVE_HINT : '是否通过模板',
		STORAGE_TEMPLATE_VERIFY_APPROVE_SUCCEEDED_HINT : '审核模板通过',
		STORAGE_TEMPLATE_VERIFY_APPROVE_FAILED_HINT : '审核模板失败，错误：{{errorMsg}}',
		STORAGE_TEMPLATE_VERIFY_REJECT_HINT : '是否否决模板',
		STORAGE_TEMPLATE_VERIFY_REJECT_FAILED_HINT : '否决模板失败，错误：{{errorMsg}}',
		STORAGE_TEMPLATE_VERIFY_REMOVE_HINT : '是否否决并删除模板',
		STORAGE_TEMPLATE_VERIFY_REMOVE_FAILED_HINT : '否决并删除模板失败，错误：{{errorMsg}}',

		// Document diff service
		DOCUMENT_DIFF_SERVICE_SIDE_BY_SIDE : '左右对比',
		DOCUMENT_DIFF_SERVICE_INLINE : '行内对比',
		DOCUMENT_DIFF_SERVICE_BTN_OK : '确定',

		// Storage template deploy
		STORAGE_TEMPLATE_DEPLOY : '部署',
		STORAGE_TEMPLATE_DEPLOY_TODO : '未部署',
		STORAGE_TEMPLATE_DEPLOY_DONE : '已部署',
		STORAGE_TEMPLATE_DEPLOY_TODO_LIST : '模板列表',
		STORAGE_TEMPLATE_DEPLOY_RECORD : '部署记录',
		STORAGE_TEMPLATE_DEPLOY_VERSION : '版本',
		STORAGE_TEMPLATE_DEPLOY_FILE_DEPLOYING : '部署中',
		STORAGE_TEMPLATE_DEPLOY_MSG_HINI : '部署提示',
		STORAGE_TEMPLATE_DEPLOY_SUCCEEDED_HINI : '部署成功',
		STORAGE_TEMPLATE_DEPLOY_FIALED_HINI : '部署失败， 错误：{{errorMsg}}',

		// Menu
		MENU_RETURN : '返回上一级',
		MENU_MANAGEMENT : '管理功能',
		MENU_MANAGEMENT_ARCHETYPE : '原型管理',
		MENU_MANAGEMENT_ARCHETYPE_VIEW : '原型查看',
		MENU_MANAGEMENT_ARCHETYPE_UPLOAD : '原型上传',
		MENU_MANAGEMENT_ARCHETYPE_VERIFY : '原型审核',
		MENU_MANAGEMENT_ARCHETYPE_EDIT : '原型编辑',
		MENU_MANAGEMENT_STORAGE : '存储管理',
		MENU_MANAGEMENT_STORAGE_VIEW : '存储模板查看',
		MENU_MANAGEMENT_STORAGE_UPLOAD : '存储模板上传',
		MENU_MANAGEMENT_STORAGE_EDIT : '存储模板编辑',
		MENU_MANAGEMENT_STORAGE_VERIFY : '存储模板审核',
		MENU_MANAGEMENT_STORAGE_DEPLOY : '存储模板部署',
		MENU_MANAGEMENT_APPLICATION : '应用管理',
		MENU_MANAGEMENT_APPLICATION_DESIGN : '设计器',
		MENU_MANAGEMENT_APPLICATION_EDIT : '应用编辑',
		MENU_MANAGEMENT_APPLICATION_VIEW : '应用查看',
		MENU_MANAGEMENT_INTEGRATION : '集成管理',

		//Menu-infomation
		MENU_INFO : '概要信息',
		MENU_MANAGEMENT_INFO : 'CLEVER管理平台，功能模块管理',
		MENU_MANAGEMENT_ARCHETYPE_INFO : 'Archetype是CLEVER™的核心，它基于openEHR规范实现，是一套从临床基本概念出发的信息模型，而且与软件系统开发独立，因而可由临床人员直接管理和维护，具备较高灵活性。',
		MENU_MANAGEMENT_ARCHETYPE_VIEW_INFO : '',
		MENU_MANAGEMENT_ARCHETYPE_UPLOAD_INFO : '',
		MENU_MANAGEMENT_ARCHETYPE_VERIFY_INFO : '',
		MENU_MANAGEMENT_ARCHETYPE_EDIT_INFO : '',
		MENU_MANAGEMENT_STORAGE_INFO : 'DataManager负责CLEVER™平台中的数据管理，所有数据均按Archeype进行分类，临床人员可方便地直接进行数据的查询、增加、修改和删除，所有操作都将安全地映射到具体物理存储。',
		MENU_MANAGEMENT_APPLICATION_INFO : 'CLEVER™提供了一整套标准接口和原型数据访问语言，以及基于Archetype自动生成应用软件模块的方法，可在此基础上快速构建各类数据应用软件，有效促进了数据的开发与利用。',
		MENU_MANAGEMENT_APPLICATION_DESIGN_INFO : '',
		MENU_MANAGEMENT_APPLICATION_VIEW_INFO : '',
		MENU_MANAGEMENT_APPLICATION_EDIT_INFO : '',
		MENU_MANAGEMENT_INTEGRATION_INFO : 'SHINE™为医疗信息集成引擎，它负责从现有各类异构系统中集成数据到CLEVER™平台，SHINE™提供了基于Archetype的语义集成方法，可方便快速地进行集成配置。',

		// Application edit and view
		APPLICATION_EDIT_FIND_HINT : '输入应用名称',
		APPLICATION_EDIT_NAME : '名称',
		APPLICATION_EDIT_DESCRIPTION : '简介',
		APPLICATION_EDIT_URL : 'URL',
		APPLICATION_EDIT_ADD_APPLICATION : '添加应用',
		APPLICATION_EDIT_BTN_UPLOAD : '上传',
		APPLICATION_EDIT_BTN_UPDATE : '更新',
		APPLICATION_EDIT_BTN_DELETE : '删除',
		APPLICATION_EDIT_BTN_BROWSE : '浏览',
		APPLICATION_EDIT_SUCCEEDED : '操作成功',
		APPLICATION_EDIT_FAILED : '操作失败',
		APPLICATION_EDIT_UPLOAD_SUCCEEDED_HINT : '应用上传成功。',
		APPLICATION_EDIT_UPLOAD_FAILED_HINT : '应用上传失败，错误：{{errorMsg}}',
		APPLICATION_EDIT_UPDATE_SUCCEEDED_HINT : '应用更新成功',
		APPLICATION_EDIT_UPDATE_FAILED_HINT : '应用更新失败，错误：{{errorMsg}}',
		APPLICATION_EDIT_DELETE : '删除',
		APPLICATION_EDIT_DELETE_HINT : '确定删除"{{appName}}"应用',
		APPLICATION_VIEW_FIND_HINT : '输入应用名称',
		APPLICATION_VIEW_EDIT : '编辑',

		// Archetype master pane
		ARCHETYPE_MASTER_PANE_INFO : '基本信息',
		ARCHETYPE_MASTER_PANE_LOG : '操作记录',
		ARCHETYPE_MASTER_PANE_VERSION : '版本',
		ARCHETYPE_MASTER_PANE_STATE : '状态',
		ARCHETYPE_MASTER_PANE_OPERATION : '操作',
		ARCHETYPE_MASTER_PANE_OPERATIOR : '操作者',
		ARCHETYPE_MASTER_PANE_OPERATE_TIME : '操作时间',

		// Archetype pane
		ARCHETYPE_PANE_LANGUAGE : '语言',
		ARCHETYPE_PANE_INFO : '基本信息',
		ARCHETYPE_PANE_DOWNLOAD : '下载',
		ARCHETYPE_PANE_COPY : '复制',

		// Template master pane
		TEMPLATE_MASTER_PANE_INFO : '基本信息',
		TEMPLATE_MASTER_PANE_LOG : '操作记录',
		TEMPLATE_MASTER_PANE_VERSION : '版本',
		TEMPLATE_MASTER_PANE_STATE : '状态',
		TEMPLATE_MASTER_PANE_OPERATION : '操作',
		TEMPLATE_MASTER_PANE_OPERATIOR : '操作者',
		TEMPLATE_MASTER_PANE_OPERATE_TIME : '操作时间',

		// Storage template pane
		STORAGE_TEMPLATE_PANE_INFO : '基本信息',
		STORAGE_TEMPLATE_PANE_DOWNLOAD : '下载',
	});
});
