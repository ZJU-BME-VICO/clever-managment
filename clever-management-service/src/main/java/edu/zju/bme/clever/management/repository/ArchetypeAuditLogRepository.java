package edu.zju.bme.clever.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.entity.ArchetypeAuditLog;

public interface ArchetypeAuditLogRepository extends
		JpaRepository<ArchetypeAuditLog, Integer> {

}
