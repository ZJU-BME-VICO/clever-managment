package edu.zju.bme.clever.management.web.rest;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.zju.bme.clever.management.service.AuthorityManagementService;
import edu.zju.bme.clever.management.service.entity.Authority;
import edu.zju.bme.clever.management.service.entity.Role;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.ResourceNotFoundException;
import edu.zju.bme.clever.management.web.entity.AuthorityInfo;
import edu.zju.bme.clever.management.web.entity.OperateResult;
import edu.zju.bme.clever.management.web.entity.RoleInfo;
import edu.zju.bme.clever.management.web.entity.UserInfo;

@RestController
@RequestMapping("/authority")
public class AuthorityManagementController extends AbstractResourceController {
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	@Autowired
	private AuthorityManagementService authService;

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public List<AuthorityInfo> getAuthorities() {
		List<Authority> authorities = authService.getAllAuthorities();
		isResourcesNull(authorities);
		return constructAuthorityInfo(authorities);
	}

	@RequestMapping(value = "/deploy", method = RequestMethod.GET)
	public void deploy() {
		authService.deployAuthorities();
	}

	@RequestMapping(value = "/user/list", method = RequestMethod.GET)
	public List<UserInfo> getUsers() {
		Set<User> users = authService.getAllUsers();
		isResourcesNull(users);
		return users.stream().map(user -> {

			UserInfo info = new UserInfo();
			info.setId(user.getId());
			info.setIsEnabled(user.isEnabled());
			info.setPassword(user.getPassword());
			info.setUserName(user.getName());
			info.setRole(constructRoleInfo(user.getRole()));
			return info;
		}).collect(Collectors.toList());
	}

	@RequestMapping(value = "/role/list", method = RequestMethod.GET)
	public List<RoleInfo> getRoles() {
		Set<Role> roles = authService.getAllRoles();
		isResourcesNull(roles);
		return roles.stream().map(role -> {
			return constructRoleInfo(role);
		}).collect(Collectors.toList());
	}

	@RequestMapping(value = "/role/add", method = RequestMethod.POST)
	public OperateResult addRole(@RequestBody RoleInfo info) {
		OperateResult result = new OperateResult();
		result.setSucceeded(true);
		try {
			this.authService.addRole(info.getRoleName(),  info
					.getAuthorityIdList(), info.getDescription());
		} catch (ResourceNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.setMessage(e.getMessage());
			result.setSucceeded(false);
		}
		return result;
	}

	@RequestMapping(value = "/role/delete/id/{id}", method = RequestMethod.GET)
	public OperateResult deletRole(@PathVariable Integer id) {
		OperateResult result = new OperateResult();
		result.setSucceeded(true);
		try {
			this.authService.deleteRole(id);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.setMessage(e.getMessage());
			result.setSucceeded(false);
		}
		return result;
	}
	@RequestMapping(value = "/role/edit/id/{id}", method = RequestMethod.POST)
	public OperateResult editRole(@PathVariable Integer id,
			@RequestBody RoleInfo info) {
		OperateResult result = new OperateResult();
		result.setSucceeded(true);
		try {
			this.authService.editRole(id, info.getRoleName(), info
					.getAuthorityIdList(), info.getDescription());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.setMessage(e.getMessage());
			result.setSucceeded(false);
		}

		return result;
	}

	@RequestMapping(value = "/user/add", method = RequestMethod.POST)
	public OperateResult addUser(@RequestBody UserInfo info) {
		OperateResult result = new OperateResult();
		result.setSucceeded(true);
		try {
			this.authService.addUser(info.getUserName(), info.getPassword(),
					info.getIsEnabled(), info.getRoleId());
		} catch (ResourceNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.setMessage(e.getMessage());
			result.setSucceeded(false);
		}
		return result;
	}

	@RequestMapping(value = "/user/delete/id/{id}", method = RequestMethod.GET)
	public OperateResult deleteUser(@PathVariable Integer id) {

		OperateResult result = new OperateResult();
		result.setSucceeded(true);
		try {
			this.authService.deleteUser(id);

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.setMessage(e.getMessage());
			result.setSucceeded(false);
		}
		return result;
	}

	@RequestMapping(value = "/user/edit/id/{id}", method = RequestMethod.POST)
	public OperateResult editUser(@RequestBody UserInfo info,
			@PathVariable Integer id) {
		OperateResult result = new OperateResult();
		result.setSucceeded(true);
		try {
			this.authService.editUser(id, info.getUserName(),
					info.getPassword(), info.getIsEnabled(), info.getRoleId());
		} catch (ResourceNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.setMessage(e.getMessage());
			result.setSucceeded(false);
		}
		return result;
	}

	private RoleInfo constructRoleInfo(Role role) {
		RoleInfo info = new RoleInfo();
		info.setDescription(role.getDescription());
		info.setId(role.getId());
		info.setRoleName(role.getRoleName());
		info.setAuthorities(constructAuthorityInfo(role.getAuthorities()));
		return info;
	}

	private List<AuthorityInfo> constructAuthorityInfo(
			Collection<Authority> authorities) {
		return authorities.stream().map(authority -> {
			AuthorityInfo info = new AuthorityInfo();
			info.setId(authority.getId());
			info.setAuthorityName(authority.getAuthorityName());
			info.setDescription(authority.getDescription());
			return info;
		}).collect(Collectors.toList());
	}
}
