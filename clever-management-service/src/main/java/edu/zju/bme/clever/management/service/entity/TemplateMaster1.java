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
public class TemplateMaster1 extends AbstractIndentifiedEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8143857887261038766L;

	@Column
	private TemplateType templateType;
	@Column(nullable = false)
	private String name;
	@Column(nullable = false)
	private String rmOrginator;
	@Column(nullable = false)
	private String rmName;
	@Column(nullable = false)
	private String rmEntity;
	@Column(nullable = false)
	private String conceptName;
	@Lob
	@Column
	private String conceptDescription;
	@Column
	private String keywords;
	@Lob
	@Column
	private String purpose;
	@Lob
	@Column
	private String use;
	@Lob
	@Column
	private String misuse;
	@Lob
	@Column
	private String copyright;
	@Column
	private String version;
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeRevisionFile specialiseArchetypeRevisionFile;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "templateMaster", orphanRemoval = true)
	private List<TemplateRevisionFile> revisionFiles;
	@ManyToOne(fetch = FetchType.LAZY)
	private TemplateRevisionFile latestRevisionFile;
	@Column
	private String latestRevisionFileVersion;
	@Column
	private Integer latestRevisionFileSerialVersion;
	@Column
	private LifecycleState latestRevisionFileLifecycleState;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "templateMaster", orphanRemoval = true)
	private List<TemplateActionLog> actionLogs;

	public TemplateType getTemplateType() {
		return templateType;
	}

	public void setTemplateType(TemplateType templateType) {
		this.templateType = templateType;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRmOrginator() {
		return rmOrginator;
	}

	public void setRmOrginator(String rmOrginator) {
		this.rmOrginator = rmOrginator;
	}

	public String getRmName() {
		return rmName;
	}

	public void setRmName(String rmName) {
		this.rmName = rmName;
	}

	public String getRmEntity() {
		return rmEntity;
	}

	public void setRmEntity(String rmEntity) {
		this.rmEntity = rmEntity;
	}

	public String getConceptName() {
		return conceptName;
	}

	public void setConceptName(String conceptName) {
		this.conceptName = conceptName;
	}

	public String getConceptDescription() {
		return conceptDescription;
	}

	public void setConceptDescription(String conceptDescription) {
		this.conceptDescription = conceptDescription;
	}

	public String getKeywords() {
		return keywords;
	}

	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

	public String getUse() {
		return use;
	}

	public void setUse(String use) {
		this.use = use;
	}

	public String getMisuse() {
		return misuse;
	}

	public void setMisuse(String misuse) {
		this.misuse = misuse;
	}

	public String getCopyright() {
		return copyright;
	}

	public void setCopyright(String copyright) {
		this.copyright = copyright;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public ArchetypeRevisionFile getSpecialiseArchetypeRevisionFile() {
		return specialiseArchetypeRevisionFile;
	}

	public void setSpecialiseArchetypeRevisionFile(
			ArchetypeRevisionFile specialiseArchetypeRevisionFile) {
		this.specialiseArchetypeRevisionFile = specialiseArchetypeRevisionFile;
	}

	public TemplateRevisionFile getLatestRevisionFile() {
		return latestRevisionFile;
	}

	public void setLatestRevisionFile(TemplateRevisionFile latestRevisionFile) {
		this.latestRevisionFile = latestRevisionFile;
	}

	public String getLatestRevisionFileVersion() {
		return latestRevisionFileVersion;
	}

	public void setLatestRevisionFileVersion(String latestRevisionFileVersion) {
		this.latestRevisionFileVersion = latestRevisionFileVersion;
	}

	public Integer getLatestRevisionFileSerialVersion() {
		return latestRevisionFileSerialVersion;
	}

	public void setLatestRevisionFileSerialVersion(
			Integer latestRevisionFileSerialVersion) {
		this.latestRevisionFileSerialVersion = latestRevisionFileSerialVersion;
	}

	public LifecycleState getLatestRevisionFileLifecycleState() {
		return latestRevisionFileLifecycleState;
	}

	public void setLatestRevisionFileLifecycleState(
			LifecycleState latestRevisionFileLifecycleState) {
		this.latestRevisionFileLifecycleState = latestRevisionFileLifecycleState;
	}

	public List<TemplateRevisionFile> getRevisionFiles() {
		return revisionFiles;
	}

	public void setRevisionFiles(List<TemplateRevisionFile> revisionFiles) {
		this.revisionFiles = revisionFiles;
	}

	public List<TemplateActionLog> getActionLogs() {
		return actionLogs;
	}

	public void setActionLogs(List<TemplateActionLog> actionLogs) {
		this.actionLogs = actionLogs;
	}

}
