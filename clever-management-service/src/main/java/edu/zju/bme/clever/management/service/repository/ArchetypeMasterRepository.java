package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster;

public interface ArchetypeMasterRepository extends
		JpaRepository<ArchetypeMaster, Integer> {
	public ArchetypeMaster findByName(String name);
	@Query("from ArchetypeMaster master left join fetch master.latestVersionMaster")
	public List<ArchetypeMaster> findAllFetchLatestVersionMaster();
}
