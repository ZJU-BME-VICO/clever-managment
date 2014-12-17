package edu.zju.bme.clever.management.web.entity;

import java.util.HashSet;
import java.util.Set;

public class ArchetypeMasterInfo {

	private Integer id;
	private String conceptName;
	private String latestArchetypeVersion;
	private String name;
	private Set<ArchetypeMasterInfo> specialiseArchetypeMasters = new HashSet<ArchetypeMasterInfo>();
	private boolean isRoot = true;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getConceptName() {
		return conceptName;
	}

	public void setConceptName(String conceptName) {
		this.conceptName = conceptName;
	}

	public String getLatestArchetypeVersion() {
		return latestArchetypeVersion;
	}

	public void setLatestArchetypeVersion(String latestArchetypeVersion) {
		this.latestArchetypeVersion = latestArchetypeVersion;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Set<ArchetypeMasterInfo> getSpecialiseArchetypeMasters() {
		return specialiseArchetypeMasters;
	}

	public boolean isRoot() {
		return isRoot;
	}

	public void setRoot(boolean root) {
		this.isRoot = root;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof ArchetypeMasterInfo) {
			return ((ArchetypeMasterInfo) obj).getId() == this.id;
		}
		return false;
	}
}
