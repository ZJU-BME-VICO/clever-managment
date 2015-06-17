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
public class ArchetypeMaster extends AbstractMaster {

	/**
	 * 
	 */
	private static final long serialVersionUID = 761446383299658145L;

	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeMaster specialiseArchetypeMaster;
	@Column(name = "specialise_archetype_master_id", updatable = false, insertable = false)
	private Integer specialiseArchetypeMasterId;
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "archetypeMaster", orphanRemoval = true)
	private List<ArchetypeVersionMaster> versionMasters;
	@ManyToOne(fetch = FetchType.LAZY)
	private ArchetypeVersionMaster latestVersionMaster;
	@Column
	private Integer latestVersionMasterSerialVersion;
	@Column
	private String latestVersionMasterVersion;

	public ArchetypeMaster getSpecialiseArchetypeMaster() {
		return specialiseArchetypeMaster;
	}

	public void setSpecialiseArchetypeMaster(
			ArchetypeMaster specialiseArchetypeMaster) {
		this.specialiseArchetypeMaster = specialiseArchetypeMaster;
	}

	public List<ArchetypeVersionMaster> getVersionMasters() {
		return versionMasters;
	}

	public void setVersionMasters(List<ArchetypeVersionMaster> versionMasters) {
		this.versionMasters = versionMasters;
	}

	public ArchetypeVersionMaster getLatestVersionMaster() {
		return latestVersionMaster;
	}

	public void setLatestVersionMaster(
			ArchetypeVersionMaster latestVersionMaster) {
		this.latestVersionMaster = latestVersionMaster;
	}

	public Integer getLatestVersionMasterSerialVersion() {
		return latestVersionMasterSerialVersion;
	}

	public void setLatestVersionMasterSerialVersion(
			Integer latestVersionMasterSerialVersion) {
		this.latestVersionMasterSerialVersion = latestVersionMasterSerialVersion;
	}

	public Integer getSpecialiseArchetypeMasterId() {
		return specialiseArchetypeMasterId;
	}

	public String getLatestVersionMasterVersion() {
		return latestVersionMasterVersion;
	}

	public void setLatestVersionMasterVersion(String latestVersionMasterVersion) {
		this.latestVersionMasterVersion = latestVersionMasterVersion;
	}

}
