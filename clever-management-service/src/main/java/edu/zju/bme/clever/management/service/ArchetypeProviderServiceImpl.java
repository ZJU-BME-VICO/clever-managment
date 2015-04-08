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
import edu.zju.bme.clever.management.service.entity.LifecycleState;
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
	public List<ArchetypeFile> getLatestedPublishedArchetypeFiles(){
		List<ArchetypeFile> resultFiles = new ArrayList<ArchetypeFile>();
		List<ArchetypeMaster> masterFiles=getAllArchetypeMasters();
		List<ArchetypeFile> publishedFiles = this.fileRepo.findByLifecycleState(LifecycleState.PUBLISHED);
		for(int i=0;i<publishedFiles.size();i++){
			for(ArchetypeMaster temp:masterFiles){
				if(publishedFiles.get(i).getId()==temp.getLatestFileId()){
					resultFiles.add(publishedFiles.get(i));
					break;
				}
			}
		}
		return resultFiles;
	}
	
	@Override
	public List<ArchetypeFile> getMyDraftArchetypeFiles(User user) {
		return this.fileRepo.findByLifecycleStateAndEditor(LifecycleState.DRAFT,user);
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
		return this.fileRepo.findByLifecycleState(LifecycleState.TEAMREVIEW);
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
