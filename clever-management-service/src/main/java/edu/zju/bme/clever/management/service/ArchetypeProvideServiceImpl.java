package edu.zju.bme.clever.management.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.openehr.am.archetype.Archetype;
import org.openehr.am.serialize.ADLSerializer;
import org.openehr.am.serialize.XMLSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import se.acode.openehr.parser.ADLParser;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.ArchetypeRevisionFile;
import edu.zju.bme.clever.management.service.entity.ArchetypeVersionMaster;
import edu.zju.bme.clever.management.service.entity.LifecycleState;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.repository.ArchetypeActionLogRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeMaster1Repository;
import edu.zju.bme.clever.management.service.repository.ArchetypeRevisionFileRepository;
import edu.zju.bme.clever.management.service.repository.ArchetypeVersionMasterRepository;

@Service
@Transactional
public class ArchetypeProvideServiceImpl implements ArchetypeProvideService {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ArchetypeRevisionFileRepository revisionFileRepo;
	@Autowired
	private ArchetypeVersionMasterRepository versionMasterRepo;
	@Autowired
	private ArchetypeMaster1Repository masterRepo;
	@Autowired
	private ArchetypeActionLogRepository logRepo;

	private XMLSerializer xmlSerializer = new XMLSerializer();
	private ADLSerializer adlSerializer = new ADLSerializer();

	@Override
	public List<ArchetypeMaster> getAllArchetypeMasters() {
		List<ArchetypeMaster> masters = this.masterRepo.findAll();
		masters.forEach(master -> master.getLatestVersionMaster());
		return masters;
	}

	@Override
	public List<ArchetypeRevisionFile> getArchetypeRevisionFileToVerify() {
		return this.revisionFileRepo
				.findByLifecycleState(LifecycleState.TEAMREVIEW);
	}

	@Override
	public List<ArchetypeRevisionFile> getDraftArchetypeRevisionFileToEdit(
			User user) {
		return this.revisionFileRepo.findByEditorAndLifecycleState(user,
				LifecycleState.DRAFT);
	}

	@Override
	public List<ArchetypeRevisionFile> getLatestPublishArchetypeRevisionFileToEdit() {
		List<ArchetypeVersionMaster> archetypeVersionMaster = this.versionMasterRepo
				.findByLatestRevisionFileLifecycleState(LifecycleState.PUBLISHED);
		return archetypeVersionMaster.stream()
				.map(master -> master.getLatestRevisionFile())
				.collect(Collectors.toList());
	}

	@Override
	public List<ArchetypeRevisionFile> getArchetypeRevisionFileToReference() {
		return this.revisionFileRepo.findAll();
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
	public ArchetypeVersionMaster getArchetypeVersionMasterByName(String name) {
		return this.versionMasterRepo.findByName(name);
	}

	@Override
	public ArchetypeVersionMaster getArchetypeVersionMasterById(Integer id) {
		return this.versionMasterRepo.findOne(id);
	}

	@Override
	public ArchetypeRevisionFile getArchetypeRevisionFileByName(String fileName) {
		return this.revisionFileRepo.findByName(fileName);
	}

	@Override
	public ArchetypeRevisionFile getArchetypeRevisionFileById(Integer id) {
		return this.revisionFileRepo.findOne(id);
	}

	@Override
	public String getArchetypeXmlById(Integer id) {
		return Optional
				.ofNullable(this.revisionFileRepo.findOne(id))
				.map(file -> this.parseArchetype(file.getAdl()))
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
				.ofNullable(this.revisionFileRepo.findByName(name))
				.map(file -> this.parseArchetype(file.getAdl()))
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
		return Optional.ofNullable(this.revisionFileRepo.findOne(id))
				.map(file -> file.getAdl()).orElse(null);
	}

	@Override
	public String getArchetypeAdlByName(String name) {
		return Optional.ofNullable(this.revisionFileRepo.findByName(name))
				.map(file -> file.getAdl()).orElse(null);
	}

	private Archetype parseArchetype(String archetype) {
		ADLParser parser = new ADLParser(archetype);
		try {
			return parser.parse();
		} catch (Exception ex) {
			this.logger.info("Parse archetype failed.", ex);
		}
		return null;
	}
}
