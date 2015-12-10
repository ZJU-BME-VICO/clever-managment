package edu.zju.bme.clever.management.service.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.ClassMaster;

public interface ClassMasterRepository extends
		JpaRepository<ClassMaster, Integer> {
	public ClassMaster findByName(String name);

	public ClassMaster findByType(String type);

	@Query("select master from ClassMaster master left join fetch master.attributes where master.type = ?1")
	public ClassMaster findByTypeFetchAll(String type);
	
	@Query("select master from ClassMaster master left join fetch master.attributes")
	public Set<ClassMaster> findAllFetchAll();
}
