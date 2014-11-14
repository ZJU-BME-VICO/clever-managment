package edu.zju.bme.clever.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.zju.bme.clever.management.entity.TemplateFile;

public interface TemplateFileRepository extends
		JpaRepository<TemplateFile, Integer> {

}
