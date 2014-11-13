package edu.zju.bme.clever.management.entity;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@Entity
@Table
public class Authority extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1329090175596195504L;

	@Column
	private String authorityName;
	@Column
	private String description;
	@ManyToMany(targetEntity = Role.class, fetch = FetchType.LAZY, mappedBy = "authorities")
	private Set<Role> roles;

	public String getAuthorityName() {
		return authorityName;
	}

	public void setAuthorityName(String authorityName) {
		this.authorityName = authorityName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
