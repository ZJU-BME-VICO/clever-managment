package edu.zju.bme.clever.management.service;

import java.io.InputStream;
import java.util.Optional;

import openEHR.v1.template.TemplateDocument;

import org.openehr.am.template.OETParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.zju.bme.clever.cdr.arm.parser.ArmParser;
import edu.zju.bme.clever.management.service.entity.ArchetypeRevisionFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeVersionMaster;
import edu.zju.bme.clever.management.service.entity.FileProcessResult;
import edu.zju.bme.clever.management.service.entity.FileProcessResult.FileStatus;
import edu.zju.bme.clever.management.service.entity.TemplateMaster;
import edu.zju.bme.clever.management.service.entity.TemplateRevisionFile;
import edu.zju.bme.clever.management.service.exception.VersionControlException;
import edu.zju.bme.clever.management.service.repository.ArchetypeRevisionFileRepository;
import edu.zju.bme.clever.management.service.repository.TemplateActionLogRepository;
import edu.zju.bme.clever.management.service.repository.TemplateMasterRepository;
import edu.zju.bme.clever.management.service.repository.TemplateRevisionFileRepository;
import edu.zju.bme.clever.management.service.util.CleverUtils;
import edu.zju.bme.clever.schemas.ArchetypeRelationshipMappingDocument;

@Service
public class StorageTemplateValidateServiceImpl implements
		StorageTemplateValidateService {
	@Autowired
	private TemplateRevisionFileRepository templateFileRepo;
	@Autowired
	private TemplateMasterRepository templateMasterRepo;
	@Autowired
	private ArchetypeRevisionFileRepository archetypeFileRepo;
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
		ArchetypeRevisionFile specialiseArchetypeFile = this.archetypeFileRepo
				.findByName(specialiseArchetypeName);
		if (specialiseArchetypeFile == null) {
			result.setStatus(FileStatus.INVALID);
			result.appendMessage("Cannot find specialise archetype: "
					+ specialiseArchetypeName + ". ");
		} else {
			String templateMasterName = CleverUtils
					.extractVersionMasterName(templateName);
			if (templateMasterName != null) {
				// Whether specialise the specific archetype version master
				ArchetypeVersionMaster specialiseArchetypeVersionMaster = specialiseArchetypeFile
						.getVersionMaster();
				if (!specialiseArchetypeVersionMaster.getName().equals(
						templateMasterName)) {
					result.setStatus(FileStatus.INVALID);
					result.appendMessage("Template master name should be "
							+ specialiseArchetypeVersionMaster.getName());
				}
				Integer nextSerialVersion;
				TemplateMaster templateMaster = this.templateMasterRepo
						.findByName(templateMasterName);
				if (templateMaster != null) {
					TemplateRevisionFile latestTemplate = templateMaster
							.getLatestRevisionFile();
					nextSerialVersion = latestTemplate.getSerialVersion() + 1;
					Integer latestTemplateSpecialiseArchetypeSerialVersion = latestTemplate
							.getSpecialiseArchetypeRevisionFileSerialVersion();
					Integer currentSpecialiseArchetypeSerialVersion = specialiseArchetypeFile
							.getSerialVersion();
					if (currentSpecialiseArchetypeSerialVersion < latestTemplateSpecialiseArchetypeSerialVersion) {
						result.setStatus(FileStatus.INVALID);
						result.appendMessage("Specialise archetype's version should not be earlier than "
								+ latestTemplate
										.getSpecialiseArchetypeRevisionFileVersion());
					}
				} else {
					nextSerialVersion = 1;
				}
				// Validate version
				if (!templateName.equals(templateMasterName + "."
						+ nextSerialVersion)) {
					result.setStatus(FileStatus.INVALID);
					result.appendMessage("Template version should be "
							+ specialiseArchetypeVersionMaster.getVersion()
							+ "." + nextSerialVersion);
				}
			} else {
				result.setStatus(FileStatus.INVALID);
				result.appendMessage("Template name is unqualified.");
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
		TemplateRevisionFile templateFile = this.templateFileRepo
				.findByName(templateName);
		if (templateFile != null) {
			result.setStatus(FileStatus.INVALID);
			result.appendMessage("Template: " + templateName
					+ " already exists.");
		}
	}

}
