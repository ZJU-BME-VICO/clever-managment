package edu.zju.bme.clever.management.service;

import java.util.List;

import edu.zju.bme.clever.management.service.entity.ApiInformation;
import edu.zju.bme.clever.management.service.entity.ApiMaster;
import edu.zju.bme.clever.management.service.entity.ApiRootUrlMaster;
import edu.zju.bme.clever.management.service.entity.ApiVersionMaster;

public interface ApiInfoProvideService {
	public List<ApiMaster> getAllApiMasters();

	public ApiMaster getApiMasterByName(String name);

	public ApiMaster getApiMasterById(Integer Id);

	public List<ApiVersionMaster> getAllApiVersionMasters();
	
	public ApiVersionMaster getApiVersionMasterById(Integer Id);
	
	public ApiVersionMaster getApiVersionMasterByVersionAndApiMasterId(Integer version, Integer apiMasterId);

//	public List<ApiRootUrlMaster> getAllRootUrlMasters();

//	public ApiRootUrlMaster getRootUrlMasterById(Integer Id);

//	public List<ApiInformation> getAllApiInfomations();

	public ApiInformation getApiInformationById(Integer Id);
}
