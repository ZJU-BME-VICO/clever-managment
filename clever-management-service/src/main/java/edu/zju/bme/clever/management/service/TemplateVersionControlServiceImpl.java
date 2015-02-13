package edu.zju.bme.clever.management.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import openEHR.v1.template.RESOURCEDESCRIPTIONITEM;
import openEHR.v1.template.TemplateDocument;

import org.openehr.am.archetype.Archetype;
import org.openehr.am.template.OETParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import se.acode.openehr.parser.ADLParser;
import edu.zju.bme.clever.cdr.arm.parser.ArmParser;
import edu.zju.bme.clever.cdr.generator.EntityClassGenerateOption;
import edu.zju.bme.clever.cdr.generator.EntityClassGenerator;
import edu.zju.bme.clever.cdr.generator.cls.JavaClass;
import edu.zju.bme.clever.cdr.generator.exception.EntityClassGenerateException;
import edu.zju.bme.clever.management.service.entity.AbstractFile.SourceType;
import edu.zju.bme.clever.management.service.entity.ActionType;
import edu.zju.bme.clever.management.service.entity.ArchetypeFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.EntityClass;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.TemplateActionLog;
import edu.zju.bme.clever.management.service.entity.TemplateFile;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.TemplateType;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.VersionControlException;
import edu.zju.bme.clever.management.service.repository.ArchetypeFileRepository;
import edu.zju.bme.clever.management.service.repository.EntityClassRepository;
import edu.zju.bme.clever.management.service.repository.TemplateActionLogRepository;
import edu.zju.bme.clever.management.service.repository.TemplateFileRepository;
import edu.zju.bme.clever.management.service.repository.TemplateMasterRepository;
import edu.zju.bme.clever.schemas.ArchetypeRelationshipMappingDocument;

@Service
@Transactional
public class TemplateVersionControlServiceImpl {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private EntityClassRepository entityClassRepo;
	@Autowired
	private TemplateFileRepository templateFileRepo;
	@Autowired
	private TemplateMasterRepository templateMasterRepo;
	@Autowired
	private ArchetypeFileRepository archetypeFileRepo;
	@Autowired
	private TemplateActionLogRepository templateActionLogRepo;
	@Autowired
	private EntityClassGenerator generator;

	private static final String ARM = "ArchetypeRelationshipMapping";

	public void createOrUpgradeTemplate(TemplateDocument oet,
			ArchetypeRelationshipMappingDocument arm, SourceType source,
			User user) throws VersionControlException {
		// Validate user authority

		// Get specialize archetype
		String specialiseArchetypeId = oet.getTemplate().getDefinition()
				.getArchetypeId();
		ArchetypeFile specialiseArchetypeFile = this.archetypeFileRepo
				.findByName(specialiseArchetypeId);
		if (specialiseArchetypeFile == null) {
			throw new VersionControlException(
					"Cannot find specialise archetype: "
							+ specialiseArchetypeId);
		}
		// Get template master
		String templateName = oet.getTemplate().getName();
		String masterName = templateName.substring(0,
				templateName.lastIndexOf(".v"));
		TemplateMaster templateMaster = this.templateMasterRepo
				.findByName(masterName);
		if (templateMaster == null) {
			templateMaster = this.constructTemplateMaster(oet,
					specialiseArchetypeFile);
		}
		// Construct template file
		TemplateFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (templateFile != null) {
			throw new VersionControlException("Tempalte " + templateName
					+ " already exists.");
		}
		templateFile = this.constructTemplateFile(templateMaster,
				specialiseArchetypeFile, oet, arm, source, user);
		// Validate version and set internal version
		Optional<TemplateFile> latestTemplate = Optional
				.ofNullable(templateMaster.getLatestFile());
		if (latestTemplate.isPresent()) {
			Integer nextInternalVersion = latestTemplate.get()
					.getInternalVersion() + 1;
			Integer latestTemplateSpecialiseArchetypeInternalVersion = latestTemplate
					.get().getSpecialiseArchetypeInternalVersion();
			Integer currentSpecialiseArchetypeInternalVersion = specialiseArchetypeFile
					.getInternalVersion();
			// Validate template sub version
			if (currentSpecialiseArchetypeInternalVersion > latestTemplateSpecialiseArchetypeInternalVersion) {
				if (templateFile.getVersion().equals(
						specialiseArchetypeFile.getVersion() + ".1")) {
					throw new VersionControlException(
							"Template version should be "
									+ specialiseArchetypeFile.getVersion()
									+ ".1");
				}
				templateFile.setSubVersion(1);
			} else if (currentSpecialiseArchetypeInternalVersion == latestTemplateSpecialiseArchetypeInternalVersion) {
				Integer nextSubVersion = latestTemplate.get().getSubVersion() + 1;
				if (templateFile.getVersion().equals(
						specialiseArchetypeFile.getVersion() + "."
								+ nextSubVersion)) {
					throw new VersionControlException(
							"Template version should be "
									+ specialiseArchetypeFile.getVersion()
									+ "." + nextSubVersion);
				}
				templateFile.setSubVersion(nextSubVersion);
			} else if (currentSpecialiseArchetypeInternalVersion < latestTemplateSpecialiseArchetypeInternalVersion) {
				throw new VersionControlException(
						"Specialise archetype version must be later than "
								+ latestTemplate.get()
										.getSpecialiseArchetypeVersion());
			}
			templateFile.setLastVersionTemplate(latestTemplate.get());
			templateFile.setInternalVersion(nextInternalVersion);
			// Validate lifecycle state
			if (!latestTemplate.get().getLifecycleState()
					.equals(LifecycleState.Published)) {
				throw new VersionControlException(
						"Illeagal action Create for template "
								+ templateFile.getName()
								+ " because the last version template's lifecycle state is "
								+ latestTemplate.get().getLifecycleState()
								+ " instead of Published.");
			}
		} else {
			if (!templateFile.getVersion().equals(
					specialiseArchetypeFile.getVersion() + ".1")) {
				throw new VersionControlException("Template "
						+ templateFile.getName() + "'s version should be "
						+ specialiseArchetypeFile.getVersion() + ".1");
			}
			templateFile.setInternalVersion(1);
			templateFile.setSubVersion(1);
		}
		// Set lifecycle state
		templateFile.setLifecycleState(LifecycleState.Draft);
		// Save template file and master
		this.templateFileRepo.save(templateFile);
		templateMaster.setLatestFile(templateFile);
		templateMaster.setLatestFileInternalVersion(templateFile
				.getInternalVersion());
		templateMaster.setLatestFileLifecycleState(templateFile
				.getLifecycleState());
		templateMaster.setLatestFileVersion(templateFile.getVersion());
		this.templateMasterRepo.save(templateMaster);
		// Log action
		this.logTemplateAction(templateFile, ActionType.Create, user);
	}

	public void editTemplate(TemplateFile templateFile, TemplateDocument oet,
			ArchetypeRelationshipMappingDocument arm, User user)
			throws VersionControlException {
		// Validate user authority

		// Validate editor
		if (!templateFile.getEditor().equals(user)) {
			throw new VersionControlException("Only user"
					+ templateFile.getEditor().getName()
					+ " can Edit the  template " + templateFile.getName()
					+ " not user " + user.getName() + ".");
		}
		// Validate and set lifecycle state
		if (!templateFile.getLifecycleState().equals(LifecycleState.Draft)) {
			throw new VersionControlException(
					"Illeagal action Edit for template "
							+ templateFile.getName()
							+ " because the template's lifecycle state is "
							+ templateFile.getLifecycleState()
							+ " instead of Draft.");
		}
		// Save template file
		templateFile.setContent(oet.toString());
		templateFile.getPropertyMap().put(ARM, arm.toString());
		this.templateFileRepo.save(templateFile);
		// Log action
		this.logTemplateAction(templateFile, ActionType.Edit, user);
	}

	public void submitTemplate(TemplateFile templateFile, User user)
			throws VersionControlException {
		// Validate user authority

		// Validate editor
		if (!templateFile.getEditor().equals(user)) {
			throw new VersionControlException("Only user"
					+ templateFile.getEditor().getName()
					+ " can Submit the template " + templateFile.getName()
					+ " not user " + user.getName() + ".");
		}
		// Validate and set lifecycle state
		if (!templateFile.getLifecycleState().equals(LifecycleState.Draft)) {
			throw new VersionControlException(
					"Illeagal action Submit for template "
							+ templateFile.getName()
							+ " because the template's lifecycle state is "
							+ templateFile.getLifecycleState()
							+ " instead of Draft.");
		}
		templateFile.setLifecycleState(LifecycleState.Teamreview);
		// Save archetype file and master
		this.templateFileRepo.save(templateFile);
		TemplateMaster templateMaster = templateFile.getMaster();
		templateMaster.setLatestFileLifecycleState(templateFile
				.getLifecycleState());
		this.templateMasterRepo.save(templateMaster);
		// Log action
		this.logTemplateAction(templateFile, ActionType.Submit, user);
	}

	public void approveTemplate(TemplateFile templateFile, User user)
			throws VersionControlException {
		// Validate user authority

		// Validate and set lifecycle state
		if (!templateFile.getLifecycleState().equals(LifecycleState.Teamreview)) {
			throw new VersionControlException(
					"Illeagal action Approve for template "
							+ templateFile.getName()
							+ " because the template's lifecycle state is "
							+ templateFile.getLifecycleState()
							+ " instead of Teamreview.");
		}
		templateFile.setLifecycleState(LifecycleState.Published);
		// Construct entity classes
		OETParser oetParser = new OETParser();
		TemplateDocument oet;
		try {
			oet = oetParser.parseTemplate(new ByteArrayInputStream(templateFile
					.getContent().getBytes(StandardCharsets.UTF_8)));
		} catch (Exception ex) {
			throw new VersionControlException("Parse oet failed.", ex);
		}
		ArmParser armParser = new ArmParser();
		ArchetypeRelationshipMappingDocument arm;
		try {
			arm = armParser
					.parseArm(new ByteArrayInputStream(templateFile
							.getPropertyMap().get(ARM)
							.getBytes(StandardCharsets.UTF_8)));
		} catch (Exception ex) {
			throw new VersionControlException("Parse arm failed.", ex);
		}
		List<EntityClass> entityClasses = this.constructEntityClasses(
				templateFile, oet, arm);
		// Save entity classes
		entityClasses.forEach(cls -> this.entityClassRepo.save(cls));
		// Save template file
		this.templateFileRepo.save(templateFile);
		// Update template master info
		TemplateMaster templateMaster = templateFile.getMaster();
		templateMaster.setLatestFileLifecycleState(LifecycleState.Published);
		this.setTemplateMasterBasicInfo(templateMaster, oet);
		this.templateMasterRepo.save(templateMaster);
		// Log action
		this.logTemplateAction(templateFile, ActionType.Approve, user);
	}

	public void rejectTemplate(TemplateFile templateFile, User user)
			throws VersionControlException {
		// Validate user authority

		// Validate and set lifecycle state
		if (!templateFile.getLifecycleState().equals(LifecycleState.Teamreview)) {
			throw new VersionControlException(
					"Illeagal action Reject for template "
							+ templateFile.getName()
							+ " because the template's lifecycle state is "
							+ templateFile.getLifecycleState()
							+ " instead of Teamreview.");
		}
		templateFile.setLifecycleState(LifecycleState.Draft);
		// Save archetype file and master
		this.templateFileRepo.save(templateFile);
		TemplateMaster templateMaster = templateFile.getMaster();
		templateMaster.setLatestFileLifecycleState(templateFile
				.getLifecycleState());
		this.templateMasterRepo.save(templateMaster);
		// Log action
		this.logTemplateAction(templateFile, ActionType.Reject, user);
	}

	public void rejectAndRemoveTemplate(TemplateFile templateFile, User user)
			throws VersionControlException {
		// Validate user authority

		// Validate and set lifecycle state
		if (!templateFile.getLifecycleState().equals(LifecycleState.Teamreview)) {
			throw new VersionControlException(
					"Illeagal action RejectAndRemove for template "
							+ templateFile.getName()
							+ " because the template's lifecycle state is "
							+ templateFile.getLifecycleState()
							+ " instead of Teamreview.");
		}

		TemplateMaster templateMaster = templateFile.getMaster();
		Optional<TemplateFile> lastTemplate = Optional.ofNullable(templateFile
				.getLastVersionTemplate());
		if (lastTemplate.isPresent()) {
			// Not the first file of master, update master
			templateMaster.setLatestFile(lastTemplate.get());
			templateMaster.setLatestFileLifecycleState(lastTemplate.map(
					archetype -> archetype.getLifecycleState()).get());
			templateMaster.setLatestFileInternalVersion(lastTemplate.get()
					.getInternalVersion());
			templateMaster
					.setLatestFileVersion(lastTemplate.get().getVersion());
			this.templateMasterRepo.save(templateMaster);
		} else {
			// The first file of master, remove master
			this.templateMasterRepo.delete(templateMaster);
		}
		// Remove file
		this.templateFileRepo.delete(templateFile);
		// Log action
		this.logTemplateAction(templateFile, ActionType.RejectAndRelease, user);
	}

	private List<EntityClass> constructEntityClasses(TemplateFile templateFile,
			TemplateDocument oet, ArchetypeRelationshipMappingDocument arm)
			throws VersionControlException {
		// Construct entity class
		EntityClassGenerateOption option = new EntityClassGenerateOption();
		option.setPrintClass(true);
		Function<String, Archetype> archetypeVisitor = archetypeId -> {
			ArchetypeFile file = this.archetypeFileRepo.findByName(archetypeId);
			if (file == null) {
				this.logger.debug("Archetype {} does not exist.", archetypeId);
				return null;
			} else {
				ADLParser parser = new ADLParser(file.getContent());
				try {
					Archetype archetype = parser.parse();
					return archetype;
				} catch (Exception ex) {
					this.logger.debug("Parser archetype: {} failed.",
							file.getName());
					return null;
				}
			}
		};
		JavaClass entitySource;
		try {
			entitySource = this.generator.generateEntityClass(oet, arm,
					archetypeVisitor, option);
		} catch (EntityClassGenerateException ex) {
			throw new VersionControlException(
					"Generate entity class failed, error:" + ex.getMessage(),
					ex);
		}
		List<JavaClass> allClasses = new ArrayList<JavaClass>();
		this.scanAllClasses(entitySource, allClasses);
		// Construct entity classes
		return allClasses
				.stream()
				.map(cls -> {
					EntityClass entityClass = new EntityClass();
					entityClass.setEntityId(entitySource.getEntityId());
					entityClass.setFullName(entitySource.getFullName());
					entityClass.setName(entitySource.getName());
					entityClass.setPackageName(entitySource.getJavaPackage()
							.getName());
					entityClass.setContent(entitySource.toString());
					entityClass.setTemplateFile(templateFile);
					return entityClass;
				}).collect(Collectors.toList());
	}

	private void scanAllClasses(JavaClass clazz, List<JavaClass> classes) {
		clazz.getEmbeddedClasses().forEach(
				pair -> this.scanAllClasses(pair.getRight(), classes));
		clazz.getOneToManyClasses().forEach(
				pair -> this.scanAllClasses(pair.getRight(), classes));
		classes.add(clazz);
	}

	private TemplateMaster constructTemplateMaster(TemplateDocument oet,
			ArchetypeFile specialiseArchetypeFile)
			throws VersionControlException {
		TemplateMaster templateMaster = new TemplateMaster();
		String templateName = oet.getTemplate().getName();
		ArchetypeMaster specialiseArchetypeMaster = specialiseArchetypeFile
				.getMaster();
		// Set master basic info
		this.setTemplateMasterBasicInfo(templateMaster, oet);

		templateMaster.setConceptName(specialiseArchetypeMaster
				.getConceptName());
		templateMaster.setConceptDescription(specialiseArchetypeMaster
				.getConceptDescription());
		templateMaster.setName(templateName.substring(0,
				templateName.lastIndexOf(".v")));
		templateMaster.setRmEntity(specialiseArchetypeMaster.getRmEntity());
		templateMaster.setRmName(specialiseArchetypeMaster.getRmName());
		templateMaster.setRmOrginator(specialiseArchetypeMaster
				.getRmOrginator());
		// Set specialize archetype master info
		templateMaster.setSpecialiseArchetypeMaster(specialiseArchetypeMaster);
		templateMaster
				.setLatestSpecialiseArchetypeInternalVersion(specialiseArchetypeMaster
						.getLatestFileInternalVersion());
		return templateMaster;
	}

	private void setTemplateMasterBasicInfo(TemplateMaster templateMaster,
			TemplateDocument oet) {
		RESOURCEDESCRIPTIONITEM details = oet.getTemplate().getDescription()
				.getDetails();
		templateMaster.setPurpose(details.getPurpose());
		templateMaster.setKeywords(String.join(",", details.getKeywords()
				.getItemArray()));
		templateMaster.setUse(details.getUse());
		templateMaster.setMisuse(details.getMisuse());
		templateMaster.setCopyright(details.getCopyright());
	}

	private TemplateFile constructTemplateFile(TemplateMaster templateMaster,
			ArchetypeFile specialiseArchetypeFile, TemplateDocument oet,
			ArchetypeRelationshipMappingDocument arm, SourceType source,
			User user) {
		TemplateFile templateFile = new TemplateFile();
		// Set management info
		templateFile.setEditor(user);
		templateFile.setMaster(templateMaster);
		templateFile.setSource(source);
		// Set template info
		String templateName = oet.getTemplate().getName();
		templateFile.setName(templateName);
		templateFile.setVersion(templateName.substring(templateName
				.lastIndexOf(".v")));
		templateFile.setContent(oet.toString());
		templateFile.addProperty(ARM, arm.toString());
		templateFile.setTemplateType(TemplateType.Application);
		// Set specialize archetype info
		templateFile.setSpecialiseArchetype(specialiseArchetypeFile);
		templateFile
				.setSpecialiseArchetypeInternalVersion(specialiseArchetypeFile
						.getInternalVersion());
		templateFile.setSpecialiseArchetypeVersion(specialiseArchetypeFile
				.getVersion());
		templateMaster
				.setCurrentSpecialiseArchetypeInternalVersion(specialiseArchetypeFile
						.getInternalVersion());
		templateMaster
				.setCurrentSpecialiseArchetypeVersion(specialiseArchetypeFile
						.getVersion());
		return templateFile;
	}

	protected void logTemplateAction(TemplateFile templateFile,
			ActionType actionType, User user) {
		TemplateActionLog log = new TemplateActionLog();
		log.setActionType(actionType);
		log.setMaster(templateFile.getMaster());
		log.setVersion(templateFile.getVersion());
		log.setOperator(user);
		log.setOperatorName(user.getName());
		log.setRecordTime(Calendar.getInstance());
		log.setLifecycleState(templateFile.getLifecycleState());
		this.templateActionLogRepo.save(log);
	}
}
