package edu.zju.bme.clever.management.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.EntityClassSource;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.TemplatePropertyType;
import edu.zju.bme.clever.management.service.entity.TemplateRevisionFile;
import edu.zju.bme.clever.management.service.entity.TemplateType;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.repository.EntityClassSourceRepository;
import edu.zju.bme.clever.management.service.repository.TemplateMasterRepository;
import edu.zju.bme.clever.management.service.repository.TemplateRevisionFileRepository;

@Service
@Transactional(rollbackFor = { Exception.class })
public class StorageTemplateProvideServiceImpl implements StorageTemplateProvideService {
	@Autowired
	private TemplateRevisionFileRepository templateFileRepo;
	@Autowired
	private TemplateMasterRepository TemplateMaster1Repo;
	@Autowired
	private EntityClassSourceRepository templateEntityClassRepo;

	@Override
	public List<TemplateMaster> getAllStorageTemplateMasters() {
		return this.TemplateMaster1Repo
				.findByTemplateType(TemplateType.STORAGE);
	}

	@Override
	public TemplateMaster getTemplateMasterById(Integer id) {
		return this.TemplateMaster1Repo.findOne(id);
	}

	@Override
	public TemplateMaster getTemplateMasterByName(String name) {
		return this.TemplateMaster1Repo.findByName(name);
	}

	@Override
	public TemplateRevisionFile getTemplateFileById(Integer templateId) {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findOne(templateId);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile;
	}

	@Override
	public TemplateRevisionFile getTemplateFileByName(String templateName) {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile;
	}

	@Override
	public List<TemplateRevisionFile> getTemplateFilesToVerify() {
		return this.templateFileRepo.findByTemplateTypeAndLifecycleState(
				TemplateType.STORAGE, LifecycleState.TEAMREVIEW);
	}

	@Override
	public List<TemplateRevisionFile> getDraftTemplateFilesToEdit(User user) {
		return this.templateFileRepo.findByTemplateTypeAndEditorAndLifecycleState(
				TemplateType.STORAGE, user, LifecycleState.DRAFT);
	}
	
	@Override
	public List<TemplateRevisionFile> getLatestPublishedTemplateFilesToEdit() {
		List<TemplateMaster> templateMaster = this.TemplateMaster1Repo
				.findByTemplateTypeAndLatestRevisionFileLifecycleState(
						TemplateType.STORAGE, LifecycleState.PUBLISHED);
		return templateMaster.stream().map(file -> file.getLatestRevisionFile())
				.collect(Collectors.toList());
	}

	@Override
	public String getTemplateOetById(Integer templateId) {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findOne(templateId);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile.getOet();
	}

	@Override
	public String getTemplateOetByName(String templateName) {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile.getOet();
	}

	@Override
	public String getTemplateArmById(Integer templateId) {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findOne(templateId);
		if (!this.isStorageTemplate(templateFile)) {
			return null;
		}
		return templateFile.getPropertyValue(TemplatePropertyType.ARM);
	}

	@Override
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

	@Override
	public List<EntityClassSource> getTemplateEntityClassesById(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<EntityClassSource> getTemplateEntityClassesByName(String name) {
		// TODO Auto-generated method stub
		return null;
	}
}
