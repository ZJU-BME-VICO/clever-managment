package edu.zju.bme.clever.management.service.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.entity.DeployRecord;
import edu.zju.bme.clever.management.service.entity.DeployedStorageTemplate;

public interface DeployedStorageTemplateRepository extends
		JpaRepository<DeployedStorageTemplate, Integer> {
  public Set<DeployedStorageTemplate> findByOriginalTemplateId(Integer id); 
}
