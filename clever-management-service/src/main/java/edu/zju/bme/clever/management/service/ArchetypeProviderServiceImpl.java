package edu.zju.bme.clever.management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import edu.zju.bme.clever.management.service.entity.ArchetypeFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.repository.ArchetypeActionLogRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeFileRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeMasterRepository;

public class ArchetypeProviderServiceImpl {

	@Autowired
	private ArchetypeFileRepository fileRepo;
	@Autowired
	private ArchetypeMasterRepository masterRepo;
	@Autowired
	private ArchetypeActionLogRepository logRepo;

	public List<ArchetypeMaster> getAllArchetypeMasters() {
		return this.masterRepo.findAll();
	}

	public ArchetypeMaster getArchetypeMasterByName(String masterName) {
		return this.masterRepo.findByName(masterName);
	}

	public ArchetypeMaster getArchetypeMasterById(Integer Id) {
		return this.masterRepo.findOne(Id);
	}

	public ArchetypeFile getArchetypeFileByName(String fileName) {
		return this.fileRepo.findByName(fileName);
	}

	public ArchetypeFile getArchetypeFileById(Integer id) {
		return this.fileRepo.findOne(id);
	}

	public List<ArchetypeFile> getAllTeamreviewArchetypeFiles() {
		return this.fileRepo.getAllTeamreviewArchetypeFiles();
	}

}
