package edu.zju.bme.clever.management.service;

import java.util.Map;

import edu.zju.bme.clever.management.service.entity.ApiMaster;
import edu.zju.bme.clever.management.service.entity.ApiVersionMaster;
import edu.zju.bme.clever.management.service.exception.ResourceExportException;

public interface ApiInfoMaintainService {

	public void updateRootUrlName(Integer versionMasterId,
			Map<Integer, String> chineseNameMap);

	public void updateApi(Integer id, String chineseName, String description,
			String chineseDesc);

	public void updateParams(Integer apiId,
			Map<Integer, String> requestParamDesc,
			Map<Integer, String> returnParamDesc,
			Map<Integer, String> requestParamChineseDesc,
			Map<Integer, String> returnParamChineseDesc,
			Map<Integer, Boolean> requiredMap);

	public void updateParams(Integer id, String desc, String chineseDesc,
			Boolean required);

	public void updateParams(Integer id, String desc, String chineseDesc);

	// public void editParamDesc(Integer id, String description);

	public void deleteApiVersionMaster(Integer masterId, Integer version)
			throws Exception;

	public void deleteApiMaster(Integer id) throws Exception;
}
