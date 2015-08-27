package edu.zju.bme.clever.management.service;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.ArchetypeRevisionFile;
import edu.zju.bme.clever.management.service.entity.EntityClassSource;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.TemplatePropertyType;
import edu.zju.bme.clever.management.service.entity.TemplateRevisionFile;
import edu.zju.bme.clever.management.service.entity.TemplateType;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.ResourceExportException;
import edu.zju.bme.clever.management.service.repository.EntityClassSourceRepository;
import edu.zju.bme.clever.management.service.repository.TemplateMasterRepository;
import edu.zju.bme.clever.management.service.repository.TemplateRevisionFileRepository;

@Service
@Transactional(rollbackFor = { Exception.class })
public class StorageTemplateProvideServiceImpl implements
		StorageTemplateProvideService {

	private static final int BUFFER = 2048;

	@Autowired
	private TemplateRevisionFileRepository templateFileRepo;
	@Autowired
	private TemplateMasterRepository TemplateMasterRepo;
	@Autowired
	private EntityClassSourceRepository templateEntityClassRepo;

	@Override
	public void exportStorageTemplates(OutputStream out)
			throws ResourceExportException {
		try {
			ZipOutputStream zipOut = new ZipOutputStream(out);
			BufferedInputStream origin = null;
			InputStream in = null;
			ZipEntry entry = null;
			byte data[] = new byte[BUFFER];
			int count;
			for (TemplateRevisionFile file : this.templateFileRepo
					.findByTemplateTypeAndLifecycleStateFetchAll(
							TemplateType.STORAGE, LifecycleState.PUBLISHED)) {
				in = new ByteArrayInputStream(file.getOet().getBytes(
						StandardCharsets.UTF_8));
				origin = new BufferedInputStream(in, BUFFER);
				entry = new ZipEntry(file.getName() + ".oet");
				zipOut.putNextEntry(entry);
				while ((count = origin.read(data, 0, BUFFER)) != -1) {
					zipOut.write(data, 0, count);
				}
				origin.close();
				in = new ByteArrayInputStream(file.getPropertyValue(
						TemplatePropertyType.ARM).getBytes(
						StandardCharsets.UTF_8));
				origin = new BufferedInputStream(in, BUFFER);
				entry = new ZipEntry(file.getName() + ".arm");
				zipOut.putNextEntry(entry);
				while ((count = origin.read(data, 0, BUFFER)) != -1) {
					zipOut.write(data, 0, count);
				}
				origin.close();
			}
			zipOut.close();
		} catch (Exception ex) {
			throw new ResourceExportException(
					"Export storage templates failed.", ex);
		}
	}

	@Override
	public List<TemplateMaster> getAllStorageTemplateMasters() {
		return this.TemplateMasterRepo
				.findByTemplateTypeFetchRevisionFiles(TemplateType.STORAGE);
	}

	@Override
	public TemplateMaster getTemplateMasterById(Integer id) {
		return this.TemplateMasterRepo.findOne(id);
	}

	@Override
	public TemplateMaster getTemplateMasterByName(String name) {
		return this.TemplateMasterRepo.findByName(name);
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
		return this.templateFileRepo
				.findByTemplateTypeAndEditorAndLifecycleStateFetchAll(
						TemplateType.STORAGE, user, LifecycleState.DRAFT);
	}

	@Override
	public List<TemplateRevisionFile> getLatestPublishedTemplateFilesToEdit() {
		return this.templateFileRepo
				.findByTemplateTypeAndLifecycleStateFetchAll(
						TemplateType.STORAGE, LifecycleState.PUBLISHED);
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

}
