package edu.zju.bme.clever.management.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.zju.bme.clever.management.service.entity.Application;
import edu.zju.bme.clever.management.service.entity.ArchetypeMaster1;
import edu.zju.bme.clever.management.service.entity.TemplateMaster1;

public interface TemplateMaster1Repository extends
		JpaRepository<TemplateMaster1, Integer> {
	public TemplateMaster1 findByName(String name);
}
