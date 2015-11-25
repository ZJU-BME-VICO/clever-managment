package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.ApiMaster;

public interface ApiMasterRepository extends 
         JpaRepository<ApiMaster, Integer> {
	@Query("select master from ApiMaster master left join fetch master.versionMasterList left join fetch master.latestVersionMaster")
	public List<ApiMaster> findAllFetchVersionMasterListAndLatestVersionMaster();

	public ApiMaster findByName(String name);

	public ApiMaster findById(Integer Id);
}
