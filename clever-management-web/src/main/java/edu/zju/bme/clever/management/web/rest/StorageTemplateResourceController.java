package edu.zju.bme.clever.management.web.rest;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.zju.bme.clever.management.service.StorageTemplateProviderService;
import edu.zju.bme.clever.management.service.entity.EntityClass;
import edu.zju.bme.clever.management.service.entity.TemplateFile;
import edu.zju.bme.clever.management.web.entity.EntityClassInfo;
import edu.zju.bme.clever.management.web.entity.StorageTemplateInfo;

@RestController
@RequestMapping("/templates/storage")
public class StorageTemplateResourceController extends
		AbstractResourceController {
	@Autowired
	private StorageTemplateProviderService storageTemplateProviderService;

	@RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
	public StorageTemplateInfo getTemplateById(@PathVariable int id) {
		TemplateFile templateFile = this.storageTemplateProviderService
				.getTemplateFileById(id);
		this.isResourcesNull(templateFile);
		return this.constructStorageTemplateInfo(templateFile);
	}

	@RequestMapping(value = "/name/{name}", method = RequestMethod.GET)
	public StorageTemplateInfo getTemplateByName(@PathVariable String name) {
		TemplateFile templateFile = this.storageTemplateProviderService
				.getTemplateFileByName(name);
		this.isResourcesNull(templateFile);
		return this.constructStorageTemplateInfo(templateFile);
	}

	@RequestMapping(value = "/id/{id}/oet", method = RequestMethod.GET)
	public String getTemplateOetById(@PathVariable int id) {
		String oet = this.storageTemplateProviderService.getTemplateOetById(id);
		this.isResourcesNull(oet);
		return oet;
	}

	@RequestMapping(value = "/id/{id}/arm", method = RequestMethod.GET)
	public String getTemplateArmById(@PathVariable int id) {
		String arm = this.storageTemplateProviderService.getTemplateArmById(id);
		this.isResourcesNull(arm);
		return arm;
	}

	@RequestMapping(value = "/name/{name}/oet", method = RequestMethod.GET)
	public String getTemplateOetByName(@PathVariable String name) {
		String oet = this.storageTemplateProviderService
				.getTemplateOetByName(name);
		this.isResourcesNull(oet);
		return oet;
	}

	@RequestMapping(value = "/name/{name}/arm", method = RequestMethod.GET)
	public String getTemplateArmByName(@PathVariable String name) {
		String arm = this.storageTemplateProviderService
				.getTemplateArmByName(name);
		this.isResourcesNull(arm);
		return arm;
	}

	@RequestMapping(value = "/id/{id}/classes", method = RequestMethod.GET)
	public List<EntityClassInfo> getTemplateEntityClassesById(
			@PathVariable int id) {
		List<EntityClass> entities = this.storageTemplateProviderService
				.getTemplateEntityClassesById(id);
		this.isResourcesNull(entities);
		return entities.stream().map(cls -> this.constructEntityClassInfo(cls))
				.collect(Collectors.toList());
	}

	@RequestMapping(value = "/name/{name}/classes", method = RequestMethod.GET)
	public List<EntityClassInfo> getTemplateEntityClassesByName(
			@PathVariable String name) {
		List<EntityClass> entities = this.storageTemplateProviderService
				.getTemplateEntityClassesByName(name);
		this.isResourcesNull(entities);
		return entities.stream().map(cls -> this.constructEntityClassInfo(cls))
				.collect(Collectors.toList());
	}

	private StorageTemplateInfo constructStorageTemplateInfo(
			TemplateFile templateFile) {
		StorageTemplateInfo info = new StorageTemplateInfo();
		info.setId(templateFile.getId());
		info.setName(templateFile.getName());
		info.setVersion(templateFile.getVersion());
		info.setSpecialiseArchetypeId(templateFile.getSpecialiseArchetypeId());
		info.setSource(templateFile.getSource());
		info.setContent(templateFile.getContent());
		info.setEditorId(templateFile.getEditor().getId());
		info.setEditorName(templateFile.getEditor().getName());
		info.setLifecycleState(templateFile.getLifecycleState());
		info.setEntityClasses(templateFile.getEntityClasses().stream()
				.map(cls -> this.constructEntityClassInfo(cls))
				.collect(Collectors.toList()));
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
