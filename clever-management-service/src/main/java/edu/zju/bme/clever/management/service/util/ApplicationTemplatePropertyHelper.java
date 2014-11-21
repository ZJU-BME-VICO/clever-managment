package edu.zju.bme.clever.management.service.util;

import edu.zju.bme.clever.management.service.entity.TemplateFile;
import edu.zju.bme.clever.management.service.entity.TemplateType;

public class ApplicationTemplatePropertyHelper extends
		AbstractTemplatePropertyHelper {

	public ApplicationTemplatePropertyHelper(TemplateFile template) {
		super(template, TemplateType.Application);
	}

	public String getUiConfig() {
		return this.getProperty("UiConfig");
	}

	public void setUiConfig(String uiConfig) {
		this.setProperty("UiConfig", uiConfig);
	}
}
