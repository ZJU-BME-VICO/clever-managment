package edu.zju.bme.clever.management.web.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.zju.bme.clever.management.service.StorageTemplateProviderService;
import edu.zju.bme.clever.management.service.StorageTemplateValidateService;
import edu.zju.bme.clever.management.service.StorageTemplateVersionControlService;
import edu.zju.bme.clever.management.service.UserService;
import edu.zju.bme.clever.management.service.entity.FileProcessResult.FileStatus;
import edu.zju.bme.clever.management.service.entity.EntityClass;
import edu.zju.bme.clever.management.service.entity.FileProcessResult;
import edu.zju.bme.clever.management.service.entity.SourceType;
import edu.zju.bme.clever.management.service.entity.TemplateFile;
import edu.zju.bme.clever.management.service.entity.TemplatePropertyType;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.VersionControlException;
import edu.zju.bme.clever.management.web.entity.EntityClassInfo;
import edu.zju.bme.clever.management.web.entity.FileUploadResult;
import edu.zju.bme.clever.management.web.entity.StorageTemplateInfo;
import edu.zju.bme.clever.management.web.entity.StorageTemplateMasterInfo;
import edu.zju.bme.clever.management.web.entity.TemplateInfo;
import edu.zju.bme.clever.management.web.entity.UploadedStorageTemplate;

@RestController
@RequestMapping("/templates/storage")
public class StorageTemplateResourceController extends
		AbstractResourceController {
	@Autowired
	private StorageTemplateProviderService providerService;
	@Autowired
	private StorageTemplateVersionControlService versionControlService;
	@Autowired
	private StorageTemplateValidateService validateService;
	@Autowired
	private UserService userService;

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public List<StorageTemplateMasterInfo> getStorageTemplateMasterList() {
		return this.providerService
				.getAllStorageTemplateMasters()
				.stream()
				.map(master -> {
					StorageTemplateMasterInfo info = new StorageTemplateMasterInfo();
					info.setId(master.getId());
					info.setConceptName(master.getConceptName());
					info.setName(master.getName());
					info.setLatestTemplateVersion(master.getLatestFileVersion());
					info.setLifecycleState(master.getLatestFileLifecycleState()
							.getValue());
					return info;
				}).collect(Collectors.toList());
	}

	@RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
	public TemplateInfo getTemplateById(@PathVariable int id) {
		TemplateFile templateFile = this.providerService
				.getTemplateFileById(id);
		this.isResourcesNull(templateFile);
		return this.constructStorageTemplateInfo(templateFile);
	}

	@RequestMapping(value = "/name/{name}", method = RequestMethod.GET)
	public TemplateInfo getTemplateByName(@PathVariable String name) {
		TemplateFile templateFile = this.providerService
				.getTemplateFileByName(name);
		this.isResourcesNull(templateFile);
		return this.constructStorageTemplateInfo(templateFile);
	}

	@RequestMapping(value = "/id/{id}/oet", method = RequestMethod.GET)
	public String getTemplateOetById(@PathVariable int id) {
		String oet = this.providerService.getTemplateOetById(id);
		this.isResourcesNull(oet);
		return oet;
	}

	@RequestMapping(value = "/id/{id}/arm", method = RequestMethod.GET)
	public String getTemplateArmById(@PathVariable int id) {
		String arm = this.providerService.getTemplateArmById(id);
		this.isResourcesNull(arm);
		return arm;
	}

	@RequestMapping(value = "/name/{name}/oet", method = RequestMethod.GET)
	public String getTemplateOetByName(@PathVariable String name) {
		String oet = this.providerService.getTemplateOetByName(name);
		this.isResourcesNull(oet);
		return oet;
	}

	@RequestMapping(value = "/name/{name}/arm", method = RequestMethod.GET)
	public String getTemplateArmByName(@PathVariable String name) {
		String arm = this.providerService.getTemplateArmByName(name);
		this.isResourcesNull(arm);
		return arm;
	}

	@RequestMapping(value = "/id/{id}/classes", method = RequestMethod.GET)
	public List<EntityClassInfo> getTemplateEntityClassesById(
			@PathVariable int id) {
		List<EntityClass> entities = this.providerService
				.getTemplateEntityClassesById(id);
		this.isResourcesNull(entities);
		return entities.stream().map(cls -> this.constructEntityClassInfo(cls))
				.collect(Collectors.toList());
	}

	@RequestMapping(value = "/name/{name}/classes", method = RequestMethod.GET)
	public List<EntityClassInfo> getTemplateEntityClassesByName(
			@PathVariable String name) {
		List<EntityClass> entities = this.providerService
				.getTemplateEntityClassesByName(name);
		this.isResourcesNull(entities);
		return entities.stream().map(cls -> this.constructEntityClassInfo(cls))
				.collect(Collectors.toList());
	}

	@RequestMapping(value = "/action/validate", method = RequestMethod.POST)
	@ResponseBody
	public FileProcessResult validateTemplate(UploadedStorageTemplate template) {
		try {
			return this.validateService.validateConsistency(template.getOet()
					.getInputStream(), template.getArm().getInputStream());
		} catch (IOException e) {
			FileProcessResult result = new FileProcessResult();
			result.setStatus(FileStatus.INVALID);
			return result;
		}
	}

	@RequestMapping(value = "/action/upload", method = RequestMethod.POST)
	@ResponseBody
	public FileUploadResult uploadTemplates(
			@RequestParam(value = "count", required = true) int count,
			@RequestParam(value = "oets", required = true) MultipartFile[] oets,
			@RequestParam(value = "arms", required = true) MultipartFile[] arms,
			Authentication authentication) {
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		if (oets.length != count || arms.length != count) {
			result.setSucceeded(false);
			result.setMessage("OET's count and ARM's count does not match.");
		}
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		User user = this.userService.getUserByName(userName);
		try {
			for (int i = 0; i < count; i++) {
				this.versionControlService.createOrUpgradeTemplate(
						oets[i].getInputStream(), arms[i].getInputStream(),
						SourceType.CLEVER, user);
			}
		} catch (VersionControlException | IOException ex) {
			result.setSucceeded(false);
			result.setMessage(ex.getMessage());
		}
		return result;
	}

	private StorageTemplateInfo constructStorageTemplateInfo(
			TemplateFile templateFile) {
		StorageTemplateInfo info = new StorageTemplateInfo();
		info.setId(templateFile.getId());
		info.setName(templateFile.getName());
		info.setVersion(templateFile.getVersion());
		info.setSpecialiseArchetypeId(templateFile.getSpecialiseArchetypeId());
		info.setSource(templateFile.getSource().getValue());
		info.setContent(templateFile.getContent());
		info.setArm(templateFile.getPropertyValue(TemplatePropertyType.ARM));
		info.setEditorId(templateFile.getEditor().getId());
		info.setEditorName(templateFile.getEditor().getName());
		info.setLifecycleState(templateFile.getLifecycleState().getValue());
		info.setEntityClasses(templateFile.getEntityClasses().stream()
				.map(cls -> this.constructEntityClassInfo(cls))
				.collect(Collectors.toSet()));
		return info;
	}

	private EntityClassInfo constructEntityClassInfo(EntityClass entityClass) {
		EntityClassInfo info = new EntityClassInfo();
		info.setName(entityClass.getName());
		info.setFullName(entityClass.getFullName());
		info.setEntityId(entityClass.getEntityId());
		info.setPackageName(entityClass.getPackageName());
		info.setContent(entityClass.getContent());
		return info;
	}

}
