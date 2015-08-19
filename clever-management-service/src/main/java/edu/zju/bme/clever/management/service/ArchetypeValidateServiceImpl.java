package edu.zju.bme.clever.management.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.openehr.am.archetype.Archetype;
import org.openehr.am.archetype.constraintmodel.CObject;
import org.openehr.am.archetype.ontology.ArchetypeTerm;
import org.openehr.am.archetype.ontology.OntologyDefinitions;
import org.openehr.rm.support.identification.ArchetypeID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import se.acode.openehr.parser.ADLParser;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.ArchetypeRevisionFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeVersionMaster;
import edu.zju.bme.clever.management.service.entity.FileProcessResult;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.FileProcessResult.FileStatus;
import edu.zju.bme.clever.management.service.repository.ArchetypeMasterRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeRevisionFileRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeVersionMasterRepository;

@Service
public class ArchetypeValidateServiceImpl implements ArchetypeValidateService {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ArchetypeMasterRepository masterRepo;
	@Autowired
	private ArchetypeVersionMasterRepository versionMasterRepo;
	@Autowired
	private ArchetypeRevisionFileRepository revisionFileRepo;

	public FileProcessResult validateConsistency(Archetype archetype) {
		String archetypeId = archetype.getArchetypeId().getValue();
		FileProcessResult result = new FileProcessResult();
		result.setName(archetypeId);
		result.setStatus(FileStatus.VALID);
		ArchetypeRevisionFile revisionFile = this.revisionFileRepo
				.findByName(archetypeId);
		// Validate existence
		if (revisionFile != null) {
			result.setStatus(FileProcessResult.FileStatus.INVALID);
			result.appendMessage("Archetype already exists. ");
		}
		ArchetypeVersionMaster versionMaster = this.versionMasterRepo
				.findByName(archetypeId.substring(0,
						archetypeId.lastIndexOf(".")));
		// Validate version
		String expectedVersion;
		if (versionMaster == null) {
			// First revision
			ArchetypeMaster master = this.masterRepo.findByName(archetypeId
					.substring(0, archetypeId.lastIndexOf(".v")));
			if (master == null) {
				expectedVersion = "v1.1";
			} else {
				expectedVersion = "v"
						+ (master.getLatestVersionMasterSerialVersion() + 1)
						+ ".1";
			}
		} else {
			expectedVersion = versionMaster.getVersion() + "."
					+ (versionMaster.getLatestRevisionFileSerialVersion() + 1);
		}
		if (!archetype.getArchetypeId().versionID().equals(expectedVersion)) {
			result.setStatus(FileStatus.INVALID);
			result.setMessage("Archetype's version should be "
					+ expectedVersion + ". ");
		}
		// Validate specialise archetype
		ArchetypeID specialiseArchetypeId = archetype.getParentArchetypeId();
		if (specialiseArchetypeId != null) {
			ArchetypeRevisionFile specialiseRevisionFile = this.revisionFileRepo
					.findByName(specialiseArchetypeId.getValue());
			if (specialiseRevisionFile == null
					|| !specialiseRevisionFile.getLifecycleState().equals(
							LifecycleState.PUBLISHED)) {
				result.setStatus(FileStatus.INVALID);
				result.setMessage("Cannot find PUBLISHED specialise archetype "
						+ specialiseArchetypeId.getValue() + ". ");
			}
		}
		return result;
	}
}
