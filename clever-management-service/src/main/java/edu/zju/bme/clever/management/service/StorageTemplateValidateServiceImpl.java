package edu.zju.bme.clever.management.service;

import java.io.InputStream;
import java.util.Optional;
import java.util.function.Function;

import openEHR.v1.template.TemplateDocument;

import org.openehr.am.archetype.Archetype;
import org.openehr.am.template.OETParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import se.acode.openehr.parser.ADLParser;
import edu.zju.bme.clever.cdr.arm.parser.ArmParser;
import edu.zju.bme.clever.management.service.entity.ArchetypeFile;
import edu.zju.bme.clever.management.service.entity.FileProcessResult;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.FileProcessResult.FileStatus;
import edu.zju.bme.clever.management.service.entity.TemplateFile;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.repository.ArchetypeFileRepository;
import edu.zju.bme.clever.management.service.repository.TemplateActionLogRepository;
import edu.zju.bme.clever.management.service.repository.TemplateFileRepository;
import edu.zju.bme.clever.management.service.repository.TemplateMasterRepository;
import edu.zju.bme.clever.schemas.ArchetypeRelationshipMappingDocument;

@Service
public class StorageTemplateValidateServiceImpl implements
		StorageTemplateValidateService {
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
	public FileProcessResult validateConsistency(InputStream oet,
			InputStream arm) {
		try {
			TemplateDocument oetDoc = this.oetParser.parseTemplate(oet);
			ArchetypeRelationshipMappingDocument armDoc = this.armParser
					.parseArm(arm);
			return this.validateConsistency(oetDoc, armDoc);
		} catch (Exception ex) {
			FileProcessResult result = new FileProcessResult();
			result.setStatus(FileStatus.INVALID);
			result.appendMessage("Cannot parse oet or arm, error: "
					+ ex.getMessage());
			return result;
		}
	}

	@Override
	public FileProcessResult validateConsistency(TemplateDocument oet,
			ArchetypeRelationshipMappingDocument arm) {
		FileProcessResult result = new FileProcessResult();
		result.setStatus(FileStatus.VALID);
		// Validate oet and arm name
		String templateName = oet.getTemplate().getName();
		result.setName(templateName);
		String templateVersion = templateName.substring(templateName
				.lastIndexOf(".v") + 1);
		if (templateName.compareTo(arm.getArchetypeRelationshipMapping()
				.getTemplate().getTemplateId()) != 0) {
			result.setStatus(FileStatus.INVALID);
			result.appendMessage("OET'name and ARM'name don't match. ");
		}
		// Validate existence
		this.validateExistence(templateName, result);
		// Validate specialize archetype
		String specialiseArchetypeName = oet.getTemplate().getDefinition()
				.getArchetypeId();
		ArchetypeFile specialiseArchetypeFile = this.archetypeFileRepo
				.findByName(specialiseArchetypeName);
		if (specialiseArchetypeFile == null) {
			result.setStatus(FileStatus.INVALID);
			result.appendMessage("Cannot find specialise archetype: "
					+ specialiseArchetypeName + ". ");
		} else {
			// Validate version
			Optional<TemplateMaster> templateMaster = Optional
					.ofNullable(this.templateMasterRepo.findByName(templateName
							.substring(0, templateName.lastIndexOf(".v"))));
			Optional<TemplateFile> latestTemplate = templateMaster
					.map(master -> master.getLatestFile());
			if (latestTemplate.isPresent()) {
				Integer latestTemplateSpecialiseArchetypeInternalVersion = latestTemplate
						.get().getSpecialiseArchetypeInternalVersion();
				Integer currentSpecialiseArchetypeInternalVersion = specialiseArchetypeFile
						.getInternalVersion();
				// Validate template sub version
				if (currentSpecialiseArchetypeInternalVersion > latestTemplateSpecialiseArchetypeInternalVersion) {
					if (!templateVersion.equals(specialiseArchetypeFile
							.getVersion() + ".1")) {
						result.setStatus(FileStatus.INVALID);
						result.appendMessage("Template version should be "
								+ specialiseArchetypeFile.getVersion() + ".1");
					}
				} else if (currentSpecialiseArchetypeInternalVersion == latestTemplateSpecialiseArchetypeInternalVersion) {
					Integer nextSubVersion = latestTemplate.get()
							.getSubVersion() + 1;
					if (!templateVersion.equals(specialiseArchetypeFile
							.getVersion() + "." + nextSubVersion)) {
						result.setStatus(FileStatus.INVALID);
						result.appendMessage("Template version should be "
								+ specialiseArchetypeFile.getVersion() + "."
								+ nextSubVersion);
					}
				} else if (currentSpecialiseArchetypeInternalVersion < latestTemplateSpecialiseArchetypeInternalVersion) {
					result.setStatus(FileStatus.INVALID);
					result.appendMessage("Specialise archetype version must be later than "
							+ latestTemplate.get()
									.getSpecialiseArchetypeVersion());
				}
			} else {
				if (!templateVersion.equals(specialiseArchetypeFile
						.getVersion() + ".1")) {
					result.setStatus(FileStatus.INVALID);
					result.appendMessage("Template version should be "
							+ specialiseArchetypeFile.getVersion() + ".1");
				}
			}
		}
		// Test entity class generation
		// EntityClassGenerateOption option = new EntityClassGenerateOption();
		// option.setPrintClass(true);
		// Function<String, Archetype> archetypeVisitor = archetypeId -> {
		// ArchetypeFile file = this.archetypeFileRepo.findByName(archetypeId);
		// if (file == null) {
		// return null;
		// } else {
		// ADLParser parser = new ADLParser(file.getContent());
		// try {
		// Archetype archetype = parser.parse();
		// return archetype;
		// } catch (Exception ex) {
		// return null;
		// }
		// }
		// };
		// try {
		// JavaClass entitySource = this.generator.generateEntityClass(oet,
		// arm, archetypeVisitor, option);
		// } catch (EntityClassGenerateException ex) {
		// result.setStatus(FileStatus.INVALID);
		// result.appendMessage("Generate entity class failed, error:"
		// + ex.getMessage());
		// }
		return result;
	}

	public void validateExistence(String templateName, FileProcessResult result) {
		TemplateFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (templateFile != null) {
			result.setStatus(FileStatus.INVALID);
			result.appendMessage("Template: " + templateName
					+ " already exists.");
		}
	}

}
