package edu.zju.bme.clever.management.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.service.entity.EntityClass;

public interface EntityClassRepository extends
		JpaRepository<EntityClass, Integer> {
	
}
