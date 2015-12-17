package edu.zju.bme.clever.management.service;

import java.util.List;
import java.util.Set;

import edu.zju.bme.clever.management.service.entity.ApiInformation;
import edu.zju.bme.clever.management.service.entity.ApiMaster;
import edu.zju.bme.clever.management.service.entity.ApiVersionMaster;
import edu.zju.bme.clever.management.service.entity.ClassAttribute;
import edu.zju.bme.clever.management.service.entity.ClassMaster;
import edu.zju.bme.clever.management.service.entity.RequestParam;
import edu.zju.bme.clever.management.service.entity.ReturnParam;

public interface ApiInfoProvideService {
	public Set<ApiMaster> getAllApiMasters();

	public ApiMaster getApiMasterByName(String name);

	public ApiMaster getApiMasterById(Integer Id);

	public List<ApiVersionMaster> getAllApiVersionMasters();

	public ApiVersionMaster getApiVersionMasterById(Integer Id);

	public ApiVersionMaster getApiVersionMasterByVersionAndApiMasterId(Integer version, Integer apiMasterId);

	// public List<ApiRootUrlMaster> getAllRootUrlMasters();

	// public ApiRootUrlMaster getRootUrlMasterById(Integer Id);

	// public List<ApiInformation> getAllApiInfomations();

	public ApiInformation getApiInformationById(Integer Id);

	public Set<RequestParam> getRequestParams(Integer id);

	public Set<ReturnParam> getReturnParams(Integer id);

	public ReturnParam getReturnParamById(Integer id);

	public RequestParam getRequestParamById(Integer id);

	public ClassAttribute getClassAttributeById(Integer id);

	public ClassMaster getClassMasterByTypeAndVersionMasterId(String type, Integer id);

	public Set<ClassMaster> getAllClassMasterByVersionMasterId(Integer id);
}
