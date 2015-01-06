package edu.zju.bme.clever.management.service;

import java.util.List;

import edu.zju.bme.clever.management.service.entity.ArchetypeFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;

public interface ArchetypeProviderService {

	public List<ArchetypeMaster> getAllArchetypeMasters();

	public ArchetypeMaster getArchetypeMasterByName(String masterName);

	public ArchetypeMaster getArchetypeMasterById(Integer Id);

	public ArchetypeFile getArchetypeFileByName(String fileName);

	public ArchetypeFile getArchetypeFileById(Integer id);
	
	public String getArchetypeXmlById(Integer id);
	
	public String getArchetypeXmlByName(String name);

	public List<ArchetypeFile> getAllTeamreviewArchetypeFiles();

}