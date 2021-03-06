package edu.zju.bme.clever.management.web.entity;

import java.util.Calendar;
import java.util.Set;

public class StorageTemplateInfo extends TemplateInfo {
	private String arm;
	private Set<EntityClassInfo> entityClasses;
	private StorageTemplateInfo lastTemplateFile;
	private Calendar lastModifyTime;
	
	public Set<EntityClassInfo> getEntityClasses() {
		return entityClasses;
	}

	public void setEntityClasses(Set<EntityClassInfo> entityClasses) {
		this.entityClasses = entityClasses;
	}

	public String getArm() {
		return arm;
	}

	public void setArm(String arm) {
		this.arm = arm;
	}

	public StorageTemplateInfo getLastTemplateFile() {
		return lastTemplateFile;
	}

	public void setLastTemplateFile(StorageTemplateInfo lastTemplateFile) {
		this.lastTemplateFile = lastTemplateFile;
	}

	public Calendar getLastModifyTime() {
		return lastModifyTime;
	}

	public void setLastModifyTime(Calendar lastModifyTime) {
		this.lastModifyTime = lastModifyTime;
	}
	

}
