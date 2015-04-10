package edu.zju.bme.clever.management.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.TemplatePropertyType;
import edu.zju.bme.clever.management.service.entity.TemplateRevisionFile;
import edu.zju.bme.clever.management.service.entity.TemplateType;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.repository.TemplateMasterRepository;
import edu.zju.bme.clever.management.service.repository.TemplateRevisionFileRepository;

@Service
@Transactional(rollbackFor = { Exception.class })
public class StorageTemplateProviderServiceImpl {
	@Autowired
	private TemplateRevisionFileRepository templateFileRepo;
	@Autowired
	private TemplateMasterRepository TemplateMaster1Repo;

	public List<TemplateMaster> getAllStorageTemplateMaster1s() {
		return this.TemplateMaster1Repo
				.findByTemplateType(TemplateType.STORAGE);
	}

	public TemplateMaster getTemplateMaster1ById(Integer id) {
		return this.TemplateMaster1Repo.findOne(id);
	}

	public TemplateMaster getTemplateMaster1ByName(String name) {
		return this.TemplateMaster1Repo.findByName(name);
	}

	public TemplateRevisionFile getTemplateFileById(Integer templateId) {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findOne(templateId);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile;
	}

	public TemplateRevisionFile getTemplateFileByName(String templateName) {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile;
	}

	public List<TemplateRevisionFile> getTemplateFilesToApprove() {
		return this.templateFileRepo.findByTemplateTypeAndLifecycleState(
				TemplateType.STORAGE, LifecycleState.TEAMREVIEW);
	}

	public List<TemplateRevisionFile> getTemplateFilesToEdit(User user) {
		return this.templateFileRepo.findByTemplateTypeAndEditor(
				TemplateType.STORAGE, user);
	}

	public String getTemplateOetById(Integer templateId) {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findOne(templateId);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile.getOet();
	}

	public String getTemplateOetByName(String templateName) {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile.getOet();
	}

	public String getTemplateArmById(Integer templateId) {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findOne(templateId);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile.getPropertyValue(TemplatePropertyType.ARM);
	}

	public String getTemplateArmByName(String templateName) {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile.getPropertyValue(TemplatePropertyType.ARM);
	}

	private boolean isStorageTemplate(TemplateRevisionFile templateFile) {
		if (templateFile == null) {
			return false;
		}
		return templateFile.getTemplateType().equals(TemplateType.STORAGE);
	}

}
