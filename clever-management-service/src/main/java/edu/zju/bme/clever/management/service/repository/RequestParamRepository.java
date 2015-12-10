package edu.zju.bme.clever.management.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.RequestParam;
import edu.zju.bme.clever.management.service.entity.ReturnParam;

public interface RequestParamRepository extends
		JpaRepository<RequestParam, Integer> {
	@Query("select param from RequestParam param left join fetch param.classMaster master left join fetch master.attributes where param.id = ?1")
	public RequestParam findByIdFetchAll(Integer id);
}
