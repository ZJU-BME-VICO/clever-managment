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
	@Query("select master from ArchetypeVersionMaster master left join fetch master.latestRevisionFile where master.latestRevisionFileLifecycleState = ?1")
	public List<ArchetypeVersionMaster> findByLatestRevisionFileLifecycleState(LifecycleState published);
}
