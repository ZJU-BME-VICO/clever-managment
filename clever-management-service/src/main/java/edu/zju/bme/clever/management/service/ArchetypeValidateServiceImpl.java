package edu.zju.bme.clever.management.service;

import java.util.HashMap;
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
public class ArchetypeValidateServiceImpl {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ArchetypeMasterRepository archetypeMasterRepo;
	@Autowired
	private ArchetypeFileRepository archetypeFileRepo;

	public void validateConsistency(Map<String, Archetype> archetypes,
			Map<String, FileProcessResult> results) {
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
				// Validate specialise archetype
				this.validateSpecialisation(archetype, result, archetypes);
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
			});
	}

	private void validateExistence(Archetype archetype,
			FileProcessResult result, Optional<ArchetypeFile> file) {
		file.ifPresent(f -> {
			result.setStatus(FileProcessResult.FileStatus.Invalid);
			result.setMessage(result.getMessage()
					+ "Archetype already exists. ");
		});
	}

	private void validateVersion(Archetype archetype, FileProcessResult result,
			Optional<ArchetypeMaster> master) {
		String nextVersion = "v"
				+ master.map(ArchetypeMaster::getLatestFileInternalVersion)
						.orElse(1);
		if (archetype.getArchetypeId().versionID().compareTo(nextVersion) != 0) {
			result.setStatus(FileProcessResult.FileStatus.Invalid);
			result.setMessage(result.getMessage()
					+ "Archetype version should be " + nextVersion + ". ");
		}
	}

	private void validateSpecialisation(Archetype archetype,
			FileProcessResult result, Map<String, Archetype> archetypes) {
		Optional.ofNullable(archetype.getParentArchetypeId())
				.map(ArchetypeID::getValue)
				.ifPresent(
						id -> {
							if (!archetypes.containsKey(id)) {
								if (this.archetypeFileRepo.findByName(id) == null) {
									result.setStatus(FileProcessResult.FileStatus.Invalid);
									result.setMessage("Specialise archetype "
											+ id + "does not exist.");
								}
							}
						});
	}

	private void validateVersionUpgrade(Archetype currentArchetype,
			Archetype previousArchetype, FileProcessResult result) {

	}
}
