package edu.zju.bme.clever.management.service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.TemplateMaster;

public interface TemplateMasterRepository extends
		JpaRepository<TemplateMaster, Integer> {

	public TemplateMaster findByName(String name);

	@Query("select master from TemplateMaster master where master.templateType = 'Storage'")
	public List<TemplateMaster> findAllStorageTemplateMasters();

}
