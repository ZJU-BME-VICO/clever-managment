package edu.zju.bme.clever.management.service;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.zju.bme.clever.management.service.entity.ApiInformation;
import edu.zju.bme.clever.management.service.entity.ApiMaster;
import edu.zju.bme.clever.management.service.entity.ApiVersionMaster;
import edu.zju.bme.clever.management.service.entity.ClassAttribute;
import edu.zju.bme.clever.management.service.entity.ClassMaster;
import edu.zju.bme.clever.management.service.entity.RequestParam;
import edu.zju.bme.clever.management.service.entity.ReturnParam;
import edu.zju.bme.clever.management.service.repository.ApiInformationRepository;
import edu.zju.bme.clever.management.service.repository.ApiMasterRepository;
import edu.zju.bme.clever.management.service.repository.ApiVersionMasterRepository;
import edu.zju.bme.clever.management.service.repository.ClassAttributeRepository;
import edu.zju.bme.clever.management.service.repository.ClassMasterRepository;
import edu.zju.bme.clever.management.service.repository.RequestParamRepository;
import edu.zju.bme.clever.management.service.repository.ReturnParamRepository;

@Service
@Transactional
public class ApiInfoProvideServiceImpl implements ApiInfoProvideService {

	@Autowired
	private ApiMasterRepository apiMasterRepo;
	@Autowired
	private ApiVersionMasterRepository apiVersionMasterRepo;
	@Autowired
	private ApiInformationRepository apiInformationRepo;

	@Autowired
	private RequestParamRepository requestParamRepo;

	@Autowired
	private ReturnParamRepository returnParamRepo;

	@Autowired
	private ClassAttributeRepository classAttributeRepo;
	@Autowired
	private ClassMasterRepository classMasterRepo;

	@Override
	public Set<ApiMaster> getAllApiMasters() {
		return this.apiMasterRepo.findAllFetchAll();
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
	public ApiVersionMaster getApiVersionMasterByVersionAndApiMasterId(Integer version, Integer apiMasterId) {
		return this.apiVersionMasterRepo.findByVersionAndApiMasterIdFetchAll(version, apiMasterId);
	}

	@Override
	public ApiInformation getApiInformationById(Integer id) {
		return this.apiInformationRepo.findByIdFetchAll(id);
	}

	@Override
	public Set<RequestParam> getRequestParams(Integer id) {
		return this.apiInformationRepo.findByIdFetchAll(id).getRequestParams();
	}

	@Override
	public Set<ReturnParam> getReturnParams(Integer id) {
		return this.apiInformationRepo.findByIdFetchAll(id).getReturnParams();
	}

	@Override
	public ReturnParam getReturnParamById(Integer id) {
		return this.returnParamRepo.findByIdFetchAll(id);
	}

	@Override
	public RequestParam getRequestParamById(Integer id) {
		return this.requestParamRepo.findByIdFetchAll(id);
	}

	@Override
	public ClassAttribute getClassAttributeById(Integer id) {
		return this.classAttributeRepo.findById(id);
	}

	@Override
	public ClassMaster getClassMasterByTypeAndVersionMasterId(String type, Integer id) {
		return this.classMasterRepo.findByTypeAndVersionMasterIdFetchAll(type, id);
	}

	@Override
	public Set<ClassMaster> getAllClassMasterByVersionMasterId(Integer id) {
		return this.classMasterRepo.findByVersionMasterIdFetchAll(id);
	}
}
