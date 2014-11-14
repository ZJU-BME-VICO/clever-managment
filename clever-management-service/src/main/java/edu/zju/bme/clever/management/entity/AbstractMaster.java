package edu.zju.bme.clever.management.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

@SuppressWarnings({ "serial", "rawtypes" })
@MappedSuperclass
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class AbstractMaster<T extends AbstractFile> extends
		AbstractIndentifiedEntity {

	@Column
	private String masterName;
	@Column
	private String rmOrginator;
	@Column
	private String rmName;
	@Column
	private String rmEntity;
	@Column
	private String conceptName;
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeMaster specialiseArchetypeMaster;
	@Column
	private Integer latestSpecialiseArchetypeInternalVersion;
	@Column
	private Integer currentSpecialiseArchetypeInternalVersion;
	@Column
	private String currentSpecialiseArchetypeVersion;
	@OneToMany
	private List<T> files;
	@OneToOne(fetch = FetchType.LAZY)
	@PrimaryKeyJoinColumn
	private T latestFile;
	@Column
	private String latestFileVersion;
	@Column
	private String latestFileLifecycleState;

	public String getMasterName() {
		return masterName;
	}

	public void setMasterName(String masterName) {
		this.masterName = masterName;
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

	public String getLatestFileLifecycleState() {
		return latestFileLifecycleState;
	}

	public void setLatestFileLifecycleState(String latestFileLifecycleState) {
		this.latestFileLifecycleState = latestFileLifecycleState;
	}

}
