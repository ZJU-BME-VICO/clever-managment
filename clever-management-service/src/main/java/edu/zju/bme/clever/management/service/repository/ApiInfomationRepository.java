package edu.zju.bme.clever.management.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.service.entity.ApiInformation;
import edu.zju.bme.clever.management.service.entity.ApiMaster;

public interface ApiInfomationRepository extends JpaRepository<ApiMaster, Integer> {
    public  ApiInformation findById(Integer id); 
}
