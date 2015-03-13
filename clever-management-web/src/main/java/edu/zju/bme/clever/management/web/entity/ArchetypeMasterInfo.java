package edu.zju.bme.clever.management.web.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;

import edu.zju.bme.clever.management.service.entity.LifecycleState;

public class ArchetypeMasterInfo {

	private Integer id;
	private String conceptName;
	private String rmOriginator;
	private String rmName;
	private String rmEntity;
	private String conceptDescription;
	private String keywords;
	private String purpose;
	private String use;
	private String misuse;
	private String copyright;
	private Integer latestArchetypeId;
	private String latestArchetypeVersion;
	private String name;
	private String lifecycleState;
	private ArchetypeMasterInfo specialiseArchetypeMaster;
	private Set<ArchetypeMasterInfo> specialisedArchetypeMasters = new HashSet<ArchetypeMasterInfo>();
	private Set<ArchetypeInfo> archetypes = new HashSet<ArchetypeInfo>();
	private boolean isRoot = true;
	private Set<ActionLogInfo> actionLogs = new HashSet<ActionLogInfo>();

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

	public Integer getLatestArchetypeId() {
		return latestArchetypeId;
	}

	public void setLatestArchetypeId(Integer latestArchetypeId) {
		this.latestArchetypeId = latestArchetypeId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLifecycleState() {
		return lifecycleState;
	}

	public void setLifecycleState(String lifecycleState) {
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

	public Set<ArchetypeInfo> getArchetypes() {
		return archetypes;
	}

	public Set<ActionLogInfo> getActionLogs() {
		return actionLogs;
	}

	public String getRmOriginator() {
		return rmOriginator;
	}

	public void setRmOriginator(String rmOrginator) {
		this.rmOriginator = rmOrginator;
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
