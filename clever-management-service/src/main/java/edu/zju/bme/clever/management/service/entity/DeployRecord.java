package edu.zju.bme.clever.management.service.entity;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class DeployRecord extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2169272404257359022L;

	@Column
	private String comment;
	@ManyToOne(fetch = FetchType.LAZY)
	private User deployer;
	@Column(nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Calendar deployTime;
	@Column
	private boolean succeeded;
	@Lob
	@Column
	private String message;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "deployRecord")
	private List<DeployedStorageTemplate> deployedStorageTemplates = new ArrayList<DeployedStorageTemplate>();
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "deployRecord")
	private List<EntityClassSource> entityClasses = new ArrayList<EntityClassSource>();
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "deployRecord")
	private List<EntityRelationship> entityRelationships = new ArrayList<EntityRelationship>();

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public boolean isSucceeded() {
		return succeeded;
	}

	public void setSucceeded(boolean succeeded) {
		this.succeeded = succeeded;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public User getDeployer() {
		return deployer;
	}

	public void setDeployer(User deployer) {
		this.deployer = deployer;
	}

	public Calendar getDeployTime() {
		return deployTime;
	}

	public void setDeployTime(Calendar deployTime) {
		this.deployTime = deployTime;
	}

	public List<DeployedStorageTemplate> getDeployedStorageTemplates() {
		return deployedStorageTemplates;
	}

	public List<EntityClassSource> getEntityClasses() {
		return entityClasses;
	}

	public List<EntityRelationship> getEntityRelationships() {
		return entityRelationships;
	}

}
