package edu.zju.bme.clever.management.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import openEHR.v1.template.RESOURCEDESCRIPTIONITEM;
import openEHR.v1.template.TemplateDocument;

import org.apache.xmlbeans.XmlException;
import org.openehr.am.archetype.Archetype;
import org.openehr.am.template.OETParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import se.acode.openehr.parser.ADLParser;
import edu.zju.bme.clever.cdr.arm.parser.ArmParser;
import edu.zju.bme.clever.management.service.entity.ActionType;
import edu.zju.bme.clever.management.service.entity.ArchetypeFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.EntityClass;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.SourceType;
import edu.zju.bme.clever.management.service.entity.TemplateActionLog;
import edu.zju.bme.clever.management.service.entity.TemplateFile;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.TemplatePropertyType;
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
@Transactional(rollbackFor = { Exception.class })
public class StorageTemplateVersionControlServiceImpl implements
		StorageTemplateVersionControlService {

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

	private OETParser oetParser = new OETParser();
	private ArmParser armParser = new ArmParser();

	@Override
	public void createOrUpgradeTemplate(String oet, String arm,
			SourceType source, User user) throws VersionControlException {
		this.createOrUpgradeTemplate(
				new ByteArrayInputStream(oet.getBytes(StandardCharsets.UTF_8)),
				new ByteArrayInputStream(arm.getBytes(StandardCharsets.UTF_8)),
				source, user);
	}

	@Override
	public void createOrUpgradeTemplate(InputStream oet, InputStream arm,
			SourceType source, User user) throws VersionControlException {
		this.createOrUpgradeTemplate(this.parseOet(oet), this.parseArm(arm),
				source, user);
	}

	@Override
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
			throw new VersionControlException("Template " + templateName
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
				if (!templateFile.getVersion().equals(
						specialiseArchetypeFile.getVersion() + ".1")) {
					throw new VersionControlException(
							"Template version should be "
									+ specialiseArchetypeFile.getVersion()
									+ ".1");
				}
				templateFile.setSubVersion(1);
			} else if (currentSpecialiseArchetypeInternalVersion == latestTemplateSpecialiseArchetypeInternalVersion) {
				Integer nextSubVersion = latestTemplate.get().getSubVersion() + 1;
				if (!templateFile.getVersion().equals(
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
					.equals(LifecycleState.PUBLISHED)) {
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
		templateFile.setLifecycleState(LifecycleState.DRAFT);
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
		this.logTemplateAction(templateFile, ActionType.CREATE, user);
	}

	@Override
	public void upgradeLatestPublishedTemplate(Integer templateId, 
			User user)throws VersionControlException{
		TemplateFile templateFile = this.templateFileRepo.findOne(templateId);
		if(templateFile == null){
			throw new VersionControlException("Cannot find template with id: "
					+ templateId);
		}
		this.upgradeLatestPublishedTemplate(templateFile, user);
	}
	
	@Override
	public void upgradeLatestPublishedTemplate(String templateName, 
			User user)throws VersionControlException{
		TemplateFile templateFile = this.templateFileRepo.findByName(templateName);
		if(templateFile == null){
			throw new VersionControlException("Cannot find template with name: "
					+ templateName);
		}
		this.upgradeLatestPublishedTemplate(templateFile, user);
	}
	
	@Override
	public void upgradeLatestPublishedTemplate(TemplateFile templateFile, 
			User user) throws VersionControlException{
		// Validate user
		
		// Validate lifecycleState
		if(!templateFile.getLifecycleState().equals(LifecycleState.PUBLISHED)){
			throw new VersionControlException(
					"Illeagal action Upgrade for latest publshed template"
					+ templateFile.getName()
					+ "because this template's lifecycleState is "
					+ templateFile.getLifecycleState()
					+ "instead of Published.");
		}
		// Validate latestVersion
		TemplateMaster templateMaster = templateFile.getMaster();
		if(templateMaster.getLatestFileId() != templateFile.getId()){
			throw new VersionControlException(
					"Illeagal action Upgrade for laterst published template"
					+ templateFile.getName()
					+ "because this published template is not the latest template");
		}
		TemplateDocument oet;
		try {
			oet = this.oetParser
					.parseTemplate(new ByteArrayInputStream(templateFile
							.getContent().getBytes(StandardCharsets.UTF_8)));
		} catch (Exception ex) {
			throw new VersionControlException("Parse oet failed.", ex);
		}
		// Set oet's name for upgrading
		String templateName = templateFile.getName();
		oet.getTemplate().setName(
				templateName.substring(0,
						templateName.lastIndexOf(".") + 1)
						+ (templateFile.getSubVersion() + 1));
		ArchetypeRelationshipMappingDocument arm;
		try {
			arm = this.armParser.parseArm(new ByteArrayInputStream(templateFile
					.getPropertyMap().get(TemplatePropertyType.ARM)
					.getBytes(StandardCharsets.UTF_8)));
		} catch (Exception ex) {
			throw new VersionControlException("Parse arm failed.", ex);
		}
		// Set arm's template-id for updrading
		arm.getArchetypeRelationshipMapping().getTemplate().setTemplateId(oet.getTemplate().getName());
		// Construct template file
		TemplateFile upgradedTemplateFile = this.constructTemplateFile(
				templateMaster, templateFile.getSpecialiseArchetype(), 
				oet, arm, templateFile.getSource(), templateFile.getEditor());
		// Set upgradeTemplateFile sub version and internal version
		upgradedTemplateFile.setSubVersion(templateFile.getSubVersion() + 1);
		upgradedTemplateFile.setLastVersionTemplate(templateFile);
		upgradedTemplateFile.setInternalVersion(templateFile.getInternalVersion() + 1);
		// Set lifecycle state
		upgradedTemplateFile.setLifecycleState(LifecycleState.DRAFT);
		// Save upgraded template file and master
		this.templateFileRepo.save(upgradedTemplateFile);
		templateMaster.setLatestFile(upgradedTemplateFile);
		templateMaster.setLatestFileInternalVersion(upgradedTemplateFile.getInternalVersion());
		templateMaster.setLatestFileLifecycleState(upgradedTemplateFile.getLifecycleState());
		templateMaster.setLatestFileVersion(upgradedTemplateFile.getVersion());
		this.templateMasterRepo.save(templateMaster);
		// Log action
		this.logTemplateAction(upgradedTemplateFile, ActionType.EDIT, user);
	}
	
	@Override
	public void editTemplate(Integer templateId, String oet, String arm,
			User user) throws VersionControlException {
		this.editTemplate(templateId,
				new ByteArrayInputStream(oet.getBytes(StandardCharsets.UTF_8)),
				new ByteArrayInputStream(arm.getBytes(StandardCharsets.UTF_8)),
				user);
	}

	@Override
	public void editTemplate(Integer templateId, InputStream oet,
			InputStream arm, User user) throws VersionControlException {
		TemplateFile templateFile = this.templateFileRepo.findOne(templateId);
		if (templateFile == null) {
			throw new VersionControlException("Cannot find template with id: "
					+ templateId);
		}
		this.editTemplate(templateFile, this.parseOet(oet), this.parseArm(arm),
				user);
	}

	@Override
	public void editTemplate(String templateName, String oet, String arm,
			User user) throws VersionControlException {
		this.editTemplate(templateName,
				new ByteArrayInputStream(oet.getBytes(StandardCharsets.UTF_8)),
				new ByteArrayInputStream(arm.getBytes(StandardCharsets.UTF_8)),
				user);
	}

	@Override
	public void editTemplate(String templateName, InputStream oet,
			InputStream arm, User user) throws VersionControlException {
		TemplateFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (templateFile == null) {
			throw new VersionControlException(
					"Cannot find template with name: " + templateName);
		}
		this.editTemplate(templateFile, oet, arm, user);
	}

	@Override
	public void editTemplate(TemplateFile templateFile, InputStream oet,
			InputStream arm, User user) throws VersionControlException {
		this.editTemplate(templateFile, this.parseOet(oet), this.parseArm(arm),
				user);
	}

	@Override
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
		if (!templateFile.getLifecycleState().equals(LifecycleState.DRAFT)) {
			throw new VersionControlException(
					"Illeagal action Edit for template "
							+ templateFile.getName()
							+ " because the template's lifecycle state is "
							+ templateFile.getLifecycleState()
							+ " instead of Draft.");
		}
		// Save template file
		templateFile.setContent(oet.toString());
		templateFile.getPropertyMap().put(TemplatePropertyType.ARM,
				arm.toString());
		this.templateFileRepo.save(templateFile);
		// Log action
		this.logTemplateAction(templateFile, ActionType.EDIT, user);
	}

	@Override
	public void submitTemplate(Integer templateId, User user)
			throws VersionControlException {
		TemplateFile templateFile = this.templateFileRepo.findOne(templateId);
		if (templateFile == null) {
			throw new VersionControlException("Cannot find template with id: "
					+ templateId);
		}
		this.submitTemplate(templateFile, user);
	}

	@Override
	public void submitTemplate(String templateName, User user)
			throws VersionControlException {
		TemplateFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (templateFile == null) {
			throw new VersionControlException(
					"Cannot find template with name: " + templateName);
		}
		this.submitTemplate(templateFile, user);
	}

	@Override
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
		if (!templateFile.getLifecycleState().equals(LifecycleState.DRAFT)) {
			throw new VersionControlException(
					"Illeagal action Submit for template "
							+ templateFile.getName()
							+ " because the template's lifecycle state is "
							+ templateFile.getLifecycleState()
							+ " instead of Draft.");
		}
		templateFile.setLifecycleState(LifecycleState.TEAMREVIEW);
		// Save archetype file and master
		this.templateFileRepo.save(templateFile);
		TemplateMaster templateMaster = templateFile.getMaster();
		templateMaster.setLatestFileLifecycleState(templateFile
				.getLifecycleState());
		this.templateMasterRepo.save(templateMaster);
		// Log action
		this.logTemplateAction(templateFile, ActionType.SUBMIT, user);
	}

	@Override
	public void approveTemplate(Integer templateId, User user)
			throws VersionControlException {
		TemplateFile templateFile = this.templateFileRepo.findOne(templateId);
		if (templateFile == null) {
			throw new VersionControlException("Cannot find template with id: "
					+ templateId);
		}
		this.approveTemplate(templateFile, user);
	}

	@Override
	public void approveTemplate(String templateName, User user)
			throws VersionControlException {
		TemplateFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (templateFile == null) {
			throw new VersionControlException(
					"Cannot find template with name: " + templateName);
		}
		this.approveTemplate(templateFile, user);
	}

	@Override
	public void approveTemplate(TemplateFile templateFile, User user)
			throws VersionControlException {
		// Validate user authority

		// Validate and set lifecycle state
		if (!templateFile.getLifecycleState().equals(LifecycleState.TEAMREVIEW)) {
			throw new VersionControlException(
					"Illeagal action Approve for template "
							+ templateFile.getName()
							+ " because the template's lifecycle state is "
							+ templateFile.getLifecycleState()
							+ " instead of Teamreview.");
		}
		templateFile.setLifecycleState(LifecycleState.PUBLISHED);
		TemplateDocument oet;
		try {
			oet = this.oetParser
					.parseTemplate(new ByteArrayInputStream(templateFile
							.getContent().getBytes(StandardCharsets.UTF_8)));
		} catch (Exception ex) {
			throw new VersionControlException("Parse oet failed.", ex);
		}
		ArchetypeRelationshipMappingDocument arm;
		try {
			arm = this.armParser.parseArm(new ByteArrayInputStream(templateFile
					.getPropertyMap().get(TemplatePropertyType.ARM)
					.getBytes(StandardCharsets.UTF_8)));
		} catch (Exception ex) {
			throw new VersionControlException("Parse arm failed.", ex);
		}
		
		// Construct entity classes
		// List<EntityClass> entityClasses = this.constructEntityClasses(
		// templateFile, oet, arm);
		// Save entity classes
		// entityClasses.forEach(cls -> this.entityClassRepo.save(cls));
		
		// Save template file
		this.templateFileRepo.save(templateFile);
		// Update template master info
		TemplateMaster templateMaster = templateFile.getMaster();
		templateMaster.setLatestFileLifecycleState(LifecycleState.PUBLISHED);
		this.setTemplateMasterBasicInfo(templateMaster, oet);
		this.templateMasterRepo.save(templateMaster);
		// Log action
		this.logTemplateAction(templateFile, ActionType.APPROVE, user);
	}

	@Override
	public void rejectTemplate(Integer templateId, User user)
			throws VersionControlException {
		TemplateFile templateFile = this.templateFileRepo.findOne(templateId);
		if (templateFile == null) {
			throw new VersionControlException("Cannot find template with id: "
					+ templateId);
		}
		this.rejectTemplate(templateFile, user);
	}

	@Override
	public void rejectTemplate(String templateName, User user)
			throws VersionControlException {
		TemplateFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (templateFile == null) {
			throw new VersionControlException(
					"Cannot find template with name: " + templateName);
		}
		this.rejectTemplate(templateFile, user);
	}

	@Override
	public void rejectTemplate(TemplateFile templateFile, User user)
			throws VersionControlException {
		// Validate user authority

		// Validate and set lifecycle state
		if (!templateFile.getLifecycleState().equals(LifecycleState.TEAMREVIEW)) {
			throw new VersionControlException(
					"Illeagal action Reject for template "
							+ templateFile.getName()
							+ " because the template's lifecycle state is "
							+ templateFile.getLifecycleState()
							+ " instead of Teamreview.");
		}
		templateFile.setLifecycleState(LifecycleState.DRAFT);
		// Save archetype file and master
		this.templateFileRepo.save(templateFile);
		TemplateMaster templateMaster = templateFile.getMaster();
		templateMaster.setLatestFileLifecycleState(templateFile
				.getLifecycleState());
		this.templateMasterRepo.save(templateMaster);
		// Log action
		this.logTemplateAction(templateFile, ActionType.REJECT, user);
	}

	@Override
	public void rejectAndRemoveTemplate(Integer templateId, User user)
			throws VersionControlException {
		TemplateFile templateFile = this.templateFileRepo.findOne(templateId);
		if (templateFile == null) {
			throw new VersionControlException("Cannot find template with id: "
					+ templateId);
		}
		this.rejectAndRemoveTemplate(templateFile, user);
	}

	@Override
	public void rejectAndRemoveTemplate(String templateName, User user)
			throws VersionControlException {
		TemplateFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (templateFile == null) {
			throw new VersionControlException(
					"Cannot find template with name: " + templateName);
		}
		this.rejectAndRemoveTemplate(templateFile, user);
	}

	@Override
	public void rejectAndRemoveTemplate(TemplateFile templateFile, User user)
			throws VersionControlException {
		// Validate user authority

		// Validate and set lifecycle state
		if (!templateFile.getLifecycleState().equals(LifecycleState.TEAMREVIEW)) {
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
			// Remove file
			this.templateFileRepo.delete(templateFile);
			// Log action
			this.logTemplateAction(templateFile, ActionType.REJECT_AND_REMOVE, user);
		} else {
			// The first file of master, remove master
			// Cascade delete on template file and log action because of deleting master
			this.templateMasterRepo.delete(templateMaster);
		}
	}

	// private List<EntityClass> constructEntityClasses(TemplateFile
	// templateFile,
	// TemplateDocument oet, ArchetypeRelationshipMappingDocument arm)
	// throws VersionControlException {
	// // Construct entity class
	// EntityClassGenerateOption option = new EntityClassGenerateOption();
	// option.setPrintClass(true);
	// Function<String, Archetype> archetypeVisitor = archetypeId -> {
	// ArchetypeFile file = this.archetypeFileRepo.findByName(archetypeId);
	// if (file == null) {
	// this.logger.debug("Archetype {} does not exist.", archetypeId);
	// return null;
	// } else {
	// ADLParser parser = new ADLParser(file.getContent());
	// try {
	// Archetype archetype = parser.parse();
	// return archetype;
	// } catch (Exception ex) {
	// this.logger.debug("Parser archetype: {} failed.",
	// file.getName());
	// return null;
	// }
	// }
	// };
	// JavaClass entitySource;
	// try {
	// entitySource = this.generator.generateEntityClass(oet, arm,
	// archetypeVisitor, option);
	// } catch (EntityClassGenerateException ex) {
	// throw new VersionControlException(
	// "Generate entity class failed, error:" + ex.getMessage(),
	// ex);
	// }
	// List<JavaClass> allClasses = new ArrayList<JavaClass>();
	// this.scanAllClasses(entitySource, allClasses);
	// // Construct entity classes
	// return allClasses.stream().map(cls -> {
	// EntityClass entityClass = new EntityClass();
	// entityClass.setEntityId(cls.getEntityId());
	// entityClass.setFullName(cls.getFullName());
	// entityClass.setName(cls.getName());
	// entityClass.setPackageName(cls.getJavaPackage().getName());
	// entityClass.setContent(cls.toString());
	// entityClass.setTemplateFile(templateFile);
	// return entityClass;
	// }).collect(Collectors.toList());
	// }

	private TemplateMaster constructTemplateMaster(TemplateDocument oet,
			ArchetypeFile specialiseArchetypeFile)
			throws VersionControlException {
		TemplateMaster templateMaster = new TemplateMaster();
		String templateName = oet.getTemplate().getName();
		ArchetypeMaster specialiseArchetypeMaster = specialiseArchetypeFile
				.getMaster();
		// Set master basic info
		this.setTemplateMasterBasicInfo(templateMaster, oet);
		templateMaster.setTemplateType(TemplateType.STORAGE);
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
		templateMaster.setKeywords(String.join(
				",",
				Optional.ofNullable(details.getKeywords())
						.map(keywords -> keywords.getItemArray())
						.orElse(new String[] {})));
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
				.lastIndexOf(".v") + 1));
		templateFile.setContent(oet.toString());
		templateFile.addProperty(TemplatePropertyType.ARM, arm.toString());
		templateFile.setTemplateType(TemplateType.STORAGE);
		// Set specialize archetype info
		templateFile.setSpecialiseArchetype(specialiseArchetypeFile);
		templateFile.setSpecialiseArchetypeName(oet.getTemplate()
				.getDefinition().getArchetypeId());
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

	private TemplateDocument parseOet(InputStream oetStream)
			throws VersionControlException {
		TemplateDocument oet;
		try {
			oet = this.oetParser.parseTemplate(oetStream);
		} catch (Exception ex) {
			throw new VersionControlException("Parse oet failed, error: "
					+ ex.getMessage(), ex);
		}
		return oet;
	}

	private ArchetypeRelationshipMappingDocument parseArm(InputStream armStream)
			throws VersionControlException {
		ArchetypeRelationshipMappingDocument arm;
		try {
			arm = this.armParser.parseArm(armStream);
		} catch (Exception ex) {
			throw new VersionControlException("Parse arm failed, error: "
					+ ex.getMessage(), ex);
		}
		return arm;
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
