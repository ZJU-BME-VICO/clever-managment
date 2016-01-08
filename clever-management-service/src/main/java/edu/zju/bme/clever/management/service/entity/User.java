package edu.zju.bme.clever.management.service.entity;

import java.util.Calendar;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class User extends AbstractIndentifiedEntity {
	/**
	 * 
	 */
	private static final long serialVersionUID = -4791462313378825505L;
	@Column
	private String name;
	@Column
	private String password;
	@Column
	private boolean isEnabled;
//	@ManyToMany(targetEntity = Role.class, fetch = FetchType.LAZY)
//	@JoinTable
//	private Set<Role> roles;
	@OneToOne
	private Role role;
	@Temporal(TemporalType.TIMESTAMP)
	@Column
	private Calendar updateTime;
	@Temporal(TemporalType.TIMESTAMP)
	@Column
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

//	public Set<Role> getRoles() {
//		return roles;
//	}
//
//	public void setRoles(Set<Role> roles) {
//		this.roles = roles;
//	}

	
	public String getName() {
		return name;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public void setName(String name) {
		this.name = name;
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

}
