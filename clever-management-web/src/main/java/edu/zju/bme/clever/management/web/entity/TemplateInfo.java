package edu.zju.bme.clever.management.web.entity;

import java.util.List;

import edu.zju.bme.clever.management.service.entity.EntityClassSource;
import edu.zju.bme.clever.management.service.entity.LifecycleState;

public abstract class TemplateInfo extends AbstractFileInfo {
	
	private String oet;

	public String getOet() {
		return oet;
	}

	public void setOet(String oet) {
		this.oet = oet;
	}

}
