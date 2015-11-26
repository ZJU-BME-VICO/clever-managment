package edu.zju.bme.clever.management.service;

import java.util.List;
import java.util.Map;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.ApiInformation;
import edu.zju.bme.clever.management.service.entity.RequestParam;
import edu.zju.bme.clever.management.service.entity.ReturnParam;
import edu.zju.bme.clever.management.service.exception.ResourceExportException;
import edu.zju.bme.clever.management.service.repository.ApiInformationRepository;

@Service
@Transactional
public class ApiInfoMaintainServiceImpl implements ApiInfoMaintainService {
	@Autowired
	ApiInformationRepository apiInforamtionRepo;

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
}
