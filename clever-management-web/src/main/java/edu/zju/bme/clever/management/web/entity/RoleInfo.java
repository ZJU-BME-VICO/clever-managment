package edu.zju.bme.clever.management.web.entity;

import java.util.List;

public class RoleInfo {
	private Integer id;

	private String roleName;
	private String description;
	private List<AuthorityInfo> authorities;
	private List<Integer> authorityIdList;

	public List<Integer> getAuthorityIdList() {
		return authorityIdList;
	}

	public void setAuthorityIdList(List<Integer> authorityIdList) {
		this.authorityIdList = authorityIdList;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<AuthorityInfo> getAuthorities() {
		return authorities;
	}

	public void setAuthorities(List<AuthorityInfo> authorities) {
		this.authorities = authorities;
	}

}
