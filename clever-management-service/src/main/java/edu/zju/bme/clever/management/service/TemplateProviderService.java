package edu.zju.bme.clever.management.service;

import edu.zju.bme.clever.management.service.entity.TemplateFile;

public interface TemplateProviderService {

	public TemplateFile getTemplateFileById(Integer templateId);

	public TemplateFile getTemplateFileByName(String templateName);

	public String getTemplateOetById(Integer templateId);

	public String getTemplateOetByName(String templateName);

	public String getTemplateArmById(Integer templateId);

	public String getTemplateArmByName(String templateName);

}