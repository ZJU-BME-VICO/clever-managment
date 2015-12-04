package edu.zju.bme.clever.management.service.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.ApiMaster;

public interface ApiMasterRepository extends JpaRepository<ApiMaster, Integer> {
	@Query("select master from ApiMaster master left join fetch master.versionMasters left join fetch master.latestVersionMaster")
	public Set<ApiMaster> findAllFetchAll();

	@Query("select master from ApiMaster master left join fetch master.latestVersionMaster left join fetch master.versionMasters versionmaster left join fetch versionmaster.apiRootUrlMasters urlmaster left join fetch urlmaster.apiInformations info left join fetch info.requestParams left join fetch info.returnParams left join fetch info.apiMediaTypes where master.id = ?1")
	public ApiMaster findByIdFetchAll(Integer id);
	@Query("select master from ApiMaster master left join fetch master.versionMasters left join fetch master.latestVersionMaster where master.name = ?1")
	public ApiMaster findByNameFetchAll(String name);
	
	
	public ApiMaster findByName(String name);

	public ApiMaster findById(Integer Id);
}
