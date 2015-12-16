package edu.zju.bme.clever.management.service;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.ApiInformation;
import edu.zju.bme.clever.management.service.entity.ApiMaster;
import edu.zju.bme.clever.management.service.entity.ApiRootUrlMaster;
import edu.zju.bme.clever.management.service.entity.ApiVersionMaster;
import edu.zju.bme.clever.management.service.entity.ClassAttribute;
import edu.zju.bme.clever.management.service.entity.ClassMaster;
import edu.zju.bme.clever.management.service.entity.RequestParam;
import edu.zju.bme.clever.management.service.entity.ReturnParam;
import edu.zju.bme.clever.management.service.exception.ApiMaintainException;
import edu.zju.bme.clever.management.service.repository.ApiInformationRepository;
import edu.zju.bme.clever.management.service.repository.ApiMasterRepository;
import edu.zju.bme.clever.management.service.repository.ApiVersionMasterRepository;
import edu.zju.bme.clever.management.service.repository.ClassAttributeRepository;
import edu.zju.bme.clever.management.service.repository.ClassMasterRepository;

@Service
@Transactional
public class ApiInfoMaintainServiceImpl implements ApiInfoMaintainService {
	@Autowired
	ApiInformationRepository apiInforamtionRepo;

	@Autowired
	ApiVersionMasterRepository apiVersionMasterRepo;
	@Autowired
	ApiMasterRepository apiMasterRepo;

	@Autowired
	ClassMasterRepository classMasterrepo;

	@Autowired
	ClassAttributeRepository classAttributeRepo;

	@Override
	public void updateRootUrlName(Integer versionMasterId, Map<Integer, String> chineseNameMap) {
		ApiVersionMaster master = this.apiVersionMasterRepo.findByIdFetchAll(versionMasterId);
		Set<ApiRootUrlMaster> rootUrlMasters = master.getApiRootUrlMasters();
		if (rootUrlMasters != null && !rootUrlMasters.isEmpty()) {
			for (ApiRootUrlMaster rumaster : rootUrlMasters) {
				rumaster.setChineseName(chineseNameMap.get(rumaster.getId()));
			}
		}
		this.apiVersionMasterRepo.save(master);
	}

	@Override
	public void updateApi(Integer id, String chineseName, String description, String chineseDescription) {
		ApiInformation info = this.apiInforamtionRepo.findById(id);
		info.setChineseName(chineseName);
		info.setDescription(description);
		info.setChineseDescription(chineseDescription);
		this.apiInforamtionRepo.save(info);

	}

	@Override
	public void updateParams(Integer apiId, Map<Integer, String> requestParamDesc, Map<Integer, String> returnParamDesc,
			Map<Integer, String> requestParamChineseDesc, Map<Integer, String> returnParamChineseDesc,
			Map<Integer, Boolean> requiredMap) {
		ApiInformation info = this.apiInforamtionRepo.findByIdFetchAll(apiId);

		Set<RequestParam> requestParams = info.getRequestParams();
		Set<ReturnParam> returnParams = info.getReturnParams();
		if (requestParams != null && !requestParams.isEmpty()) {
			for (RequestParam param : requestParams) {
				String desc = requestParamDesc.get(param.getId());
				param.setRequired(requiredMap.get(param.getId()));
				param.setDescription(requestParamDesc.get(param.getId()));
				param.setChineseDescription(requestParamChineseDesc.get(param.getId()));
			}
		}
		if (returnParams != null && !returnParams.isEmpty()) {
			for (ReturnParam param : returnParams) {
				String desc = returnParamDesc.get(param.getId());
				param.setDescription(desc);
				param.setChineseDescription(returnParamChineseDesc.get(param.getId()));
			}
		}

		this.apiInforamtionRepo.save(info);

	}

	@Override
	public void updateParams(Integer id, String desc, String chineseDesc, Boolean required) {
	}

	@Override
	public void updateParams(Integer id, String desc, String chineseDesc) {
	}

	@Override
	public void deleteApiVersionMaster(Integer masterId, Integer version) throws Exception {
		ApiVersionMaster versionMaster = this.apiVersionMasterRepo.findByVersionAndApiMasterIdFetchAll(version,
				masterId);
		ApiMaster apiMaster = this.apiMasterRepo.findById(versionMaster.getApiMaster().getId());

		ApiVersionMaster lastVersionMaster = versionMaster.getLastVersionMaster();
		ApiVersionMaster nextVersionMaster = versionMaster.getNextVersionMaster();

		ApiVersionMaster latestVersionMaster = apiMaster.getLatestVersionMaster();
		// the master is not the latest version master
		if (!versionMaster.equals(latestVersionMaster)) {
			nextVersionMaster.setLastVersionMaster(lastVersionMaster);
			if (lastVersionMaster != null) {
				lastVersionMaster.setNextVersionMaster(nextVersionMaster);
			}
		} else {
			if (lastVersionMaster != null) {
				apiMaster.setLatestVersionMaster(lastVersionMaster);
				lastVersionMaster.setNextVersionMaster(null);
				versionMaster.setLastVersionMaster(null);
			} else {
				apiMaster.setLatestVersionMaster(null);
			}
		}
		apiMaster.getVersionMasters().remove(versionMaster);
		// this.apiMasterRepo.save(apiMaster);
		if (apiMaster.getVersionMasters().isEmpty()) {
			this.apiMasterRepo.delete(apiMaster);
		} else {
			this.apiMasterRepo.save(apiMaster);
		}
		// versionMaster.getApiRootUrlMasters();
	}

	@Override
	public void deleteApiMaster(Integer id) throws Exception {
		ApiMaster master = this.apiMasterRepo.findByIdFetchAll(id);
		this.apiMasterRepo.delete(master);
	}

	@Override
	public void addClassMaster(String name, String type, Set<ClassAttribute> attributes) throws Exception {

		// ClassMaster temp = this.classMasterrepo.findByType(type);
		// if (temp != null) {
		// throw new Exception("the class master :" + type + " already exist!");
		//
		// } else {
		// ClassMaster master = new ClassMaster();
		// master.setName(name);
		// master.setType(type);
		// master.setAttributes(attributes);
		// this.classMasterrepo.save(master);
		// }
		ClassMaster temp = this.classMasterrepo.findByType(type);
		if (temp != null) {
			this.apiInforamtionRepo.delete(temp.getId());
		}
		ClassMaster master = new ClassMaster();

		master.setName(name);
		master.setType(type);
		if (attributes != null && !attributes.isEmpty()) {
			attributes.forEach(attribute -> {
				attribute.setClassMaster(master);
			});
		}
		master.setAttributes(attributes);
		this.classMasterrepo.save(master);

	}

	@Override
	public void addRequestParam(Integer apiId, String masterType) throws Exception {
		ApiInformation info = this.apiInforamtionRepo.findById(apiId);
		ClassMaster master = this.classMasterrepo.findByType(masterType);
		if (master == null) {
			throw new ApiMaintainException("can not find class master with type :" + masterType);
		}
		if (info == null) {
			throw new ApiMaintainException("can not find api information with id : " + apiId);
		}

		RequestParam param = new RequestParam();
		param.setClassMaster(master);
		param.setIsBaseType(false);
		param.setApiInformation(info);
		// param.setApiInformation(info);
		Set<RequestParam> params = info.getRequestParams();
		if (params == null) {
			params = new HashSet<RequestParam>();
		} else {
			params.add(param);
		}

		this.apiInforamtionRepo.save(info);

	}

	@Override
	public void editClassAttributeById(Integer id, String descriptionZh, String descriptionEn, Boolean isRequired)
			throws Exception {
		ClassAttribute attr = this.classAttributeRepo.findOne(id);
		if (attr == null) {
			throw new ApiMaintainException("can not find class attribute with id:" + id);

		}
		attr.setDescriptionEn(descriptionEn);
		attr.setDescriptionZh(descriptionZh);
		attr.setIsRequired(isRequired);
		this.classAttributeRepo.save(attr);
	}
}
