package edu.zju.bme.clever.management.service;

import java.io.OutputStream;
import java.util.List;

import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.ArchetypeRevisionFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeVersionMaster;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.ResourceExportException;

public interface ArchetypeProvideService {

	public List<ArchetypeMaster> getAllArchetypeMasters();

	public ArchetypeMaster getArchetypeMasterByName(String masterName);

	public ArchetypeMaster getArchetypeMasterById(Integer Id);

	public ArchetypeVersionMaster getArchetypeVersionMasterByName(String name);

	public ArchetypeVersionMaster getArchetypeVersionMasterById(Integer id);

	public ArchetypeRevisionFile getArchetypeRevisionFileByName(String fileName);

	public ArchetypeRevisionFile getArchetypeRevisionFileById(Integer id);
	
	public List<ArchetypeRevisionFile> getArchetypeRevisionFileToVerify();
	
	public List<ArchetypeRevisionFile> getArchetypeRevisionFileToReference();
	
	public List<ArchetypeRevisionFile> getDraftArchetypeRevisionFileToEdit(User user);

	public List<ArchetypeRevisionFile> getLatestPublishArchetypeRevisionFileToEdit();

	public String getArchetypeXmlById(Integer id);

	public String getArchetypeXmlByName(String name);

	public String getArchetypeAdlById(Integer id);

	public String getArchetypeAdlByName(String name);

	public void exportArchetypes(OutputStream out) throws ResourceExportException;

}