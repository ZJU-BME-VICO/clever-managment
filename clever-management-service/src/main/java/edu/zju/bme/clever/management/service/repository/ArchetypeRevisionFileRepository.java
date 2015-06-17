package edu.zju.bme.clever.management.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster1;
import edu.zju.bme.clever.management.service.entity.ArchetypeRevisionFile;

public interface ArchetypeRevisionFileRepository extends
		JpaRepository<ArchetypeRevisionFile, Integer> {
	public ArchetypeRevisionFile findByName(String name);
}
