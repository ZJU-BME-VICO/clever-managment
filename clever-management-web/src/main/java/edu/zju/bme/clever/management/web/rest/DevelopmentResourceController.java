package edu.zju.bme.clever.management.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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
import edu.zju.bme.clever.management.service.entity.ClassAttribute;
import edu.zju.bme.clever.management.service.entity.ClassMaster;
import edu.zju.bme.clever.management.service.entity.RequestParam;
import edu.zju.bme.clever.management.service.entity.ReturnParam;
import edu.zju.bme.clever.management.web.entity.ApiInfo;
import edu.zju.bme.clever.management.web.entity.ApiMaintainResult;
import edu.zju.bme.clever.management.web.entity.ApiMasterInfo;
import edu.zju.bme.clever.management.web.entity.ApiOriginInfo;
import edu.zju.bme.clever.management.web.entity.ApiParamInfo;
import edu.zju.bme.clever.management.web.entity.ApiRootUrlMasterInfo;
import edu.zju.bme.clever.management.web.entity.ApiVersionMasterInfo;
import edu.zju.bme.clever.management.web.entity.ClassAttributeInfo;
import edu.zju.bme.clever.management.web.entity.ClassMasterInfo;
import edu.zju.bme.clever.management.web.entity.ErrorCodeInfo;

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
			this.apiInfoParseService.parseWadl(info.getUrl(), info.getMasterName(), info.getVersion());
		} catch (Exception e) {
			result.setSucceeded(false);
			result.setMessage(e.getMessage());
		}
		return result;
	}

	// remove version version master
	@RequestMapping(value = "/api/maintain/remove/version/{masterId}/{version}", method = RequestMethod.GET)
	public ApiMaintainResult deleteApiVersionMaster(@PathVariable Integer version, @PathVariable Integer masterId) {
		ApiMaintainResult result = new ApiMaintainResult();
		result.setSucceeded(true);
		try {
			this.apiInfoMaintainService.deleteApiVersionMaster(masterId, version);
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
	public ApiMaintainResult saveRootUrl(@RequestBody ApiVersionMasterInfo info) {
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
				this.apiInfoMaintainService.updateRootUrlName(info.getId(), chineseNameMap);
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
			this.apiInfoMaintainService.updateApi(info.getId(), info.getChineseName(), info.getDescription(),
					info.getChineseDescription());
		} catch (Exception e) {
			result.setMessage(e.getMessage());
			result.setSucceeded(false);
		}

		return result;
	}

	@RequestMapping(value = "/api/maintain/add/param/{apiId}/versionid/{versionId}", method = RequestMethod.POST)
	public ApiMaintainResult addParam(@PathVariable Integer apiId, @PathVariable Integer versionId,
			@RequestBody String type) {
		ApiMaintainResult result = new ApiMaintainResult();
		result.setSucceeded(true);
		try {
			this.apiInfoMaintainService.addRequestParam(apiId, type, versionId);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			result.setSucceeded(false);
			result.setMessage(e.getMessage());
			// e.printStackTrace();
		}
		return result;
	}

	@RequestMapping(value = "/api/maintain/classattributes", method = RequestMethod.POST)
	public ApiMaintainResult editClassAttribute(@RequestBody List<ClassAttributeInfo> attributes) {
		ApiMaintainResult result = new ApiMaintainResult();
		result.setSucceeded(true);
		result.setSucceeded(true);
		if (attributes != null && !attributes.isEmpty()) {
			attributes.forEach(attribute -> {
				try {
					this.apiInfoMaintainService.editClassAttributeById(attribute.getId(), attribute.getDescriptionZh(),
							attribute.getDescriptionEn(), attribute.getIsRequired());
				} catch (Exception e) {
					result.setSucceeded(false);
					result.setMessage(e.getMessage());

				}
			});
		} else {
			result.setSucceeded(false);
			result.setMessage("attributes infomation pass to back end is empty.");
		}

		return result;
	}

	@RequestMapping(value = "/api/maintain/classmaster/versionid/{id}", method = RequestMethod.GET)
	public Set<ClassMasterInfo> fetchAllClassMaster(@PathVariable Integer id) {
		Set<ClassMaster> masters = this.apiInfoProvideService.getAllClassMasterByVersionMasterId(id);
		Set<ClassMasterInfo> masterInfos = new HashSet<>();
		if (masters != null && !masters.isEmpty()) {
			masterInfos = masters.stream().map(master -> {
				ClassMasterInfo masterInfo = new ClassMasterInfo();
				Set<ClassAttribute> attributes = master.getAttributes();
				List<ClassAttributeInfo> attributeInfo = new ArrayList<>();
				if (attributes != null && !attributes.isEmpty()) {
					attributeInfo = attributes.stream().map(attribute -> {
						ClassAttributeInfo temp = new ClassAttributeInfo();
						temp.setId(attribute.getId());
						temp.setName(attribute.getName());
						temp.setType(attribute.getType());
						temp.setDescriptionEn(attribute.getDescriptionEn());
						temp.setDescriptionZh(attribute.getDescriptionZh());
						temp.setIsRequired(attribute.getIsRequired());
						return temp;
					}).collect(Collectors.toList());
				}
				masterInfo.setAttributes(attributeInfo);
				masterInfo.setId(master.getId());
				masterInfo.setName(master.getName());
				masterInfo.setType(master.getType());
				return masterInfo;
			}).collect(Collectors.toSet());
		}

		return masterInfos;
	}

	@RequestMapping(value = "/api/maintain/classmaster/add", method = RequestMethod.POST)
	public ApiMaintainResult addClassMaster(@RequestBody ClassMasterInfo info) {
		ApiMaintainResult result = new ApiMaintainResult();
		result.setSucceeded(true);
		if (info != null) {
			try {

				List<ClassAttributeInfo> attributeInfos = info.getAttributes();
				Set<ClassAttribute> attributes = new HashSet<>();
				if (attributeInfos != null && !attributeInfos.isEmpty()) {
					attributes = attributeInfos.stream().map(attr -> {
						ClassAttribute temp = new ClassAttribute();
						temp.setDescriptionEn(attr.getDescriptionEn());
						temp.setDescriptionZh(attr.getDescriptionZh());
						temp.setIsBaseType(true);
						temp.setIsRequired(attr.getIsRequired());
						temp.setName(attr.getName());
						temp.setType(attr.getType());
						return temp;
					}).collect(Collectors.toSet());
				}

				this.apiInfoMaintainService.addClassMaster(info.getName(), info.getType(), attributes,
						info.getVersionId());
			} catch (Exception e) {
				result.setSucceeded(false);
				result.setMessage(e.getMessage());
			}
		} else {
			result.setMessage("info is null");
			result.setSucceeded(false);
		}
		return result;
	}

	@RequestMapping(value = "/api/display", method = RequestMethod.GET)
	public List<ApiMasterInfo> getApiList() {
		Set<ApiMaster> masters = apiInfoProvideService.getAllApiMasters();
		List<ApiMasterInfo> infos = null;
		if (masters != null && !masters.isEmpty()) {
			infos = masters.stream().map(master -> {
				ApiMasterInfo info = new ApiMasterInfo();
				info.setName(master.getName());
				info.setChineseName(master.getChineseName());
				info.setId(master.getId());
				ApiVersionMaster latestVersionMaster = master.getLatestVersionMaster();
				if (latestVersionMaster != null) {
					info.setLatestVersion(latestVersionMaster.getVersion());
				}
				Set<ApiVersionMaster> versionMasters = master.getVersionMasters();
				if (versionMasters != null && !versionMasters.isEmpty()) {
					info.setVersionList(versionMasters.stream().map(versionMaster -> {
						return versionMaster.getVersion();
					}).collect(Collectors.toList()));
				}
				return info;
			}).collect(Collectors.toList());
		}
		return infos;
	}

	@RequestMapping(value = "/api/display/apiinfo/id/{id}", method = RequestMethod.GET)
	public ApiInfo getApiInformation(@PathVariable Integer id) {
		ApiInfo info = null;
		try {
			ApiInformation oriInfo = this.apiInfoProvideService.getApiInformationById(id);
			info = construcApiInformation(oriInfo);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return info;
	}

	@RequestMapping(value = "/api/display/{masterId}/{versionId}", method = RequestMethod.GET)
	public ApiVersionMasterInfo getApiVersionMasterInfo(@PathVariable Integer versionId,
			@PathVariable Integer masterId) {
		ApiVersionMaster master = this.apiInfoProvideService.getApiVersionMasterByVersionAndApiMasterId(versionId,
				masterId);
		return constructApiVersionMasterInfo(master);
	}

	@RequestMapping(value = "/api/display/requestparam/{apiId}", method = RequestMethod.GET)
	public List<ApiParamInfo> fetchRequestParamsByApiId(@PathVariable Integer apiId) {
		List<ApiParamInfo> infos = new ArrayList<>();
		Set<RequestParam> requestParams = this.apiInfoProvideService.getRequestParams(apiId);
		// Set<ReturnParam> returnParams =
		// this.apiInfoProvideService.getReturnParams(apiId);
		if (requestParams != null && !requestParams.isEmpty()) {
			requestParams.forEach(requestParam -> {
				infos.addAll(constructApiParamInfo(requestParam));
			});
		}
		return infos;
	}

	@RequestMapping(value = "/api/display/returnparam/{apiId}", method = RequestMethod.GET)
	public List<ApiParamInfo> fetchReturnParamsByApiId(@PathVariable Integer apiId) {
		List<ApiParamInfo> infos = new ArrayList<>();

		Set<ReturnParam> returnParams = this.apiInfoProvideService.getReturnParams(apiId);
		if (returnParams != null && !returnParams.isEmpty()) {
			returnParams.forEach(requestParam -> {
				infos.addAll(constructApiParamInfo(requestParam));
			});
		}
		return infos;
	}

	@RequestMapping(value = "/api/display/param/details/{type}/versionid/{id}", method = RequestMethod.GET)
	public List<ApiParamInfo> fetchRequestParamDetails(@PathVariable String type, @PathVariable Integer id) {
		List<ApiParamInfo> infos = new ArrayList<>();
		ClassMaster master = this.apiInfoProvideService.getClassMasterByTypeAndVersionMasterId(type, id);
		if (master != null) {
			Set<ClassAttribute> attributeSet = master.getAttributes();
			if (attributeSet != null && !attributeSet.isEmpty()) {
				infos.addAll(constructParamFromAttributes(attributeSet));
			}
		}
		return infos;
	}

	// auxiliary function
	private ApiVersionMasterInfo constructApiVersionMasterInfo(ApiVersionMaster master) {
		ApiVersionMasterInfo info = new ApiVersionMasterInfo();
		info.setVersion(master.getVersion());
		info.setId(master.getId());
		Set<ApiRootUrlMaster> rootUrlMasters = master.getApiRootUrlMasters();
		List<ApiRootUrlMasterInfo> rootUrlMasterInfoList = rootUrlMasters.stream().map(rootMaster -> {
			return constructApiRootUrlMasterInfo(rootMaster);
		}).collect(Collectors.toList());
		info.setRootUrlMasters(rootUrlMasterInfoList);
		return info;
	}

	private ApiRootUrlMasterInfo constructApiRootUrlMasterInfo(ApiRootUrlMaster master) {
		ApiRootUrlMasterInfo info = new ApiRootUrlMasterInfo();
		// info.setApiVersion(master.getApiVersionMaster().getVersion());
		info.setRootUrlName(master.getName());
		info.setChineseName(master.getChineseName());
		info.setId(master.getId());
		info.setApiList(master.getApiInformations().stream().map(api -> {
			ApiInfo apiInfo = new ApiInfo();
			apiInfo.setId(api.getId());
			apiInfo.setName(api.getName());
			apiInfo.setChineseName(api.getChineseName());
			return apiInfo;
		}).collect(Collectors.toList()));
		return info;

	}

	private List<ApiParamInfo> constructApiParamInfo(AbstractParam param) {
		List<ApiParamInfo> infoList = new ArrayList<>();
		if (param.getIsBaseType()) {
			ApiParamInfo info = new ApiParamInfo();
			info.setId(param.getId());
			info.setDescription(param.getDescription());
			info.setName(param.getName());
			info.setType(param.getType());
			info.setChineseDescription(param.getChineseDescription());
			info.setIsBaseType(param.getIsBaseType());
			info.setIndirect(false);
			if (param instanceof RequestParam) {
				info.setRequired(((RequestParam) param).getRequired());
			}
			infoList.add(info);
		} else if (param.getIsList() != null && param.getIsList() == true) {
			ApiParamInfo listInfo = new ApiParamInfo();
			listInfo.setId(param.getId());
			listInfo.setType(param.getClassMaster().getType());
			listInfo.setIsList(true);
			infoList.add(listInfo);
		} else {
			Set<ClassAttribute> attributes = param.getClassMaster().getAttributes();

			infoList.addAll(constructParamFromAttributes(attributes));
		}
		return infoList;
	}

	private List<ApiParamInfo> constructParamFromAttributes(Set<ClassAttribute> attributes) {
		List<ApiParamInfo> infoList = new ArrayList<>();
		List<ApiParamInfo> tempInfos = attributes.stream().map(attribute -> {
			return construcParamFromAttribute(attribute);
		}).collect(Collectors.toList());
		infoList.addAll(tempInfos);
		return infoList;
	}

	private ApiParamInfo construcParamFromAttribute(ClassAttribute attribute) {
		ApiParamInfo tempInfo = new ApiParamInfo();
		tempInfo.setId(attribute.getId());
		tempInfo.setIndirect(true);
		tempInfo.setType(attribute.getType());
		tempInfo.setDescription(attribute.getDescriptionEn());
		tempInfo.setChineseDescription(attribute.getDescriptionZh());
		tempInfo.setName(attribute.getName());
		tempInfo.setIsBaseType(attribute.getIsBaseType());
		tempInfo.setIsList(attribute.getIsList());
		tempInfo.setRequired(attribute.getIsRequired());
		return tempInfo;
	}

	private ApiInfo construcApiInformation(ApiInformation api) {
		ApiInfo info = new ApiInfo();
		info.setDescription(api.getDescription());
		info.setChineseDescription(api.getChineseDescription());
		info.setChineseName(api.getChineseName());
		info.setName(api.getName());
		info.setErrorCodes(api.getErrorCodes().stream().map(code -> {
			ErrorCodeInfo temp = new ErrorCodeInfo();
			temp.setCode(code.getCode());
			temp.setDescriptionEn(code.getDescriptionEn());
			temp.setDescriptionZh(code.getDescriptionZh());
			return temp;
		}).collect(Collectors.toList()));
		info.setUrl(api.getUrl());
		info.setId(api.getId());
		info.setMediaTypes(api.getApiMediaTypes().stream().map(mediaType -> {
			return mediaType.getMediaType();
		}).collect(Collectors.toList()));
		Set<RequestParam> requestParams = api.getRequestParams();
		Set<ReturnParam> returnParams = api.getReturnParams();
		List<ApiParamInfo> requestParamInfos = new ArrayList<>();
		List<ApiParamInfo> returnParamInfos = new ArrayList<>();
		if (requestParams != null && !requestParams.isEmpty()) {
			requestParams.forEach(param -> {
				requestParamInfos.addAll(constructApiParamInfo(param));

			});
		}
		if (returnParams != null && !returnParams.isEmpty()) {
			returnParams.forEach(param -> {
				returnParamInfos.addAll(constructApiParamInfo(param));
			});
		}
		info.setRequestParams(requestParamInfos);
		info.setReturnParams(returnParamInfos);
		info.setReuqestMethod(api.getRequestMethod());
		return info;
	}
}
