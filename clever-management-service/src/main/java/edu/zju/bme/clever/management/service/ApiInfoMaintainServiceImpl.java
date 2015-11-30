package edu.zju.bme.clever.management.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.ApiInformation;
import edu.zju.bme.clever.management.service.entity.ApiMaster;
import edu.zju.bme.clever.management.service.entity.ApiVersionMaster;
import edu.zju.bme.clever.management.service.entity.RequestParam;
import edu.zju.bme.clever.management.service.entity.ReturnParam;
import edu.zju.bme.clever.management.service.exception.ResourceExportException;
import edu.zju.bme.clever.management.service.repository.ApiInformationRepository;
import edu.zju.bme.clever.management.service.repository.ApiMasterRepository;
import edu.zju.bme.clever.management.service.repository.ApiVersionMasterRepository;

@Service
@Transactional
public class ApiInfoMaintainServiceImpl implements ApiInfoMaintainService {
	@Autowired
	ApiInformationRepository apiInforamtionRepo;

	@Autowired
	ApiVersionMasterRepository apiVersionMasterRepo;
	@Autowired
	ApiMasterRepository apiMasterRepo;

	@Override
	public void editApiDesc(Integer id, String description,
			Map<Integer, String> requstParamDesc,
			Map<Integer, String> returnParamDesc)
			throws ResourceExportException {
		ApiInformation info = this.apiInforamtionRepo.findByIdFetchAll(id);
		if (info == null) {
			throw new ResourceExportException(
					"can not find the api information with id:" + id);
		} else {
			info.setApiDescription(description);
		}
		Set<RequestParam> requestParams = info.getRequestParams();
		Set<ReturnParam> returnParams = info.getReturnParams();
		if (requestParams != null && !requestParams.isEmpty()) {
			for (RequestParam param : requestParams) {
				String desc = requstParamDesc.get(param.getId());
				param.setDescription(desc);
			}
		}
		if (returnParams != null && !returnParams.isEmpty()) {
			for (ReturnParam param : returnParams) {
				String desc = returnParamDesc.get(param.getId());
				param.setDescription(desc);
			}
		}
	}

	@Override
	public void editParamDesc(Integer id, String description) {

	}

	@Override
	public void deleteApiVersionMaster(Integer id) throws Exception {
		ApiVersionMaster versionMaster = this.apiVersionMasterRepo.findByIdFetchAll(id);
		ApiMaster apiMaster = this.apiMasterRepo.findById(versionMaster
				.getApiMaster().getId());

		ApiVersionMaster lastVersionMaster = versionMaster
				.getLastVersionMaster();
		ApiVersionMaster nextVersionMaster = versionMaster
				.getNextVersionMaster();

		ApiVersionMaster latestVersionMaster = apiMaster
				.getLatestVersionMaster();
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
		//versionMaster.getApiRootUrlMasters();
	}

	@Override
	public void deleteApiMaster(Integer id) throws Exception {
		ApiMaster master = this.apiMasterRepo.findByIdFetchAll(id);
		this.apiMasterRepo.delete(master);
	}
}
