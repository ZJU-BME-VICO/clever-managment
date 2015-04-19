package edu.zju.bme.clever.management.web.entity;

import java.util.HashSet;
import java.util.Set;

public class StorageTemplateMasterInfo extends AbstractMasterInfo {

	private Integer latestTemplateId;
	private String latestTemplateVersion;
	private Set<StorageTemplateInfo> templates = new HashSet<StorageTemplateInfo>();
	private ArchetypeVersionMasterInfo specialiseArchetypeVersionMaster = new ArchetypeVersionMasterInfo();

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

	public Set<StorageTemplateInfo> getTemplates() {
		return templates;
	}

	public void setTemplates(Set<StorageTemplateInfo> templates) {
		this.templates = templates;
	}

	public ArchetypeVersionMasterInfo getSpecialiseArchetypeVersionMaster() {
		return specialiseArchetypeVersionMaster;
	}

	public void setSpecialiseArchetypeVersionMaster(
			ArchetypeVersionMasterInfo specialiseArchetypeVersionMaster) {
		this.specialiseArchetypeVersionMaster = specialiseArchetypeVersionMaster;
	}

}