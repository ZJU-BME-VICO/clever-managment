package edu.zju.bme.clever.management.web.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.openehr.am.archetype.Archetype;
import org.openehr.am.serialize.XMLSerializer;
import org.openehr.rm.support.identification.ArchetypeID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.zju.bme.clever.management.service.ArchetypeProviderService;
import edu.zju.bme.clever.management.service.ArchetypeValidateService;
import edu.zju.bme.clever.management.service.ArchetypeVersionControlService;
import edu.zju.bme.clever.management.service.UserService;
import edu.zju.bme.clever.management.service.entity.AbstractFile.SourceType;
import edu.zju.bme.clever.management.service.entity.ArchetypeFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.FileProcessResult;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.web.entity.ArchetypeActionLogInfo;
import edu.zju.bme.clever.management.web.entity.ArchetypeInfo;
import edu.zju.bme.clever.management.web.entity.ArchetypeMasterInfo;
import edu.zju.bme.clever.management.web.entity.FileUploadResult;
import edu.zju.bme.clever.management.web.exception.ResourceNotFoundException;
import se.acode.openehr.parser.ADLParser;
import se.acode.openehr.parser.ParseException;

@RestController
@ManagedResource
@RequestMapping("/archetypes")
public class ArchetypeResourceController extends AbstractResourceController {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ArchetypeValidateService archetypeValidateService;
	@Autowired
	private ArchetypeVersionControlService archetypeVersionControlService;
	@Autowired
	private UserService userService;
	@Autowired
	private ArchetypeProviderService archetypeProviderService;

	private XMLSerializer xmlSerializer = new XMLSerializer();

	private boolean manipulateUploadResult;
	private boolean uploadResult;
	private boolean validationEnabled = true;

	@ManagedAttribute
	public boolean isManipulateUploadResult() {
		return manipulateUploadResult;
	}

	@ManagedAttribute
	public void setManipulateUploadResult(boolean manipulateUploadResult) {
		this.manipulateUploadResult = manipulateUploadResult;
	}

	@ManagedAttribute
	public boolean isUploadResult() {
		return uploadResult;
	}

	@ManagedAttribute
	public void setUploadResult(boolean uploadResult) {
		this.uploadResult = uploadResult;
	}

	@ManagedAttribute
	public boolean isValidationEnabled() {
		return validationEnabled;
	}

	@ManagedAttribute
	public void setValidationEnabled(boolean validationEnabled) {
		this.validationEnabled = validationEnabled;
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public List<ArchetypeMasterInfo> getArchtypeList() {
		List<ArchetypeMaster> masters = this.archetypeProviderService
				.getAllArchetypeMasters();
		Map<Integer, ArchetypeMasterInfo> infos = masters
				.stream()
				.collect(
						Collectors.toMap(
								master -> master.getId(),
								master -> {
									ArchetypeMasterInfo info = new ArchetypeMasterInfo();
									info.setId(master.getId());
									info.setConceptName(master.getConceptName());
									info.setName(master.getName());
									info.setLatestArchetypeVersion(master
											.getLatestFileVersion());
									info.setLifecycleState(master
											.getLatestFileLifecycleState()
											.getValue());
									return info;
								}));
		masters.forEach(master -> {
			if (master.getSpecialiseArchetypeMaster() != null) {
				ArchetypeMasterInfo info = infos.get(master.getId());
				info.setRoot(false);
				infos.get(master.getSpecialiseArchetypeMasterId())
						.getSpecialisedArchetypeMasters().add(info);

			}
		});
		return infos.values().stream().filter(info -> info.isRoot())
				.collect(Collectors.toList());
	}

	@RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
	public ArchetypeInfo getArchetypeById(@PathVariable int id)
			throws Exception {
		ArchetypeInfo info = new ArchetypeInfo();
		ArchetypeFile file = this.archetypeProviderService
				.getArchetypeFileById(id);
		this.isResourcesNull(file);
		info.setId(file.getId());
		info.setName(file.getName());
		info.setInternalVersion(file.getInternalVersion());
		info.setAdl(file.getContent());
		ADLParser parser = new ADLParser(file.getContent());
		Archetype archetype = parser.parse();
		info.setRmEntity(archetype.getArchetypeId().rmEntity());
		info.setRmName(archetype.getArchetypeId().rmName());
		info.setRmOriginator(archetype.getArchetypeId().rmOriginator());
		info.setConceptName(archetype.getConceptName(archetype
				.getOriginalLanguage().getCodeString()));
		info.setXml(this.xmlSerializer.output(archetype));
		info.setLifecycleState(file.getLifecycleState().getValue());
		info.setMasterName(archetype.getArchetypeId().base());
		info.setMasterId(file.getMasterId());
		// Set specialise archetype info
		if (file.getSpecialiseArchetypeId() != null) {
			ArchetypeInfo specialiseInfo = new ArchetypeInfo();
			specialiseInfo.setId(file.getSpecialiseArchetypeId());
			specialiseInfo.setName(archetype.getParentArchetypeId().getValue());
			info.setSpecialiseArchetype(specialiseInfo);
		}
		// Set editor info
		info.setEditorId(file.getEditor().getId());
		info.setEditorName(file.getEditor().getName());
		return info;
	}

	@RequestMapping(value = "/id/{id}.adl", method = RequestMethod.GET)
	public String getArchetypeAdlById(@PathVariable int id) {
		String adl = this.archetypeProviderService.getArchetypeAdlById(id);
		this.isResourcesNull(adl);
		return adl;
	}

	@RequestMapping(value = "/name/{name}.adl", method = RequestMethod.GET)
	public String getArchetypeAdlByName(@PathVariable String name) {
		String adl = this.archetypeProviderService.getArchetypeAdlByName(name);
		this.isResourcesNull(adl);
		return adl;
	}

	@RequestMapping(value = "/id/{id}.xml", method = RequestMethod.GET)
	public String getArchetypeXmlById(@PathVariable int id) {
		String xml = this.archetypeProviderService.getArchetypeXmlById(id);
		this.isResourcesNull(xml);
		return xml;
	}

	@RequestMapping(value = "/name/{name}.xml", method = RequestMethod.GET)
	public String getArchetypeXmlByName(@PathVariable String name) {
		String xml = this.archetypeProviderService.getArchetypeXmlByName(name);
		this.isResourcesNull(xml);
		return xml;
	}

	@RequestMapping(value = "/master/id/{id}", method = RequestMethod.GET)
	public ArchetypeMasterInfo getMasterById(@PathVariable int id) {
		ArchetypeMaster master = this.archetypeProviderService
				.getArchetypeMasterById(id);
		this.isResourcesNull(master);
		ArchetypeMasterInfo masterInfo = new ArchetypeMasterInfo();
		// Add basic info
		masterInfo.setId(master.getId());
		masterInfo.setName(master.getName());
		masterInfo.setRmEntity(master.getRmEntity());
		masterInfo.setRmName(master.getRmName());
		masterInfo.setRmOriginator(master.getRmOrginator());
		masterInfo.setConceptName(master.getConceptName());
		masterInfo.setConceptDescription(master.getConceptDescription());
		masterInfo.setKeywords(master.getKeywords());
		masterInfo.setCopyright(master.getCopyright());
		masterInfo.setPurpose(master.getPurpose());
		masterInfo.setUse(master.getUse());
		masterInfo.setMisuse(master.getMisuse());
		masterInfo.setLifecycleState(master.getLatestFileLifecycleState()
				.getValue());
		masterInfo.setLatestArchetypeVersion(master.getLatestFileVersion());
		ArchetypeMaster specialiseMaster = master
				.getSpecialiseArchetypeMaster();
		// Add specialise master
		if (specialiseMaster != null) {
			ArchetypeMasterInfo specialiseMasterInfo = new ArchetypeMasterInfo();
			specialiseMasterInfo.setId(specialiseMaster.getId());
			specialiseMasterInfo.setName(specialiseMaster.getName());
			specialiseMasterInfo.setLatestArchetypeVersion(specialiseMaster
					.getLatestFileVersion());
			specialiseMasterInfo.setLatestArchetypeId(specialiseMaster
					.getLatestFileId());
			masterInfo.setSpecialiseArchetypeMaster(specialiseMasterInfo);
		}
		// Add archetypes
		master.getFiles().forEach(archetype -> {
			ArchetypeInfo archetypeInfo = new ArchetypeInfo();
			archetypeInfo.setId(archetype.getId());
			archetypeInfo.setInternalVersion(archetype.getInternalVersion());
			archetypeInfo.setName(archetype.getName());
			archetypeInfo.setVersion(archetype.getVersion());
			masterInfo.getArchetypes().add(archetypeInfo);
		});
		// Add action log
		master.getActionLogs()
				.stream()
				.forEach(
						log -> {
							ArchetypeActionLogInfo logInfo = new ArchetypeActionLogInfo();
							logInfo.setId(log.getId());
							logInfo.setAction(log.getActionType().getValue());
							logInfo.setArchetypeVersion(log.getVersion());
							logInfo.setRecordTime(log.getRecordTime());
							logInfo.setOperatorName(log.getOperatorName());
							logInfo.setArchetypeLifecycleState(log
									.getLifecycleState().getValue());
							masterInfo.getActionLogs().add(logInfo);
						});
		return masterInfo;
	}

	@RequestMapping(value = "/action/validate", method = RequestMethod.POST)
	public List<FileProcessResult> validateFiles(
			@RequestParam(value = "files", required = true) MultipartFile[] files) {
		final Map<String, Archetype> archetypes = new HashMap<String, Archetype>();
		final Map<String, FileProcessResult> results = new HashMap<String, FileProcessResult>();
		final List<FileProcessResult> allResults = new ArrayList<FileProcessResult>();
		Arrays.asList(files).forEach(
				file -> {
					String fileName = file.getOriginalFilename();
					long fileSize = file.getSize();
					this.logger.trace("Validating file: {}, size: {}.",
							fileName, fileSize);
					FileProcessResult result = new FileProcessResult();
					result.setName(fileName);
					result.setStatus(FileProcessResult.FileStatus.VALID);
					allResults.add(result);
					try {
						ADLParser parser = new ADLParser(file.getInputStream(),
								"UTF-8");
						Archetype archetype = parser.parse();
						archetypes.put(archetype.getArchetypeId().getValue(),
								archetype);
						results.put(archetype.getArchetypeId().getValue(),
								result);
					} catch (Throwable ex) {
						this.logger.debug("Parse file {} failed.",
								file.getOriginalFilename(), ex);
						result.setStatus(FileProcessResult.FileStatus.INVALID);
						result.setMessage("Archetype parse failed, error: "
								+ ex.getMessage());
					}
				});
		// Validate archetypes
		if (this.validationEnabled) {
			this.archetypeValidateService.validateConsistency(archetypes,
					results);
		}
		return allResults;
	}

	@RequestMapping(value = "/action/upload", method = RequestMethod.POST)
	public FileUploadResult uploadFiles(
			@RequestParam(value = "files", required = true) MultipartFile[] files,
			Authentication authentication) {
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);

		// Debug mode
		if (this.manipulateUploadResult) {
			result.setMessage("Upload result manipulated.");
			if (!this.uploadResult) {
				result.setSucceeded(false);
			}
			return result;
		}

		User user = this.userService.getUserByName(userName);
		Map<String, Archetype> archetypes = new HashMap<String, Archetype>();

		for (MultipartFile file : files) {
			String fileName = file.getOriginalFilename();
			long fileSize = file.getSize();
			this.logger.trace("Persisting file: {}, size: {}.", fileName,
					fileSize);
			try {
				ADLParser parser = new ADLParser(file.getInputStream(), "UTF-8");
				Archetype archetype = parser.parse();
				archetypes
						.put(archetype.getArchetypeId().getValue(), archetype);
				this.archetypeVersionControlService.createOrUpgradeArchetype(
						archetype, SourceType.CLEVER, user);
			} catch (Exception ex) {
				this.logger.debug("Persist file {} failed.",
						file.getOriginalFilename(), ex);
				result.setSucceeded(false);
				result.setMessage("Persist file " + file.getOriginalFilename()
						+ " failed.");
				return result;
			}
		}
		return result;
	}
}
