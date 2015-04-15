package edu.zju.bme.clever.management.service.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table
@DynamicUpdate(true)
public class EntityRelationship extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1510121567393953567L;

	@Column(nullable = false)
	private String sourceEntityId;
	@Column
	private String sourceEntityTargetPath;
	@Column(nullable = false)
	private String sourceTemplateName;
	@Column(nullable = false)
	private String destinationEntityId;
	@Column
	private String destinationEntityTargetPath;
	@Column(nullable = false)
	private String destinationTemplateName;
	@ManyToOne(fetch = FetchType.LAZY)
	private EntityClassSource sourceEntityClassSource;
	@ManyToOne(fetch = FetchType.LAZY)
	private EntityClassSource destinationEntityClassSource;
	@ManyToOne(fetch = FetchType.LAZY)
	private DeployedStorageTemplate sourceTemplate;
	@ManyToOne(fetch = FetchType.LAZY)
	private DeployedStorageTemplate destinationTemplate;
	@Column(nullable = false)
	private EntityRelationshipType relationshipType;
	@ManyToOne(fetch = FetchType.LAZY)
	private DeployRecord deployRecord;

	public String getSourceEntityId() {
		return sourceEntityId;
	}

	public void setSourceEntityId(String sourceEntityId) {
		this.sourceEntityId = sourceEntityId;
	}

	public String getSourceEntityTargetPath() {
		return sourceEntityTargetPath;
	}

	public void setSourceEntityTargetPath(String sourceEntityTargetPath) {
		this.sourceEntityTargetPath = sourceEntityTargetPath;
	}

	public String getSourceTemplateName() {
		return sourceTemplateName;
	}

	public void setSourceTemplateName(String sourceTemplateName) {
		this.sourceTemplateName = sourceTemplateName;
	}

	public String getDestinationEntityId() {
		return destinationEntityId;
	}

	public void setDestinationEntityId(String destinationEntityId) {
		this.destinationEntityId = destinationEntityId;
	}

	public String getDestinationEntityTargetPath() {
		return destinationEntityTargetPath;
	}

	public void setDestinationEntityTargetPath(
			String destinationEntityTargetPath) {
		this.destinationEntityTargetPath = destinationEntityTargetPath;
	}

	public String getDestinationTemplateName() {
		return destinationTemplateName;
	}

	public void setDestinationTemplateName(String destinationTemplateName) {
		this.destinationTemplateName = destinationTemplateName;
	}

	public DeployRecord getDeployRecord() {
		return deployRecord;
	}

	public void setDeployRecord(DeployRecord deployRecord) {
		this.deployRecord = deployRecord;
	}

	public EntityClassSource getSourceEntity() {
		return sourceEntityClassSource;
	}

	public void setSourceEntity(EntityClassSource sourceEntity) {
		this.sourceEntityClassSource = sourceEntity;
	}

	public EntityClassSource getDestinationEntity() {
		return destinationEntityClassSource;
	}

	public void setDestinationEntity(EntityClassSource destinationEntity) {
		this.destinationEntityClassSource = destinationEntity;
	}

	public DeployedStorageTemplate getSourceTemplate() {
		return sourceTemplate;
	}

	public void setSourceTemplate(DeployedStorageTemplate sourceTemplate) {
		this.sourceTemplate = sourceTemplate;
	}

	public DeployedStorageTemplate getDestinationTemplate() {
		return destinationTemplate;
	}

	public void setDestinationTemplate(
			DeployedStorageTemplate destinationTemplate) {
		this.destinationTemplate = destinationTemplate;
	}

	public EntityRelationshipType getRelationshipType() {
		return relationshipType;
	}

	public void setRelationshipType(EntityRelationshipType relationshipType) {
		this.relationshipType = relationshipType;
	}

}
