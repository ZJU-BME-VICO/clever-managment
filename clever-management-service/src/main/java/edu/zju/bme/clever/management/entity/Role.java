package edu.zju.bme.clever.management.entity;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@Entity
@Table(name = "Roles")
public class Role implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1484866953524565883L;
	@Id
	@Column(name = "RoleId")
	@GeneratedValue
	private int roleId;
	@Column(name = "roleName")
	private String roleName;
	@Column(name = "Description")
	private String description;
	@ManyToMany(targetEntity = Authority.class, fetch = FetchType.EAGER)
	@JoinTable(name = "RoleAuthorityMappling", joinColumns = { @JoinColumn(name = "RoleId") }, inverseJoinColumns = { @JoinColumn(name = "AuthorityId") })
	private Set<Authority> authorities;
	@ManyToMany(targetEntity = User.class, fetch = FetchType.LAZY, mappedBy = "roles")
	private Set<User> users;

	public Role() {

	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

	public int getRoleId() {
		return roleId;
	}

	public void setRoleId(int roleId) {
		this.roleId = roleId;
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

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof Role) {
			return ((Role) obj).getRoleId() == this.roleId;
		}
		return false;
	}

}
