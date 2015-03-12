package edu.zju.bme.clever.management.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Optional;

import org.openehr.am.archetype.Archetype;
import org.openehr.am.serialize.ADLSerializer;
import org.openehr.rm.support.identification.ArchetypeID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import se.acode.openehr.parser.ADLParser;
import edu.zju.bme.clever.management.service.entity.ArchetypeActionLog;
import edu.zju.bme.clever.management.service.entity.ArchetypeFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.entity.AbstractFile.SourceType;
import edu.zju.bme.clever.management.service.entity.ActionType;
import edu.zju.bme.clever.management.service.exception.VersionControlException;
import edu.zju.bme.clever.management.service.repository.ArchetypeActionLogRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeFileRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeMasterRepository;

@Service
@Transactional(rollbackFor = { Exception.class })
public class ArchetypeVersionControlServiceImpl implements
		ArchetypeVersionControlService {

	@Autowired
	private ArchetypeMasterRepository archetypeMasterRepo;
	@Autowired
	private ArchetypeFileRepository archetypeFileRepo;
	@Autowired
	private ArchetypeActionLogRepository archetypeActionLogRepo;

	private ADLSerializer adlSerilizer = new ADLSerializer();

	@Override
	public void createOrUpgradeArchetype(String adl, SourceType source,
			User user) throws VersionControlException {
		ADLParser adlParser = new ADLParser(adl);
		Archetype archetype;
		try {
			archetype = adlParser.parse();
		} catch (Exception ex) {
			throw new VersionControlException("Parse adl failed.", ex);
		}
		this.createOrUpgradeArchetype(archetype, source, user);
	}

	@Override
	public void createOrUpgradeArchetype(Archetype archetype,
			SourceType source, User user) throws VersionControlException {
		// Validate user authority

		// Get archetype master
		ArchetypeMaster archetypeMaster = this.archetypeMasterRepo
				.findByName(archetype.getArchetypeId().base());
		if (archetypeMaster == null) {
			archetypeMaster = constructArchetypeMaster(archetype);
		}
		// Construct archetype file
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findByName(archetype.getArchetypeId().getValue());
		if (archetypeFile != null) {
			throw new VersionControlException("Archetype "
					+ archetype.getArchetypeId().getValue()
					+ " already exists.");
		}
		archetypeFile = constructArchetypeFile(archetypeMaster, archetype,
				source, user);
		// Validate version and set internal version
		Optional<ArchetypeFile> latestArchetype = Optional
				.ofNullable(archetypeMaster.getLatestFile());
		if (latestArchetype.isPresent()) {
			Integer nextInternalVersion = latestArchetype.get()
					.getInternalVersion() + 1;
			if (!archetypeFile.getVersion().equals("v" + nextInternalVersion)) {
				throw new VersionControlException("Archetype "
						+ archetypeFile.getName() + "'s version should be v"
						+ nextInternalVersion + ".");
			}
			archetypeFile.setInternalVersion(nextInternalVersion);
			archetypeFile.setLastVersionArchetype(latestArchetype.get());
			// Validate lifecycle state
			if (!latestArchetype.get().getLifecycleState()
					.equals(LifecycleState.PUBLISHED)) {
				throw new VersionControlException(
						"Illeagal action Create for archetype "
								+ archetypeFile.getName()
								+ " because the last version archetype's lifecycle state is "
								+ latestArchetype.get().getLifecycleState()
								+ " instead of Published.");
			}
		} else {
			if (!archetypeFile.getVersion().equals("v1")) {
				throw new VersionControlException("Archetype "
						+ archetypeFile.getName() + "'s version should be v1.");
			}
			archetypeFile.setInternalVersion(1);
		}
		// Set lifecycle state
		archetypeFile.setLifecycleState(LifecycleState.DRAFT);
		// Save archetype file and master
		this.archetypeFileRepo.save(archetypeFile);
		archetypeMaster.setLatestFile(archetypeFile);
		archetypeMaster.setLatestFileInternalVersion(archetypeFile
				.getInternalVersion());
		archetypeMaster.setLatestFileLifecycleState(archetypeFile
				.getLifecycleState());
		archetypeMaster.setLatestFileVersion(archetypeFile.getVersion());
		this.archetypeMasterRepo.save(archetypeMaster);
		// Log action
		logArchetypeAction(archetypeFile, ActionType.CREATE, user);
	}

	public void createArchetype(Archetype archetype, SourceType source,
			User user) throws VersionControlException {
		// Validate user authority

		// Construct archetype master
		ArchetypeMaster archetypeMaster = this.archetypeMasterRepo
				.findByName(archetype.getArchetypeId().base());
		if (archetypeMaster != null) {
			throw new VersionControlException("Archetype master "
					+ archetype.getArchetypeId().base() + " already exists.");
		}
		archetypeMaster = constructArchetypeMaster(archetype);
		// Construct archetype file
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findByName(archetype.getArchetypeId().getValue());
		if (archetypeFile != null) {
			throw new VersionControlException("Archetype "
					+ archetype.getArchetypeId().getValue()
					+ " already exists.");
		}
		archetypeFile = constructArchetypeFile(archetypeMaster, archetype,
				source, user);
		// Validate version and set internal version
		if (!archetypeFile.getVersion().equals("v1")) {
			throw new VersionControlException("Archetype "
					+ archetypeFile.getName() + "'s version should be v1.");
		}
		archetypeFile.setInternalVersion(1);
		// validate and set lifecycle state
		archetypeFile.setLifecycleState(LifecycleState.DRAFT);
		// Save archetype file and master
		this.archetypeFileRepo.save(archetypeFile);
		archetypeMaster.setLatestFile(archetypeFile);
		archetypeMaster.setLatestFileInternalVersion(archetypeFile
				.getInternalVersion());
		archetypeMaster.setLatestFileLifecycleState(archetypeFile
				.getLifecycleState());
		archetypeMaster.setLatestFileVersion(archetypeFile.getVersion());
		this.archetypeMasterRepo.save(archetypeMaster);
		// Log action
		logArchetypeAction(archetypeFile, ActionType.CREATE, user);
	}

	public void upgradeArchetype(Archetype archetype, SourceType source,
			User user) throws VersionControlException {
		// Validate user authority

		// Get archetype master
		ArchetypeMaster archetypeMaster = this.archetypeMasterRepo
				.findByName(archetype.getArchetypeId().base());
		if (archetypeMaster == null) {
			throw new VersionControlException("Archetype master "
					+ archetype.getArchetypeId().base() + " does not exist.");
		}
		// Construct archetype file
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findByName(archetype.getArchetypeId().getValue());
		if (archetypeFile != null) {
			throw new VersionControlException("Archetype "
					+ archetype.getArchetypeId().getValue()
					+ " already exists.");
		}
		archetypeFile = constructArchetypeFile(archetypeMaster, archetype,
				source, user);
		// Validate version and set internal version
		Integer nextInternalVersion = archetypeMaster
				.getLatestFileInternalVersion() + 1;
		if (!archetypeFile.getVersion().equals("v" + nextInternalVersion)) {
			throw new VersionControlException("Archetype "
					+ archetypeFile.getName() + "'s version should be v"
					+ nextInternalVersion + ".");
		}
		archetypeFile.setInternalVersion(nextInternalVersion);
		archetypeFile.setLastVersionArchetype(archetypeMaster.getLatestFile());
		// validate and set lifecycle state
		if (!archetypeMaster.getLatestFile().getLifecycleState()
				.equals(LifecycleState.PUBLISHED)) {
			throw new VersionControlException(
					"Illeagal action Create for archetype "
							+ archetypeFile.getName()
							+ " because the last version archetype's lifecycle state is"
							+ archetypeFile.getLifecycleState()
							+ " instead of Published.");
		}
		archetypeFile.setLifecycleState(LifecycleState.DRAFT);
		// Save archetype file and master
		this.archetypeFileRepo.save(archetypeFile);
		archetypeMaster.setLatestFile(archetypeFile);
		archetypeMaster.setLatestFileInternalVersion(archetypeFile
				.getInternalVersion());
		archetypeMaster.setLatestFileLifecycleState(archetypeFile
				.getLifecycleState());
		archetypeMaster.setLatestFileVersion(archetypeFile.getVersion());
		this.archetypeMasterRepo.save(archetypeMaster);
		// Log action
		logArchetypeAction(archetypeFile, ActionType.CREATE, user);
	}

	@Override
	public void editArchetype(Integer archetypeId, String adl, User user)
			throws VersionControlException {
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findOne(archetypeId);
		if (archetypeFile == null) {
			throw new VersionControlException("Cannot find archetype with id:"
					+ archetypeId);
		}
		this.editArchetype(archetypeFile, adl, user);
	}

	@Override
	public void editArchetype(String archetypeName, String adl, User user)
			throws VersionControlException {
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findByName(archetypeName);
		if (archetypeFile == null) {
			throw new VersionControlException(
					"Cannot find archetype with name:" + archetypeName);
		}
		this.editArchetype(archetypeFile, adl, user);
	}

	@Override
	public void editArchetype(ArchetypeFile archetypeFile, String adl, User user)
			throws VersionControlException {
		ADLParser adlParser = new ADLParser(adl);
		Archetype archetype;
		try {
			archetype = adlParser.parse();
		} catch (Exception ex) {
			throw new VersionControlException("Parse adl failed.", ex);
		}
		this.editArchetype(archetypeFile, archetype, user);
	}

	@Override
	public void editArchetype(ArchetypeFile archetypeFile, Archetype archetype,
			User user) throws VersionControlException {
		// Validate user authority

		// Validate editor
		if (!archetypeFile.getEditor().equals(user)) {
			throw new VersionControlException("Only user"
					+ archetypeFile.getEditor().getName()
					+ " can Edit the archetype " + archetypeFile.getName()
					+ " not user " + user.getName() + ".");
		}
		// Validate and set lifecycle state
		if (!archetypeFile.getLifecycleState().equals(LifecycleState.DRAFT)) {
			throw new VersionControlException(
					"Illeagal action Edit for archetype "
							+ archetypeFile.getName()
							+ " because the archetype's lifecycle state is "
							+ archetypeFile.getLifecycleState()
							+ " instead of Draft.");
		}
		// Save archetype file
		try {
			archetypeFile.setContent(adlSerilizer.output(archetype));
		} catch (IOException ex) {
			throw new VersionControlException("Serilise adl failed.", ex);
		}
		this.archetypeFileRepo.save(archetypeFile);
		// Log action
		logArchetypeAction(archetypeFile, ActionType.EDIT, user);
	}

	@Override
	public void submitArchetype(Integer archetypeId, User user)
			throws VersionControlException {
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findOne(archetypeId);
		if (archetypeFile == null) {
			throw new VersionControlException("Cannot find archetype with id:"
					+ archetypeId);
		}
		this.submitArchetype(archetypeFile, user);
	}

	@Override
	public void submitArchetype(String archetypeName, User user)
			throws VersionControlException {
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findByName(archetypeName);
		if (archetypeFile == null) {
			throw new VersionControlException(
					"Cannot find archetype with name:" + archetypeName);
		}
		this.submitArchetype(archetypeFile, user);
	}

	@Override
	public void submitArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException {
		// Validate user authority

		// Validate editor
		if (!archetypeFile.getEditor().equals(user)) {
			throw new VersionControlException("Only user"
					+ archetypeFile.getEditor().getName()
					+ " can Submit the archetype " + archetypeFile.getName()
					+ " not user " + user.getName() + ".");
		}
		// Validate and set lifecycle state
		if (!archetypeFile.getLifecycleState().equals(LifecycleState.DRAFT)) {
			throw new VersionControlException(
					"Illeagal action Submit for archetype "
							+ archetypeFile.getName()
							+ " because the archetype's lifecycle state is "
							+ archetypeFile.getLifecycleState()
							+ " instead of Draft.");
		}
		archetypeFile.setLifecycleState(LifecycleState.TEAMREVIEW);
		// Save archetype file and master
		this.archetypeFileRepo.save(archetypeFile);
		ArchetypeMaster archetypeMaster = archetypeFile.getMaster();
		archetypeMaster.setLatestFileLifecycleState(archetypeFile
				.getLifecycleState());
		this.archetypeMasterRepo.save(archetypeMaster);
		// Log action
		logArchetypeAction(archetypeFile, ActionType.SUBMIT, user);
	}

	@Override
	public void approveArchetype(Integer archetypeId, User user)
			throws VersionControlException {
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findOne(archetypeId);
		if (archetypeFile == null) {
			throw new VersionControlException("Cannot find archetype with id:"
					+ archetypeId);
		}
		this.approveArchetype(archetypeFile, user);
	}

	@Override
	public void approveArchetype(String archetypeName, User user)
			throws VersionControlException {
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findByName(archetypeName);
		if (archetypeFile == null) {
			throw new VersionControlException(
					"Cannot find archetype with name:" + archetypeName);
		}
		this.approveArchetype(archetypeFile, user);
	}

	@Override
	public void approveArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException {
		// Validate user authority

		// Validate and set lifecycle state
		if (!archetypeFile.getLifecycleState()
				.equals(LifecycleState.TEAMREVIEW)) {
			throw new VersionControlException(
					"Illeagal action Approve for archetype "
							+ archetypeFile.getName()
							+ " because the archetype's lifecycle state is "
							+ archetypeFile.getLifecycleState()
							+ " instead of Teamreview.");
		}
		archetypeFile.setLifecycleState(LifecycleState.PUBLISHED);
		// Save archetype file
		this.archetypeFileRepo.save(archetypeFile);
		ArchetypeMaster archetypeMaster = archetypeFile.getMaster();
		// Update archetype master info
		archetypeMaster.setLatestFileLifecycleState(archetypeFile
				.getLifecycleState());
		ADLParser parser = new ADLParser(archetypeFile.getContent());
		Archetype archetype;
		try {
			archetype = parser.parse();
		} catch (Exception ex) {
			throw new VersionControlException("Parse archetype failed.", ex);
		}
		this.setArchetypeMasterBasicInfo(archetypeMaster, archetype);
		this.archetypeMasterRepo.save(archetypeMaster);
		// Log action
		logArchetypeAction(archetypeFile, ActionType.APPROVE, user);
	}

	@Override
	public void rejectArchetype(Integer archetypeId, User user)
			throws VersionControlException {
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findOne(archetypeId);
		if (archetypeFile == null) {
			throw new VersionControlException("Cannot find archetype with id:"
					+ archetypeId);
		}
		this.rejectArchetype(archetypeFile, user);
	}

	@Override
	public void rejectArchetype(String archetypeName, User user)
			throws VersionControlException {
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findByName(archetypeName);
		if (archetypeFile == null) {
			throw new VersionControlException(
					"Cannot find archetype with name:" + archetypeName);
		}
		this.rejectArchetype(archetypeFile, user);
	}

	@Override
	public void rejectArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException {
		// Validate user authority

		// Validate and set lifecycle state
		if (!archetypeFile.getLifecycleState()
				.equals(LifecycleState.TEAMREVIEW)) {
			throw new VersionControlException(
					"Illeagal action Reject for archetype "
							+ archetypeFile.getName()
							+ " because the archetype's lifecycle state is "
							+ archetypeFile.getLifecycleState()
							+ " instead of Teamreview.");
		}
		archetypeFile.setLifecycleState(LifecycleState.DRAFT);
		// Save archetype file and master
		this.archetypeFileRepo.save(archetypeFile);
		ArchetypeMaster archetypeMaster = archetypeFile.getMaster();
		archetypeMaster.setLatestFileLifecycleState(archetypeFile
				.getLifecycleState());
		this.archetypeMasterRepo.save(archetypeMaster);
		// Log action
		logArchetypeAction(archetypeFile, ActionType.REJECT, user);
	}
	
	@Override
	public void rejectAndRemoveArchetype(Integer archetypeId, User user)
			throws VersionControlException {
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findOne(archetypeId);
		if (archetypeFile == null) {
			throw new VersionControlException("Cannot find archetype with id:"
					+ archetypeId);
		}
		this.rejectAndRemoveArchetype(archetypeFile, user);
	}

	@Override
	public void rejectAndRemoveArchetype(String archetypeName, User user)
			throws VersionControlException {
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findByName(archetypeName);
		if (archetypeFile == null) {
			throw new VersionControlException(
					"Cannot find archetype with name:" + archetypeName);
		}
		this.rejectAndRemoveArchetype(archetypeFile, user);
	}

	@Override
	public void rejectAndRemoveArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException {
		// Validate user authority

		// Validate and set lifecycle state
		if (!archetypeFile.getLifecycleState()
				.equals(LifecycleState.TEAMREVIEW)) {
			throw new VersionControlException(
					"Illeagal action RejectAndRemove for archetype "
							+ archetypeFile.getName()
							+ " because the archetype's lifecycle state is "
							+ archetypeFile.getLifecycleState()
							+ " instead of Teamreview.");
		}
		// Save master
		ArchetypeMaster archetypeMaster = archetypeFile.getMaster();
		Optional<ArchetypeFile> lastArchetype = Optional
				.ofNullable(archetypeFile.getLastVersionArchetype());
		if (lastArchetype.isPresent()) {
			// Not the first file of master, update master
			archetypeMaster.setLatestFile(lastArchetype.get());
			archetypeMaster.setLatestFileLifecycleState(lastArchetype.get()
					.getLifecycleState());
			archetypeMaster.setLatestFileInternalVersion(lastArchetype.get()
					.getInternalVersion());
			archetypeMaster.setLatestFileVersion(lastArchetype.get()
					.getVersion());
			this.archetypeMasterRepo.save(archetypeMaster);
		} else {
			// The first file of master, remove master
			this.archetypeMasterRepo.delete(archetypeMaster);
		}
		this.archetypeFileRepo.delete(archetypeFile);
		// Log action
		logArchetypeAction(archetypeFile, ActionType.REJECT_AND_REMOVE, user);
	}

	protected ArchetypeMaster constructArchetypeMaster(Archetype archetype)
			throws VersionControlException {
		ArchetypeMaster archetypeMaster = new ArchetypeMaster();
		// Set archetype info
		this.setArchetypeMasterBasicInfo(archetypeMaster, archetype);

		// Set specialize archetype master info
		Optional<ArchetypeID> specialiseArchetypeId = Optional
				.ofNullable(archetype.getParentArchetypeId());
		if (specialiseArchetypeId.isPresent()) {
			ArchetypeMaster specialiseArchetypeMaster = this.archetypeMasterRepo
					.findByName(specialiseArchetypeId.get().base());
			if (specialiseArchetypeMaster == null) {
				throw new VersionControlException(
						"Specialise archetype master "
								+ specialiseArchetypeId.get().base()
								+ " does not exist.");
			}
			archetypeMaster
					.setSpecialiseArchetypeMaster(specialiseArchetypeMaster);
			archetypeMaster
					.setLatestSpecialiseArchetypeInternalVersion(specialiseArchetypeMaster
							.getLatestFileInternalVersion());
		}
		return archetypeMaster;
	}

	protected void setArchetypeMasterBasicInfo(ArchetypeMaster master,
			Archetype archetype) {
		master.setConceptName(archetype.getConceptName(archetype
				.getOriginalLanguage().getCodeString()));
		master.setName(archetype.getArchetypeId().base());
		master.setRmEntity(archetype.getArchetypeId().rmEntity());
		master.setRmName(archetype.getArchetypeId().rmName());
		master.setRmOrginator(archetype.getArchetypeId().rmOriginator());
		archetype
				.getDescription()
				.getDetails()
				.stream()
				.filter(detail -> detail.getLanguage().equals(
						archetype.getOriginalLanguage()))
				.findAny()
				.ifPresent(
						item -> {
							master.setPurpose(item.getPurpose());
							master.setKeywords(String.join(",",
									Optional.ofNullable(item.getKeywords())
											.orElse(new ArrayList<String>())));
							master.setUse(item.getUse());
							master.setMisuse(item.getMisuse());
							master.setCopyright(item.getCopyright());
						});
		master.setConceptDescription(Optional
				.ofNullable(
						archetype.getOntology()
								.termDefinition(
										archetype.getOriginalLanguage()
												.getCodeString(),
										archetype.getConcept()))
				.map(term -> term.getDescription()).orElse(""));
	}

	protected ArchetypeFile constructArchetypeFile(
			ArchetypeMaster archetypeMaster, Archetype archetype,
			SourceType source, User user) throws VersionControlException {
		ArchetypeFile archetypeFile = new ArchetypeFile();
		// Set management info
		archetypeFile.setEditor(user);
		archetypeFile.setMaster(archetypeMaster);
		archetypeFile.setSource(source);
		// Set archetype info
		archetypeFile.setName(archetype.getArchetypeId().getValue());
		archetypeFile.setVersion(archetype.getArchetypeId().versionID());
		try {
			archetypeFile.setContent(adlSerilizer.output(archetype));
		} catch (IOException ex) {
			throw new VersionControlException("Serilise adl failed.", ex);
		}
		// Set specialize archetype info
		Optional<ArchetypeID> specialiseArchetypeId = Optional
				.ofNullable(archetype.getParentArchetypeId());
		if (specialiseArchetypeId.isPresent()) {
			ArchetypeFile specialiseArchetypeFile = this.archetypeFileRepo
					.findByName(specialiseArchetypeId.get().getValue());
			if (specialiseArchetypeFile == null) {
				throw new VersionControlException("Specialise archetype "
						+ specialiseArchetypeId.get().getValue()
						+ " does not exist.");
			}
			if (specialiseArchetypeFile.getMaster() != archetypeMaster
					.getSpecialiseArchetypeMaster()) {
				throw new VersionControlException(
						"Specialise archetype master "
								+ specialiseArchetypeId.get().base()
								+ " does not match.");
			}
			archetypeFile.setSpecialiseArchetype(specialiseArchetypeFile);
			archetypeFile
					.setSpecialiseArchetypeInternalVersion(specialiseArchetypeFile
							.getInternalVersion());
			archetypeFile.setSpecialiseArchetypeVersion(specialiseArchetypeFile
					.getVersion());
			archetypeMaster
					.setCurrentSpecialiseArchetypeInternalVersion(specialiseArchetypeFile
							.getInternalVersion());
			archetypeMaster
					.setCurrentSpecialiseArchetypeVersion(specialiseArchetypeFile
							.getVersion());
		} else {
			if (archetypeMaster.getSpecialiseArchetypeMaster() != null) {
				throw new VersionControlException("Archetype "
						+ archetypeFile.getName()
						+ " should specialise "
						+ archetypeMaster.getSpecialiseArchetypeMaster()
								.getName());
			}
		}
		return archetypeFile;
	}

	protected void logArchetypeAction(ArchetypeFile archetypeFile,
			ActionType actionType, User user) {
		ArchetypeActionLog log = new ArchetypeActionLog();
		log.setActionType(actionType);
		log.setMaster(archetypeFile.getMaster());
		log.setVersion(archetypeFile.getVersion());
		log.setOperator(user);
		log.setOperatorName(user.getName());
		log.setRecordTime(Calendar.getInstance());
		log.setLifecycleState(archetypeFile.getLifecycleState());
		this.archetypeActionLogRepo.save(log);
	}

}
