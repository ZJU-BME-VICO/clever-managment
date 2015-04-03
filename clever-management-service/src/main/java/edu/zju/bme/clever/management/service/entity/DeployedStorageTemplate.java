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
	private Integer internalVersion;
	@ManyToOne(fetch = FetchType.LAZY)
	private TemplateRevisionFile originalTemplate;
	@ManyToOne(fetch = FetchType.LAZY)
	private DeployRecord deployRecord;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "storageTemplate")
	private List<EntityClass> entityClasses;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "sourceTemplate")
	private List<EntityRelationship> forwardRelationships;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "destinationTemplate")
	private List<EntityRelationship> backwardRelationships;

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

	public Integer getInternalVersion() {
		return internalVersion;
	}

	public void setInternalVersion(Integer internalVersion) {
		this.internalVersion = internalVersion;
	}

	public List<EntityClass> getEntityClasses() {
		return entityClasses;
	}

	public List<EntityRelationship> getForwardRelationships() {
		return forwardRelationships;
	}

	public List<EntityRelationship> getBackwardRelationships() {
		return backwardRelationships;
	}

}
