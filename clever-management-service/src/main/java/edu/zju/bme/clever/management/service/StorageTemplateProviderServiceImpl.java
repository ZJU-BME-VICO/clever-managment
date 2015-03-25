package edu.zju.bme.clever.management.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.EntityClass;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.TemplateFile;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.TemplatePropertyType;
import edu.zju.bme.clever.management.service.entity.TemplateType;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.repository.TemplateFileRepository;
import edu.zju.bme.clever.management.service.repository.TemplateMasterRepository;

@Service
@Transactional(rollbackFor = { Exception.class })
public class StorageTemplateProviderServiceImpl implements
		StorageTemplateProviderService {
	@Autowired
	private TemplateFileRepository templateFileRepo;
	@Autowired
	private TemplateMasterRepository templateMasterRepo;

	@Override
	public List<TemplateMaster> getAllStorageTemplateMasters() {
		return this.templateMasterRepo.findAllStorageTemplateMasters();
	}

	@Override
	public TemplateMaster getTemplateMasterById(Integer id) {
		return this.templateMasterRepo.findOne(id);
	}

	@Override
	public TemplateMaster getTemplateMasterByName(String name) {
		return this.templateMasterRepo.findByName(name);
	}

	@Override
	public TemplateFile getTemplateFileById(Integer templateId) {
		TemplateFile templateFile = this.templateFileRepo.findOne(templateId);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile;
	}

	@Override
	public TemplateFile getTemplateFileByName(String templateName) {
		TemplateFile templateFile = this.templateFileRepo.findByName(templateName);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile;
	}

	@Override
	public List<TemplateFile> getTemplateFilesToApprove() {
		List<TemplateFile> tempateFiles = this.templateFileRepo
				.findByLifecycleState(LifecycleState.TEAMREVIEW);
		return tempateFiles.stream().filter(file -> this.isStorageTemplate(file))
				.collect(Collectors.toList());
	}

	@Override
	public List<TemplateFile> getTemplateFilesToEdit(User user) {
		List<TemplateFile> templateFiles = this.templateFileRepo.findToEdit(user);
		return templateFiles.stream().filter(file -> this.isStorageTemplate(file))
				.collect(Collectors.toList());
	}

	@Override
	public String getTemplateOetById(Integer templateId) {
		TemplateFile templateFile = this.templateFileRepo.findOne(templateId);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile.getContent();
	}

	@Override
	public String getTemplateOetByName(String templateName) {
		TemplateFile templateFile = this.templateFileRepo.findByName(templateName);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile.getContent();
	}

	@Override
	public String getTemplateArmById(Integer templateId) {
		TemplateFile templateFile = this.templateFileRepo.findOne(templateId);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile.getPropertyValue(TemplatePropertyType.ARM);
	}

	@Override
	public String getTemplateArmByName(String templateName) {
		TemplateFile templateFile = this.templateFileRepo.findByName(templateName);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile.getPropertyValue(TemplatePropertyType.ARM);
	}

	@Override
	public List<EntityClass> getTemplateEntityClassesById(Integer templateId) {
		TemplateFile templateFile = this.templateFileRepo.findOne(templateId);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile.getEntityClasses();
	}

	@Override
	public List<EntityClass> getTemplateEntityClassesByName(String templateName) {
		TemplateFile templateFile = this.templateFileRepo.findByName(templateName);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile.getEntityClasses();
	}

	private boolean isStorageTemplate(TemplateFile templateFile) {
		if (templateFile == null) {
			return false;
		}
		return templateFile.getTemplateType().equals(TemplateType.STORAGE);
	}

}
