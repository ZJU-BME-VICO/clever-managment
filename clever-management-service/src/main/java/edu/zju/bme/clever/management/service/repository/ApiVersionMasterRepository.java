package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.ApiVersionMaster;

public interface ApiVersionMasterRepository extends JpaRepository<ApiVersionMaster, Integer>{
	
    // public List<ApiVersionMaster> findAllFetchAll();
     
     @Query("select master from ApiVersionMaster master left join fetch master.apiRootUrlMasterList where master.id = ?1")
     public ApiVersionMaster findByIdFetchAll(Integer Id);
}
