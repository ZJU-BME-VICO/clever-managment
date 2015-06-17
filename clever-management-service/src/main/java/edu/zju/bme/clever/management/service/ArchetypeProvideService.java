package edu.zju.bme.clever.management.service;

import java.util.List;

import edu.zju.bme.clever.management.service.entity.ArchetypeMaster1;
import edu.zju.bme.clever.management.service.entity.ArchetypeRevisionFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeVersionMaster;

public interface ArchetypeProvideService {

	public List<ArchetypeMaster1> getAllArchetypeMasters();

	public ArchetypeMaster1 getArchetypeMasterByName(String masterName);

	public ArchetypeMaster1 getArchetypeMasterById(Integer Id);

	public ArchetypeVersionMaster getArchetypeVersionMasterByName(String name);

	public ArchetypeVersionMaster getArchetypeVersionMasterById(Integer id);

	public ArchetypeRevisionFile getArchetypeRevisionFileByName(String fileName);

	public ArchetypeRevisionFile getArchetypeRevisionFileById(Integer id);

	public String getArchetypeXmlById(Integer id);

	public String getArchetypeXmlByName(String name);

	public String getArchetypeAdlById(Integer id);

	public String getArchetypeAdlByName(String name);

}