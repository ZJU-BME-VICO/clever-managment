package edu.zju.bme.clever.management.web.rest;

import java.util.List;
import java.util.Set;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.zju.bme.clever.management.service.ApiInfoProvideService;
import edu.zju.bme.clever.management.service.entity.AbstractParam;
import edu.zju.bme.clever.management.service.entity.ApiMaster;
import edu.zju.bme.clever.management.service.entity.ApiRootUrlMaster;
import edu.zju.bme.clever.management.service.entity.ApiVersionMaster;
import edu.zju.bme.clever.management.service.entity.RequestParam;
import edu.zju.bme.clever.management.service.entity.ReturnParam;
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

	@RequestMapping(value = "/api/display", method = RequestMethod.GET)
	public List<ApiMasterInfo> getApiList() {
		List<ApiMaster> masters = apiInfoProvideService.getAllApiMasters();
		List<ApiMasterInfo> infos = masters
				.stream()
				.map(master -> {
					ApiMasterInfo info = new ApiMasterInfo();
					info.setApiMasterName(master.getName());
					List<ApiVersionMasterInfo> versionMasterList = master
							.getVersionMasterList()
							.stream()
							.map(versionMaster -> {
								ApiVersionMasterInfo versionMasterInfo = new ApiVersionMasterInfo();
								versionMasterInfo
										.setApiMasterName(versionMaster
												.getApiMaster().getName());
								versionMasterInfo.setApiVersion(versionMaster
										.getVersion());
								versionMasterInfo.setId(versionMaster.getId());
								return versionMasterInfo;

							}).collect(Collectors.toList());
					info.setApiVersionMasterList(versionMasterList);
					ApiVersionMasterInfo latestApiVersionMasterInfo = constructApiVersionMasterInfo(master
							.getLatestVersionMaster());
					info.setLatestApiVersionMasterInfo(latestApiVersionMasterInfo);
					return info;
				}).collect(Collectors.toList());
		return infos;
	}

	private ApiVersionMasterInfo constructApiVersionMasterInfo(
			ApiVersionMaster master) {
		ApiVersionMasterInfo info = new ApiVersionMasterInfo();
		info.setApiMasterName(master.getApiMaster().getName());
		info.setApiVersion(master.getVersion());
		info.setId(master.getId());
		List<ApiRootUrlMaster> rootUrlMasters = master
				.getApiRootUrlMasterList();
		List<ApiRootUrlMasterInfo> rootUrlMasterInfoList = rootUrlMasters
				.stream().map(rootMaster -> {
					return constructApiRootUrlMasterInfo(rootMaster);
				}).collect(Collectors.toList());
		info.setApiRootUrlMasters(rootUrlMasterInfoList);
		return info;
	}

	private ApiRootUrlMasterInfo constructApiRootUrlMasterInfo(
			ApiRootUrlMaster master) {
		ApiRootUrlMasterInfo info = new ApiRootUrlMasterInfo();
		// info.setApiVersion(master.getApiVersionMaster().getVersion());
		info.setId(master.getId());
		info.setApiList(master
				.getApiInformationList()
				.stream()
				.map(api -> {
					ApiInfo apiInfo = new ApiInfo();
					apiInfo.setApiName(api.getName());
					apiInfo.setApiRootUrlName(api.getApiRootUrlMaster()
							.getName());
					apiInfo.setApiUrl(api.getUrl());
					apiInfo.setReuqestMethod(api.getRequestMethod());
					apiInfo.setDescription(api.getApiDescription());
					apiInfo.setMediaTypes(api.getApiMediaTypeSet().stream()
							.map(mediaType -> {
								return mediaType.getMediaType();
							}).collect(Collectors.toList()));
					List<RequestParam> requestParams = api
							.getRequestParamList();
					if (requestParams != null) {
						List<ApiParamInfo> requestParamList = constructRequestParamInfoList(requestParams);
						apiInfo.setRequestParams(requestParamList);
					}
					List<ReturnParam> returnParams = api.getReturnParamList();
					if (returnParams != null) {
						List<ApiParamInfo> returnParamList = constructReturnParamInfoList(returnParams);
						apiInfo.setReturnParams(returnParamList);
					}

					return apiInfo;
				}).collect(Collectors.toSet()));
		return info;

	}

	private List<ApiParamInfo> constructRequestParamInfoList(
			List<RequestParam> params) {
		return params.stream().map(param -> {
			return constructApiParamInfo(param);
		}).collect(Collectors.toList());
	}

	private List<ApiParamInfo> constructReturnParamInfoList(
			List<ReturnParam> params) {
		return params.stream().map(param -> {
			return constructApiParamInfo(param);
		}).collect(Collectors.toList());
	}

	private ApiParamInfo constructApiParamInfo(AbstractParam param) {
		ApiParamInfo info = new ApiParamInfo();
		info.setDescription(param.getDescription());
		info.setName(param.getName());
		info.setType(param.getType());
		if (param instanceof RequestParam) {
			info.setRequired(((RequestParam) param).getRequired());
		}
		return info;
	}

	@RequestMapping(value = "/api/display/{versionId}", method = RequestMethod.GET)
	public ApiVersionMasterInfo getApiVersionMasterInfo(
			@PathVariable Integer versionId) {
		ApiVersionMaster master = this.apiInfoProvideService
				.getApiVersionMasterById(versionId);
		return constructApiVersionMasterInfo(master);
	}
	
	

}
