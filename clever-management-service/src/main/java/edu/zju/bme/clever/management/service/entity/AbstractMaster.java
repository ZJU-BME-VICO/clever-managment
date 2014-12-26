package edu.zju.bme.clever.management.service.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToMany;

@SuppressWarnings({ "serial", "rawtypes" })
@MappedSuperclass
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class AbstractMaster<T extends AbstractFile> extends
		AbstractIndentifiedEntity {

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
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeMaster specialiseArchetypeMaster;
	@Column(name = "specialise_archetype_master_id", updatable = false, insertable = false)
	private Integer specialiseArchetypeMasterId;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "specialiseArchetypeMaster")
	private List<ArchetypeMaster> specialisedArchetypeMasters;
	@Column
	private Integer latestSpecialiseArchetypeInternalVersion;
	@Column
	private Integer currentSpecialiseArchetypeInternalVersion;
	@Column
	private String currentSpecialiseArchetypeVersion;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "master")
	private List<T> files;
	@ManyToOne(fetch = FetchType.LAZY)
	private T latestFile;
	@Column
	private String latestFileVersion;
	@Column
	private Integer latestFileInternalVersion;
	@Enumerated(EnumType.STRING)
	@Column
	private LifecycleState latestFileLifecycleState;

	public String getName() {
		return this.name;
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

	public ArchetypeMaster getSpecialiseArchetypeMaster() {
		return specialiseArchetypeMaster;
	}

	public void setSpecialiseArchetypeMaster(
			ArchetypeMaster specialiseArchetypeMaster) {
		this.specialiseArchetypeMaster = specialiseArchetypeMaster;
	}

	public Integer getSpecialiseArchetypeMasterId() {
		return specialiseArchetypeMasterId;
	}

	public Integer getLatestSpecialiseArchetypeInternalVersion() {
		return latestSpecialiseArchetypeInternalVersion;
	}

	public void setLatestSpecialiseArchetypeInternalVersion(
			Integer latestSpecialiseArchetypeInternalVersion) {
		this.latestSpecialiseArchetypeInternalVersion = latestSpecialiseArchetypeInternalVersion;
	}

	public Integer getCurrentSpecialiseArchetypeInternalVersion() {
		return currentSpecialiseArchetypeInternalVersion;
	}

	public void setCurrentSpecialiseArchetypeInternalVersion(
			Integer currentSpecialiseArchetypeInternalVersion) {
		this.currentSpecialiseArchetypeInternalVersion = currentSpecialiseArchetypeInternalVersion;
	}

	public String getCurrentSpecialiseArchetypeVersion() {
		return currentSpecialiseArchetypeVersion;
	}

	public void setCurrentSpecialiseArchetypeVersion(
			String currentSpecialiseArchetypeVersion) {
		this.currentSpecialiseArchetypeVersion = currentSpecialiseArchetypeVersion;
	}

	public List<T> getFiles() {
		return files;
	}

	public void setFiles(List<T> files) {
		this.files = files;
	}

	public T getLatestFile() {
		return latestFile;
	}

	public void setLatestFile(T latestFile) {
		this.latestFile = latestFile;
	}

	public String getLatestFileVersion() {
		return latestFileVersion;
	}

	public void setLatestFileVersion(String latestFileVersion) {
		this.latestFileVersion = latestFileVersion;
	}

	public LifecycleState getLatestFileLifecycleState() {
		return latestFileLifecycleState;
	}

	public void setLatestFileLifecycleState(
			LifecycleState latestFileLifecycleState) {
		this.latestFileLifecycleState = latestFileLifecycleState;
	}

	public List<ArchetypeMaster> getSpecialisedArchetypeMasters() {
		return specialisedArchetypeMasters;
	}

	public Integer getLatestFileInternalVersion() {
		return latestFileInternalVersion;
	}

	public void setLatestFileInternalVersion(Integer latestFileInternalVersion) {
		this.latestFileInternalVersion = latestFileInternalVersion;
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

}
