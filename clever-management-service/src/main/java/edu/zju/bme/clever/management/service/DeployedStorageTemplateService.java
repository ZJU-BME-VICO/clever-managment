package edu.zju.bme.clever.management.service;

import java.util.List;

import edu.zju.bme.clever.management.service.entity.DeployedStorageTemplate;

public interface DeployedStorageTemplateService {
	
	public List<DeployedStorageTemplate> getAllDeployedLowVersionTemplate(String name, Integer serialVersion);
	public DeployedStorageTemplate getByTemplateName(String name);
	public Integer getMaxSerialVersionDeployed(String name);
}
