package edu.zju.bme.clever.management.web.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;

import edu.zju.bme.clever.management.service.entity.LifecycleState;

public class ArchetypeMasterInfo extends AbstractMasterInfo {

	private Integer latestArchetypeId;
	private String latestArchetypeVersion;
	private Set<ArchetypeMasterInfo> specialisedArchetypeMasters = new HashSet<ArchetypeMasterInfo>();
	private Set<ArchetypeInfo> archetypes = new HashSet<ArchetypeInfo>();
	private boolean isRoot = true;

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

	public Set<ArchetypeMasterInfo> getSpecialisedArchetypeMasters() {
		return specialisedArchetypeMasters;
	}

	public void setSpecialisedArchetypeMasters(
			Set<ArchetypeMasterInfo> specialisedArchetypeMasters) {
		this.specialisedArchetypeMasters = specialisedArchetypeMasters;
	}

	public Set<ArchetypeInfo> getArchetypes() {
		return archetypes;
	}

	public void setArchetypes(Set<ArchetypeInfo> archetypes) {
		this.archetypes = archetypes;
	}

	public boolean isRoot() {
		return isRoot;
	}

	public void setRoot(boolean isRoot) {
		this.isRoot = isRoot;
	}

}