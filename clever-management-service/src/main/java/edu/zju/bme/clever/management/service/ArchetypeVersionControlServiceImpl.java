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
import edu.zju.bme.clever.management.service.entity.AbstractMaster;
import edu.zju.bme.clever.management.service.entity.ArchetypeActionLog;
import edu.zju.bme.clever.management.service.entity.ArchetypeRevisionFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.ArchetypeVersionMaster;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.entity.ActionType;
import edu.zju.bme.clever.management.service.exception.VersionControlException;
import edu.zju.bme.clever.management.service.repository.ArchetypeActionLogRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeMaster1Repository;
import edu.zju.bme.clever.management.service.repository.ArchetypeRevisionFileRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeVersionMasterRepository;
import edu.zju.bme.clever.management.service.util.CleverUtils;

@Service
@Transactional(rollbackFor = { Exception.class })
public class ArchetypeVersionControlServiceImpl implements
		ArchetypeVersionControlService {

	@Autowired
	private ArchetypeMaster1Repository masterRepo;
	@Autowired
	private ArchetypeVersionMasterRepository versionMasterRepo;
	@Autowired
	private ArchetypeRevisionFileRepository revisionFileRepo;
	@Autowired
	private ArchetypeActionLogRepository actionLogRepo;

	private ADLSerializer adlSerilizer = new ADLSerializer();

	@Override
	public void acceptArchetype(String adl, User user)
			throws VersionControlException {
		ADLParser adlParser = new ADLParser(adl);
		Archetype archetype;
		try {
			archetype = adlParser.parse();
		} catch (Exception ex) {
			throw new VersionControlException("Parse adl failed.", ex);
		}
		this.acceptArchetype(archetype, user);
	}

	@Override
	public void acceptArchetype(Archetype archetype, User user)
			throws VersionControlException {
		String archetypeId = archetype.getArchetypeId().getValue();
		String archetypeMasterName = archetype.getArchetypeId().base();
		String archetypeVersion = archetype.getArchetypeId().versionID();
		ArchetypeMaster master = this.masterRepo
				.findByName(archetypeMasterName);
		if (master == null) {
			master = this.newMaster(archetype);
		}
		// Example openEHR-EHR-CLUSTER.organisation.v1.1
		String versionMasterName = CleverUtils
				.extractVersionMasterName(archetypeId);
		if (archetypeId == null) {
			throw new VersionControlException("Archetype name is unqualified.");
		}
		ArchetypeVersionMaster versionMaster = this.versionMasterRepo
				.findByName(versionMasterName);
		if (versionMaster == null) {
			versionMaster = this.newVersionMaster(master, archetype);
		}
		ArchetypeRevisionFile revisionFile = this.revisionFileRepo
				.findByName(archetypeId);
		if (revisionFile != null) {
			throw new VersionControlException("Archetype " + archetypeId
					+ " alread exist");
		}
		revisionFile = this.newRevisionFile(versionMaster, archetype, user);
	}

	private ArchetypeMaster newMaster(Archetype archetype)
			throws VersionControlException {
		ArchetypeMaster master = new ArchetypeMaster();
		// Set basic info
		this.setMasterBasicInfo(master, archetype);
		// Validate and set specialise archetype info
		ArchetypeID specialiseArchetypeId = archetype.getParentArchetypeId();
		ArchetypeRevisionFile specialiseArchetypeRevisionFile = null;
		if (specialiseArchetypeId != null) {
			specialiseArchetypeRevisionFile = this.revisionFileRepo
					.findByName(specialiseArchetypeId.getValue());
			// Whether exist
			if (specialiseArchetypeRevisionFile == null) {
				throw new VersionControlException("Specialise archetype "
						+ specialiseArchetypeId.getValue() + " does not exist.");
			}
			master.setSpecialiseArchetypeMaster(specialiseArchetypeRevisionFile
					.getVersionMaster().getArchetypeMaster());
		}
		this.masterRepo.save(master);
		return master;
	}

	private ArchetypeVersionMaster newVersionMaster(ArchetypeMaster master,
			Archetype archetype) throws VersionControlException {
		ArchetypeVersionMaster nextVersionMaster = new ArchetypeVersionMaster();
		ArchetypeVersionMaster latestVersionMaster = master
				.getLatestVersionMaster();
		// Validate and set specialise archetype info
		ArchetypeID specialiseArchetypeId = archetype.getParentArchetypeId();
		ArchetypeRevisionFile specialiseArchetypeRevisionFile = null;
		if (specialiseArchetypeId != null) {
			// Whether should specialise
			if (master.getSpecialiseArchetypeMaster() == null) {
				throw new VersionControlException("Archetype "
						+ archetype.getArchetypeId().getValue()
						+ " should specialise no archetype");
			}
			specialiseArchetypeRevisionFile = this.revisionFileRepo
					.findByName(specialiseArchetypeId.getValue());
			// Whether exist
			if (specialiseArchetypeRevisionFile == null) {
				throw new VersionControlException("Specialise archetype "
						+ specialiseArchetypeId.getValue() + " does not exist.");
			}
			// Whether specialise from the same master
			if (!master.getSpecialiseArchetypeMaster().equals(
					specialiseArchetypeRevisionFile.getVersionMaster()
							.getArchetypeMaster())) {
				throw new VersionControlException("Specialise archetype "
						+ specialiseArchetypeId.getValue()
						+ " should be one of the revisions of master "
						+ master.getName());
			}
			nextVersionMaster
					.setSpecialiseArchetypeVersionMaster(specialiseArchetypeRevisionFile
							.getVersionMaster());
		}
		Integer nextSerialVersion;
		if (latestVersionMaster != null) {
			nextSerialVersion = latestVersionMaster.getSerialVersion() + 1;
			nextVersionMaster.setLastVersionMaster(latestVersionMaster);
		} else {
			nextSerialVersion = 1;
		}
		// Set basic info
		nextVersionMaster.setArchetypeMaster(master);
		nextVersionMaster.setSerialVersion(nextSerialVersion);
		nextVersionMaster.setVersion("v" + nextSerialVersion);
		nextVersionMaster.setName(archetype.getArchetypeId().base() + "."
				+ nextVersionMaster.getVersion());
		// Set archetype info
		this.setMasterBasicInfo(nextVersionMaster, archetype);
		this.versionMasterRepo.save(nextVersionMaster);
		// Update master
		master.setLatestVersionMaster(nextVersionMaster);
		master.setLatestVersionMasterVersion(nextVersionMaster.getVersion());
		master.setLatestVersionMasterSerialVersion(nextVersionMaster
				.getSerialVersion());
		this.masterRepo.save(master);
		return nextVersionMaster;
	}

	private ArchetypeRevisionFile newRevisionFile(
			ArchetypeVersionMaster versionMaster, Archetype archetype, User user)
			throws VersionControlException {
		// Validate user authority

		ArchetypeRevisionFile nextRevisionFile = new ArchetypeRevisionFile();
		ArchetypeRevisionFile latestRevisionFile = versionMaster
				.getLatestRevisionFile();
		// Validate specialise archetype
		ArchetypeID specialiseArchetypeId = archetype.getParentArchetypeId();
		ArchetypeRevisionFile specialiseArchetypeRevisionFile = null;
		if (specialiseArchetypeId != null) {
			// Whether should specialise
			if (versionMaster.getSpecialiseArchetypeVersionMaster() == null) {
				throw new VersionControlException("Archetype "
						+ archetype.getArchetypeId().getValue()
						+ " should specialise no archetype");
			}
			specialiseArchetypeRevisionFile = this.revisionFileRepo
					.findByName(specialiseArchetypeId.getValue());
			// Whether exist
			if (specialiseArchetypeRevisionFile == null) {
				throw new VersionControlException("Specialise archetype "
						+ specialiseArchetypeId.getValue() + " does not exist.");
			}
			// Whether specialise from the same version master
			if (!specialiseArchetypeRevisionFile.getVersionMaster().equals(
					versionMaster.getSpecialiseArchetypeVersionMaster())) {
				throw new VersionControlException("Specialise archetype "
						+ specialiseArchetypeId.getValue()
						+ " should be one of the revisions of "
						+ versionMaster.getName());
			}
		}
		Integer nextSerialVersion;
		if (latestRevisionFile != null) {
			nextSerialVersion = latestRevisionFile.getSerialVersion() + 1;
			nextRevisionFile.setLastRevisionFile(latestRevisionFile);
			// Validate lifecycle state
			if (!latestRevisionFile.getLifecycleState().equals(
					LifecycleState.PUBLISHED)) {
				throw new VersionControlException(
						"The latest revision archetype "
								+ latestRevisionFile.getName()
								+ "'s lifecycle state is not PUBLISHED.");
			}
			// Validate specialise archetype
			if (specialiseArchetypeRevisionFile != null) {
				// Validate specialise archetype order
				if (specialiseArchetypeRevisionFile.getSerialVersion() < latestRevisionFile
						.getSpecialiseArchetypeRevisionFileSerialVersion()) {
					throw new VersionControlException(
							"Specialise archetype "
									+ specialiseArchetypeId.getValue()
									+ "'version should not be earlier "
									+ latestRevisionFile
											.getSpecialiseArchetypeRevisionFileVersion());
				}
			}
		} else {
			// It is a new version master
			nextSerialVersion = 1;
		}
		// Construct next revision file
		nextRevisionFile.setEditor(user);
		nextRevisionFile.setVersionMaster(versionMaster);
		nextRevisionFile.setVersionMasterVersion(versionMaster.getVersion());
		nextRevisionFile.setLifecycleState(LifecycleState.DRAFT);
		nextRevisionFile.setName(archetype.getArchetypeId().getValue());
		nextRevisionFile.setSerialVersion(nextSerialVersion);
		nextRevisionFile.setVersion(versionMaster.getVersion() + "."
				+ nextSerialVersion);
		if (specialiseArchetypeRevisionFile != null) {
			nextRevisionFile
					.setSpecialiseArchetypeRevisionFile(specialiseArchetypeRevisionFile);
			nextRevisionFile
					.setSpecialiseArchetypeRevisionFileSerialVersion(specialiseArchetypeRevisionFile
							.getSerialVersion());
			nextRevisionFile
					.setSpecialiseArchetypeRevisionFileVersion(specialiseArchetypeRevisionFile
							.getVersion());
		}
		// Validate archetype version
		if (!archetype.getArchetypeId().versionID()
				.equals(nextRevisionFile.getVersion())) {
			throw new VersionControlException("Archetype "
					+ archetype.getArchetypeId().getValue()
					+ "'s version should be " + nextRevisionFile.getVersion());
		}
		nextRevisionFile.setAdl(this.serializeArchetype(archetype));
		this.revisionFileRepo.save(nextRevisionFile);
		// Update version master
		versionMaster.setLatestRevisionFile(nextRevisionFile);
		versionMaster.setLatestRevisionFileLifecycleState(nextRevisionFile
				.getLifecycleState());
		versionMaster.setLatestRevisionFileSerialVersion(nextRevisionFile
				.getSerialVersion());
		versionMaster.setLatestRevisionFileVersion(nextRevisionFile
				.getVersion());
		this.versionMasterRepo.save(versionMaster);
		// Log action
		this.logArchetypeAction(nextRevisionFile, ActionType.NEW_REVISION, user);
		return nextRevisionFile;
	}

	private String serializeArchetype(Archetype archetype)
			throws VersionControlException {
		try {
			return adlSerilizer.output(archetype);
		} catch (IOException ex) {
			throw new VersionControlException("Serilise adl failed.", ex);
		}
	}

	@Override
	public void editArchetype(Integer archetypeId, String adl, User user)
			throws VersionControlException {
		ArchetypeRevisionFile archetypeFile = this.revisionFileRepo
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
		ArchetypeRevisionFile archetypeFile = this.revisionFileRepo
				.findByName(archetypeName);
		if (archetypeFile == null) {
			throw new VersionControlException(
					"Cannot find archetype with name:" + archetypeName);
		}
		this.editArchetype(archetypeFile, adl, user);
	}

	@Override
	public void editArchetype(ArchetypeRevisionFile archetypeFile, String adl,
			User user) throws VersionControlException {
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
	public void editArchetype(ArchetypeRevisionFile archetypeFile,
			Archetype archetype, User user) throws VersionControlException {
		// Log action
		logArchetypeAction(archetypeFile, ActionType.EDIT, user);
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
		archetypeFile.setAdl(this.serializeArchetype(archetype));
		this.revisionFileRepo.save(archetypeFile);
	}

	@Override
	public void submitArchetype(Integer archetypeId, User user)
			throws VersionControlException {
		ArchetypeRevisionFile archetypeFile = this.revisionFileRepo
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
		ArchetypeRevisionFile archetypeFile = this.revisionFileRepo
				.findByName(archetypeName);
		if (archetypeFile == null) {
			throw new VersionControlException(
					"Cannot find archetype with name:" + archetypeName);
		}
		this.submitArchetype(archetypeFile, user);
	}

	@Override
	public void submitArchetype(ArchetypeRevisionFile archetypeFile, User user)
			throws VersionControlException {
		// Log action
		logArchetypeAction(archetypeFile, ActionType.SUBMIT, user);
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
		this.revisionFileRepo.save(archetypeFile);
		// Update archetype version master
		ArchetypeVersionMaster archetypeVersionMaster = archetypeFile
				.getVersionMaster();
		archetypeVersionMaster
				.setLatestRevisionFileLifecycleState(archetypeFile
						.getLifecycleState());
		this.versionMasterRepo.save(archetypeVersionMaster);
	}

	@Override
	public void approveArchetype(Integer archetypeId, User user)
			throws VersionControlException {
		ArchetypeRevisionFile archetypeFile = this.revisionFileRepo
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
		ArchetypeRevisionFile archetypeFile = this.revisionFileRepo
				.findByName(archetypeName);
		if (archetypeFile == null) {
			throw new VersionControlException(
					"Cannot find archetype with name:" + archetypeName);
		}
		this.approveArchetype(archetypeFile, user);
	}

	@Override
	public void approveArchetype(ArchetypeRevisionFile archetypeFile, User user)
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
		this.revisionFileRepo.save(archetypeFile);
		// Update archetype master info
		ArchetypeVersionMaster archetypeMaster = archetypeFile
				.getVersionMaster();
		archetypeMaster.setLatestRevisionFileLifecycleState(archetypeFile
				.getLifecycleState());
		this.versionMasterRepo.save(archetypeMaster);
		// Log action
		logArchetypeAction(archetypeFile, ActionType.APPROVE, user);
	}

	@Override
	public void rejectArchetype(Integer archetypeId, User user)
			throws VersionControlException {
		ArchetypeRevisionFile archetypeFile = this.revisionFileRepo
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
		ArchetypeRevisionFile archetypeFile = this.revisionFileRepo
				.findByName(archetypeName);
		if (archetypeFile == null) {
			throw new VersionControlException(
					"Cannot find archetype with name:" + archetypeName);
		}
		this.rejectArchetype(archetypeFile, user);
	}

	@Override
	public void rejectArchetype(ArchetypeRevisionFile archetypeFile, User user)
			throws VersionControlException {
		// Log action
		logArchetypeAction(archetypeFile, ActionType.REJECT, user);
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
		// Save archetype file
		this.revisionFileRepo.save(archetypeFile);
		// Update version master
		ArchetypeVersionMaster archetypeMaster = archetypeFile
				.getVersionMaster();
		archetypeMaster.setLatestRevisionFileLifecycleState(archetypeFile
				.getLifecycleState());
		this.versionMasterRepo.save(archetypeMaster);
	}

	@Override
	public void rejectAndRemoveArchetype(Integer archetypeId, User user)
			throws VersionControlException {
		ArchetypeRevisionFile archetypeFile = this.revisionFileRepo
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
		ArchetypeRevisionFile archetypeFile = this.revisionFileRepo
				.findByName(archetypeName);
		if (archetypeFile == null) {
			throw new VersionControlException(
					"Cannot find archetype with name:" + archetypeName);
		}
		this.rejectAndRemoveArchetype(archetypeFile, user);
	}

	@Override
	public void rejectAndRemoveArchetype(ArchetypeRevisionFile archetypeFile,
			User user) throws VersionControlException {
		// Log action
		logArchetypeAction(archetypeFile, ActionType.REJECT_AND_REMOVE, user);
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
		ArchetypeVersionMaster archetypeVersionMaster = archetypeFile
				.getVersionMaster();
		ArchetypeRevisionFile lastArchetype = archetypeFile
				.getLastRevisionFile();
		if (lastArchetype != null) {
			// Not the first file of master, update master
			archetypeVersionMaster.setLatestRevisionFile(lastArchetype);
			archetypeVersionMaster
					.setLatestRevisionFileLifecycleState(lastArchetype
							.getLifecycleState());
			archetypeVersionMaster
					.setLatestRevisionFileSerialVersion(lastArchetype
							.getSerialVersion());
			archetypeVersionMaster.setLatestRevisionFileVersion(lastArchetype
					.getVersion());
			this.versionMasterRepo.save(archetypeVersionMaster);

			this.revisionFileRepo.delete(archetypeFile);
		} else {
			// The first file of master, remove master
			if (archetypeVersionMaster.getLastVersionMaster() != null) {
				this.versionMasterRepo.delete(archetypeVersionMaster);
			} else {
				this.masterRepo.delete(archetypeVersionMaster
						.getArchetypeMaster());
			}
		}
	}

	protected void setMasterBasicInfo(AbstractMaster master, Archetype archetype) {
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

	protected void logArchetypeAction(ArchetypeRevisionFile archetypeFile,
			ActionType actionType, User user) {
		ArchetypeActionLog log = new ArchetypeActionLog();
		log.setActionType(actionType);
		log.setArchetypeVersionMaster(archetypeFile.getVersionMaster());
		log.setVersion(archetypeFile.getVersion());
		log.setOperator(user);
		log.setOperatorName(user.getName());
		log.setRecordTime(Calendar.getInstance());
		log.setLifecycleState(archetypeFile.getLifecycleState());
		this.actionLogRepo.save(log);
	}

}
