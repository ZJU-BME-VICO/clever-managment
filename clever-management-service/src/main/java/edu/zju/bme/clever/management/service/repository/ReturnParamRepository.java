package edu.zju.bme.clever.management.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.RequestParam;
import edu.zju.bme.clever.management.service.entity.ReturnParam;

public interface ReturnParamRepository extends
		JpaRepository<ReturnParam, Integer> {
	@Query("select param from ReturnParam param left join fetch param.classMaster master left join fetch master.attributes where param.id = ?1")
	public ReturnParam findByIdFetchAll(Integer id);

	// @Query("select param from ReturnParm param left join fetch param.classMaster master left join fetch master.attributes where param.id = ?1")
	// public ReturnParam findByNameFetchAll(Integer id);
}
