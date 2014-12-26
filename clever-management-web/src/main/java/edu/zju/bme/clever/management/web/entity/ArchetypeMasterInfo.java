package edu.zju.bme.clever.management.web.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;

import edu.zju.bme.clever.management.service.entity.LifecycleState;

public class ArchetypeMasterInfo {

	private Integer id;
	private String conceptName;
	private String rmOrginator;
	private String rmName;
	private String rmEntity;
	private String conceptDescription;
	private String keywords;
	private String purpose;
	private String use;
	private String misuse;
	private String copyright;
	private String latestArchetypeVersion;
	private String name;
	private LifecycleState lifecycleState;
	private ArchetypeMasterInfo specialiseArchetypeMaster;
	private Set<ArchetypeMasterInfo> specialisedArchetypeMasters = new HashSet<ArchetypeMasterInfo>();
	private boolean isRoot = true;
	private Set<ArchetypeActionLogInfo> actionLogs = new HashSet<ArchetypeActionLogInfo>();

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

	public LifecycleState getLifecycleState() {
		return lifecycleState;
	}

	public void setLifecycleState(LifecycleState lifecycleState) {
		this.lifecycleState = lifecycleState;
	}

	public Set<ArchetypeMasterInfo> getSpecialisedArchetypeMasters() {
		return specialisedArchetypeMasters;
	}

	public ArchetypeMasterInfo getSpecialiseArchetypeMaster() {
		return specialiseArchetypeMaster;
	}

	public void setSpecialiseArchetypeMaster(
			ArchetypeMasterInfo specialiseArchetypeMaster) {
		this.specialiseArchetypeMaster = specialiseArchetypeMaster;
	}

	public Set<ArchetypeActionLogInfo> getActionLogs() {
		return actionLogs;
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
