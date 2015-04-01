package edu.zju.bme.clever.management.service.entity;

import java.util.Calendar;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "deployRecord")
	private List<DeployedStorageTemplate> deployedStorageTemplates;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "deployRecord")
	private List<EntityClass> entityClasses;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "deployRecord")
	private List<EntityRelationship> entityRelationships;

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
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

	public List<EntityClass> getEntityClasses() {
		return entityClasses;
	}

	public List<EntityRelationship> getEntityRelationships() {
		return entityRelationships;
	}

}
