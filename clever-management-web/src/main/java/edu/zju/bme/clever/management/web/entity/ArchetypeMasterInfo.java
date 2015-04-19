package edu.zju.bme.clever.management.web.entity;

import java.util.HashSet;
import java.util.Set;

public class ArchetypeMasterInfo extends AbstractMasterInfo {
	
	private ArchetypeMasterInfo specialiseArchetypeMaster;
	private Set<ArchetypeMasterInfo> specialisedArchetypeMasters = new HashSet<ArchetypeMasterInfo>();
	private Set<ArchetypeVersionMasterInfo> versionMasters = new HashSet<ArchetypeVersionMasterInfo>();
	private int latestVersionMasterId;
	private String latestVersionMasterVersion;
	private boolean isRoot = true;

	public void setSpecialiseArchetypeMaster(ArchetypeMasterInfo specialiseArchetypeMaster) {
		this.specialiseArchetypeMaster = specialiseArchetypeMaster;
	}
	
	public ArchetypeMasterInfo getSpecialiseArchetypeMaster() {
		return specialiseArchetypeMaster;
	}
	
	public Set<ArchetypeMasterInfo> getSpecialisedArchetypeMasters() {
		return specialisedArchetypeMasters;
	}

	public void setSpecialisedArchetypeMasters(
			Set<ArchetypeMasterInfo> specialisedArchetypeMasters) {
		this.specialisedArchetypeMasters = specialisedArchetypeMasters;
	}
	
	public void setVersionMasters(Set<ArchetypeVersionMasterInfo> versionMasters) {
		this.versionMasters = versionMasters;
	}

	public Set<ArchetypeVersionMasterInfo> getVersionMasters() {
		return versionMasters;
	}
	
	public int getLatestVersionMasterId() {
		return latestVersionMasterId;
	}

	public void setLatestVersionMasterId(int latestVersionMasterId) {
		this.latestVersionMasterId = latestVersionMasterId;
	}

	public String getLatestVersionMasterVersion() {
		return latestVersionMasterVersion;
	}

	public void setLatestVersionMasterVersion(String latestVersionMasterVersion) {
		this.latestVersionMasterVersion = latestVersionMasterVersion;
	}
	
	public boolean isRoot() {
		return isRoot;
	}

	public void setRoot(boolean isRoot) {
		this.isRoot = isRoot;
	}
}
