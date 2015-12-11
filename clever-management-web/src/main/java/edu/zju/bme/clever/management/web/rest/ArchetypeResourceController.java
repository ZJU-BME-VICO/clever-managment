package edu.zju.bme.clever.management.web.rest;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.openehr.am.archetype.Archetype;
import org.openehr.am.serialize.XMLSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import se.acode.openehr.parser.ADLParser;
import se.acode.openehr.parser.ParseException;
import edu.zju.bme.clever.management.service.ArchetypeProvideService;
import edu.zju.bme.clever.management.service.ArchetypeValidateService;
import edu.zju.bme.clever.management.service.ArchetypeVersionControlService;
import edu.zju.bme.clever.management.service.UserService;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.ArchetypeRevisionFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeVersionMaster;
import edu.zju.bme.clever.management.service.entity.FileProcessResult;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.ResourceExportException;
import edu.zju.bme.clever.management.service.exception.VersionControlException;
import edu.zju.bme.clever.management.web.entity.ActionLogInfo;
import edu.zju.bme.clever.management.web.entity.AdlInfo;
import edu.zju.bme.clever.management.web.entity.ArchetypeInfo;
import edu.zju.bme.clever.management.web.entity.ArchetypeMasterInfo;
import edu.zju.bme.clever.management.web.entity.ArchetypeVersionMasterInfo;
import edu.zju.bme.clever.management.web.entity.FileUploadResult;

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
	private ArchetypeProvideService archetypeProvideService;

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

	@RequestMapping(value = "/export", method = RequestMethod.GET)
	public void exportArchetypes(OutputStream out)
			throws ResourceExportException {
		this.archetypeProvideService.exportArchetypes(out);
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public List<ArchetypeMasterInfo> getArchtypeList() {
		List<ArchetypeMaster> masters = this.archetypeProvideService
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
									info.setRmOriginator(master
											.getRmOrginator());
									info.setRmEntity(master.getRmEntity());
									info.setRmName(master.getRmName());
									info.setLatestVersionMasterVersion(master
											.getLatestVersionMasterVersion());
									info.setLifecycleState(master
											.getLatestVersionMaster()
											.getLatestRevisionFileLifecycleState()
											.getValue());
									return info;
								}));
		masters.forEach(master -> {
			if (master.getSpecialiseArchetypeMasterId() != null) {
				ArchetypeMasterInfo info = infos.get(master.getId());
				info.setRoot(false);
				infos.get(master.getSpecialiseArchetypeMasterId())
						.getSpecialisedArchetypeMasters().add(info);

			}
		});
		return infos.values().stream().filter(info -> info.isRoot())
				.collect(Collectors.toList());
	}

	@RequestMapping(value = "/list/reference", method = RequestMethod.GET)
	public List<ArchetypeInfo> getArchetypeListToReference() {
		List<ArchetypeRevisionFile> files = this.archetypeProvideService
				.getArchetypeRevisionFileToReference();
		return files.stream().map(file -> {
			ArchetypeInfo info = new ArchetypeInfo();
			info.setId(file.getId());
			info.setName(file.getName());
			info.setAdl(file.getAdl());
			ADLParser parser = new ADLParser(file.getAdl());
			Archetype archetype;
			try {
				archetype = parser.parse();
				info.setXml(this.xmlSerializer.output(archetype));
				info.setRmEntity(archetype.getArchetypeId().rmEntity());
				info.setRmName(archetype.getArchetypeId().rmName());
				info.setRmOriginator(archetype.getArchetypeId().rmOriginator());
				info.setConceptName(archetype.getConceptName(archetype
						.getOriginalLanguage().getCodeString()));
				info.setLifecycleState(file.getLifecycleState().getValue());
			} catch (Exception e) {
				return null;
			}
			return info;
		}).collect(Collectors.toList());
	}

	@RequestMapping(value = "/list/edit/draft", method = RequestMethod.GET)
	public List<ArchetypeInfo> getArchtypeListToEdit(
			Authentication authentication) {
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		User user = this.userService.getUserByName(userName);
		List<ArchetypeRevisionFile> files = this.archetypeProvideService
				.getDraftArchetypeRevisionFileToEdit(user);
		return constructArchetypeInfoList(files);
	}

//	@RequestMapping(value = "/list/edit/draft", method = RequestMethod.GET)
//	public List<ArchetypeInfo> getArchtypeListToEdit(
//			Authentication authentication) {
//		Integer number = 1;
//		String fileName = "src/test/resources/";
//		List<ArchetypeInfo> archetypeInfoList = new ArrayList<ArchetypeInfo>();
//	    List<File> fileList = new ArrayList<File>();
//		File archetypeFile = new File(fileName + number + ".adl");
//		while(archetypeFile.isFile()){
//			System.out.println("open File successfully");
//			fileList.add(archetypeFile);
//			number++;
//			archetypeFile = new File(fileName + number + ".adl");
//		}
//		BufferedReader reader = null;
//		int line = 1;
//	//	try{
//		for (File file : fileList) {
//			try {
//				reader = new BufferedReader(new FileReader(file));
//
//				String tempString = "";
//				
//                String adl = "";
//				while ((tempString = reader.readLine()) != null) {
//					adl += tempString;
//					adl += "\r\n";
//					line++;
//				}
//				line = 1;
//
//				ArchetypeInfo info = new ArchetypeInfo();
//				
//				info.setAdl(adl);
//				ADLParser parser;
//
//				parser = new ADLParser(file);
//
//				Archetype arc;
//
//				arc = parser.parse();
//
//				info.setXml(this.xmlSerializer.output(arc));
//
//				archetypeInfoList.add(info);
//
//			} catch (FileNotFoundException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			} catch (Exception e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//		}
//		System.out.println(archetypeInfoList.size());
//	    return archetypeInfoList;
//	}

	@RequestMapping(value = "/list/edit/published", method = RequestMethod.GET)
	public List<ArchetypeInfo> getArchtypeListToEdit() {
		List<ArchetypeRevisionFile> files = this.archetypeProvideService
				.getLatestPublishArchetypeRevisionFileToEdit();
		return constructArchetypeInfoList(files);
	}

	@RequestMapping(value = "/list/verify", method = RequestMethod.GET)
	public List<ArchetypeInfo> getArchetypeListToVerify() throws Exception {
		List<ArchetypeRevisionFile> files = this.archetypeProvideService
				.getArchetypeRevisionFileToVerify();
		return constructArchetypeInfoList(files);
	}

	@RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
	public ArchetypeInfo getArchetypeById(@PathVariable int id)
			throws Exception {
		ArchetypeRevisionFile file = this.archetypeProvideService
				.getArchetypeRevisionFileById(id);
		this.isResourcesNull(file);
		return this.constructArchetypeInfo(file);
	}

	@RequestMapping(value = "/name/{name}", method = RequestMethod.GET)
	public ArchetypeInfo getArchetypeByName(@PathVariable String name)
			throws Exception {
		ArchetypeRevisionFile file = this.archetypeProvideService
				.getArchetypeRevisionFileByName(name);
		this.isResourcesNull(file);
		return this.constructArchetypeInfo(file);
	}

	@RequestMapping(value = "/id/{id}/adl", method = RequestMethod.GET)
	public String getArchetypeAdlById(@PathVariable int id) {
		String adl = this.archetypeProvideService.getArchetypeAdlById(id);
		this.isResourcesNull(adl);
		return adl;
	}

	@RequestMapping(value = "/name/{name}/adl", method = RequestMethod.GET)
	public String getArchetypeAdlByName(@PathVariable String name) {
		String adl = this.archetypeProvideService.getArchetypeAdlByName(name);
		this.isResourcesNull(adl);
		return adl;
	}

	@RequestMapping(value = "/id/{id}/xml", method = RequestMethod.GET)
	public String getArchetypeXmlById(@PathVariable int id) {
		String xml = this.archetypeProvideService.getArchetypeXmlById(id);
		this.isResourcesNull(xml);
		return xml;
	}

	@RequestMapping(value = "/name/{name}/xml", method = RequestMethod.GET)
	public String getArchetypeXmlByName(@PathVariable String name) {
		String xml = this.archetypeProvideService.getArchetypeXmlByName(name);
		this.isResourcesNull(xml);
		return xml;
	}

	@RequestMapping(value = "/master/id/{id}", method = RequestMethod.GET)
	public ArchetypeVersionMasterInfo getVersionMasterById(@PathVariable int id) {
		ArchetypeVersionMaster versionMaster = this.archetypeProvideService
				.getArchetypeVersionMasterById(id);
		this.isResourcesNull(versionMaster);
		return this.constructArchetypeVersionMasterInfo(versionMaster);
	}

	@RequestMapping(value = "/master/name/{name}", method = RequestMethod.GET)
	public ArchetypeVersionMasterInfo getVersionMasterByName(
			@PathVariable String name) {
		ArchetypeVersionMaster versionMaster = this.archetypeProvideService
				.getArchetypeVersionMasterByName(name);
		this.isResourcesNull(versionMaster);
		return this.constructArchetypeVersionMasterInfo(versionMaster);
	}

	@RequestMapping(value = "/action/create", method = RequestMethod.POST)
	public FileUploadResult createArchetype(@RequestBody AdlInfo info,
			Authentication authentication) {
		ADLParser parser = new ADLParser(info.getAdl());
		Archetype arc;
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		User user = this.userService.getUserByName(userName);
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		try {
			arc = parser.parse();
			this.archetypeVersionControlService.acceptNewArchetype(arc, user);
		} catch (ParseException e1) {
			result.setMessage("Archetype parse failed, error: "
					+ e1.getMessage());
			result.setSucceeded(false);
			e1.printStackTrace();
		} catch (Exception e1) {
			e1.printStackTrace();
			result.setSucceeded(false);
			result.setMessage("Archetype create failed, error: "
					+ e1.getMessage());
		}
		return result;
	}

	@RequestMapping(value = "/action/validate", method = RequestMethod.POST)
	public FileProcessResult validateFiles(
			@RequestParam(value = "file", required = true) MultipartFile file) {
		String fileName = file.getOriginalFilename();
		long fileSize = file.getSize();
		this.logger.trace("Validating file: {}, size: {}.", fileName, fileSize);
		FileProcessResult result = new FileProcessResult();
		result.setName(fileName);
		result.setStatus(FileProcessResult.FileStatus.VALID);
		Archetype archetype;
		try {
			ADLParser parser = new ADLParser(file.getInputStream(), "UTF-8");
			archetype = parser.parse();
		} catch (Throwable ex) {
			this.logger.debug("Parse file {} failed.",
					file.getOriginalFilename(), ex);
			result.setStatus(FileProcessResult.FileStatus.INVALIDOTHERS);
			result.setMessage("Archetype parse failed, error: "
					+ ex.getMessage());
			return result;
		}
		// Validate archetypes
		if (this.validationEnabled) {
			return this.archetypeValidateService.validateConsistency(archetype);
		}
		return result;
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
				this.archetypeVersionControlService.acceptNewArchetype(
						archetype, user);
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

	@RequestMapping(value = "/action/edit/id/{id}", method = RequestMethod.POST)
	public FileUploadResult editFile(@PathVariable int id,
			@RequestBody AdlInfo info,
			Authentication authentication) {
		System.out.println(info.getAdl());
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		User user = this.userService.getUserByName(userName);
		//String fileAdl = this.archetypeProvideService.getArchetypeAdlById(id);
		String fileAdl = info.getAdl();
		try {
			this.archetypeVersionControlService
					.editArchetype(id, fileAdl, user);
		} catch (Exception ex) {
			result.setMessage(ex.getMessage());
			result.setSucceeded(false);
			return result;
		}
		return result;
	}

	@RequestMapping(value = "/action/submit/id/{id}", method = RequestMethod.GET)
	public FileUploadResult submitArchrtype(@PathVariable int id,
			Authentication authentication) {
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		User user = this.userService.getUserByName(userName);
		try {
			this.archetypeVersionControlService.submitArchetype(id, user);
		} catch (Exception ex) {
			result.setMessage(ex.getMessage());
			result.setSucceeded(false);
			return result;
		}
		return result;
	}

	@RequestMapping(value = "/action/approve/id/{id}", method = RequestMethod.GET)
	public FileUploadResult approveFile(@PathVariable int id,
			Authentication authentication) {
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		User user = this.userService.getUserByName(userName);
		try {
			this.archetypeVersionControlService.approveArchetype(id, user);
		} catch (Exception ex) {
			result.setMessage(ex.getMessage());
			result.setSucceeded(false);
			return result;
		}
		return result;
	}

	@RequestMapping(value = "/action/reject/id/{id}", method = RequestMethod.GET)
	public FileUploadResult rejectFile(@PathVariable int id,
			Authentication authentication) {
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		User user = this.userService.getUserByName(userName);
		try {
			this.archetypeVersionControlService.rejectArchetype(id, user);
		} catch (Exception ex) {
			result.setMessage(ex.getMessage());
			result.setSucceeded(false);
			return result;
		}
		return result;
	}

	@RequestMapping(value = "/action/remove/id/{id}", method = RequestMethod.GET)
	public FileUploadResult rejectAndremoveFile(@PathVariable int id,
			Authentication authentication) {
		FileUploadResult result = new FileUploadResult();
		result.setSucceeded(true);
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		User user = this.userService.getUserByName(userName);
		try {
			this.archetypeVersionControlService.rejectAndRemoveArchetype(id,
					user);
		} catch (Exception ex) {
			result.setMessage(ex.getMessage());
			result.setSucceeded(false);
			return result;
		}
		return result;
	}

	private ArchetypeInfo constructArchetypeInfo(ArchetypeRevisionFile file)
			throws ParseException, Exception, IOException {
		ArchetypeInfo info = new ArchetypeInfo();
		info.setId(file.getId());
		info.setName(file.getName());
		info.setSerialVersion(file.getSerialVersion());
		info.setVersion(file.getVersion());
		info.setAdl(file.getAdl());
		ADLParser parser = new ADLParser(file.getAdl());
		Archetype archetype = parser.parse();
		info.setRmEntity(archetype.getArchetypeId().rmEntity());
		info.setRmName(archetype.getArchetypeId().rmName());
		info.setRmOriginator(archetype.getArchetypeId().rmOriginator());
		info.setConceptName(archetype.getConceptName(archetype
				.getOriginalLanguage().getCodeString()));
		info.setXml(this.xmlSerializer.output(archetype));
		info.setLifecycleState(file.getLifecycleState().getValue());
		// info.setVersionMasterName(file.getVersionMaster().getName());
		String archetypeId = archetype.getArchetypeId().getValue();
		info.setVersionMasterName(archetypeId.substring(0,
				archetypeId.lastIndexOf(".")));
		info.setVersionMasterId(file.getVersionMasterId());
		info.setLastModifyTime(file.getLastModifyTime());
		// Set specialise archetype info
		if (file.getSpecialiseArchetypeRevisionFileId() != null) {
			ArchetypeInfo specialiseInfo = new ArchetypeInfo();
			specialiseInfo.setId(file.getSpecialiseArchetypeRevisionFileId());
			specialiseInfo.setName(file
					.getSpecialiseArchetypeRevisionFileName());
			info.setSpecialiseArchetype(specialiseInfo);
		}
		// Set last revision archetype file
		Optional.ofNullable(file.getLastRevisionFile()).ifPresent(
				lastArchetype -> {
					ArchetypeInfo lastInfo = new ArchetypeInfo();
					lastInfo.setAdl(lastArchetype.getAdl());
					info.setLastRevisionArchetype(lastInfo);
				});
		// Set editor info
		info.setEditorId(file.getEditor().getId());
		info.setEditorName(file.getEditor().getName());
		return info;
	}

	private List<ArchetypeInfo> constructArchetypeInfoList(
			List<ArchetypeRevisionFile> files) {
		return files.stream().map(file -> {
			try {
				return this.constructArchetypeInfo(file);
			} catch (Exception e) {
				return null;
			}
		}).collect(Collectors.toList());
	}

	private ArchetypeVersionMasterInfo constructArchetypeVersionMasterInfo(
			ArchetypeVersionMaster versionMaster) {
		ArchetypeVersionMasterInfo versionMasterInfo = new ArchetypeVersionMasterInfo();
		// Add basic info
		versionMasterInfo.setId(versionMaster.getId());
		versionMasterInfo.setName(versionMaster.getName());
		versionMasterInfo.setRmEntity(versionMaster.getRmEntity());
		versionMasterInfo.setRmName(versionMaster.getRmName());
		versionMasterInfo.setRmOriginator(versionMaster.getRmOrginator());
		versionMasterInfo.setConceptName(versionMaster.getConceptName());
		versionMasterInfo.setConceptDescription(versionMaster
				.getConceptDescription());
		versionMasterInfo.setKeywords(versionMaster.getKeywords());
		versionMasterInfo.setCopyright(versionMaster.getCopyright());
		versionMasterInfo.setPurpose(versionMaster.getPurpose());
		versionMasterInfo.setUse(versionMaster.getUse());
		versionMasterInfo.setMisuse(versionMaster.getMisuse());
		versionMasterInfo.setLifecycleState(versionMaster
				.getLatestRevisionFileLifecycleState().getValue());
		versionMasterInfo.setLatestArchetypeVersion(versionMaster
				.getLatestRevisionFileVersion());
		// Set archetpye master
		versionMasterInfo.setMasterId(versionMaster.getArchetypeMasterId());
		versionMasterInfo.setMasterName(versionMaster.getArchetypeMasterName());
		// Add history archetype version master
		ArchetypeMaster master = versionMaster.getArchetypeMaster();
		master.getVersionMasters().forEach(indexVersionMaster -> {
			ArchetypeVersionMasterInfo info = new ArchetypeVersionMasterInfo();
			info.setId(indexVersionMaster.getId());
			info.setName(indexVersionMaster.getName());
			info.setVersion(indexVersionMaster.getVersion());
			versionMasterInfo.getHistoryVersionMasters().add(info);
		});
		// Add specialise version master
		ArchetypeVersionMaster specialiseVersionMaster = versionMaster
				.getSpecialiseArchetypeVersionMaster();
		if (specialiseVersionMaster != null) {
			ArchetypeVersionMasterInfo info = new ArchetypeVersionMasterInfo();
			info.setId(specialiseVersionMaster.getId());
			info.setName(specialiseVersionMaster.getName());
			info.setLatestArchetypeVersion(specialiseVersionMaster
					.getLatestRevisionFileVersion());
			info.setLatestArchetypeId(specialiseVersionMaster
					.getLatestRevisionFile().getId());
			versionMasterInfo.setSpecialiseArchetypeVersionMaster(info);
		}
		// Add archetypes
		versionMaster.getRevisionFiles().forEach(archetype -> {
			ArchetypeInfo info = new ArchetypeInfo();
			info.setId(archetype.getId());
			info.setSerialVersion(archetype.getSerialVersion());
			info.setName(archetype.getName());
			info.setVersion(archetype.getVersion());
			versionMasterInfo.getArchetypes().add(info);
		});
		// Add action logs
		versionMaster.getActionLogs().stream().forEach(log -> {
			ActionLogInfo info = new ActionLogInfo();
			info.setId(log.getId());
			info.setAction(log.getActionType().getValue());
			info.setVersion(log.getVersion());
			info.setRecordTime(log.getRecordTime());
			info.setOperatorName(log.getOperatorName());
			info.setLifecycleState(log.getLifecycleState().getValue());
			versionMasterInfo.getActionLogs().add(info);
		});
		return versionMasterInfo;
	}
}
