package edu.zju.bme.clever.management.service.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.entity.DeployRecord;
import edu.zju.bme.clever.management.service.entity.DeployedStorageTemplate;

public interface DeployedStorageTemplateRepository extends
		JpaRepository<DeployedStorageTemplate, Integer> {
  public Set<DeployedStorageTemplate> findByOriginalTemplateId(Integer id);
  
  public List<DeployedStorageTemplate> findByNameLikeAndSerialVersionLessThan(String name, Integer serialVersion);
  public DeployedStorageTemplate findByName(String name);
  
  @Query(value="select TOP 1 t2.serial_version from t_deployed_storage_template t2 where t2.name like :name% and t2.serial_version = (select max(t1.serial_version) from t_deployed_storage_template t1 where t1.name like :name%) order by id desc", nativeQuery=true)
  public Integer findMaxSerialVersionByNameLikeOrderByIdDesc(@Param("name") String name);
}
