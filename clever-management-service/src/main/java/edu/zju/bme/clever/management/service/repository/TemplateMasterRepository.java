package edu.zju.bme.clever.management.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.service.entity.TemplateMaster;

public interface TemplateMasterRepository extends
		JpaRepository<TemplateMaster, Integer> {

	public TemplateMaster findByName(String name);

}
