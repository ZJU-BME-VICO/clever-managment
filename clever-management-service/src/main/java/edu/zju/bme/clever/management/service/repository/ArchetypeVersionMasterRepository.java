package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;
import edu.zju.bme.clever.management.service.entity.ArchetypeVersionMaster;
import edu.zju.bme.clever.management.service.entity.LifecycleState;

public interface ArchetypeVersionMasterRepository extends
		JpaRepository<ArchetypeVersionMaster, Integer> {
	public ArchetypeVersionMaster findByName(String name);
	
	public List<ArchetypeVersionMaster> findByLatestRevisionFileLifecycleState(LifecycleState published);
}
