package edu.zju.bme.clever.management.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
import edu.zju.bme.clever.commons.util.WordUtils;
import edu.zju.bme.clever.management.service.entity.ActionType;
import edu.zju.bme.clever.management.service.entity.ArchetypeRevisionFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeVersionMaster;
import edu.zju.bme.clever.management.service.entity.EntityClassSource;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.TemplateActionLog;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.TemplatePropertyType;
import edu.zju.bme.clever.management.service.entity.TemplateRevisionFile;
import edu.zju.bme.clever.management.service.entity.TemplateType;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.VersionControlException;
import edu.zju.bme.clever.management.service.repository.ArchetypeRevisionFileRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeVersionMasterRepository;
import edu.zju.bme.clever.management.service.repository.EntityClassSourceRepository;
import edu.zju.bme.clever.management.service.repository.TemplateActionLogRepository;
import edu.zju.bme.clever.management.service.repository.TemplateMasterRepository;
import edu.zju.bme.clever.management.service.repository.TemplateRevisionFileRepository;
import edu.zju.bme.clever.schemas.ArchetypeRelationshipMappingDocument;

@Service
@Transactional(rollbackFor = { Exception.class })
public class StorageTemplateVersionControlServiceImpl implements
		StorageTemplateVersionControlService {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private EntityClassSourceRepository entityClassRepo;
	@Autowired
	private TemplateRevisionFileRepository templateFileRepo;
	@Autowired
	private TemplateMasterRepository templateMasterRepo;
	@Autowired
	private ArchetypeRevisionFileRepository archetypeFileRepo;
	@Autowired
	private TemplateActionLogRepository templateActionLogRepo;

	@Autowired
	private ArchetypeVersionMasterRepository archetypeVersionMasterRepo;

	private OETParser oetParser = new OETParser();
	private ArmParser armParser = new ArmParser();

	@Override
	public void acceptNewTemplate(InputStream oet, InputStream arm, User user)
			throws VersionControlException {
		TemplateDocument oetDoc = this.parseOet(oet);
		ArchetypeRelationshipMappingDocument armDoc = this.parseArm(arm);
		this.acceptNewTemplate(oetDoc, armDoc, user);
	}

	@Override
	public void acceptNewTemplate(TemplateDocument oet,
			ArchetypeRelationshipMappingDocument arm, User user)
			throws VersionControlException {
		// Validate name consistency, name example
		// openEHR-EHR-CLUSTER.organisation.v1.1
		String templateName = oet.getTemplate().getName();
		if (!arm.getArchetypeRelationshipMapping().getTemplate()
				.getTemplateId().equals(templateName)) {
			throw new VersionControlException(
					"OET's name and ARM's name is not consisitent.");
		}
		String templateMasterName = WordUtils
				.extractVersionMasterName(templateName);
		if (templateMasterName == null) {
			throw new VersionControlException("Template name is unqualified.");
		}
		TemplateMaster master = this.templateMasterRepo
				.findByName(templateMasterName);
		if (master == null) {
			master = this.newMaster(templateMasterName, oet, arm);
		}
		TemplateRevisionFile revisionFile = this.templateFileRepo
				.findByName(templateName);
		if (revisionFile != null) {
			throw new VersionControlException("Template " + templateName
					+ " already exists.");
		}
		revisionFile = this.newRevisionFile(master, oet, arm, user);
	}

	@Override
	public TemplateMaster newMaster(String name, TemplateDocument oet,
			ArchetypeRelationshipMappingDocument arm)
			throws VersionControlException {
		TemplateMaster master = new TemplateMaster();
		// Validate specialise archetype

		// String specialiseArchetypeName = oet.getTemplate().getDefinition()
		// .getArchetypeId();
		//
		//
		// ArchetypeRevisionFile specialiseArchetype = this.archetypeFileRepo
		// .findByName(specialiseArchetypeName);
		//
		// // Whether exist
		// if (specialiseArchetype == null) {
		// throw new VersionControlException(
		// "Cannot find specialise archetype");
		// }
		// // Whether specialise the specific archetype version master
		// ArchetypeVersionMaster specialiseArchetypeVersionMaster =
		// specialiseArchetype
		// .getVersionMaster();
		// if (!specialiseArchetypeVersionMaster.getName().equals(name)) {
		// throw new VersionControlException("Template master name should be "
		// + specialiseArchetypeVersionMaster.getName());
		// }
		//
		// String specialiseArcVersionMasterName = WordUtils
		// .extractVersionMasterName(oet.getTemplate().getDefinition()
		// .getArchetypeId());
		ArchetypeVersionMaster specialiseArchetypeVersionMaster = this.archetypeVersionMasterRepo
				.findByName(name);

		if (specialiseArchetypeVersionMaster == null) {
			throw new VersionControlException(
					"Can not find specialise archetype");
		}

		// Set template master basic info
		RESOURCEDESCRIPTIONITEM details = oet.getTemplate().getDescription()
				.getDetails();
		master.setName(name);
		master.setPurpose(details.getPurpose());
		master.setUse(details.getUse());
		master.setMisuse(details.getMisuse());
		Optional.ofNullable(details.getKeywords()).map(k -> k.getItemArray())
				.ifPresent(keywords -> {
					master.setKeywords(String.join(",", keywords));
				});
		master.setCopyright(details.getCopyright());
		master.setTemplateType(TemplateType.STORAGE);
		// Set template master specialse info
		master.setConceptName(specialiseArchetypeVersionMaster.getConceptName());
		master.setConceptDescription(specialiseArchetypeVersionMaster
				.getConceptDescription());
		master.setRmEntity(specialiseArchetypeVersionMaster.getRmEntity());
		master.setRmName(specialiseArchetypeVersionMaster.getRmName());
		master.setRmOrginator(specialiseArchetypeVersionMaster.getRmOrginator());
		master.setVersion(specialiseArchetypeVersionMaster.getVersion());
		master.setSpecialiseArchetypeVersionMaster(specialiseArchetypeVersionMaster);
		this.templateMasterRepo.save(master);
		return master;
	}

	@Override
	public TemplateRevisionFile newRevisionFile(TemplateMaster master,
			TemplateDocument oet, ArchetypeRelationshipMappingDocument arm,
			User user) throws VersionControlException {
		String templateName = oet.getTemplate().getName();
		TemplateRevisionFile nextRevisionFile = new TemplateRevisionFile();
		TemplateRevisionFile latestRevisionFile = master
				.getLatestRevisionFile();
		// Validate specialise archetype
		// String specialiseArchetypeName = oet.getTemplate().getDefinition()
		// .getArchetypeId();
		// ArchetypeRevisionFile specialiseArchetype = this.archetypeFileRepo
		// .findByName(specialiseArchetypeName);

		// content in archetype_id attribute should be archetype versiona master
		// name
		String specialiseArchetypeVersionMasterName = WordUtils
				.extractVersionMasterName(oet.getTemplate().getDefinition()
						.getArchetypeId());
		// find specialise archetype version master
		ArchetypeVersionMaster specialiseArchetypeVersionMaster = this.archetypeVersionMasterRepo
				.findByName(specialiseArchetypeVersionMasterName);
		// Whether exist
		// if (specialiseArchetype == null) {
		// throw new VersionControlException(
		// "Cannot find specialise archetype");
		// }

		// there should be a archetype version master map to this oet
		if (specialiseArchetypeVersionMaster == null) {
			throw new VersionControlException(
					"Cannot find specialise archetype version master");
		}

		// version master should equals versionMaster in template master
		if (!master.getSpecialiseArchetypeVersionMaster().equals(
				specialiseArchetypeVersionMaster)) {
			throw new VersionControlException(
					"Specialise archetype should be one of the revisions of "
							+ specialiseArchetypeVersionMaster.getName());
		}

		// Whether specialise the specific archetype version master
		// if (!specialiseArchetype.getVersionMaster().equals(
		// master.getSpecialiseArchetypeVersionMaster())) {
		// throw new VersionControlException(
		// "Specialise archetype should be one of the revisions of "
		// + specialiseArchetype.getVersionMaster().getName());
		// }

		Integer nextSerialVersion;
		if (latestRevisionFile != null) {
			nextSerialVersion = latestRevisionFile.getSerialVersion() + 1;
			nextRevisionFile.setLastRevisionFile(latestRevisionFile);
			// Validate lifecycle state This validate is removed to
			// ValidateService
			// if (!latestRevisionFile.getLifecycleState().equals(
			// LifecycleState.PUBLISHED)) {
			// throw new VersionControlException(
			// "The latest revision template "
			// + latestRevisionFile.getName()
			// + "'s lifecycle state is not PUBLISHED.");
			// }
			// Validate specialise archetype order
			// if (specialiseArchetype.getSerialVersion() < latestRevisionFile
			// .getSpecialiseArchetypeRevisionFileSerialVersion()) {
			// throw new VersionControlException(
			// "Specialise archetype "
			// + specialiseArchetype.getName()
			// + " should not be earlier than "
			// + latestRevisionFile
			// .getSpecialiseArchetypeRevisionFileVersion());
			// }

		} else {
			// It is a new template master
			nextSerialVersion = 1;
		}
		// Construct next revision file
		nextRevisionFile.setEditor(user);
		nextRevisionFile.setName(templateName);
		nextRevisionFile.setTemplateMaster(master);
		nextRevisionFile.setTemplateMasterVersion(master.getVersion());
		nextRevisionFile.setTemplateType(TemplateType.STORAGE);
		nextRevisionFile.setLifecycleState(LifecycleState.DRAFT);
		nextRevisionFile.setSerialVersion(nextSerialVersion);
		nextRevisionFile.setVersion(master.getVersion() + "."
				+ nextSerialVersion);
		ArchetypeRevisionFile specialiseArchetype = specialiseArchetypeVersionMaster
				.getLatestRevisionFile();
		nextRevisionFile
				.setSpecialiseArchetypeRevisionFile(specialiseArchetype);
		nextRevisionFile
				.setSpecialiseArchetypeRevisionFileName(specialiseArchetype
						.getName());
		nextRevisionFile
				.setSpecialiseArchetypeRevisionFileSerialVersion(specialiseArchetype
						.getSerialVersion());
		nextRevisionFile
				.setSpecialiseArchetypeRevisionFileVersion(specialiseArchetype
						.getVersion());
		// Validate tempalte version
		String templateVersion = templateName.substring(templateName
				.lastIndexOf(".v") + 1);
		if (!templateVersion.equals(nextRevisionFile.getVersion())) {
			throw new VersionControlException("Template " + templateName
					+ "'s version should be " + nextRevisionFile.getVersion());
		}
		nextRevisionFile.setOet(oet.toString());
		nextRevisionFile.addProperty(TemplatePropertyType.ARM, arm.toString());
		this.templateFileRepo.save(nextRevisionFile);
		// Update template master
		master.setLatestRevisionFile(nextRevisionFile);
		master.setLatestRevisionFileLifecycleState(nextRevisionFile
				.getLifecycleState());
		master.setLatestRevisionFileSerialVersion(nextRevisionFile
				.getSerialVersion());
		master.setLatestRevisionFileVersion(nextRevisionFile.getVersion());
		this.templateMasterRepo.save(master);
		this.logTemplateAction(nextRevisionFile, ActionType.NEW_REVISION, user);
		return nextRevisionFile;
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
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findOne(templateId);
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
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (templateFile == null) {
			throw new VersionControlException(
					"Cannot find template with name: " + templateName);
		}
		this.editTemplate(templateFile, oet, arm, user);
	}

	@Override
	public void editTemplate(TemplateRevisionFile templateFile,
			InputStream oet, InputStream arm, User user)
			throws VersionControlException {
		this.editTemplate(templateFile, this.parseOet(oet), this.parseArm(arm),
				user);
	}

	@Override
	public void editTemplate(TemplateRevisionFile templateFile,
			TemplateDocument oet, ArchetypeRelationshipMappingDocument arm,
			User user) throws VersionControlException {
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
		templateFile.setLastModifyTime(Calendar.getInstance());

		// Save template file
		templateFile.setOet(oet.toString());
		templateFile.getPropertyMap().put(TemplatePropertyType.ARM,
				arm.toString());

		this.templateFileRepo.save(templateFile);
		// Log action
		this.logTemplateAction(templateFile, ActionType.EDIT, user);
	}

	@Override
	public void submitTemplate(Integer templateId, User user)
			throws VersionControlException {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findOne(templateId);
		if (templateFile == null) {
			throw new VersionControlException("Cannot find template with id: "
					+ templateId);
		}
		this.submitTemplate(templateFile, user);
	}

	@Override
	public void submitTemplate(String templateName, User user)
			throws VersionControlException {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (templateFile == null) {
			throw new VersionControlException(
					"Cannot find template with name: " + templateName);
		}
		this.submitTemplate(templateFile, user);
	}

	@Override
	public void submitTemplate(TemplateRevisionFile templateFile, User user)
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

		templateFile.setLastModifyTime(Calendar.getInstance());
		templateFile.setLifecycleState(LifecycleState.TEAMREVIEW);
		// Save archetype file and master
		this.templateFileRepo.save(templateFile);
		TemplateMaster templateMaster = templateFile.getTemplateMaster();
		templateMaster.setLatestRevisionFileLifecycleState(templateFile
				.getLifecycleState());
		this.templateMasterRepo.save(templateMaster);
		// Log action
		this.logTemplateAction(templateFile, ActionType.SUBMIT, user);
	}

	@Override
	public void approveTemplate(Integer templateId, User user)
			throws VersionControlException {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findOne(templateId);
		if (templateFile == null) {
			throw new VersionControlException("Cannot find template with id: "
					+ templateId);
		}
		this.approveTemplate(templateFile, user);
	}

	@Override
	public void approveTemplate(String templateName, User user)
			throws VersionControlException {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (templateFile == null) {
			throw new VersionControlException(
					"Cannot find template with name: " + templateName);
		}
		this.approveTemplate(templateFile, user);
	}

	@Override
	public void approveTemplate(TemplateRevisionFile templateFile, User user)
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

		// validate specialize archetype lifecycle state
		ArchetypeRevisionFile specialiseArchetype = templateFile
				.getSpecialiseArchetypeRevisionFile();
		if (specialiseArchetype.getLifecycleState().equals(
				LifecycleState.PUBLISHED)) {
			throw new VersionControlException(
					"Illeagal action Approve for template "
							+ templateFile.getName()
							+ " because the specialise archetype's lifecycle state is "
							+ specialiseArchetype.getLifecycleState()
							+ " instead of Published");
		}
		templateFile.setLifecycleState(LifecycleState.PUBLISHED);

		// Validate template effectiveness
		TemplateDocument oet;
		try {
			oet = this.oetParser.parseTemplate(new ByteArrayInputStream(
					templateFile.getOet().getBytes(StandardCharsets.UTF_8)));
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

		templateFile.setLastModifyTime(Calendar.getInstance());

		// Save template file
		this.templateFileRepo.save(templateFile);
		// Update template master info
		TemplateMaster templateMaster = templateFile.getTemplateMaster();
		templateMaster
				.setLatestRevisionFileLifecycleState(LifecycleState.PUBLISHED);
		this.templateMasterRepo.save(templateMaster);
		// Log action
		this.logTemplateAction(templateFile, ActionType.APPROVE, user);
	}

	@Override
	public void rejectTemplate(Integer templateId, User user)
			throws VersionControlException {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findOne(templateId);
		if (templateFile == null) {
			throw new VersionControlException("Cannot find template with id: "
					+ templateId);
		}
		this.rejectTemplate(templateFile, user);
	}

	@Override
	public void rejectTemplate(String templateName, User user)
			throws VersionControlException {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (templateFile == null) {
			throw new VersionControlException(
					"Cannot find template with name: " + templateName);
		}
		this.rejectTemplate(templateFile, user);
	}

	@Override
	public void rejectTemplate(TemplateRevisionFile templateFile, User user)
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
		templateFile.setLastModifyTime(Calendar.getInstance());
		templateFile.setLifecycleState(LifecycleState.DRAFT);
		// Save archetype file and master
		this.templateFileRepo.save(templateFile);
		TemplateMaster templateMaster = templateFile.getTemplateMaster();
		templateMaster.setLatestRevisionFileLifecycleState(templateFile
				.getLifecycleState());
		this.templateMasterRepo.save(templateMaster);
		// Log action
		this.logTemplateAction(templateFile, ActionType.REJECT, user);
	}

	@Override
	public void rejectAndRemoveTemplate(Integer templateId, User user)
			throws VersionControlException {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findOne(templateId);
		if (templateFile == null) {
			throw new VersionControlException("Cannot find template with id: "
					+ templateId);
		}
		this.rejectAndRemoveTemplate(templateFile, user);
	}

	@Override
	public void rejectAndRemoveTemplate(String templateName, User user)
			throws VersionControlException {
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (templateFile == null) {
			throw new VersionControlException(
					"Cannot find template with name: " + templateName);
		}
		this.rejectAndRemoveTemplate(templateFile, user);
	}

	@Override
	public void rejectAndRemoveTemplate(TemplateRevisionFile templateFile,
			User user) throws VersionControlException {
		// Log action
		this.logTemplateAction(templateFile, ActionType.REJECT_AND_REMOVE, user);
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

		TemplateMaster templateMaster = templateFile.getTemplateMaster();
		TemplateRevisionFile lastTemplate = templateFile.getLastRevisionFile();
		if (lastTemplate != null) {
			// Not the first file of master, update master
			templateMaster.setLatestRevisionFile(lastTemplate);
			templateMaster.setLatestRevisionFileLifecycleState(lastTemplate
					.getLifecycleState());
			templateMaster.setLatestRevisionFileSerialVersion(lastTemplate
					.getSerialVersion());
			templateMaster.setLatestRevisionFileVersion(lastTemplate
					.getVersion());
			this.templateMasterRepo.save(templateMaster);
			// Remove file
			this.templateFileRepo.delete(templateFile);
			// Log action
			this.logTemplateAction(templateFile, ActionType.REJECT_AND_REMOVE,
					user);
		} else {
			// The first file of master, remove master
			this.templateMasterRepo.delete(templateMaster);
		}

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

	protected void logTemplateAction(TemplateRevisionFile templateFile,
			ActionType actionType, User user) {
		TemplateActionLog log = new TemplateActionLog();
		log.setActionType(actionType);
		log.setTemplateMaster(templateFile.getTemplateMaster());
		log.setVersion(templateFile.getVersion());
		log.setOperator(user);
		log.setOperatorName(user.getName());
		log.setRecordTime(Calendar.getInstance());
		log.setLifecycleState(templateFile.getLifecycleState());
		this.templateActionLogRepo.save(log);
	}
}
