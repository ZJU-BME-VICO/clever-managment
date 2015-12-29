package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.service.entity.ApiRootUrlMaster;

public interface ApiRootUrlMasterRepository extends
		JpaRepository<ApiRootUrlMaster, Integer> {
	List<ApiRootUrlMaster> findByApiVersionMasterId(Integer id);
}
