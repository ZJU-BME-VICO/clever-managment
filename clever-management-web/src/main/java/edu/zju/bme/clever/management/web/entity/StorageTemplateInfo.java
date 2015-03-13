package edu.zju.bme.clever.management.web.entity;

import java.util.Set;

public class StorageTemplateInfo extends TemplateInfo {
	private String arm;
	private Set<EntityClassInfo> entityClasses;

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

}
