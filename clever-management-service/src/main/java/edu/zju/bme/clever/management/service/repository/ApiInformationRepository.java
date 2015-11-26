package edu.zju.bme.clever.management.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.ApiInformation;
import edu.zju.bme.clever.management.service.entity.ApiMaster;

public interface ApiInformationRepository extends
		JpaRepository<ApiInformation, Integer> {
	@Query("select info from ApiInformation info left join fetch info.requestParams left join fetch info.returnParams left join fetch info.apiMediaTypes where info.id = ?1")
	public ApiInformation findByIdFetchAll(Integer id);
}
