package edu.zju.bme.clever.management.web.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.zju.bme.clever.commons.rest.RestClient;
import edu.zju.bme.clever.management.service.StorageTemplateProvideService;
import edu.zju.bme.clever.management.service.StorageTemplateValidateService;
import edu.zju.bme.clever.management.service.StorageTemplateVersionControlService;
import edu.zju.bme.clever.management.service.UserService;
import edu.zju.bme.clever.management.service.entity.EntityClassSource;
import edu.zju.bme.clever.management.service.entity.FileProcessResult;
import edu.zju.bme.clever.management.service.entity.FileProcessResult.FileStatus;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.TemplatePropertyType;
import edu.zju.bme.clever.management.service.entity.TemplateRevisionFile;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.VersionControlException;
import edu.zju.bme.clever.management.web.entity.ActionLogInfo;
import edu.zju.bme.clever.management.web.entity.ArchetypeInfo;
import edu.zju.bme.clever.management.web.entity.ArchetypeVersionMasterInfo;
import edu.zju.bme.clever.management.web.entity.DeployConfiguration;
import edu.zju.bme.clever.management.web.entity.EntityClassInfo;
import edu.zju.bme.clever.management.web.entity.FileUploadResult;
import edu.zju.bme.clever.management.web.entity.StorageTemplateInfo;
import edu.zju.bme.clever.management.web.entity.StorageTemplateMasterInfo;
import edu.zju.bme.clever.management.web.entity.UploadedStorageTemplate;

@RestController
@RequestMapping("/templates/storage")
public class StorageTemplateResourceController extends
		AbstractResourceController {
	@Autowired
	private StorageTemplateProvideService providerService;
	@Autowired
	private StorageTemplateVersionControlService versionControlService;
	@Autowired
	private StorageTemplateValidateService validateService;
	@Autowired
	private UserService userService;
	@Autowired
	private RestClient restClient;

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
					info.setLatestTemplateVersion(master
							.getLatestRevisionFileVersion());
					info.setLifecycleState(master
							.getLatestRevisionFileLifecycleState().getValue());
					return info;
				}).collect(Collectors.toList());
	}

	@RequestMapping(value = "/master/id/{id}", method = RequestMethod.GET)
	public StorageTemplateMasterInfo getStorageTemplateMasterById(
			@PathVariable int id) {
		TemplateMaster master = this.providerService.getTemplateMasterById(id);
		this.isResourcesNull(master);
		return this.constructStorageTemplateMasterInfo(master);
	}

	@RequestMapping(value = "/master/name/{name}", method = RequestMethod.GET)
	public StorageTemplateMasterInfo getStorageTemplateMasterByName(
			@PathVariable String name) {
		TemplateMaster master = this.providerService
				.getTemplateMasterByName(name);
		this.isResourcesNull(master);
		return this.constructStorageTemplateMasterInfo(master);
	}

	@RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
	public StorageTemplateInfo getTemplateById(@PathVariable int id) {
		TemplateRevisionFile templateFile = this.providerService
				.getTemplateFileById(id);
		this.isResourcesNull(templateFile);
		return this.constructStorageTemplateInfo(templateFile);
	}

	@RequestMapping(value = "/name/{name}", method = RequestMethod.GET)
	public StorageTemplateInfo getTemplateByName(@PathVariable String name) {
		TemplateRevisionFile templateFile = this.providerService
				.getTemplateFileByName(name);
		this.isResourcesNull(templateFile);
		return this.constructStorageTemplateInfo(templateFile);
	}

	@RequestMapping(value = "/list/edit/draft", method = RequestMethod.GET)
	public List<StorageTemplateInfo> getTemplateListToEdit(
			Authentication authentication) {
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		User user = userService.getUserByName(userName);
		List<TemplateRevisionFile> templateFiles = this.providerService
				.getDraftTemplateFilesToEdit(user);
		this.isResourcesNull(templateFiles);
		return templateFiles.stream()
				.map(file -> this.constructStorageTemplateInfo(file))
				.collect(Collectors.toList());
	}

	@RequestMapping(value = "/list/edit/published", method = RequestMethod.GET)
	public List<StorageTemplateInfo> getTemplateListToEdit() {
		List<TemplateRevisionFile> templateFiles = this.providerService
				.getLatestPublishedTemplateFilesToEdit();
		this.isResourcesNull(templateFiles);
		return templateFiles.stream()
				.map(file -> this.constructStorageTemplateInfo(file))
				.collect(Collectors.toList());
	}

	@RequestMapping(value = "/list/verify", method = RequestMethod.GET)
	public List<StorageTemplateInfo> getTemplateFilesToApprove(
			Authentication authentication) {
		// Validate user authority

		List<TemplateRevisionFile> TemplateFiles = this.providerService
				.getTemplateFilesToVerify();
		this.isResourcesNull(TemplateFiles);
		return TemplateFiles.stream()
				.map(file -> this.constructStorageTemplateInfo(file))
				.collect(Collectors.toList());
	}

	@RequestMapping(value = "/list/deploy", method = RequestMethod.GET)
	public List<StorageTemplateMasterInfo> getStorageMasterListToDeploy(
			Authentication authentication) {
		// Validate user authority

		List<TemplateMaster> masters = this.providerService
				.getAllStorageTemplateMasters();
		return masters
				.stream()
				.map(master -> {
					StorageTemplateMasterInfo masterInfo = new StorageTemplateMasterInfo();
					masterInfo.setId(master.getId());
					masterInfo.setName(master.getName());
					master.getRevisionFiles()
							.stream()
							.filter(file -> file.getLifecycleState().equals(
									LifecycleState.PUBLISHED))
							.forEach(
									file -> {
										StorageTemplateInfo templateInfo = new StorageTemplateInfo();
										templateInfo.setId(file.getId());
										templateInfo.setName(file.getName());
										templateInfo.setOet(file.getOet());
										templateInfo.setArm(file
												.getPropertyValue(TemplatePropertyType.ARM));
										templateInfo.setVersion(file
												.getVersion());
										templateInfo.setSerialVersion(file
												.getSerialVersion());
										masterInfo.getTemplates().add(
												templateInfo);
									});
					return masterInfo;
				}).filter(info -> info.getTemplates().size() > 0)
				.collect(Collectors.toList());
	}

	@RequestMapping(value = "/action/deploy", method = RequestMethod.POST)
	public FileUploadResult deplyTemplates(
			@RequestBody DeployConfiguration config,
			Authentication authentication) {
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		config.setUserName(userName);
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		try {
			result = this.restClient.post("/cdr/deploy", config,
					FileUploadResult.class);
		} catch (Exception ex) {
			result.setSucceeded(false);
			result.setMessage("Deploy failed, error: " + ex.getMessage());
		}
		return result;
	}

	@RequestMapping(value = "/list/deployed", method = RequestMethod.GET)
	public List<String> getDeployedTemplates() {
		List<String> result = new ArrayList<String>();
		try {
			result = this.restClient.get("/cdr/deployedTemplates", List.class);
		} catch (Exception ex) {
			this.logger.debug("Get deployed template list failed.", ex);
		}
		return result;
	}

	@RequestMapping(value = "/action/submit/id/{id}", method = RequestMethod.GET)
	public FileUploadResult sumbmitTemplateFile(@PathVariable int id,
			Authentication authentication) {
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		User user = this.userService.getUserByName(userName);
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		try {
			this.versionControlService.submitTemplate(id, user);
		} catch (VersionControlException e) {
			result.setMessage(e.getMessage());
			result.setSucceeded(false);
		}
		return result;
	}

	@RequestMapping(value = "/action/edit/id/{id}", method = RequestMethod.POST)
	public FileUploadResult editTemplateFile(@PathVariable int id,
			@RequestBody StorageTemplateInfo templateInfo,
			Authentication authentication) {
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		User user = this.userService.getUserByName(userName);
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		try {
			this.versionControlService.editTemplate(templateInfo.getId(),
					templateInfo.getOet(), templateInfo.getArm(), user);
		} catch (VersionControlException ex) {
			result.setSucceeded(false);
			result.setMessage("Edit template " + templateInfo.getName()
					+ " failed, error: " + ex.getMessage());
		}
		return result;
	}

	@RequestMapping(value = "/action/approve/id/{id}", method = RequestMethod.GET)
	public FileUploadResult approveTemplateFile(@PathVariable int id,
			Authentication authentication) {
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		User user = this.userService.getUserByName(userName);
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		try {
			this.versionControlService.approveTemplate(id, user);
		} catch (VersionControlException e) {
			result.setMessage(e.getMessage());
			result.setSucceeded(false);
		}
		return result;
	}

	@RequestMapping(value = "/action/reject/id/{id}", method = RequestMethod.GET)
	public FileUploadResult rejectTemplateFile(@PathVariable int id,
			Authentication authentication) {
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		User user = this.userService.getUserByName(userName);
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		try {
			this.versionControlService.rejectTemplate(id, user);
		} catch (VersionControlException e) {
			result.setMessage(e.getMessage());
			result.setSucceeded(false);
		}
		return result;
	}

	@RequestMapping(value = "/action/remove/id/{id}", method = RequestMethod.GET)
	public FileUploadResult removeTemplateFile(@PathVariable int id,
			Authentication authentication) {
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		User user = this.userService.getUserByName(userName);
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		try {
			this.versionControlService.rejectAndRemoveTemplate(id, user);
		} catch (VersionControlException e) {
			result.setMessage(e.getMessage());
			result.setSucceeded(false);
		}
		return result;
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

	//
	// @RequestMapping(value = "/id/{id}/classes", method = RequestMethod.GET)
	// public List<EntityClassInfo> getTemplateEntityClassesById(@PathVariable
	// int id) {
	// List<EntityClassSource> entities = this.providerService
	// .getTemplateEntityClassesById(id);
	// this.isResourcesNull(entities);
	// return entities.stream().map(cls -> this.constructEntityClassInfo(cls))
	// .collect(Collectors.toList());
	// }
	//
	// @RequestMapping(value = "/name/{name}/classes", method =
	// RequestMethod.GET)
	// public List<EntityClassInfo> getTemplateEntityClassesByName(
	// @PathVariable String name) {
	// List<EntityClass> entities = this.providerService
	// .getTemplateEntityClassesByName(name);
	// this.isResourcesNull(entities);
	// return entities.stream().map(cls -> this.constructEntityClassInfo(cls))
	// .collect(Collectors.toList());
	// }

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
				this.versionControlService.acceptNewTemplate(
						oets[i].getInputStream(), arms[i].getInputStream(),
						user);
			}
		} catch (VersionControlException | IOException ex) {
			result.setSucceeded(false);
			result.setMessage(ex.getMessage());
		}
		return result;
	}

	private StorageTemplateMasterInfo constructStorageTemplateMasterInfo(
			TemplateMaster templateMaster) {
		StorageTemplateMasterInfo masterInfo = new StorageTemplateMasterInfo();
		// Set template master info
		masterInfo.setId(templateMaster.getId());
		masterInfo.setName(templateMaster.getName());
		masterInfo.setRmEntity(templateMaster.getRmEntity());
		masterInfo.setRmName(templateMaster.getRmName());
		masterInfo.setRmOriginator(templateMaster.getRmOrginator());
		masterInfo.setConceptName(templateMaster.getConceptName());
		masterInfo
				.setConceptDescription(templateMaster.getConceptDescription());
		masterInfo.setKeywords(templateMaster.getKeywords());
		masterInfo.setPurpose(templateMaster.getPurpose());
		masterInfo.setUse(templateMaster.getUse());
		masterInfo.setMisuse(templateMaster.getMisuse());
		masterInfo.setCopyright(templateMaster.getCopyright());
		masterInfo.setLifecycleState(templateMaster
				.getLatestRevisionFileLifecycleState().getValue());
		// Add specialise archetype master
		Optional.ofNullable(
				templateMaster.getSpecialiseArchetypeVersionMaster())
				.ifPresent(
						archetypeVersionMaster -> {
							ArchetypeVersionMasterInfo info = new ArchetypeVersionMasterInfo();
							info.setId(archetypeVersionMaster.getId());
							info.setName(archetypeVersionMaster.getName());
							info.setLatestArchetypeVersion(archetypeVersionMaster
									.getLatestRevisionFileVersion());
							info.setLatestArchetypeId(archetypeVersionMaster
									.getLatestRevisionFile().getId());
							masterInfo
									.setSpecialiseArchetypeVersionMaster(info);
						});
		// Add templates
		templateMaster.getRevisionFiles().forEach(template -> {
			StorageTemplateInfo info = new StorageTemplateInfo();
			info.setId(template.getId());
			info.setName(template.getName());
			info.setSerialVersion(template.getSerialVersion());
			info.setVersion(template.getVersion());
			masterInfo.getTemplates().add(info);
		});
		// Add action logs
		templateMaster.getActionLogs().forEach(log -> {
			ActionLogInfo info = new ActionLogInfo();
			info.setId(log.getId());
			info.setAction(log.getActionType().getValue());
			info.setVersion(log.getVersion());
			info.setRecordTime(log.getRecordTime());
			info.setOperatorName(log.getOperatorName());
			info.setLifecycleState(log.getLifecycleState().getValue());
			masterInfo.getActionLogs().add(info);
		});
		masterInfo.getActionLogs().sort(
				(log1, log2) -> log1.getId() - log2.getId());
		return masterInfo;
	}

	private StorageTemplateInfo constructStorageTemplateInfo(
			TemplateRevisionFile templateFile) {
		StorageTemplateInfo info = new StorageTemplateInfo();
		info.setId(templateFile.getId());
		info.setName(templateFile.getName());
		// info.setRmEntity(templateFile.getTemplateMaster().getRmEntity());
		info.setVersion(templateFile.getVersion());
		info.setSerialVersion(templateFile.getSerialVersion());
		info.setOet(templateFile.getOet());
		info.setArm(templateFile.getPropertyValue(TemplatePropertyType.ARM));
		info.setVersionMasterId(templateFile.getTemplateMasterId());
		info.setVersionMasterName(templateFile.getName().substring(0,
				templateFile.getName().lastIndexOf(".")));
		info.setEditorId(templateFile.getEditor().getId());
		info.setEditorName(templateFile.getEditor().getName());
		info.setLifecycleState(templateFile.getLifecycleState().getValue());
		// Set last template file
		Optional.ofNullable(templateFile.getLastRevisionFile()).ifPresent(
				lastTemplate -> {
					StorageTemplateInfo lastInfo = new StorageTemplateInfo();
					lastInfo.setOet(lastTemplate.getOet());
					info.setLastTemplateFile(lastInfo);
				});
		// Set specialise archetyep info
		ArchetypeInfo specialiseInfo = new ArchetypeInfo();
		specialiseInfo.setId(templateFile
				.getSpecialiseArchetypeRevisionFileId());
		specialiseInfo.setName(templateFile
				.getSpecialiseArchetypeRevisionFileName());
		info.setSpecialiseArchetype(specialiseInfo);
		// Set entity classes
		// info.setEntityClasses(templateFile.getEntityClasses().stream()
		// .map(cls -> this.constructEntityClassInfo(cls))
		// .collect(Collectors.toSet()));
		return info;
	}

	private EntityClassInfo constructEntityClassInfo(
			EntityClassSource entityClass) {
		EntityClassInfo info = new EntityClassInfo();
		info.setName(entityClass.getName());
		info.setFullName(entityClass.getFullName());
		info.setEntityId(entityClass.getEntityId());
		info.setPackageName(entityClass.getPackageName());
		info.setContent(entityClass.getContent());
		return info;
	}

}
