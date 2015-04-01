package edu.zju.bme.clever.management.service;

import java.util.List;

import edu.zju.bme.clever.management.service.entity.EntityClass;
import edu.zju.bme.clever.management.service.entity.TemplateFile;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.User;

public interface StorageTemplateProviderService {

	public List<TemplateMaster> getAllStorageTemplateMasters();

	public TemplateMaster getTemplateMasterById(Integer id);

	public TemplateMaster getTemplateMasterByName(String name);

	public TemplateFile getTemplateFileById(Integer templateId);

	public TemplateFile getTemplateFileByName(String templateName);
	
	public List<TemplateFile> getTemplateFilesToApprove();
	
	public List<TemplateFile> getTemplateFilesToEdit(User user);

	public String getTemplateOetById(Integer templateId);

	public String getTemplateOetByName(String templateName);

	public String getTemplateArmById(Integer templateId);

	public String getTemplateArmByName(String templateName);

	public List<EntityClass> getTemplateEntityClassesById(Integer templateId);

	public List<EntityClass> getTemplateEntityClassesByName(String templateName);

}