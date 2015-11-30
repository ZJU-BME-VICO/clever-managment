package edu.zju.bme.clever.management.service;

import java.util.Map;

import edu.zju.bme.clever.management.service.entity.ApiMaster;
import edu.zju.bme.clever.management.service.entity.ApiVersionMaster;
import edu.zju.bme.clever.management.service.exception.ResourceExportException;

public interface ApiInfoMaintainService {
	public void editApiDesc(Integer id, String description,
			Map<Integer, String> requstParamDesc,
			Map<Integer, String> returnParamDesc)
			throws ResourceExportException;

	public void editParamDesc(Integer id, String description);

	public void deleteApiVersionMaster(Integer id) throws Exception;

	public void deleteApiMaster(Integer id) throws Exception;
}
