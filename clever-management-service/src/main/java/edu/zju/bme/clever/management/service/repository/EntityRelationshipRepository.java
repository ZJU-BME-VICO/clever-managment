package edu.zju.bme.clever.management.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.entity.DeployRecord;
import edu.zju.bme.clever.management.service.entity.EntityRelationship;

public interface EntityRelationshipRepository extends JpaRepository<EntityRelationship, Integer> {
	
}
