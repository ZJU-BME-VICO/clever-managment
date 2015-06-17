package edu.zju.bme.clever.management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.DeployRecord;
import edu.zju.bme.clever.management.service.entity.EntityClassSource;
import edu.zju.bme.clever.management.service.repository.DeployRecordRepository;
import edu.zju.bme.clever.management.service.repository.DeployedStorageTemplateRepository;
import edu.zju.bme.clever.management.service.repository.EntityClassSourceRepository;
import edu.zju.bme.clever.management.service.repository.EntityRelationshipRepository;

@Service
@Transactional(rollbackFor = { Exception.class })
public class DeployRecordServiceImpl implements DeployRecordService {

	@Autowired
	private DeployRecordRepository deployRecordRepo;
	@Autowired
	private DeployedStorageTemplateRepository deployedStorageTemplateRepo;
	@Autowired
	private EntityClassSourceRepository entityClassSourceRepo;
	@Autowired
	private EntityRelationshipRepository relationshipRepo;

	@Override
	public void saveDeployRecordRecursively(DeployRecord record) {
		this.deployRecordRepo.save(record);
		record.getDeployedStorageTemplates().forEach(template -> {
			template.setDeployRecord(record);
			this.deployedStorageTemplateRepo.save(template);
			template.getEntityClassSources().forEach(source -> {
				source.setStorageTemplate(template);
				source.setDeployRecord(record);
				this.entityClassSourceRepo.save(source);
				source.getForwardRelationships().forEach(relationship -> {
					relationship.setDeployRecord(record);
					record.getEntityRelationships().add(relationship);
				});
			});
		});
		record.getEntityRelationships()
				.forEach(
						relationship -> {
							EntityClassSource source = relationship
									.getSourceEntity();
							EntityClassSource destination = relationship
									.getDestinationEntity();
							relationship.setSourceTemplate(source
									.getStorageTemplate());
							relationship.setSourceTemplateName(source
									.getStorageTemplateName());
							relationship.setDestinationTemplate(destination
									.getStorageTemplate());
							relationship.setDestinationTemplateName(destination
									.getStorageTemplateName());
							this.relationshipRepo.save(relationship);
						});

	}

	@Override
	public DeployRecord getLastSucceededDeployedRecord() {
		return this.deployRecordRepo.findFirstBySucceededOrderByIdDesc(true);
	}
}
