package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.entity.DeployRecord;

public interface DeployRecordRepository extends
		JpaRepository<DeployRecord, Integer> {

	public DeployRecord findFirstBySucceededOrderByIdDesc(boolean succeeded);

	@Query("from DeployRecord record left join fetch record.deployer order by record.id")
	public List<DeployRecord> findAllFetchDeployer();
}
