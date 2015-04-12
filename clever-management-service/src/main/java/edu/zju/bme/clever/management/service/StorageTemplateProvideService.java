package edu.zju.bme.clever.management.service;

import java.util.List;

import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.TemplateRevisionFile;
import edu.zju.bme.clever.management.service.entity.User;

public interface StorageTemplateProvideService {

	public List<TemplateMaster> getAllStorageTemplateMasters();

	public TemplateMaster getTemplateMasterById(Integer id);

	public TemplateMaster getTemplateMasterByName(String name);

	public TemplateRevisionFile getTemplateFileById(Integer templateId);

	public TemplateRevisionFile getTemplateFileByName(String templateName);

	public List<TemplateRevisionFile> getTemplateFilesToApprove();

	public List<TemplateRevisionFile> getTemplateFilesToEdit(User user);

	public String getTemplateOetById(Integer templateId);

	public String getTemplateOetByName(String templateName);

	public String getTemplateArmById(Integer templateId);

	public String getTemplateArmByName(String templateName);

}