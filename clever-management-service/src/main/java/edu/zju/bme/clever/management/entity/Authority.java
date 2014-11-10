package edu.zju.bme.clever.management.entity;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@Entity
@Table(name = "Authorities")
public class Authority implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1329090175596195504L;

	@Id
	@Column(name = "AuthorityId")
	@GeneratedValue
	private int authorityId;
	@Column(name = "AuthorityName")
	private String authorityName;
	@Column(name = "Description")
	private String description;
	@ManyToMany(targetEntity = Role.class, fetch = FetchType.LAZY, mappedBy = "authorities")
	private Set<Role> roles;

	public int getAuthorityId() {
		return authorityId;
	}

	public void setAuthorityId(int authorityId) {
		this.authorityId = authorityId;
	}

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

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof Authority) {
			return ((Authority) obj).getAuthorityId() == this.authorityId;
		}
		return false;
	}

}
