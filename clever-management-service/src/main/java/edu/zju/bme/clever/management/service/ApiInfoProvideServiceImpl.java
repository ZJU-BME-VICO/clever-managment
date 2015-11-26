package edu.zju.bme.clever.management.service;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.ApiInformation;
import edu.zju.bme.clever.management.service.entity.ApiMaster;
import edu.zju.bme.clever.management.service.entity.ApiVersionMaster;
import edu.zju.bme.clever.management.service.repository.ApiInformationRepository;
import edu.zju.bme.clever.management.service.repository.ApiMasterRepository;
import edu.zju.bme.clever.management.service.repository.ApiVersionMasterRepository;

@Service
@Transactional
public class ApiInfoProvideServiceImpl implements ApiInfoProvideService {

	@Autowired
	private ApiMasterRepository apiMasterRepo;
	@Autowired
	private ApiVersionMasterRepository apiVersionMasterRepo;
	@Autowired
	private ApiInformationRepository apiInformationRepo;

	@Override
	public Set<ApiMaster> getAllApiMasters() {
		return this.apiMasterRepo
				.findAllFetchAll();
	}

	@Override
	public ApiMaster getApiMasterByName(String name) {
		return this.apiMasterRepo.findByName(name);
	}

	@Override
	public ApiMaster getApiMasterById(Integer Id) {
		return this.apiMasterRepo.findById(Id);
	}

	@Override
	public List<ApiVersionMaster> getAllApiVersionMasters() {
		return apiVersionMasterRepo.findAll();
	}

	@Override
	public ApiVersionMaster getApiVersionMasterById(Integer Id) {
		return this.apiVersionMasterRepo.findByIdFetchAll(Id);
	}

	@Override
	public ApiVersionMaster getApiVersionMasterByVersionAndApiMasterId(
			Integer version, Integer apiMasterId) {
		return this.apiVersionMasterRepo.findByVersionAndApiMasterIdFetchAll(
				version, apiMasterId);
	}

	@Override
	public ApiInformation getApiInformationById(Integer id) {
		return this.apiInformationRepo.findByIdFetchAll(id);
	}

}
