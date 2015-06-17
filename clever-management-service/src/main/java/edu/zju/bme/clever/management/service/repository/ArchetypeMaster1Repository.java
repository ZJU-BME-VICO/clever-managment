package edu.zju.bme.clever.management.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;

public interface ArchetypeMaster1Repository extends
		JpaRepository<ArchetypeMaster, Integer> {
	public ArchetypeMaster findByName(String name);
}
