package edu.zju.bme.clever.management.service;

import java.util.List;

import edu.zju.bme.clever.management.service.entity.DeployRecord;

public interface DeployRecordService {

	public void saveDeployRecordRecursively(DeployRecord record);

	public DeployRecord getLastSucceededDeployedRecord();

	public List<DeployRecord> getAllDeployRecords();

}