package edu.zju.bme.clever.management.service.entity;

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
public class EntityClass extends AbstractIndentifiedEntity {

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
	private String fingerPrint;
	@Column(nullable = false)
	@Lob
	private String content;
	@ManyToOne(fetch = FetchType.LAZY)
	private DeployRecord deployRecord;
	@ManyToOne(fetch = FetchType.LAZY)
	private DeployedStorageTemplate storageTemplate;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "sourceEntity")
	private List<EntityRelationship> forwardRelationships;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "destinationEntity")
	private List<EntityRelationship> backwardRelationships;

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

	public String getFingerPrint() {
		return fingerPrint;
	}

	public void setFingerPrint(String fingerPrint) {
		this.fingerPrint = fingerPrint;
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

	public List<EntityRelationship> getForwardRelationships() {
		return forwardRelationships;
	}

	public List<EntityRelationship> getBackwardRelationships() {
		return backwardRelationships;
	}

}
