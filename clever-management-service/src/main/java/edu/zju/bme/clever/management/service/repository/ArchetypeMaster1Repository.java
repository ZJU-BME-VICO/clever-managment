package edu.zju.bme.clever.management.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster1;

public interface ArchetypeMaster1Repository extends
		JpaRepository<ArchetypeMaster1, Integer> {
	public ArchetypeMaster1 findByName(String name);
}
