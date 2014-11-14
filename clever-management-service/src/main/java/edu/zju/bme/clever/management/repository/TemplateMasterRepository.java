package edu.zju.bme.clever.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.entity.TemplateMaster;

public interface TemplateMasterRepository extends
		JpaRepository<TemplateMaster, Integer> {

}
