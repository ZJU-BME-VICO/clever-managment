package edu.zju.bme.clever.management.entity;

import java.io.Serializable;
import java.util.Calendar;
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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table(name = "Users")
@DynamicUpdate(true)
public class User implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -4791462313378825505L;
	@Id
	@Column(name = "UserId")
	@GeneratedValue
	private Integer userId;
	@Column(name = "UserName")
	private String userName;
	@Column(name = "Password")
	private String password;
	@Column(name = "Enabled")
	private boolean isEnabled;
	@ManyToMany(targetEntity = Role.class, fetch = FetchType.EAGER)
	@JoinTable(name = "UserRoleMappling", joinColumns = { @JoinColumn(name = "UserId") }, inverseJoinColumns = { @JoinColumn(name = "RoleId") })
	private Set<Role> roles;
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "UpdateTime")
	private Calendar updateTime;
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "LastLogoutTime")
	private Calendar lastLogoutTime;

	public User() {

	}

	public boolean isEnabled() {
		return isEnabled;
	}

	public void setEnabled(boolean isEnabled) {
		this.isEnabled = isEnabled;
	}

	public Calendar getLastLogoutTime() {
		return lastLogoutTime;
	}

	public void setLastLogoutTime(Calendar lastLogoutTime) {
		this.lastLogoutTime = lastLogoutTime;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Calendar getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Calendar updateTime) {
		this.updateTime = updateTime;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof User) {
			return ((User) obj).getUserId() == this.userId;
		}
		return false;
	}

}
