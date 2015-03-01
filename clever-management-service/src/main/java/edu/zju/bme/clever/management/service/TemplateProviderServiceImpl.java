package edu.zju.bme.clever.management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.TemplateFile;
import edu.zju.bme.clever.management.service.repository.TemplateFileRepository;
import edu.zju.bme.clever.management.service.repository.TemplateMasterRepository;

@Service
@Transactional(rollbackFor = { Exception.class })
public class TemplateProviderServiceImpl implements TemplateProviderService {
	@Autowired
	private TemplateFileRepository templateFileRepo;
	@Autowired
	private TemplateMasterRepository templateMasterRepo;

	private static final String ARM = "ArchetypeRelationshipMapping";

	@Override
	public TemplateFile getTemplateFileById(Integer templateId) {
		return this.templateFileRepo.findOne(templateId);
	}

	@Override
	public TemplateFile getTemplateFileByName(String templateName) {
		return this.templateFileRepo.findByName(templateName);
	}

	@Override
	public String getTemplateOetById(Integer templateId) {
		return this.templateFileRepo.findOne(templateId).getContent();
	}

	@Override
	public String getTemplateOetByName(String templateName) {
		return this.templateFileRepo.findByName(templateName).getContent();
	}

	@Override
	public String getTemplateArmById(Integer templateId) {
		return this.templateFileRepo.findOne(templateId).getPropertyValue(ARM);
	}

	@Override
	public String getTemplateArmByName(String templateName) {
		return this.templateFileRepo.findByName(templateName).getPropertyValue(
				ARM);
	}

}
