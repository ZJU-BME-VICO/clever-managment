package edu.zju.bme.clever.management.service.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.ClassMaster;

public interface ClassMasterRepository extends JpaRepository<ClassMaster, Integer> {
	public ClassMaster findByNameAndVersionMasterId(String name, Integer id);

	public ClassMaster findByTypeAndVersionMasterId(String type, Integer id);

	@Query("select master from ClassMaster master left join fetch master.attributes where master.type = ?1 and master.versionMasterId = ?2")
	public ClassMaster findByTypeAndVersionMasterIdFetchAll(String type, Integer id);

	@Query("select master from ClassMaster master left join fetch master.attributes where master.versionMasterId = ?1")
	public Set<ClassMaster> findByVersionMasterIdFetchAll(Integer id);
}
