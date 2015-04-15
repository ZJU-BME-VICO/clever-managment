package edu.zju.bme.clever.management.service.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class EntityClassSource extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3408157777080650481L;

	@Column(nullable = false)
	private String name;
	@Column(nullable = false)
	private String fullName;
	@Column(nullable = false)
	private String packageName;
	@Column(nullable = false)
	private String entityId;
	@Column(nullable = false)
	@Lob
	private String content;
	@ManyToOne(fetch = FetchType.LAZY)
	private DeployRecord deployRecord;
	@Column
	private String storageTemplateName;
	@ManyToOne(fetch = FetchType.LAZY)
	private DeployedStorageTemplate storageTemplate;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "sourceEntityClassSource")
	private List<EntityRelationship> forwardRelationships = new ArrayList<EntityRelationship>();
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "destinationEntityClassSource")
	private List<EntityRelationship> backwardRelationships = new ArrayList<EntityRelationship>();

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getPackageName() {
		return packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

	public String getEntityId() {
		return entityId;
	}

	public void setEntityId(String entityId) {
		this.entityId = entityId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public DeployRecord getDeployRecord() {
		return deployRecord;
	}

	public void setDeployRecord(DeployRecord deployRecord) {
		this.deployRecord = deployRecord;
	}

	public DeployedStorageTemplate getStorageTemplate() {
		return storageTemplate;
	}

	public void setStorageTemplate(DeployedStorageTemplate storageTemplate) {
		this.storageTemplate = storageTemplate;
	}

	public String getStorageTemplateName() {
		return storageTemplateName;
	}

	public void setStorageTemplateName(String storageTemplateName) {
		this.storageTemplateName = storageTemplateName;
	}

	public List<EntityRelationship> getForwardRelationships() {
		return forwardRelationships;
	}

	public List<EntityRelationship> getBackwardRelationships() {
		return backwardRelationships;
	}

}
