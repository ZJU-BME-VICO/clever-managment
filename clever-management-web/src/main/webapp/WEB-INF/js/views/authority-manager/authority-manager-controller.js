function AuthorityManagerCtrl($scope, $modal, ngPopover, msgboxService, resourceService, AUTHORITY_MANAGEMENT_ROLE_ADD_URL, AUTHORITY_MANAGEMENT_ROLE_DELETE_BY_ID_URL, AUTHORITY_MANAGEMENT_ROLE_EDIT_BY_ID_URL, AUTHORITY_MANAGEMENT_AUTHORITY_LIST_URL, AUTHORITY_MANAGEMENT_USER_ADD_URL, AUTHORITY_MANAGEMENT_USER_EDIT_BY_ID_URL, AUTHORITY_MANAGEMENT_USER_DELETE_BY_ID_URL, AUTHORITY_MANAGEMENT_ROLE_LIST_URL, AUTHORITY_MANAGEMENT_USER_LIST_URL, AUTHORITY_MANAGEMENT_AUTHORITY_DEPLOY_URL) {

	$scope.containerHeight = {
		value : $scope.$parent.containerHeight - 35
	};
	$scope.$watch(function() {
		return $scope.$parent.containerHeight;
	}, function(newValue) {
		$scope.containerHeight.value = newValue - 35;
	});

	//	$scope.currentTable = 'USER2ROLE';
	console.log($scope);
	$scope.selectTable = function(value) {
		$scope.currentTable = value;
	};
	$scope.currentTable = 'ROLE2AUTHORITY';
	$scope.deployAuthority = function() {
		resourceService.get(AUTHORITY_MANAGEMENT_AUTHORITY_DEPLOY_URL).then(function(result) {
			console.log(result);
		});
	};
	$scope.deployAuthority();

	$scope.getAuthorities = function() {
		resourceService.get(AUTHORITY_MANAGEMENT_AUTHORITY_LIST_URL).then(function(result) {
			$scope.authorityList = result;
			console.log(result);
		});
	}();

	$scope.refreshData = function() {
		resourceService.get(AUTHORITY_MANAGEMENT_USER_LIST_URL).then(function(result) {
			$scope.userList = result;
			console.log(result);
		});
		resourceService.get(AUTHORITY_MANAGEMENT_ROLE_LIST_URL).then(function(result) {
			$scope.roleList = result;
			console.log(result);
		});
	};
	$scope.refreshData();

	$scope.saveUser = function(user) {
		resourceService.post(AUTHORITY_MANAGEMENT_USER_EDIT_BY_ID_URL + user.id, {
			userName : user.userName,
			password : user.password,
			roleId : user.role.id,
			isEnabled : user.isEnabled,

		}).then(function(result) {
			//alert(result);
			console.log(result);
		});
	};
	function getRoleId(roleName) {
		var id;
		angular.forEach($scope.roleList, function(value) {
			if (value.roleName == roleName) {
				id = value.id;
			}
		});
		return id;
	}


	$scope.addUser = function() {
		var roleId = getRoleId("ADMIN");
		if (roleId) {
			resourceService.post(AUTHORITY_MANAGEMENT_USER_ADD_URL, {
				userName : "userName",
				password : 'password',
				roleId : roleId,
				isEnabled : true,
			}).then(function(result) {
				console.log(result);
				$scope.refreshData();
			});
		} else {
			msgboxService.createMessageBox("ARCHETYPE_VERIFY_FAILED", "AUTHORITY_ADMIN_NOT_FOUND_HINT", 'error');
		}
	};
	$scope.deleteUser = function(user) {
		msgboxService.createMessageBox("ARCHETYPE_VERIFY_MSG_HINT", "AUTHORITY_USER_REMOVE_HINT", {
			userName : user.userName
		}, "question", "yesOrNo").result.then(function(confirm) {
			if (confirm) {
				resourceService.get(AUTHORITY_MANAGEMENT_USER_DELETE_BY_ID_URL + user.id).then(function(result) {
					//alert(result);
					console.log(result);
					$scope.refreshData();
				});
			}
		});
	};
	$scope.changeUserStatus = function(user) {
		user.isEnabled = !user.isEnabled;
	};
	$scope.userNameFilter = {
		userName : "",
	};
	$scope.roleNameFilter = {
		roleName : "",
	};

	$scope.authorityManage = function(role) {

		var modalInstance = $modal.open({
			animation : true, //animations on
			templateUrl : 'js/views/authority-manager/modal-html/authority.manage.html',
			controller : function AuthorityManageCtrl($scope, $modalInstance, role, authorityList, maxHeight) {

				console.log(role);
				console.log(authorityList);
				$scope.authorityList = authorityList;
				$scope.role = role;
				$scope.maxHeight = {
					value : maxHeight
				};
				console.log(maxHeight);
				$scope.initAuthoritySelectedStatus = function() {
					if (role.authorities) {
						angular.forEach(role.authorities, function(ownAuthority) {
							angular.forEach($scope.authorityList, function(authority) {
								if (ownAuthority.id == authority.id) {
									authority.selected = true;
								}
							});
						});
					}

				}();
				$scope.ok = function() {
					$scope.authorityIdList = [];
					angular.forEach($scope.authorityList, function(authority) {
						if (authority.selected) {
							$scope.authorityIdList.push(authority.id);
						}
					});
					console.log($scope.roleIdList);
					$modalInstance.close({
						authorityIdList : $scope.authorityIdList,
						role : $scope.role,
					});
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			},
			size : 'lg',
			resolve : {
				role : function() {
					return role;
				},
				authorityList : function() {
					return $scope.authorityList;
				},
				maxHeight : function() {
					return $scope.containerHeight;
				}
			}
		});
		modalInstance.result.then(function(message) {// modal message back
			saveRole(message);
		});

	};

	$scope.deleteRole = function(role) {
		msgboxService.createMessageBox("ARCHETYPE_VERIFY_MSG_HINT", "AUTHORITY_ROLE_REMOVE_HINT", {
			roleName : role.roleName
		}, "question", "yesOrNo").result.then(function(confirm) {
			if (confirm) {
				resourceService.get(AUTHORITY_MANAGEMENT_ROLE_DELETE_BY_ID_URL + role.id).then(function(result) {
					//alert(result);
					console.log(result);
					$scope.refreshData();
					if (result.succeeded) {
						msgboxService.createMessageBox("OPERATE_PROMPT_HINT", "AUTHORITY_ROLE_REMOVE_SUCCEEDED_HINT", "success");
					} else {
						msgboxService.createMessageBox("OPERATE_PROMPT_HINT", "AUTHORITY_ROLE_REMOVE_ERROR_HINT", {
							errorMsg : result.message,
						}, "error");
					}

				});
			}
		});
	};

	function saveRole(message) {
		resourceService.post(AUTHORITY_MANAGEMENT_ROLE_EDIT_BY_ID_URL + message.role.id, {
			roleName : message.role.roleName,
			description : message.role.description,
			authorityIdList : message.authorityIdList,
		}).then(function(result) {
			console.log(result);
			$scope.refreshData();
		});
	}


	$scope.addRole = function() {
		resourceService.post(AUTHORITY_MANAGEMENT_ROLE_ADD_URL, {
			roleName : "new Role Name",
			description : 'description',
		}).then(function(result) {
			$scope.refreshData();
			if (result.succeeded) {
				msgboxService.createMessageBox("OPERATE_PROMPT_HINT", "AUTHORITY_ROLE_ADD_SUCCEEDED_HINT","success");
			} else {
				msgboxService.createMessageBox("OPERATE_PROMPT_HINT", "AUTHORITY_ROLE_ADD_FAILED_HINT", {
					errorMsg : result.message,
				}, "error");
			}
		});
	};
}
