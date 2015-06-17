package edu.zju.bme.clever.management.web.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;

import edu.zju.bme.clever.management.service.entity.LifecycleState;

public class ArchetypeVersionMasterInfo extends AbstractMasterInfo {

	private Integer latestArchetypeId;
	private String latestArchetypeVersion;
	private String version;
	private Set<ArchetypeVersionMasterInfo> specialisedArchetypeVersionMasters = new HashSet<ArchetypeVersionMasterInfo>();
	private Set<ArchetypeVersionMasterInfo> historyVersionMasters = new HashSet<ArchetypeVersionMasterInfo>();
	private Set<ArchetypeInfo> archetypes = new HashSet<ArchetypeInfo>();
	private ArchetypeVersionMasterInfo specialiseArchetypeVersionMaster;
	private int masterId;
	private String masterName;

	public Integer getLatestArchetypeId() {
		return latestArchetypeId;
	}

	public void setLatestArchetypeId(Integer latestArchetypeId) {
		this.latestArchetypeId = latestArchetypeId;
	}

	public String getLatestArchetypeVersion() {
		return latestArchetypeVersion;
	}

	public void setLatestArchetypeVersion(String latestArchetypeVersion) {
		this.latestArchetypeVersion = latestArchetypeVersion;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public Set<ArchetypeVersionMasterInfo> getSpecialisedArchetypeVerisonMasters() {
		return specialisedArchetypeVersionMasters;
	}

	public void setSpecialisedArchetypeVersionMasters(
			Set<ArchetypeVersionMasterInfo> specialisedArchetypeVersionMasters) {
		this.specialisedArchetypeVersionMasters = specialisedArchetypeVersionMasters;
	}

	public Set<ArchetypeVersionMasterInfo> getHistoryVersionMasters() {
		return historyVersionMasters;
	}

	public void setHistoryVersionMasters(
			Set<ArchetypeVersionMasterInfo> historyVersionMasters) {
		this.historyVersionMasters = historyVersionMasters;
	}

	public Set<ArchetypeInfo> getArchetypes() {
		return archetypes;
	}

	public void setArchetypes(Set<ArchetypeInfo> archetypes) {
		this.archetypes = archetypes;
	}

	public ArchetypeVersionMasterInfo getSpecialiseArchetypeVersionMaster() {
		return specialiseArchetypeVersionMaster;
	}

	public void setSpecialiseArchetypeVersionMaster(
			ArchetypeVersionMasterInfo specialiseArchetypeVersionMaster) {
		this.specialiseArchetypeVersionMaster = specialiseArchetypeVersionMaster;
	}
	
	public int getMasterId() {
		return masterId;
	}

	public void setMasterId(int masterId) {
		this.masterId = masterId;
	}

	public String getMasterName() {
		return masterName;
	}

	public void setMasterName(String masterName) {
		this.masterName = masterName;
	}

}