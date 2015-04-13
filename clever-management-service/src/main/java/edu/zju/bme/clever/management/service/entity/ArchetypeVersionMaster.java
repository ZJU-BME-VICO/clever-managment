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
public class ArchetypeVersionMaster extends AbstractMaster {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5657916231081122171L;

	@Column(updatable = false)
	private String version;
	@Column(updatable = false)
	private Integer serialVersion;
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeMaster archetypeMaster;
	@Column
	private String archetypeMasterName;
	@Column(name = "archetype_master_id", updatable = false, insertable = false)
	private Integer specialiseArchetypeMasterId;
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeVersionMaster specialiseArchetypeVersionMaster;
	@Column(name = "specialise_archetype_version_master_id", updatable = false, insertable = false)
	private Integer specialiseArchetypeVersionMasterId;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "versionMaster", orphanRemoval = true)
	private List<ArchetypeRevisionFile> revisionFiles;
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeRevisionFile latestRevisionFile;
	@Column
	private String latestRevisionFileVersion;
	@Column
	private Integer latestRevisionFileSerialVersion;
	@Column
	private LifecycleState latestRevisionFileLifecycleState;
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeVersionMaster lastVersionMaster;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "archetypeVersionMaster", orphanRemoval = true)
	private List<ArchetypeActionLog> actionLogs;

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

	public ArchetypeMaster getArchetypeMaster() {
		return archetypeMaster;
	}

	public void setArchetypeMaster(ArchetypeMaster archetypeMaster) {
		this.archetypeMaster = archetypeMaster;
	}

	public String getArchetypeMasterName() {
		return archetypeMasterName;
	}

	public void setArchetypeMasterName(String archetypeMasterName) {
		this.archetypeMasterName = archetypeMasterName;
	}

	public ArchetypeVersionMaster getSpecialiseArchetypeVersionMaster() {
		return specialiseArchetypeVersionMaster;
	}

	public void setSpecialiseArchetypeVersionMaster(
			ArchetypeVersionMaster specialiseArchetypeVersionMaster) {
		this.specialiseArchetypeVersionMaster = specialiseArchetypeVersionMaster;
	}

	public List<ArchetypeRevisionFile> getRevisionFiles() {
		return revisionFiles;
	}

	public void setRevisionFiles(List<ArchetypeRevisionFile> revisionFiles) {
		this.revisionFiles = revisionFiles;
	}

	public ArchetypeRevisionFile getLatestRevisionFile() {
		return latestRevisionFile;
	}

	public void setLatestRevisionFile(ArchetypeRevisionFile latestRevisionFile) {
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

	public Integer getSpecialiseArchetypeMasterId() {
		return specialiseArchetypeMasterId;
	}

	public Integer getSpecialiseArchetypeVersionMasterId() {
		return specialiseArchetypeVersionMasterId;
	}

	public ArchetypeVersionMaster getLastVersionMaster() {
		return lastVersionMaster;
	}

	public void setLastVersionMaster(ArchetypeVersionMaster lastVersionMaster) {
		this.lastVersionMaster = lastVersionMaster;
	}

}
