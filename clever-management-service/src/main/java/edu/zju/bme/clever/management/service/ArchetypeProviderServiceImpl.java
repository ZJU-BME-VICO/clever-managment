package edu.zju.bme.clever.management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.zju.bme.clever.management.service.entity.ArchetypeFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.repository.ArchetypeActionLogRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeFileRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeMasterRepository;

@Service
public class ArchetypeProviderServiceImpl implements ArchetypeProviderService {

	@Autowired
	private ArchetypeFileRepository fileRepo;
	@Autowired
	private ArchetypeMasterRepository masterRepo;
	@Autowired
	private ArchetypeActionLogRepository logRepo;

	@Override
	public List<ArchetypeMaster> getAllArchetypeMasters() {
		return this.masterRepo.findAll();
	}

	@Override
	public ArchetypeMaster getArchetypeMasterByName(String masterName) {
		return this.masterRepo.findByName(masterName);
	}

	@Override
	public ArchetypeMaster getArchetypeMasterById(Integer Id) {
		return this.masterRepo.findOne(Id);
	}

	@Override
	public ArchetypeFile getArchetypeFileByName(String fileName) {
		return this.fileRepo.findByName(fileName);
	}

	@Override
	public ArchetypeFile getArchetypeFileById(Integer id) {
		return this.fileRepo.findOne(id);
	}

	@Override
	public List<ArchetypeFile> getAllTeamreviewArchetypeFiles() {
		return this.fileRepo.getAllTeamreviewArchetypeFiles();
	}

}
