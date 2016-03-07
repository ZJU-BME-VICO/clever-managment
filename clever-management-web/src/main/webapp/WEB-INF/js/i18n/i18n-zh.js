angular.module('clever.management.i18n.zh', ['pascalprecht.translate']).config(function($translateProvider) {
    $translateProvider.translations('zh', {
        TITLE_WEBSITE: 'CLEVER管理平台',
        LANGUAGE: '语言',
        LANGUAGE_ZH: '中文',
        LANGUAGE_EN: '英文',

        // Message box
        MESSAGE_BOX_BTN_YES: '是',
        MESSAGE_BOX_BTN_NO: '否',
        MESSAGE_BOX_BTN_OK: '确定',
        MESSAGE_BOX_BTN_CANCEL: '取消',

        // Busy service
        BUSY_LOADING: '加载中',
        BUSY_UPLOADING: '上传中',

        SEARCH_HINT: '请输入关键字',
        OPERATE_PROMPT_HINT: '操作提示',

        // Home
        ARCHETYPE_MANAGEMENT: '原型管理',
        STORAGE_MANAGEMENT: '存储管理',
        APPLICATION_MANAGEMENT: '应用管理',
        INTEGRATION_MANAGEMENT: '集成管理',

        // Header
        HEADER_WELCOME: '欢迎您，',
        HEADER_LOGIN: '登录',
        HEADER_LOGOUT: '注销',

        // Login page
        LOGIN_TITLE: '请登录',
        LOGIN_USER_NAME: '用户名',
        LOGIN_PASSWORD: '密码',
        LOGIN_REMEMBER_ME: '记住我',
        LOGIN_BUTTON: '登录',
        LOGIN_WRONG_USERNAME_PASSWORD: '用户名或密码错误',
        LOGIN_UNAUTHORIZED: '请先登录再进行操作',
        LOGIN_SESSION_EXPIRED: '会话已过期，请重新登录',

        // Archetype upload
        ARCHETYPE_UPLOAD_ADD_FILE: '添加文件',
        ARCHETYPE_UPLOAD_VALIDATE: '验证',
        ARCHETYPE_UPLOAD_RESET: '重置',
        ARCHETYPE_UPLOAD_RETRY: '重试',
        ARCHETYPE_UPLOAD_UPLOAD: '上传',
        ARCHETYPE_UPLOAD_UPLOADING_HINT: '正在上传，请耐心等待...',
        ARCHETYPE_UPLOAD_VALIDATING_HINT: '正在验证，请耐心等待...',
        ARCHETYPE_UPLOAD_VALIDATION_PAST_HINT: '验证通过，请点击上传按钮开始上传。',
        ARCHETYPE_UPLOAD_VALIDATION_FAILED_HINT: '验证失败，请点击具体信息查看错误内容。删除错误的原型后重新验证或者修改原型后重新上传。',
        ARCHETYPE_UPLOAD_DELETE: '删除',
        ARCHETYPE_UPLOAD_FILE_DETAILS: '详情',
        ARCHETYPE_UPLOAD_FILE_TO_UPLOAD: '待上传',
        ARCHETYPE_UPLOAD_FILE_UPLOADING: '上传中',
        ARCHETYPE_UPLOAD_FILE_VALIDATING: '验证中',
        ARCHETYPE_UPLOAD_FILE_VALID: '有效',
        ARCHETYPE_UPLOAD_FILE_INVALID: '无效',
        ARCHETYPE_UPLOAD_FILE_FAILED: '失败',
        ARCHETYPE_UPLOAD_SUCCEEDED: '操作成功',
        ARCHETYPE_UPLOAD_SUCCEEDED_HINT: '原型上传完成，请点击确定查看上传结果',
        ARCHETYPE_UPLOAD_FAILED: '操作失败',
        ARCHETYPE_UPLOAD_FAILED_HINT: '原型上传失败，错误：{{errorMsg}}',
        ARCHETYPE_EDIT_SAVE_FAILED_HINT: '原型保存失败，错误： {{errorMsg}}',

        // Archetype edit
        MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_BATCHPROCESS: '批量提交',
        MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_FALLBACK: '状态回退',
        ARCHETYPE_EDIT_FALLBACK: '状态回退',
        ARCHETYPE_EDIT_BATCHSUBMIT: '批量提交',
        ARCHETYPE_EDIT_CREATE: '创建原型',
        ARCHETYPE_EDIT_SAVE: '保存原型',
        ARCHETYPE_EDIT_DIFF: '对比adl',
        ARCHETYPE_EDIT_NEWVERSION: '新版原型',
        ARCHETYPE_EDIT_SPECIALISE: '特化原型',
        ARCHETYPE_EDIT_EDIT: '编辑',
        ARCHETYPE_EDIT_SUBMIT: '提交原型',
        ARCHETYPE_EDIT_DRAFT: '我的草稿',
        ARCHETYPE_EDIT_PUBLISHED: '公共项',
        ARCHETYPE_EDIT_SUCCEEDED: '操作成功',
        ARCHETYPE_EDIT_FAILED: '操作失败',
        ARCHETYPE_EDIT_EDIT_SUCCEEDED_HINT: '成功编辑原型',
        ARCHETYPE_EDIT_SAVE_SUCCEEDED_HINT: '原型保存成功',
        ARCHETYPE_FALLBACK_SUCCEEDE_HINT: '回退原型状态成功',
        ARCHETYPE_FALLBACK_FAILED_HINT: '回退原型状态失败',
        ARCHETYPE_EDIT_COLLAPSEALL: '收缩',
        ARCHETYPE_EDIT_EXPANDALL : '展开',

        //ARCHETYPE_EDIT_SUBMIT_SUCCEEDED_HINT : '原型提交成功',
        ARCHETYPE_EDIT_EDIT_FAILED_HINT: '编辑原型失败,错误: {{errorMsg}}',
        ARCHETYPE_EDIT_SUBMIT_SUCCEEDED_HINT: '原型提交成功',
        ARCHETYPE_EDIT_SUBMIT_FAILED_HINT: '原型提交失败,错误: {{errorMsg}}',
        ARCHETYPE_NEW_VERSION_INSTRUCTION: '不能编辑已提交或已发布的原型，请通过右键菜单创建新版本原型',
        ARCHETYPE_EDIT_ADD_FAILED_HINT: '编辑原型失败,错误: {{errorMsg}}',
        ARCHETYPE_EDIT_ADD_SUCCEEDED_HINT: '添加原型成功',
        ARCHETYPE_EDIT_TERMDEFINITION_CODE_FILTER : '按code查找' ,
        ARCHETYPE_EDIT_TERMDEFINITION_TEXT_FILTER:  '按Text查找',
        ARCHETYPE_EDIT_DEFINITION_SEARCH : '搜索',
        // Storage template edit
        TEMPLATE_EDIT_FALLBACK: '状态回退',
        TEMPLATE_EDIT_BATCHSUBMIT: '批量提交',
        TEMPLATE_EDIT_CREATE: '创建模板',
        TEMPLATE_EDIT_SAVE: '保存模板',
        TEMPLATE_EDIT_DIFF: '对比oet',
        TEMPLATE_EDIT_SUBMIT: '模板提交',
        TEMPLATE_EDIT_NEWVERSION: '新版模板',
        STORAGE_TEMPLATE_EDIT_SAVE: '保存模板',
        STORAGE_TEMPLATE_EDIT_SUBMIT: '提交模板',
        STORAGE_TEMPLATE_EDIT_DIFF: '对比oet',
        STORAGE_TEMPLATE_EDIT_EXPAND: '全部展开',
        STORAGE_TEMPLATE_SUCCEEDED: '操作成功',
        STORAGE_TEMPLATE_FAILED: '操作失败',
        STORAGE_TEMPLATE_EDIT_SUCCEEDED_HINT: '成功编辑模板。',
        STORAGE_TEMPLATE_EDIT_FAILED_HINT: '编辑模板失败,错误: {{errorMsg}}',
        STORAGE_TEMPLATE_SUBMIT_SUCCEEDED_HINT: '成功提交模板。',
        STORAGE_TEMPLATE_SUBMIT_FAILED_HINT: '提交模板失败,错误: {{errorMsg}}',
        STORAGE_TEMPLATE_NEW_VERSION_INSTRUCTION: '不能编辑已提交或已发布的模板，请通过右键菜单创建新版本模板',
        STORAGE_TEMPLATE_ADD_SUCCEEDED_HINT: '添加模板成功',
        STORAGE_TEMPLATE_ADD_FAILED_HINT: '添加模板失败，错误： {{errorMsg}}',

        STORAGE_TEMPLATE_PANE_TEMPLATE_ID: '模板编号',
        STORAGE_TEMPLATE_PANE_MASTER_ID: '类型编号',
        STORAGE_TEMPLATE_PANE_SPECIALISE_ARCHETYPE: 'Specialise 原型',
        STORAGE_TEMPLATE_PANE_LIFECYCLE_STATE: '生命周期状态',
        STORAGE_TEMPLATE_PANE_EDITOR: '编辑者',

        STORAGE_MASTER_PANE_MASTER_ID: '类型编号',
        STORAGE_MASTER_PANE_HISTORY_VERSION: '历史版本',
        STORAGE_MASTER_PANE_LATEST_TEMPLATE_LIFECYCLE: '最新模板生命周期',
        STORAGE_MASTER_PANE_SPECIALISE_MASTER_ID: 'Specialise 类型编号',
        STORAGE_MASTER_PANE_SPECIALISE_MASTER_LATEST_ARCHETYPE_VERSION: 'Specialise 管理最新原型版本',
        STORAGE_MASTER_PANE_CONCEPT_NAME: '概念名称',
        STORAGE_MASTER_PANE_CONCEPT_DESCRIPTION: '概念描述',
        STORAGE_MASTER_PANE_KEYWORDS: '关键词',
        STORAGE_MASTER_PANE_COPYRIGHT: '版权',
        STORAGE_MASTER_PANE_PURPOSE: '目的',
        STORAGE_MASTER_PANE_USE: '使用',
        STORAGE_MASTER_PANE_MISUSE: '误用',

        // Archetype verify
        ARCHETYPE_VERIFY: '所有待审核项',
        ARCHETYPE_VERIFY_ADL_DIFF: 'ADL对比',
        ARCHETYPE_VERIFY_EDITOR: '编辑者',
        ARCHETYPE_VERIFY_TOTAL: '待审核',
        ARCHETYPE_VERIFY_APPROVE: '通过',
        ARCHETYPE_VERIFY_REJECT: '否决',
        ARCHETYPE_VERIFY_REMOVE: '删除',
        ARCHETYPE_VERIFY_MSG_HINT: '操作提示',
        ARCHETYPE_VERIFY_APPROVE_HINT: '是否通过原型{{archetypeName}}?',
        ARCHETYPE_VERIFY_APPROVE_SUCCEEDED_HINT: '原型通过审核',
        ARCHETYPE_VERIFY_APPROVE_FAILED_HINT: '原型审核失败, 错误: {{errorMsg}}',
        ARCHETYPE_VERIFY_REJECT_HINT: '是否否决原型{{archetypeName}}?',
        ARCHETYPE_VERIFY_REJECT_FAILED_HINT: '否决原型失败, 错误: {{errorMsg}}',
        ARCHETYPE_VERIFY_REMOVE_HINT: '是否否决并删除原型{{archetypeName}}?',
        ARCHETYPE_VERIFY_REMOVE_FAILED_HINT: '否决并删除原型失败, 错误: {{errorMsg}}',
        
        ARCHETYPE_EDIT_SAVEASK_HINT : '原型{{archetypeName}}信息已被修改，是否保存？',
        
        // Storage template upload
        STORAGE_TEMPLATE_UPLOAD_FILE_TO_UPLOAD: '待上传',
        STORAGE_TEMPLATE_UPLOAD_ADD: '添加',
        STORAGE_TEMPLATE_UPLOAD_BTN_BROWSE: '浏览',
        STORAGE_TEMPLATE_UPLOAD_BTN_DELETE: '删除',
        STORAGE_TEMPLATE_UPLOAD_BTN_RETRY: '重试',
        STORAGE_TEMPLATE_UPLOAD_BTN_UPLOAD: '上传',
        STORAGE_TEMPLATE_UPLOAD_BTN_RESET: '重置',
        STORAGE_TEMPLATE_UPLOAD_BTN_VALIDATE: '验证',
        STORAGE_TEMPLATE_UPLOAD_OET_HINT: '请选择OET文件...',
        STORAGE_TEMPLATE_UPLOAD_ARM_HINT: '请选择ARM文件...',
        STORAGE_TEMPLATE_UPLOAD_VALIDATING_HINT: '验证中...',
        STORAGE_TEMPLATE_UPLOAD_OET_ERROR_HINT: '请选择OET文件。',
        STORAGE_TEMPLATE_UPLOAD_ARM_ERROR_HINT: '请选择ARM文件。',
        STORAGE_TEMPLATE_UPLOAD_VALIDATE_ERROR_HINT: '验证失败。',
        STORAGE_TEMPLATE_UPLOAD_VALIDATE_DETAILS_HINT: '详情...',
        STORAGE_TEMPLATE_UPLOAD_SUCCEEDED: '操作成功',
        STORAGE_TEMPLATE_UPLOAD_SUCCEEDED_HINT: '存储模板上传完毕，请点击确定查看结果。',
        STORAGE_TEMPLATE_UPLOAD_FAILED: '操作失败',
        STORAGE_TEMPLATE_UPLOAD_FAILED_HINT: '存储模板上传失败，错误：{{errorMsg}}',

        // Storage template edit



        // Storage template verify
        STORAGE_TEMPLATE_UPLOAD_ADD_OET: '添加OET',
        STORAGE_TEMPLATE_UPLOAD_ADD_ARM: '添加ARM',
        STORAGE_TEMPLATE_VERIFY_OET_DIFF: 'OET对比',
        STORAGE_TEMPLATE_VERIFY_APPROVE: '通过',
        STORAGE_TEMPLATE_VERIFY_TOTAL: '待审核',
        STORAGE_TEMPLATE_VERIFY_EDITOR: '编辑者',
        STORAGE_TEMPLATE_VERIFY_REJECT: '否决',
        STORAGE_TEMPLATE_VERIFY_REMOVE: '删除',
        STORAGE_TEMPLATE_VERIFY_MSG_HINT: '操作提示',
        STORAGE_TEMPLATE_VERIFY_APPROVE_HINT: '是否通过模板{{templateName}}?',
        STORAGE_TEMPLATE_VERIFY_APPROVE_SUCCEEDED_HINT: '审核模板通过',
        STORAGE_TEMPLATE_VERIFY_APPROVE_FAILED_HINT: '审核模板失败，错误：{{errorMsg}}',
        STORAGE_TEMPLATE_VERIFY_REJECT_HINT: '是否否决模板{{templateName}}?',
        STORAGE_TEMPLATE_VERIFY_REJECT_FAILED_HINT: '否决模板失败，错误：{{errorMsg}}',
        STORAGE_TEMPLATE_VERIFY_REMOVE_HINT: '是否否决并删除模板{{templateName}}?',
        STORAGE_TEMPLATE_VERIFY_REMOVE_FAILED_HINT: '否决并删除模板失败，错误：{{errorMsg}}',

        // Document diff service
        DOCUMENT_DIFF_SERVICE_SIDE_BY_SIDE: '左右对比',
        DOCUMENT_DIFF_SERVICE_INLINE: '行内对比',
        DOCUMENT_DIFF_SERVICE_BTN_OK: '确定',

        // Storage template deploy
        STORAGE_TEMPLATE_DEPLOY: '部署',
        STORAGE_TEMPLATE_DEPLOY_TODO: '未部署',
        STORAGE_TEMPLATE_DEPLOY_DONE: '已部署',
        STORAGE_TEMPLATE_DEPLOY_SELECT_ALL: '全选',
        STORAGE_TEMPLATE_DEPLOY_TODO_LIST: '模板列表',
        STORAGE_TEMPLATE_DEPLOY_RECORD: '部署记录',
        STORAGE_TEMPLATE_DEPLOY_VERSION: '版本',
        STORAGE_TEMPLATE_DEPLOY_FILE_DEPLOYING: '部署中',
        STORAGE_TEMPLATE_DEPLOY_MSG_HINI: '部署提示',
        STORAGE_TEMPLATE_DEPLOY_SUCCEEDED_HINI: '部署成功',
        STORAGE_TEMPLATE_DEPLOY_FAILED_HINI: '部署失败， 错误：{{errorMsg}}',
        STORAGE_TEMPLATE_DEPLOY_SUCCEEDED: '成功',
        STORAGE_TEMPLATE_DEPLOY_FAILED: '失败',
        STORAGE_TEMPLATE_DEPLOY_TIME: '部署时间',
        STORAGE_TEMPLATE_DEPLOY_DEPLOYER: '部署者',
        STORAGE_TEMPLATE_DEPLOY_IS_SUCCEEDED: '结果',
        STORAGE_TEMPLATE_DEPLOY_COMMENT: '备注',
        STORAGE_TEMPLATE_DEPLOY_DETAILS: '详细信息',
        STORAGE_TEMPLATE_DEPLOY_ERROR_MSG: '错误信息',



        // Menu
        MENU_RETURN: '返回上一级',
        MENU_ENTER: '进入>>',
        MENU_HOME: '首页',
        MENU_MANAGEMENT: '管理功能',
        MENU_MANAGEMENT_BRIEF: '简介',
        MENU_MANAGEMENT_ARCHETYPE: '原型管理',
        MENU_MANAGEMENT_ARCHETYPE_VIEW: '原型查看',
        MENU_MANAGEMENT_ARCHETYPE_UPLOAD: '原型上传',
        MENU_MANAGEMENT_ARCHETYPE_EDIT: '原型编辑',
        MENU_MANAGEMENT_ARCHETYPE_VERIFY: '原型审核',
        MENU_MANAGEMENT_STORAGE: '存储管理',
        MENU_MANAGEMENT_STORAGE_VIEW: '模板查看',
        MENU_MANAGEMENT_STORAGE_UPLOAD: '模板上传',
        MENU_MANAGEMENT_STORAGE_EDIT: '模板编辑',
        MENU_MANAGEMENT_STORAGE_VERIFY: '模板审核',
        MENU_MANAGEMENT_STORAGE_DEPLOY: '模板部署',
        MENU_MANAGEMENT_APPLICATION: '应用管理',
        MENU_MANAGEMENT_APPLICATION_VIEW: '应用查看',
        MENU_MANAGEMENT_APPLICATION_EDIT: '应用编辑',
        MENU_MANAGEMENT_INTEGRATION: '集成管理',
        MENU_MANAGEMENT_DEVELOPMENT: '开发平台',
        MENU_MANAGEMENT_DEVELOPMENT_DESIGN: '设计器',
        MENU_MANAGEMENT_DEVELOPMENT_API_DISPLAY: 'API显示',
        MENU_MANAGEMENT_DEVELOPMENT_API_EDIT: 'API编辑',
        MENU_MANAGEMENT_DEVELOPMENT_CDR: '数据库服务',
        //MENU_AUTHORITY : '权限管理',
        //AUTHORITY_MANAGEMENT : '权限管理',
        MENU_MANAGEMENT_DEVELOPER: '开发者选项',
        MENU_MANAGEMETN_DEVELOPER_AUTHORITY: '权限管理',

        //MENU_MANAGEMENT_ARCHETYPE_VIEW_INFO : 'Archetype是CLEVER™的核心，它基于openEHR规范实现，是一套从临床基本概念出发的信息模型，而且与软件系统开发独立，因而可由临床人员直接管理和维护，具备较高灵活性。Archetype是CLEVER™的核心，它基于openEHR规范实现，是一套从临床基本概念出发的信息模型，而且与软件系统开发独立，因而可由临床人员直接管理和维护，具备较高灵活性。',//'原型查看简介',

        //Menu-infomation
        MENU_INFO: '概要信息',
        MENU_MANAGEMENT_INFO: 'CLEVER管理平台，功能模块管理',
        MENU_MANAGEMENT_ARCHETYPE_INFO: 'Archetype是CLEVER™的核心，它基于openEHR规范实现，是一套从临床基本概念出发的信息模型，而且与软件系统开发独立，因而可由临床人员直接管理和维护，具备较高灵活性。',
        MENU_MANAGEMENT_ARCHETYPE_VIEW_INFO: '在这里你可以查看数据库中所有的原型，包括所有状态和所有版本。', //'原型查看简介',
        MENU_MANAGEMENT_ARCHETYPE_UPLOAD_INFO: '在这里你可以上传原型文件到数据库中，原型文件应为adl文件，上传的原型将以草稿状态保存在数据库中。', //'原型上传简介',
        MENU_MANAGEMENT_ARCHETYPE_VERIFY_INFO: '在这里你可以对提交的原型进行审核，通过原型 ：原型状态转变为已发布状态；否决原型 ： 原型状态还原到草稿状态； 删除原型 ：将原型删除。', //'原型审核简介',
        MENU_MANAGEMENT_ARCHETYPE_EDIT_INFO: '在这里你可以创建原型，编辑原型。编辑原型主要包括： 原型基本信息的编辑，原型定义部分节点的增删改，ontology部分编辑', //'原型编辑简介',
        MENU_MANAGEMENT_STORAGE_INFO: 'DataManager负责CLEVER™平台中的数据管理，所有数据均按Archeype进行分类，临床人员可方便地直接进行数据的查询、增加、修改和删除，所有操作都将安全地映射到具体物理存储。',
        MENU_MANAGEMENT_STORAGE_VIEW_INFO: '在这里你可以查看数据库中的模板，包括所有的状态以及所有的版本',
        MENU_MANAGEMENT_STORAGE_UPLOAD_INFO: '在这里你可以上传模板到数据库中，这里模板应包括oet文件和arm文件',
        MENU_MANAGEMENT_STORAGE_EDIT_INFO: '在这里你可以为特定的原型创建模板，编辑各个节点的occurrences属性，以及进行slot操作',
        MENU_MANAGEMENT_STORAGE_VERIFY_INFO: '在这里你可以对提交的模板进行审核， 通过模板： 可以将提交的模板状态变为published用以部署， 否决模板： 可以将提交的模板状态变为draft，以便进一步的编辑， 删除模板： 直接将数据库中的模板删除',
        MENU_MANAGEMENT_STORAGE_DEPLOY_INFO: '在这里你可以将published状态的模板部署到数据库中，部署操作会根据据模板生成数据库表',
        MENU_MANAGEMENT_APPLICATION_INFO: 'CLEVER™提供了一整套标准接口和原型数据访问语言，以及基于Archetype自动生成应用软件模块的方法，可在此基础上快速构建各类数据应用软件，有效促进了数据的开发与利用。',
        MENU_MANAGEMENT_APPLICATION_VIEW_INFO: '在这里你可以查看平所有的应用',
        MENU_MANAGEMENT_APPLICATION_EDIT_INFO: '在这里你可以对应用的名称，介绍，url，以及示例图片进行修改',
        MENU_MANAGEMENT_INTEGRATION_INFO: 'SHINE™为医疗信息集成引擎，它负责从现有各类异构系统中集成数据到CLEVER™平台，SHINE™提供了基于Archetype的语义集成方法，可方便快速地进行集成配置。',
        MENU_MANAGEMENT_DEVELOPMENT_DESIGN_INFO: '设计器简介',
        MENU_MANAGEMENT_DEVELOPMENT_INFO: 'CLEVER™可根据临床实际需求，以原型和模板为媒介，开发或服务于临床数据应用。主要包括对外提供数据服务的API的发布和面向数据应用开发的设计器。',
        MENU_MANAGEMENT_DEVELOPMENT_API_INFO: '在这里你可以查看clever平台对外提供的数据服务接口信息，包括接口的url，请求方式，数据交互格式，参数信息等信息。',
        MENU_MANAGEMENT_DEVELOPMENT_CDR_INFO: '数据库服务简介',

        // Application edit and view
        APPLICATION_EDIT_FIND_HINT: '输入应用名称',
        APPLICATION_EDIT_NAME: '名称',
        APPLICATION_EDIT_DESCRIPTION: '简介',
        APPLICATION_EDIT_URL: 'URL',
        APPLICATION_EDIT_ADD_APPLICATION: '添加应用',
        APPLICATION_EDIT_BTN_UPLOAD: '上传',
        APPLICATION_EDIT_BTN_UPDATE: '更新',
        APPLICATION_EDIT_BTN_DELETE: '删除',
        APPLICATION_EDIT_BTN_BROWSE: '浏览',
        APPLICATION_EDIT_SUCCEEDED: '操作成功',
        APPLICATION_EDIT_FAILED: '操作失败',
        APPLICATION_EDIT_UPLOAD_SUCCEEDED_HINT: '应用上传成功。',
        APPLICATION_EDIT_UPLOAD_FAILED_HINT: '应用上传失败，错误：{{errorMsg}}',
        APPLICATION_EDIT_UPDATE_SUCCEEDED_HINT: '应用更新成功',
        APPLICATION_EDIT_UPDATE_FAILED_HINT: '应用更新失败，错误：{{errorMsg}}',
        APPLICATION_EDIT_DELETE: '删除',
        APPLICATION_EDIT_DELETE_HINT: '确定删除"{{appName}}"应用',
        APPLICATION_VIEW_FIND_HINT: '输入应用名称',
        APPLICATION_VIEW_EDIT: '编辑',

        // Archetype master pane
        ARCHETYPE_MASTER_PANE_INFO: '基本信息',
        ARCHETYPE_MASTER_PANE_LOG: '操作记录',
        ARCHETYPE_MASTER_PANE_VERSION: '版本',
        ARCHETYPE_MASTER_PANE_STATE: '状态',
        ARCHETYPE_MASTER_PANE_OPERATION: '操作',
        ARCHETYPE_MASTER_PANE_OPERATIOR: '操作者',
        ARCHETYPE_MASTER_PANE_OPERATE_TIME: '操作时间',

        ARCHETYPE_MASTER_PANE_MASTER_ID: '类型编号',
        ARCHETYPE_MASTER_PANE_HISTORY_VERSION: '历史版本',
        ARCHETYPE_MASTER_PANE_HISTORY_REVISION: '历史修正',
        ARCHETYPE_MASTER_PANE_LATEST_ARCHETYPE_LIFECYCLE: '最新原型生命周期',
        ARCHETYPE_MASTER_PANE_SPECIALISE_MASTER_ID: 'Specialise master identifiers',
        ARCHETYPE_MASTER_PANE_SPECIALISE_MASTER_LATEST_ARCHETYPE_VERSION: 'Specialise mastr latest archetype version',
        ARCHETYPE_MASTER_PANE_CONCEPT_NAME: '概念名称',
        ARCHETYPE_MASTER_PANE_CONCEPT_DESCRIPTION: '概念描述',
        ARCHETYPE_MASTER_PANE_KEYWORDS: '关键词',
        ARCHETYPE_MASTER_PANE_COPYRIGHT: '版权',
        ARCHETYPE_MASTER_PANE_PURPOSE: '目的',
        ARCHETYPE_MASTER_PANE_USE: '使用',
        ARCHETYPE_MASTER_PANE_MISUSE: '误用',

        // Archetype pane
        ARCHETYPE_PANE_LANGUAGE: '语言',
        ARCHETYPE_PANE_INFO: '基本信息',
        ARCHETYPE_PANE_DOWNLOAD: '下载',
        ARCHETYPE_PANE_COPY: '复制',
        ARCHETYPE_PANE_ARCHETYPE_ID: '原型编号',
        ARCHETYPE_PANE_MASTER_ID: '类型编号',
        ARCHETYPE_PANE_SPECIALISE_ARCHETYPE: 'Specialise 原型',
        ARCHETYPE_PANE_LIFECYCLE_STATE: '生命周期状态',
        ARCHETYPE_PANE_EDITOR: '编辑者',
        ARCHETYPE_PANE_HEADER: '标题头',
        ARCHETYPE_PANE_DEFINITION: '定义',
        ARCHETYPE_PANE_TERMINOLOGY: '术语',
        ARCHETYPE_PANE_XML: 'XML',
        ARCHETYPE_PANE_ADL: 'ADL',

        // Template master pane
        TEMPLATE_MASTER_PANE_INFO: '基本信息',
        TEMPLATE_MASTER_PANE_LOG: '操作记录',
        TEMPLATE_MASTER_PANE_VERSION: '版本',
        TEMPLATE_MASTER_PANE_STATE: '状态',
        TEMPLATE_MASTER_PANE_OPERATION: '操作',
        TEMPLATE_MASTER_PANE_OPERATIOR: '操作者',
        TEMPLATE_MASTER_PANE_OPERATE_TIME: '操作时间',

        // Storage template pane
        STORAGE_TEMPLATE_PANE_INFO: '基本信息',
        STORAGE_TEMPLATE_PANE_DOWNLOAD: '下载',
        STORAGE_TEMPLATE_PANE_OET: 'OET',
        STORAGE_TEMPLATE_PANE_ARM: 'ARM',

        //archetype editor pane
        //      ARCHETYPE_PANE_CREATE: '创建',
        //      ARCHETYPE_PANE_SAVE: '保存',
        //      ARCHETYPE_PANE_SUBMIT: '提交',
        //      ARCHETYPE_PANE_DIFF: '对比',

        //verify pane
        SUBMIT_TIME: '提交时间',
        EDITOR: '编辑者',
        ARCHETYPE_TYPE: '原型类型',
        TEMPLATE_TYPE: '模板类型',
        CONCEPT_NAME: '概念名称',

        //header pane
        BASE_INFORMATION: '基本信息',
        AUTHORSHIP: '作者信息',
        OTHER_DETAILS: '其他信息',

        //terminology pane
        RERMINOLOGY_PANE_TERM: '术语',
        RERMINOLOGY_PANE_CODE: '代码',
        RERMINOLOGY_PANE_TEXT: '文本',
        RERMINOLOGY_PANE_DESCRIPTION: '描述',
        RERMINOLOGY_PANE_CONSTRAINT: '约束',

        //control box
        CONTROL_BOX_WIDGET: '控件',
        CONTROL_BOX_BUTTON: '按钮',
        CONTROL_BOX_LABEL: '标签',

        //links-pane
        LINKS_PANE_MEANING: '含义',
        LINKS_PANE_TARGET: '目标',

        //participation pane
        PARTICIPATION_PANE_MODE: '模式',
        PARTICIPATION_PANE_FUNCTION: '功能',
        PARTICIPATION_PANE_TIME: '时间',
        PARTICIPATION_PANE_PERFORMER: '执行者',
        PARTICIPATION_PANE_ATTRIBUTES: '属性',

        //management archetype
        MANAGEMENT_ARCHETYPE_EDIT_HEADER: '介绍',
        MANAGEMENT_ARCHETYPE_EDIT_DEFINITION: '定义',
        MANAGEMENT_ARCHETYPE_EDIT_ONTOLOGY: '本体',
        MANAGEMENT_ARCHETYPE_EDIT_DISPLAY: '显示',
        MANAGEMENT_ARCHETYPE_EDIT_ADL: 'ADL',
        MANAGEMENT_ARCHETYPE_EDIT_XML: 'XML',
        MANAGEMENT_ARCHETYPE_EDIT_ORGNIZATION: '组织',
        MANAGEMENT_ARCHETYPE_EDIT_REFERENCE_MODEL: '参考模式',
        MANAGEMENT_ARCHETYPE_EDIT_ENTITY_TYPE: '实体类型',
        MANAGEMENT_ARCHETYPE_EDIT_CONCEPT: '概念',
        MANAGEMENT_ARCHETYPE_EDIT_NOT_EDITABLE: '[不可编辑]',

        //management.archetype.edit.html
        MANAGEMENT_ARCHETYPE_EDIT_CREATE_YOUR_OWN_ARCHETYPE: '创建你自己的原型',
        MANAGEMENT_ARCHETYPE_EDIT_ORGNIZATIO: '组织',
        MANAGEMENT_ARCHETYPE_EDIT_REFERENCE_MODEL: '参考模式',
        MANAGEMENT_ARCHETYPE_EDIT_ENTITY_TYP: '实体类型',
        MANAGEMENT_ARCHETYPE_EDIT_CONCEP: '概念',
        MANAGEMENT_ARCHETYPE_EDIT_CREATE: '创建',
        MANAGEMENT_ARCHETYPE_EDIT_SPECIALISE_THIS_ARCHETYPE: '专门化原型',
        MANAGEMENT_ARCHETYPE_EDIT_ENTER_A_NEW_CONCEP: '输入新概念',
        MANAGEMENT_ARCHETYPE_EDIT_DOWN: '向下',
        MANAGEMENT_ARCHETYPE_EDIT_CANCEL: '取消',
        MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_CREATE_ARCHETYPE: '创建原型',
        MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_SAVE_ARCHETYPE: '保存原型',
        MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_SUBMIT_ARCHETYPE: '提交原型',
        MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_CONTRAST_ADL: '对比 adl',
        MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_NEW_VERSION: '新版本',
        MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_SPECIALISE_THIS_ARCHETYPE: 'specialise 原型',
        MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_EXPAND: '展开',
        MANAGEMENT_ARCHETYPE_EDIT_TOOTIP_COLLAPSE: '合并',




        //management.development.cdr.html
        MANAGEMENT_DEVELOPMENT_CDR_AQL_QUERY: 'AQL Query',
        MANAGEMENT_DEVELOPMENT_CDR_AQL: 'AQL',
        MANAGEMENT_DEVELOPMENT_CDR_FROM: 'from',
        MANAGEMENT_DEVELOPMENT_CDR_SELECT: 'select',
        MANAGEMENT_DEVELOPMENT_CDR_WHERE: 'where',
        MANAGEMENT_DEVELOPMENT_CDR_CUSTOM: '习惯',
        MANAGEMENT_DEVELOPMENT_CDR_AND: 'and',
        MANAGEMENT_DEVELOPMENT_CDR_LAST_QUERY_TIME: '最近查询时间',
        MANAGEMENT_DEVELOPMENT_CDR_RESULT: '结果',
        MANAGEMENT_DEVELOPMENT_CDR_TOTAL: '总计',
        MANAGEMENT_DEVELOPMENT_CDR_COLUMN_NODE_MAPPING_BROWSE: '列表-节点 映射浏览',
        MANAGEMENT_DEVELOPMENT_CDR_NODE_COLUMN_MAPPING_BROWSE: '节点-列表 映射浏览',
        MANAGEMENT_DEVELOPMENT_CDR_QUERY: '查询',
        MANAGEMENT_DEVELOPMENT_CDR_TABLE: '列表',
        MANAGEMENT_DEVELOPMENT_CDR_NODE: '节点',
        MANAGEMENT_DEVELOPMENT_CDR_COLUMN: '列',
        MANAGEMENT_DEVELOPMENT_CDR_TEMPLATE: '模板',

        //management.development.designer.html
        MANAGEMENT_DEVELOPMENT_DESIGNER_NEW: '新建',
        MANAGEMENT_DEVELOPMENT_DESIGNER_SAVE: '保存',
        MANAGEMENT_DEVELOPMENT_DESIGNER_EXPANDALL: '展开全部',
        MANAGEMENT_DEVELOPMENT_DESIGNER_COLLAPSEALL: '关闭全部',
        MANAGEMENT_DEVELOPMENT_DESIGNER_GOLD: 'Gold',

        //management.storage.edit.html
        MANAGEMENT_STORAGE_EDIT_EXPAND_ALL: '展开全部',
        MANAGEMENT_STORAGE_EDIT_NODE_PATH: '节点路径',
        MANAGEMENT_STORAGE_EDIT_HEADING_TREE: '树形',
        MANAGEMENT_STORAGE_EDIT_HEADING_OET: 'OET',
        MANAGEMENT_STORAGE_EDIT_HEADING_ARM: 'ARM',
        MANAGEMENT_STORAGE_EDIT_TOOLTIP_CREATE_TEMPLATE: '创建模板',
        MANAGEMENT_STORAGE_EDIT_TOOLTIP_SAVE_TEMPLATE: '保存模板',
        MANAGEMENT_STORAGE_EDIT_TOOLTIP_SUBMIT_TEMPLATE: '提交模板',
        MANAGEMENT_STORAGE_EDIT_TOOLTIP_CONSTRAST_OET_CONTENT: '对比 oet 内容',
        MANAGEMENT_STORAGE_EDIT_TOOLTIP_NEW_VERSION: '新版本',
        MANAGEMENT_STORAGE_EDIT_TOOLTIP_EXPAND: '展开',
        MANAGEMENT_STORAGE_EDIT_TOOLTIP_COLLAPSE: '闭合',
        DEVELOPMENT_MANAGEMENT: '开发平台',
        MENU_AUTHORITY_MANAGER: '权限管理',



        //management.storage.upload.html
        MANAGEMENT_STORAGE_UPLOAD_TEMPLATE_ID: '模板编号',
        MANAGEMENT_STORAGE_UPLOAD_OET: 'OET',
        MANAGEMENT_STORAGE_UPLOAD_ARM: 'ARM',

        //home.html
        HOME_CLINICAL_EASY_VARIETY_EXTENSIBLE_REPOSITORY: '临床简易多样化可扩展仓库',


        //participation-pane.html
        PARTICIPATION_PANE_EXTERNALREF: '外部参考',
        PARTICIPATION_PANE_ID: '编号',
        PARTICIPATION_PANE_NAMESPACE: '命名空间',
        PARTICIPATION_PANE_TYPE: '类型',
        PARTICIPATION_PANE_NAME: '名称',
        PARTICIPATION_PANE_STRING: '字符串',
        PARTICIPATION_PANE_IDENTIFIERS: '标识符',
        PARTICIPATION_PANE_EDIT_IDENTIFIER_HERE: '在此编辑标识符',
        PARTICIPATION_PANE_ATTRIBUTES: '属性',
        PARTICIPATION_PANE_RELATIONSHIP: '关系',
        PARTICIPATION_PANE_EDIT_MODE_CONTRIBUTE_HERE: 'Edit mode contribute here',
        PARTICIPATION_PANE_EDIT_FUNCTION_CONTRIBUTE_HERE: 'Edit function contribute here',

        //subject-pane.html
        SUBJECT_PANE_ATTRIBUTES: '属性',
        SUBJECT_PANE_EXTERNALREF: '外部参考',
        SUBJECT_PANE_ID: '编号',
        SUBJECT_PANE_NAMESPACE: '命名空间',
        SUBJECT_PANE_TYPE: '类型',
        SUBJECT_PANE_NAME: '名称',
        SUBJECT_PANE_STRING: '字符串',
        SUBJECT_PANE_IDENTIFIERS: '标识符',
        SUBJECT_PANE_EDIT_IDENTIFIER_HERE: '在此编辑标识符',
        SUBJECT_PANE_RELATIONSHIP: '关系',

        //edit-definition-pane.html
        EDIT_DEFINITION_PANE_EXPAND_ALL: '展开',
        EDIT_DEFINITION_PANE_COLLAPSE_ALL: '合闭',
        EDIT_DEFINITION_PANE_SUBJECT: '主题',
        EDIT_DEFINITION_PANE_PARTICIPATION: '参与',
        EDIT_DEFINITION_PANE_LINKS: '链接',
        EDIT_DEFINITION_PANE_CONSTRAINT: '约束',
        EDIT_DEFINITION_PANE_NODE_INFO: '节点',
        EDIT_DEFINITION_PANE_OCCURRENCES: '出现次数',
        EDIT_DEFINITION_PANE_MIN: '最小值',
        EDIT_DEFINITION_PANE_MAX: '最大值',
        EDIT_DEFINITION_PANE_UNBOUNDED: '无限制的',
        EDIT_DEFINITION_PANE_EXISTENCE: '存在必要？',

        EDIT_DEFINITION_PANE_CARDINALITY: '基数',
        EDIT_DEFINITION_PANE_UNIQUE: '唯一的',
        EDIT_DEFINITION_PANE_ORDERED: '有序的',
        EDIT_DEFINITION_PANE_ONTOLOGY: '本体',
        EDIT_DEFINITION_PANE_LANGUAGE: '语言',
        EDIT_DEFINITION_PANE_TEXT: '文本',
        EDIT_DEFINITION_PANE_DESCRIPTION: '描述',
        EDIT_DEFINITION_PANE_NODE_TERM_BIND: '节点术语绑定',
        EDIT_DEFINITION_PANE_TERMINOLOGY_SET: '术语设定',
        EDIT_DEFINITION_PANE_AVAILABLE: '可用',
        EDIT_DEFINITION_PANE_PATH_TEXT: '路径[文本]',
        EDIT_DEFINITION_PANE_PATH_ID: '路径[编号]',
        EDIT_DEFINITION_PANE_BIND_CODE: '绑定代码',
        EDIT_DEFINITION_PANE_RELEASE: '发布',
        EDIT_DEFINITION_PANE_ADD_TERM_BIND_TO_THIS_NODE: '为节点添加属于绑定',
        EDIT_DEFINITION_PANE_NODE_VALUE: '节点值',
        EDIT_DEFINITION_PANE_CODETEXT1: '代码文本',
        EDIT_DEFINITION_PANE_DESCRIPTION: '描述',
        EDIT_DEFINITION_PANE_ASSUMED_VALUE: '假设值',
        EDIT_DEFINITION_PANE_PROPERTY: '性能',
        EDIT_DEFINITION_PANE_UNIT: '单元',
        EDIT_DEFINITION_PANE_ORIGINAL: '原件',
        EDIT_DEFINITION_PANE_SELECTED: '选定',
        EDIT_DEFINITION_PANE_PRECISION: '精度',
        EDIT_DEFINITION_PANE_SET_MIN: '设置最小值',
        EDIT_DEFINITION_PANE_SET_MAX: '设置 最大值',
        EDIT_DEFINITION_PANE_SET_ASS: '设置 Ass.',
        EDIT_DEFINITION_PANE_SELECT_PARTTERN: '选择模式',
        EDIT_DEFINITION_PANE_ALLOW_ALL: '全部允许',
        EDIT_DEFINITION_PANE_DATE_TIME: '日期-时间',
        EDIT_DEFINITION_PANE_DATE_AND_PARTIAL_TIME: '日期 and partial time',
        EDIT_DEFINITION_PANE_DATE: '日期',
        EDIT_DEFINITION_PANE_FULL_DATE: '全部 日期',
        EDIT_DEFINITION_PANE_PARTIAL_DATE: '部分 日期',
        EDIT_DEFINITION_PANE_WITH_MONTH: 'With month',
        EDIT_DEFINITION_PANE_TIME: '时间',
        EDIT_DEFINITION_PANE_FULL_TIME: '专职',
        EDIT_DEFINITION_PANE_PARTIAL_TIME: '兼职',
        EDIT_DEFINITION_PANE_WITH_MINUTES: 'With minutes',
        EDIT_DEFINITION_PANE_YOUR_DATE_TIME_PARTTERN: '你的 日期-时间 模式',
        EDIT_DEFINITION_PANE_CODE: '代码',
        EDIT_DEFINITION_PANE_ALLOW_VALUE: '允许 值',
        EDIT_DEFINITION_PANE_TRUE: '是',
        EDIT_DEFINITION_PANE_FALSE: '否',


        //edit-header-pane.html
        EDIT_HEADER_PANE_ARCHETYPEID: '原型编号',
        EDIT_HEADER_PANE_CONCEP: '概念',
        EDIT_HEADER_PANE_DESCRIPTIO: '描述',
        EDIT_HEADER_PANE_COMMEN: '意见',
        EDIT_HEADER_PANE_ORIGINAL_AUTHOR: '原作者',
        EDIT_HEADER_PANE_NAME: '名称',
        EDIT_HEADER_PANE_EMAIL: '电子邮件',
        EDIT_HEADER_PANE_ORGNIZATION: '组织',
        EDIT_HEADER_PANE_DATE: '日期',
        EDIT_HEADER_PANE_OTHER_CONTRIBUTORS: '参与者',
        EDIT_HEADER_PANE_PURPOSE: '目的',
        EDIT_HEADER_PANE_USE: '使用',
        EDIT_HEADER_PANE_MISUSE: '误用',
        EDIT_HEADER_PANE_COPYRIGHT: '版权',
        EDIT_HEADER_PANE_HEADING_BASE: '基本信息',
        EDIT_HEADER_PANE_HEADING_AUTHOR: '作者',
        EDIT_HEADER_PANE_HEADING_DETAILS: '细节',
        EDIT_HEADER_PANE_KEY_WORDS: '关键词',
        EDIT_HEADER_PANE_HEADING_TRANSLATE: '翻译',



        //edit-ontology-pane.html
        EDIT_ONTOLOGY_PANE_ITEM_CONTENT: '选项内容',

        //definition-pane.html
        DEFINITION_PANE_VIEW: '视图',
        DEFINITION_PANE_TABLE: '表格',
        DEFINITION_PANE_TREE: '树',
        DEFINITION_PANE_EXPAND_ALL: '展开全部',
        DEFINITION_PANE_TERMINOLOGY: '术语',
        DEFINITION_PANE_CODE: '代码',
        DEFINITION_PANE_TEXT: '文本',
        DEFINITION_PANE_DESCRIPTION: '描述',
        DEFINITION_PANE_OCCURRENCE: '发生',
        DEFINITION_PANE_MIN: '最小值',
        DEFINITION_PANE_MAX: '最大值',
        DEFINITION_PANE_INCLUDED: '包括的',
        DEFINITION_PANE_UNBOUNDED: '无限制的',
        DEFINITION_PANE_EXISTENCE: '存在',
        DEFINITION_PANE_COUNT: '计数',
        DEFINITION_PANE_QUANTITY: '数量',
        DEFINITION_PANE_DATE_TIME: '日期/时间',
        DEFINITION_PANE_BOOLEAN: '布尔',
        DEFINITION_PANE_OPTIONAL: '可选',
        DEFINITION_PANE_MANDATORY: '必选',

        //template-create-service.html
        TEMPLATE_CREATE_SERVICE_CONCEPT: '概念',
        TEMPLATE_CREATE_SERVICE_ARCHETYPE_ID: ' 原型编号',
        TEMPLATE_CREATE_SERVICE_PURPOSE: '目的',
        TEMPLATE_CREATE_SERVICE_CREATE: '创建',
        TEMPLATE_CREATE_SERVICE_CANCEL: '取消',

        BASE_INFORMATION: '基本信息',
        AUTHORSHIP: '作者信息',
        OTHER_DETAILS: '其他信息',

        //api display
        DEVELOPEMENT_API_VIEW_URL: '接口地址',
        DEVELOPEMENT_API_VIEW_MEDIA_TYPE: '支持格式',
        DEVELOPEMENT_API_VIEW_REQUEST_METHOD: '请求方式',
        DEVELOPEMENT_API_VIEW_REQUEST_PARAMS: '请求参数',
        DEVELOPEMENT_API_VIEW_RETURN_PARAMS: '返回参数',
        DEVELOPMENT_API_VIEW_NAME: '名称',
        DEVELOPMENT_API_VIEW_TYPE: '类型',
        DEVELOPMENT_API_VIEW_REQUIRED: '必填',
        DEVELOPMENT_API_VIEW_DESCRIPTIOIN: '说明',
        DEVELOPMENT_API_VIEW_RETURN_CODE: '返回代码',
        DEVELOPMENT_API_VIEW_API_INFORMATION: '接口信息',
        DEVELOPMENT_API_VIEW_TOOLTIP_COPY: '复制',

        DEVELOPMENT_API_EDIT_NAME: '名称',
        DEVELOPMENT_API_EDIT_TYPE: '类型',
        DEVELOPMENT_API_EDIT_REQUIRED: '必填',
        DEVELOPMENT_API_EDIT_DESCRIPTIOIN: '说明',

        DEVELOPEMENT_API_EDIT_REQUEST_PARAMS: '请求参数',
        DEVELOPEMENT_API_EDIT_RETURN_PARAMS: '返回参数',
        DEVELOPMENT_API_EDIT_BASE_INFO: '基本信息',
        DEVELOPMENT_API_EDIT_ROOT_URL_INFO: '类型名称',
        DEVELOPMENT_API_EDIT_PARAM_INFO: '参数信息',
        DEVELOPMENT_API_EDIT_SUBMIT_CHANGES: '提交更改',
        DEVELOPMENT_API_EDIT_ENGLISH: '英文',
        DEVELOPMENT_API_EDIT_CHINESE: '中文',
        DEVELOPMENT_API_EDIT_ITEM: '项',
        DEVELOPMENT_API_MAINTAIN_PARAMCLASS: '自定义类',
        DEVELOPMENT_API_MAINTAIN_APIINFO: '接口信息',
        DEVELOPMENT_API_MAINTAIN_CATEGORY: '接口类型',
        DEVELOPMENT_API_MAINTAIN_OVERALL: '整体维护',
        API_MAINTAIN_SUCCEEDED: '操作成功',
        API_MAINTAIN_SUCCEEDED_HINT: '接口信息维护成功',
        API_MAINTAIN_FAILED: '操作失败',
        API_MAINTAIN_FAILED_HINT: '接口信息维护失败, 错误：{{errorMsg}}',
        API_MAINTAIN_API_VERSION: '版本',
        API_MAINTAIN_API_CATEGORY: '类型名称',
        DEVELOPMENT_API_MAINTAIN_CLASS_MASTER_ADD: '添加类型',
        DEVELOPMENT_API_MAINTAIN_CLASS_ATTRIBUTE_ADD: '添加属性',
        DEVELOPMENT_API_MAINTAIN_SUBMIT: '提交',
        DEVELOPMENT_API_MAINTAIN_CLASS_ADD: '类添加',
        DEVELOPMENT_API_MAINTAIN_VERSION_AND_CATEGORY_MAINTAIN: '类别与版本',

        DEVELOPMENT_API_EDIT_NO_API_INFO_HINT: '请在左侧接口列表中选择接口！',
        DEVELOPMENT_API_EDIT_DESCRIPTION_PLACEHOLDER_EN: '英文介绍',
        DEVELOPMENT_API_EDIT_DESCRIPTION_PLACEHOLDER_ZH: '中文介绍',
        DEVELOPMENT_API_EDIT_ADD_UPDATE: '添加/更新',
        DEVELOPMENT_API_EDIT_REMOVE: '删除',

        //authority
        AUTHORITY_MANAGEMENT_ADD_USER: '添加成员',
        AUTHORITY_MANAGEMENT_ADD_ROLE: '添加角色',
        AUTHORITY_USER_REMOVE_HINT: '是否要删除用户: {{userName}} ?',
        AUTHORITY_USER_NOTENABLED: '禁用',
        AUTHORITY_USER_ENABLED: '启用',
        AUTHORITY_USER_AUTHORITY_VIEW: '查看',
        AUTHORITY_ADMIN_NOT_FOUND_HINT: '未找到ADMIN角色',
        USER2ROLE: '用户角色映射',
        ROLE2AUTHORITY: '角色权限映射',
        AUTHORITY_ROLE_AUTHORITY_MANAGE_SAVE: '保存',
        AUTHORITY_ROLE_AUTHORITY_MANAGE_CANCEL: '取消',
        AUTHORITY_ROLE_AUTHORITY_DISTRIBUTION: '权限分配',
        AUTHORITY_ROLE_REMOVE_SUCCEEDED_HINT: '删除角色成功',
        AUTHORITY_ROLE_REMOVE_HINT: '是否要删除角色 ：{{roleName}}',
        AUTHORITY_ROLE_REMOVE_ERROR_HINT: '删除角色失败 ：{{errorMsg}}',
        AUTHORITY_ROLE_ADD_SUCCEEDED_HINT: '添加角色成功',
        AUTHORITY_ROLE_ADD_FAILED_HINT: '添加角色失败',
        ROLE_ARCHETYPE_VIEW: '查看原型', //
        ROLE_ARCHETYPE_UPLOAD: '上传原型', //
        ROLE_ARCHETYPE_EDIT: '编辑原型', //
        ROLE_ARCHETYPE_CREATE: '创建原型', //
        ROLE_ARCHETYPE_SAVE: '保存原型', //
        ROLE_ARCHETYPE_NEW_REVISION: '升迁原型小版本', //
        ROLE_ARCHETYPE_NEW_VERSION: '升迁原型大版本',
        ROLE_ARCHETYPE_SPECIALIZE: '特殊化原型', //
        ROLE_ARCHETYPE_BATCH_SUBMIT: '批量处理原型', //
        ROLE_ARCHETYPE_STATUS_FALLBACK: '回退原型状态', //
        ROLE_ARCHETYPE_SUBMIT: '提交原型', //
        ROLE_ARCHETYPE_VERIFY: '审核原型', //
        ROLE_TEMPLATE_UPLOAD: '上传模板', //
        ROLE_TEMPLATE_VIEW: '查看模板', //
        ROLE_TEMPLATE_EDIT: '编辑模板', //
        ROLE_TEMPLATE_SAVE: '保存模板', //
        ROLE_TEMPLATE_NEW_REVISION: '升迁模板小版本', //
        ROLE_TEMPLATE_NEW_VERSION: '升迁模板大版本',
        ROLE_TEMPLATE_CREATE: '创建模板', //
        ROLE_TEMPLATE_BACTH_SUBMIT: '批量处理模板', //
        ROLE_TEMPLATE_STATUS_FALLBACK: '回退模板状态', //
        ROLE_TEMPLATE_SUBMIT: '提交模板', //
        ROLE_TEMPLATE_VERIFY: '审核模板', //
        ROLE_TEMPLATE_DEPLOY: '部署模板', //
        ROLE_APPILCATION_VIEW: '查看应用', //
        ROLE_APPILCATION_EDIT: '编辑应用', //
        ROLE_API_VIEW: '查看接口信息', //
        ROLE_API_MAINTAIN: '编辑接口信息',
        ROLE_AUTHORIZE: '认证',


        //others,
        EXPAND_ALL: '全部展开',
        COLLAPSE_ALL: '全部收缩',
        STORAGE_TEMPLATE_UPLOAD_FAILED_SUGGESTION: "请删除所有无效的模板再进行上传操作",
        //management.archrtype.view.html
        MANAGEMENT_ARCHETYPE_VIEW_TOOLTIP_EXPAND: '展开',
        MANAGEMENT_ARCHETYPE_VIEW_TOOLTIP_COLLAPSE: '闭合',
        TEMPLATE_UPLOAD_VALIDATION_ACCOMPLISHED_HINT: '验证完成，请删除验证失败的项再进行上传操作',
        DEVELOPMENT_API_EDIT_CLASS_INFO: "类型信息",
        DEVELOPMENT_API_VIEW_CODE_CODE: '代码',
        DEVELOPMENT_API_VIEW_CODE_DESC: '说明',

        UPLOAD_SUCCESSFUL: '上传成功',
        ALREADY_EXIST: '已存在',
        OTHERS: '其他',

        //BATCH PROCESS
        BATCH_SUBMIT_SUCCESSFUL: '成功',
        BATCH_SUBMIT_FAILED: '失败',
        BATCH_SUBMIT: '批量提交',
        BATCH_SUBMIT_CHECK_ALL: '全选',
        BATCH_SUBMIT_SUBMIT_CHECKED: '提交选中项',


        //authority map
        ROLE_ADMIN: '管理员',
        ROLE_USER: '使用者',

    });
});
