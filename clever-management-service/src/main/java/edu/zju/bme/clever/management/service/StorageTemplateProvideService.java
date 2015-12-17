package edu.zju.bme.clever.management.service;

import java.io.OutputStream;
import java.util.List;
import java.util.Set;

import edu.zju.bme.clever.management.service.entity.EntityClassSource;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.TemplateRevisionFile;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.ResourceExportException;

public interface StorageTemplateProvideService {

	public Set<TemplateMaster> getAllStorageTemplateMasters();

	public TemplateMaster getTemplateMasterById(Integer id);

	public TemplateMaster getTemplateMasterByName(String name);

	public TemplateRevisionFile getTemplateFileById(Integer templateId);

	public TemplateRevisionFile getTemplateFileByName(String templateName);

	public List<TemplateRevisionFile> getTemplateFilesToVerify();

	public Set<TemplateRevisionFile> getDraftTemplateFilesToEdit(User user);
	
	public Set<TemplateRevisionFile> getLatestPublishedTemplateFilesToEdit();

	public String getTemplateOetById(Integer templateId);

	public String getTemplateOetByName(String templateName);

	public String getTemplateArmById(Integer templateId);

	public String getTemplateArmByName(String templateName);

	public void exportStorageTemplates(OutputStream out)
			throws ResourceExportException;
	
}