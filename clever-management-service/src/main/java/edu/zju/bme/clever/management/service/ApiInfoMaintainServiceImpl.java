package edu.zju.bme.clever.management.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.ApiInformation;
import edu.zju.bme.clever.management.service.entity.RequestParam;
import edu.zju.bme.clever.management.service.entity.ReturnParam;
import edu.zju.bme.clever.management.service.exception.ResourceExportException;
import edu.zju.bme.clever.management.service.repository.ApiInfomationRepository;

@Service
@Transactional
public class ApiInfoMaintainServiceImpl implements ApiInfoMaintainService {
	@Autowired
	ApiInfomationRepository apiInforamtionRepo;

	@Override
	public void editApiDesc(Integer id, String description,
			Map<Integer, String> requstParamDesc,
			Map<Integer, String> returnParamDesc)
			throws ResourceExportException {
		ApiInformation info = this.apiInforamtionRepo.findById(id);
		if (info == null) {
			throw new ResourceExportException(
					"can not find the api information with id:" + id);
		} else {
			info.setApiDescription(description);
		}
		List<RequestParam> requestParams = info.getRequestParamList();
		List<ReturnParam> returnParams = info.getReturnParamList();
		if (requestParams != null && !requestParams.isEmpty()) {
			for (RequestParam param : requestParams) {
				String desc = requstParamDesc.get(param.getId());
				if (desc == null) {
					throw new ResourceExportException(
							"can not get the description with param id :"
									+ param.getId());
				}
				param.setDescription(desc);
			}
		}
		if (returnParams != null && !returnParams.isEmpty()) {
			for (ReturnParam param : returnParams) {
				String desc = returnParamDesc.get(param.getId());
				if (desc == null) {
					throw new ResourceExportException(
							"can not get the description with param id :"
									+ param.getId());
				}
				param.setDescription(desc);
			}
		}
	}

	@Override
	public void editParamDesc(Integer id, String description) {

	}
}
