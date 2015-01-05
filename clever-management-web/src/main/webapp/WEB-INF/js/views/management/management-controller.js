function ManagementCtrl($scope, $state, $timeout) {
	var undefined;
	$scope.$watch(function() {
		return $scope.$parent.containerHeight;
	}, function(newValue) {
		$scope.containerHeight = newValue - 110;
	});
	$scope.breadcrumbs = [];
	$scope.menus = [];
	
	// Breadcrumb tree initial
	$scope.breadcrumbTree = {};
	var management = $scope.breadcrumbTree.management = {
		index : 0,
		title : 'MENU_MANAGEMENT',
		href : '#/management',
		state : 'management.list',
		icon : 'icon-home',
		info : 'MENU_MANAGEMENT_INFO',
	};
	// Archetype management
	var archetype = management.archetype = {
		index : 1,
		title : 'MENU_MANAGEMENT_ARCHETYPE',
		href : '#/management/archetype',
		state : 'management.archetype.list',
		icon : 'icon-th',
		info : 'MENU_MANAGEMENT_ARCHETYPE_INFO',
	};
	archetype.view = {
		index : 1,
		title : 'MENU_MANAGEMENT_ARCHETYPE_VIEW',
		href : '#/management/archetype/view',
		state : 'management.archetype.view',
		icon : 'icon-film',
		info : 'MENU_MANAGEMENT_ARCHETYPE_VIEW_INFO',
	};
	archetype.upload = {
		index : 2,
		title : 'MENU_MANAGEMENT_ARCHETYPE_UPLOAD',
		href : '#/management/archetype/upload',
		state : 'management.archetype.upload',
		icon : 'icon-upload-alt',
		info : 'MENU_MANAGEMENT_ARCHETYPE_UPLOAD_INFO',
	};
	// Storage management
	var storage = management.storage = {
		index : 2,
		title : 'MENU_MANAGEMENT_STORAGE',
		href : '#/management/storage',
		state : 'management.storage.list',
		icon : 'icon-cog',
		info : 'MENU_MANAGEMENT_STORAGE_INFO',
	};
	// Application management
	var application = management.application = {
		index : 3,
		title : 'MENU_MANAGEMENT_APPLICATION',
		href : '#/management/application',
		state : 'management.application.list',
		icon : 'icon-list-alt',
		info : 'MENU_MANAGEMENT_APPLICATION_INFO',
	};
	application.design = {
		index : 1,
		title : 'MENU_MANAGEMENT_APPLICATION_DESIGN',
		href : '#/management/application/design',
		state : 'management.application.design',
		icon : ' icon-magic',
		info : 'MENU_MANAGEMENT_APPLICATION_DESIGN_INFO',
	};
	application.view = {
		index : 2,
		title : 'MENU_MANAGEMENT_APPLICATION_VIEW',
		href : '#/management/application/view',
		state : 'management.application.view',
		icon : 'icon-picture',
		info : 'MENU_MANAGEMENT_APPLICATION_VIEW_INFO',
	};
	application.edit = {
		index : 3,
		title : 'MENU_MANAGEMENT_APPLICATION_EDIT',
		href : '#/management/application/edit',
		state : 'management.application.edit',
		icon : 'icon-edit',
		info : 'MENU_MANAGEMENT_APPLICATION_EDIT_INFO',
	};
	// Integration management
	var integration = management.integration = {
		index : 4,
		title : 'MENU_MANAGEMENT_INTEGRATION',
		href : '#/management/integration',
		state : 'management.integration.list',
		icon : 'icon-screenshot',
		info : 'MENU_MANAGEMENT_INTEGRATION_INFO',
	};

	$scope.selectMenu = function(menu) {
		$state.go(menu.state);
	};

	$scope.setBreadcrumbs = function(breadcrumbs) {
		$scope.breadcrumbs = breadcrumbs;
	};

	$scope.$watch('$state.current.name', function(newValue) {
		// Construct breadcrumbs
		$scope.breadcrumbs = [];
		var breadcrumbTree = $scope.breadcrumbTree;
		var stateChain = $scope.$state.current.name.split('.');
		angular.forEach(stateChain, function(path) {
			if (breadcrumbTree[path] != undefined) {
				breadcrumbTree = breadcrumbTree[path];
				$scope.breadcrumbs.push(breadcrumbTree);
			}
		});
		// Construct dock menu
		$scope.menus = [];
		var lastState = stateChain.pop();
		var menu = $scope.breadcrumbTree;
		angular.forEach(stateChain, function(path) {
			if (menu[path] != undefined) {
				menu = menu[path];
			}
		});
		angular.forEach(menu, function(value) {
			if (angular.isObject(value)) {
				$scope.menus.push({
					title : value.title,
					imgUrl : 'img/logo.png',
					state : value.state,
					icon : value.icon,
					info : value.info,
					index : value.index,
				});
			}
		});
		if (stateChain.length > 1) {
			$scope.menus.push({
				title : 'MENU_RETURN',
				imgUrl : 'img/logo.png',
				state : $state.current.data.parent,
			});
		}
	});
	
	
	//查看详细信息
	$scope.clickItem=-1;           //选中的功能模块  title
	$scope.currentIndex=-1;        //当前的功能模块的 index
	$scope.beforeIndex=-1;         //之前的 index

	$scope.menuClick=function(id,index){
		if(id=="MENU_RETURN"){
			$scope.clickItem=-1;           
			$scope.currentIndex=-1;        
			$scope.beforeIndex=-1;
			$state.go($state.current.data.parent);
		}else{
			$scope.clickItem=id;
			if($scope.currentIndex!=-1){
				$scope.beforeIndex=$scope.currentIndex;
			}
			$scope.currentIndex=index;

			$timeout(function(){
				if($scope.currentIndex > $scope.beforeIndex){
					$("."+id).transition({
						scale 	: 2.2,
						y		: 0
					},0,function(){
						$("."+id).removeClass("off");
						$("."+id).transition({
							scale : 1,
							opacity : 1,
							zIndex : 2
						},600);
					});
				}else if($scope.currentIndex < $scope.beforeIndex){
					$("."+id).transition({
						scale : 0.1,
						y : 0
					},0,function(){
						$("."+id).removeClass("off");
						$("."+id).transition({
							scale : 1,
							opacity : 1,
							zIndex : 2
						},600);
					});
				}
			},0);
		}
	};

}
