package edu.zju.bme.clever.management.service;

import java.util.List;

import edu.zju.bme.clever.management.service.entity.EntityClass;
import edu.zju.bme.clever.management.service.entity.TemplateFile;

public interface StorageTemplateProviderService {

	public TemplateFile getTemplateFileById(Integer templateId);

	public TemplateFile getTemplateFileByName(String templateName);

	public String getTemplateOetById(Integer templateId);

	public String getTemplateOetByName(String templateName);

	public String getTemplateArmById(Integer templateId);

	public String getTemplateArmByName(String templateName);

	public List<EntityClass> getTemplateEntityClassesById(Integer templateId);

	public List<EntityClass> getTemplateEntityClassesByName(String templateName);

}