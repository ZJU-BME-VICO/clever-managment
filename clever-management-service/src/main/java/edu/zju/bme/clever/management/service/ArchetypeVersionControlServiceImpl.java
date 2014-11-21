package edu.zju.bme.clever.management.service;

import java.io.IOException;
import java.util.Calendar;
import java.util.Optional;

import org.openehr.am.archetype.Archetype;
import org.openehr.am.serialize.ADLSerializer;
import org.openehr.rm.support.identification.ArchetypeID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.ArchetypeActionLog;
import edu.zju.bme.clever.management.service.entity.ArchetypeFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.entity.AbstractFile.SourceType;
import edu.zju.bme.clever.management.service.entity.ArchetypeActionLog.ActionType;
import edu.zju.bme.clever.management.service.exception.VersionControlException;
import edu.zju.bme.clever.management.service.repository.ArchetypeActionLogRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeFileRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeMasterRepository;

@Service
@Transactional
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
			if (!archetypeMaster.getLatestFile().getLifecycleState()
					.equals(LifecycleState.Published)) {
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
		archetypeFile.setLifecycleState(LifecycleState.Draft);
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
		logArchetypeAction(archetypeFile, ActionType.Create, user);
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
		archetypeFile.setLifecycleState(LifecycleState.Draft);
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
		logArchetypeAction(archetypeFile, ActionType.Create, user);
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
				.equals(LifecycleState.Published)) {
			throw new VersionControlException(
					"Illeagal action Create for archetype "
							+ archetypeFile.getName()
							+ " because the last version archetype's lifecycle state is"
							+ archetypeFile.getLifecycleState()
							+ " instead of Published.");
		}
		archetypeFile.setLifecycleState(LifecycleState.Draft);
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
		logArchetypeAction(archetypeFile, ActionType.Create, user);
	}

	@Override
	public void editArchetype(Archetype archetype, SourceType source, User user)
			throws VersionControlException {
		// Validate user authority

		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findByName(archetype.getArchetypeId().getValue());
		if (archetypeFile == null) {
			throw new VersionControlException("Archetype "
					+ archetype.getArchetypeId().getValue()
					+ " does not exist.");
		}
		// Validate editor
		if (!archetypeFile.getEditor().equals(user)) {
			throw new VersionControlException("Only user"
					+ archetypeFile.getEditor().getName()
					+ " can Edit the archetype " + archetypeFile.getName()
					+ " not user " + user.getName() + ".");
		}
		// Validate and set lifecycle state
		if (!archetypeFile.getLifecycleState().equals(LifecycleState.Draft)) {
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
		logArchetypeAction(archetypeFile, ActionType.Edit, user);
	}

	@Override
	public void submitArchetype(Archetype archetype, User user)
			throws VersionControlException {
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findByName(archetype.getArchetypeId().getValue());
		if (archetypeFile == null) {
			throw new VersionControlException("Archetype "
					+ archetype.getArchetypeId().getValue()
					+ " does not exist.");
		}
		submitArchetype(archetypeFile, user);
	}

	@Override
	public void submitArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException {
		// Validate user authority

		if (archetypeFile.getId() == null) {
			throw new VersionControlException("Archetype does not exist.");
		}
		// Validate editor
		if (!archetypeFile.getEditor().equals(user)) {
			throw new VersionControlException("Only user"
					+ archetypeFile.getEditor().getName()
					+ " can Submit the archetype " + archetypeFile.getName()
					+ " not user " + user.getName() + ".");
		}
		// Validate and set lifecycle state
		if (!archetypeFile.getLifecycleState().equals(LifecycleState.Draft)) {
			throw new VersionControlException(
					"Illeagal action Submit for archetype "
							+ archetypeFile.getName()
							+ " because the archetype's lifecycle state is "
							+ archetypeFile.getLifecycleState()
							+ " instead of Draft.");
		}
		archetypeFile.setLifecycleState(LifecycleState.Teamreview);
		// Save archetype file and master
		this.archetypeFileRepo.save(archetypeFile);
		ArchetypeMaster archetypeMaster = archetypeFile.getMaster();
		archetypeMaster.setLatestFileLifecycleState(archetypeFile
				.getLifecycleState());
		this.archetypeMasterRepo.save(archetypeMaster);
		// Log action
		logArchetypeAction(archetypeFile, ActionType.Submit, user);
	}

	@Override
	public void approveArchetype(Archetype archetype, User user)
			throws VersionControlException {
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findByName(archetype.getArchetypeId().getValue());
		if (archetypeFile == null) {
			throw new VersionControlException("Archetype "
					+ archetype.getArchetypeId().getValue()
					+ " does not exist.");
		}
		approveArchetype(archetypeFile, user);
	}

	@Override
	public void approveArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException {
		// Validate user authority

		if (archetypeFile.getId() == null) {
			throw new VersionControlException("Archetype does not exist.");
		}
		// Validate and set lifecycle state
		if (!archetypeFile.getLifecycleState()
				.equals(LifecycleState.Teamreview)) {
			throw new VersionControlException(
					"Illeagal action Approve for archetype "
							+ archetypeFile.getName()
							+ " because the archetype's lifecycle state is "
							+ archetypeFile.getLifecycleState()
							+ " instead of Teamreview.");
		}
		archetypeFile.setLifecycleState(LifecycleState.Published);
		// Save archetype file and master
		this.archetypeFileRepo.save(archetypeFile);
		ArchetypeMaster archetypeMaster = archetypeFile.getMaster();
		archetypeMaster.setLatestFileLifecycleState(archetypeFile
				.getLifecycleState());
		this.archetypeMasterRepo.save(archetypeMaster);
		// Log action
		logArchetypeAction(archetypeFile, ActionType.Approve, user);
	}

	@Override
	public void rejectArchetype(Archetype archetype, User user)
			throws VersionControlException {
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findByName(archetype.getArchetypeId().getValue());
		if (archetypeFile == null) {
			throw new VersionControlException("Archetype "
					+ archetype.getArchetypeId().getValue()
					+ " does not exist.");
		}
		rejectArchetype(archetypeFile, user);
	}

	@Override
	public void rejectArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException {
		// Validate user authority

		if (archetypeFile.getId() == null) {
			throw new VersionControlException("Archetype does not exist.");
		}
		// Validate and set lifecycle state
		if (!archetypeFile.getLifecycleState()
				.equals(LifecycleState.Teamreview)) {
			throw new VersionControlException(
					"Illeagal action Reject for archetype "
							+ archetypeFile.getName()
							+ " because the archetype's lifecycle state is "
							+ archetypeFile.getLifecycleState()
							+ " instead of Teamreview.");
		}
		archetypeFile.setLifecycleState(LifecycleState.Draft);
		// Save archetype file and master
		this.archetypeFileRepo.save(archetypeFile);
		ArchetypeMaster archetypeMaster = archetypeFile.getMaster();
		archetypeMaster.setLatestFileLifecycleState(archetypeFile
				.getLifecycleState());
		this.archetypeMasterRepo.save(archetypeMaster);
		// Log action
		logArchetypeAction(archetypeFile, ActionType.Reject, user);
	}

	@Override
	public void rejectAndRemoveArchetype(Archetype archetype, User user)
			throws VersionControlException {
		ArchetypeFile archetypeFile = this.archetypeFileRepo
				.findByName(archetype.getArchetypeId().getValue());
		if (archetypeFile == null) {
			throw new VersionControlException("Archetype "
					+ archetype.getArchetypeId().getValue()
					+ " does not exist.");
		}
		rejectAndRemoveArchetype(archetypeFile, user);
	}

	@Override
	public void rejectAndRemoveArchetype(ArchetypeFile archetypeFile, User user)
			throws VersionControlException {
		// Validate user authority

		if (archetypeFile.getId() == null) {
			throw new VersionControlException("Archetype does not exist.");
		}
		// Validate and set lifecycle state
		if (!archetypeFile.getLifecycleState()
				.equals(LifecycleState.Teamreview)) {
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
		archetypeMaster.setLatestFile(lastArchetype.orElse(null));
		archetypeMaster.setLatestFileLifecycleState(lastArchetype.map(
				archetype -> archetype.getLifecycleState()).orElse(null));
		archetypeMaster.setLatestFileInternalVersion(lastArchetype.map(
				archetype -> archetype.getInternalVersion()).orElse(null));
		archetypeMaster.setLatestFileVersion(lastArchetype.map(
				archetype -> archetype.getVersion()).orElse(null));
		this.archetypeMasterRepo.save(archetypeMaster);
		this.archetypeFileRepo.delete(archetypeFile);
		// Log action
		logArchetypeAction(archetypeFile, ActionType.RejectAndRelease, user);
	}

	protected ArchetypeMaster constructArchetypeMaster(Archetype archetype)
			throws VersionControlException {
		ArchetypeMaster archetypeMaster = new ArchetypeMaster();
		// Set archetype info
		archetypeMaster.setConceptName(archetype.getConceptName(archetype
				.getOriginalLanguage().getCodeString()));
		archetypeMaster.setName(archetype.getArchetypeId().base());
		archetypeMaster.setRmEntity(archetype.getArchetypeId().rmEntity());
		archetypeMaster.setRmName(archetype.getArchetypeId().rmName());
		archetypeMaster.setRmOrginator(archetype.getArchetypeId()
				.rmOriginator());
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
			ArchetypeMaster specialiseArchetypeMaster = this.archetypeMasterRepo
					.findByName(specialiseArchetypeId.get().base());
			if (specialiseArchetypeMaster != archetypeMaster
					.getSpecialiseArchetypeMaster()) {
				throw new VersionControlException(
						"Specialise archetype master "
								+ specialiseArchetypeId.get().base()
								+ " does not exist.");
			}
			ArchetypeFile specialiseArchetypeFile = this.archetypeFileRepo
					.findByName(specialiseArchetypeId.get().getValue());
			if (specialiseArchetypeFile == null) {
				throw new VersionControlException("Specialise archetype "
						+ specialiseArchetypeId.get().getValue()
						+ " does not exist.");
			}
			archetypeFile.setSpecialiseArchetype(specialiseArchetypeFile);
			archetypeFile
					.setSpecialiseArchetypeInternalVersion(specialiseArchetypeFile
							.getInternalVersion());
			archetypeFile.setSpecialiseArchetypeVersion(specialiseArchetypeFile
					.getVersion());
			archetypeMaster
					.setCurrentSpecialiseArchetypeInternalVersion(archetypeFile
							.getSpecialiseArchetypeInternalVersion());
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
		log.setArchetypeMaster(archetypeFile.getMaster());
		log.setArchetypeVersion(archetypeFile.getVersion());
		log.setOperator(user);
		log.setRecordTime(Calendar.getInstance());
		this.archetypeActionLogRepo.saveAndFlush(log);
	}

	protected boolean validateUserAuthority(User user) {
		return true;
	}

}
