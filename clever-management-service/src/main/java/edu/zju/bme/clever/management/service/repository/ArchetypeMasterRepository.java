package edu.zju.bme.clever.management.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;

public interface ArchetypeMasterRepository extends
		JpaRepository<ArchetypeMaster, Integer> {

	public ArchetypeMaster findByName(String name);
	
	
}
