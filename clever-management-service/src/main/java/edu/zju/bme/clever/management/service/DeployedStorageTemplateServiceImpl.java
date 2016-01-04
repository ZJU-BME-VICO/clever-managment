package edu.zju.bme.clever.management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.DeployedStorageTemplate;
import edu.zju.bme.clever.management.service.repository.DeployedStorageTemplateRepository;

@Service
@Transactional(rollbackFor = { Exception.class })
public class DeployedStorageTemplateServiceImpl implements DeployedStorageTemplateService{
	@Autowired
	private DeployedStorageTemplateRepository deployedStorageTemplateRepo;
	
	public List<DeployedStorageTemplate> getAllDeployedLowVersionTemplate(String name, Integer serialVersion){
		return this.deployedStorageTemplateRepo.findByNameLikeAndSerialVersionLessThan(name, serialVersion);
	}

	@Override
	public DeployedStorageTemplate getByTemplateName(String name) {
		return this.deployedStorageTemplateRepo.findByName(name);
	}

	@Override
	public Integer getMaxSerialVersionDeployed(String name) {
		return deployedStorageTemplateRepo.findMaxSerialVersionByNameLikeOrderByIdDesc(name);
	}

}
