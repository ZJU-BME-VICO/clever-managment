package edu.zju.bme.clever.management.service;

import edu.zju.bme.clever.management.service.entity.DeployRecord;

public interface DeployRecordService {

	public void saveDeployRecordRecursively(DeployRecord record);

}