package edu.zju.bme.clever.management.service.util;

import edu.zju.bme.clever.management.service.entity.TemplateFile;
import edu.zju.bme.clever.management.service.entity.TemplateType;

public abstract class AbstractTemplatePropertyHelper {
	protected TemplateFile template;

	public AbstractTemplatePropertyHelper(TemplateFile template,
			TemplateType type) {
		if (type.equals(template.getTemplateType())) {
			this.template = template;
		} else {
			throw new IllegalArgumentException("Not a " + type.getValue()
					+ " template.");
		}
	}

	protected String getProperty(String propertyName) {
		return this.template.getProperties().get(propertyName);
	}

	protected void setProperty(String propertyName, String value) {
		this.template.getProperties().put(propertyName, value);
	}

	public TemplateFile getTemplateFile() {
		return this.template;
	}
}
