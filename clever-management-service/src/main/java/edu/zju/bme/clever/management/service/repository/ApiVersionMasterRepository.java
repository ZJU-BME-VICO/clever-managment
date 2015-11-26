package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.ApiVersionMaster;

public interface ApiVersionMasterRepository extends JpaRepository<ApiVersionMaster, Integer>{
	
    // public List<ApiVersionMaster> findAllFetchAll();
     
     @Query("select master from ApiVersionMaster master left join fetch master.apiRootUrlMasters where master.id = ?1")
     public ApiVersionMaster findByIdFetchAll(Integer Id);
    //info left join fetch info.requestParamList left join fetch info.returnParamList left join fetch info.apiMediaTypeSet
     @Query("select versionmaster from ApiVersionMaster versionmaster left join fetch versionmaster.apiRootUrlMasters master left join fetch master.apiInformations info left join fetch info.requestParams left join fetch info.returnParams left join fetch info.apiMediaTypes  where versionmaster.version = ?1 and versionmaster.apiMaster.id = ?2")
    //  @Query("select versionmaster from ApiVersionMaster versionmaster. left join fetch versionmaster.apiRootUrlMasterList master left join fetch master.apiInformations  where versionmaster.version = ?1 and versionmaster.apiMaster.id = ?2")
     public ApiVersionMaster findByVersionAndApiMasterIdFetchAll(Integer version, Integer apiMasterId);
}
