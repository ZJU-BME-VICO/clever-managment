package edu.zju.bme.clever.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.entity.ArchetypeMaster;

public interface ArchetypeMasterRepository extends
		JpaRepository<ArchetypeMaster, Integer> {

}
