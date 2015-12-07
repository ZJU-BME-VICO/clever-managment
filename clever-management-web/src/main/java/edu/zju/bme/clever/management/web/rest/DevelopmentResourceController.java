package edu.zju.bme.clever.management.web.rest;

import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.dom4j.DocumentException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.zju.bme.clever.management.service.ApiInfoMaintainService;
import edu.zju.bme.clever.management.service.ApiInfoParseService;
import edu.zju.bme.clever.management.service.ApiInfoProvideService;
import edu.zju.bme.clever.management.service.entity.AbstractParam;
import edu.zju.bme.clever.management.service.entity.ApiInformation;
import edu.zju.bme.clever.management.service.entity.ApiMaster;
import edu.zju.bme.clever.management.service.entity.ApiRootUrlMaster;
import edu.zju.bme.clever.management.service.entity.ApiVersionMaster;
import edu.zju.bme.clever.management.service.entity.RequestParam;
import edu.zju.bme.clever.management.service.entity.ReturnParam;
import edu.zju.bme.clever.management.service.exception.ApiParseException;
import edu.zju.bme.clever.management.service.exception.ResourceExportException;
import edu.zju.bme.clever.management.web.entity.ApiMaintainResult;
import edu.zju.bme.clever.management.web.entity.ApiOriginInfo;
import edu.zju.bme.clever.management.web.entity.ApiInfo;
import edu.zju.bme.clever.management.web.entity.ApiMasterInfo;
import edu.zju.bme.clever.management.web.entity.ApiParamInfo;
import edu.zju.bme.clever.management.web.entity.ApiRootUrlMasterInfo;
import edu.zju.bme.clever.management.web.entity.ApiVersionMasterInfo;

@RestController
@RequestMapping("/development")
public class DevelopmentResourceController extends AbstractResourceController {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ApiInfoProvideService apiInfoProvideService;

	@Autowired
	private ApiInfoParseService apiInfoParseService;

	@Autowired
	private ApiInfoMaintainService apiInfoMaintainService;

	@RequestMapping(value = "/api/display", method = RequestMethod.GET)
	public List<ApiMasterInfo> getApiList() {
		Set<ApiMaster> masters = apiInfoProvideService.getAllApiMasters();
		List<ApiMasterInfo> infos = null;
		if (masters != null && !masters.isEmpty()) {
			infos = masters
					.stream()
					.map(master -> {
						ApiMasterInfo info = new ApiMasterInfo();
						info.setName(master.getName());
						info.setChineseName(master.getChineseName());
						info.setId(master.getId());
						ApiVersionMaster latestVersionMaster = master
								.getLatestVersionMaster();
						if (latestVersionMaster != null) {
							info.setLatestVersion(latestVersionMaster
									.getVersion());
						}
						Set<ApiVersionMaster> versionMasters = master
								.getVersionMasters();
						if (versionMasters != null && !versionMasters.isEmpty()) {
							info.setVersionList(versionMasters.stream()
									.map(versionMaster -> {
										return versionMaster.getVersion();
									}).collect(Collectors.toList()));
						}
						return info;
					}).collect(Collectors.toList());
		}
		return infos;
	}

	@RequestMapping(value = "/api/display/{masterId}/{versionId}", method = RequestMethod.GET)
	public ApiVersionMasterInfo getApiVersionMasterInfo(
			@PathVariable Integer versionId, @PathVariable Integer masterId) {
		ApiVersionMaster master = this.apiInfoProvideService
				.getApiVersionMasterByVersionAndApiMasterId(versionId, masterId);
		return constructApiVersionMasterInfo(master);
	}

	// @RequestMapping(value = "/api/display/test", method = RequestMethod.GET)
	// public ApiInfo Test() {
	// ApiInformation info = this.apiInfoProvideService
	// .getApiInformationById(3);
	// ApiInfo inf = new ApiInfo();
	// info.getRequestParams();
	// info.getReturnParams();
	// info.getApiMediaTypes();
	// inf.setRequestParams(constructRequestParamInfoList(info
	// .getRequestParams()));
	// inf.setReturnParams(constructReturnParamInfoList(info.getReturnParams()));
	// return inf;
	// }

	// generate or modify api information with a version
	@RequestMapping(value = "/api/maintain/overall", method = RequestMethod.POST)
	public ApiMaintainResult generateApi(@RequestBody ApiOriginInfo info) {
		System.out.println("come in the maintain overall function");
		System.out.println(info.getUrl());
		System.out.println(info.getMasterName());
		ApiMaintainResult result = new ApiMaintainResult();
		result.setSucceeded(true);
		try {
			this.apiInfoParseService.parseWadl(info.getUrl(),
					info.getMasterName(), info.getVersion());
		} catch (Exception e) {
			result.setSucceeded(false);
			result.setMessage(e.getMessage());
		}
		return result;
	}

	// remove version version master
	@RequestMapping(value = "/api/maintain/remove/version/{masterId}/{version}", method = RequestMethod.GET)
	public ApiMaintainResult deleteApiVersionMaster(
			@PathVariable Integer version, @PathVariable Integer masterId) {
		ApiMaintainResult result = new ApiMaintainResult();
		result.setSucceeded(true);
		try {
			this.apiInfoMaintainService.deleteApiVersionMaster(masterId,
					version);
		} catch (Exception e) {
			// TODO: handle exception
			result.setSucceeded(false);
			result.setMessage(e.getMessage());
		}
		return result;
	}

	// remover master
	@RequestMapping(value = "/api/maintain/remove/master/{id}", method = RequestMethod.GET)
	public ApiMaintainResult deleteApiMaster(@PathVariable Integer id) {
		ApiMaintainResult result = new ApiMaintainResult();
		result.setSucceeded(true);
		try {
			this.apiInfoMaintainService.deleteApiMaster(id);
		} catch (Exception e) {
			// TODO: handle exception
			result.setSucceeded(false);
			result.setMessage(e.getMessage());
		}
		return result;
	}

	// save root url information
	@RequestMapping(value = "/api/maintain/save/rooturl", method = RequestMethod.POST)
	public ApiMaintainResult saveRootUrl(
			@RequestBody ApiVersionMasterInfo info) {
		ApiMaintainResult result = new ApiMaintainResult();
		result.setSucceeded(true);
		List<ApiRootUrlMasterInfo> masters = info.getRootUrlMasters();
		
		Map<Integer, String> chineseNameMap = new HashMap<Integer, String>();
		if (masters != null && !masters.isEmpty()) {
			masters.forEach(master -> {
				System.out.println(master.getChineseName());
				chineseNameMap.put(master.getId(), master.getChineseName());
			});
			try {
				this.apiInfoMaintainService.updateRootUrlName(info.getId(),
						chineseNameMap);
			} catch (Exception e) {
				result.setMessage(e.getMessage());
				result.setSucceeded(false);
			}

		} else {
			result.setSucceeded(false);
			result.setMessage("the infos passed to controller is null!");
		}
		return result;

	}

	@RequestMapping(value = "/api/maintain/save/api", method = RequestMethod.POST)
	public ApiMaintainResult saveApi(@RequestBody ApiInfo info) {
		ApiMaintainResult result = new ApiMaintainResult();
		result.setSucceeded(true);
		try {
			this.apiInfoMaintainService.updateApi(info.getId(),
					info.getChineseName(), info.getDescription(),
					info.getChineseDescription());
		} catch (Exception e) {
			result.setMessage(e.getMessage());
			result.setSucceeded(false);
		}

		return result;
	}

	@RequestMapping(value = "/api/maintain/save/params", method = RequestMethod.POST)
	public ApiMaintainResult saveParams(@RequestBody ApiInfo info) {
		ApiMaintainResult result = new ApiMaintainResult();
		result.setSucceeded(true);
		if (info != null) {
			Map<Integer, String> requestParamDesc = new HashMap<Integer, String>();
			Map<Integer, String> returnParamDesc = new HashMap<Integer, String>();
			Map<Integer, String> requestParamChineseDesc = new HashMap<Integer, String>();
			Map<Integer, String> returnParamChineseDesc = new HashMap<Integer, String>();
			Map<Integer, Boolean> requiredMap = new HashMap<Integer, Boolean>();
			List<ApiParamInfo> requestParams = info.getRequestParams();
			List<ApiParamInfo> returnParams = info.getReturnParams();
			if (requestParams != null && !requestParams.isEmpty()) {
				requestParams.forEach(param -> {
					Integer id = param.getId();
					requestParamDesc.put(id, param.getDescription());
					requestParamChineseDesc.put(id,
							param.getChineseDescription());
					requiredMap.put(id, param.getRequired());
				});
			}
			if (returnParams != null && !returnParams.isEmpty()) {
				returnParams.forEach(param -> {
					Integer id = param.getId();
					returnParamDesc.put(id, param.getDescription());
					returnParamChineseDesc.put(id,
							param.getChineseDescription());
				});
			}

			try {
				this.apiInfoMaintainService.updateParams(info.getId(),
						requestParamDesc, returnParamDesc,
						requestParamChineseDesc, returnParamChineseDesc,
						requiredMap);

			} catch (Exception e) {
				result.setMessage(e.getMessage());
				result.setSucceeded(false);
			}

		} else {
			result.setMessage("the data passed to saveParams is null");
			result.setSucceeded(false);
		}
		return result;
	}

	// @RequestMapping(value = "/api/maintain/single", method =
	// RequestMethod.POST)
	// public ApiEditResult editApiDetails(@RequestBody ApiInfo info) {
	// Map<Integer, String> requestParamDescMap = new HashMap<Integer,
	// String>();
	// Map<Integer, String> returnParamDescMap = new HashMap<Integer, String>();
	// List<ApiParamInfo> requestParams = info.getRequestParams();
	// List<ApiParamInfo> returnParams = info.getReturnParams();
	// if (requestParams != null && !requestParams.isEmpty()) {
	// requestParams.forEach(param -> {
	// requestParamDescMap.put(param.getId(), param.getDescription());
	// });
	// }
	// if (returnParams != null && !returnParams.isEmpty()) {
	// returnParams.forEach(param -> {
	// returnParamDescMap.put(param.getId(), param.getDescription());
	// });
	// }
	// ApiEditResult result = new ApiEditResult();
	// result.setSucceeded(true);
	// try {
	// this.apiInfoMaintainService.editApiDesc(info.getId(),
	// info.getDescription(), requestParamDescMap,
	// returnParamDescMap);
	// } catch (ResourceExportException e) {
	// result.setSucceeded(false);
	// result.setMessage(e.getMessage());
	// }
	// return result;
	// }

	// auxiliary function
	private ApiVersionMasterInfo constructApiVersionMasterInfo(
			ApiVersionMaster master) {
		ApiVersionMasterInfo info = new ApiVersionMasterInfo();
		info.setVersion(master.getVersion());
		info.setId(master.getId());
		Set<ApiRootUrlMaster> rootUrlMasters = master.getApiRootUrlMasters();
		List<ApiRootUrlMasterInfo> rootUrlMasterInfoList = rootUrlMasters
				.stream().map(rootMaster -> {
					return constructApiRootUrlMasterInfo(rootMaster);
				}).collect(Collectors.toList());
		info.setRootUrlMasters(rootUrlMasterInfoList);
		return info;
	}

	private ApiRootUrlMasterInfo constructApiRootUrlMasterInfo(
			ApiRootUrlMaster master) {
		ApiRootUrlMasterInfo info = new ApiRootUrlMasterInfo();
		// info.setApiVersion(master.getApiVersionMaster().getVersion());
		info.setRootUrlName(master.getName());
		info.setChineseName(master.getChineseName());
		info.setId(master.getId());
		info.setApiList(master
				.getApiInformations()
				.stream()
				.map(api -> {
					ApiInfo apiInfo = new ApiInfo();
					apiInfo.setId(api.getId());
					apiInfo.setName(api.getName());
					apiInfo.setChineseName(api.getChineseName());
					apiInfo.setChineseDescription(api.getChineseDescription());
					apiInfo.setUrl(api.getUrl());
					apiInfo.setReuqestMethod(api.getRequestMethod());
					apiInfo.setDescription(api.getDescription());
					apiInfo.setMediaTypes(api.getApiMediaTypes().stream()
							.map(mediaType -> {
								return mediaType.getMediaType();
							}).collect(Collectors.toList()));
					Set<RequestParam> requestParams = api.getRequestParams();
					if (requestParams != null) {
						List<ApiParamInfo> requestParamList = constructRequestParamInfoList(requestParams);
						apiInfo.setRequestParams(requestParamList);
					}
					Set<ReturnParam> returnParams = api.getReturnParams();
					if (returnParams != null) {
						List<ApiParamInfo> returnParamList = constructReturnParamInfoList(returnParams);
						apiInfo.setReturnParams(returnParamList);
					}

					return apiInfo;
				}).collect(Collectors.toList()));
		return info;

	}

	private List<ApiParamInfo> constructRequestParamInfoList(
			Set<RequestParam> params) {
		return params.stream().map(param -> {
			return constructApiParamInfo(param);
		}).collect(Collectors.toList());
	}

	private List<ApiParamInfo> constructReturnParamInfoList(
			Set<ReturnParam> params) {
		return params.stream().map(param -> {
			return constructApiParamInfo(param);
		}).collect(Collectors.toList());
	}

	private ApiParamInfo constructApiParamInfo(AbstractParam param) {
		ApiParamInfo info = new ApiParamInfo();
		info.setId(param.getId());
		info.setDescription(param.getDescription());
		info.setName(param.getName());
		info.setType(param.getType());
		info.setChineseDescription(param.getChineseDescription());
		if (param instanceof RequestParam) {
			info.setRequired(((RequestParam) param).getRequired());
		}
		return info;
	}

}
