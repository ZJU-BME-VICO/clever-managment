package edu.zju.bme.clever.management.web.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.openehr.am.archetype.Archetype;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
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
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.FileProcessResult;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.web.entity.ArchetypeMasterInfo;
import edu.zju.bme.clever.management.web.entity.FileUploadResult;
import se.acode.openehr.parser.ADLParser;

@RestController
@ManagedResource
@RequestMapping("/archetypes")
public class ArchetypeResourceController {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ArchetypeValidateService archetypeValidateService;
	@Autowired
	private ArchetypeVersionControlService archetypeVersionControlService;
	@Autowired
	private UserService userService;
	@Autowired
	private ArchetypeProviderService archetypeProviderService;

	private boolean manipulateUploadResult;
	private boolean uploadResult;

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
									info.setLifecycleState(master.getLatestFileLifecycleState());
									return info;
								}));
		masters.forEach(master -> {
			if (master.getSpecialiseArchetypeMaster() != null) {
				ArchetypeMasterInfo info = infos.get(master.getId());
				info.setRoot(false);
				infos.get(master.getSpecialiseArchetypeMasterId())
						.getSpecialiseArchetypeMasters().add(info);

			}
		});
		return infos.values().stream().filter(info -> info.isRoot())
				.collect(Collectors.toList());
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
		this.archetypeValidateService.validateConsistency(archetypes, results);
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
