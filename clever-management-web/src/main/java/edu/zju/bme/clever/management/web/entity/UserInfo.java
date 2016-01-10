package edu.zju.bme.clever.management.web.entity;

import java.util.List;

public class UserInfo {
	private Integer id;
	private Boolean isAuthenticated;
	private String userName;
	private List<String> authorities;
	private RoleInfo role;
	private String password;
	private Boolean isEnabled;
	private Integer roleId;

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Integer getRoleId() {
		return roleId;
	}

	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}

	public Boolean getIsEnabled() {
		return isEnabled;
	}

	public void setIsEnabled(Boolean isEnabled) {
		this.isEnabled = isEnabled;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public RoleInfo getRole() {
		return role;
	}

	public void setRole(RoleInfo role) {
		this.role = role;
	}

	public Boolean getIsAuthenticated() {
		return isAuthenticated;
	}

	public void setIsAuthenticated(Boolean isAuthenticated) {
		this.isAuthenticated = isAuthenticated;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public List<String> getAuthorities() {
		return authorities;
	}

	public void setAuthorities(List<String> authorities) {
		this.authorities = authorities;
	}
}
