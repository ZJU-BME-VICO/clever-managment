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
	private String sourceEntityFingerPrint;
	@Column(nullable = false)
	private String sourceEntityTargetPath;
	@Column(nullable = false)
	private String sourceTemplateName;
	@Column(nullable = false)
	private String destinationEntityFingerPrint;
	@Column(nullable = false)
	private String destinationEntityTargetPath;
	@Column(nullable = false)
	private String destinationTemplateName;
	@ManyToOne(fetch = FetchType.LAZY)
	private EntityClass sourceEntity;
	@ManyToOne(fetch = FetchType.LAZY)
	private EntityClass destinationEntity;
	@ManyToOne(fetch = FetchType.LAZY)
	private DeployedStorageTemplate sourceTemplate;
	@ManyToOne(fetch = FetchType.LAZY)
	private DeployedStorageTemplate destinationTemplate;
	@Column(nullable = false)
	private EntityRelationshipType relationshipType;
	@ManyToOne(fetch = FetchType.LAZY)
	private DeployRecord deployRecord;

	public String getSourceEntityFingerPrint() {
		return sourceEntityFingerPrint;
	}

	public void setSourceEntityFingerPrint(String sourceEntityFingerPrint) {
		this.sourceEntityFingerPrint = sourceEntityFingerPrint;
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

	public String getDestinationEntityFingerPrint() {
		return destinationEntityFingerPrint;
	}

	public void setDestinationEntityFingerPrint(
			String destinationEntityFingerPrint) {
		this.destinationEntityFingerPrint = destinationEntityFingerPrint;
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

	public EntityClass getSourceEntity() {
		return sourceEntity;
	}

	public void setSourceEntity(EntityClass sourceEntity) {
		this.sourceEntity = sourceEntity;
	}

	public EntityClass getDestinationEntity() {
		return destinationEntity;
	}

	public void setDestinationEntity(EntityClass destinationEntity) {
		this.destinationEntity = destinationEntity;
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
