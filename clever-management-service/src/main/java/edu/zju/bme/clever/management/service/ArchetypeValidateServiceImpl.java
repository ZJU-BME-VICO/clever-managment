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
import edu.zju.bme.clever.management.service.entity.FileProcessResult;
import edu.zju.bme.clever.management.service.entity.ArchetypeFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.repository.ArchetypeFileRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeMasterRepository;

@Service
public class ArchetypeValidateServiceImpl implements ArchetypeValidateService {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ArchetypeMasterRepository archetypeMasterRepo;
	@Autowired
	private ArchetypeFileRepository archetypeFileRepo;

	@Override
	public void validateConsistency(Map<String, Archetype> archetypes,
			Map<String, FileProcessResult> results) {
		Map<String, Archetype> validatedArchetypes = new HashMap<String, Archetype>();
		Map<String, Archetype> specialiseValidationFailedArchetypes = new HashMap<String, Archetype>();
		archetypes.forEach((archetypeId, archetype) -> {
			FileProcessResult result = results.get(archetypeId);
			Optional<ArchetypeFile> archetypeFile = Optional
					.ofNullable(this.archetypeFileRepo.findByName(archetype
							.getArchetypeId().getValue()));
			Optional<ArchetypeMaster> archetypeMaster = Optional
					.ofNullable(this.archetypeMasterRepo.findByName(archetype
							.getArchetypeId().base()));
			// Validate existence
				this.validateExistence(archetype, result, archetypeFile);
				// Validate version
				this.validateVersion(archetype, result, archetypeMaster);
				// Validate version upgrade
				archetypeMaster.map(ArchetypeMaster::getLatestFile)
						.ifPresent(
								file -> {
									ADLParser parser = new ADLParser(file
											.getContent());
									try {
										Archetype previousArchetype = parser
												.parse();
										this.validateVersionUpgrade(archetype,
												previousArchetype, result);
									} catch (Exception ex) {
										this.logger.error(
												"Cannot parse archetype "
														+ file.getName(), ex);
									}
								});
				// Validate specialize archetype
				if (result.getStatus().equals(
						FileProcessResult.FileStatus.VALID)) {
					this.validateSpecialisation(archetype, result,
							validatedArchetypes,
							specialiseValidationFailedArchetypes);
				}

				// Validate past
				if (result.getStatus().equals(
						FileProcessResult.FileStatus.VALID)) {
					validatedArchetypes.put(archetypeId, archetype);
				}
			});

		// Validate specialize failed archetypes
		int lastLoopSize = 0;
		while (specialiseValidationFailedArchetypes.size() > lastLoopSize) {
			specialiseValidationFailedArchetypes.forEach((archetypeId,
					archetype) -> {
				String specialiseArchetypeId = archetype.getParentArchetypeId()
						.getValue();
				if (validatedArchetypes.containsKey(specialiseArchetypeId)) {
					FileProcessResult result = results
							.get(specialiseArchetypeId);
					result.setStatus(FileProcessResult.FileStatus.VALID);
					result.setMessage("");
					specialiseValidationFailedArchetypes.remove(archetypeId);
				}
			});
			lastLoopSize = specialiseValidationFailedArchetypes.size();
		}
	}

	private void validateExistence(Archetype archetype,
			FileProcessResult result, Optional<ArchetypeFile> file) {
		file.ifPresent(f -> {
			result.setStatus(FileProcessResult.FileStatus.INVALID);
			result.appendMessage("Archetype already exists. ");
		});
	}

	private void validateVersion(Archetype archetype, FileProcessResult result,
			Optional<ArchetypeMaster> master) {
		String nextVersion = "v"
				+ master.map(ArchetypeMaster::getLatestFileInternalVersion)
						.orElse(1);
		if (archetype.getArchetypeId().versionID().compareTo(nextVersion) != 0) {
			result.setStatus(FileProcessResult.FileStatus.INVALID);
			result.appendMessage("Archetype version should be " + nextVersion
					+ ". ");
		}
	}

	private void validateSpecialisation(Archetype archetype,
			FileProcessResult result,
			Map<String, Archetype> validatedArchetypes,
			Map<String, Archetype> specialiseValidationFailedArchetypes) {
		Optional.ofNullable(archetype.getParentArchetypeId())
				.map(ArchetypeID::getValue)
				.ifPresent(
						id -> {
							if (!validatedArchetypes.containsKey(id)) {
								if (this.archetypeFileRepo.findByName(id) == null) {
									result.setStatus(FileProcessResult.FileStatus.INVALID);
									result.appendMessage("Specialise archetype "
											+ id + " does not exist. ");
									specialiseValidationFailedArchetypes.put(
											archetype.getArchetypeId()
													.getValue(), archetype);

								}
							}
						});
	}

	private void validateVersionUpgrade(Archetype currentArchetype,
			Archetype previousArchetype, FileProcessResult result) {

	}
}
