package edu.zju.bme.clever.management.service.util;

import edu.zju.bme.clever.management.service.entity.TemplateFile;
import edu.zju.bme.clever.management.service.entity.TemplateType;

public class StorageTemplatePropertyHelper extends AbstractTemplatePropertyHelper {

	public StorageTemplatePropertyHelper(TemplateFile template) {
		super(template, TemplateType.Storage);
	}

	public String getArmConfig() {
		return this.getProperty("ArmConfig");
	}

	public void setArmConfig(String armConfig) {
		this.setProperty("ArmConfig", armConfig);
	}

}
