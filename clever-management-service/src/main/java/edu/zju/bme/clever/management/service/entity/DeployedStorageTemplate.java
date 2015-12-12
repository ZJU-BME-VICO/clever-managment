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
public class DeployedStorageTemplate extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 7032878454864587886L;

	@Column(nullable = false)
	private String name;
	@Lob
	@Column(nullable = false)
	private String oet;
	@Lob
	@Column(nullable = false)
	private String arm;
	@Column(nullable = false)
	private String version;
	@Column(nullable = false)
	private Integer serialVersion;
	@ManyToOne(fetch = FetchType.LAZY)
	private TemplateRevisionFile originalTemplate;
	@ManyToOne(fetch = FetchType.LAZY)
	private DeployRecord deployRecord;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "storageTemplate", orphanRemoval = true)
	private List<EntityClassSource> entityClassSources = new ArrayList<EntityClassSource>();
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "sourceTemplate", orphanRemoval = true)
	private List<EntityRelationship> forwardRelationships = new ArrayList<EntityRelationship>();
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "destinationTemplate", orphanRemoval = true)
	private List<EntityRelationship> backwardRelationships = new ArrayList<EntityRelationship>();

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOet() {
		return oet;
	}

	public void setOet(String oet) {
		this.oet = oet;
	}

	public String getArm() {
		return arm;
	}

	public void setArm(String arm) {
		this.arm = arm;
	}

	public TemplateRevisionFile getOriginalTemplate() {
		return originalTemplate;
	}

	public void setOriginalTemplate(TemplateRevisionFile originalTemplate) {
		this.originalTemplate = originalTemplate;
	}

	public DeployRecord getDeployRecord() {
		return deployRecord;
	}

	public void setDeployRecord(DeployRecord deployRecord) {
		this.deployRecord = deployRecord;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public Integer getSerialVersion() {
		return serialVersion;
	}

	public void setSerialVersion(Integer serialVersion) {
		this.serialVersion = serialVersion;
	}

	public List<EntityClassSource> getEntityClassSources() {
		return entityClassSources;
	}

	public List<EntityRelationship> getForwardRelationships() {
		return forwardRelationships;
	}

	public List<EntityRelationship> getBackwardRelationships() {
		return backwardRelationships;
	}

}
