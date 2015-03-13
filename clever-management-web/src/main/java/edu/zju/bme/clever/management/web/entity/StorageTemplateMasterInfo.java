package edu.zju.bme.clever.management.web.entity;

import java.util.HashSet;
import java.util.Set;

public class StorageTemplateMasterInfo {
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
	private Integer latestTemplateId;
	private String latestTemplateVersion;
	private String name;
	private String lifecycleState;
	private Set<StorageTemplateInfo> templates = new HashSet<StorageTemplateInfo>();
	private Set<ActionLogInfo> actionLogs = new HashSet<ActionLogInfo>();
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

	public String getRmOriginator() {
		return rmOriginator;
	}

	public void setRmOriginator(String rmOriginator) {
		this.rmOriginator = rmOriginator;
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

	public Integer getLatestTemplateId() {
		return latestTemplateId;
	}

	public void setLatestTemplateId(Integer latestTemplateId) {
		this.latestTemplateId = latestTemplateId;
	}

	public String getLatestTemplateVersion() {
		return latestTemplateVersion;
	}

	public void setLatestTemplateVersion(String latestTemplateVersion) {
		this.latestTemplateVersion = latestTemplateVersion;
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

	public Set<StorageTemplateInfo> getTemplates() {
		return templates;
	}

	public void setTemplates(Set<StorageTemplateInfo> templates) {
		this.templates = templates;
	}

	public Set<ActionLogInfo> getActionLogs() {
		return actionLogs;
	}

	public void setActionLogs(Set<ActionLogInfo> actionLogs) {
		this.actionLogs = actionLogs;
	}

	public boolean isRoot() {
		return isRoot;
	}

	public void setRoot(boolean isRoot) {
		this.isRoot = isRoot;
	}

}