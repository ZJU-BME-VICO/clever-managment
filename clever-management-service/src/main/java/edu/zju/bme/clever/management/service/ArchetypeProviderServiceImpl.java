package edu.zju.bme.clever.management.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.openehr.am.archetype.Archetype;
import org.openehr.am.serialize.ADLSerializer;
import org.openehr.am.serialize.XMLSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import se.acode.openehr.parser.ADLParser;
import edu.zju.bme.clever.management.service.entity.ArchetypeFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.repository.ArchetypeActionLogRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeFileRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeMasterRepository;

@Service
public class ArchetypeProviderServiceImpl implements ArchetypeProviderService {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ArchetypeFileRepository fileRepo;
	@Autowired
	private ArchetypeMasterRepository masterRepo;
	@Autowired
	private ArchetypeActionLogRepository logRepo;

	private XMLSerializer xmlSerializer = new XMLSerializer();
	private ADLSerializer adlSerializer = new ADLSerializer();

	@Override
	public List<ArchetypeMaster> getAllArchetypeMasters() {
		return this.masterRepo.findAll();
	}
	
	@Override
	public List<ArchetypeFile> getMyArchetypeFiles(User user) {
		List<ArchetypeFile> result = new ArrayList<ArchetypeFile>();
		List<ArchetypeMaster> masterMap=getAllArchetypeMasters();
		List<ArchetypeFile>repeatFiles = this.fileRepo.getMyArchetypeFiles(user);
		for(int i=0;i<repeatFiles.size();i++){
			for(ArchetypeMaster temp : masterMap){
				if(repeatFiles.get(i).getMasterId()==temp.getId()
						&&repeatFiles.get(i).getInternalVersion()==temp.getLatestFileInternalVersion()){
					result.add(repeatFiles.get(i));
				}
			}
		}
		return result;
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
	public String getArchetypeXmlById(Integer id) {
		return Optional
				.ofNullable(this.fileRepo.findOne(id))
				.map(file -> this.parseArchetype(file.getContent()))
				.map(archetype -> {
					try {
						return this.xmlSerializer.output(archetype);
					} catch (IOException ex) {
						this.logger.debug("Searializer archetype {} failed.",
								archetype.getArchetypeId().getValue());
						return null;
					}
				}).orElse(null);
	}

	@Override
	public String getArchetypeXmlByName(String name) {
		return Optional
				.ofNullable(this.fileRepo.findByName(name))
				.map(file -> this.parseArchetype(file.getContent()))
				.map(archetype -> {
					try {
						return this.xmlSerializer.output(archetype);
					} catch (IOException ex) {
						this.logger.debug("Searializer archetype {} failed.",
								archetype.getArchetypeId().getValue());
						return null;
					}
				}).orElse(null);
	}

	@Override
	public String getArchetypeAdlById(Integer id) {
		return Optional.ofNullable(this.fileRepo.findOne(id))
				.map(file -> file.getContent()).orElse(null);
	}

	@Override
	public String getArchetypeAdlByName(String name) {
		return Optional.ofNullable(this.fileRepo.findByName(name))
				.map(file -> file.getContent()).orElse(null);
	}

	@Override
	public List<ArchetypeFile> getAllTeamreviewArchetypeFiles() {
		return this.fileRepo.getAllTeamreviewArchetypeFiles();
	}

	protected Archetype parseArchetype(String archetype) {
		ADLParser parser = new ADLParser(archetype);
		try {
			return parser.parse();
		} catch (Exception ex) {
			this.logger.info("Parse archetype failed.", ex);
		}
		return null;
	}
}
